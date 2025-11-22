import { NextRequest, NextResponse } from 'next/server';
import { supabase, validateSupabaseConfig } from '@/lib/supabase';

export async function GET(req: NextRequest) {
    // Validate Supabase configuration at runtime
    validateSupabaseConfig();

    // Get session ID from cookie
    const sessionId = req.cookies.get('session_id')?.value;

    if (!sessionId) {
        return NextResponse.json(
            { error: 'No session - please connect your calendar' },
            { status: 401 }
        );
    }

    // Get connection from Supabase database (replaces in-memory Map)
    const { data: session, error: dbError } = await supabase
        .from('oauth_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();

    if (dbError || !session || !session.connection_id) {
        console.log('❌ No session found in database for:', sessionId);
        return NextResponse.json(
            { error: 'No connection found - please connect your Google Calendar' },
            { status: 401 }
        );
    }

    console.log(`✅ Fetching real calendar events for: ${session.connection_id}`);

    try {
        const proxyUrl = 'https://backend.composio.dev/api/v3/tools/execute/proxy';
        const now = new Date();

        // Fetch UPCOMING events (from now onwards)
        const upcomingResp = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.COMPOSIO_API_KEY || '',
            },
            body: JSON.stringify({
                connected_account_id: session.connection_id,
                endpoint: '/calendars/primary/events',
                method: 'GET',
                parameters: [
                    { name: 'maxResults', value: '10', type: 'query' },
                    { name: 'orderBy', value: 'startTime', type: 'query' },
                    { name: 'singleEvents', value: 'true', type: 'query' },
                    { name: 'timeMin', value: now.toISOString(), type: 'query' }
                ]
            }),
        });

        // Fetch PAST events (before now, but only from last 6 months)
        // Why 6 months? To avoid getting ancient recurring events (birthdays from 2006!)
        // and only get RECENT past events like trains, interviews, etc.
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(now.getMonth() - 6);

        const pastResp = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.COMPOSIO_API_KEY || '',
            },
            body: JSON.stringify({
                connected_account_id: session.connection_id,
                endpoint: '/calendars/primary/events',
                method: 'GET',
                parameters: [
                    { name: 'maxResults', value: '50', type: 'query' }, // Fetch more to ensure we get real events
                    { name: 'orderBy', value: 'startTime', type: 'query' },
                    { name: 'singleEvents', value: 'true', type: 'query' },
                    { name: 'timeMin', value: sixMonthsAgo.toISOString(), type: 'query' }, // Last 6 months
                    { name: 'timeMax', value: now.toISOString(), type: 'query' } // Up to now
                ]
            }),
        });

        if (!upcomingResp.ok || !pastResp.ok) {
            const upcomingError = !upcomingResp.ok ? await upcomingResp.text() : 'OK';
            const pastError = !pastResp.ok ? await pastResp.text() : 'OK';
            console.error('❌ Composio proxy error details:');
            console.error(`Upcoming Status: ${upcomingResp.status}, Error: ${upcomingError}`);
            console.error(`Past Status: ${pastResp.status}, Error: ${pastError}`);
            console.error(`API Key present: ${!!process.env.COMPOSIO_API_KEY}`);

            return NextResponse.json(
                { error: `Failed to fetch events. Upcoming: ${upcomingResp.status}, Past: ${pastResp.status}` },
                { status: 500 }
            );
        }

        const upcomingData = await upcomingResp.json();
        const pastData = await pastResp.json();

        const upcomingEvents = upcomingData.data?.items || [];
        const pastEvents = pastData.data?.items || [];

        console.log(`📊 Found ${upcomingEvents.length} upcoming, ${pastEvents.length} past events`);

        // Transform UPCOMING events
        // Include ALL events (birthdays, meetings, everything)
        const upcoming = upcomingEvents
            .map((e: any) => ({
                id: e.id,
                title: e.summary || 'No Title',
                start: e.start?.dateTime || e.start?.date,
                end: e.end?.dateTime || e.end?.date,
                attendees: (e.attendees || []).map((a: any) => ({
                    displayName: a.displayName || a.email?.split('@')[0],
                    email: a.email,
                })),
                description: e.description || '',
                location: e.location || '',
                meetingLink: e.hangoutLink || '',
            }))
            .slice(0, 5); // Take first 5 (soonest upcoming)

        // Transform PAST events
        // Google Calendar returns them in ascending order (oldest first)
        // So we need to REVERSE the entire array FIRST, then take 5
        // DO NOT filter birthdays here - let them show if there are no other events
        const past = pastEvents
            .reverse() // Reverse to get NEWEST first (most recent past events)
            .slice(0, 5) // Take first 5 (most recent past)
            .map((e: any) => ({
                id: e.id,
                title: e.summary || 'No Title',
                start: e.start?.dateTime || e.start?.date,
                end: e.end?.dateTime || e.end?.date,
                attendees: (e.attendees || []).map((a: any) => ({
                    displayName: a.displayName || a.email?.split('@')[0],
                    email: a.email,
                })),
                description: e.description || '',
                location: e.location || '',
                meetingLink: e.hangoutLink || '',
            }));

        console.log(`✅ Returning ${upcoming.length} upcoming, ${past.length} past events`);

        return NextResponse.json({ upcoming, past });
    } catch (error) {
        console.error('Failed to fetch events:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

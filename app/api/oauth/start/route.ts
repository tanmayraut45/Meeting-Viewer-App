import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import { supabase, validateSupabaseConfig } from '@/lib/supabase';

export async function GET() {
    try {
        // Validate Supabase configuration at runtime
        validateSupabaseConfig();

        const authConfigId = process.env.COMPOSIO_AUTH_CONFIG_ID;
        const apiKey = process.env.COMPOSIO_API_KEY;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        if (!authConfigId || !apiKey) {
            return NextResponse.json({ error: 'Missing configuration' }, { status: 500 });
        }

        // Generate unique user ID and session ID
        const userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const sessionId = Math.random().toString(36).substring(2);

        console.log('🔐 Creating auth link for user:', userId);

        // Create Auth Link via Composio API
        const response = await fetch('https://backend.composio.dev/api/v3/connected_accounts/link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey,
            },
            body: JSON.stringify({
                auth_config_id: authConfigId,
                user_id: userId,
                redirect_url: `${baseUrl}/api/oauth/callback`,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Composio API error:', errorText);
            return NextResponse.json({ error: 'Failed to create auth link' }, { status: 500 });
        }

        const data = await response.json();
        console.log('✅ Auth link created:', data);

        const connectionId = data.connected_account_id;

        // Save session to Supabase database (replaces in-memory storage)
        const { error: dbError } = await supabase
            .from('oauth_sessions')
            .insert({
                session_id: sessionId,
                user_id: userId,
                connection_id: connectionId,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
            });

        if (dbError) {
            console.error('❌ Supabase insert error:', dbError);
            return NextResponse.json({ error: 'Failed to save session' }, { status: 500 });
        }

        console.log('✅ Stored session in Supabase:', sessionId, 'with connectionId:', connectionId);

        // Set session cookie
        const cookie = serialize('session_id', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        console.log('Redirecting to:', data.redirect_url);

        return new NextResponse(null, {
            status: 307,
            headers: {
                Location: data.redirect_url,
                'Set-Cookie': cookie,
            },
        });
    } catch (error) {
        console.error('OAuth start error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

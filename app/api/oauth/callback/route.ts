import { NextRequest, NextResponse } from 'next/server';

// Access user sessions
const userSessions = (global as any).__userSessions || new Map();
(global as any).__userSessions = userSessions;

// In-memory connection storage
const connectionsMap = (global as any).__connectionsMap || new Map();
(global as any).__connectionsMap = connectionsMap;

export async function GET(req: NextRequest) {
    try {
        // Get the user ID from cookie
        const userId = req.cookies.get('composio_user_id')?.value;

        if (!userId) {
            console.log('❌ No user ID in callback');
            return NextResponse.redirect(new URL('/?error=no_user_id', req.url));
        }

        console.log('=== OAuth Callback ===');
        console.log('User ID:', userId);

        // Fetch the user's connections from Composio
        const connectionsResponse = await fetch(
            `https://backend.composio.dev/api/v3/connections?user_id=${userId}`,
            {
                headers: {
                    'X-API-Key': process.env.COMPOSIO_API_KEY || '',
                },
            }
        );

        if (!connectionsResponse.ok) {
            const errorText = await connectionsResponse.text();
            console.error('Failed to fetch connections:', errorText);
            return NextResponse.redirect(new URL('/?error=fetch_failed', req.url));
        }

        const connectionsData = await connectionsResponse.json();
        console.log('📦 Connections data:', JSON.stringify(connectionsData, null, 2));

        // Get the most recent connection
        const connections = connectionsData.items || connectionsData.connections || [];

        if (connections.length === 0) {
            console.log('⚠️ No connections found for user');
            return NextResponse.redirect(new URL('/?error=no_connection', req.url));
        }

        // Sort by creation time and get the latest
        const latestConnection = connections.sort((a: any, b: any) => {
            return new Date(b.createdAt || b.created_at || 0).getTime() -
                new Date(a.createdAt || a.created_at || 0).getTime();
        })[0];

        const connectionId = latestConnection.id;
        console.log('✅ Connection ID:', connectionId);

        // Generate session ID
        const sessionId = Math.random().toString(36).slice(2);

        // Store connection
        connectionsMap.set(sessionId, {
            connectionId,
            userId,
            createdAt: Date.now(),
        });

        console.log(`✅ Stored session ${sessionId} with connectionId: ${connectionId}`);

        // Clean up user session
        userSessions.delete(userId);

        // Redirect back to home with session cookie
        const response = NextResponse.redirect(new URL('/', req.url));

        response.cookies.set('session_id', sessionId, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours
            sameSite: 'lax',
        });

        // Clear the temporary user ID cookie
        response.cookies.set('composio_user_id', '', {
            path: '/',
            maxAge: 0,
        });

        return response;
    } catch (error) {
        console.error('❌ Callback error:', error);
        return NextResponse.redirect(new URL('/?error=callback_failed', req.url));
    }
}

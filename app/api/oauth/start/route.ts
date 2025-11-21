import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory connection storage (shared with events API)
const connectionsMap = (global as any).__connectionsMap || new Map();
(global as any).__connectionsMap = connectionsMap;

export async function GET(req: NextRequest) {
    try {
        // Generate a unique user ID for this session
        const userId = `user_${crypto.randomBytes(8).toString('hex')}`;

        // Build callback URL
        const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/callback`;

        // Create auth link session via Composio API
        const authLinkResponse = await fetch('https://backend.composio.dev/api/v3/connected_accounts/link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.COMPOSIO_API_KEY || '',
            },
            body: JSON.stringify({
                auth_config_id: process.env.COMPOSIO_AUTH_CONFIG_ID,
                user_id: userId,
                redirect_url: callbackUrl, // Try snake_case (Composio might expect this)
            }),
        });

        if (!authLinkResponse.ok) {
            const errorText = await authLinkResponse.text();
            console.error('Composio auth link creation failed:', errorText);
            return NextResponse.json(
                { error: 'Failed to create auth link', details: errorText },
                { status: authLinkResponse.status }
            );
        }

        const authLinkData = await authLinkResponse.json();
        console.log('✅ Auth link created:', authLinkData);

        // Extract the connection ID that Composio already created
        const connectionId = authLinkData.connected_account_id || authLinkData.connectionId;

        if (!connectionId) {
            console.error('❌ No connection ID in response');
            return NextResponse.json(
                { error: 'No connection ID returned' },
                { status: 500 }
            );
        }

        // Generate session ID and store connection immediately
        const sessionId = Math.random().toString(36).slice(2);
        connectionsMap.set(sessionId, {
            created: Date.now(),
            connectionId: connectionId,
            userId: userId,
        });

        console.log(`✅ Stored session ${sessionId} with connectionId: ${connectionId}`);

        // Redirect to Composio's hosted OAuth page
        const redirectUrl = authLinkData.redirect_url;
        console.log('Redirecting to:', redirectUrl);

        // Set session cookie so events API can use it immediately
        const response = NextResponse.redirect(redirectUrl);
        response.cookies.set('session_id', sessionId, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours
            sameSite: 'lax',
        });

        return response;
    } catch (error) {
        console.error('Error creating auth link:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}

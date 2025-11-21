import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        console.log('=== OAuth Callback ===');
        console.log('Query params:', Object.fromEntries(req.nextUrl.searchParams));

        // Composio Auth Links redirect back here after OAuth completion
        // The session was already created in /api/oauth/start
        // Just redirect to homepage - the session cookie is already set

        console.log('✅ OAuth completed, redirecting to homepage');

        return NextResponse.redirect(new URL('/', req.url));
    } catch (error) {
        console.error('❌ Callback error:', error);
        return NextResponse.redirect(new URL('/?error=callback_failed', req.url));
    }
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        console.log('=== OAuth Callback ===');
        console.log('Query params:', Object.fromEntries(req.nextUrl.searchParams));

        // Return HTML that closes the popup and notifies the parent
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Authentication Successful</title>
                <style>
                    body { font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 40px; color: #333; }
                    .success { color: #10B981; font-weight: 600; font-size: 1.2rem; }
                </style>
            </head>
            <body>
                <div class="success">Authentication successful!</div>
                <p>You can close this window now.</p>
                <script>
                    try {
                        window.opener.postMessage({ type: 'OAUTH_SUCCESS' }, window.location.origin);
                        setTimeout(() => window.close(), 1000);
                    } catch (e) {
                        console.error('Failed to notify parent:', e);
                    }
                </script>
            </body>
            </html>
        `;

        return new NextResponse(html, {
            headers: { 'Content-Type': 'text/html' },
        });
    } catch (error) {
        console.error('❌ Callback error:', error);
        return NextResponse.redirect(new URL('/?error=callback_failed', req.url));
    }
}

export const config = {
    matcher: ['/dashboard'],
};

export default function middleware(request) {
    const password = process.env.DASHBOARD_PASSWORD;

    if (!password) {
        return new Response('Server misconfigured — DASHBOARD_PASSWORD env var not set', {
            status: 500,
        });
    }

    const authHeader = request.headers.get('authorization');

    if (authHeader) {
        const encoded = authHeader.split(' ')[1];
        if (encoded) {
            const [user, pwd] = atob(encoded).split(':');
            if (pwd === password) {
                return undefined; // pass through to static file
            }
        }
    }

    return new Response('🔒 Dostęp wymaga autoryzacji', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Agent Dashboard"',
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
}

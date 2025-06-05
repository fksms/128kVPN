import { NextResponse, NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

// next-intlのmiddlewareを事前に作成
const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest): NextResponse {
    const pathname = request.nextUrl.pathname;

    // `/api/all-wg-interfaces`の場合はAPI_KEYをチェック
    if (pathname === '/api/all-wg-interfaces') {
        const apiKey = request.headers.get('x-api-key');

        if (apiKey !== process.env.SECRET_API_KEY) {
            // APIキーが無効な場合は404ページにリダイレクト
            return NextResponse.rewrite(new URL('/not-found', request.url));
        } else {
            // APIキーが有効な場合は、次の処理を続行
            return NextResponse.next();
        }
    }

    /*
    if (pathname === '/login' || pathname === '/login/') {
        return NextResponse.next();
    }
    */

    // `next-intl`のmiddlewareを適用
    return intlMiddleware(request);
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: [
        // `all-wg-interfaces`制御用
        '/api/all-wg-interfaces',
        // 特定のパスはMiddlewareの適用から除外する
        '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    ],
};

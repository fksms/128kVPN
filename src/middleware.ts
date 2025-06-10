import { NextResponse, NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

// next-intlのmiddlewareを事前に作成
const intlMiddleware = createMiddleware(routing);

// 言語一覧
const locales = routing.locales;

// 未ログイン時に見せないページ
const protectedPaths = ['/dashboard', '/settings'];

// ログイン時に見せないページ
const nonProtectedPaths = ['/login', '/register', '/forgot-password', '/verify-email'];

export function middleware(request: NextRequest): NextResponse {
    // パスを取得
    const pathname = request.nextUrl.pathname;

    // -------------------- 未ログイン時・ログイン時のリダイレクト用 --------------------
    // トークンの取得
    const token = request.cookies.get('__session')?.value;

    // localeを除いたパスを取得
    const pathnameWithoutLocale = (() => {
        const segments = pathname.split('/');
        if ((locales as readonly string[]).includes(segments[1])) {
            return '/' + segments.slice(2).join('/');
        }
        return pathname;
    })();

    // パスがプロテクト対象か判定
    const isProtected = protectedPaths.some((path) => pathnameWithoutLocale.startsWith(path));

    // パスがプロテクト非対象か判定
    const isNotProtected = nonProtectedPaths.some((path) => pathnameWithoutLocale.startsWith(path));

    // プロテクト対象かつトークン無しの場合は`/login`にリダイレクト
    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    // プロテクト非対象かつトークン有りの場合は`/dashboard`にリダイレクト
    if (isNotProtected && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // -------------------- 未ログイン時・ログイン時のリダイレクト用 --------------------

    // -------------------- API保護用 --------------------
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
    // -------------------- API保護用 --------------------

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

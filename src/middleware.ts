import { NextResponse, NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { verifySessionCookie } from '@/lib/verifySessionCookie';
import { ErrorCodes } from '@/lib/errorCodes';

// next-intlのmiddlewareを事前に作成
const intlMiddleware = createMiddleware(routing);

// 言語一覧
const locales = routing.locales;

// 未ログイン時に見せないページ
const protectedPaths = ['/dashboard', '/settings'];

// ログイン時に見せないページ
const publicPaths = ['/login', '/register', '/forgot-password', '/verify-email'];

export async function middleware(req: NextRequest): Promise<NextResponse> {
    // パスを取得
    const pathname = req.nextUrl.pathname;

    // -------------------- API保護用 --------------------
    // パスが`/api/admin`から始まる場合はアクセスキーをチェック
    if (pathname.startsWith('/api/admin')) {
        const apiKey = req.headers.get('x-api-key');

        if (apiKey !== process.env.SECRET_ACCESS_KEY) {
            // アクセスキーが無効な場合は404ページに書き換え（リダイレクト先のURLは見せない）
            return NextResponse.rewrite(new URL('/not-found', req.url));
        } else {
            // アクセスキーが有効な場合は、次の処理を続行
            return NextResponse.next();
        }
    }

    // パスが`/api/wg-interfaces`から始まる場合はセッションクッキーを検証
    if (pathname.startsWith('/api/wg-interfaces')) {
        // セッションクッキーの取得
        const sessionCookie = req.cookies.get('__session')?.value;

        try {
            // セッションクッキーの検証
            const payload = await verifySessionCookie(sessionCookie!);
            //console.log('SessionCookie Payload:', payload);
            // セッションクッキーが有効な場合は、次の処理を続行
            return NextResponse.next();
        } catch (error) {
            // セッションクッキーが無効な場合は、401エラーを返す
            return NextResponse.json(
                {
                    success: false,
                    code: ErrorCodes.UNAUTHORIZED,
                },
                { status: 401 }
            );
        }
    }
    // -------------------- API保護用 --------------------

    // -------------------- 未ログイン時・ログイン時のリダイレクト用 --------------------
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
    const isPublic = publicPaths.some((path) => pathnameWithoutLocale.startsWith(path));

    // セッションクッキーの取得
    const sessionCookie = req.cookies.get('__session')?.value;

    try {
        // セッションクッキーの検証
        const payload = await verifySessionCookie(sessionCookie!);
        //console.log('SessionCookie Payload:', payload);
        // セッションクッキーが有効な場合、プロテクト非対象へのアクセスは`/dashboard`にリダイレクト
        if (isPublic) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    } catch (error) {
        //console.error('SessionCookie Error:', error);
        // セッションクッキーが無効な場合、プロテクト対象へのアクセスは`/login`にリダイレクト
        if (isProtected) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }
    // -------------------- 未ログイン時・ログイン時のリダイレクト用 --------------------

    // `next-intl`のmiddlewareを適用
    return intlMiddleware(req);
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: [
        // API保護用
        '/api/admin',
        '/api/wg-interfaces',
        // 特定のパスはMiddlewareの適用から除外する
        '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    ],
};

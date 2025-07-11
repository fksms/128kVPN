import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/server/firebase-admin';
import { ErrorCodes } from '@/lib/errorCodes';
import { noCacheResponse } from '@/lib/server/customResponse';

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { token } = await req.json();

    if (!token) {
        return noCacheResponse(
            {
                success: false,
                code: ErrorCodes.INVALID_REQUEST,
            },
            { status: 400 }
        );
    }

    try {
        // IDトークンを検証しデコード
        const decoded = await adminAuth.verifyIdToken(token);
        // メール認証が完了していない場合
        if (!decoded.email_verified) {
            return noCacheResponse(
                {
                    success: false,
                    error: ErrorCodes.UNVERIFIED_EMAIL,
                },
                { status: 403 }
            );
        }
        // セッションの有効期限（1日 = 86400秒）
        const expiresIn = 86400;
        // セッションクッキーを作成
        const sessionCookie = await adminAuth.createSessionCookie(token, { expiresIn: expiresIn * 1000 });
        // レスポンス生成（200 OK）
        const response = noCacheResponse({ success: true }, { status: 200 });
        // セッションクッキーを設定
        response.cookies.set('__session', sessionCookie, {
            httpOnly: true,
            secure: true,
            path: '/',
            maxAge: expiresIn,
            sameSite: 'strict',
        });
        // ユーザー情報を取得
        const userInfo = {
            email: decoded.email || '',
            providerId: decoded.firebase.sign_in_provider || '',
            photoURL: decoded.picture || '',
        };
        // ユーザー情報をクッキーに設定
        // （注意：ペイロードは自動的に`encodeURIComponent`でエンコードされる）
        response.cookies.set('user_info', JSON.stringify(userInfo), {
            httpOnly: false, // クライアントサイドでアクセス可能
            secure: true,
            path: '/',
            maxAge: expiresIn,
            sameSite: 'strict',
        });
        return response;
    } catch {
        return noCacheResponse(
            {
                success: false,
                code: ErrorCodes.CREATE_SESSION_FAILED,
            },
            { status: 500 }
        );
    }
}

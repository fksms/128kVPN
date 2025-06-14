import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { ErrorCodes } from '@/lib/errorCodes';

export async function POST(req: NextRequest) {
    const { token } = await req.json();

    if (!token) {
        return NextResponse.json(
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
            return NextResponse.json(
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
        const response = NextResponse.json({ success: true }, { status: 200 });
        // セッションクッキーを設定
        response.cookies.set('__session', sessionCookie, {
            httpOnly: true,
            secure: true,
            path: '/',
            maxAge: expiresIn,
            sameSite: 'strict',
        });
        return response;
    } catch {
        return NextResponse.json(
            {
                success: false,
                code: ErrorCodes.CREATE_SESSION_FAILED,
            },
            { status: 400 }
        );
    }
}

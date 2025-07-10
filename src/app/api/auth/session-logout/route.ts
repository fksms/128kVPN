import { NextRequest, NextResponse } from 'next/server';

export function POST(req: NextRequest) {
    // レスポンス生成（200 OK）
    const response = NextResponse.json({ success: true }, { status: 200 });
    // セッションクッキーを削除（maxAge: 0）
    response.cookies.set('__session', '', {
        httpOnly: true,
        secure: true,
        path: '/',
        maxAge: 0, // 即時無効化
        sameSite: 'strict',
    });
    // user_infoクッキーを削除（maxAge: 0）
    response.cookies.set('user_info', '', {
        httpOnly: false, // クライアントサイドでアクセス可能
        secure: true,
        path: '/',
        maxAge: 0, // 即時無効化
        sameSite: 'strict',
    });
    return response;
}

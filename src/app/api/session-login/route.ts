import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ErrorCodes } from '@/lib/errorCodes';

export async function POST(req: NextRequest) {
    const { token } = await req.json();

    if (!token) {
        return NextResponse.json(
            {
                success: false,
                code: ErrorCodes.TOKEN_MISSING,
            },
            { status: 400 }
        );
    }

    try {
        const cookieStore = await cookies();
        cookieStore.set('__session', token, {
            httpOnly: true,
            secure: true,
            path: '/',
            maxAge: 60 * 60 * 24, // 1日
            sameSite: 'strict',
        });
        return NextResponse.json(
            {
                success: true,
                data: '',
            },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            {
                success: false,
                code: ErrorCodes.COOKIE_SET_FAILED,
            },
            { status: 400 }
        );
    }
}

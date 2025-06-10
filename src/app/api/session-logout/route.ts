import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ErrorCodes } from '@/lib/errorCodes';

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('__session');
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
                code: ErrorCodes.COOKIE_DELETE_FAILED,
            },
            { status: 400 }
        );
    }
}

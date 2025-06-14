import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/sqlite';
import { ErrorCodes } from '@/lib/errorCodes';

// GETリクエスト
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        // プレースホルダを使ってSQLを準備
        const stmt = db.prepare('SELECT * FROM wg_interfaces');

        // プレースホルダに値をバインド
        const wgInterfaces = stmt.all();

        return NextResponse.json(
            {
                success: true,
                data: wgInterfaces,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                code: ErrorCodes.SQL_ERROR,
            },
            { status: 500 }
        );
    }
}

// POSTリクエスト
export async function POST(req: NextRequest): Promise<NextResponse> {
    const { action, checkedAt, data } = await req.json();

    if (!action || !checkedAt || !data) {
        return NextResponse.json(
            {
                success: false,
                code: ErrorCodes.INVALID_REQUEST,
            },
            { status: 400 }
        );
    }

    if (action === 'delete') {
        try {
            // プレースホルダを使ってSQLを準備
            const stmt = db.prepare('DELETE FROM wg_interfaces WHERE expires_at < ?');

            // プレースホルダに値をバインド
            stmt.run(checkedAt);

            return NextResponse.json({ success: true }, { status: 200 });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                {
                    success: false,
                    code: ErrorCodes.SQL_ERROR,
                },
                { status: 500 }
            );
        }
    } else {
        return NextResponse.json(
            {
                success: false,
                code: ErrorCodes.INVALID_REQUEST,
            },
            { status: 400 }
        );
    }
}

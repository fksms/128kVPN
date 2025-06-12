import { NextResponse, NextRequest } from 'next/server';
import { expirationDurationMinutes } from '@/env';
import db from '@/lib/sqlite';
import { ErrorCodes } from '@/lib/errorCodes';

// GETリクエスト
export async function GET(req: NextRequest): Promise<NextResponse> {
    const userid = 'testuser';

    try {
        // プレースホルダを使ってSQLを準備
        const stmt = db.prepare('SELECT * FROM wg_interfaces WHERE userid = ?');

        // プレースホルダに値をバインド
        const wgInterfaces = stmt.all(userid);

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
    const userid = 'testuser';
    const ip_address = 'test_ip';

    const { action, name } = await req.json();

    if (!action || !name) {
        return NextResponse.json(
            {
                success: false,
                code: ErrorCodes.INVALID_REQUEST,
            },
            { status: 400 }
        );
    }

    if (action === 'create') {
        // 失効日時を計算（UNIXタイムスタンプ）
        const expires_at = Date.now() + expirationDurationMinutes * 60 * 1000;

        try {
            // プレースホルダを使ってSQLを準備
            const stmt = db.prepare('INSERT INTO wg_interfaces (userid, name, ip_address, expires_at) VALUES (?, ?, ?, ?)');

            // プレースホルダに値をバインド
            stmt.run(userid, name, ip_address, expires_at);

            return NextResponse.json(
                { success: true },
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
    } else if (action === 'delete') {
        try {
            // プレースホルダを使ってSQLを準備
            const stmt = db.prepare('DELETE FROM wg_interfaces WHERE userid = ? AND name = ?');

            // プレースホルダに値をバインド
            stmt.run(userid, name);

            return NextResponse.json(
                { success: true },
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

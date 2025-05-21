import { NextResponse, NextRequest } from 'next/server';
import db from '@/database/db';
import { ErrorCodes } from '@/lib/errorCodes';

// GETリクエスト
export async function GET(req: NextRequest) {
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

import { NextResponse, NextRequest } from 'next/server';
import { db, type WgInterface } from '@/lib/sqlite';
import { ErrorCodes } from '@/lib/errorCodes';
import { removePeers } from '@/lib/wireguard';

// POSTリクエスト
export async function POST(req: NextRequest): Promise<NextResponse> {
    const { action } = await req.json();

    if (!action) {
        return NextResponse.json(
            {
                success: false,
                code: ErrorCodes.INVALID_REQUEST,
            },
            { status: 400 }
        );
    }

    // 全てのインターフェースを取得
    if (action === 'GET_ALL_INTERFACES') {
        try {
            // プレースホルダを使ってSQLを準備
            const stmt = db.prepare('SELECT * FROM wg_interfaces');
            // プレースホルダに値をバインド
            const wgInterfaces = stmt.all() as WgInterface[];
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
    // 失効済みのインターフェースを削除
    else if (action === 'DELETE_EXPIRED_INTERFACES') {
        // 現在時刻を取得
        const now = Date.now();

        // -------------------- 全てのインターフェースの取得 --------------------
        let wgInterfaces: WgInterface[];
        try {
            // プレースホルダを使ってSQLを準備
            const stmt = db.prepare('SELECT * FROM wg_interfaces');
            // プレースホルダに値をバインド
            wgInterfaces = stmt.all() as WgInterface[];
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
        // -------------------- 全てのインターフェースの取得 --------------------

        // -------------------- 期限切れのインターフェース（IPアドレス）を抽出 --------------------
        const expiredWGInterfaces = wgInterfaces.filter((item) => item.expire_at < now);
        const expiredIPAddresses = expiredWGInterfaces.map((item) => item.ip_address);
        // -------------------- 期限切れのインターフェース（IPアドレス）を抽出 --------------------

        // -------------------- WireGuardのコンフィグ更新 --------------------
        try {
            // WireGuardのピアを追加
            await removePeers(expiredIPAddresses);
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                {
                    success: false,
                    code: ErrorCodes.DELETE_INTERFACE_FAILED,
                },
                { status: 500 }
            );
        }
        // -------------------- WireGuardのコンフィグ更新 --------------------

        // -------------------- データベースの更新 --------------------
        try {
            // プレースホルダを使ってSQLを準備
            const stmt = db.prepare('DELETE FROM wg_interfaces WHERE expire_at < ?');
            // プレースホルダに値をバインド
            stmt.run(now);
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
        // -------------------- データベースの更新 --------------------

        // -------------------- 200 OK --------------------
        return NextResponse.json(
            {
                success: true,
                data: {
                    // 使用中のIPアドレス数
                    usedIpCount: wgInterfaces.length - expiredIPAddresses.length,
                    // 解放されたIPアドレス数
                    releasedIpCount: expiredIPAddresses.length,
                },
            },
            { status: 200 }
        );
        // -------------------- 200 OK --------------------
    }
    // 不正なアクション
    else {
        return NextResponse.json(
            {
                success: false,
                code: ErrorCodes.INVALID_REQUEST,
            },
            { status: 400 }
        );
    }
}

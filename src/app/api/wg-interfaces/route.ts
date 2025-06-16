import { NextResponse, NextRequest } from 'next/server';
import { expirationDurationMinutes } from '@/env';
import { db } from '@/lib/sqlite';
import { adminAuth } from '@/lib/firebase-admin';
import { ErrorCodes } from '@/lib/errorCodes';
import { wgInterfaceCIDR } from '@/env';

type WgInterface = {
    id: number;
    userid: string;
    name: string;
    ip_address: string;
    expire_at: number;
};

// GETリクエスト
export async function GET(req: NextRequest): Promise<NextResponse> {
    // ユーザーID
    let userId = null;

    // セッションクッキーの取得
    const sessionCookie = req.cookies.get('__session')?.value;

    try {
        // セッションクッキーの検証
        const decodedIdToken = await adminAuth.verifySessionCookie(sessionCookie!, true);
        userId = decodedIdToken.uid;
        if (!decodedIdToken.email_verified) {
            throw new Error('Email is not verified');
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                code: ErrorCodes.UNAUTHORIZED,
            },
            { status: 401 }
        );
    }

    try {
        // プレースホルダを使ってSQLを準備
        const stmt = db.prepare('SELECT * FROM wg_interfaces WHERE userid = ?');
        const wgInterfaces = stmt.all(userId) as WgInterface[];
        return NextResponse.json(
            {
                success: true,
                data: wgInterfaces.map((wgInterface) => ({
                    name: wgInterface.name,
                    ipAddress: wgInterface.ip_address,
                    expireAt: wgInterface.expire_at,
                })),
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
    // ユーザーID
    let userId = null;

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

    // セッションクッキーの取得
    const sessionCookie = req.cookies.get('__session')?.value;

    try {
        // セッションクッキーの検証
        const decodedIdToken = await adminAuth.verifySessionCookie(sessionCookie!, true);
        userId = decodedIdToken.uid;
        if (!decodedIdToken.email_verified) {
            throw new Error('Email is not verified');
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                code: ErrorCodes.UNAUTHORIZED,
            },
            { status: 401 }
        );
    }

    if (action === 'create') {
        // 失効日時を計算（UNIXタイムスタンプ）
        const expireAt = Date.now() + expirationDurationMinutes * 60 * 1000;

        let availableIP = null;

        try {
            // プレースホルダを使ってSQLを準備
            const stmt = db.prepare('SELECT ip_address FROM wg_interfaces');

            // 現在使用中のIPアドレスを取得
            const assignedIPs = stmt.all() as { ip_address: string }[];

            // 利用可能なIPアドレスを取得
            availableIP = getRandomAvailableIpFromCidr(
                wgInterfaceCIDR,
                assignedIPs.map((item) => item.ip_address)
            );
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                {
                    success: false,
                    code: ErrorCodes.NO_AVAILABLE_IP,
                },
                { status: 503 }
            );
        }

        try {
            // プレースホルダを使ってSQLを準備
            const stmt = db.prepare('INSERT INTO wg_interfaces (userid, name, ip_address, expire_at) VALUES (?, ?, ?, ?)');

            // プレースホルダに値をバインド
            stmt.run(userId, name, availableIP, expireAt);

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
    } else if (action === 'delete') {
        try {
            // プレースホルダを使ってSQLを準備
            const stmt = db.prepare('DELETE FROM wg_interfaces WHERE userid = ? AND name = ?');

            // プレースホルダに値をバインド
            stmt.run(userId, name);

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

// CIDR形式のIPアドレス範囲から、払い出し可能なIPアドレスをランダムに取得する関数
function getRandomAvailableIpFromCidr(cidr: string, assignedIPs: string[]): string {
    const [ip, prefixLengthStr] = cidr.split('/');
    const prefixLength = parseInt(prefixLengthStr, 10);

    // IPアドレス文字列 → 数値化
    const ipToNumber = (ip: string): number => {
        return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
    };

    // 数値 → IPアドレス文字列
    const numberToIP = (num: number): string => {
        return [(num >>> 24) & 0xff, (num >>> 16) & 0xff, (num >>> 8) & 0xff, num & 0xff].join('.');
    };

    const baseIpNum = ipToNumber(ip);
    const hostBits = 32 - prefixLength;
    const numHosts = 2 ** hostBits;

    if (numHosts <= 2) {
        // /31や/32の場合、利用可能なIPなし
        throw new Error('No available IP addresses in this CIDR range');
    }

    const networkAddress = baseIpNum;
    const broadcastAddress = baseIpNum + numHosts - 1;

    // 払い出し済みIPを数値化してSet化
    const assignedIpNums = new Set(assignedIPs.map(ipToNumber));

    // 利用可能なIPの候補リストを作成
    const availableIPs: number[] = [];
    for (let i = networkAddress + 1; i < broadcastAddress; i++) {
        if (!assignedIpNums.has(i)) {
            availableIPs.push(i);
        }
    }

    if (availableIPs.length === 0) {
        throw new Error('No available IP addresses in this CIDR range');
    }

    // 利用可能な候補からランダムに選択
    const randomIpNum = availableIPs[Math.floor(Math.random() * availableIPs.length)];

    return numberToIP(randomIpNum);
}

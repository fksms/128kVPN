// データベース監視用のコードです
// Next.jsとは異なり、Node.jsのコードとして実行されます

import { ErrorCodes } from './lib/errorCodes';
import { WGInterface } from './lib/type';

// 全てのインターフェースを取得
async function getAllWGInterfaces(): Promise<void> {
    try {
        const res = await fetch(`${process.env.BASE_URL}:${process.env.PORT}/api/all-wg-interfaces`, {
            method: 'GET',
            headers: {
                'x-api-key': process.env.SECRET_API_KEY || '',
            },
        });
        const data = await res.json();

        // 以下、エラーハンドリング
        if (data.success) {
            console.log('monitor: GET_SUCCESS');
            const result = extractExpiredWGInterfaces(data.data);
            const _ = await deleteExpiredWGInterfaces(result.now, result.expiredWGInterfaces);
            return;
        } else {
            console.error(`monitor: ${data.code}`);
            return;
        }
    } catch (error) {
        console.error(`monitor: ${ErrorCodes.FAILED_TO_FETCH}`);
        return;
    }
}

// 期限切れのインターフェースを抽出
function extractExpiredWGInterfaces(wgInterfaces: WGInterface[]): { now: number; expiredWGInterfaces: WGInterface[] } {
    // 現在時刻を取得
    const now = Date.now();
    // 期限切れのインターフェースを抽出
    const expiredWGInterfaces = wgInterfaces.filter((item) => item.expires_at < now);

    return { now, expiredWGInterfaces };
}

// 期限切れのインターフェースを削除
async function deleteExpiredWGInterfaces(time: number, wgInterfaces: WGInterface[]): Promise<void> {
    try {
        const res = await fetch(`${process.env.BASE_URL}:${process.env.PORT}/api/all-wg-interfaces`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.SECRET_API_KEY || '',
            },
            body: JSON.stringify({
                action: 'delete',
                checkedAt: time,
                data: wgInterfaces,
            }),
        });
        const data = await res.json();

        // 以下、エラーハンドリング
        if (data.success) {
            console.log('monitor: POST_SUCCESS');
            return;
        } else {
            console.error(`monitor: ${data.code}`);
            return;
        }
    } catch (error) {
        console.error(`monitor: ${ErrorCodes.FAILED_TO_FETCH}`);
        return;
    }
}

// 1分ごとに実行（60000ミリ秒）
setInterval(getAllWGInterfaces, 60 * 1000);

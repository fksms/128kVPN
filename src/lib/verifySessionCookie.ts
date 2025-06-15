import { jwtVerify, importX509, JWTPayload } from 'jose';

// Firebase公開鍵の取得（キャッシュ対応）
async function getPublicKeys(): Promise<Record<string, string>> {
    let cachedKeys = null;
    let cacheExpiresAt = 0;

    const now = Date.now();

    if (cachedKeys && cacheExpiresAt > now) {
        // 有効期限内ならキャッシュを返す
        return cachedKeys;
    }

    // Firebase公開鍵リストを取得
    const res = await fetch('https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys');
    const publicKeys = await res.json();

    // Cache-Controlヘッダーからmax-age取得
    const cacheControl = res.headers.get('cache-control');
    let maxAge = 0;
    if (cacheControl) {
        const match = cacheControl.match(/max-age=(\d+)/);
        if (match) {
            maxAge = parseInt(match[1], 10) * 1000; // msに変換
        }
    }

    cachedKeys = publicKeys;
    cacheExpiresAt = now + maxAge;

    return cachedKeys;
}

// セッションCookieの検証
// 参考：https://firebase.google.com/docs/auth/admin/manage-cookies?hl=ja#verify_session_cookies_using_a_third-party_jwt_library
export async function verifySessionCookie(sessionCookie: string): Promise<JWTPayload> {
    const publicKeys = await getPublicKeys();

    // JWTのヘッダー部分をデコードして kid を取り出す
    const [encodedHeader] = sessionCookie.split('.');
    const header = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString());
    const kid = header.kid;

    // kidに対応する公開鍵を取得
    const publicKeyPem = publicKeys[kid];
    if (!publicKeyPem) {
        throw new Error(`No certificate found for kid: ${kid}`);
    }

    // PEM形式の公開鍵をCryptoKeyに変換
    const publicKey = await importX509(publicKeyPem, 'RS256');

    // JWTの署名とクレームの検証
    // 参考：https://zenn.dev/link/comments/8bfcdafbf344da
    const { payload } = await jwtVerify(sessionCookie, publicKey, {
        algorithms: ['RS256'],
        issuer: `https://session.firebase.google.com/${process.env.NEXT_PUBLIC_FIREBASE_CONFIG_PROJECT_ID || ''}`,
        audience: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_PROJECT_ID || '',
        maxTokenAge: 3600, // 1時間
        requiredClaims: ['exp', 'sub', 'auth_time', 'email_verified'],
    });

    if (!payload.sub) {
        throw new Error('sub is empty');
    }

    if (Number(payload.auth_time) >= Date.now()) {
        throw new Error('auth_time is in the future');
    }

    if (!payload.email_verified) {
        throw new Error('Email is not verified');
    }

    return payload;
}

import path from 'path';
import { execSync } from 'child_process';
import { access, appendFile, writeFile } from 'fs/promises';
import { wgInterfaceCIDR } from '@/env';

// WireGuardのアドレス（クライアントが接続するアドレス）
const wgHost = process.env.WG_HOST;
// WireGuardのポート（クライアントが接続するポート）
const wgPort = process.env.WG_PORT || '51820';
// サーバー・クライアント間のMTU値
const wgMtu = process.env.WG_MTU || '1420';
// DNSの設定（クライアントが使用するDNSサーバー）
const wgDefaultDNS = process.env.WG_DEFAULT_DNS || '8.8.8.8';
// KeepAliveの設定
const wgPersistentKeepalive = process.env.WG_PERSISTENT_KEEPALIVE || '25';

// WireGuardインターフェース名（クライアント側のインターフェース）
const wgInterfaceName = process.env.WG_INTERFACE_NAME || 'wg0';
// 外部接続用のインターフェース名（サーバー側のインターフェース）
const publicInterfaceName = process.env.PUBLIC_INTERFACE_NAME || 'eth0';

// WireGuardインターフェース起動前に実行するスクリプト
const wgPreUp = process.env.WG_PRE_UP || '';
// WireGuardインターフェース起動後に実行するスクリプト
const wgPostUp = process.env.WG_POST_UP || '';
// WireGuardインターフェース停止前に実行するスクリプト
const wgPreDown = process.env.WG_PRE_DOWN || '';
// WireGuardインターフェース停止後に実行するスクリプト
const wgPostDown = process.env.WG_POST_DOWN || '';

// キーペアをキャッシュ
let __privateKey: string | null = null;
let __publicKey: string | null = null;

// サーバー用キーペアの作成
async function generateKeyPairForServer(): Promise<{ privateKey: string; publicKey: string }> {
    if (__privateKey && __publicKey) {
        return { privateKey: __privateKey, publicKey: __publicKey };
    }

    const stdoutPrivateKey = await execSync('wg genkey');
    const stdoutPublicKey = await execSync(`echo ${stdoutPrivateKey.toString().trim()} | wg pubkey`);

    __privateKey = stdoutPrivateKey.toString().trim();
    __publicKey = stdoutPublicKey.toString().trim();
    return { privateKey: __privateKey, publicKey: __publicKey };
}

// クライアント用キーペアの作成
async function generateKeyPairForClient(): Promise<{ privateKey: string; publicKey: string }> {
    const stdoutPrivateKey = await execSync('wg genkey');
    const stdoutPublicKey = await execSync(`echo ${stdoutPrivateKey.toString().trim()} | wg pubkey`);

    const privateKey = stdoutPrivateKey.toString().trim();
    const publicKey = stdoutPublicKey.toString().trim();
    return { privateKey, publicKey };
}

export const addPeer = async (ipAddress: string): Promise<string> => {
    // サーバー用キーペア
    let serverPrivateKey: string;
    let serverPublicKey: string;
    // クライアント用キーペア
    let clientPrivateKey: string;
    let clientPublicKey: string;

    try {
        // サーバー用キーペアの取得
        ({ privateKey: serverPrivateKey, publicKey: serverPublicKey } = await generateKeyPairForServer());
    } catch (error) {
        throw new Error('Failed to generate server key pair');
    }

    // WireGuardのコンフィグファイルのパスを指定
    const serverConfigPath = path.join(process.cwd(), `${wgInterfaceName}.conf`);

    try {
        // 存在チェック
        await access(serverConfigPath);
    } catch {
        // 存在しなければ作成して初期化
        const initialConfig = `[Interface]
Address = ${wgInterfaceCIDR}
ListenPort = ${wgPort}
PrivateKey = ${serverPrivateKey}
MTU = ${wgMtu}
PostUp = ${wgPostUp}
PostDown = ${wgPostDown}
PreUp = ${wgPreUp}
PreDown = ${wgPreDown}`;

        try {
            // 初期設定を書き込み
            await writeFile(serverConfigPath, initialConfig);
        } catch (error) {
            throw new Error('Failed to write initial WireGuard config file');
        }
    }

    try {
        // クライアント用キーペアの取得
        ({ privateKey: clientPrivateKey, publicKey: clientPublicKey } = await generateKeyPairForClient());
    } catch (error) {
        throw new Error('Failed to generate client key pair');
    }

    const peerConfig = `\n\n[Peer]
PublicKey = ${clientPublicKey}
AllowedIPs = ${ipAddress}/32
PersistentKeepalive = ${wgPersistentKeepalive}`;

    try {
        // 既存の設定ファイルにピアの設定を追加
        await appendFile(serverConfigPath, peerConfig);
    } catch (error) {
        throw new Error('Failed to append peer configuration to WireGuard config file');
    }

    const clientConfig = `[Interface]
Address = ${ipAddress}/32
PrivateKey = ${clientPrivateKey}
DNS = ${wgDefaultDNS}

[Peer]
PublicKey = ${serverPublicKey}
Endpoint = ${wgHost}:${wgPort}
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = ${wgPersistentKeepalive}`;

    return clientConfig;
};

export const removePeer = async (): Promise<void> => {};

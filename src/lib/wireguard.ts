import path from 'path';
import { execSync } from 'child_process';
import { access, appendFile, writeFile, readFile } from 'fs/promises';

// WireGuardのアドレス（クライアントが接続するアドレス）
const wgHost = process.env.WG_HOST;
// WireGuardのポート（クライアントが接続するポート）
const wgPort = process.env.WG_PORT || '51820';
// DNSの設定（クライアントが使用するDNSサーバー）
const wgDefaultDNS = process.env.WG_DEFAULT_DNS || '8.8.8.8';
// KeepAliveの設定
const wgPersistentKeepalive = process.env.WG_PERSISTENT_KEEPALIVE || '25';

// WireGuardインターフェース名（クライアント側のインターフェース）
const wgInterfaceName = process.env.WG_INTERFACE_NAME || 'wg0';
// WireGuardのコンフィグファイルのパスを指定
const serverWGConfigPath = path.join(process.cwd(), `${wgInterfaceName}.conf`);

// サーバー用キーペアのパスを指定
const serverPrivateKeyPath = path.join(process.cwd(), 'privateKey');
const serverPublicKeyPath = path.join(process.cwd(), 'publicKey');

// キーペアをキャッシュ
let __privateKey: string | null = null;
let __publicKey: string | null = null;

// サーバー用キーペアの作成
async function generateKeyPairForServer(): Promise<{ privateKey: string; publicKey: string }> {
    // キャッシュ済みの場合はそれを返す
    if (__privateKey && __publicKey) {
        return { privateKey: __privateKey, publicKey: __publicKey };
    }

    try {
        // 既存のキーペアがあれば読み込み、キャッシュして返す
        __privateKey = (await readFile(serverPrivateKeyPath, 'utf-8')).trim();
        __publicKey = (await readFile(serverPublicKeyPath, 'utf-8')).trim();
    } catch {
        // キーペアが存在しない場合は新規作成、保存、キャッシュして返す
        const stdoutPrivateKey = await execSync('wg genkey');
        const stdoutPublicKey = await execSync(`echo ${stdoutPrivateKey.toString().trim()} | wg pubkey`);
        __privateKey = stdoutPrivateKey.toString().trim();
        __publicKey = stdoutPublicKey.toString().trim();
        await writeFile(serverPrivateKeyPath, __privateKey);
        await writeFile(serverPublicKeyPath, __publicKey);
    }

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

// WireGuardのピア用コンフィグを作成
export const createPeerConfig = async (ipAddress: string): Promise<{ serverPeerConfig: string; clientConfig: string }> => {
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
        console.error(error);
        throw new Error('Failed to generate server key pair');
    }

    try {
        // クライアント用キーペアの取得
        ({ privateKey: clientPrivateKey, publicKey: clientPublicKey } = await generateKeyPairForClient());
    } catch (error) {
        console.error(error);
        throw new Error('Failed to generate client key pair');
    }

    // サーバー側[Interface]セクション
    const serverInterfaceConfig = `[Interface]
PrivateKey = ${serverPrivateKey}
ListenPort = ${wgPort}`;

    // サーバー側[Peer]セクション
    const serverPeerConfig = `\n\n[Peer]
PublicKey = ${clientPublicKey}
AllowedIPs = ${ipAddress}/32
PersistentKeepalive = ${wgPersistentKeepalive}`;

    // クライアント側[Interface][Peer]セクション
    const clientConfig = `[Interface]
Address = ${ipAddress}/32
PrivateKey = ${clientPrivateKey}
DNS = ${wgDefaultDNS}

[Peer]
PublicKey = ${serverPublicKey}
Endpoint = ${wgHost}:${wgPort}
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = ${wgPersistentKeepalive}`;

    try {
        // 存在チェック
        await access(serverWGConfigPath);
    } catch {
        // 存在しなければ作成
        try {
            // 初期設定を書き込み
            await writeFile(serverWGConfigPath, serverInterfaceConfig);
        } catch (error) {
            console.error(error);
            throw new Error('Failed to write initial WireGuard config file');
        }
    }

    return { serverPeerConfig, clientConfig };
};

// WireGuardのピアを追加して反映
export const addPeer = async (serverPeerConfig: string): Promise<void> => {
    try {
        // 既存の設定ファイルにピアの設定を追加
        await appendFile(serverWGConfigPath, serverPeerConfig);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to append peer configuration to WireGuard config file');
    }

    try {
        await syncConfig();
    } catch (error) {
        throw error;
    }
};

// WireGuardのピアを削除して反映
export const removePeer = async (ipAddress: string): Promise<void> => {
    try {
        // コンフィグファイルの読み込み
        const configContent = await readFile(serverWGConfigPath, 'utf-8');

        const peerSections = configContent.split(/\n(?=\[Peer\])/); // [Peer]の前の改行でセクション分割

        const filteredSections = peerSections.filter((section) => {
            // [Peer]セクションか確認
            if (section.startsWith('[Peer]')) {
                // このセクションに該当のAllowedIPsが含まれるか
                const match = section.match(/AllowedIPs\s*=\s*(.*)/);
                if (match) {
                    const allowedIPs = match[1].split(',').map((s) => s.trim());
                    if (allowedIPs.includes(`${ipAddress}/32`)) {
                        // 該当のIPアドレスが含まれる場合は削除
                        return false;
                    }
                }
            }
            // [Interface]セクション、もしくは該当のIPアドレスが含まれない場合はそのまま残す
            return true;
        });

        const newConfigContent = filteredSections.join('\n');

        await writeFile(serverWGConfigPath, newConfigContent);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to remove peer from WireGuard config file');
    }

    try {
        await syncConfig();
    } catch (error) {
        throw error;
    }
};

// WireGuardの設定を同期
async function syncConfig() {
    try {
        await execSync(`wg syncconf ${wgInterfaceName} <(wg-quick strip ${serverWGConfigPath})`, { shell: 'bash' });
    } catch (error) {
        console.error(error);
        throw new Error('Failed to sync WireGuard configuration');
    }
}

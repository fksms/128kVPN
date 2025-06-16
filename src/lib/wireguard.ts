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
// クライアントは全トラフィックをサーバー側に送信
const wgAllowedIPs = process.env.WG_ALLOWED_IPS || '0.0.0.0/0, ::/0';

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

const addPeer = async (): Promise<void> => {};

const removePeer = async (): Promise<void> => {};

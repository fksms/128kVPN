import type { Metadata } from 'next';
import PrivateNavbar from '@/components/PrivateNavbar';
import WGInterfaceList from '@/components/WGInterfaceList';
import SimpleFooter from '@/components/SimpleFooter';

export const metadata: Metadata = {
    title: '128kVPN | Dashboard',
    description: 'VPN接続用のインターフェースの管理ができます。ログインして速度制限を体験しましょう。',
    openGraph: {
        title: '128kVPN | Dashboard',
        description: 'VPN接続用のインターフェースの管理ができます。ログインして速度制限を体験しましょう。',
        url: 'https://128kvpn.net/dashboard',
        siteName: '128kVPN',
        type: 'website',
        locale: 'ja_JP',
    },
};

export default function DashboardPage() {
    return (
        <div>
            <PrivateNavbar />
            <WGInterfaceList />
            <SimpleFooter />
        </div>
    );
}

import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/server/verifySessionCookie';
import PublicNavbar from '@/components/PublicNavbar';
import PrivateNavbar from '@/components/PrivateNavbar';
import HomePageComponent from '@/components/HomePageComponent';
import DetailedFooter from '@/components/DetailedFooter';

export const metadata: Metadata = {
    title: '128kVPN',
    description: 'VPNを使って手軽に速度制限を体験しましょう。ログインすれば無料で利用可能です。高度な暗号化によって安全な通信を提供します。通信速度は128kbpsに制限されています。',
    openGraph: {
        title: '128kVPN',
        description: 'VPNを使って手軽に速度制限を体験しましょう。ログインすれば無料で利用可能です。高度な暗号化によって安全な通信を提供します。通信速度は128kbpsに制限されています。',
        url: 'https://128kvpn.net',
        siteName: '128kVPN',
        type: 'website',
        locale: 'ja_JP',
    },
};

export default async function HomePage() {
    let payload = null;

    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('__session')?.value;
        payload = await verifySessionCookie(sessionCookie!);
    } catch {
        payload = null;
    }

    return (
        <div>
            {payload ? <PrivateNavbar /> : <PublicNavbar />}
            <HomePageComponent />
            <DetailedFooter />
        </div>
    );
}

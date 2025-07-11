import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/server/verifySessionCookie';
import PublicNavbar from '@/components/PublicNavbar';
import PrivateNavbar from '@/components/PrivateNavbar';
import GuidePageComponent from '@/components/GuidePageComponent';
import SimpleFooter from '@/components/SimpleFooter';

export const metadata: Metadata = {
    title: '128kVPN | Guide',
    description: 'VPNインターフェースの作成から接続までを分かりやすく解説。簡単に利用できます。',
    openGraph: {
        title: '128kVPN | Guide',
        description: 'VPNインターフェースの作成から接続までを分かりやすく解説。簡単に利用できます。',
        url: 'https://128kvpn.net/guide',
        siteName: '128kVPN',
        type: 'website',
        locale: 'ja_JP',
    },
};

export default async function GuidePage() {
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
            <GuidePageComponent />
            <SimpleFooter />
        </div>
    );
}

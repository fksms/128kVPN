import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/verifySessionCookie';
import PublicNavbar from '@/components/PublicNavbar';
import PrivateNavbar from '@/components/PrivateNavbar';
import GuidePageComponent from '@/components/GuidePageComponent';
import SimpleFooter from '@/components/SimpleFooter';

export const metadata: Metadata = {
    title: '128kVPN | Guide',
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

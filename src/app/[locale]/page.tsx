import type { Metadata } from 'next';
import PublicNavbar from '@/components/PublicNavbar';
import TopPage from '@/components/TopPage';
import PublicFooter from '@/components/PublicFooter';

export const metadata: Metadata = {
    title: '128kVPN',
    description: 'Offers a speed-limited VPN.',
};

export default function HomePage() {
    return (
        <div>
            <PublicNavbar />
            <TopPage />
            <PublicFooter />
        </div>
    );
}

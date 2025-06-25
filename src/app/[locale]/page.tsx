import type { Metadata } from 'next';
import PublicNavbar from '@/components/PublicNavbar';

export const metadata: Metadata = {
    title: '128kVPN',
    description: 'Offers a speed-limited VPN.',
};

export default function HomePage() {
    return (
        <div>
            <div className='flex justify-center max-w-full min-w-xs'>
                <div className='w-5xl px-4 py-4 space-y-4'>
                    <PublicNavbar />
                </div>
            </div>
        </div>
    );
}

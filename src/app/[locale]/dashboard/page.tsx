import type { Metadata } from 'next';
import PrivateNavbar from '@/components/PrivateNavbar';
import WGInterfaceList from '@/components/WGInterfaceList';

export const metadata: Metadata = {
    title: '128kVPN | Dashboard',
};

export default function DashboardPage() {
    return (
        <div>
            <div className='flex justify-center max-w-full min-w-xs'>
                <div className='w-3xl px-4 py-4 space-y-4'>
                    <PrivateNavbar />
                    <WGInterfaceList />
                </div>
            </div>
        </div>
    );
}

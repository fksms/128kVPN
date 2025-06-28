import type { Metadata } from 'next';
import PrivateNavbar from '@/components/PrivateNavbar';
import WGInterfaceList from '@/components/WGInterfaceList';

export const metadata: Metadata = {
    title: '128kVPN | Dashboard',
};

export default function DashboardPage() {
    return (
        <div>
            <PrivateNavbar />
            <WGInterfaceList />
        </div>
    );
}

import type { Metadata } from 'next';
import PrivateNavbar from '@/components/PrivateNavbar';
import UserSettings from '@/components/UserSettings';
import PrivateFooter from '@/components/PrivateFooter';

export const metadata: Metadata = {
    title: '128kVPN | Settings',
};

export default function SettingsPage() {
    return (
        <div>
            <PrivateNavbar />
            <UserSettings />
            <PrivateFooter />
        </div>
    );
}

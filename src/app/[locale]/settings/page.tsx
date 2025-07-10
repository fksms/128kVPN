import type { Metadata } from 'next';
import PrivateNavbar from '@/components/PrivateNavbar';
import UserSettings from '@/components/UserSettings';
import SimpleFooter from '@/components/SimpleFooter';

export const metadata: Metadata = {
    title: '128kVPN | Settings',
    description: 'アカウント情報の変更が可能です。',
    openGraph: {
        title: '128kVPN | Settings',
        description: 'アカウント情報の変更が可能です。',
        url: 'https://128kvpn.net/settings',
        siteName: '128kVPN',
        type: 'website',
        locale: 'ja_JP',
    },
};

export default function SettingsPage() {
    return (
        <div>
            <PrivateNavbar />
            <UserSettings />
            <SimpleFooter />
        </div>
    );
}

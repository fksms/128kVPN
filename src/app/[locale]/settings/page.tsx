import type { Metadata } from 'next';
import PrivateNavbar from '@/components/PrivateNavbar';
import UserSettings from '@/components/UserSettings';

export const metadata: Metadata = {
    title: '128kVPN | Settings',
};

export default function SettingsPage() {
    return (
        <div>
            <div className='flex justify-center max-w-full min-w-xs'>
                <div className='w-3xl px-4 py-4 space-y-4'>
                    <PrivateNavbar />
                    <UserSettings />
                </div>
            </div>
        </div>
    );
}

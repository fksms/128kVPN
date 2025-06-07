'use client';

import Navbar from '@/components/Navbar';
import UserSettings from '@/components/UserSettings';

export default function SettingsPage() {
    return (
        <div>
            <div className='flex justify-center max-w-full min-w-xs'>
                <div className='w-3xl px-4 py-4 space-y-4'>
                    <Navbar />
                    <UserSettings />
                </div>
            </div>
        </div>
    );
}

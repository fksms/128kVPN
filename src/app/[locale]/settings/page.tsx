'use client';

import Navbar from '@/components/Navbar';

export default function DashboardPage() {
    return (
        <div>
            <div className='flex justify-center max-w-full min-w-xs'>
                <div className='w-3xl px-8 py-4 space-y-4'>
                    <Navbar />
                    <p>Settings Page</p>
                </div>
            </div>
        </div>
    );
}

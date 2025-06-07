'use client';

import Navbar from '@/components/Navbar';
import WGInterfaceList from '@/components/WGInterfaceList';

export default function DashboardPage() {
    return (
        <div>
            <div className='flex justify-center max-w-full min-w-xs'>
                <div className='w-3xl px-4 py-4 space-y-4'>
                    <Navbar />
                    <WGInterfaceList />
                </div>
            </div>
        </div>
    );
}

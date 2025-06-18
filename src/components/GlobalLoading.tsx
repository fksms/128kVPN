'use client';

import { useLoading } from '@/contexts/LoadingContext';

export default function GlobalLoading() {
    const { isLoading } = useLoading();
    return isLoading ? (
        <div className='flex items-center justify-center h-screen'>
            <div className='loading loading-spinner loading-xl'></div>
        </div>
    ) : null;
}

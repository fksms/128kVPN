'use client';

import { useLoading } from '@/contexts/LoadingContext';

export default function GlobalLoading() {
    const { isLoading } = useLoading();
    return isLoading ? (
        <div className='fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[var(--background)] z-50'>
            <div className='loading loading-spinner loading-xl'></div>
        </div>
    ) : null;
}

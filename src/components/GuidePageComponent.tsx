'use client';

import { useEffect } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

export default function GuidePageComponent() {
    const { setLoading } = useLoading();

    useEffect(() => {
        // ローディング停止
        setLoading(false);
    }, [setLoading]);

    return (
        <div>
            <div className='flex justify-center max-w-full min-w-xs'>
                <div className='w-5xl px-4 py-4 space-y-4'>
                    <h1 className='text-4xl font-bold text-center'>VPN接続の使い方</h1>
                </div>
            </div>
        </div>
    );
}

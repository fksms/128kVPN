'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type Props = {
    expireAt: number;
};

export default function CountdownTimer({ expireAt }: Props) {
    const t = useTranslations();

    const calculateRemainingMinutes = (): number => {
        return Math.max(0, Math.floor((expireAt - Date.now()) / (60 * 1000)));
    };

    const [remainingMinutes, setRemainingMinutes] = useState(calculateRemainingMinutes());

    useEffect(() => {
        // コンポーネントマウント時に実行（インターバル開始）
        const interval = setInterval(() => {
            setRemainingMinutes(calculateRemainingMinutes());
        }, 60 * 1000); // 1分ごとに更新

        return () => {
            // コンポーネントアンマウント時に実行（インターバル解除）
            clearInterval(interval);
        };
    }, []);

    return (
        <div>
            <div className='text-right'>
                <p>{t('WGInterfaceList.remaining')}</p>
                <p>
                    {remainingMinutes} {t('WGInterfaceList.remainingTimeUnit')}
                </p>
            </div>
        </div>
    );
}

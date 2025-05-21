'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type Props = {
    expireAt: number;
};

export default function CountdownTimer({ expireAt }: Props) {
    const t = useTranslations();

    const calculateRemainingMinutes = () => {
        const diff = Math.max(0, Math.floor((expireAt - Date.now()) / (60 * 1000)));
        return diff;
    };

    const [remainingMinutes, setRemainingMinutes] = useState(calculateRemainingMinutes());

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingMinutes((prev) => {
                const next = calculateRemainingMinutes();
                return next;
            });
        }, 60 * 1000); // 1分ごとに更新

        // クリーンアップ処理
        return () => clearInterval(interval);
    }, [expireAt]);

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

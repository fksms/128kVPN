'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type Props = {
    expireAt: number;
};

export default function CountdownTimer({ expireAt }: Props) {
    const t = useTranslations();

    const [remainingMinutes, setRemainingMinutes] = useState(0);

    useEffect(() => {
        // コンポーネントマウント時に実行
        const calculateRemainingMinutes = (): number => {
            return Math.floor((expireAt - Date.now()) / (60 * 1000));
        };

        setRemainingMinutes(calculateRemainingMinutes());

        // インターバル開始
        const interval = setInterval(() => {
            setRemainingMinutes(calculateRemainingMinutes());
        }, 60 * 1000); // 1分ごとに更新

        return () => {
            // コンポーネントアンマウント時に実行
            // インターバル解除
            clearInterval(interval);
        };
    }, [expireAt]);

    return (
        <div>
            <div className='text-right'>
                {remainingMinutes >= 0 ? (
                    <div>
                        <p>{t('DashboardPage.CountdownTimer.remaining')}</p>
                        <p>
                            {remainingMinutes} {t('DashboardPage.CountdownTimer.remainingTimeUnit')}
                        </p>
                    </div>
                ) : remainingMinutes < 0 && remainingMinutes >= -1 ? (
                    <div>
                        <p>{t('DashboardPage.CountdownTimer.expiringSoon')}</p>
                    </div>
                ) : (
                    <div>
                        <p>{t('DashboardPage.CountdownTimer.expired')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

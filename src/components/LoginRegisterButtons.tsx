'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

export default function LoginRegisterButtons() {
    const t = useTranslations();

    const router = useRouter();
    const locale = useLocale();

    return (
        <div>
            <div className='flex gap-3'>
                <button onClick={() => router.push('/login', { locale: locale })} className='btn btn-neutral'>
                    {t('AuthForm.loginButton')}
                </button>
                <button onClick={() => router.push('/register', { locale: locale })} className='btn'>
                    {t('AuthForm.registerButton')}
                </button>
            </div>
        </div>
    );
}

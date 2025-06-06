'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

export default function LanguageDropdown() {
    const t = useTranslations();

    const pathname = usePathname();
    const router = useRouter();

    return (
        <div>
            <div className='dropdown dropdown-right'>
                <div tabIndex={0} role='button' className='btn btn-xs btn-ghost rounded-field text-gray-500'>
                    {t('DashboardPage.Navbar.language')}
                    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-4'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
                    </svg>
                </div>
                <ul tabIndex={0} className='menu menu-xs dropdown-content bg-base-200 rounded-box z-1 mt-2 w-25 p-2 shadow-sm'>
                    <li>
                        <a onClick={() => router.push(pathname, { locale: 'ja' })}>{t('DashboardPage.Navbar.languageSelect.ja')}</a>
                    </li>
                    <li>
                        <a onClick={() => router.push(pathname, { locale: 'en' })}>{t('DashboardPage.Navbar.languageSelect.en')}</a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

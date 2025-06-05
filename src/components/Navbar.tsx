'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

export default function Navbar() {
    const t = useTranslations();
    const pathname = usePathname();
    const router = useRouter();

    const switchLanguage = (newLocale: string) => {
        router.push(pathname, { locale: newLocale });
    };

    return (
        <div className='navbar'>
            <div className='flex-1'>
                <a className='text-lg font-bold'>{t('DashboardPage.Navbar.title')}</a>
            </div>
            <div className='flex-none'>
                <div className='flex items-stretch space-x-1'>
                    <a className='btn btn-ghost rounded-field'>{t('DashboardPage.Navbar.settings')}</a>
                    <div className='dropdown dropdown-end'>
                        <div tabIndex={0} role='button' className='btn btn-ghost rounded-field'>
                            {t('DashboardPage.Navbar.language')}
                        </div>
                        <ul tabIndex={0} className='menu dropdown-content bg-base-200 rounded-box z-1 mt-2 w-25 p-2 shadow-sm'>
                            <li>
                                <a onClick={() => switchLanguage('ja')}>{t('DashboardPage.Navbar.languageSelect.ja')}</a>
                            </li>
                            <li>
                                <a onClick={() => switchLanguage('en')}>{t('DashboardPage.Navbar.languageSelect.en')}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

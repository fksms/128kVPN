'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { FirebaseError } from 'firebase/app';
import { sessionLogout } from '@/lib/handleSession';
import { handleFirebaseError } from '@/lib/firebase';
import LanguageDropdown from '@/components/LanguageDropdown';

export default function Navbar() {
    const t = useTranslations();

    const router = useRouter();
    const locale = useLocale();

    const handleLogout = async (): Promise<void> => {
        try {
            if (confirm(t('Navbar.confirmLogout'))) {
                // セッションログアウトを試行
                await sessionLogout();
                // ページを切り替え
                router.push('/login', { locale: locale });
                return;
            } else {
                return;
            }
        } catch (error) {
            if (error instanceof FirebaseError) {
                alert(t(handleFirebaseError(error)));
                return;
            } else {
                console.error(error);
                alert(t('AuthError.unknownError'));
                return;
            }
        }
    };

    return (
        <div className='navbar'>
            <div className='flex-1'>
                <a className='text-lg font-bold'>{t('Navbar.title')}</a>
            </div>

            <div className='flex gap-1'>
                <LanguageDropdown size='md' direction='end' />
                <div className='dropdown dropdown-end'>
                    <div tabIndex={0} role='button' className='btn btn-ghost btn-circle avatar'>
                        <div className='w-10 rounded-full'>
                            <img alt='Tailwind CSS Navbar component' src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp' />
                        </div>
                    </div>
                    <ul tabIndex={0} className='menu menu-md dropdown-content bg-base-100 rounded-box z-1 mt-3 w-35 p-2 shadow-lg'>
                        <li>
                            <a href='/dashboard'>{t('Navbar.dashboard')}</a>
                        </li>
                        <li>
                            <a href='/settings'>{t('Navbar.settings')}</a>
                        </li>
                        <li>
                            <a
                                onClick={() => {
                                    handleLogout();
                                }}
                                className='text-red-400'
                            >
                                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-5'>
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9'
                                    />
                                </svg>
                                {t('Navbar.logout')}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

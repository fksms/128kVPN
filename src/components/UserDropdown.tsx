'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { FirebaseError } from 'firebase/app';
import { sessionLogout } from '@/lib/handleSession';
import { handleFirebaseError } from '@/lib/firebase';
import { useLoading } from '@/contexts/LoadingContext';

export default function UserDropdown() {
    const t = useTranslations();

    const { setLoading } = useLoading();

    const [photoURL, setPhotoURL] = useState<string | null>(null);

    const router = useRouter();
    const locale = useLocale();
    const currentPathname = usePathname();

    const logout = async (): Promise<void> => {
        try {
            if (confirm(t('Navbar.confirmLogout'))) {
                // ローディング開始
                setLoading(true);
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

    const goTo = (pathname: string): void => {
        if (currentPathname !== pathname) {
            // ローディング開始
            setLoading(true);
            router.push(pathname, { locale: locale });
        }
    };

    useEffect(() => {
        // コンポーネントマウント時に実行
        setPhotoURL(sessionStorage.getItem('photoURL'));
    }, []);

    return (
        <div>
            <div className='dropdown dropdown-end'>
                {photoURL ? (
                    <div tabIndex={0} role='button' className='btn btn-ghost btn-circle avatar'>
                        <div className='w-10 rounded-full'>
                            <Image alt='My photo' src={photoURL} width={96} height={96} />
                        </div>
                    </div>
                ) : (
                    <div tabIndex={0} role='button' className='btn btn-ghost btn-square'>
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-6'>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
                        </svg>
                    </div>
                )}
                <ul tabIndex={0} className='menu menu-md dropdown-content bg-base-100 rounded-box z-1 mt-3 w-35 p-2 shadow-lg'>
                    <li>
                        <a onClick={() => goTo('/dashboard')}>{t('Navbar.dashboard')}</a>
                    </li>
                    <li>
                        <a onClick={() => goTo('/settings')}>{t('Navbar.settings')}</a>
                    </li>
                    <li>
                        <a onClick={() => logout()} className='text-red-400'>
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
    );
}

'use client';

import { useTranslations } from 'next-intl';
import LanguageDropdown from '@/components/LanguageDropdown';
import LoginRegisterButtons from './LoginRegisterButtons';

export default function PublicNavbar() {
    const t = useTranslations();

    return (
        <div>
            <div className='navbar fixed top-0 z-50 bg-[var(--background)] border-b border-gray-300'>
                <div className='flex mx-auto max-w-full min-w-xs'>
                    <div className='flex items-center w-3xl px-4 py-2'>
                        <div className='flex-1'>
                            <a className='text-lg font-bold'>{t('Navbar.title')}</a>
                        </div>

                        <div className='flex gap-3'>
                            <LanguageDropdown size='md' direction='end' />
                            <LoginRegisterButtons />
                        </div>
                    </div>
                </div>
            </div>
            <div className='pb-26'></div>
        </div>
    );
}

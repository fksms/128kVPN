'use client';

import { useTranslations } from 'next-intl';
import LanguageDropdown from '@/components/LanguageDropdown';
import LoginRegisterButtons from './LoginRegisterButtons';

export default function PublicNavbar() {
    const t = useTranslations();

    return (
        <div className='navbar'>
            <div className='flex-1'>
                <a className='text-lg font-bold'>{t('Navbar.title')}</a>
            </div>

            <div className='flex gap-3'>
                <LanguageDropdown size='md' direction='end' />
                <LoginRegisterButtons />
            </div>
        </div>
    );
}

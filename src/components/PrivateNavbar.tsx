'use client';

import { useTranslations } from 'next-intl';
import LanguageDropdown from '@/components/LanguageDropdown';
import UserDropdown from './UserDropdown';

export default function PrivateNavbar() {
    const t = useTranslations();

    return (
        <div className='navbar'>
            <div className='flex-1'>
                <a className='text-lg font-bold'>{t('Navbar.title')}</a>
            </div>

            <div className='flex gap-1'>
                <LanguageDropdown size='md' direction='end' />
                <UserDropdown />
            </div>
        </div>
    );
}

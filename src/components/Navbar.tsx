'use client';

import { useTranslations } from 'next-intl';
import LanguageDropdown from '@/components/LanguageDropdown';

export default function Navbar() {
    const t = useTranslations();

    return (
        <div className='navbar'>
            <div className='flex-1'>
                <a className='text-lg font-bold'>{t('Navbar.title')}</a>
            </div>
            <div className='flex-none'>
                <div className='flex items-stretch space-x-1'>
                    <a href='/dashboard' className='btn btn-ghost rounded-field'>
                        {t('Navbar.dashboard')}
                    </a>
                    <a href='/settings' className='btn btn-ghost rounded-field'>
                        {t('Navbar.settings')}
                    </a>
                    <LanguageDropdown size='md' direction='end' />
                </div>
            </div>
        </div>
    );
}

'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

type Props = {
    direction: 'start' | 'end';
    size: 'xs' | 'sm' | 'md';
    buttonClassName?: string;
};

export default function LanguageDropdown({ direction = 'start', size = 'md', buttonClassName = '' }: Props) {
    const t = useTranslations();

    const pathname = usePathname();
    const router = useRouter();

    const dropdownDirectionClass = {
        start: 'dropdown-start',
        end: 'dropdown-end',
    }[direction];

    const btnSizeClass = {
        xs: 'btn-xs',
        sm: 'btn-sm',
        md: 'btn-md',
    }[size];

    const menuSizeClass = {
        xs: 'menu-xs',
        sm: 'menu-sm',
        md: 'menu-md',
    }[size];

    return (
        <div>
            <div className={`dropdown ${dropdownDirectionClass}`}>
                <div tabIndex={0} role='button' className={`btn ${btnSizeClass} btn-ghost rounded-field ${buttonClassName}`}>
                    {t('Navbar.language')}
                    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-4'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
                    </svg>
                </div>
                <ul tabIndex={0} className={`menu ${menuSizeClass} dropdown-content bg-base-200 rounded-box z-1 mt-2 w-25 p-2 shadow-sm`}>
                    <li>
                        <a onClick={() => router.push(pathname, { locale: 'ja' })}>{t('Navbar.languageSelect.ja')}</a>
                    </li>
                    <li>
                        <a onClick={() => router.push(pathname, { locale: 'en' })}>{t('Navbar.languageSelect.en')}</a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

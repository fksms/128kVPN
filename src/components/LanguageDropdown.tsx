'use client';

import { useTranslations, useLocale } from 'next-intl';
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
    const locale = useLocale();

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

    const changeLocale = (newLocale: string): void => {
        if (locale !== newLocale) {
            router.push(pathname, { locale: newLocale });
        }
    };

    return (
        <div>
            <div className={`dropdown ${dropdownDirectionClass}`} title={t('Navbar.language')}>
                <div tabIndex={0} role='button' className={`btn ${btnSizeClass} btn-ghost rounded-field ${buttonClassName}`}>
                    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-5'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802'
                        />
                    </svg>
                    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-4'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
                    </svg>
                </div>
                <ul tabIndex={0} className={`menu ${menuSizeClass} dropdown-content bg-base-100 rounded-box z-1 mt-2 w-25 p-2 shadow-md`}>
                    <li>
                        <a onClick={() => changeLocale('ja')}>{t('Navbar.languageSelect.ja')}</a>
                    </li>
                    <li>
                        <a onClick={() => changeLocale('en')}>{t('Navbar.languageSelect.en')}</a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

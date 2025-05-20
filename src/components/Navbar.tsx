'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function Navbar() {
    const t = useTranslations();
    const router = useRouter();

    return (
        <div className='navbar'>
            <div className='flex-1'>
                <a className='text-lg font-bold'>{t('HomePage.title')}</a>
            </div>
            <div className='flex-none'>
                <div className='flex items-stretch space-x-1'>
                    <a className='btn btn-ghost rounded-field'>{t('HomePage.settings')}</a>
                    <div className='dropdown dropdown-end'>
                        <div tabIndex={0} role='button' className='btn btn-ghost rounded-field'>
                            {t('HomePage.language')}
                        </div>
                        <ul
                            tabIndex={0}
                            className='menu dropdown-content bg-base-200 rounded-box z-1 mt-2 w-52 p-2 shadow-sm'
                        >
                            <li>
                                <a
                                    onClick={() => {
                                        router.push('/ja');
                                    }}
                                >
                                    {t('HomePage.languageSelect.ja')}
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => {
                                        router.push('/en');
                                    }}
                                >
                                    {t('HomePage.languageSelect.en')}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

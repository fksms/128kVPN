'use client';

import { Link } from '@/i18n/navigation';
import LanguageDropdown from '@/components/LanguageDropdown';
import UserDropdown from './UserDropdown';
import MainLogo from './MainLogo';

export default function PrivateNavbar() {
    return (
        <div>
            <div className='navbar fixed top-0 z-40 bg-[var(--background)] border-b border-gray-300'>
                <div className='flex mx-auto max-w-full min-w-xs'>
                    <div className='flex items-center w-3xl px-4 py-2'>
                        <div className='flex-1'>
                            <Link href='/dashboard'>
                                <div className='flex items-center gap-3'>
                                    <MainLogo size={50} />
                                    <span className='text-2xl text-gray-600 font-bold font-sans select-none'>128kVPN</span>
                                </div>
                            </Link>
                        </div>

                        <div className='flex gap-1'>
                            <LanguageDropdown size='md' direction='end' />
                            <UserDropdown />
                        </div>
                    </div>
                </div>
            </div>
            <div className='pb-30'></div>
        </div>
    );
}

'use client';

import { Link } from '@/i18n/navigation';
import LanguageDropdown from '@/components/LanguageDropdown';
import LoginRegisterButtons from './LoginRegisterButtons';
import MainLogo from './MainLogo';

export default function PublicNavbar() {
    return (
        <div>
            <div className='navbar fixed top-0 z-40 bg-[var(--background)] border-b border-gray-300'>
                <div className='flex mx-auto max-w-full min-w-xs'>
                    <div className='flex items-center w-3xl px-4 py-2'>
                        <div className='flex-1'>
                            <Link href='/'>
                                {/* sm未満 */}
                                <MainLogo logoSize={40} fontSize='xl' className='flex sm:hidden' />
                                {/* sm以上 */}
                                <MainLogo logoSize={50} fontSize='2xl' className='hidden sm:flex' />
                            </Link>
                        </div>

                        <div className='flex items-center gap-1'>
                            <LanguageDropdown size='md' direction='end' />
                            <LoginRegisterButtons />
                        </div>
                    </div>
                </div>
            </div>
            <div className='max-sm:pb-20 sm:pb-30' />
        </div>
    );
}

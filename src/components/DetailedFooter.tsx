'use client';

import MainLogo from './MainLogo';

export default function DetailedFooter() {
    return (
        <div>
            <div className='max-sm:pt-5 sm:pt-15' />

            <footer className='footer footer-horizontal footer-center bg-[var(--background)] text-gray-600 py-10'>
                <div className='flex flex-col mx-auto max-w-full min-w-xs'>
                    <aside>
                        <MainLogo logoSize={60} fontSize='text-2xl' className='flex-col justify-center' />
                        <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
                    </aside>
                    <div className='py-2' />
                    <nav>
                        <div className='flex items-center gap-4'>
                            <svg aria-label='GitHub logo' width='34' height='34' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                                <path
                                    fill='#4a5565'
                                    d='M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z'
                                ></path>
                            </svg>
                            <svg aria-label='Twitter logo' width='30' height='30' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' className='fill-current'>
                                <path
                                    fill='#4a5565'
                                    d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z'
                                ></path>
                            </svg>
                        </div>
                    </nav>
                </div>
            </footer>
        </div>
    );
}

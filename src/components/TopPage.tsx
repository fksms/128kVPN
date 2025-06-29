'use client';

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import MainLogo from './MainLogo';

export default function TopPage() {
    const t = useTranslations();

    const locale = useLocale();

    return (
        <div className='flex justify-center max-w-full min-w-xs'>
            <div className='w-5xl px-4 py-4 space-y-4'>
                {/* スペーサー */}
                <div className='py-2' />

                {/* スピードテスト画像 */}
                <div className='relative w-full aspect-square sm:aspect-[3/2]'>
                    <Image src={`/speedtest_${locale}.webp`} alt='Speed Test Example' fill objectFit='contain' />
                </div>

                {/* スペーサー */}
                <div className='py-4' />

                {/* タイトル */}
                <h1 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-center pb-2'>
                    手軽に<span className='text-teal-500'>速度制限</span>を体験しよう
                </h1>

                {/* 説明文 */}
                <p className='text-base sm:text-lg md:text-xl text-center leading-relaxed py-2'>
                    ログインすれば無料で利用可能です。
                    <br />
                    専用ページから簡単にVPN接続が可能<sup>※1</sup> で、速度制限環境<sup>※2</sup> を体験できます。
                    <br />
                    高度な暗号化によって安全な通信を実現します。
                </p>

                {/* 注意書き */}
                <p className='text-sm text-gray-500 text-center'>
                    <sup>※1</sup> WireGuard<sup>®</sup> のインストールが必要です。
                    <br />
                    <sup>※2</sup> 通信速度は128kbpsに制限されています。
                </p>

                {/* スペーサー */}
                <div className='py-5' />

                {/* フッター */}
                <footer className='footer footer-horizontal footer-center bg-[var(--background)] text-gray-600 p-10'>
                    <aside>
                        <div className='flex flex-col justify-center items-center gap-2'>
                            <MainLogo size={60} />
                            <span className='text-2xl text-gray-600 font-bold font-sans select-none'>128kVPN</span>
                        </div>
                        <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
                    </aside>
                    <nav>
                        <div className='grid grid-flow-col gap-4'>
                            <span>
                                <svg aria-label='GitHub logo' width='30' height='30' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                                    <path
                                        fill='#263238'
                                        d='M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z'
                                    ></path>
                                </svg>
                            </span>
                        </div>
                    </nav>
                </footer>
            </div>
        </div>
    );
}

'use client';

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

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
                    手軽に<span className='text-blue-400'>速度制限</span>を体験しよう
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
                <div className='py-10' />

                {/* フッター */}
                <footer className='footer footer-horizontal footer-center bg-[var(--background)] text-gray-600 p-10'>
                    <aside>
                        <svg width='50' height='50' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' fillRule='evenodd' clipRule='evenodd' className='inline-block fill-current'>
                            <path d='M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z'></path>
                        </svg>
                        <p className='font-bold'>
                            ACME Industries Ltd.
                            <br />
                            Providing reliable tech since 1992
                        </p>
                        <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
                    </aside>
                    <nav>
                        <div className='grid grid-flow-col gap-4'>
                            <a>
                                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' className='fill-current'>
                                    <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z'></path>
                                </svg>
                            </a>
                        </div>
                    </nav>
                </footer>
            </div>
        </div>
    );
}

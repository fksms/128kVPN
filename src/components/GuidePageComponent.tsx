'use client';

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useEffect, useRef } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

export default function GuidePageComponent() {
    const t = useTranslations();

    const { setLoading } = useLoading();

    const locale = useLocale();

    const carouselRef = useRef<HTMLDivElement>(null);

    const screenshots = [
        '/iphone_screenshot_1.webp',
        '/iphone_screenshot_2.webp',
        '/iphone_screenshot_3.webp',
        '/iphone_screenshot_4.webp',
        '/iphone_screenshot_5.webp',
        '/iphone_screenshot_6.webp',
        '/iphone_screenshot_7.webp',
    ];

    // スクロール関数
    const scrollCarousel = (targetImageNumber: number) => {
        // carouselElementの取得
        const carouselElement = carouselRef.current;
        if (!carouselElement) return;
        // カルーセルの横幅を取得
        const carouselWidth = carouselElement.clientWidth;
        // 目標の画像のX座標を計算
        const targetXPixel = carouselWidth * targetImageNumber;
        // スクロールを実行
        carouselElement.scrollTo({
            left: targetXPixel,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        // ローディング停止
        setLoading(false);
    }, [setLoading]);

    return (
        <div>
            <div className='flex justify-center max-w-full min-w-xs'>
                <div className='w-3xl px-8 py-4 space-y-4'>
                    <h1 className='text-2xl font-bold text-gray-700'>WireGuardのインストール</h1>

                    <p className='text-base text-gray-700'>128kVPNの利用にはWireGuardが必要になります。以下のリンクから、あなたのデバイスに適したアプリをダウンロードしてください。</p>

                    <div className='flex flex-col sm:flex-row items-center justify-center py-4 gap-4 sm:gap-6'>
                        <Link href='https://apps.apple.com/app/id1441195209'>
                            <Image src={`/badge/apple_${locale}.svg`} alt='App Storeからダウンロード' width={270} height={80} className='w-40 sm:w-auto sm:h-13' />
                        </Link>
                        <Link href='https://play.google.com/store/apps/details?id=com.wireguard.android'>
                            <Image src={`/badge/google_${locale}.svg`} alt='Google Playで手に入れよう' width={270} height={80} className='w-40 sm:w-auto sm:h-13' />
                        </Link>
                    </div>

                    <div className='py-4' />

                    <h1 className='text-2xl font-bold text-gray-700'>インターフェースの作成と接続方法</h1>
                    <p className='text-base text-gray-700'>
                        ログイン後、ダッシュボードから「+ 新規追加」ボタンをクリックして、WireGuardのインターフェースを作成してください。インターフェースが作成されたら、以下のような状態になります。
                    </p>
                    <p className='text-base text-gray-700'>
                        QRコードを表示するボタンがあるので、表示されたQRコードをWireGuardアプリでスキャンしてください。スキャン後は画面の指示に従うことで、インターフェースが自動的に追加されます。
                    </p>
                    <p className='text-base text-gray-700'>追加されたインターフェースのトグルをオンにすると、VPN接続が開始されます。</p>

                    <div className='py-1' />

                    <Image src={`/interfaces_${locale}.webp`} alt='インターフェースのスクリーンショット' width={2080} height={1724} priority={true} />

                    <div className='py-4' />

                    <h1 className='text-2xl font-bold text-gray-700'>スマートフォンのみの場合の接続方法</h1>

                    <p className='text-base text-gray-700'>
                        ダウンロードボタンがあるので、コンフィグファイルを端末にダウンロードしてください。ダウンロード後、WireGuardアプリを開き、「トンネルの追加」ボタンをタップして「ファイルからインポート」を選択します。ダウンロードしたコンフィグファイルを選択すると、インターフェースが追加されます。
                    </p>
                    <p className='text-base text-gray-700'>追加されたインターフェースのトグルをオンにすると、VPN接続が開始されます。</p>

                    <div className='py-4' />

                    <div ref={carouselRef} className='flex carousel rounded-box w-70 mx-auto shadow-2xl/50'>
                        {screenshots.map((screenshot, index) => (
                            <div key={index} className='carousel-item w-full'>
                                <Image src={screenshot} alt={`Screenshot ${index + 1}`} width={1170} height={2532} priority={true} />
                            </div>
                        ))}
                    </div>
                    <div className='flex justify-center gap-1 py-4'>
                        {screenshots.map((_, index) => (
                            <button key={index} className='btn btn-xs' onClick={() => scrollCarousel(index)}>
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <div className='py-4' />
                </div>
            </div>
        </div>
    );
}

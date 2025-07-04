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
        '/screenshots/iphone_screenshot_1.webp',
        '/screenshots/iphone_screenshot_2.webp',
        '/screenshots/iphone_screenshot_3.webp',
        '/screenshots/iphone_screenshot_4.webp',
        '/screenshots/iphone_screenshot_5.webp',
        '/screenshots/iphone_screenshot_6.webp',
        '/screenshots/iphone_screenshot_7.webp',
    ];

    const countryCode = {
        ja: 'jp',
        en: 'us',
    }[locale];

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
                    <h1 className='text-2xl font-bold text-gray-700'>{t('GuidePage.installTitle')}</h1>

                    <p className='text-base text-gray-700'>{t('GuidePage.installDescription')}</p>

                    <div className='flex flex-col sm:flex-row items-center justify-center py-4 gap-4 sm:gap-6'>
                        <Link href={`https://apps.apple.com/${countryCode}/app/id1441195209`}>
                            <Image src={`/badge/apple_${locale}.svg`} alt={t('GuidePage.downloadFromAppStore')} width={270} height={80} className='w-40 sm:w-auto sm:h-13' />
                        </Link>
                        <Link href='https://play.google.com/store/apps/details?id=com.wireguard.android'>
                            <Image src={`/badge/google_${locale}.svg`} alt={t('GuidePage.getOnGooglePlay')} width={270} height={80} className='w-40 sm:w-auto sm:h-13' />
                        </Link>
                    </div>

                    <div className='py-4' />

                    <h1 className='text-2xl font-bold text-gray-700'>{t('GuidePage.interfaceTitle')}</h1>
                    <p className='text-base text-gray-700'>{t('GuidePage.interfaceDescription1')}</p>
                    <p className='text-base text-gray-700'>{t('GuidePage.interfaceDescription2')}</p>
                    <p className='text-base text-gray-700'>{t('GuidePage.interfaceDescription3')}</p>

                    <div className='py-1' />

                    <Image src={`/screenshots/dashboard_screenshot_${locale}.webp`} alt={t('GuidePage.interfaceScreenshotAlt')} width={2080} height={1724} priority={true} />

                    <div className='py-4' />

                    <h1 className='text-2xl font-bold text-gray-700'>{t('GuidePage.phoneOnlyTitle')}</h1>

                    <p className='text-base text-gray-700'>{t('GuidePage.phoneOnlyDescription1')}</p>
                    <p className='text-base text-gray-700'>{t('GuidePage.phoneOnlyDescription2')}</p>

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

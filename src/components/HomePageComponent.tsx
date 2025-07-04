'use client';

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function HomePageComponent() {
    const t = useTranslations();

    const locale = useLocale();

    return (
        <div>
            <div className='flex justify-center max-w-full min-w-xs'>
                <div className='w-5xl px-4 py-4 space-y-4'>
                    <div className='py-2' />

                    <Image src={`/speedtest_${locale}.webp`} alt='Speed Test Example' width={1200} height={2453} className='w-55 sm:w-70 mx-auto' priority={true} />

                    <div className='py-4' />

                    <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-center pb-2'>
                        {t('TopPage.headline.before')}
                        <span className='text-teal-500'>{t('TopPage.headline.highlight')}</span>
                        {t('TopPage.headline.after')}
                    </h1>

                    <p className='text-base sm:text-lg md:text-xl text-center leading-relaxed py-2'>
                        {t('TopPage.description.line1')}
                        <br />
                        {t('TopPage.description.line2')}
                        <br />
                        {t('TopPage.description.line3')}
                        <br />
                        {t('TopPage.guideLink.prefix')}
                        {locale === 'ja' ? '' : ' '}
                        <Link href='/guide' className='text-blue-700 underline'>
                            {t('TopPage.guideLink.linkText')}
                        </Link>
                        {t('TopPage.guideLink.suffix')}
                    </p>

                    <p className='text-sm text-gray-500 text-center'>
                        <sup>※1</sup> {t('TopPage.notes.note1')}
                        <br />
                        <sup>※2</sup> {t('TopPage.notes.note2')}
                    </p>
                </div>
            </div>
        </div>
    );
}

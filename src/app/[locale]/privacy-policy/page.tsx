import type { Metadata } from 'next';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

export const metadata: Metadata = {
    title: '128kVPN | Privacy Policy',
    description: '当VPNサービスのプライバシーポリシー。利用者の個人情報の取扱いやセキュリティポリシーについてご確認ください。',
    openGraph: {
        title: '128kVPN | Privacy Policy',
        description: '当VPNサービスのプライバシーポリシー。利用者の個人情報の取扱いやセキュリティポリシーについてご確認ください。',
        url: 'https://128kvpn.net/privacy-policy',
        siteName: '128kVPN',
        type: 'website',
        locale: 'ja_JP',
    },
};

export default function PrivacyPolicyPage() {
    const t = useTranslations();

    const locale = useLocale();

    const countryCode = {
        ja: 'jp',
        en: 'us',
    }[locale];

    return (
        <div>
            <div className='flex justify-center max-w-full min-w-xs'>
                <div className='w-5xl px-10 py-16 space-y-4'>
                    <h1 className='text-3xl font-bold'>{t('PrivacyPolicyPage.title')}</h1>
                    <p>{t('PrivacyPolicyPage.intro')}</p>
                    <p className=' text-gray-500 italic'>{t('PrivacyPolicyPage.lastUpdated')}</p>

                    <h2 className='text-2xl font-bold mt-8'>{t('PrivacyPolicyPage.section1Title')}</h2>
                    <p>{t('PrivacyPolicyPage.contactInfo')}</p>

                    <h2 className='text-2xl font-bold mt-8'>{t('PrivacyPolicyPage.section2Title')}</h2>
                    <p>{t('PrivacyPolicyPage.infoCollectedIntro')}</p>
                    <ul className='list-disc pl-6 space-y-2'>
                        <li>
                            <strong>{t('PrivacyPolicyPage.emailAndPassword')}</strong>
                            {t('PrivacyPolicyPage.emailAndPasswordDetail')}
                        </li>
                        <li>
                            <strong>{t('PrivacyPolicyPage.userId')}</strong>
                            {t('PrivacyPolicyPage.userIdDetail')}
                        </li>
                        <li>
                            <strong>{t('PrivacyPolicyPage.vpnLogs')}</strong>
                            {t('PrivacyPolicyPage.vpnLogsDetail')}
                        </li>
                        <li>
                            <strong>{t('PrivacyPolicyPage.analytics')}</strong>
                            {t('PrivacyPolicyPage.analyticsDetail')}
                        </li>
                    </ul>

                    <h2 className='text-2xl font-bold mt-8'>{t('PrivacyPolicyPage.section3Title')}</h2>
                    <ul className='list-disc pl-6'>
                        <li>{t('PrivacyPolicyPage.section3Purpose1')}</li>
                        <li>{t('PrivacyPolicyPage.section3Purpose2')}</li>
                        <li>{t('PrivacyPolicyPage.section3Purpose3')}</li>
                    </ul>

                    <h2 className='text-2xl font-bold mt-8'>{t('PrivacyPolicyPage.section4Title')}</h2>
                    <p>{t('PrivacyPolicyPage.section4Intro')}</p>
                    <ul className='list-disc pl-6'>
                        <li>{t('PrivacyPolicyPage.section4Case1')}</li>
                        <li>{t('PrivacyPolicyPage.section4Case2')}</li>
                    </ul>
                    <p>{t('PrivacyPolicyPage.section4Note')}</p>
                    <p>
                        <Link href='https://firebase.google.com/support/privacy' target='_blank' rel='noopener noreferrer' className='text-blue-700 underline'>
                            {t('PrivacyPolicyPage.firebasePrivacy')}
                        </Link>
                        <br />
                        <Link href={`https://marketingplatform.google.com/about/analytics/terms/${countryCode}/`} target='_blank' rel='noopener noreferrer' className='text-blue-700 underline'>
                            {t('PrivacyPolicyPage.analyticsTerms')}
                        </Link>
                    </p>

                    <h2 className='text-2xl font-bold mt-8'>{t('PrivacyPolicyPage.section5Title')}</h2>
                    <p>{t('PrivacyPolicyPage.section5Content')}</p>

                    <h2 className='text-2xl font-bold mt-8'>{t('PrivacyPolicyPage.section6Title')}</h2>
                    <p>{t('PrivacyPolicyPage.section6Content')}</p>

                    <h2 className='text-2xl font-bold mt-8'>{t('PrivacyPolicyPage.section7Title')}</h2>
                    <p>{t('PrivacyPolicyPage.section7Content')}</p>

                    <h2 className='text-2xl font-bold mt-8'>{t('PrivacyPolicyPage.section8Title')}</h2>
                    <p>{t('PrivacyPolicyPage.section8Content')}</p>
                </div>
            </div>
        </div>
    );
}

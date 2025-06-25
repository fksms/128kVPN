import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { LoadingProvider } from '@/contexts/LoadingContext';
import GlobalLoading from '@/components/GlobalLoading';

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    // Check if the locale is supported
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    return (
        <NextIntlClientProvider locale={locale}>
            <LoadingProvider>
                <GlobalLoading />
                {children}
            </LoadingProvider>
        </NextIntlClientProvider>
    );
}

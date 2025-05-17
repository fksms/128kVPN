import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ClientList } from "@/components/ClientList";

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const t = await getTranslations({ locale });
    return (
        <main className="flex justify-center p-6 space-y-4">
            <div className="my-6 space-y-4">
                <h1 className="flex justify-center text-3xl font-bold">{t('HomePage.title')}</h1>
                <div className="flex justify-center space-x-2">
                    <button className="btn btn-accent">+ New</button>
                </div>
                <ClientList />
            </div>
        </main>
    );
}

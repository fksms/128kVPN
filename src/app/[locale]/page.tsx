import { getTranslations, setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import WGInterfaceList from '@/components/WGInterfaceList';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const t = await getTranslations({ locale });

    return (
        <main>
            <div className='flex justify-center max-w-full'>
                <div className='my-3 space-y-4 w-180 px-8'>
                    <Navbar />
                    <WGInterfaceList />
                </div>
            </div>
        </main>
    );
}

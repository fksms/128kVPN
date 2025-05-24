import { setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import WGInterfaceList from '@/components/WGInterfaceList';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    return (
        <main>
            <div className='flex justify-center max-w-full min-w-xs'>
                <div className='w-3xl px-8 py-4 space-y-4'>
                    <Navbar />
                    <WGInterfaceList />
                </div>
            </div>
        </main>
    );
}

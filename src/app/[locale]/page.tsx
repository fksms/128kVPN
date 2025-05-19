import { getTranslations, setRequestLocale } from "next-intl/server";
import WGInterfaceList from "@/components/WGInterfaceList";

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
                <h1 className="flex justify-center text-3xl font-bold">{t("HomePage.title")}</h1>
                <WGInterfaceList />
            </div>
        </main>
    );
}

import type { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
    title: '128kVPN | Login',
    description: 'アカウントにログインして、VPN接続用のインターフェースの管理ができます。',
    openGraph: {
        title: '128kVPN | Login',
        description: 'アカウントにログインして、VPN接続用のインターフェースの管理ができます。',
        url: 'https://128kvpn.net/login',
        siteName: '128kVPN',
        type: 'website',
        locale: 'ja_JP',
    },
};

export default function LoginPage() {
    return (
        <div>
            <AuthForm action='login' />
        </div>
    );
}

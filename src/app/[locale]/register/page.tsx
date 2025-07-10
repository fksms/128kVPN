import type { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
    title: '128kVPN | Register',
    description: 'アカウントを無料で作成。速度制限されたVPNの利用を今すぐはじめましょう。',
    openGraph: {
        title: '128kVPN | Register',
        description: 'アカウントを無料で作成。速度制限されたVPNの利用を今すぐはじめましょう。',
        url: 'https://128kvpn.net/register',
        siteName: '128kVPN',
        type: 'website',
        locale: 'ja_JP',
    },
};

export default function RegisterPage() {
    return (
        <div>
            <AuthForm action='register' />
        </div>
    );
}

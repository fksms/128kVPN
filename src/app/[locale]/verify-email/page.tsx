import type { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
    title: '128kVPN | Verify Email',
    description: '登録したメールアドレスの確認を行っています。認証リンクをご確認ください。',
    openGraph: {
        title: '128kVPN | Verify Email',
        description: '登録したメールアドレスの確認を行っています。認証リンクをご確認ください。',
        url: 'https://128kvpn.net/verify-email',
        siteName: '128kVPN',
        type: 'website',
        locale: 'ja_JP',
    },
};

export default function VerifyEmailPage() {
    return (
        <div>
            <AuthForm action='verifyEmail' />
        </div>
    );
}

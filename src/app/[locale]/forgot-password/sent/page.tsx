import type { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
    title: '128kVPN | Forgot Password Sent Email',
    description: 'パスワード再設定用リンクをメールで送信しました。メールをご確認ください。',
    openGraph: {
        title: '128kVPN | Forgot Password Sent Email',
        description: 'パスワード再設定用リンクをメールで送信しました。メールをご確認ください。',
        url: 'https://128kvpn.net/forgot-password/sent',
        siteName: '128kVPN',
        type: 'website',
        locale: 'ja_JP',
    },
};

export default function ForgotPasswordSentEmailPage() {
    return (
        <div>
            <AuthForm action='forgotPasswordSentEmail' />
        </div>
    );
}

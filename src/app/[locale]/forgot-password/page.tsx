import type { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
    title: '128kVPN | Forgot Password',
    description: 'パスワードをお忘れですか？登録メールアドレスで再設定ができます。',
    openGraph: {
        title: '128kVPN | Forgot Password',
        description: 'パスワードをお忘れですか？登録メールアドレスで再設定ができます。',
        url: 'https://128kvpn.net/forgot-password',
        siteName: '128kVPN',
        type: 'website',
        locale: 'ja_JP',
    },
};

export default function ForgotPasswordPage() {
    return (
        <div>
            <AuthForm action='forgotPassword' />
        </div>
    );
}

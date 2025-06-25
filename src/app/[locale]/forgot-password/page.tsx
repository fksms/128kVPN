import type { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
    title: '128kVPN | Forgot Password',
};

export default function ForgotPasswordPage() {
    return (
        <div>
            <AuthForm action='forgotPassword' />
        </div>
    );
}

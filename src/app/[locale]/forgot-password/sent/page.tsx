import type { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
    title: '128kVPN | Forgot Password Sent Email',
};

export default function ForgotPasswordSentEmailPage() {
    return (
        <div>
            <AuthForm action='forgotPasswordSentEmail' />
        </div>
    );
}

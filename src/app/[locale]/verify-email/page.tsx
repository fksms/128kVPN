import type { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
    title: '128kVPN | Verify Email',
};

export default function VerifyEmailPage() {
    return (
        <div>
            <AuthForm action='verifyEmail' />
        </div>
    );
}

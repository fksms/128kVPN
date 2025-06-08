'use client';

import AuthForm from '@/components/AuthForm';

export default function VerifyEmailPage() {
    return (
        <div>
            <AuthForm action='verifyEmail' />
        </div>
    );
}

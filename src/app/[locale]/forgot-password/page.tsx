'use client';

import AuthForm from '@/components/AuthForm';

export default function ForgotPasswordPage() {
    return (
        <div>
            <AuthForm action='forgotPassword' />
        </div>
    );
}

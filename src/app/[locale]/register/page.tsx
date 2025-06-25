import type { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
    title: '128kVPN | Register',
};

export default function RegisterPage() {
    return (
        <div>
            <AuthForm action='register' />
        </div>
    );
}

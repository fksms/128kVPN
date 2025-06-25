import type { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
    title: '128kVPN | Login',
};

export default function LoginPage() {
    return (
        <div>
            <AuthForm action='login' />
        </div>
    );
}

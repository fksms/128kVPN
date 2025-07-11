import { UserCredential } from 'firebase/auth';
import { ErrorCodes } from '@/lib/errorCodes';

export const sessionLogin = async (userCredential: UserCredential): Promise<void> => {
    try {
        const token = await userCredential.user.getIdToken();
        const res = await fetch('/api/auth/session-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (!data.success) {
            // ログイン失敗
            throw new Error(data.error);
        }
        return;
    } catch (error) {
        // ログイン失敗
        throw error;
    }
};

export const sessionLogout = async (): Promise<void> => {
    try {
        const res = await fetch('/api/auth/session-logout', { method: 'POST' });
        const data = await res.json();
        if (!data.success) {
            // ログアウト失敗
            throw new Error(ErrorCodes.DELETE_SESSION_FAILED);
        }
        return;
    } catch (error) {
        // ログアウト失敗
        throw error;
    }
};

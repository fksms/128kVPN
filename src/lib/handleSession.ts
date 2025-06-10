import { UserCredential } from 'firebase/auth';

export const handleSessionLogin = async (userCredential: UserCredential): Promise<boolean> => {
    try {
        const token = await userCredential.user.getIdToken();
        const res = await fetch('/api/session-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (data.success) {
            // ログイン成功
            return true;
        } else {
            // ログイン失敗
            return false;
        }
    } catch (error) {
        console.error('UNKNOWN_ERROR');
        // ログイン失敗
        return false;
    }
};

export const handleSessionLogout = async (): Promise<boolean> => {
    try {
        const res = await fetch('/api/session-logout', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
            // ログアウト成功
            return true;
        } else {
            // ログアウト失敗
            return false;
        }
    } catch (error) {
        console.error('UNKNOWN_ERROR');
        // ログアウト失敗
        return false;
    }
};

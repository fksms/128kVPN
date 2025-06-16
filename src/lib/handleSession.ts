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
        // ログイン成功時、セッションストレージに情報を保存
        sessionStorage.clear();
        if (userCredential.providerId) {
            // ソーシャルログインの場合
            userCredential.user.email && sessionStorage.setItem('email', userCredential.user.email);
            userCredential.user.providerId && sessionStorage.setItem('providerId', userCredential.user.providerId);
            userCredential.user.photoURL && sessionStorage.setItem('photoURL', userCredential.user.photoURL);
        } else {
            // メールアドレスログインの場合
            userCredential.user.email && sessionStorage.setItem('email', userCredential.user.email);
        }
        return;
    } catch (error) {
        // ログイン失敗
        throw new Error(error instanceof Error ? error.message : ErrorCodes.UNKNOWN_ERROR);
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
        // ログアウト成功時、セッションストレージをクリア
        sessionStorage.clear();
        return;
    } catch (error) {
        // ログアウト失敗
        throw new Error(error instanceof Error ? error.message : ErrorCodes.UNKNOWN_ERROR);
    }
};

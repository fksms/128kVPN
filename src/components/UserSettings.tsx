'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { FirebaseError } from 'firebase/app';
import { getAuth, verifyBeforeUpdateEmail, updatePassword, signOut, onAuthStateChanged, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { app } from '@/lib/firebase';

export default function UserSettings() {
    const t = useTranslations();

    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [currentPassword1, setCurrentPassword1] = useState('');
    const [currentPassword2, setCurrentPassword2] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error1, setError1] = useState('');
    const [error2, setError2] = useState('');

    const router = useRouter();
    const locale = useLocale();

    const auth = getAuth(app);

    const handleEmailChange = async (): Promise<void> => {
        // メールアドレスが空ならエラー
        if (!newEmail) {
            setError1(t('AuthForm.error.emptyFields'));
            return;
        }
        // メールアドレスが正しい形式ではないならエラー
        // See: https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)
        if (!newEmail.match(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
            setError1(t('AuthForm.error.invalidEmail'));
            return;
        }
        // パスワードが空ならエラー
        if (!currentPassword1) {
            setError2(t('AuthForm.error.emptyFields'));
            return;
        }
        // パスワードが短すぎるならエラー
        if (currentPassword1.length < 8) {
            setError2(t('AuthForm.error.shortPassword'));
            return;
        }

        // Set the language code for Firebase Auth
        auth.languageCode = locale;

        try {
            // 資格情報（credential）を作成
            const credential = EmailAuthProvider.credential(auth.currentUser!.email!, currentPassword1);
            // 再認証実行
            const userCredential = await reauthenticateWithCredential(auth.currentUser!, credential);
            // メールアドレスを更新し、認証メールを送信
            await verifyBeforeUpdateEmail(userCredential.user, newEmail);
            await signOut(auth);
            router.push('/verify-email', { locale: locale });
            return;
        } catch (error) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case 'auth/invalid-email':
                        setError1(t('AuthForm.error.invalidEmail'));
                        return;
                    case 'auth/user-disabled':
                        setError1(t('AuthForm.error.userDisabled'));
                        return;
                    case 'auth/user-not-found':
                        setError1(t('AuthForm.error.userNotFound'));
                        return;
                    case 'auth/wrong-password':
                        setError1(t('AuthForm.error.wrongPassword'));
                        return;
                    case 'auth/missing-password':
                        setError1(t('AuthForm.error.wrongPassword'));
                        return;
                    // https://zenn.dev/mekk/articles/4b563dc3813cd7
                    case 'auth/invalid-credential':
                        setError1(t('AuthForm.error.invalidCredential'));
                        return;
                    case 'auth/email-already-in-use':
                        setError1(t('AuthForm.error.emailAlreadyInUse'));
                        return;
                    case 'auth/weak-password':
                        setError1(t('AuthForm.error.weakPassword'));
                        return;
                    case 'auth/too-many-requests':
                        setError1(t('AuthForm.error.tooManyRequests'));
                        return;
                    case 'auth/network-request-failed':
                        setError1(t('AuthForm.error.networkError'));
                        return;
                    default:
                        console.error(error.code);
                        setError1(t('AuthForm.error.unknownError'));
                        return;
                }
            } else {
                console.error(error);
                setError1(t('AuthForm.error.unknownError'));
                return;
            }
        }
    };

    const handlePasswordChange = async (): Promise<void> => {
        // パスワードが空ならエラー
        if (!currentPassword2 || !newPassword || !confirmPassword) {
            setError2(t('AuthForm.error.emptyFields'));
            return;
        }
        // パスワードが短すぎるならエラー
        if (newPassword.length < 8) {
            setError2(t('AuthForm.error.shortPassword'));
            return;
        }
        // パスワードと確認用パスワードが一致しないならエラー
        if (newPassword !== confirmPassword) {
            setError2(t('AuthForm.error.passwordsDoNotMatch'));
            return;
        }

        // Set the language code for Firebase Auth
        auth.languageCode = locale;

        try {
            // 資格情報（credential）を作成
            const credential = EmailAuthProvider.credential(auth.currentUser!.email!, currentPassword2);
            // 再認証実行
            const userCredential = await reauthenticateWithCredential(auth.currentUser!, credential);
            // パスワードを更新
            await updatePassword(userCredential.user, newPassword);
            alert('パスワードを更新しました。');
            setCurrentPassword2('');
            setNewPassword('');
            setConfirmPassword('');
            return;
        } catch (error) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case 'auth/invalid-email':
                        setError2(t('AuthForm.error.invalidEmail'));
                        return;
                    case 'auth/user-disabled':
                        setError2(t('AuthForm.error.userDisabled'));
                        return;
                    case 'auth/user-not-found':
                        setError2(t('AuthForm.error.userNotFound'));
                        return;
                    case 'auth/wrong-password':
                        setError2(t('AuthForm.error.wrongPassword'));
                        return;
                    case 'auth/missing-password':
                        setError2(t('AuthForm.error.wrongPassword'));
                        return;
                    // https://zenn.dev/mekk/articles/4b563dc3813cd7
                    case 'auth/invalid-credential':
                        setError2(t('AuthForm.error.invalidCredential'));
                        return;
                    case 'auth/email-already-in-use':
                        setError2(t('AuthForm.error.emailAlreadyInUse'));
                        return;
                    case 'auth/weak-password':
                        setError2(t('AuthForm.error.weakPassword'));
                        return;
                    case 'auth/too-many-requests':
                        setError2(t('AuthForm.error.tooManyRequests'));
                        return;
                    case 'auth/network-request-failed':
                        setError2(t('AuthForm.error.networkError'));
                        return;
                    default:
                        console.error(error.code);
                        setError2(t('AuthForm.error.unknownError'));
                        return;
                }
            } else {
                console.error(error);
                setError2(t('AuthForm.error.unknownError'));
                return;
            }
        }
    };

    const handleAccountDelete = () => {
        // 確認ダイアログなど
        if (confirm('本当にアカウントを削除しますか？')) {
            alert('アカウントを削除しました');
        }
    };

    useEffect(() => {
        // コンポーネントマウント時に実行
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user.email);
                setCurrentEmail(user.email || '-');
            } else {
                console.log('ログインしていません。');
                setCurrentEmail('');
            }
        });
        // コンポーネントアンマウント時にリスナー解除
        return () => unsubscribe();
    }, []);

    return (
        <div>
            <div className='space-y-4'>
                <h1 className='text-2xl font-bold'>アカウント設定</h1>

                <div className='card bg-base-100 shadow-md'>
                    <div className='card-body space-y-2'>
                        <h2 className='card-title text-lg font-semibold'>メールアドレス変更</h2>
                        <div>
                            <p className='text-gray-600'>現在のアドレス</p>
                            <p className='text-base font-medium'>{currentEmail}</p>
                        </div>
                        <input type='email' placeholder='新しいメールアドレス' value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className='input text-base' />
                        <input type='password' placeholder='現在のパスワード' value={currentPassword1} onChange={(e) => setCurrentPassword1(e.target.value)} className='input text-base' />
                        <p className='text-sm text-error'>{error1}</p>
                        <div className='card-actions justify-start'>
                            <button
                                onClick={() => {
                                    handleEmailChange();
                                }}
                                className='btn btn-soft'
                            >
                                変更する
                            </button>
                        </div>
                    </div>
                </div>

                <div className='card bg-base-100 shadow-md'>
                    <div className='card-body space-y-2'>
                        <h2 className='card-title text-lg font-semibold'>パスワード変更</h2>
                        <input type='password' placeholder='現在のパスワード' value={currentPassword2} onChange={(e) => setCurrentPassword2(e.target.value)} className='input text-base' />
                        <input type='password' placeholder='新しいパスワード' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className='input text-base' />
                        <input type='password' placeholder='新しいパスワードを確認' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='input text-base' />
                        <p className='text-sm text-error'>{error2}</p>
                        <div className='card-actions justify-start'>
                            <button
                                onClick={() => {
                                    handlePasswordChange();
                                }}
                                className='btn btn-soft'
                            >
                                変更する
                            </button>
                        </div>
                    </div>
                </div>

                <div className='card bg-base-100 shadow-md'>
                    <div className='card-body space-y-2'>
                        <h2 className='card-title text-lg font-semibold text-red-600'>アカウント削除</h2>
                        <p className='text-gray-600'>アカウントを削除すると、すべてのデータが失われ復元できません。本当に削除しますか？</p>
                        <div className='card-actions justify-start'>
                            <button
                                onClick={() => {
                                    handleAccountDelete();
                                }}
                                className='btn border-red-600 bg-red-600 text-white hover:bg-red-700'
                            >
                                アカウントを削除する
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect, useRef, RefObject } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { FirebaseError } from 'firebase/app';
import { getAuth, verifyBeforeUpdateEmail, updatePassword, signOut, deleteUser, onAuthStateChanged, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { app, handleFirebaseError } from '@/lib/firebase';
import { handleSessionLogout } from '@/lib/handleSession';

type AuthAction = 'changeEmail' | 'changePassword' | 'deleteAccount';

export default function UserSettings() {
    const t = useTranslations();

    const [currentPassword, setCurrentPassword] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error1, setError1] = useState('');
    const [error2, setError2] = useState('');
    const [error3, setError3] = useState('');

    const [actionType, setActionType] = useState<AuthAction | null>(null);

    const router = useRouter();
    const locale = useLocale();

    const auth = getAuth(app);

    const passwordCheckModalRef = useRef<HTMLDialogElement>(null);

    // Open the modal
    const showModal = (ref: RefObject<HTMLDialogElement | null>): void => {
        ref.current?.showModal();
        return;
    };

    // Close the modal
    const closeModal = (ref: RefObject<HTMLDialogElement | null>): void => {
        ref.current?.close();
        return;
    };

    const checkInput = (action: AuthAction): void => {
        // メールアドレスが空ならエラー
        if (action === 'changeEmail' && !newEmail) {
            setError1(t('AuthError.emptyFields'));
            return;
        }
        // メールアドレスが正しい形式ではないならエラー
        // See: https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)
        if (action === 'changeEmail' && !newEmail.match(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
            setError1(t('AuthError.invalidEmail'));
            return;
        }
        // パスワードが空ならエラー
        if (action === 'changePassword' && (!newPassword || !confirmPassword)) {
            setError2(t('AuthError.emptyFields'));
            return;
        }
        // パスワードが短すぎるならエラー
        if (action === 'changePassword' && newPassword.length < 8) {
            setError2(t('AuthError.invalidPassword'));
            return;
        }
        // パスワードと確認用パスワードが一致しないならエラー
        if (action === 'changePassword' && newPassword !== confirmPassword) {
            setError2(t('AuthError.passwordsDoNotMatch'));
            return;
        }
        setError1('');
        setError2('');
        setActionType(action);
        // モーダルをオープン
        showModal(passwordCheckModalRef);
        return;
    };

    const handleAction = async (): Promise<void> => {
        // パスワードが空ならエラー
        if (!currentPassword) {
            setError3(t('AuthError.emptyFields'));
            return;
        }
        setError3('');

        if (actionType === 'changeEmail') {
            await handleEmailChange();
            return;
        } else if (actionType === 'changePassword') {
            await handlePasswordChange();
            return;
        } else if (actionType === 'deleteAccount') {
            await handleAccountDelete();
            return;
        } else {
            console.error('UNDEFINED_ACTION');
            return;
        }
    };

    const handleEmailChange = async (): Promise<void> => {
        // Set the language code for Firebase Auth
        auth.languageCode = locale;

        try {
            // 資格情報（credential）を作成
            const credential = EmailAuthProvider.credential(auth.currentUser!.email!, currentPassword);
            // 再認証実行
            const userCredential = await reauthenticateWithCredential(auth.currentUser!, credential);
            // メールアドレスを更新し、認証メールを送信
            await verifyBeforeUpdateEmail(userCredential.user, newEmail);
            // ログアウト
            await signOut(auth);
            // ページを切り替え
            router.push('/verify-email', { locale: locale });
            return;
        } catch (error) {
            if (error instanceof FirebaseError) {
                setError3(t(handleFirebaseError(error)));
                return;
            } else {
                console.error(error);
                setError3(t('AuthError.unknownError'));
                return;
            }
        }
    };

    const handlePasswordChange = async (): Promise<void> => {
        // Set the language code for Firebase Auth
        auth.languageCode = locale;

        try {
            // 資格情報（credential）を作成
            const credential = EmailAuthProvider.credential(auth.currentUser!.email!, currentPassword);
            // 再認証実行
            const userCredential = await reauthenticateWithCredential(auth.currentUser!, credential);
            // パスワードを更新
            await updatePassword(userCredential.user, newPassword);
            alert(t('UserSettings.passwordUpdated'));
            // パスワード入力欄を初期化
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            // モーダルを閉じる
            closeModal(passwordCheckModalRef);
            return;
        } catch (error) {
            if (error instanceof FirebaseError) {
                setError3(t(handleFirebaseError(error)));
                return;
            } else {
                console.error(error);
                setError3(t('AuthError.unknownError'));
                return;
            }
        }
    };

    const handleAccountDelete = async (): Promise<void> => {
        try {
            if (confirm(t('UserSettings.confirmDeleteAccount'))) {
                // 資格情報（credential）を作成
                const credential = EmailAuthProvider.credential(auth.currentUser!.email!, currentPassword);
                // 再認証実行
                const userCredential = await reauthenticateWithCredential(auth.currentUser!, credential);
                // セッションログアウトを試行
                const isSessionLogoutSuccess = await handleSessionLogout();
                // セッションログアウト成功
                if (isSessionLogoutSuccess) {
                    // アカウントを削除
                    await deleteUser(userCredential.user);
                    alert(t('UserSettings.accountDeleted'));
                    // ページを切り替え
                    router.push('/register', { locale: locale });
                    return;
                }
                // セッションログアウト失敗
                else {
                    alert(t('AuthError.sessionLogoutFailed'));
                    return;
                }
            } else {
                return;
            }
        } catch (error) {
            if (error instanceof FirebaseError) {
                setError3(t(handleFirebaseError(error)));
                return;
            } else {
                setError3(t('AuthError.unknownError'));
                return;
            }
        }
    };

    useEffect(() => {
        // コンポーネントマウント時に実行
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentEmail(user?.email || '-');
        });
        // コンポーネントアンマウント時にリスナー解除
        return () => unsubscribe();
    }, []);

    return (
        <div>
            <div className='space-y-4'>
                <h1 className='text-2xl font-bold'>{t('UserSettings.accountSettings')}</h1>

                <div className='card bg-base-100 shadow-md'>
                    <div className='card-body space-y-2'>
                        <h2 className='card-title text-lg font-semibold'>{t('UserSettings.changeEmail')}</h2>
                        <div>
                            <p className='text-gray-600'>{t('UserSettings.currentEmail')}</p>
                            <p className='text-base font-medium'>{currentEmail}</p>
                        </div>
                        <input type='email' placeholder={t('UserSettings.newEmailPlaceholder')} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className='input text-base' />
                        <p className='text-sm text-error'>{error1}</p>
                        <div className='card-actions justify-start'>
                            <button onClick={() => checkInput('changeEmail')} className='btn btn-soft'>
                                {t('UserSettings.changeButton')}
                            </button>
                        </div>
                    </div>
                </div>

                <div className='card bg-base-100 shadow-md'>
                    <div className='card-body space-y-2'>
                        <h2 className='card-title text-lg font-semibold'>{t('UserSettings.changePassword')}</h2>
                        <input
                            type='password'
                            placeholder={t('UserSettings.newPasswordPlaceholder')}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className='input text-base'
                        />
                        <input
                            type='password'
                            placeholder={t('UserSettings.confirmPasswordPlaceholder')}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className='input text-base'
                        />
                        <p className='text-sm text-error'>{error2}</p>
                        <div className='card-actions justify-start'>
                            <button onClick={() => checkInput('changePassword')} className='btn btn-soft'>
                                {t('UserSettings.changeButton')}
                            </button>
                        </div>
                    </div>
                </div>

                <div className='card bg-base-100 shadow-md'>
                    <div className='card-body space-y-2'>
                        <h2 className='card-title text-lg font-semibold text-red-600'>{t('UserSettings.deleteAccount')}</h2>
                        <p className='text-gray-600'>{t('UserSettings.deleteAccountWarning')}</p>
                        <div className='card-actions justify-start'>
                            <button onClick={() => checkInput('deleteAccount')} className='btn border-red-600 bg-red-600 text-white hover:bg-red-700'>
                                {t('UserSettings.deleteAccountButton')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/*--------------------パスワード確認モーダル--------------------*/}
            <dialog ref={passwordCheckModalRef} className='modal'>
                <div className='modal-box min-w-xs max-w-sm space-y-3'>
                    <h3 className='font-bold text-lg'>{t('UserSettings.confirmPassword')}</h3>
                    <input
                        type='password'
                        placeholder={t('UserSettings.enterCurrentPassword')}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className='input text-base'
                    />
                    <p className='text-sm text-error mt-2'>{error3}</p>

                    <div className='flex justify-end space-x-2'>
                        <button className='btn' onClick={() => closeModal(passwordCheckModalRef)}>
                            {t('UserSettings.cancel')}
                        </button>
                        <button className='btn btn-primary' onClick={() => handleAction()}>
                            {t('UserSettings.execute')}
                        </button>
                    </div>
                </div>
            </dialog>
            {/*--------------------パスワード確認モーダル--------------------*/}
        </div>
    );
}

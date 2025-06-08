'use client';

import { useState, useEffect, useRef, RefObject } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { FirebaseError } from 'firebase/app';
import { getAuth, verifyBeforeUpdateEmail, updatePassword, signOut, deleteUser, onAuthStateChanged, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { app } from '@/lib/firebase';

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
            setError1(t('AuthForm.error.emptyFields'));
            return;
        }
        // メールアドレスが正しい形式ではないならエラー
        // See: https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)
        if (action === 'changeEmail' && !newEmail.match(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
            setError1(t('AuthForm.error.invalidEmail'));
            return;
        }
        // パスワードが空ならエラー
        if (action === 'changePassword' && (!newPassword || !confirmPassword)) {
            setError2(t('AuthForm.error.emptyFields'));
            return;
        }
        // パスワードが短すぎるならエラー
        if (action === 'changePassword' && newPassword.length < 8) {
            setError2(t('AuthForm.error.shortPassword'));
            return;
        }
        // パスワードと確認用パスワードが一致しないならエラー
        if (action === 'changePassword' && newPassword !== confirmPassword) {
            setError2(t('AuthForm.error.passwordsDoNotMatch'));
            return;
        }
        setError1('');
        setError2('');
        setActionType(action);
        showModal(passwordCheckModalRef);
        return;
    };

    const handleAction = async (): Promise<void> => {
        // パスワードが空ならエラー
        if (!currentPassword) {
            setError3(t('AuthForm.error.emptyFields'));
            return;
        }
        setError3('');

        if (actionType === 'changeEmail') {
            await handleEmailChange();
        } else if (actionType === 'changePassword') {
            await handlePasswordChange();
        } else if (actionType === 'deleteAccount') {
            await handleAccountDelete();
        } else {
            console.error('Error');
            setError3(t('AuthForm.error.unknownError'));
        }

        closeModal(passwordCheckModalRef);
        return;
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
        // Set the language code for Firebase Auth
        auth.languageCode = locale;

        try {
            // 資格情報（credential）を作成
            const credential = EmailAuthProvider.credential(auth.currentUser!.email!, currentPassword);
            // 再認証実行
            const userCredential = await reauthenticateWithCredential(auth.currentUser!, credential);
            // パスワードを更新
            await updatePassword(userCredential.user, newPassword);
            alert('パスワードを更新しました。');
            // パスワード入力欄を初期化
            setCurrentPassword('');
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

    const handleAccountDelete = async (): Promise<void> => {
        try {
            if (confirm('本当にアカウントを削除しますか？')) {
                // 資格情報（credential）を作成
                const credential = EmailAuthProvider.credential(auth.currentUser!.email!, currentPassword);
                // 再認証実行
                const userCredential = await reauthenticateWithCredential(auth.currentUser!, credential);
                // アカウントを削除
                await deleteUser(userCredential.user);
                alert('アカウントを削除しました');
                router.push('/register', { locale: locale });
                return;
            }
            return;
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error(error.code);
                return;
            } else {
                console.error(error);
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
                <h1 className='text-2xl font-bold'>アカウント設定</h1>

                <div className='card bg-base-100 shadow-md'>
                    <div className='card-body space-y-2'>
                        <h2 className='card-title text-lg font-semibold'>メールアドレス変更</h2>
                        <div>
                            <p className='text-gray-600'>現在のメールアドレス</p>
                            <p className='text-base font-medium'>{currentEmail}</p>
                        </div>
                        <input type='email' placeholder='新しいメールアドレスを入力' value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className='input text-base' />
                        <p className='text-sm text-error'>{error1}</p>
                        <div className='card-actions justify-start'>
                            <button onClick={() => checkInput('changeEmail')} className='btn btn-soft'>
                                変更する
                            </button>
                        </div>
                    </div>
                </div>

                <div className='card bg-base-100 shadow-md'>
                    <div className='card-body space-y-2'>
                        <h2 className='card-title text-lg font-semibold'>パスワード変更</h2>
                        <input type='password' placeholder='新しいパスワードを入力' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className='input text-base' />
                        <input type='password' placeholder='新しいパスワードを確認' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='input text-base' />
                        <p className='text-sm text-error'>{error2}</p>
                        <div className='card-actions justify-start'>
                            <button onClick={() => checkInput('changePassword')} className='btn btn-soft'>
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
                            <button onClick={() => checkInput('deleteAccount')} className='btn border-red-600 bg-red-600 text-white hover:bg-red-700'>
                                アカウントを削除する
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/*--------------------パスワード確認モーダル--------------------*/}
            <dialog ref={passwordCheckModalRef} className='modal'>
                <div className='modal-box min-w-xs max-w-sm space-y-3'>
                    <h3 className='font-bold text-lg'>パスワードを確認</h3>
                    <input type='password' placeholder='現在のパスワード' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className='input text-base' />
                    <p className='text-sm text-error mt-2'>{error3}</p>

                    <div className='flex justify-end space-x-2'>
                        <button className='btn' onClick={() => closeModal(passwordCheckModalRef)}>
                            キャンセル
                        </button>
                        <button className='btn btn-primary' onClick={() => handleAction()}>
                            実行
                        </button>
                    </div>
                </div>
            </dialog>
            {/*--------------------パスワード確認モーダル--------------------*/}
        </div>
    );
}

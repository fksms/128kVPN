'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { auth, handleFirebaseError } from '@/lib/firebase';
import { sessionLogin } from '@/lib/handleSession';
import { ErrorCodes } from '@/lib/errorCodes';
import LanguageDropdown from '@/components/LanguageDropdown';
import SocialLoginButton from '@/components/SocialLoginButton';

type AuthAction = 'login' | 'register' | 'forgotPassword' | 'verifyEmail' | 'forgotPasswordSentEmail';

type Props = {
    action: AuthAction;
};

export default function AuthForm({ action }: Props) {
    const t = useTranslations();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();
    const locale = useLocale();

    const handleAuth = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        // Prevent the default form submission
        e.preventDefault();

        // メールアドレスが空ならエラー
        if (!email) {
            setError(t('AuthError.emptyFields'));
            return;
        }
        // メールアドレスが正しい形式ではないならエラー
        // See: https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)
        if (!email.match(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
            setError(t('AuthError.invalidEmail'));
            return;
        }
        // パスワードが空ならエラー
        if ((action === 'login' || action === 'register') && !password) {
            setError(t('AuthError.emptyFields'));
            return;
        }
        // パスワードが短すぎるならエラー
        if (action === 'register' && password.length < 8) {
            setError(t('AuthError.invalidPassword'));
            return;
        }
        // パスワードと確認用パスワードが一致しないならエラー
        if (action === 'register' && password !== confirmPassword) {
            setError(t('AuthError.passwordsDoNotMatch'));
            return;
        }
        setError('');

        // Set the language code for Firebase Auth
        auth.languageCode = locale;

        try {
            // ログイン時の処理
            if (action === 'login') {
                // サインイン
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                // セッションログインを試行
                await sessionLogin(userCredential);
                // ページを切り替え
                router.push('/dashboard', { locale: locale });
                return;
            }
            // 登録時の処理
            else if (action === 'register') {
                // ユーザーを作成
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // 認証メールを送信
                await sendEmailVerification(userCredential.user);
                // ページを切り替え
                router.push('/verify-email', { locale: locale });
                return;
            }
            // パスワードリセット時の処理
            else if (action === 'forgotPassword') {
                // パスワードリセットメールを送信
                await sendPasswordResetEmail(auth, email);
                // ページを切り替え
                router.push('/forgot-password/sent', { locale: locale });
                return;
            }
            // 不明なエラー
            else {
                console.error('UNDEFINED_ACTION');
                return;
            }
        } catch (error) {
            if (error instanceof FirebaseError) {
                setError(t(handleFirebaseError(error)));
                return;
            } else if (error instanceof Error && error.message === ErrorCodes.UNVERIFIED_EMAIL) {
                setError(t('AuthError.unverifiedEmail'));
                return;
            } else {
                console.error(error);
                setError(t('AuthError.unknownError'));
                return;
            }
        }
    };

    return (
        <div>
            <div className='relative flex flex-col items-center justify-center h-screen overflow-hidden px-8'>
                <div className='w-full px-6 py-4 bg-base-100 rounded-md shadow-lg max-w-sm'>
                    <h1 className='text-3xl pb-6 font-semibold text-center text-gray-700'>Test</h1>
                    <form className='space-y-4' onSubmit={(e) => handleAuth(e)}>
                        {(action === 'login' || action === 'register' || action === 'forgotPassword') && (
                            <div>
                                <label className='label pb-1'>
                                    <span className='text-sm label-text'>{t('AuthForm.email')}</span>
                                </label>
                                <input type='email' className='w-full input input-bordered text-base' value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        )}

                        {(action === 'login' || action === 'register') && (
                            <div>
                                <label className='label pb-1'>
                                    <span className='text-sm label-text'>{t('AuthForm.password')}</span>
                                </label>
                                <input type='password' className='w-full input input-bordered text-base' value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        )}

                        {action === 'register' && (
                            <div>
                                <label className='label pb-1'>
                                    <span className='text-sm label-text'>{t('AuthForm.confirmPassword')}</span>
                                </label>
                                <input type='password' className='w-full input input-bordered text-base' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                        )}

                        <p className='text-sm text-error'>{error}</p>

                        {action === 'login' && (
                            <div className='py-2'>
                                <button type='submit' className='btn btn-block btn-neutral'>
                                    {t('AuthForm.loginButton')}
                                </button>
                            </div>
                        )}

                        {action === 'register' && (
                            <div className='py-2'>
                                <button type='submit' className='btn btn-block'>
                                    {t('AuthForm.registerButton')}
                                </button>
                            </div>
                        )}

                        {action === 'forgotPassword' && (
                            <div className='py-2'>
                                <button type='submit' className='btn btn-block'>
                                    {t('AuthForm.sendMailButton')}
                                </button>
                            </div>
                        )}

                        {action === 'login' && (
                            <div>
                                <a href='/register' className='text-sm text-blue-600 hover:text-blue-800 hover:underline'>
                                    {t('AuthForm.createAccount')}
                                </a>
                            </div>
                        )}

                        {action === 'login' && (
                            <div>
                                <a href='/forgot-password' className='text-sm text-blue-600 hover:text-blue-800 hover:underline'>
                                    {t('AuthForm.forgotPassword')}
                                </a>
                            </div>
                        )}

                        {action === 'verifyEmail' && (
                            <p className='text-sm text-gray-600 mb-6'>
                                {t('AuthForm.verifyEmail1')}
                                <br />
                                {t('AuthForm.verifyEmail2')}
                            </p>
                        )}

                        {action === 'forgotPasswordSentEmail' && (
                            <p className='text-sm text-gray-600 mb-6'>
                                {t('AuthForm.forgotPasswordSentEmail1')}
                                <br />
                                {t('AuthForm.forgotPasswordSentEmail2')}
                            </p>
                        )}

                        {(action === 'register' || action === 'forgotPassword' || action === 'verifyEmail' || action === 'forgotPasswordSentEmail') && (
                            <div>
                                <a href='/login' className='text-sm text-blue-600 hover:text-blue-800 hover:underline'>
                                    {t('AuthForm.backToLogin')}
                                </a>
                            </div>
                        )}
                    </form>

                    {(action === 'login' || action === 'register') && (
                        <div>
                            <SocialLoginButton />
                        </div>
                    )}

                    <hr className='w-full my-4 border-neutral-content' />
                    <LanguageDropdown size='xs' direction='start' buttonClassName='text-gray-500' />
                </div>
            </div>
        </div>
    );
}

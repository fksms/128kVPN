'use client';

import Image from 'next/image';
import QRCode from 'qrcode';
import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { maxInterfaceNameLength, maxInterfaces } from '@/env';
import { handleError } from '@/lib/errorCodes';
import { showModal, closeModal } from '@/components/handleModal';
import { useLoading } from '@/contexts/LoadingContext';

export type WGInterface = {
    name: string;
    ipAddress: string;
    clientConfig: string;
};

export default function WGInterfaceList() {
    const t = useTranslations();

    const { setLoading } = useLoading();

    const interfaceCreationModalRef = useRef<HTMLDialogElement>(null);
    const interfaceDeletionModalRef = useRef<HTMLDialogElement>(null);
    const qrDisplayModalRef = useRef<HTMLDialogElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [wgInterfaces, setWGInterfaces] = useState<WGInterface[]>([]);
    const [createWGInterfaceName, setCreateWGInterfaceName] = useState('');
    const [createWGInterfaceError, setCreateWGInterfaceError] = useState('');
    const [deleteWGInterfaceName, setDeleteWGInterfaceName] = useState('');
    const [deleteWGInterfaceError, setDeleteWGInterfaceError] = useState('');

    const [isModalLoading, setModalLoading] = useState(false);

    const [qrCodeDataURL, setQRCodeDataURL] = useState<string | null>(null);

    // -------------------- `getWGInterfaces` --------------------
    // Fetch the list of interfaces
    const getWGInterfaces = async (): Promise<void> => {
        try {
            const res = await fetch('/api/wg-interfaces', { method: 'GET', credentials: 'include' });
            const data = await res.json();

            // 以下、エラーハンドリング
            if (data.success) {
                setWGInterfaces(data.data);
                return;
            } else {
                console.error(data.code);
                return;
            }
        } catch (error) {
            console.error(error);
            return;
        }
    };
    // -------------------- `getWGInterfaces` --------------------

    // -------------------- `createWGInterface` --------------------
    // Create a new interface
    const createWGInterface = async (): Promise<void> => {
        // インターフェース名が空文字ならエラー
        if (createWGInterfaceName.length < 1) {
            setCreateWGInterfaceError(t('DashboardPage.interfaceConfigurationError.emptyName'));
            return;
        }
        // インターフェース名が長すぎるならエラー
        if (createWGInterfaceName.length > maxInterfaceNameLength) {
            setCreateWGInterfaceError(t('DashboardPage.interfaceConfigurationError.tooLongName'));
            return;
        }
        // 登録済みのインターフェース数が多すぎるならエラー
        if (wgInterfaces.length >= maxInterfaces) {
            setCreateWGInterfaceError(t('DashboardPage.interfaceConfigurationError.tooManyInterfaces'));
            return;
        }
        // 設定したインターフェース名と同名のインターフェース名がすでに存在しているならエラー
        if (wgInterfaces.some((wgInterface) => wgInterface.name === createWGInterfaceName)) {
            setCreateWGInterfaceError(t('DashboardPage.interfaceConfigurationError.alreadyExistsName'));
            return;
        }

        // ローディング開始
        setModalLoading(true);

        try {
            const res = await fetch('/api/wg-interfaces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'CREATE',
                    name: createWGInterfaceName,
                }),
                credentials: 'include',
            });
            const data = await res.json();

            // 以下、エラーハンドリング
            if (data.success) {
                // Reset the input field
                setCreateWGInterfaceName('');
                setCreateWGInterfaceError('');
                // Refresh the list
                getWGInterfaces();
                // Close the modal
                closeModal(interfaceCreationModalRef);
                return;
            } else {
                setCreateWGInterfaceError(t(handleError(data.code)));
                return;
            }
        } catch (error) {
            console.error(error);
            setCreateWGInterfaceError(t('DashboardPage.interfaceConfigurationError.failedToFetch'));
            return;
        } finally {
            // ローディング停止
            setModalLoading(false);
        }
    };
    // -------------------- `createWGInterface` --------------------

    // -------------------- `deleteWGInterface` --------------------
    // Delete an interface
    const deleteWGInterface = async (): Promise<void> => {
        // ローディング開始
        setModalLoading(true);

        try {
            const res = await fetch('/api/wg-interfaces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'DELETE',
                    name: deleteWGInterfaceName,
                }),
                credentials: 'include',
            });
            const data = await res.json();

            // 以下、エラーハンドリング
            if (data.success) {
                // Reset the input field
                setDeleteWGInterfaceName('');
                setDeleteWGInterfaceError('');
                // Refresh the list
                getWGInterfaces();
                // Close the modal
                closeModal(interfaceDeletionModalRef);
                return;
            } else {
                setDeleteWGInterfaceError(t(handleError(data.code)));
                return;
            }
        } catch (error) {
            console.error(error);
            setDeleteWGInterfaceError(t('DashboardPage.interfaceConfigurationError.failedToFetch'));
            return;
        } finally {
            // ローディング停止
            setModalLoading(false);
        }
    };
    // -------------------- `deleteWGInterface` --------------------

    // ファイルのダウンロード
    const downloadConfig = (text: string, filename: string): void => {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // メモリ解放
        return;
    };

    // QRコードの生成
    const generateQRCode = async (config: string): Promise<void> => {
        try {
            const dataURL = await QRCode.toDataURL(config, { type: 'image/webp' });
            setQRCodeDataURL(dataURL);
            return;
        } catch (error) {
            setQRCodeDataURL(null);
            console.error(error);
            return;
        }
    };

    useEffect(() => {
        // コンポーネントマウント時に実行
        getWGInterfaces();
        // ローディング停止
        setLoading(false);
        // 60秒ごとに実行
        const interval = setInterval(getWGInterfaces, 60 * 1000);
        // アンマウント時にインターバル解除
        return () => clearInterval(interval);
    }, [setLoading]);

    return (
        <div>
            <div className='flex justify-center max-w-full min-w-xs'>
                <div className='w-3xl px-4 py-4'>
                    {/*--------------------ボタン部--------------------*/}
                    <div className='flex justify-center pb-8'>
                        <button
                            className='btn btn-accent'
                            onClick={() => {
                                // Open the modal
                                showModal(interfaceCreationModalRef);
                                // inputにフォーカスを当てる（実行に50ミリ秒遅延させる）
                                /*
                                setTimeout(() => {
                                    inputRef.current?.focus();
                                }, 50);
                                */
                            }}
                        >
                            {t('DashboardPage.new')}
                        </button>
                    </div>
                    {/*--------------------ボタン部--------------------*/}

                    {/*--------------------リスト部--------------------*/}
                    <div className='flex flex-col space-y-5'>
                        {wgInterfaces.map((wgInterface) => (
                            <div className='card bg-base-100 shadow-md' key={wgInterface.name}>
                                <div className='card-body'>
                                    <div className='flex max-sm:flex-col sm:flex-row justify-between max-sm:space-y-4'>
                                        <div>
                                            <div className='font-medium card-title'>{wgInterface.name}</div>
                                            <div className='text-sm text-gray-500'>{wgInterface.ipAddress}</div>
                                        </div>
                                        <div className='flex items-center max-sm:justify-end space-x-2'>
                                            <button
                                                onClick={() => {
                                                    // Generate QR code
                                                    generateQRCode(wgInterface.clientConfig);
                                                    // Open the modal
                                                    showModal(qrDisplayModalRef);
                                                }}
                                                className='btn btn-square btn-md'
                                                title={t('DashboardPage.qrCode')}
                                            >
                                                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-6'>
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        d='M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z'
                                                    />
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        d='M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z'
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => downloadConfig(wgInterface.clientConfig, `${wgInterface.name}.conf`)}
                                                className='btn btn-square btn-md'
                                                title={t('DashboardPage.download')}
                                            >
                                                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-6'>
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3'
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Set the interface name to delete
                                                    setDeleteWGInterfaceName(wgInterface.name);
                                                    // Open the modal
                                                    showModal(interfaceDeletionModalRef);
                                                }}
                                                className='btn btn-square btn-md'
                                                title={t('DashboardPage.delete')}
                                            >
                                                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-6'>
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/*--------------------リスト部--------------------*/}

            {/*--------------------QR表示モーダル--------------------*/}
            <dialog ref={qrDisplayModalRef} className='modal'>
                <div className='modal-box min-w-xs max-w-sm'>
                    <button
                        className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10'
                        onClick={() => {
                            closeModal(qrDisplayModalRef);
                            setQRCodeDataURL(null);
                        }}
                    >
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-6'>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
                        </svg>
                    </button>
                    {qrCodeDataURL && <Image src={qrCodeDataURL} alt='QR Code' width={300} height={300} className='mx-auto w-90' />}
                </div>
            </dialog>
            {/*--------------------QR表示モーダル--------------------*/}

            {/*--------------------インターフェース作成モーダル--------------------*/}
            <dialog ref={interfaceCreationModalRef} className='modal'>
                <div className='modal-box min-w-xs max-w-sm'>
                    <h3 className='font-bold text-lg'>{t('DashboardPage.interfaceCreationModal.title')}</h3>
                    <p className='py-4'>{t('DashboardPage.interfaceCreationModal.description')}</p>
                    <input
                        ref={inputRef}
                        type='text'
                        value={createWGInterfaceName}
                        onChange={(e) => setCreateWGInterfaceName(e.target.value)}
                        placeholder={t('DashboardPage.interfaceCreationModal.placeholder')}
                        className='input text-base'
                    />
                    <p className='text-sm text-error mt-2'>{createWGInterfaceError}</p>

                    <div role='alert' className='alert alert-info alert-soft mt-4'>
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' className='stroke-info h-6 w-6 shrink-0'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                        </svg>
                        <span className='font-bold'>{t('DashboardPage.interfaceCreationModal.notice')}</span>
                    </div>

                    <div role='alert' className='alert alert-warning alert-soft mt-4'>
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' className='stroke-warning h-6 w-6 shrink-0'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                            />
                        </svg>
                        <span className='font-bold'>{t('DashboardPage.interfaceCreationModal.warning')}</span>
                    </div>

                    <div className='flex justify-end space-x-2 mt-4'>
                        {isModalLoading && <span className='loading loading-spinner loading-lg'></span>}
                        <button className='btn btn-soft btn-primary' disabled={isModalLoading} onClick={() => createWGInterface()}>
                            {t('DashboardPage.interfaceCreationModal.submit')}
                        </button>
                        <button
                            className='btn'
                            disabled={isModalLoading}
                            onClick={() => {
                                closeModal(interfaceCreationModalRef);
                                setCreateWGInterfaceError('');
                            }}
                        >
                            {t('DashboardPage.interfaceCreationModal.cancel')}
                        </button>
                    </div>
                </div>
            </dialog>
            {/*--------------------インターフェース作成モーダル--------------------*/}

            {/*--------------------インターフェース削除モーダル--------------------*/}
            <dialog ref={interfaceDeletionModalRef} className='modal'>
                <div className='modal-box min-w-xs max-w-sm'>
                    <h3 className='font-bold text-lg'>{t('DashboardPage.interfaceDeletionModal.title')}</h3>
                    <div role='alert' className='alert alert-warning mt-4'>
                        <span>{deleteWGInterfaceName}</span>
                    </div>
                    <p className='pt-4'>{t('DashboardPage.interfaceDeletionModal.description')}</p>
                    <p className='text-sm text-error mt-2'>{deleteWGInterfaceError}</p>

                    <div className='flex justify-end space-x-2 mt-4'>
                        {isModalLoading && <span className='loading loading-spinner loading-lg'></span>}
                        <button className='btn btn-soft btn-primary' disabled={isModalLoading} onClick={() => deleteWGInterface()}>
                            {t('DashboardPage.interfaceDeletionModal.submit')}
                        </button>
                        <button
                            className='btn'
                            disabled={isModalLoading}
                            onClick={() => {
                                closeModal(interfaceDeletionModalRef);
                                setDeleteWGInterfaceError('');
                            }}
                        >
                            {t('DashboardPage.interfaceDeletionModal.cancel')}
                        </button>
                    </div>
                </div>
            </dialog>
            {/*--------------------インターフェース削除モーダル--------------------*/}
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { WGInterface } from '@/database/db';
import { maxInterfaceNameLength, maxInterfaces } from '@/env';
import { ErrorCodes } from '@/lib/errorCodes';
import CountdownTimer from './CountdownTimer';

// Open the modal
function showModal(id: string) {
    return (document.getElementById(id) as HTMLDialogElement).showModal();
}

// Close the modal
function closeModal(id: string) {
    return (document.getElementById(id) as HTMLDialogElement).close();
}

export default function WGInterfaceList() {
    const CreateInterfaceModalId = 'create_interface_modal';
    const DeleteInterfaceModalId = 'delete_interface_modal';

    const t = useTranslations();

    const [wgInterfaces, setWGInterfaces] = useState<WGInterface[]>([]);

    const [createWGInterfaceName, setCreateWGInterfaceName] = useState('');
    const [createWGInterfaceError, setCreateWGInterfaceError] = useState('');

    const [deleteWGInterfaceName, setDeleteWGInterfaceName] = useState('');
    //const [deleteWGInterfaceError, setDeleteWGInterfaceError] = useState('');

    // Fetch the list of interfaces
    const getWGInterfaces = async () => {
        try {
            const res = await fetch('/api/wg-interfaces', { method: 'GET' });
            const data = await res.json();

            if (data.success) {
                setWGInterfaces(data.data);
            } else {
                throw new Error(data.code);
            }
        } catch (error) {
            throw new Error(ErrorCodes.FAILED_TO_FETCH);
        }
    };

    // Create a new interface
    const createWGInterface = async () => {
        // 空文字ならエラー
        if (createWGInterfaceName.length < 1) {
            setCreateWGInterfaceError(t('WGInterfaceList.CreateModal.emptyName'));
            return;
        }
        // 20文字を超えているならエラー
        if (createWGInterfaceName.length > maxInterfaceNameLength) {
            setCreateWGInterfaceError(t('WGInterfaceList.CreateModal.tooLongName'));
            return;
        }
        // インターフェースが10個以上ならエラー
        if (wgInterfaces.length >= maxInterfaces) {
            setCreateWGInterfaceError(t('WGInterfaceList.CreateModal.tooManyInterfaces'));
            return;
        }
        // インターフェース名がすでに存在しているならエラー
        if (wgInterfaces.some((wgInterface) => wgInterface.name === createWGInterfaceName)) {
            setCreateWGInterfaceError(t('WGInterfaceList.CreateModal.alreadyexistsName'));
            return;
        }

        try {
            const res = await fetch('/api/wg-interfaces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'create',
                    name: createWGInterfaceName,
                }),
            });
            const data = await res.json();

            if (data.success) {
                // Reset the input field
                setCreateWGInterfaceName('');
                setCreateWGInterfaceError('');
                // Close the modal
                closeModal(CreateInterfaceModalId);
                // Refresh the list
                getWGInterfaces();
            } else {
                throw new Error(data.code);
            }
        } catch (error) {
            throw new Error(ErrorCodes.FAILED_TO_FETCH);
        }
    };

    // Delete an interface
    const deleteWGInterface = async () => {
        try {
            const res = await fetch('/api/wg-interfaces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'delete',
                    name: deleteWGInterfaceName,
                }),
            });
            const data = await res.json();

            if (data.success) {
                // Reset the input field
                setDeleteWGInterfaceName('');
                // Close the modal
                closeModal(DeleteInterfaceModalId);
                // Refresh the list
                getWGInterfaces();
            } else {
                throw new Error(data.code);
            }
        } catch (error) {
            throw new Error(ErrorCodes.FAILED_TO_FETCH);
        }
    };

    // Execute the function when the component mounts
    useEffect(() => {
        getWGInterfaces();
    }, []);

    return (
        <div className='space-y-4'>
            {/*--------------------ボタン部--------------------*/}
            <div className='flex justify-center pb-4'>
                <button
                    className='btn btn-accent'
                    onClick={() => {
                        // Open the modal
                        showModal(CreateInterfaceModalId);
                    }}
                >
                    {t('WGInterfaceList.new')}
                </button>
            </div>
            {/*--------------------ボタン部--------------------*/}

            {/*--------------------インターフェース作成モーダル--------------------*/}
            <dialog id={CreateInterfaceModalId} className='modal'>
                <div className='modal-box w-85 max-w-md'>
                    <h3 className='font-bold text-lg'>{t('WGInterfaceList.CreateModal.title')}</h3>
                    <p className='py-4'>{t('WGInterfaceList.CreateModal.description')}</p>
                    <input
                        type='text'
                        value={createWGInterfaceName}
                        onChange={(e) => setCreateWGInterfaceName(e.target.value)}
                        placeholder={t('WGInterfaceList.CreateModal.placeholder')}
                        className='input'
                    />
                    <p className='text-sm text-error mt-2'>{createWGInterfaceError}</p>

                    <div className='flex justify-end space-x-2 mt-4'>
                        <button
                            className='btn btn-soft btn-primary'
                            onClick={() => {
                                createWGInterface();
                            }}
                        >
                            {t('WGInterfaceList.CreateModal.submit')}
                        </button>
                        <button
                            className='btn'
                            onClick={() => {
                                closeModal(CreateInterfaceModalId);
                                setCreateWGInterfaceError('');
                            }}
                        >
                            {t('WGInterfaceList.CreateModal.cancel')}
                        </button>
                    </div>
                </div>
            </dialog>
            {/*--------------------インターフェース作成モーダル--------------------*/}

            {/*--------------------リスト部--------------------*/}
            <div className='flex flex-col space-y-5'>
                {wgInterfaces.map((wgInterface) => (
                    <div className='card bg-base-100 shadow-md' key={wgInterface.name}>
                        <div className='card-body'>
                            <div className='flex justify-between'>
                                <div>
                                    <div className='font-medium card-title'>{wgInterface.name}</div>

                                    <div className='text-sm text-gray-500'>{wgInterface.ip_address}</div>
                                    {/*
                                {downloadSpeed && (
                                    <div className="text-xs text-gray-400">
                                        ⬇ {downloadSpeed} ⬆ {uploadSpeed} ・ {lastSeen}
                                    </div>
                                )}
                                */}
                                </div>

                                <div className='flex items-center space-x-2'>
                                    <div className='mr-4'>
                                        <CountdownTimer expireAt={new Date(wgInterface.expires_at)} />
                                    </div>

                                    <button
                                        onClick={() => {}}
                                        className='btn btn-square btn-md'
                                        title={t('WGInterfaceList.qrCode')}
                                    >
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth={1.5}
                                            stroke='currentColor'
                                            className='size-6'
                                        >
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
                                        onClick={() => {}}
                                        className='btn btn-square btn-md'
                                        title={t('WGInterfaceList.download')}
                                    >
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth={1.5}
                                            stroke='currentColor'
                                            className='size-6'
                                        >
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
                                            showModal(DeleteInterfaceModalId);
                                        }}
                                        className='btn btn-square btn-md'
                                        title={t('WGInterfaceList.delete')}
                                    >
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth={1.5}
                                            stroke='currentColor'
                                            className='size-6'
                                        >
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
            {/*--------------------リスト部--------------------*/}

            {/*--------------------インターフェース削除モーダル--------------------*/}
            <dialog id={DeleteInterfaceModalId} className='modal'>
                <div className='modal-box w-85 max-w-md'>
                    <h3 className='font-bold text-lg'>{t('WGInterfaceList.DeleteModal.title')}</h3>
                    <div role='alert' className='alert alert-warning mt-4'>
                        <span>{deleteWGInterfaceName}</span>
                    </div>
                    <p className='py-4'>{t('WGInterfaceList.DeleteModal.description')}</p>

                    <div className='flex justify-end space-x-2'>
                        <button
                            className='btn btn-soft btn-primary'
                            onClick={() => {
                                deleteWGInterface();
                            }}
                        >
                            {t('WGInterfaceList.DeleteModal.submit')}
                        </button>
                        <button
                            className='btn'
                            onClick={() => {
                                closeModal(DeleteInterfaceModalId);
                            }}
                        >
                            {t('WGInterfaceList.DeleteModal.cancel')}
                        </button>
                    </div>
                </div>
            </dialog>
            {/*--------------------インターフェース削除モーダル--------------------*/}
        </div>
    );
}

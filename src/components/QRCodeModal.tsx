import { FC } from 'react';

type QRCodeModalProps = {
    visible: boolean;
    onClose: () => void;
    configText: string;
};

export const QRCodeModal: FC<QRCodeModalProps> = ({ visible, onClose, configText }) => {
    if (!visible) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-6 rounded-lg space-y-4 w-80'>
                <h2 className='text-lg font-bold'>QRコード</h2>
                <div className='border p-4 text-xs bg-gray-50 overflow-auto max-h-48'>{configText}</div>
                <button className='px-4 py-2 bg-blue-600 text-white rounded w-full' onClick={onClose}>
                    閉じる
                </button>
            </div>
        </div>
    );
};

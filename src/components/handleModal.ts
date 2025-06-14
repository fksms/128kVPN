import { RefObject } from 'react';

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

export { showModal, closeModal };

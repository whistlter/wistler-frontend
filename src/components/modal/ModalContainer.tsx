import React from 'react';
import type { ModalData } from '@/providers/modal.types';
import { Modal } from './Modal';

interface ModalContainerProps {
    modals: ModalData[];
    closeModal: (id: number) => void;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({ modals, closeModal }) => {
    return (
        <>
            {modals.map(modal => (
                <Modal
                    key={modal.id}
                    modal={modal}
                    onClose={() => closeModal(modal.id)}
                />
            ))}
        </>
    );
};

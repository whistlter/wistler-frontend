import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ModalData, ModalOptions, ModalContextType } from './types';
import { ModalContainer } from './ModalContainer';

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [modals, setModals] = useState<ModalData[]>([]);

    const openModal = (content: ModalData['content'], options: ModalOptions = {}) => {
        const id = Date.now();

        // Close all existing modals before opening new one
        setModals(prev =>
            prev.map(modal => ({ ...modal, isClosing: true }))
        );

        // Remove closed modals after animation
        setTimeout(() => {
            setModals([{ id, content, options, isClosing: false }]);
        }, 300);

        return id;
    };

    const closeModal = (id: number) => {
        setModals(prev =>
            prev.map(modal =>
                modal.id === id ? { ...modal, isClosing: true } : modal
            )
        );
        setTimeout(() => {
            setModals(prev => prev.filter(modal => modal.id !== id));
        }, 300);
    };

    const closeAll = () => {
        modals.forEach(modal => closeModal(modal.id));
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal, closeAll }}>
            {children}
            <ModalContainer modals={modals} closeModal={closeModal} />
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within ModalProvider');
    }
    return context;
};

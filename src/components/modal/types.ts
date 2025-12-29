import type { ReactNode } from 'react';

export type ModalType = 'center' | 'side';

export interface ModalOptions {
    type?: ModalType;
    closeOnOverlay?: boolean;
    closeOnEsc?: boolean;
    showCloseButton?: boolean;
    width?: string;
}

export interface ModalData {
    id: number;
    content: ReactNode | ((props: { close: () => void }) => ReactNode);
    options: ModalOptions;
    isClosing: boolean;
}

export interface ModalContextType {
    openModal: (content: ModalData['content'], options?: ModalOptions) => number;
    closeModal: (id: number) => void;
    closeAll: () => void;
}

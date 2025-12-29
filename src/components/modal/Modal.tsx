import React, { useEffect } from 'react';
import type { ModalData } from './types';

interface ModalProps {
    modal: ModalData;
    onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ modal, onClose }) => {
    const { content, options, isClosing } = modal;
    const {
        type = 'center',
        closeOnOverlay = true,
        closeOnEsc = true,
        width = type === 'side' ? 'w-96' : 'max-w-lg'
    } = options;

    const [isAnimating, setIsAnimating] = React.useState(false);

    useEffect(() => {
        // Trigger animation after component mounts
        const timer = setTimeout(() => setIsAnimating(true), 2);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!closeOnEsc) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [closeOnEsc, onClose]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (closeOnOverlay && e.target === e.currentTarget) {
            onClose();
        }
    };

    if (type === 'side') {
        return (
            <div
                className={`fixed inset-0 z-50 flex justify-end transition-all duration-500 ease-in-out
    ${isClosing || !isAnimating ? 'bg-black/0' : 'bg-black/40'}
  `}
                onClick={handleOverlayClick}
            >
                <div
                    className={`bg-white h-full ${width} shadow-2xl
      transform transition-transform duration-300 ease-out
      rounded-tl-[20px] rounded-bl-[20px]
      overflow-hidden   // 🔥 THIS IS THE FIX
      ${isClosing || !isAnimating ? 'translate-x-full' : 'translate-x-0'}
    `}
                >
                    {typeof content === 'function'
                        ? content({ close: onClose })
                        : content}
                </div>
            </div>
        );
    }

    // Center modal (default) - slides up from bottom
    return (
        <div
            className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-all duration-700 ease-in-out ${isClosing || !isAnimating ? 'bg-black/0' : 'bg-black/50'
                }`}
            onClick={handleOverlayClick}
        >
            <div
                className={`bg-white rounded-lg shadow-xl w-full ${width} relative transform transition-all duration-600 ease-in-out max-h-[90vh] overflow-y-auto ${isClosing || !isAnimating ? 'translate-y-[100vh] opacity-0' : 'translate-y-0 opacity-100'
                    }`}
            >
                <div className="">
                    {typeof content === 'function' ? content({ close: onClose }) : content}
                </div>
            </div>
        </div>
    );
};
import toast from 'react-hot-toast';
import { CustomToast } from './CustomToast';

// Utility to trigger the toast
export const showSuccessToast = (title: string, message: string) => {
    toast.custom((t) => (
        <CustomToast t={t} title={title} message={message} type="success" />
    ));
};

export const showErrorToast = (title: string, message: string) => {
    toast.custom((t) => (
        <CustomToast t={t} title={title} message={message} type="error" />
    ));
};

// Extracts the actual backend error message from any error type
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message || 'Something went wrong. Please try again.';
    }
    return 'Something went wrong. Please try again.';
}

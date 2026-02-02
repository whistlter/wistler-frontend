import toast, { type Toast } from 'react-hot-toast';
import { X, Check } from 'lucide-react';

interface CustomToastProps {
    t: Toast;
    title: string;
    message: string;
    type?: 'success' | 'error';
}

export const CustomToast = ({ t, title, message, type = 'success' }: CustomToastProps) => {
    return (
        <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white shadow-lg rounded-2xl pointer-events-auto flex ring-1 ring-gray-200 ring-opacity-5`}
        >
            <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    {/* Icon */}
                    <div className="flex-shrink-0 pt-0.5">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${type === 'success' ? 'bg-[#22C55E15]' : 'bg-[#EF444415]'
                            }`}>
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
                                }`}>
                                <Check className="h-3 w-3 text-white" strokeWidth={3} />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="ml-3 flex-1">
                        <p className="text-[15px] font-semibold text-[#101828]">
                            {title}
                        </p>
                        <p className="mt-1 text-[13px] text-[#667085] leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>
            </div>

            {/* Close Button */}
            <div className="flex border-l border-transparent">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-start justify-center text-sm font-medium text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};


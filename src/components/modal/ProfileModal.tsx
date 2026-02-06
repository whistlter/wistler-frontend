import { useState } from "react";
import { Button } from "@/components/button/Button";
import { BUTTON_TYPE } from "@/components/button/constants";
import { AppIcons } from "@/constants/constant";

type ProfileModalProps = {
    image?: string;
    title: string;
    description?: string;
    body?: React.ReactNode;
    primaryLabel: string;
    onPrimaryAction: () => Promise<void> | void;
    showLoader?: boolean;
    autoCloseOnSuccess?: boolean;
    close: () => void;
};

export const ProfileModal = ({
    image,
    title,
    description,
    body,
    primaryLabel,
    onPrimaryAction,
    showLoader = false,
    autoCloseOnSuccess = true,
    close,
}: ProfileModalProps) => {
    const [loading, setLoading] = useState(false);

    const handlePrimaryClick = async () => {
        try {
            setLoading(true);
            await onPrimaryAction();
            if (autoCloseOnSuccess) close();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full relative">
            {/* Profile Header */}
            <div className="h-32 w-[95%] bg-[#FF2860] relative m-auto mt-4 rounded-2xl">
                <button
                    onClick={close}
                    className="absolute top-4 right-4 text-white hover:opacity-80 transition-opacity cursor-pointer"
                >
                    <img src={AppIcons.x} alt="Close" className="w-5 h-5 brightness-0 invert" />
                </button>
            </div>

            <div className="px-6 flex flex-col items-center">
                {/* Avatar - Negative margin to overlap */}
                <div className="-mt-10 mb-3 relative">
                    <div className="w-20 h-20 rounded-full p-1 ">
                        <div className="w-full h-full rounded-full bg-[#3d3d6b] flex items-center justify-center overflow-hidden">
                            {image ? (
                                <img src={image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <img src={AppIcons.profile} alt="Profile" className="w-10 h-10" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Name & Email */}
                <div className="text-center mb-6">
                    <div className="flex items-center gap-1.5 justify-center mb-1">
                        <h2 className="text-[17px] font-semibold text-[#101828]">
                            {title}
                        </h2>
                        <button className="text-[#FF2860]">
                            <img src={AppIcons.edit} alt="Edit" className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-[13px] text-[#666666] font-normal">
                        {description}
                    </p>
                </div>
            </div>

            {/* Body */}
            {body && <div className="px-6 pb-6">{body}</div>}

            {/* Footer */}
            <div className="flex items-center gap-2 self-stretch px-4 py-3 border-t border-[#E8E8E8] bg-white justify-between">
                <Button onClick={close} variant={BUTTON_TYPE.SECONDARY}>
                    Close
                </Button>
                <Button onClick={handlePrimaryClick} variant={BUTTON_TYPE.TETIARY}>
                    {loading && showLoader ? 'Processing…' : primaryLabel}
                </Button>
            </div>
        </div>
    );
};

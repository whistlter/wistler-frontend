import { useState } from "react";
import { Button } from "@/components/button/Button";
import { BUTTON_TYPE, type ButtonVariant } from "@/components/button/constants";
import { ActionType } from "@/constants/actions";
import { FormInput } from "@/components/inputs/FormInput";
import { INPUT_TYPES } from "@/components/inputs/constants";
import { SelectComponent } from "@/components/select/selectComponent";
import { AppIcons } from "@/constants/constant";

type ActionModalProps = {
    icon?: {
        eclipse: string,
        icon: string
    };
    image?: string; // For profile avatar
    title: string;
    description?: string;

    body?: React.ReactNode;

    warningText?: string;

    primaryLabel: string;
    primaryIntent?: 'default' | 'danger';
    onPrimaryAction: () => Promise<void> | void;

    showLoader?: boolean;
    autoCloseOnSuccess?: boolean;
    buttonVariant: ButtonVariant;

    close: () => void; // injected from modal system

    variant?: 'default' | 'profile'; // Default is 'default'
};

export const ActionModal = ({
    icon,
    image,
    title,
    description,
    buttonVariant,
    body,
    warningText,
    primaryLabel,
    onPrimaryAction,
    showLoader = false,
    autoCloseOnSuccess = true,
    close,
    variant = 'default',
}: ActionModalProps) => {
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
            {variant === 'profile' ? (
                <>
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
                </>
            ) : (
                /* Default Header */
                <div className="flex flex-col items-center px-8 pt-8 pb-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full  mb-2">
                        {icon && (
                            <div className="relative flex items-center justify-center">
                                <img src={icon.eclipse} alt="" className="relative w-full " />
                                <img src={icon.icon} alt="" className="absolute w-7" />
                            </div>
                        )}
                    </div>

                    <h2 className="text-[#0A0D14] text-center text-[16px] font-semibold">
                        {title}
                    </h2>

                    {description && (
                        <p className="text-[#666] text-center text-[12px] font-medium self-stretch">
                            {description}
                        </p>
                    )}
                </div>
            )}


            {/* Warning */}
            {(primaryLabel === ActionType.SEND_RESET_INSTRUCTION && warningText) && (
                <div className="flex items-center justify-center  p-3 rounded-2xl border border-[#EFEFF3] bg-[#F9F9F9] mx-6 text-[#666] text-center text-[13px] font-medium mb-6">
                    {warningText}
                </div>
            )}

            {(primaryLabel === ActionType.SUSPEND_COMMUNITY) && (

                <div className="w-full flex items-start flex-col gap-1 px-6">
                    <div className="">
                        Reason for suspension
                    </div>
                    <div className="py-1 w-full">
                        <FormInput type={INPUT_TYPES.TEXTAREA} placeholder="Write your reasons here" />
                    </div>

                </div>
            )}

            {(primaryLabel === ActionType.UPDATE_ROLE) && (

                <div className="w-full flex items-start flex-col gap-1 px-6 pb-6">
                    <div className="">
                        New Role
                    </div>
                    <div className="py-1 w-full">
                        <SelectComponent data={['me']} placeholder="Select a role" />
                    </div>

                </div>
            )}
            {/* Body */}
            {body && <div className={variant === 'profile' ? "px-6 pb-6" : "px-8"}>{body}</div>}

            {/* Footer */}
            <div className={`flex items-center gap-2 self-stretch px-4 py-3 border-t border-[#E8E8E8] bg-white ${variant === 'profile' ? 'justify-between' : ''}`}>
                {variant === 'profile' ? (
                    <>
                        <Button onClick={close} variant={BUTTON_TYPE.SECONDARY}>
                            Close
                        </Button>
                        <Button onClick={handlePrimaryClick} variant={BUTTON_TYPE.TETIARY}>
                            {loading && showLoader ? 'Processing…' : primaryLabel}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button onClick={close} variant={BUTTON_TYPE.SECONDARY}>
                            Cancel
                        </Button>

                        <Button onClick={handlePrimaryClick} disabled={loading} variant={buttonVariant}>
                            {loading && showLoader ? 'Processing…' : primaryLabel}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};
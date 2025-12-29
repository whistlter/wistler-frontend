import { useState } from "react";
import { Button } from "@/components/button/Button";
import { BUTTON_TYPE } from "@/components/button/constants";
import { ActionType } from "@/constants/actions";
import { FormInput } from "@/components/inputs/FormInput";
import { INPUT_TYPES } from "@/components/inputs/constants";
import { SelectComponent } from "@/components/select/selectComponent";

type ActionModalProps = {
    icon: {
        eclipse: any,
        icon: any
    };
    title: string;
    description?: string;

    body?: React.ReactNode;

    warningText?: string;

    primaryLabel: string;
    primaryIntent?: 'default' | 'danger';
    onPrimaryAction: () => Promise<void> | void;

    showLoader?: boolean;
    autoCloseOnSuccess?: boolean;
    buttonVariant: any;

    close: () => void; // injected from modal system
};

export const ActionModal = ({
    icon,
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
        <div className="w-full">
            {/* Header */}
            <div className="flex flex-col items-center px-8 pt-8 pb-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-pink-600 mb-2">
                    <div className="relative flex items-center justify-center">
                        <img src={icon.eclipse} alt="" className="relative w-full " />
                        <img src={icon.icon} alt="" className="absolute w-7" />
                    </div>
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
            {body && <div className="px-8">{body}</div>}

            {/* Footer */}
            <div className="flex items-center gap-2 self-stretch px-4 py-3 border-t border-[#E8E8E8] bg-white">

                <Button onClick={close} variant={BUTTON_TYPE.SECONDARY}>
                    Cancel
                </Button>

                <Button onClick={handlePrimaryClick} disabled={loading} variant={buttonVariant}>
                    {loading && showLoader ? 'Processing…' : primaryLabel}
                </Button>
            </div>
        </div>
    );
};
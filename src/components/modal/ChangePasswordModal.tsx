import { useState } from 'react';
import { showSuccessToast, showErrorToast, getErrorMessage } from "@/components/common/toastUtils";
import { Button } from "@/components/button/Button";
import { BUTTON_TYPE } from "@/components/button/constants";
import { FormInput } from "@/components/inputs/FormInput";
import { INPUT_TYPES } from "@/components/inputs/constants";
import { AppIcons } from "@/constants/constant";

type ChangePasswordModalProps = {
    close: () => void;
};

export const ChangePasswordModal = ({ close }: ChangePasswordModalProps) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);



    // ... existing code ...

    const handleSave = async () => {
        // Validation logic here (e.g., check fetch)
        if (newPassword !== confirmPassword) {
            showErrorToast("Validation Error", "New passwords do not match");
            return;
        }

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            showSuccessToast("Password Updated", "Your password has been changed successfully.");
            close();
        } catch (error) {
            showErrorToast("Update Failed", getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full relative bg-white rounded-2xl overflow-hidden max-w-[480px]">
            {/* Header */}
            <div className="flex flex-col items-center px-8 pt-8 pb-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full mb-4">
                    <div className="relative flex items-center justify-center">
                        <img src={AppIcons.eclipseRed} alt="" className="relative w-full" />
                        <img src={AppIcons.restoreRed} alt="" className="absolute w-7" />
                    </div>
                </div>

                <h2 className="text-[#0A0D14] text-center text-[20px] font-semibold mb-2">
                    Change Password
                </h2>

                <p className="text-[#666] text-center text-[14px] font-medium leading-normal max-w-[360px]">
                    Create a new password to keep your account secure. Make sure it is strong and not used elsewhere.
                </p>
            </div>

            {/* Body */}
            <div className="px-8 pb-8 space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#344054]">Old password</label>
                    <FormInput
                        type={INPUT_TYPES.PASSWORD}
                        placeholder="Enter password"
                        value={oldPassword}
                        onChange={setOldPassword}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#344054]">New password</label>
                    <FormInput
                        type={INPUT_TYPES.PASSWORD}
                        placeholder="Enter password"
                        value={newPassword}
                        onChange={setNewPassword}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#344054]">Confirm password</label>
                    <FormInput
                        type={INPUT_TYPES.PASSWORD}
                        placeholder="Enter password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-8 py-4 border-t border-[#E8E8E8]">
                <Button
                    onClick={close}
                    variant={BUTTON_TYPE.SECONDARY}
                    className="flex-1 justify-center"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant={BUTTON_TYPE.PRIMARY}
                    className="flex-1 justify-center bg-[#FF2860] hover:bg-[#D11A4B] border-[#FF2860]"
                    disabled={loading || !oldPassword || !newPassword || !confirmPassword}
                >
                    {loading ? 'Processing...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
};

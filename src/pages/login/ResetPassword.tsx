import { useNavigate, useSearchParams } from "react-router-dom";
import { showSuccessToast, showErrorToast, getErrorMessage } from "@/components/common/toastUtils";
import { logger } from "@/utils/logger";
import { FormInput } from "@/components/inputs/FormInput";
import { INPUT_TYPES } from "@/components/inputs/constants";
import { Button } from "@/components/button/Button";
import { useResetPassword } from "@/features/auth";
import { useState, useEffect } from "react";

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const { mutate, isPending } = useResetPassword();

    useEffect(() => {
        if (!token) {
            showErrorToast("Invalid Request", "Invalid or missing reset token");
            navigate("/forgot-password");
        }
    }, [token, navigate]);

    const onSubmit = () => {
        if (!password) {
            showErrorToast("Validation Error", "Please enter a new password");
            return;
        }

        if (password !== confirmPassword) {
            showErrorToast("Validation Error", "Passwords do not match");
            return;
        }

        if (!token) return;

        mutate(
            {
                token,
                newPassword: password
            },
            {
                onSuccess: () => {
                    logger.info("Password reset successfully");
                    showSuccessToast("Password Reset", "Your password has been reset successfully! You can now log in.");
                    navigate("/login");
                },
                onError: (error) => {
                    logger.error("Password reset failed", error);
                    showErrorToast("Reset Failed", getErrorMessage(error));
                },
            }
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
                {/* Header */}
                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border text-xl">
                        🛡️
                    </div>
                    <h1 className="text-lg font-semibold text-gray-900">
                        Create New Password
                    </h1>
                    <p className="text-sm text-gray-500">
                        Please enter and confirm your new password below.
                    </p>
                </div>

                {/* Form */}
                <div className="p-2 ">
                    <div className="self-stretch text-[#1A1A1A] text-[13px] font-medium pb-2">New Password</div>
                    <FormInput
                        type={INPUT_TYPES.PASSWORD}
                        placeholder="Enter new password"
                        onChange={setPassword}
                        value={password}
                    />
                </div>

                <div className="p-2 ">
                    <div className="self-stretch text-[#1A1A1A] text-[13px] font-medium pb-2">Confirm New Password</div>
                    <FormInput
                        type={INPUT_TYPES.PASSWORD}
                        placeholder="Confirm new password"
                        onChange={setConfirmPassword}
                        value={confirmPassword}
                    />
                </div>

                <div className="pt-4 px-2">
                    <Button
                        onClick={onSubmit}
                        disabled={isPending}
                    >
                        {isPending ? "Resetting…" : "Reset Password"}
                    </Button>
                </div>

                {/* Footer */}
                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-sm text-rose-500 hover:underline cursor-pointer"
                    >
                        Back to Log In
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;

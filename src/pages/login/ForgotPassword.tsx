import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { logger } from "@/utils/logger";
import { FormInput } from "@/components/inputs/FormInput";
import { INPUT_TYPES } from "@/components/inputs/constants";
import { Button } from "@/components/button/Button";
import { useForgotPassword } from "@/features/auth";
import { useState } from "react";
import { BUTTON_TYPE } from "@/components/button/constants";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const { mutate, isPending } = useForgotPassword();

    const onSubmit = () => {
        console.log("Submitting forgot password for:", email);
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        mutate(
            {
                email,
                returnUrl: `${window.location.origin}/change-password`
            },
            {
                onSuccess: (data) => {
                    console.log("Forgot password success:", data);
                    logger.info("Forgot password request sent successfully");
                    setSubmitted(true);
                },
                onError: (error: any) => {
                    console.error("Forgot password error details:", {
                        message: error.message,
                        code: error.code,
                        response: error.response?.data
                    });

                    const errorMessage = error.code === 'ECONNABORTED'
                        ? "Request timed out. The server might be slow or unreachable."
                        : (error.response?.data?.message || "Failed to send reset link. Please try again.");

                    toast.error(errorMessage);
                    logger.error("Forgot password request failed", error);
                },
            }
        );
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm text-center">
                    <div className="mb-6 flex flex-col items-center">
                        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 text-2xl">
                            📧
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            Check your email
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            We've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>.
                            Please confirm by clicking on the link sent.
                        </p>
                    </div>
                    <Button variant={BUTTON_TYPE.TETIARY} onClick={() => navigate("/login")}>
                        Back to Log In
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
                {/* Header */}
                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border text-xl">
                        🔑
                    </div>
                    <h1 className="text-lg font-semibold text-gray-900">
                        Forgot Password
                    </h1>
                    <p className="text-sm text-gray-500">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {/* Form */}
                <div className="p-2 ">
                    <div className="self-stretch text-[#1A1A1A] text-[13px] font-medium pb-2">Email Address</div>
                    <FormInput
                        type={INPUT_TYPES.EMAIL}
                        placeholder="Enter email address"
                        onChange={setEmail}
                        value={email}
                    />
                </div>

                <div className="pt-4 px-2">
                    <Button
                        onClick={onSubmit}
                        loading={isPending}
                    >
                        Send Reset Link
                    </Button>
                </div>

                {/* Footer */}
                <div className="mt-4 text-center">
                    <Button variant={BUTTON_TYPE.TETIARY} onClick={() => navigate("/login")}>
                        Back to Log In
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;

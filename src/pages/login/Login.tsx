import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "@/components/common/toastUtils";
import { logger } from "@/utils/logger";

import { FormInput } from "@/components/inputs/FormInput";
import { INPUT_TYPES } from "@/components/inputs/constants";
import { Button } from "@/components/button/Button";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useState } from "react";


// ----------------------
// Login Page
// ----------------------
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { mutate, isPending } = useLogin();

  const onSubmit = () => {
    mutate(
      { email, password },
      {
        onSuccess: () => {
          logger.info("User logged in successfully");
          showSuccessToast("Login Successful", "Welcome back!");
          navigate("/users");
        },
        onError: (error) => {
          logger.error("Login failed", error);
          showErrorToast("Login Failed", "Invalid email or password");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border">
            👤
          </div>
          <h1 className="text-lg font-semibold text-gray-900">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500">
            Sign in to access your admin workspace
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
        <div className="p-2">
          <div className="self-stretch text-[#1A1A1A] text-[13px] font-medium pb-2">Password</div>
          <FormInput
            type={INPUT_TYPES.PASSWORD}
            placeholder="Enter password"
            onChange={setPassword}
            value={password}
          />
        </div>

        <div className="pt-2">
          <Button
            onClick={onSubmit}
            disabled={isPending}
          >
            {isPending ? "Signing in…" : "Log In"}
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-rose-500 hover:underline cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
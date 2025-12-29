import { useState } from "react";
import { FormInput } from "@/components/inputs/FormInput";
import { INPUT_TYPES } from "@/components/inputs/constants";
import { BUTTON_TYPE } from "@/components/button/constants";
import { Button } from "@/components/button/Button";

// ----------------------
// Page
// ----------------------
function CreateNewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    console.log("NEW PASSWORD DATA:", { password, confirmPassword });
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border">
            🔒
          </div>
          <h1 className="text-lg font-semibold text-gray-900">
            Create a new password
          </h1>
          <p className="text-sm text-gray-500">
            Choose a strong password to secure your admin account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <FormInput
            type={INPUT_TYPES.PASSWORD}
            placeholder="Enter password"
            value={password}
            onChange={setPassword}
          />

          <FormInput
            type={INPUT_TYPES.PASSWORD}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />

          <Button
            type="submit"
            variant={BUTTON_TYPE.PRIMARY}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateNewPassword;
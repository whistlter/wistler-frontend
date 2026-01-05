import { useMutation } from "@tanstack/react-query";
import { forgotPassword, type ForgotPasswordPayload } from "../api/auth.api";

export function useForgotPassword() {
    return useMutation<void, Error, ForgotPasswordPayload>({
        mutationFn: (payload) => forgotPassword(payload),
    });
}

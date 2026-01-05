import { useMutation } from "@tanstack/react-query";
import { resetPassword, type ResetPasswordPayload } from "../api/auth.api";

export function useResetPassword() {
    return useMutation<void, Error, ResetPasswordPayload>({
        mutationFn: (payload) => resetPassword(payload),
    });
}

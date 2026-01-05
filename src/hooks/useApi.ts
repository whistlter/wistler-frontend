import {
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import type {
    UseQueryOptions,
    UseMutationOptions
} from '@tanstack/react-query';
import api from '@/lib/axios';

// Generic GET hook
export function useGet<T>(
    key: string | string[],
    url: string,
    options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
    return useQuery<T>({
        queryKey: Array.isArray(key) ? key : [key],
        queryFn: () => api.get<T>(url),
        ...options,
    });
}

// Generic POST hook
export function usePost<T, V = any>(
    url: string,
    options?: UseMutationOptions<T, Error, V>
) {
    const queryClient = useQueryClient();

    return useMutation<T, Error, V>({
        mutationFn: (data: V) => api.post<T>(url, data),
        onSuccess: (...args) => {
            // Invalidate related queries
            const baseKey = url.split('/')[1];
            queryClient.invalidateQueries({ queryKey: [baseKey] });
            options?.onSuccess?.(...args);
        },
        ...options,
    });
}

// Generic PUT hook
export function usePut<T, V = any>(
    url: string,
    options?: UseMutationOptions<T, Error, V>
) {
    const queryClient = useQueryClient();

    return useMutation<T, Error, V>({
        mutationFn: (data: V) => api.put<T>(url, data),
        onSuccess: (...args) => {
            const baseKey = url.split('/')[1];
            queryClient.invalidateQueries({ queryKey: [baseKey] });
            options?.onSuccess?.(...args);
        },
        ...options,
    });
}

// Generic DELETE hook
export function useDelete<T = void>(
    url: string,
    options?: UseMutationOptions<T, Error, void>
) {
    const queryClient = useQueryClient();

    return useMutation<T, Error, void>({
        mutationFn: () => api.delete<T>(url),
        onSuccess: (...args) => {
            const baseKey = url.split('/')[1];
            queryClient.invalidateQueries({ queryKey: [baseKey] });
            options?.onSuccess?.(...args);
        },
        ...options,
    });
}

// Generic PATCH hook
export function usePatch<T, V = any>(
    url: string,
    options?: UseMutationOptions<T, Error, V>
) {
    const queryClient = useQueryClient();

    return useMutation<T, Error, V>({
        mutationFn: (data: V) => api.patch<T>(url, data),
        onSuccess: (...args) => {
            const baseKey = url.split('/')[1];
            queryClient.invalidateQueries({ queryKey: [baseKey] });
            options?.onSuccess?.(...args);
        },
        ...options,
    });
}

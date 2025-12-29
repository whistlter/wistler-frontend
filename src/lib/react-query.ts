// ============================================
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Stale time: 5 minutes (data stays fresh longer, fewer refetches)
// Cache time: 10 minutes (keeps unused data longer)
// Retry: 2 times (fewer retry attempts)
// Refetch on window focus: false (won't refetch when switching tabs)
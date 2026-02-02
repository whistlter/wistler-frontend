import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/react-query"
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Toaster } from "react-hot-toast";

import App from "@/App";
import "@/index.css";

import { ModalProvider } from "@/components/modal";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <App />
        </ModalProvider>
        <Toaster position="bottom-right" />
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
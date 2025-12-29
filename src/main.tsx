import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/react-query"
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Toaster } from "react-hot-toast";
import { env } from "@/config/env";


import App from "@/App";
import "@/index.css";




import { ModalProvider } from "@/components/modal";

async function startApp() {
  if (env.DEV) {
    const { worker } = await import("@/mocks/browser");
    await worker.start({
      onUnhandledRequest: "bypass",
    });
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ModalProvider>
            <App />
          </ModalProvider>
          <Toaster position="top-right" />
          <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}
startApp();
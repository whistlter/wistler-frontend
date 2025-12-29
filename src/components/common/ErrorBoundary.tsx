import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 text-center">
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">
                        Something went wrong
                    </h1>
                    <p className="mb-6 text-gray-600">
                        We apologize for the inconvenience. Please try reloading the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-semibold cursor-pointer"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

"use client";

import { Component, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error("Error Boundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <div className="flex h-48 items-center justify-center rounded-md bg-red-50 p-4">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
                            <p className="mt-2 text-sm text-red-600">
                                Unable to load this component. Please try refreshing the page.
                            </p>
                            <button
                                onClick={() => this.setState({ hasError: false })}
                                className="mt-4 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )
            );
        }

        return this.props.children;
    }
}

export function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
    return (
        <div className="flex h-48 items-center justify-center">
            <div className="text-center">
                <div className="size-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
            </div>
        </div>
    );
}

export function NotFoundDisplay({
    type,
    id
}: {
    type: 'student' | 'teacher';
    id: string;
}) {
    return (
        <div className="flex h-96 items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">
                    {type === 'student' ? 'Student' : 'Teacher'} Not Found
                </h1>
                <p className="mt-2 text-gray-600">
                    The {type} with ID &quot;{id}&quot; could not be found or may have been removed.
                </p>
                <a
                    href={`/list/${type}s`}
                    className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Back to {type === 'student' ? 'Students' : 'Teachers'} List
                </a>
            </div>
        </div>
    );
}
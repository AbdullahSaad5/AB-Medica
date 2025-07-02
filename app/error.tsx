"use client";

import { useEffect } from "react";
import { RefreshCw, AlertTriangle, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-6">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="bg-red-50 p-4 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
          <p className="text-gray-600">The website failed to load. Please try again.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-4 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <button
            onClick={handleGoHome}
            className="flex-1 bg-secondary hover:bg-secondaryHover text-primary font-semibold py-3 px-4 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </div>

        {/* AB Medica Branding */}
        <div className="pt-4 text-primary font-semibold">AB Medica</div>
      </div>
    </div>
  );
}

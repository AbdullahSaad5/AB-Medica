"use client";

import { Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-6">
        {/* 404 Number */}
        <h1 className="text-6xl font-bold text-primary">404</h1>

        {/* Error Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
          <p className="text-gray-600">Sorry, we couldn&apos;t find this page.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleGoHome}
            className="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-4 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>

          <button
            onClick={handleGoBack}
            className="flex-1 bg-secondary hover:bg-secondaryHover text-primary font-semibold py-3 px-4 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* AB Medica Branding */}
        <div className="pt-4 text-primary font-semibold">AB Medica</div>
      </div>
    </div>
  );
}

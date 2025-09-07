import BusinessesClient from "@/component/business/BusinessesClient";
import { Suspense } from "react";


// A separate, simple loading component for the Suspense fallback
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Loading businesses...</p>
      </div>
    </div>
  );
}

export default function BusinessesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <BusinessesClient />
    </Suspense>
  );
}
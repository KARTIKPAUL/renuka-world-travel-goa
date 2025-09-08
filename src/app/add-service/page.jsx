// src/app/add-service/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BusinessListingForm from "@/component/service/ServiceForm";

export default function ListBusinessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login?callbackUrl=/add-service");
      return;
    }

    if (!session.user.isProfileComplete) {
      router.push("/profile/complete");
      return;
    }

    setLoading(false);
  }, [session, status, router]);

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Add New Services
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of businesses in renuka world and connect with
            customers in your area. Fill out the form below to get started.
          </p>
        </div>

        <BusinessListingForm />
      </div>
    </div>
  );
}

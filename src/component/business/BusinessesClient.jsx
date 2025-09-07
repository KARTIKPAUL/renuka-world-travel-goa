"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import BusinessCard from "./BusinessCard";

// The loading spinner component can also be extracted or kept here
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Loading businesses...</p>
      </div>
    </div>
  );
}

export default function BusinessesClient() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    // We now get the initial search term directly from the hook
    const search = searchParams.get("search");
    if (search) {
      setSearchTerm(search);
    }
    fetchBusinesses(search); // Pass the search term directly
  }, [searchParams]);

  const fetchBusinesses = async (currentSearch) => {
    try {
      // Use the passed search term or get the latest from searchParams
      const search = currentSearch ?? searchParams.get("search");
      const url = `/api/services${
        search ? `?search=${encodeURIComponent(search)}` : ""
      }`;

      const response = await fetch(url);
      const data = await response.json();
      setBusinesses(data.businesses || []);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const url = new URL(window.location);
    if (searchTerm.trim()) {
      url.searchParams.set("search", searchTerm.trim());
    } else {
      url.searchParams.delete("search");
    }
    // Using pushState won't re-trigger the useEffect with searchParams
    // in some versions. Using router.push is more reliable if you have it.
    // For this to work as is, we'll manually call fetch.
    window.history.pushState({}, "", url);

    // We need to fetch businesses manually after changing the URL
    // because pushState doesn't trigger a re-render/effect re-run automatically.
    // A better approach would be to use Next's router.push().
    fetchBusinesses(searchTerm.trim());
  };

  // Return loading spinner first
  if (loading) {
    return <LoadingSpinner />;
  }

  // Then return the main content
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Services By Renuka World
        </h1>
        <p className="text-gray-600">Discover {businesses.length}+ Services</p>
      </div>

      {/* Business Grid */}
      {businesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <BusinessCard key={business._id} business={business} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No businesses found.</p>
        </div>
      )}
    </div>
  );
}

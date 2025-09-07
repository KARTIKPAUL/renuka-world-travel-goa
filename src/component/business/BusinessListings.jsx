// src/component/home/BusinessListings.jsx (Updated)
"use client";

import { useState, useEffect } from "react";
import { Filter, SortAsc, X, AlertCircle, RefreshCw } from "lucide-react";
import BusinessCard from "./BusinessCard";

export default function BusinessListings({
  searchParams,
  isSearchActive = false,
  onClearSearch,
}) {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("featured");

  // Reset page when search params change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

  // Fetch businesses when params or page changes
  useEffect(() => {
    if (isSearchActive && searchParams) {
      fetchBusinesses();
    } else if (!isSearchActive) {
      // Load featured businesses for homepage
      fetchFeaturedBusinesses();
    }
  }, [searchParams, currentPage, sortBy, isSearchActive]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (searchParams?.search?.trim()) {
        params.append("search", searchParams.search.trim());
      }

      if (
        searchParams?.category &&
        searchParams.category !== "All Categories"
      ) {
        params.append("category", searchParams.category);
      }

      params.append("page", currentPage.toString());
      params.append("limit", "12");
      params.append("sortBy", sortBy);

      console.log("Fetching businesses with params:", params.toString());

      const response = await fetch(`/api/businesses?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setBusinesses(data.businesses || []);
        setPagination(data.pagination);
        console.log("Fetched businesses:", data.businesses?.length);
      } else {
        throw new Error(data.error || "Failed to fetch businesses");
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
      setError(error.message || "Failed to load businesses. Please try again.");
      setBusinesses([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedBusinesses = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("limit", "6"); // Show fewer for homepage
      params.append("sortBy", "featured");

      const response = await fetch(`/api/businesses?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setBusinesses(data.businesses || []);
        setPagination(null); // Don't show pagination for featured
      } else {
        throw new Error(data.error || "Failed to fetch businesses");
      }
    } catch (error) {
      console.error("Error fetching featured businesses:", error);
      setError("Failed to load featured businesses.");
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    document.getElementById("business-results")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleRetry = () => {
    if (isSearchActive) {
      fetchBusinesses();
    } else {
      fetchFeaturedBusinesses();
    }
  };

  const clearSearchAndFilters = () => {
    if (onClearSearch) {
      onClearSearch();
    }
  };

  if (loading) {
    return (
      <section id="business-results" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {isSearchActive
                ? "Searching businesses..."
                : "Loading businesses..."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="business-results" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    Error Loading Businesses
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
                <button
                  onClick={handleRetry}
                  className="ml-3 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md text-sm transition-colors"
                >
                  <RefreshCw className="h-4 w-4 inline mr-1" />
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Header */}
        {isSearchActive && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  Search Results
                </h2>
                <button
                  onClick={clearSearchAndFilters}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                {searchParams?.search && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Search: "{searchParams.search}"
                  </span>
                )}
                {searchParams?.category &&
                  searchParams.category !== "All Categories" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      Category: {searchParams.category}
                    </span>
                  )}
              </div>

              {pagination && (
                <p className="text-gray-600">
                  Showing {(pagination.current - 1) * 12 + 1}-
                  {Math.min(pagination.current * 12, pagination.total)} of{" "}
                  {pagination.total} results
                </p>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative mt-4 md:mt-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SortAsc className="text-gray-400 h-5 w-5" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="featured">Featured</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </div>
        )}

        {/* Featured Businesses Header (for non-search) */}
        {!isSearchActive && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Experiences
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover top-rated tours, activities, and travel packages in Goa
              with Renuka World
            </p>
          </div>
        )}

        {/* Business Grid */}
        {businesses.length > 0 ? (
          <>
            <div
              className={`grid gap-6 mb-8 ${
                isSearchActive
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {businesses.map((business) => (
                <BusinessCard key={business._id} business={business} />
              ))}
            </div>

            {/* Pagination (only for search results) */}
            {isSearchActive && pagination && pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.current - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>

                {[...Array(pagination.pages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === pagination.pages ||
                    (page >= pagination.current - 2 &&
                      page <= pagination.current + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          page === pagination.current
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === pagination.current - 3 ||
                    page === pagination.current + 3
                  ) {
                    return (
                      <span key={page} className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(pagination.current + 1)}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}

            {/* View All Button (only for featured businesses) */}
            {!isSearchActive && (
              <div className="text-center mt-12">
                <a
                  href="/businesses"
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
                >
                  View All Services
                </a>
              </div>
            )}
          </>
        ) : (
          // Empty State
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isSearchActive
                  ? "No businesses found"
                  : "No businesses available"}
              </h3>
              <p className="text-gray-600 mb-6">
                {isSearchActive
                  ? "Try adjusting your search criteria or browse all businesses."
                  : "Check back later for new business listings."}
              </p>
              {isSearchActive && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={clearSearchAndFilters}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    Clear Search
                  </button>
                  <a
                    href="/businesses"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    View All Services
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

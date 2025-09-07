"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Star,
  Users,
  ChevronDown,
  List,
  AlertCircle,
  Building,
  Tag,
} from "lucide-react";

export default function Hero({ onSearch, onCategoryChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    totalReviews: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Autocomplete states
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // Refs
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/stats").catch((err) => ({ ok: false, error: err.message })),
        fetch("/api/categories?format=simple&includeAll=true").catch((err) => ({
          ok: false,
          error: err.message,
        })),
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats({
          totalBusinesses: statsData.totalBusinesses || 0,
          totalReviews: statsData.totalReviews || 0,
          totalUsers: statsData.totalUsers || 0,
        });
      }

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();

        let categoryList = [];
        if (categoriesData.categories) {
          categoryList = categoriesData.categories;
        } else if (Array.isArray(categoriesData)) {
          categoryList = categoriesData;
        }

        const allCategoriesExists = categoryList.some(
          (cat) => cat.name === "All Categories" || cat.slug === "all"
        );

        if (!allCategoriesExists) {
          categoryList.unshift({ name: "All Categories", slug: "all" });
        }

        setCategories(categoryList);
      } else {
        setCategories([
          { name: "All Categories", slug: "all" },
          { name: "Restaurants", slug: "restaurants" },
          { name: "Shops", slug: "shops" },
          { name: "Services", slug: "services" },
          { name: "Healthcare", slug: "healthcare" },
          { name: "Education", slug: "education" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setError("Failed to load data. Using default values.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);

    try {
      const response = await fetch(
        `/api/businesses/suggestions?q=${encodeURIComponent(query)}&limit=8`
      );
      const data = await response.json();

      if (response.ok && data.suggestions) {
        setSuggestions(data.suggestions);
        setShowSuggestions(data.suggestions.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const debouncedFetchSuggestions = (query) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedSuggestionIndex(-1);

    if (value.trim()) {
      debouncedFetchSuggestions(value.trim());
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === "business") {
      setSearchTerm(suggestion.name);
      setShowSuggestions(false);

      const searchParams = {
        search: suggestion.name,
        category: selectedCategory !== "All Categories" ? selectedCategory : "",
      };

      if (onSearch) {
        onSearch(searchParams);
      }
    } else if (suggestion.type === "category") {
      setSelectedCategory(suggestion.name);
      setSearchTerm("");
      setShowSuggestions(false);

      const searchParams = {
        search: "",
        category: suggestion.name,
      };

      if (onCategoryChange) {
        onCategoryChange(searchParams);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);

    const searchParams = {
      search: searchTerm.trim(),
      category: selectedCategory !== "All Categories" ? selectedCategory : "",
    };

    if (onSearch) {
      onSearch(searchParams);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    const searchParams = {
      search: searchTerm.trim(),
      category: category !== "All Categories" ? category : "",
    };

    if (onCategoryChange) {
      onCategoryChange(searchParams);
    }
  };

  return (
    <section className="relative flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1707344088547-3cf7cea5ca49?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxzZWFyY2h8MXx8dHJhdmVsfGVufDB8fDB8fHww')`,
          }}
        ></div>
      </div>

      <div className="container mx-auto text-center relative z-10 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Explore Goa with <span className="text-amber-500">Renuka World</span>
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto">
          Plan your perfect getaway with our curated travel packages
        </p>

        {/* Error Message */}
        {error && (
          <div className="max-w-5xl mx-auto mb-4">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="max-w-5xl mx-auto mb-12 bg-white rounded-lg shadow-lg p-2 relative"
        >
          <div className="flex flex-col md:flex-row gap-2">
            {/* Category Dropdown */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <List className="text-gray-500 h-5 w-5" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full pl-10 pr-10 py-4 text-gray-900 rounded-lg border-none appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                disabled={loading}
              >
                {categories.map((category) => (
                  <option
                    key={category.slug || category.name}
                    value={category.name}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 pointer-events-none" />
            </div>

            {/* Search Input with Autocomplete */}
            <div className="relative flex-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for tours, hotels, beaches, activities..."
                value={searchTerm}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="off"
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-80 overflow-y-auto z-50"
                >
                  {loadingSuggestions ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400 mx-auto mb-2"></div>
                      Searching...
                    </div>
                  ) : suggestions.length > 0 ? (
                    <ul className="py-2">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={`${suggestion.type}-${suggestion.id}`}
                          className={`px-4 py-3 cursor-pointer hover:bg-gray-50 flex justify-start items-center ${
                            index === selectedSuggestionIndex
                              ? "bg-blue-50 border-l-4 border-blue-500"
                              : ""
                          }`}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="flex items-center justify-between w-full">
                            {/* Left side with icon + details */}
                            <div className="flex items-start">
                              {suggestion.type === "business" ? (
                                <Building className="h-4 w-4 text-gray-400 mr-3" />
                              ) : (
                                <Tag className="h-4 w-4 text-blue-500 mr-3" />
                              )}
                              <div>
                                <div className="font-medium text-gray-900 text-start">
                                  {suggestion.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {suggestion.type === "business"
                                    ? `in ${suggestion.category}${
                                        suggestion.subcategory
                                          ? ` • ${suggestion.subcategory}`
                                          : ""
                                      }`
                                    : "Category"}
                                </div>
                              </div>
                            </div>

                            {/* Right side label */}
                            <div className="text-xs text-gray-400 ml-2 shrink-0">
                              {suggestion.type === "business"
                                ? "Business"
                                : "Category"}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : searchTerm && !loadingSuggestions ? (
                    <div className="p-4 text-center text-gray-500">
                      No suggestions found
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
        </form>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <MapPin className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold">
              {loading ? (
                <div className="inline-block animate-pulse bg-gray-300 rounded w-16 h-8"></div>
              ) : (
                `${stats.totalBusinesses}+`
              )}
            </div>
            <div className="text-blue-200">Total Service</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold">
              {loading ? (
                <div className="inline-block animate-pulse bg-gray-300 rounded w-16 h-8"></div>
              ) : (
                `${stats.totalReviews}+`
              )}
            </div>
            <div className="text-blue-200">Customer Reviews</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Users className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold">
              {loading ? (
                <div className="inline-block animate-pulse bg-gray-300 rounded w-16 h-8"></div>
              ) : (
                `${stats.totalUsers}+`
              )}
            </div>
            <div className="text-blue-200">Happy Customers</div>
          </div>
        </div>
      </div>
    </section>
  );
}

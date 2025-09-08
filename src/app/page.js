// src/app/page.js (Updated Home Page)
"use client";

import { useState } from 'react';

import CategoryGrid from "@/component/home/CategoryGrid";
import Hero from "@/component/home/Hero";
import BusinessListings from '@/component/service/ServiceListings';

export default function Home() {
  const [searchParams, setSearchParams] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearch = (params) => {
    console.log("Home received search params:", params);
    setSearchParams(params);
    setIsSearchActive(true);
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('business-results')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleCategoryChange = (params) => {
    console.log("Home received category change:", params);
    setSearchParams(params);
    setIsSearchActive(true);
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('business-results')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const clearSearch = () => {
    setSearchParams(null);
    setIsSearchActive(false);
  };

  return (
    <>
      <Hero 
        onSearch={handleSearch} 
        onCategoryChange={handleCategoryChange} 
      />
      
      <BusinessListings
        searchParams={searchParams}
        isSearchActive={isSearchActive}
        onClearSearch={clearSearch}
      />
      
      {/* Only show CategoryGrid when not actively searching */}
      {!isSearchActive && <CategoryGrid />}
    </>
  );
}
// src/components/common/Header.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  Search,
  User,
  MapPin,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    setIsUserMenuOpen(false);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-[#a7d6f0] shadow-lg sticky top-0 z-50 border-b border-gray-200 py-3">
      <div className="max-w-7xl mx-auto ">
        <div className="flex justify-between items-center h-16 px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            onClick={closeMenus}
          >
            <div className="flex flex-col">
              <span className=" font-bold text-gray-900 leading-tight">
                Renuka World Travel
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {session?.user?.role === "owner" && (
              <Link
                href="/services"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
              >
                Servicess
              </Link>
            )}

            {session?.user?.role === "owner" ? (
              <Link
                href="/add-service"
                className="px-4 py-2 mx-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-all duration-200 font-medium shadow-sm"
              >
                Add New Service
              </Link>
            ) : (
              <Link
                href="/services"
                className="px-4 py-2 mx-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-all duration-200 font-medium shadow-sm"
              >
                View Service
              </Link>
            )}

            {/* Authentication Section */}
            {status === "authenticated" ? (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium">
                      {session?.user?.name || "Account"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={closeMenus}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={closeMenus}
                      >
                        Profile
                      </Link>
                      <hr className="my-1 border-gray-200" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-200 font-medium shadow-sm"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white min-h-screen min-w-full px-4 sm:px-6 lg:px-8">
            <div className="px-2 pt-4 pb-6 ">
              {session?.user?.role === "owner" && (
                <Link
                  href="/services"
                  className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
                  onClick={closeMenus}
                >
                  Services{" "}
                </Link>
              )}

              {session?.user?.role === "owner" ? (
                <Link
                  href="/add-service"
                  className="block px-4 py-3 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all font-medium border border-green-200"
                  onClick={closeMenus}
                >
                  Add New Service
                </Link>
              ) : (
                <Link
                  href="/services"
                  className="block px-4 py-3 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all font-medium border border-green-200"
                  onClick={closeMenus}
                >
                  View Service
                </Link>
              )}

              {/* Mobile Authentication */}
              {status === "authenticated" ? (
                <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                  <div className="flex items-center px-4 py-2 text-gray-600">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium">
                      {session?.user?.name || "Account"}
                    </span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    onClick={closeMenus}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    onClick={closeMenus}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                  <Link
                    href="/login"
                    className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
                    onClick={closeMenus}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all font-medium text-center"
                    onClick={closeMenus}
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

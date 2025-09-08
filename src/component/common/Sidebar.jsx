// src/components/common/Sidebar.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  User,
  Settings,
  LogOut,
  Plus,
  List,
  Menu,
  X,
  ChevronDown,
  MailIcon,
  User2,
  Car,
  Package,
  Torus,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  // Sidebar should only render for "owner"
  if (status !== "authenticated" || session?.user?.role !== "owner") {
    return null;
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    setIsUserMenuOpen(false);
  };

  return (
    <div className="h-full w-full bg-gray-900 text-gray-100 flex flex-col shadow-xl border-r border-gray-700">
      {/* Header with Toggle Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
        {!isCollapsed && (
          <div className="flex flex-col min-w-0 flex-1">
            <Image
              src="/renuka-world-logo-removebg-preview.png"
              alt="LogoHeader"
              height={100}
              width={100}
            />
          </div>
        )}
        {/* <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button> */}
      </div>

      {/* User Info Section */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`flex items-center w-full p-2 rounded-lg hover:bg-gray-800 transition-colors ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            <div className="flex items-center min-w-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              {!isCollapsed && (
                <div className="ml-3 text-left min-w-0 flex-1">
                  <p className="font-medium text-white text-sm truncate">
                    {session?.user?.name || "Owner"}
                  </p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
              )}
            </div>
            {/* {!isCollapsed && <ChevronDown className="h-4 w-4 flex-shrink-0" />} */}
          </button>

          {/* User Dropdown Menu */}
          {/* {isUserMenuOpen && !isCollapsed && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-10">
              <Link
                href="/profile"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                onClick={() => setIsUserMenuOpen(false)}
              >
                Profile Settings
              </Link>
              <hr className="my-1 border-gray-700" />
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )} */}
        </div>
      </div>

      {/* Navigation - Scrollable if needed */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group relative ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <Home size={20} className="flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">Dashboard</span>
          )}
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-3 py-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
              Dashboard
            </div>
          )}
        </Link>

        <Link
          href="/services"
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group relative ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <List size={20} className="flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">All Services</span>
          )}
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-3 py-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
              All Services
            </div>
          )}
        </Link>

        <Link
          href="/add-service"
          className={`flex items-center gap-3 p-3 rounded-lg  transition-colors group relative ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <Torus size={20} className="flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">Add Tour</span>
          )}
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-3 py-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
              Add Tour
            </div>
          )}
        </Link>
        <Link
          href="/add-service"
          className={`flex items-center gap-3 p-3 rounded-lg  transition-colors group relative ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <Package size={20} className="flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">Add Package</span>
          )}
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-3 py-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
              Add Package
            </div>
          )}
        </Link>
        <Link
          href="/add-service"
          className={`flex items-center gap-3 p-3 rounded-lg  transition-colors group relative ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <Car size={20} className="flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">Rentel Service</span>
          )}
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-3 py-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
              Rentel Service
            </div>
          )}
        </Link>

        <Link
          href="/profile"
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group relative ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <User2 size={20} className="flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Profile</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-3 py-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
              Profile
            </div>
          )}
        </Link>
      </nav>

      {/* Footer - Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-700 flex-shrink-0">
          {/* Section Title */}
          <div className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
            Quick Actions
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="flex justify-center bg-red-500 items-center gap-2 w-full px-4 py-2 rounded-lg text-white hover:cursor-pointer hover:text-red-300 hover:bg-gray-800 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>

          {/* View Site Button */}
          <Link
            href="/"
            className="mt-3 block w-full px-4 py-2 text-center bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium shadow-sm"
          >
            View Site as User
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

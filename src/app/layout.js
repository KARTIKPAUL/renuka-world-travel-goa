// src/app/layout.js
"use client";

import Footer from "@/component/common/Footer";
import "./globals.css";
import Header from "@/component/common/Header";
import Sidebar from "@/component/common/Sidebar";
import AuthProvider from "../../providers/AuthProvider";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, createContext, useContext } from "react";

// Create context for sidebar state
const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};

function LayoutContent({ children }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Define pages where you DON'T want the footer
  const hideFooterRoutes = ["/sidebar"];
  const shouldHideFooter = hideFooterRoutes.includes(pathname);

  // Check if user is owner
  const isOwner = status === "authenticated" && session?.user?.role === "owner";

  if (isOwner) {
    // Owner layout with sticky sidebar
    return (
      <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
        <div className="flex h-screen bg-gray-50">
          {/* Fixed Sidebar for owners */}
          <div className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${
            isCollapsed ? 'w-16' : 'w-1/5'
          }`}>
            <Sidebar />
          </div>
          
          {/* Scrollable content area - offset by sidebar width */}
          <div className={`w-full flex flex-col transition-all duration-300 ${
            isCollapsed ? 'ml-16' : 'ml-[20%]'
          }`}>
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {children}
            </main>
          </div>
        </div>
      </SidebarContext.Provider>
    );
  }

  // Regular user layout
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header for non-owners (users and guests) */}
      <Header />
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer for non-owners */}
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
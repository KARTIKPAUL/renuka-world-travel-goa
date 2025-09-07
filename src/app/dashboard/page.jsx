// src/app/dashboard/page.jsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Building2,
  Star,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  BarChart3,
} from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userBusinesses, setUserBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (!session.user.isProfileComplete) {
      router.push("/dashboard");
      return;
    }

    // Fetch user's businesses
    fetchUserBusinesses();
  }, [session, status, router]);

  const fetchUserBusinesses = async () => {
    try {
      const response = await fetch(`/api/services?owner=${session.user.id}`);
      const data = await response.json();
      setUserBusinesses(data.businesses || []);
    } catch (error) {
      console.error("Error fetching user businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session.user.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your account and businesses
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Building2 className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {userBusinesses.length}
              </h3>
              <p className="text-sm text-gray-600">Total Service</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {userBusinesses.reduce(
                  (total, business) => total + (business.reviewCount || 0),
                  0
                )}
              </h3>
              <p className="text-sm text-gray-600">Total Reviews</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">0</h3>
              <p className="text-sm text-gray-600">Profile Views</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {userBusinesses.length > 0
                  ? (
                      userBusinesses.reduce(
                        (total, business) => total + (business.rating || 0),
                        0
                      ) / userBusinesses.length
                    ).toFixed(1)
                  : "0.0"}
              </h3>
              <p className="text-sm text-gray-600">Avg Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      {session.user.role === "business_owner" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/add-service"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Add New Service</h3>
                  <p className="text-sm text-gray-600">Add New Service</p>
                </div>
              </Link>

              <Link
                href="/dashboard/services"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Building2 className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Manage Services</h3>
                  <p className="text-sm text-gray-600">View and edit Service</p>
                </div>
              </Link>

              <Link
                href="/dashboard/profile"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Edit Profile</h3>
                  <p className="text-sm text-gray-600">
                    Update your personal information
                  </p>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {userBusinesses.length > 0 ? (
                <div className="space-y-3">
                  {userBusinesses.slice(0, 3).map((business) => (
                    <div
                      key={business._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {business.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Status:{" "}
                          <span
                            className={`font-medium ${
                              business.status === "approved"
                                ? "text-green-600"
                                : business.status === "pending"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {business.status.charAt(0).toUpperCase() +
                              business.status.slice(1)}
                          </span>
                        </p>
                      </div>
                      <Link
                        href={`/dashboard/services`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent activity to show</p>
                  <p className="text-sm mt-2">
                    Start by listing your first business!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Business Owner Specific Section */}
      {session.user.role === "business_owner" && (
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Grow Your Business</h2>
          <p className="mb-4">
            Get more customers by upgrading to our premium listing package
          </p>
          <Link
            href="/pricing"
            className="bg-white text-primary-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            View Pricing Plans
          </Link>
        </div>
      )}
    </div>
  );
}

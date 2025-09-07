// src/app/dashboard/services/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Building2,
  MapPin,
  Phone,
  Clock,
  Edit,
  Eye,
  Trash2,
} from "lucide-react";

export default function UserBusinessesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    fetchUserBusinesses();
  }, [session, status, router]);

  const fetchUserBusinesses = async () => {
    try {
      const response = await fetch(`/api/services?owner=${session.user.id}`);
      const data = await response.json();
      setBusinesses(data.businesses || []);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Our Service</h1>
          <p className="text-gray-600 mt-2">Manage Service</p>
        </div>
        <Link
          href="/add-service"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Service
        </Link>
      </div>

      {businesses.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No businesses yet
          </h2>
          <p className="text-gray-600 mb-6">
            Start by listing your first business
          </p>
          <Link
            href="/add-service"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Service
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {businesses.map((business) => (
            <div
              key={business._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {business.name}
                    </h3>
                    <p className="text-primary-600 text-sm">
                      {business.category?.name}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(
                      business.status
                    )}`}
                  >
                    {business.status.charAt(0).toUpperCase() +
                      business.status.slice(1)}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {business.description}
                </p>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {business.address?.area}, {business.address?.city}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {business.contact?.phone?.[0] || "No phone"}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Created {new Date(business.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    {business.status === "approved" && (
                      <button className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100">
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    <button className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

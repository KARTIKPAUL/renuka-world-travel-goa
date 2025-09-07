// src/app/businesses/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  Facebook,
  Instagram,
  MessageCircle,
  Edit,
  Eye,
  Settings,
  Share2,
  Heart,
  Flag,
  Calendar,
  Tag,
  Shield,
  Crown,
} from "lucide-react";
import Link from "next/link";
import ReviewSystem from "@/component/business/ReviewSystem";

export default function BusinessDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBusiness();
    }
  }, [id]);

  useEffect(() => {
    if (business && session) {
      setIsOwner(business.ownerId === session.user.id);
    }
  }, [business, session]);

  const fetchBusiness = async () => {
    try {
      const response = await fetch(`/api/businesses/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Business not found");
      }

      setBusiness(data.business);
    } catch (error) {
      console.error("Error fetching business:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatHours = (hours) => {
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const dayNames = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    return days.map((day, index) => {
      const dayHours = hours?.[day];
      return {
        day: dayNames[index],
        hours: dayHours?.isClosed
          ? "Closed"
          : `${dayHours?.open || "09:00"} - ${dayHours?.close || "18:00"}`,
      };
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { color: "bg-green-100 text-green-800", text: "Approved" },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        text: "Pending Review",
      },
      rejected: { color: "bg-red-100 text-red-800", text: "Rejected" },
      active: { color: "bg-green-100 text-green-800", text: "Active" },
    };

    return (
      statusConfig[status] || {
        color: "bg-gray-100 text-gray-800",
        text: "Unknown",
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Business Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The business you are looking for does not exist."}
          </p>
          <Link href="/businesses" className="btn-primary">
            Back to Businesses
          </Link>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(business.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Owner Badge */}
          {isOwner && (
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200">
                <Crown className="h-5 w-5" />
                <span className="font-medium">You own this business</span>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  href={`/dashboard/businesses/edit/${id}`}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Business
                </Link>
                <Link
                  href="/dashboard/businesses"
                  className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Link>
              </div>
            </div>
          )}

          {/* Business Header */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {business.name}
                    </h1>
                    {business.isPremium && (
                      <span className="bg-yellow-500 text-white px-2 py-1 text-xs font-semibold rounded">
                        PREMIUM
                      </span>
                    )}
                    {business.isVerified && (
                      <Shield
                        className="h-6 w-6 text-blue-600"
                        title="Verified Business"
                      />
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <Link
                      href={`/categories/${business.category?.slug}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {business.category?.name}
                    </Link>
                    {business.subcategory && (
                      <>
                        <span>•</span>
                        <span>{business.subcategory}</span>
                      </>
                    )}
                  </div>

                  {isOwner && (
                    <div className="mt-2">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded ${statusBadge.color}`}
                      >
                        {statusBadge.text}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Share2 className="h-5 w-5" />
                  </button>
                  {!isOwner && (
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Flag className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.floor(business.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-semibold text-gray-900">
                    {business.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-600">
                  ({business.reviewCount}{" "}
                  {business.reviewCount === 1 ? "review" : "reviews"})
                </span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  About
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {business.description}
                </p>
              </div>

              {/* Tags */}
              {business.tags && business.tags.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {business.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-900 font-medium">Address</p>
                      <p className="text-gray-600 text-sm">
                        {business.address.street}, {business.address.area}
                        <br />
                        {business.address.city}, {business.address.state} -{" "}
                        {business.address.pincode}
                      </p>
                    </div>
                  </div>

                  {/* Phone Numbers */}
                  {business.contact.phone &&
                    business.contact.phone.length > 0 && (
                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-gray-900 font-medium">Phone</p>
                          {business.contact.phone.map((phone, index) => (
                            <p key={index} className="text-gray-600 text-sm">
                              <a
                                href={`tel:${phone}`}
                                className="hover:text-primary-600"
                              >
                                {phone}
                              </a>
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Email */}
                  {business.contact.email && (
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-900 font-medium">Email</p>
                        <p className="text-gray-600 text-sm">
                          <a
                            href={`mailto:${business.contact.email}`}
                            className="hover:text-primary-600"
                          >
                            {business.contact.email}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Website */}
                  {business.contact.website && (
                    <div className="flex items-start space-x-3">
                      <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-900 font-medium">Website</p>
                        <p className="text-gray-600 text-sm">
                          <a
                            href={business.contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary-600"
                          >
                            Visit Website
                          </a>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Social Media */}
                  {(business.socialMedia?.facebook ||
                    business.socialMedia?.instagram ||
                    business.socialMedia?.whatsapp) && (
                    <div className="flex items-start space-x-3">
                      <div className="h-5 w-5 mt-0.5" />
                      <div>
                        <p className="text-gray-900 font-medium mb-2">
                          Social Media
                        </p>
                        <div className="flex space-x-3">
                          {business.socialMedia.facebook && (
                            <a
                              href={business.socialMedia.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Facebook className="h-5 w-5" />
                            </a>
                          )}
                          {business.socialMedia.instagram && (
                            <a
                              href={business.socialMedia.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-600 hover:text-pink-700"
                            >
                              <Instagram className="h-5 w-5" />
                            </a>
                          )}
                          {business.socialMedia.whatsapp && (
                            <a
                              href={`https://wa.me/${business.socialMedia.whatsapp.replace(
                                /[^0-9]/g,
                                ""
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700"
                            >
                              <MessageCircle className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Business Hours
              </h2>
              <div className="space-y-2">
                {formatHours(business.hours).map(({ day, hours }) => (
                  <div
                    key={day}
                    className="flex justify-between py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="font-medium text-gray-900">{day}</span>
                    <span className="text-gray-600">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Services Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start on</span>
                  <span className="text-gray-900">
                    {new Date(business.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last updated</span>
                  <span className="text-gray-900">
                    {new Date(business.updatedAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {business.isVerified && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Verification</span>
                    <span className="flex items-center text-green-600">
                      <Shield className="h-4 w-4 mr-1" />
                      Verified
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section Placeholder */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ReviewSystem businessId={id} isOwner={isOwner} />
        </div>
      </div>
    </div>
  );
}

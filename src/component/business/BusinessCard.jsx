// src/components/business/BusinessCard.jsx
import Link from "next/link";
import { MapPin, Star, Phone } from "lucide-react";

export default function BusinessCard({ business }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={business.images?.[0] || "https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20%281%20of%201%29-5.jpg?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnVzaW5lc3N8ZW58MHx8MHx8fDA%3D"}
          alt={business.name}
          className="w-full h-48 object-cover"
        />
        {business.isPremium && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 text-xs font-semibold rounded">
            PREMIUM
          </span>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {business.name}
        </h3>
        <p className="text-primary-600 text-sm mb-2">
          {business.category?.name || "Business"}
        </p>
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
            {business.contact?.phone?.[0] || "Not available"}
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-2 text-yellow-400 fill-current" />
            {business.rating?.toFixed(1) || "0.0"} (
            {business.reviewCount || 0} reviews)
          </div>
        </div>

        <Link
          href={`/businesses/${business._id}`}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg transition-colors text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
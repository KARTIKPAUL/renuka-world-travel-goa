// src/components/home/CategoryGrid.jsx
"use client";

import Link from "next/link";

import {
  Map,
  Hotel,
  Sailboat,
  Utensils,
  PartyPopper,
  CarFront,
  ShoppingBagIcon,
  Space,
} from "lucide-react";

const categories = [
  {
    name: "Tours & Experiences",
    icon: Map,
    count: 52,
    color: "bg-blue-100 text-blue-600",
    slug: "tours-experiences",
  },
  {
    name: "Hotels & Stays",
    icon: Hotel,
    count: 40,
    color: "bg-green-100 text-green-600",
    slug: "hotels-stays",
  },
  {
    name: "Adventure & Activities",
    icon: Sailboat,
    count: 35,
    color: "bg-yellow-100 text-yellow-600",
    slug: "adventure-activities",
  },
  {
    name: "Food & Nightlife",
    icon: Utensils,
    count: 48,
    color: "bg-red-100 text-red-600",
    slug: "food-nightlife",
  },
  {
    name: "Transport & Rentals",
    icon: CarFront,
    count: 22,
    color: "bg-purple-100 text-purple-600",
    slug: "transport-rentals",
  },
  {
    name: "Wellness & Retreats",
    icon: Space,
    count: 18,
    color: "bg-pink-100 text-pink-600",
    slug: "wellness-retreats",
  },
  {
    name: "Events & Weddings",
    icon: PartyPopper,
    count: 12,
    color: "bg-orange-100 text-orange-600",
    slug: "events-weddings",
  },
  {
    name: "Shopping & Souvenirs",
    icon: ShoppingBagIcon,
    count: 30,
    color: "bg-gray-100 text-gray-600",
    slug: "shopping-souvenirs",
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 bg-[#a7d7f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse by Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find exactly what you're looking for in Coochbehar
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div
                  className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.count} businesses
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

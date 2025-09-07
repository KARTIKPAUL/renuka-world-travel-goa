// src/scripts/seedCategories.js
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
  description: { type: String },
  subcategories: [{ type: String }],
  businessCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

const categories = [
  {
    name: "Tours & Experiences",
    slug: "tours-experiences",
    icon: "map",
    description: "Guided tours, cultural experiences, and sightseeing in Goa",
    subcategories: [
      "City Tours",
      "Heritage Walks",
      "Beach Tours",
      "Nightlife Tours",
      "Village Tours",
      "Food & Drink Tours",
    ],
  },
  {
    name: "Hotels & Stays",
    slug: "hotels-stays",
    icon: "hotel",
    description: "Hotels, resorts, guest houses, and homestays in Goa",
    subcategories: [
      "Luxury Resorts",
      "Boutique Hotels",
      "Beach Shacks",
      "Guest Houses",
      "Homestays",
      "Budget Stays",
    ],
  },
  {
    name: "Adventure & Activities",
    slug: "adventure-activities",
    icon: "sailboat",
    description: "Thrilling water sports, trekking, and outdoor activities",
    subcategories: [
      "Scuba Diving",
      "Parasailing",
      "Jet Ski",
      "Kayaking",
      "Trekking",
      "Dolphin Watching",
    ],
  },
  {
    name: "Food & Nightlife",
    slug: "food-nightlife",
    icon: "utensils",
    description: "Goa’s vibrant restaurants, bars, cafes, and clubs",
    subcategories: [
      "Beach Shacks",
      "Fine Dining",
      "Cafes",
      "Nightclubs",
      "Bars & Pubs",
      "Local Cuisine",
    ],
  },
  {
    name: "Transport & Rentals",
    slug: "transport-rentals",
    icon: "car",
    description: "Transport services and vehicle rentals across Goa",
    subcategories: [
      "Taxi Service",
      "Bike Rentals",
      "Car Rentals",
      "Airport Transfers",
      "Bus & Shuttle",
    ],
  },
  {
    name: "Wellness & Retreats",
    slug: "wellness-retreats",
    icon: "spa",
    description: "Yoga, meditation, spas, and wellness retreats",
    subcategories: [
      "Yoga Retreats",
      "Meditation",
      "Ayurveda",
      "Spa & Massage",
      "Detox Programs",
    ],
  },
  {
    name: "Events & Weddings",
    slug: "events-weddings",
    icon: "party-popper",
    description: "Destination weddings, events, and party planning in Goa",
    subcategories: [
      "Wedding Planners",
      "Beach Weddings",
      "Event Venues",
      "Party Planners",
      "Corporate Events",
    ],
  },
  {
    name: "Shopping & Souvenirs",
    slug: "shopping-souvenirs",
    icon: "shopping-bag",
    description: "Markets, boutiques, and souvenir shops in Goa",
    subcategories: [
      "Flea Markets",
      "Clothing",
      "Handicrafts",
      "Jewelry",
      "Souvenir Shops",
    ],
  },
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await Category.deleteMany({});
    console.log("Cleared existing categories");

    const result = await Category.insertMany(categories);
    console.log(`Inserted ${result.length} categories successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();

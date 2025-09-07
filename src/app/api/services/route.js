// src/app/api/services/route.js (Updated with enhanced search)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Business from "../../../../models/Business";
import connectDB from "../../../../lib/mongodb";
import Category from "../../../../models/Category";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const location = searchParams.get("location");
    const status = searchParams.get("status");
    const owner = searchParams.get("owner");
    const sortBy = searchParams.get("sortBy") || "featured";

    const skip = (page - 1) * limit;

    let query = {};

    // Status handling (preserve your existing logic)
    if (!owner && !status) {
      // For public business listing, show both approved and active businesses
      query.status = { $in: ["approved", "pending"] };
    } else if (status) {
      query.status = status;
    }

    // Add owner filter for dashboard (preserve your existing logic)
    if (owner) {
      query.ownerId = owner;
      // Remove status filter for owner's businesses - show all statuses
      delete query.status;
    }

    // Enhanced category filter
    if (category && category !== "All Categories") {
      let categoryDoc;

      // Try to find category by slug first, then by name
      categoryDoc = await Category.findOne({ slug: category });

      if (!categoryDoc) {
        // Try case-insensitive name search
        categoryDoc = await Category.findOne({
          name: { $regex: new RegExp(`^${category}$`, "i") },
        });
      }

      if (!categoryDoc) {
        // Try finding by slug created from category name
        const slugFromName = category.toLowerCase().replace(/\s+/g, "-");
        categoryDoc = await Category.findOne({ slug: slugFromName });
      }

      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    // Enhanced search functionality
    if (search && search.trim()) {
      const searchTerm = search.trim();
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { tags: { $in: [new RegExp(searchTerm, "i")] } },
        { subcategory: { $regex: searchTerm, $options: "i" } },
        // Also search in address for location-based searches
        { "address.street": { $regex: searchTerm, $options: "i" } },
        { "address.area": { $regex: searchTerm, $options: "i" } },
      ];
    }

    // Location filter
    if (location && location !== "Coochbehar, West Bengal") {
      const locationQuery = {
        $or: [
          { "address.city": { $regex: location, $options: "i" } },
          { "address.area": { $regex: location, $options: "i" } },
          { "address.street": { $regex: location, $options: "i" } },
        ],
      };

      if (query.$or) {
        // If we already have search criteria, combine with AND logic
        query.$and = [{ $or: query.$or }, locationQuery];
        delete query.$or;
      } else {
        // If no search criteria, just apply location filter
        query = { ...query, ...locationQuery };
      }
    }

    // Sorting logic
    let sortCriteria;
    switch (sortBy) {
      case "rating":
        sortCriteria = {
          isPremium: -1,
          rating: -1,
          reviewCount: -1,
          createdAt: -1,
        };
        break;
      case "newest":
        sortCriteria = { isPremium: -1, createdAt: -1, rating: -1 };
        break;
      case "reviews":
        sortCriteria = {
          isPremium: -1,
          reviewCount: -1,
          rating: -1,
          createdAt: -1,
        };
        break;
      case "featured":
      default:
        sortCriteria = { isPremium: -1, rating: -1, createdAt: -1 };
        break;
    }

    console.log("Business query:", JSON.stringify(query, null, 2)); // Debug log

    const businesses = await Business.find(query)
      .populate("category", "name slug")
      .populate("ownerId", "name email")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Business.countDocuments(query);

    console.log(`Found ${businesses.length} businesses out of ${total} total`); // Debug log

    return NextResponse.json({
      businesses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        current: page,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      // Additional metadata for frontend
      filters: {
        search: search || null,
        category: category || null,
        location: location || null,
        sortBy: sortBy || "featured",
      },
    });
  } catch (error) {
    console.error("Error fetching businesses:", error);
    return NextResponse.json(
      { error: "Failed to fetch businesses" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.description || !body.category) {
      return NextResponse.json(
        { error: "Name, description, and category are required" },
        { status: 400 }
      );
    }

    // Verify category exists
    const categoryExists = await Category.findById(body.category);
    if (!categoryExists) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Create business with initial rating and review count
    const business = new Business({
      ...body,
      ownerId: session.user.id,
      rating: 0,
      reviewCount: 0,
      status: "pending", // Set initial status
    });

    await business.save();

    // Populate the business data for response
    await business.populate("category", "name slug");

    return NextResponse.json(
      {
        message: "Business created successfully",
        business,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating business:", error);
    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 }
    );
  }
}

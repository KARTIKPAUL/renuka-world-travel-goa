// src/app/api/businesses/[id]/route.js
import { NextResponse } from "next/server";

import connectDB from "../../../../../lib/mongodb";
import Business from "../../../../../models/Business";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const business = await Business.findById(id)
      .populate("category", "name slug")
      .populate("ownerId", "name email");

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    // Only show approved/active businesses to public, unless it's the owner
    if (!["approved", "pending"].includes(business.status)) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      business,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching business:", error);
    return NextResponse.json(
      { error: "Failed to fetch business" },
      { status: 500 }
    );
  }
}

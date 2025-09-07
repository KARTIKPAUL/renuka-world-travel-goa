// src/app/api/users/profile/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "../../../../../models/User";
import connectDB from "../../../../../lib/mongodb";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user fields
    if (body.phone) user.phone = body.phone;
    if (body.dateOfBirth) user.dateOfBirth = new Date(body.dateOfBirth);
    if (body.gender) user.gender = body.gender;
    if (body.address) {
      user.address = {
        ...user.address,
        ...body.address,
      };
    }

    // Check if profile is now complete
    user.checkProfileCompleteness();

    await user.save();

    const { password, ...userWithoutPassword } = user.toObject();

    return NextResponse.json({
      message: "Profile updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// src/app/api/users/auth-methods/route.js (New API route to check user's auth methods)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import connectDB from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      hasGoogle: !!user.providers?.google?.id,
      hasPassword: !!user.password,
      hasCredentials: !!user.providers?.credentials?.hasPassword,
    });
  } catch (error) {
    console.error("Auth methods check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

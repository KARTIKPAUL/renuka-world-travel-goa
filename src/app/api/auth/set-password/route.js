// src/app/api/auth/set-password/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "../../../../../lib/mongodb";
import User from "../../../../../models/User";

export async function POST(request) {
  console.log("=== SET PASSWORD API START ===");

  try {
    console.log("1. Parsing request body...");
    const body = await request.json();
    const { email, password } = body;
    console.log("2. Email:", email, "Password length:", password?.length);

    if (!email || !password) {
      console.log("3. Missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("4. Connecting to database...");
    await connectDB();
    console.log("5. Database connected successfully");

    console.log("6. Looking for user...");
    const user = await User.findOne({ email });
    console.log("7. User found:", !!user);

    if (!user) {
      console.log("8. User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("9. Current user providers:", JSON.stringify(user.providers));

    console.log("10. Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("11. Password hashed successfully");

    console.log("12. Updating user...");
    user.password = hashedPassword;

    // Fix: Be more explicit about the providers update
    if (!user.providers) {
      user.providers = {};
    }

    if (!user.providers.credentials) {
      user.providers.credentials = {};
    }

    user.providers.credentials.hasPassword = true;

    console.log("13. Updated providers:", JSON.stringify(user.providers));

    console.log("14. Saving user to database...");
    await user.save();
    console.log("15. User saved successfully");

    console.log("16. Returning success response");
    return NextResponse.json({ message: "Password set successfully" });
  } catch (error) {
    console.log("ERROR at step:", error.message);
    console.error("Full error:", error);
    return NextResponse.json(
      { error: `Internal server error, ${error}` },
      { status: 500 }
    );
  }
}

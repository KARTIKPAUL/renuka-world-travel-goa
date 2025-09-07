// src/app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import connectDB from "../../../../../lib/mongodb";
import User from "../../../../../models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        if (!user.password && user.providers?.google?.id) {
          throw new Error(
            "This account was created with Google. Please sign in with Google."
          );
        }

        if (!user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        user.lastLoginAt = new Date();
        await user.save();

        // ✅ CORRECTION 1: Return the full user object from the database.
        // This ensures all data (phone, address, etc.) is available for the JWT callback.
        return user;
      },
    }),
  ],

  pages: {
    signIn: "/login",
    signUp: "/signup",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectDB();

        try {
          let existingUser = await User.findOne({ email: user.email });

          if (existingUser) {
            if (!existingUser.providers?.google?.id) {
              existingUser.providers = {
                ...existingUser.providers,
                google: {
                  id: account.providerAccountId,
                  email: user.email,
                },
              };
              existingUser.isVerified = true;
              await existingUser.save();
            }
          } else {
            existingUser = new User({
              name: user.name,
              email: user.email,
              image: user.image,
              emailVerified: new Date(),
              isVerified: true,
              providers: {
                google: {
                  id: account.providerAccountId,
                  email: user.email,
                },
              },
              role: "user",
              isProfileComplete: false,
              lastLoginAt: new Date(),
            });
            await existingUser.save();
          }

          // ✅ CORRECTION 2: Attach ALL necessary database properties to the user object
          // so they are passed to the JWT and Session callbacks.
          user.id = existingUser._id.toString();
          user.role = existingUser.role;
          user.isProfileComplete = existingUser.isProfileComplete;
          user.hasPassword = !!existingUser.password;
          user.phone = existingUser.phone;
          user.gender = existingUser.gender;
          user.dateOfBirth = existingUser.dateOfBirth;
          user.address = existingUser.address;

          return true;
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      // The 'user' object is available on sign-in and contains the full data
      // from either the 'authorize' or 'signIn' callback.
      if (user) {
        // Note: MongoDB's _id is an object, so we convert it to a string.
        token.id = user._id ? user._id.toString() : user.id;
        token.role = user.role;
        token.isProfileComplete = user.isProfileComplete;
        token.hasPassword = user.hasPassword ?? !!user.password;

        // ✅ CORRECTION 3: Add the rest of the user properties to the token.
        token.phone = user.phone;
        token.gender = user.gender;
        token.dateOfBirth = user.dateOfBirth;
        token.address = user.address;
      }
      return token;
    },

    async session({ session, token }) {
      // The token now contains all our custom data.
      // We add this data to the session object, so it's available on the client.
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isProfileComplete = token.isProfileComplete;
        session.user.hasPassword = token.hasPassword;

        // ✅ CORRECTION 4: Add the rest of the properties to the session.
        session.user.phone = token.phone;
        session.user.gender = token.gender;
        session.user.dateOfBirth = token.dateOfBirth;
        session.user.address = token.address;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
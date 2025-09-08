// src/component/auth/ProfileComplete.jsx
"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Users,
  Lock,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";

export default function ProfileComplete() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: {
      street: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
    },
  });
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
    setupPassword: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  useEffect(() => {
    if (session?.user?.isProfileComplete) {
      router.push("/dashboard");
    }

    // Check if user signed up with Google and doesn't have password
    if (session?.user?.email && session?.user?.image) {
      // Likely a Google user - check if they have password
      checkUserAuthMethods();
    }
  }, [session, router]);

  const checkUserAuthMethods = async () => {
    try {
      const response = await fetch("/api/users/auth-methods", {
        method: "GET",
      });
      const data = await response.json();

      if (data.hasGoogle && !data.hasPassword) {
        setIsGoogleUser(true);
      }
    } catch (error) {
      console.error("Error checking auth methods:", error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Update the session first
      await update();

      // If user wants to setup password and is Google user, go to step 2
      if (isGoogleUser && passwordData.setupPassword) {
        setCurrentStep(2);
      } else {
        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (passwordData.password !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (passwordData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          password: passwordData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to set password");
      }

      // After successfully setting password, sign the user in again with their new credentials
      // This ensures they have a fresh session with password authentication
      const signInResult = await signIn("credentials", {
        email: session?.user?.email,
        password: passwordData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // If sign in fails, still update session and redirect (they're already logged in via Google)
        console.warn(
          "Auto sign-in failed, but user is still authenticated via Google"
        );
        await update();
        router.push("/dashboard");
      } else {
        // Successful sign-in with new password credentials
        // Wait a moment for the session to update, then redirect
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      }
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const skipToNext = async () => {
    if (isGoogleUser && passwordData.setupPassword) {
      setCurrentStep(2);
    } else {
      // Update session to ensure profile completion status is current
      await update();
      router.push("/dashboard");
    }
  };

  const skipPasswordSetup = async () => {
    // Update session and redirect to dashboard
    await update();
    router.push("/dashboard");
  };

  // Step 1: Profile Information
  if (currentStep === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Complete Your Profile
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Help us personalize your experience on  Business Hub
            </p>
            {isGoogleUser && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Shield className="inline h-4 w-4 mr-1" />
                  You signed up with Google. You can need set a password
                  for email login.
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Gender
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address.pincode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    PIN Code
                  </label>
                  <input
                    id="address.pincode"
                    name="address.pincode"
                    type="text"
                    maxLength="6"
                    value={formData.address.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="441601"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address.street"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Street Address
                </label>
                <input
                  id="address.street"
                  name="address.street"
                  type="text"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="House/Flat No, Street Name"
                />
              </div>

              <div>
                <label
                  htmlFor="address.area"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Area/Locality
                </label>
                <input
                  id="address.area"
                  name="address.area"
                  type="text"
                  value={formData.address.area}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Civil Lines, Main Road, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="address.city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City
                  </label>
                  <input
                    id="address.city"
                    name="address.city"
                    type="text"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                    readOnly
                  />
                </div>

                <div>
                  <label
                    htmlFor="address.state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State
                  </label>
                  <input
                    id="address.state"
                    name="address.state"
                    type="text"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                    readOnly
                  />
                </div>
              </div>

              {/* Password Setup Option for Google Users */}
              {isGoogleUser && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="setupPassword"
                        name="setupPassword"
                        type="checkbox"
                        checked={passwordData.setupPassword}
                        onChange={handlePasswordInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <label
                        htmlFor="setupPassword"
                        className="text-sm font-medium text-gray-700"
                      >
                        Set up password for email login
                      </label>
                      <p className="text-xs text-gray-500">
                        This will allow you to sign in with email and password
                        in addition to Google.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                {/* <button
                  type="button"
                  onClick={skipToNext}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Skip for now
                </button> */}
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading
                    ? "Saving..."
                    : isGoogleUser && passwordData.setupPassword
                    ? "Next: Set Password"
                    : "Complete Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Password Setup (only for Google users who chose to set password)
  if (currentStep === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Set Your Password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Set a password to enable email login for your account
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwordData.password}
                    onChange={handlePasswordInputChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter new password"
                    minLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                {/* <button
                  type="button"
                  onClick={skipPasswordSetup}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Skip for now
                </button> */}
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Setting Password..." : "Complete Setup"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// src/components/business/BusinessListingForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Upload,
  Tag,
  Facebook,
  Instagram,
  MessageCircle,
  Plus,
  X,
  CheckCircle,
  Camera,
  Image as ImageIcon,
} from "lucide-react";

const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function BusinessListingForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Image upload states
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    address: {
      street: "",
      area: "",
      pincode: "",
      city: "Coochbehar",
      state: "West Bengal",
    },
    coordinates: ["", ""], // [longitude, latitude]
    contact: {
      phone: [""],
      email: "",
      website: "",
    },
    hours: {
      monday: { open: "09:00", close: "18:00", isClosed: false },
      tuesday: { open: "09:00", close: "18:00", isClosed: false },
      wednesday: { open: "09:00", close: "18:00", isClosed: false },
      thursday: { open: "09:00", close: "18:00", isClosed: false },
      friday: { open: "09:00", close: "18:00", isClosed: false },
      saturday: { open: "09:00", close: "18:00", isClosed: false },
      sunday: { open: "10:00", close: "17:00", isClosed: false },
    },
    socialMedia: {
      facebook: "",
      instagram: "",
      whatsapp: "",
    },
    tags: [],
    logo: "", // Business logo
    images: [], // Business images array
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Logo upload handler - Updated to use server-side API
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, or WebP).");
      return;
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError("File size must be less than 5MB.");
      return;
    }

    setIsUploadingLogo(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("files", file); // Note: using 'files' to match API route

      const response = await fetch("/api/upload/upload-to-cloudinary", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const { urls } = await response.json();
      const logoUrl = urls[0]; // Get the first (and only) uploaded URL

      // Update the form data with the new logo URL
      setFormData((prev) => ({
        ...prev,
        logo: logoUrl,
      }));
    } catch (error) {
      console.error("Error uploading logo:", error);
      setError(error.message || "Failed to upload logo. Please try again.");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Business images upload handler - Updated to use server-side API
  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Validate files
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    const maxFiles = 10; // Maximum 10 images

    if (formData.images.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed.`);
      return;
    }

    for (let file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError("Please select valid image files (JPEG, PNG, GIF, or WebP).");
        return;
      }
      if (file.size > maxSize) {
        setError("Each file size must be less than 5MB.");
        return;
      }
    }

    setIsUploadingImages(true);
    setError("");

    try {
      const uploadFormData = new FormData();
      files.forEach((file) => {
        uploadFormData.append("files", file); // Append all files with the same key
      });

      const response = await fetch("/api/upload/upload-to-cloudinary", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const { urls } = await response.json();

      // Update the form data with the new image URLs
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
      setError(error.message || "Failed to upload images. Please try again.");
    } finally {
      setIsUploadingImages(false);
    }
  };

  // Remove uploaded image - This function remains the same
  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleInputChange = (e, section = null) => {
    const { name, value, type, checked } = e.target;

    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...formData.contact.phone];
    newPhones[index] = value;
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        phone: newPhones,
      },
    }));
  };

  const addPhone = () => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        phone: [...prev.contact.phone, ""],
      },
    }));
  };

  const removePhone = (index) => {
    const newPhones = formData.contact.phone.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        phone: newPhones.length > 0 ? newPhones : [""],
      },
    }));
  };

  const handleHoursChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          [field]: value,
        },
      },
    }));
  };

  const addTag = (tagText) => {
    if (tagText.trim() && !formData.tags.includes(tagText.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagText.trim()],
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Debug: Check what data we're sending
      console.log("Form data before submission:", formData);

      // Ensure required fields are present
      if (!formData.address.area || !formData.address.street) {
        setError("Street address and area are required");
        setLoading(false);
        return;
      }

      const businessData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        address: {
          street: formData.address.street,
          area: formData.address.area,
          pincode: formData.address.pincode,
          city: formData.address.city || "Coochbehar",
          state: formData.address.state || "West Bengal",
        },
        location: {
          type: "Point",
          coordinates: [
            parseFloat(formData.coordinates[0]) || 0,
            parseFloat(formData.coordinates[1]) || 0,
          ],
        },
        contact: formData.contact,
        hours: formData.hours,
        socialMedia: formData.socialMedia,
        tags: formData.tags,
        logo: formData.logo,
        images: formData.images,
      };

      console.log("Business data being sent:", businessData);

      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(businessData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create business listing");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/services");
      }, 3000);
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5)); // Updated to 5 steps
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Service Listed Successfully!
        </h2>
        {/* <p className="text-gray-600 mb-6">
          Your Services has been submitted for review. We'll notify you once
          it's approved and live on the platform.
        </p> */}
        <p className="text-sm text-gray-500">
          Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Progress Steps */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`flex items-center ${step < 5 ? "flex-1" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    currentStep >= step ? "text-primary-600" : "text-gray-500"
                  }`}
                >
                  {step === 1 && "Basic Info"}
                  {step === 2 && "Location & Contact"}
                  {step === 3 && "Images & Logo"}
                  {step === 4 && "Hours & Social"}
                  {step === 5 && "Review"}
                </p>
              </div>
              {step < 5 && (
                <div
                  className={`flex-1 h-0.5 ml-4 ${
                    currentStep > step ? "bg-primary-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Service Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your business name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Category *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {formData.category && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a subcategory</option>
                  {categories
                    .find((cat) => cat._id === formData.category)
                    ?.subcategories?.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe your business, services, and what makes you unique..."
              />
            </div>
          </div>
        )}

        {/* Step 2: Location & Contact */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Location & Contact Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  value={formData.address.street}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Shop/Building No, Street Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area/Locality *
                </label>
                <input
                  type="text"
                  name="area"
                  required
                  value={formData.address.area}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Civil Lines, Main Road, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN Code *
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  maxLength="6"
                  value={formData.address.pincode}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="441601"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>
            </div>

            {/* Coordinates (Optional) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude (Optional)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.coordinates[0]}
                  onChange={(e) => {
                    const newCoords = [...formData.coordinates];
                    newCoords[0] = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      coordinates: newCoords,
                    }));
                  }}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 80.1924"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude (Optional)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.coordinates[1]}
                  onChange={(e) => {
                    const newCoords = [...formData.coordinates];
                    newCoords[1] = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      coordinates: newCoords,
                    }));
                  }}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 21.4509"
                />
              </div>
            </div>

            {/* Phone Numbers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Numbers *
              </label>
              {formData.contact.phone.map((phone, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="tel"
                      required={index === 0}
                      value={phone}
                      onChange={(e) => handlePhoneChange(index, e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removePhone(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addPhone}
                className="flex items-center text-primary-600 hover:text-primary-700 text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add another phone
              </button>
            </div>

            {/* Email & Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.contact.email}
                    onChange={(e) => handleInputChange(e, "contact")}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="business@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="url"
                    name="website"
                    value={formData.contact.website}
                    onChange={(e) => handleInputChange(e, "contact")}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://www.yourbusiness.com"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Images & Logo */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Business Images & Logo
            </h3>

            {/* Business Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Logo
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Upload your Service logo (recommended size: 300x300px)
              </p>

              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={isUploadingLogo}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 disabled:opacity-50"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    JPEG, PNG, GIF, or WebP. Max 5MB.
                  </p>
                </div>

                {formData.logo && (
                  <div className="w-20 h-20 border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={formData.logo}
                      alt="Service Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {isUploadingLogo && (
                  <div className="w-20 h-20 border border-gray-200 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Business Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Images
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Upload photos of your business, products, or Service (up to 10
                images)
              </p>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImagesUpload}
                disabled={isUploadingImages || formData.images.length >= 10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 disabled:opacity-50"
              />
              <p className="mt-1 text-xs text-gray-500">
                JPEG, PNG, GIF, or WebP. Max 5MB each. {formData.images.length}
                /10 images uploaded.
              </p>

              {isUploadingImages && (
                <div className="mt-4 flex items-center text-primary-600">
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="text-sm">Uploading images...</span>
                </div>
              )}

              {/* Display uploaded images */}
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Uploaded Images
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Business image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Hours & Social Media */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Business Hours & Social Media
            </h3>

            {/* Business Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Business Hours
              </label>
              <div className="space-y-3">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-24">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {day}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.hours[day].isClosed}
                        onChange={(e) =>
                          handleHoursChange(day, "isClosed", e.target.checked)
                        }
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-600">Closed</span>
                    </div>
                    {!formData.hours[day].isClosed && (
                      <>
                        <input
                          type="time"
                          value={formData.hours[day].open}
                          onChange={(e) =>
                            handleHoursChange(day, "open", e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={formData.hours[day].close}
                          onChange={(e) =>
                            handleHoursChange(day, "close", e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Social Media (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Facebook
                  </label>
                  <div className="relative">
                    <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="url"
                      name="facebook"
                      value={formData.socialMedia.facebook}
                      onChange={(e) => handleInputChange(e, "socialMedia")}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Facebook page URL"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Instagram
                  </label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="url"
                      name="instagram"
                      value={formData.socialMedia.instagram}
                      onChange={(e) => handleInputChange(e, "socialMedia")}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Instagram profile URL"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    WhatsApp
                  </label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.socialMedia.whatsapp}
                      onChange={(e) => handleInputChange(e, "socialMedia")}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Add relevant keywords to help customers find your business
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Enter a tag and press Enter"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.target.parentElement.querySelector("input");
                    addTag(input.value);
                    input.value = "";
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Review Your Business Listing
            </h3>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Basic Information
                  </h4>
                  <p>
                    <strong>Name:</strong> {formData.name}
                  </p>
                  <p>
                    <strong>Category:</strong>{" "}
                    {categories.find((c) => c._id === formData.category)?.name}
                  </p>
                  {formData.subcategory && (
                    <p>
                      <strong>Subcategory:</strong> {formData.subcategory}
                    </p>
                  )}
                  <p className="mt-2">
                    <strong>Description:</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    {formData.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Contact & Location
                  </h4>
                  <p>
                    <strong>Address:</strong> {formData.address.street},{" "}
                    {formData.address.area}, {formData.address.city} -{" "}
                    {formData.address.pincode}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {formData.contact.phone.filter((p) => p).join(", ")}
                  </p>
                  {formData.contact.email && (
                    <p>
                      <strong>Email:</strong> {formData.contact.email}
                    </p>
                  )}
                  {formData.contact.website && (
                    <p>
                      <strong>Website:</strong> {formData.contact.website}
                    </p>
                  )}
                </div>
              </div>

              {/* Images Review */}
              {(formData.logo || formData.images.length > 0) && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Images</h4>
                  <div className="flex flex-wrap gap-4">
                    {formData.logo && (
                      <div className="text-center">
                        <img
                          src={formData.logo}
                          alt="Business Logo"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <p className="text-xs text-gray-500 mt-1">Logo</p>
                      </div>
                    )}
                    {formData.images.slice(0, 5).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Business image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                    ))}
                    {formData.images.length > 5 && (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-500">
                          +{formData.images.length - 5} more
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {formData.tags.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary-100 text-primary-800 text-sm rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Your business listing will be reviewed by
                our team before going live. This usually takes 24-48 hours.
                You'll receive an email notification once approved.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg font-medium ${
              currentStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Previous
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit for Review"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// File: src/app/api/upload/upload-to-cloudinary/route.js
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "reviews",
              resource_type: "auto",
              quality: "auto",
              fetch_format: "auto",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      return result.secure_url;
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// Updated handleImageUpload function for src/component/business/ReviewSystem.jsx
const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  if (reviewForm.images.length + files.length > 5) {
    toast.error("Maximum 5 images allowed per review");
    return;
  }

  setUploadingImages(true);

  try {
    // Validate files before upload
    for (const file of files) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Please select valid image files (JPEG, PNG, GIF, or WebP)."
        );
      }

      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        throw new Error("File size must be less than 5MB.");
      }
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch("/api/upload/upload-to-cloudinary", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload failed");
    }

    const { urls } = await response.json();

    setReviewForm((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...urls],
    }));

    toast.success(`${files.length} image(s) uploaded successfully!`);
  } catch (error) {
    console.error("Error uploading images:", error);
    toast.error(error.message || "Failed to upload images. Please try again.");
  } finally {
    setUploadingImages(false);
  }
};

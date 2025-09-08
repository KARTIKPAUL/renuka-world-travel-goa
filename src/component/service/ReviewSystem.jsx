"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Star, X, User, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";

const ReviewSystem = ({ businessId, isOwner }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: "",
    images: [],
  });
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [businessId, currentPage]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `/api/services/${businessId}/reviews?page=${currentPage}&limit=5`
      );
      const data = await response.json();

      if (response.ok) {
        setReviews(data.reviews);
        setPagination(data.pagination);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleWriteReview = () => {
    if (!session) {
      router.push(
        `/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`
      );
      return;
    }
    setShowReviewForm(true);
  };

  const handleRatingClick = (rating) => {
    setReviewForm((prev) => ({ ...prev, rating }));
  };

  // Using your handleAvatarUpload pattern for multiple images
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
      toast.error(
        error.message || "Failed to upload images. Please try again."
      );
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setReviewForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewForm.rating || !reviewForm.comment.trim()) {
      toast.error("Please provide both rating and comment");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/services/${businessId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Review submitted successfully!");
        setShowReviewForm(false);
        setReviewForm({ rating: 0, comment: "", images: [] });
        fetchReviews();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, size = "h-5 w-5") => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`${size} transition-colors ${
          interactive ? "cursor-pointer" : ""
        } ${
          star <= rating
            ? "text-yellow-400 fill-current"
            : interactive
            ? "text-gray-300 hover:text-yellow-300"
            : "text-gray-300"
        }`}
        onClick={interactive ? () => handleRatingClick(star) : undefined}
      />
    ));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          Customer Reviews ({pagination?.total || 0})
        </h2>

        {!isOwner && (
          <button
            onClick={handleWriteReview}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            disabled={submitting}
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Write a Review
                </h3>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <div className="flex space-x-1">
                    {renderStars(reviewForm.rating, true)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment *
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    rows="4"
                    placeholder="Share your experience..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos (Optional)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={
                        uploadingImages || reviewForm.images.length >= 5
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 disabled:opacity-50"
                    />

                    {reviewForm.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {reviewForm.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {uploadingImages && (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                        <span className="ml-2 text-sm text-gray-600">
                          Uploading images...
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    JPEG, PNG, GIF, or WebP. Max 5MB each. Maximum 5 images.
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      uploadingImages ||
                      !reviewForm.rating ||
                      !reviewForm.comment.trim()
                    }
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-600">
              Be the first to review this service!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {review.userId?.avatar ? (
                    <img
                      src={review.userId.avatar}
                      alt={review.userId.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {review.userId?.name || "Anonymous"}
                      </h4>
                      <div className="flex items-center mt-1">
                        {renderStars(review.rating, false, "h-4 w-4")}
                        <span className="ml-2 text-sm text-gray-600">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <p className="mt-3 text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>

                  {review.images && review.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-75 transition-opacity"
                          onClick={() => window.open(image, "_blank")}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <span className="px-3 py-2 text-gray-700">
              Page {currentPage} of {pagination.pages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, pagination.pages))
              }
              disabled={currentPage === pagination.pages}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;

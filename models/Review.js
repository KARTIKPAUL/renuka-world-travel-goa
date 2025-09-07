import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure one review per user per business
ReviewSchema.index({ businessId: 1, userId: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);

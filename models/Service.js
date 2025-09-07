import mongoose from "mongoose";

const BusinessSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: { type: String },
    address: {
      street: { type: String, required: true },
      area: { type: String, required: true },
      pincode: { type: String, required: true },
      city: { type: String },
      state: { type: String },
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    contact: {
      phone: [{ type: String, required: true }],
      email: { type: String },
      website: { type: String },
    },
    hours: {
      type: Map,
      of: {
        open: String,
        close: String,
        isClosed: Boolean,
      },
    },
    images: [{ type: String }],
    logo: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    socialMedia: {
      facebook: String,
      instagram: String,
      whatsapp: String,
    },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

BusinessSchema.index({ location: "2dsphere" });
BusinessSchema.index({ name: "text", description: "text" });

export default mongoose.models.Business ||
  mongoose.model("Business", BusinessSchema);

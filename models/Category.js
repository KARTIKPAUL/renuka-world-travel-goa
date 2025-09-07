import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
  description: { type: String },
  subcategories: [{ type: String }],
  businessCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true, // This creates the index, so the line at the bottom is not needed
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.providers?.google?.id;
      },
    },
    emailVerified: { type: Date },
    image: { type: String },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^[+]?[0-9]{10,15}$/.test(v);
        },
        message: "Invalid phone number format",
      },
    },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    address: {
      street: { type: String, trim: true },
      area: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: {
        type: String,
        validate: {
          validator: function (v) {
            return !v || /^[0-9]{6}$/.test(v);
          },
          message: "Invalid pincode format",
        },
      },
    },
    role: {
      type: String,
      enum: ["user", "owner", "admin"],
      default: "user",
    },
    isVerified: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    providers: {
      // ✅ IMPROVEMENT: Add default empty objects for safety
      type: {
        google: {
          id: { type: String },
          email: { type: String },
        },
        credentials: {
          hasPassword: { type: Boolean, default: false },
        },
      },
      default: () => ({}),
    },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      marketingEmails: { type: Boolean, default: false },
    },
    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// ✅ FIX: The index from `unique: true` on the email field is enough. Remove the duplicate.
// UserSchema.index({ email: 1 });

// This index is great for finding returning Google users quickly.
// Using 'sparse' makes the index more efficient as it only includes users who have a Google ID.
UserSchema.index({ "providers.google.id": 1 }, { sparse: true });
UserSchema.index({ phone: 1 }, { sparse: true }); // 'sparse' is also good here

UserSchema.methods.checkProfileCompleteness = function () {
  const requiredFields = [this.name, this.email, this.phone];

  const isComplete = requiredFields.every((field) => field && field.length > 0);
  this.isProfileComplete = isComplete;
  return isComplete;
};

UserSchema.pre("save", function (next) {
  this.checkProfileCompleteness();
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);

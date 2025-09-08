// src/lib/validations.js
import { z } from "zod";

export const userRegistrationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
  phone: z
    .string()
    .regex(/^[+]?[0-9]{10,15}$/, "Invalid phone number")
    .optional(),
  role: z.enum(["user", "owner"]).default("user"),
});

export const businessSchema = z.object({
  name: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    area: z.string().min(1, "Area is required"),
    pincode: z.string().regex(/^[0-9]{6}$/, "Invalid PIN code"),
    city: z.string().default("goa"),
    state: z.string().default("goa"),
  }),
  contact: z.object({
    phone: z
      .array(z.string().regex(/^[+]?[0-9]{10,15}$/, "Invalid phone number"))
      .min(1, "At least one phone number is required"),
    email: z.string().email("Invalid email").optional(),
    website: z.string().url("Invalid website URL").optional(),
  }),
  socialMedia: z
    .object({
      facebook: z.string().url("Invalid Facebook URL").optional(),
      instagram: z.string().url("Invalid Instagram URL").optional(),
      whatsapp: z.string().optional(),
    })
    .optional(),
});

export const profileUpdateSchema = z.object({
  phone: z
    .string()
    .regex(/^[+]?[0-9]{10,15}$/, "Invalid phone number")
    .optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  address: z
    .object({
      street: z.string().optional(),
      area: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z
        .string()
        .regex(/^[0-9]{6}$/, "Invalid PIN code")
        .optional(),
    })
    .optional(),
});

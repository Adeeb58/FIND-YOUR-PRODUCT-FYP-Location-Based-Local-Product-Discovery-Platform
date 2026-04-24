// src/utils/validationSchemas.js
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export const signupSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Confirm Password must be at least 8 characters." }),
  role: z.enum(['user', 'vendor'], {
    errorMap: () => ({ message: "Please select a role." })
  }), // User or Vendor
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"], // Path of error
});

// Example for product form (to be used later)
export const productSchema = z.object({
  name: z.string().min(3, { message: "Product name is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.preprocess(
    (val) => parseFloat(val),
    z.number().positive({ message: "Price must be a positive number." })
  ),
  category: z.string().min(1, { message: "Category is required." }),
  stock: z.preprocess(
    (val) => parseInt(val, 10),
    z.number().int().min(0, { message: "Stock cannot be negative." })
  ),
  // imageUrl: z.string().url({ message: "Invalid image URL." }).optional(), // If you handle image uploads separately
});
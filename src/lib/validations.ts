import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15).optional().or(z.literal("")),
  company: z.string().max(100).optional().or(z.literal("")),
  service: z.string().max(100).optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export const quoteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  company: z.string().max(100).optional().or(z.literal("")),
  service: z.string().min(1, "Please select a service"),
  description: z.string().min(20, "Please provide more details about your project").max(2000),
  budget: z.string().max(100).optional().or(z.literal("")),
  timeline: z.string().max(100).optional().or(z.literal("")),
});

export const careerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  position: z.string().min(1, "Please select a position"),
  experience: z.string().min(1, "Please enter your experience"),
  qualification: z.string().min(1, "Please enter your qualification"),
  coverLetter: z.string().max(2000).optional().or(z.literal("")),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  slug: z.string().min(2, "Slug is required").max(200),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(500),
  content: z.string().min(50, "Content must be at least 50 characters"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  author: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  tags: z.string().optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  slug: z.string().min(2, "Slug is required").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  category: z.string().min(1, "Category is required"),
  clientName: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().optional(),
  featured: z.boolean().optional(),
  images: z.array(z.string()).optional(),
});

export const gallerySchema = z.object({
  title: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  imageUrl: z.string().min(1, "Image URL is required"),
  category: z.string().min(1, "Category is required"),
  featured: z.boolean().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
export type CareerInput = z.infer<typeof careerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BlogInput = z.infer<typeof blogSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type GalleryInput = z.infer<typeof gallerySchema>;

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export interface ServiceData {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  imageUrl?: string;
  benefits: string[];
  applications: string[];
  process: string[];
  faq?: FAQItem[];
  featured: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  icon: string;
}

export interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string;
}

export interface MachineryData {
  id: string;
  name: string;
  description: string;
  specifications: Record<string, string>;
  imageUrl?: string;
  category?: string;
  quantity: number;
  status: string;
}

export interface ClientData {
  id: string;
  name: string;
  logoUrl?: string;
  industry?: string;
  website?: string;
  featured: boolean;
}

export interface TestimonialData {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  avatarUrl?: string;
}

export interface ProjectData {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  category: string;
  clientName?: string;
  location?: string;
  date?: string;
  imageUrl?: string;
  images: string[];
  featured: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  author: string;
  category?: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  category: string;
  featured: boolean;
}

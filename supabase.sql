-- ==========================================
-- RD Engineering - Supabase Database Schema
-- Run this script in the Supabase SQL Editor
-- ==========================================

-- Enable pgcrypto for UUID/hash support if needed
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Create Tables
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "message" TEXT NOT NULL,
    "service" TEXT,
    "browser" TEXT,
    "ip" TEXT,
    "status" TEXT NOT NULL DEFAULT 'unread',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Quote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "company" TEXT,
    "service" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" TEXT,
    "timeline" TEXT,
    "browser" TEXT,
    "ip" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Career" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "resumeUrl" TEXT,
    "coverLetter" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Blog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "author" TEXT NOT NULL DEFAULT 'RD Engineering',
    "category" TEXT,
    "tags" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "category" TEXT NOT NULL,
    "clientName" TEXT,
    "location" TEXT,
    "date" TIMESTAMP(3),
    "imageUrl" TEXT,
    "images" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Gallery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "icon" TEXT,
    "imageUrl" TEXT,
    "benefits" TEXT[],
    "applications" TEXT[],
    "process" TEXT[],
    "faq" JSONB,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Machinery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "specifications" JSONB,
    "imageUrl" TEXT,
    "category" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'operational',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT,
    "imageUrl" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "industry" TEXT,
    "website" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "company" TEXT,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "avatarUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "PageView" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "page" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Setting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE,
    "value" TEXT NOT NULL
);

-- ==========================================
-- 2. Configure Row Level Security (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Contact" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Quote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Career" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Blog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Gallery" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Service" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Machinery" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TeamMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Client" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Testimonial" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FAQ" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PageView" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Setting" ENABLE ROW LEVEL SECURITY;

-- Create Policies

-- Admin table: Read-only access by auth/admin, no public access
CREATE POLICY "Admin access" ON "Admin" FOR ALL TO authenticated USING (true);

-- Contact table: Public insert, auth full access
CREATE POLICY "Public insert Contact" ON "Contact" FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth access Contact" ON "Contact" FOR ALL TO authenticated USING (true);

-- Quote table: Public insert, auth full access
CREATE POLICY "Public insert Quote" ON "Quote" FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth access Quote" ON "Quote" FOR ALL TO authenticated USING (true);

-- Career table: Public insert, auth full access
CREATE POLICY "Public insert Career" ON "Career" FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth access Career" ON "Career" FOR ALL TO authenticated USING (true);

-- Read-only tables for public, full access to auth admin
CREATE POLICY "Public read Blog" ON "Blog" FOR SELECT USING (true);
CREATE POLICY "Auth access Blog" ON "Blog" FOR ALL TO authenticated USING (true);

CREATE POLICY "Public read Project" ON "Project" FOR SELECT USING (true);
CREATE POLICY "Auth access Project" ON "Project" FOR ALL TO authenticated USING (true);

CREATE POLICY "Public read Gallery" ON "Gallery" FOR SELECT USING (true);
CREATE POLICY "Auth access Gallery" ON "Gallery" FOR ALL TO authenticated USING (true);

CREATE POLICY "Public read Service" ON "Service" FOR SELECT USING (true);
CREATE POLICY "Auth access Service" ON "Service" FOR ALL TO authenticated USING (true);

CREATE POLICY "Public read Machinery" ON "Machinery" FOR SELECT USING (true);
CREATE POLICY "Auth access Machinery" ON "Machinery" FOR ALL TO authenticated USING (true);

CREATE POLICY "Public read TeamMember" ON "TeamMember" FOR SELECT USING (true);
CREATE POLICY "Auth access TeamMember" ON "TeamMember" FOR ALL TO authenticated USING (true);

CREATE POLICY "Public read Client" ON "Client" FOR SELECT USING (true);
CREATE POLICY "Auth access Client" ON "Client" FOR ALL TO authenticated USING (true);

CREATE POLICY "Public read Testimonial" ON "Testimonial" FOR SELECT USING (true);
CREATE POLICY "Auth access Testimonial" ON "Testimonial" FOR ALL TO authenticated USING (true);

CREATE POLICY "Public read FAQ" ON "FAQ" FOR SELECT USING (true);
CREATE POLICY "Auth access FAQ" ON "FAQ" FOR ALL TO authenticated USING (true);

CREATE POLICY "Public access PageView" ON "PageView" FOR ALL USING (true);

CREATE POLICY "Public read Setting" ON "Setting" FOR SELECT USING (true);
CREATE POLICY "Auth access Setting" ON "Setting" FOR ALL TO authenticated USING (true);

-- ==========================================
-- 3. Initial Seed Data
-- ==========================================

-- Admin User (Username: admin, Password: admin123, Salted PBKDF2)
INSERT INTO "Admin" ("id", "username", "email", "password", "role", "createdAt", "updatedAt") 
VALUES (
    'admin-init-id', 
    'admin', 
    'rdengineering1212@gmail.com', 
    '8e8e7c10b7ea1b7da85b31dfbd6c3ee7:829d5b0a3fdf2a6f8ff5a3b2b8adab0ee6de69d722e03211ebcf3066d03d3c8d17a4128f73111451f2fde978cf4d8cb8452bf5488102436d4dfbaea8fbdbe19b', 
    'admin', 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- Services
INSERT INTO "Service" ("id", "title", "slug", "description", "icon", "benefits", "applications", "process", "featured", "order", "createdAt", "updatedAt")
VALUES 
('s1', 'Steel Fabrication', 'steel-fabrication', 'Custom steel structures, beams, columns, and industrial frameworks.', 'Building2', ARRAY['High strength-to-weight ratio', 'Custom designs', 'Rapid installation'], ARRAY['Factory buildings', 'Industrial sheds', 'Mezzanine floors'], ARRAY['Requirement Analysis', 'Design', 'Fabrication', 'Erection'], true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('s2', 'Roof Structure & Sheet Work', 'roof-structure-sheet-work', 'Complete industrial roofing solutions including PEB structures and metal sheet roofing.', 'Warehouse', ARRAY['Weather-resistant', 'Energy-efficient', 'Quick installation'], ARRAY['Factory roofs', 'Warehouse roofing', 'Commercial roofs'], ARRAY['Assessment', 'Design', 'Installation', 'Finishing'], true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

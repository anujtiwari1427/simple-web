-- Supabase SQL Schema for Code Decoded

-- 1. Resources Table
CREATE TABLE IF NOT EXISTS public.resources (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  topic TEXT NOT NULL,
  type TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  download_url TEXT NOT NULL,
  downloads_count INTEGER NOT NULL DEFAULT 0,
  is_new BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  file_size TEXT,
  author TEXT NOT NULL DEFAULT 'Code Decoded Team',
  key_takeaways TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. User Bookmarks Table
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id TEXT REFERENCES public.resources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, resource_id)
);

-- 3. Roadmap Progress Table
CREATE TABLE IF NOT EXISTS public.roadmap_progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  roadmap_id TEXT NOT NULL,
  completed_step_ids TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, roadmap_id)
);

-- 4. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Contact Inquiries Table
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  inquiry_type TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

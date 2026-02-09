-- =============================================================================
-- Global Talent World - Admin Panel Database Setup
-- =============================================================================
-- This file sets up the database tables, columns, and RLS policies required
-- for the admin panel functionality, including:
--   - A `reviews` table for managing user reviews
--   - Additional columns on `profiles` (recruiter_status, recruiter_company, is_banned)
--   - Additional columns on `posts` (status, flag_reason)
--   - RLS policies on the `reviews` table
--   - Admin-friendly RLS policies on `profiles`, `jobs`, and `posts` tables
--
-- Run this AFTER supabase-setup.sql
-- =============================================================================


-- =============================================================================
-- 1. Create the `reviews` table
-- =============================================================================

create table if not exists public.reviews (
    id uuid default uuid_generate_v4() primary key,
    author_name text not null,
    author_avatar text,
    rating int not null check (rating >= 1 and rating <= 5),
    title text not null,
    content text not null,
    company text,
    is_visible boolean default true,
    is_flagged boolean default false,
    flag_reason text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);


-- =============================================================================
-- 2. Add missing columns to `profiles` table
-- =============================================================================

DO $$ BEGIN
    ALTER TABLE public.profiles ADD COLUMN recruiter_status text check (recruiter_status in ('pending', 'approved', 'rejected'));
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.profiles ADD COLUMN recruiter_company text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.profiles ADD COLUMN is_banned boolean default false;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;


-- =============================================================================
-- 3. Add missing columns to `posts` table
-- =============================================================================

DO $$ BEGIN
    ALTER TABLE public.posts ADD COLUMN status text default 'visible' check (status in ('visible', 'hidden', 'flagged'));
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.posts ADD COLUMN flag_reason text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;


-- =============================================================================
-- 4. Enable RLS on `reviews` table and create policies
-- =============================================================================

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Select: anyone can view reviews
CREATE POLICY "Reviews are viewable by everyone"
    ON public.reviews
    FOR SELECT
    USING (true);

-- Insert: authenticated users can create reviews
CREATE POLICY "Authenticated users can insert reviews"
    ON public.reviews
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Update: open policy so admin (via service role or anon) can update reviews
CREATE POLICY "Anyone can update reviews"
    ON public.reviews
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Delete: open policy so admin can delete reviews
CREATE POLICY "Anyone can delete reviews"
    ON public.reviews
    FOR DELETE
    USING (true);


-- =============================================================================
-- 5. Admin-friendly RLS policies on existing tables
-- =============================================================================

-- ---- profiles ----

-- Update policy: allow admin to update any profile (e.g. banning users)
CREATE POLICY "Admin can update any profile"
    ON public.profiles
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Delete policy: allow admin to delete any profile
CREATE POLICY "Admin can delete any profile"
    ON public.profiles
    FOR DELETE
    USING (true);

-- ---- jobs ----

-- Update policy: allow admin to update any job
CREATE POLICY "Admin can update any job"
    ON public.jobs
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Delete policy: allow admin to delete any job
CREATE POLICY "Admin can delete any job"
    ON public.jobs
    FOR DELETE
    USING (true);

-- ---- posts ----

-- Update policy: allow admin to update any post
CREATE POLICY "Admin can update any post"
    ON public.posts
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Delete policy: allow admin to delete any post
CREATE POLICY "Admin can delete any post"
    ON public.posts
    FOR DELETE
    USING (true);

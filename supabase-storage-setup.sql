-- ============================================================
-- Supabase Storage & Insights Setup
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Create insights table
CREATE TABLE IF NOT EXISTS insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Trends',
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    author_name TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add image_url to reviews table (safe idempotent add)
DO $$ BEGIN
    ALTER TABLE reviews ADD COLUMN image_url TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- 3. Ensure posts table has image column
DO $$ BEGIN
    ALTER TABLE posts ADD COLUMN image TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- 4. RLS policies for insights
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- Public can read published insights
DO $$ BEGIN
    CREATE POLICY "Anyone can read published insights" ON insights
        FOR SELECT USING (is_published = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Admin full access on insights
DO $$ BEGIN
    CREATE POLICY "Admin insert insights" ON insights
        FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admin update insights" ON insights
        FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admin delete insights" ON insights
        FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 5. Storage bucket "ST1" — already created via Supabase Dashboard
-- Folders inside: posts/, insights/, reviews/, avatars/, cvs/
--
-- Storage RLS policies for bucket "ST1"
-- These use the correct storage.objects table (NOT storage.policies which doesn't exist)

-- Allow anyone to read/download files (public access)
DO $$ BEGIN
    CREATE POLICY "Public read ST1" ON storage.objects
        FOR SELECT USING (bucket_id = 'ST1');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Allow authenticated users to upload files
DO $$ BEGIN
    CREATE POLICY "Authenticated upload ST1" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'ST1' AND auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Allow authenticated users to update their files
DO $$ BEGIN
    CREATE POLICY "Authenticated update ST1" ON storage.objects
        FOR UPDATE USING (bucket_id = 'ST1' AND auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Allow authenticated users to delete their files
DO $$ BEGIN
    CREATE POLICY "Authenticated delete ST1" ON storage.objects
        FOR DELETE USING (bucket_id = 'ST1' AND auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 6. Add updated_at trigger for insights
CREATE OR REPLACE FUNCTION update_insights_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_insights_updated_at ON insights;
CREATE TRIGGER trigger_insights_updated_at
    BEFORE UPDATE ON insights
    FOR EACH ROW EXECUTE FUNCTION update_insights_updated_at();

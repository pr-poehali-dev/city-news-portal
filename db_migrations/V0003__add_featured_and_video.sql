-- Add is_featured column for main news pinning
ALTER TABLE news ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Add video_url column for video content
ALTER TABLE news ADD COLUMN IF NOT EXISTS video_url TEXT;
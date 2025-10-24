-- Add status column to news table for published/draft management
ALTER TABLE news ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published';

-- Update existing news to be published
UPDATE news SET status = 'published' WHERE status IS NULL;
-- Add tags column to news table for СВО and other tags
ALTER TABLE t_p68330612_city_news_portal.news 
ADD COLUMN tags VARCHAR[] DEFAULT '{}';

-- Add index for faster tag filtering
CREATE INDEX idx_news_tags ON t_p68330612_city_news_portal.news USING gin(tags);
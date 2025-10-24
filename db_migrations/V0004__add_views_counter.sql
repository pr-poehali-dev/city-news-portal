-- Add views counter for news articles
ALTER TABLE t_p68330612_city_news_portal.news 
ADD COLUMN views INTEGER DEFAULT 0 NOT NULL;
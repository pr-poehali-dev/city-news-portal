-- Add likes counter for news articles
ALTER TABLE t_p68330612_city_news_portal.news 
ADD COLUMN likes INTEGER DEFAULT 0 NOT NULL;
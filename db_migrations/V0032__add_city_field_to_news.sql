ALTER TABLE t_p68330612_city_news_portal.news ADD COLUMN IF NOT EXISTS city VARCHAR(50) DEFAULT 'Краснодар';

CREATE INDEX IF NOT EXISTS idx_news_city ON t_p68330612_city_news_portal.news(city);

UPDATE t_p68330612_city_news_portal.news SET city = 'Краснодар' WHERE city IS NULL;
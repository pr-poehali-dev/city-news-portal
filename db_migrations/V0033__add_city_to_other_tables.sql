ALTER TABLE t_p68330612_city_news_portal.events ADD COLUMN IF NOT EXISTS city VARCHAR(50) DEFAULT 'Краснодар';
ALTER TABLE t_p68330612_city_news_portal.memory_articles ADD COLUMN IF NOT EXISTS city VARCHAR(50) DEFAULT 'Краснодар';
ALTER TABLE t_p68330612_city_news_portal.youth_notes ADD COLUMN IF NOT EXISTS city VARCHAR(50) DEFAULT 'Краснодар';

CREATE INDEX IF NOT EXISTS idx_events_city ON t_p68330612_city_news_portal.events(city);
CREATE INDEX IF NOT EXISTS idx_memory_articles_city ON t_p68330612_city_news_portal.memory_articles(city);
CREATE INDEX IF NOT EXISTS idx_youth_notes_city ON t_p68330612_city_news_portal.youth_notes(city);

UPDATE t_p68330612_city_news_portal.events SET city = 'Краснодар' WHERE city IS NULL;
UPDATE t_p68330612_city_news_portal.memory_articles SET city = 'Краснодар' WHERE city IS NULL;
UPDATE t_p68330612_city_news_portal.youth_notes SET city = 'Краснодар' WHERE city IS NULL;
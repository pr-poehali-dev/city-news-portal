-- Таблица для отслеживания уникальных просмотров по IP
CREATE TABLE IF NOT EXISTS t_p68330612_city_news_portal.news_unique_views (
    id SERIAL PRIMARY KEY,
    news_id INTEGER NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    viewed_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(news_id, ip_address)
);

CREATE INDEX idx_news_unique_views_news_id ON t_p68330612_city_news_portal.news_unique_views(news_id);
CREATE INDEX idx_news_unique_views_ip ON t_p68330612_city_news_portal.news_unique_views(ip_address);

-- Сбросим текущие счетчики views до нуля
UPDATE t_p68330612_city_news_portal.news SET views = 0;
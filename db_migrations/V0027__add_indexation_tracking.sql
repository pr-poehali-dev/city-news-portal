ALTER TABLE news ADD COLUMN IF NOT EXISTS indexed_yandex BOOLEAN DEFAULT FALSE;
ALTER TABLE news ADD COLUMN IF NOT EXISTS indexed_google BOOLEAN DEFAULT FALSE;
ALTER TABLE news ADD COLUMN IF NOT EXISTS last_ping_at TIMESTAMP;
ALTER TABLE news ADD COLUMN IF NOT EXISTS ping_count INTEGER DEFAULT 0;

COMMENT ON COLUMN news.indexed_yandex IS 'Индексирована ли новость в Яндексе';
COMMENT ON COLUMN news.indexed_google IS 'Индексирована ли новость в Google';
COMMENT ON COLUMN news.last_ping_at IS 'Время последнего уведомления поисковиков';
COMMENT ON COLUMN news.ping_count IS 'Количество отправленных уведомлений поисковикам';
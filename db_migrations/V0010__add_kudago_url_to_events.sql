-- Добавляем поля для интеграции с KudaGo и улучшенной информации о событиях
ALTER TABLE t_p68330612_city_news_portal.events 
  ADD COLUMN kudago_url TEXT,
  ADD COLUMN is_free BOOLEAN DEFAULT false,
  ADD COLUMN price VARCHAR(100),
  ADD COLUMN age_restriction VARCHAR(10),
  ADD COLUMN event_date_display VARCHAR(255);
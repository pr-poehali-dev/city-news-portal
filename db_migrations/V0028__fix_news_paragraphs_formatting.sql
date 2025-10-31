-- Исправление форматирования новостей: добавление тегов <p> для абзацев
-- Обрабатываем только новости без HTML-разметки

UPDATE t_p68330612_city_news_portal.news
SET content = '<p>' || REPLACE(REPLACE(TRIM(content), E'\n\n', '</p><p>'), E'\n', '<br>') || '</p>',
    updated_at = CURRENT_TIMESTAMP
WHERE content IS NOT NULL 
  AND content NOT LIKE '%<p>%' 
  AND content NOT LIKE '%<div>%'
  AND LENGTH(content) > 50;
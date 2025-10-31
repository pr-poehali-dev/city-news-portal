-- Исправление форматирования новостей: разбиение на абзацы по заголовкам и структурным элементам
-- Убираем старые теги <p> и создаем правильную структуру

UPDATE t_p68330612_city_news_portal.news
SET content = REGEXP_REPLACE(
    REGEXP_REPLACE(
        REGEXP_REPLACE(content, '</?p>', '', 'g'),
        '([А-ЯЁ][а-яё\s]+:)\s*([^А-ЯЁ])', '</p><p><strong>\1</strong> \2', 'g'
    ),
    '^(.)', '<p>\1', ''
) || '</p>',
    updated_at = CURRENT_TIMESTAMP
WHERE content LIKE '<p>%</p>'
  AND content NOT LIKE '%</p><p>%'
  AND LENGTH(content) > 200;

-- Дополнительно разбиваем по спискам с дефисами
UPDATE t_p68330612_city_news_portal.news
SET content = REGEXP_REPLACE(content, '(- [А-ЯЁ][^;\.]+[;\.]\s*)', '</p><p>\1', 'g'),
    updated_at = CURRENT_TIMESTAMP
WHERE content LIKE '%<p>%'
  AND content LIKE '% - %'
  AND LENGTH(content) > 200;

-- Убираем возможные двойные открывающие теги
UPDATE t_p68330612_city_news_portal.news
SET content = REGEXP_REPLACE(content, '<p>\s*<p>', '<p>', 'g'),
    updated_at = CURRENT_TIMESTAMP
WHERE content LIKE '%<p>%<p>%';
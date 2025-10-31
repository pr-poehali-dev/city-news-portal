-- Финальное исправление: разбиваем текст на абзацы по заголовкам и ключевым фразам

-- Сначала убираем все теги <p>
UPDATE t_p68330612_city_news_portal.news
SET content = REGEXP_REPLACE(content, '</?p>', '', 'g')
WHERE content LIKE '%<p>%';

-- Разбиваем по заголовкам (слова с заглавной и двоеточием)
UPDATE t_p68330612_city_news_portal.news
SET content = '<p>' || REGEXP_REPLACE(
    TRIM(content),
    '([А-ЯЁ][а-яё\s\-]+:)',
    '</p><p><strong>\1</strong>',
    'g'
) || '</p>'
WHERE content NOT LIKE '%<p>%'
  AND LENGTH(content) > 200;

-- Разбиваем списки с дефисами на отдельные пункты
UPDATE t_p68330612_city_news_portal.news
SET content = REGEXP_REPLACE(
    content,
    '(- [А-ЯЁ][^\-\.;]+[\.\;])\s*',
    '\1</p><p>',
    'g'
)
WHERE content LIKE '% - %'
  AND LENGTH(content) > 200;

-- Убираем пустые теги и дубликаты
UPDATE t_p68330612_city_news_portal.news
SET content = REGEXP_REPLACE(
    REGEXP_REPLACE(
        REGEXP_REPLACE(content, '<p>\s*</p>', '', 'g'),
        '<p>\s*<p>', '<p>', 'g'
    ),
    '</p>\s*</p>', '</p>', 'g'
)
WHERE content LIKE '%<p>%';

-- Обновляем timestamp
UPDATE t_p68330612_city_news_portal.news
SET updated_at = CURRENT_TIMESTAMP
WHERE content LIKE '%<p>%';
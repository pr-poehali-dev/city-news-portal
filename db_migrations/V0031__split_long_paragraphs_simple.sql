-- Разбиваем длинные блоки текста на абзацы по точкам с заглавной буквы

-- Шаг 1: Разбиваем предложения, где после точки идет заглавная буква
UPDATE t_p68330612_city_news_portal.news
SET content = REGEXP_REPLACE(
    content,
    '(\. )([А-ЯЁ][а-яё])',
    '.</p><p>\2',
    'g'
)
WHERE content LIKE '%<p>%'
  AND LENGTH(content) > 300;

-- Шаг 2: Исправляем случаи с аббревиатурами (РФ. А -> РФ.</p><p>А)
UPDATE t_p68330612_city_news_portal.news  
SET content = REGEXP_REPLACE(
    content,
    '([А-ЯЁ]{2,}\. )([А-ЯЁ][а-яё])',
    '\1</p><p>\2',
    'g'
)
WHERE content LIKE '%<p>%';

-- Шаг 3: Убираем пустые и дублирующиеся теги
UPDATE t_p68330612_city_news_portal.news
SET content = REGEXP_REPLACE(
    REGEXP_REPLACE(
        REGEXP_REPLACE(content, '<p>\s*</p>', '', 'g'),
        '<p>\s*<p>', '<p>', 'g'
    ),
    '</p>\s*</p>', '</p>', 'g'
)
WHERE content LIKE '%<p>%';

UPDATE t_p68330612_city_news_portal.news
SET updated_at = CURRENT_TIMESTAMP
WHERE content LIKE '%<p>%';
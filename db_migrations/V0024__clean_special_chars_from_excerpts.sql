-- Replace special Unicode characters in excerpt and title fields
UPDATE t_p68330612_city_news_portal.news
SET 
  excerpt = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    excerpt,
    E'\u202f', ' '),  -- narrow no-break space
    E'\u00a0', ' '),  -- non-breaking space
    E'\u2009', ' '),  -- thin space
    E'\u2013', '-'),  -- en dash
    E'\u2014', '-'),  -- em dash
  title = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    title,
    E'\u202f', ' '),
    E'\u00a0', ' '),
    E'\u2009', ' '),
    E'\u2013', '-'),
    E'\u2014', '-');

-- Normalize multiple spaces to single space
UPDATE t_p68330612_city_news_portal.news
SET 
  excerpt = REGEXP_REPLACE(excerpt, '\s+', ' ', 'g'),
  title = REGEXP_REPLACE(title, '\s+', ' ', 'g');

-- Trim leading and trailing spaces
UPDATE t_p68330612_city_news_portal.news
SET 
  excerpt = TRIM(excerpt),
  title = TRIM(title);
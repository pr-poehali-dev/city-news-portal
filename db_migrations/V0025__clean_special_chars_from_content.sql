-- Replace special Unicode characters in content field
UPDATE t_p68330612_city_news_portal.news
SET 
  content = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    content,
    E'\u202f', ' '),  -- narrow no-break space
    E'\u00a0', ' '),  -- non-breaking space
    E'\u2009', ' '),  -- thin space
    E'\u2013', '-'),  -- en dash
    E'\u2014', '-'),  -- em dash
    E'\u2011', '-'),  -- non-breaking hyphen
    E'\u2012', '-')   -- figure dash
WHERE content IS NOT NULL;

-- Normalize multiple spaces to single space in content
UPDATE t_p68330612_city_news_portal.news
SET content = REGEXP_REPLACE(content, '\s+', ' ', 'g')
WHERE content IS NOT NULL;
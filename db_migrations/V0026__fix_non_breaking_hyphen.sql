-- Replace non-breaking hyphen (U+2011) with regular hyphen in all text fields
UPDATE t_p68330612_city_news_portal.news
SET 
  excerpt = REPLACE(excerpt, '‑', '-'),
  content = REPLACE(content, '‑', '-'),
  title = REPLACE(title, '‑', '-')
WHERE 
  excerpt LIKE '%‑%' OR 
  content LIKE '%‑%' OR 
  title LIKE '%‑%';
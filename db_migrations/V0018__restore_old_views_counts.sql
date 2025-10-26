-- Восстанавливаем старые значения просмотров из таблицы article_views_tracking
UPDATE t_p68330612_city_news_portal.news n
SET views = COALESCE(t.last_views_count, 0)
FROM t_p68330612_city_news_portal.article_views_tracking t
WHERE n.id = t.news_id;
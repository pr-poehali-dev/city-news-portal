CREATE TABLE IF NOT EXISTS t_p68330612_city_news_portal.article_views_tracking (
    news_id INTEGER NOT NULL REFERENCES t_p68330612_city_news_portal.news(id),
    last_views_count INTEGER NOT NULL DEFAULT 0,
    last_check TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (news_id)
);

CREATE INDEX IF NOT EXISTS idx_article_views_tracking_last_check 
ON t_p68330612_city_news_portal.article_views_tracking(last_check);

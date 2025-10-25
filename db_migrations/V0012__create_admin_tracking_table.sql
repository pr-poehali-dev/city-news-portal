CREATE TABLE IF NOT EXISTS admin_tracking (
    id INTEGER PRIMARY KEY,
    last_comments_count INTEGER DEFAULT 0,
    last_views_count INTEGER DEFAULT 0,
    last_check TIMESTAMP DEFAULT NOW()
);

INSERT INTO admin_tracking (id, last_comments_count, last_views_count)
VALUES (1, 0, 0)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS city_posts (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    mood VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL DEFAULT 'Краснодар',
    time_of_day VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_city_posts_created_at ON city_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_city_posts_date ON city_posts(DATE(created_at));

CREATE TABLE IF NOT EXISTS memory_articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    year INTEGER,
    decade VARCHAR(50),
    event_date DATE,
    image_url TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_memory_articles_year ON memory_articles(year);
CREATE INDEX idx_memory_articles_published ON memory_articles(is_published);
CREATE INDEX idx_memory_articles_event_date ON memory_articles(event_date);
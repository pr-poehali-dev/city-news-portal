-- Создание таблицы для молодёжных заметок от редакции
CREATE TABLE IF NOT EXISTS youth_notes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  emoji VARCHAR(10) DEFAULT '✨',
  color VARCHAR(20) DEFAULT '#8B5CF6',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого получения опубликованных заметок
CREATE INDEX idx_youth_notes_published ON youth_notes(is_published, created_at DESC);

-- Вставка демонстрационных заметок
INSERT INTO youth_notes (title, content, emoji, color, is_published) VALUES
('Новая кофейня на Красной!', 'Открылась крутая кофейня с авторскими напитками. Цены от 150₽, атмосфера огонь 🔥', '☕', '#f97316', true),
('Бесплатный концерт в парке', 'В эту субботу в Первомайском парке выступают местные рок-группы. Начало в 18:00, вход свободный!', '🎸', '#22c55e', true),
('Скидки для студентов', 'В новом коворкинге на Гимназической действует 50% скидка для студентов. Покажи студенческий!', '🎓', '#3b82f6', true),
('Ночной забег по городу', 'Присоединяйся к ночному забегу! Встречаемся у фонтана в 22:00. Дистанция 5 км, после - чай и общение', '🏃', '#ec4899', true),
('Маркет молодых дизайнеров', 'В эти выходные на Театральной площади - маркет местных мастеров. Одежда, украшения, арт. Must visit!', '🎨', '#a855f7', true),
('Киберспорт турнир', 'В городской библиотеке проходит турнир по Dota 2. Регистрация еще открыта, призовой фонд 50к!', '🎮', '#06b6d4', true);

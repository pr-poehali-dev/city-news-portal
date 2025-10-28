-- Добавление полей is_svo и is_showbiz для пометки новостей
ALTER TABLE news ADD COLUMN IF NOT EXISTS is_svo BOOLEAN DEFAULT FALSE;
ALTER TABLE news ADD COLUMN IF NOT EXISTS is_showbiz BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN news.is_svo IS 'Новость относится к разделу СВО';
COMMENT ON COLUMN news.is_showbiz IS 'Новость относится к разделу Шоубизнес';
# Настройка автоматической отправки статистики в Telegram

## URL для вызова
```
https://functions.poehali.dev/8bfc1d75-4cbb-4cb7-b2b1-3b51017deb96
```

## Инструкция по настройке cron-job.org

### Шаг 1: Регистрация
1. Перейдите на https://cron-job.org
2. Нажмите **Sign up** (Регистрация)
3. Создайте бесплатный аккаунт

### Шаг 2: Создание задачи
1. После входа нажмите **Create cronjob** (Создать задачу)
2. Заполните форму:
   - **Title**: `Telegram Analytics - Город говорит`
   - **URL**: `https://functions.poehali.dev/8bfc1d75-4cbb-4cb7-b2b1-3b51017deb96`
   - **Schedule**: Выберите **Every 10 seconds** (Каждые 10 секунд)
     - Или выберите **Custom** и настройте интервал как нужно
3. Нажмите **Create** (Создать)

### Шаг 3: Активация
1. Убедитесь, что задача **Enabled** (Включена)
2. Проверьте **Execution history** через несколько минут

## Как работает система

Функция автоматически:
- Проверяет новые просмотры статей каждые 10 секунд
- Отправляет уведомление в Telegram **только если есть новые просмотры**
- Показывает топ-10 самых читаемых статей
- Сохраняет последнее количество просмотров в базе данных

## Альтернативные планировщики

Если cron-job.org не подходит, можно использовать:

### 1. EasyCron (https://easycron.com)
- Бесплатно до 1 задачи
- Минимальный интервал: 1 минута

### 2. cPanel Cron Jobs (если есть хостинг)
```bash
*/1 * * * * curl -s https://functions.poehali.dev/8bfc1d75-4cbb-4cb7-b2b1-3b51017deb96
```

### 3. GitHub Actions (бесплатно)
Создайте файл `.github/workflows/telegram-analytics.yml`:
```yaml
name: Telegram Analytics

on:
  schedule:
    - cron: '*/1 * * * *'  # Каждую минуту
  workflow_dispatch:

jobs:
  send-analytics:
    runs-on: ubuntu-latest
    steps:
      - name: Call analytics function
        run: curl -s https://functions.poehali.dev/8bfc1d75-4cbb-4cb7-b2b1-3b51017deb96
```

## Проверка работы

После настройки:
1. Откройте несколько статей на сайте
2. Подождите 10 секунд
3. Проверьте Telegram - должно прийти уведомление о новых просмотрах

## Важно!

⚠️ Убедитесь, что вы добавили `TELEGRAM_CHAT_ID` в секреты проекта:
1. Напишите боту @userinfobot в Telegram
2. Скопируйте ваш chat_id
3. Добавьте его в настройки проекта

# Настройка Push-уведомлений (одноразово)

## Шаг 1: Генерация ключей

Откройте терминал и выполните:

```bash
npx web-push generate-vapid-keys
```

Команда выдаст два ключа:
```
Public Key: BJthRLSPR5F7...
Private Key: xN8QpL5jK9...
```

## Шаг 2: Добавить ключи в проект

В интерфейсе poehali.dev добавьте два секрета:

1. **VAPID_PUBLIC_KEY** - скопируйте Public Key
2. **VAPID_PRIVATE_KEY** - скопируйте Private Key
3. **NOTIFICATION_FUNCTION_URL** - вставьте: `https://functions.poehali.dev/227fae44-9767-44d7-afee-02b9dd2252dc`

## Шаг 3: Обновить публичный ключ в коде

Откройте `src/components/NotificationSubscribe.tsx` и замените ключ на строке 73:

```typescript
const vapidPublicKey = 'ВАШ_PUBLIC_KEY';
```

## Готово!

Теперь:
- ✅ Уведомления приходят при закрытой вкладке
- ✅ Работает на телефоне
- ✅ Уведомление о каждом просмотре новости
- ✅ Уведомление о каждом комментарии

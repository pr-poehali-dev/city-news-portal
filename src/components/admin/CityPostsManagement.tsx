import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const AI_FUNCTION_URL = 'https://functions.poehali.dev/d7440490-2756-4be6-9013-fc14e99c0a76';
const SCHEDULER_URL = 'https://functions.poehali.dev/1e3b546d-9d3e-48cc-987f-5db39cab2ed5';

export const CityPostsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [lastGeneration, setLastGeneration] = useState<string | null>(null);

  const loadTodaysPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(AI_FUNCTION_URL);
      if (response.ok) {
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
        toast.success('Посты загружены');
      } else {
        toast.error('Ошибка загрузки постов');
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Не удалось загрузить посты');
    } finally {
      setLoading(false);
    }
  };

  const generatePosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${AI_FUNCTION_URL}?action=generate`);
      if (response.ok) {
        const data = await response.json();
        setLastGeneration(new Date().toLocaleString('ru-RU'));
        toast.success(data.message || 'Посты сгенерированы успешно');
        await loadTodaysPosts();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Ошибка генерации');
      }
    } catch (error) {
      console.error('Error generating posts:', error);
      toast.error('Не удалось сгенерировать посты');
    } finally {
      setLoading(false);
    }
  };

  const triggerScheduler = async () => {
    setLoading(true);
    try {
      const response = await fetch(SCHEDULER_URL);
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Планировщик запущен');
        if (data.message.includes('generated')) {
          await loadTodaysPosts();
        }
      } else {
        toast.error('Ошибка запуска планировщика');
      }
    } catch (error) {
      console.error('Error triggering scheduler:', error);
      toast.error('Не удалось запустить планировщик');
    } finally {
      setLoading(false);
    }
  };

  const getTimeIcon = (timeOfDay: string) => {
    const icons: Record<string, string> = {
      'утро': 'Sunrise',
      'день': 'Sun',
      'вечер': 'Sunset'
    };
    return icons[timeOfDay] || 'Clock';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="MessageCircle" />
            AI-инфлюенсер "Город говорит"
          </CardTitle>
          <CardDescription>
            Управление AI-постами от имени города. Генерируются автоматически 3 раза в день (8:00, 14:00, 20:00)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={loadTodaysPosts}
              disabled={loading}
              variant="outline"
              className="gap-2"
            >
              <Icon name="RefreshCw" className={loading ? 'animate-spin' : ''} />
              Загрузить посты за сегодня
            </Button>
            
            <Button
              onClick={generatePosts}
              disabled={loading}
              className="gap-2"
            >
              <Icon name="Sparkles" />
              Сгенерировать 3 поста сейчас
            </Button>
            
            <Button
              onClick={triggerScheduler}
              disabled={loading}
              variant="secondary"
              className="gap-2"
            >
              <Icon name="Clock" />
              Запустить планировщик
            </Button>
          </div>

          {lastGeneration && (
            <div className="text-sm text-muted-foreground">
              Последняя генерация: {lastGeneration}
            </div>
          )}

          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={16} className="mt-0.5 text-primary" />
              <div className="text-sm space-y-1">
                <p><strong>Как работает автогенерация:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Функция анализирует новости за день</li>
                  <li>OpenAI генерирует 3 уникальных поста (утро/день/вечер)</li>
                  <li>Посты автоматически сохраняются в базу данных</li>
                  <li>Если новостей нет — публикуются нейтральные заметки</li>
                </ul>
              </div>
            </div>
          </div>

          {posts.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Посты за сегодня ({posts.length})</h3>
              <div className="grid gap-3">
                {posts.map((post) => (
                  <Card key={post.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Icon name={getTimeIcon(post.timeOfDay)} className="text-primary" size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold capitalize">{post.timeOfDay}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {post.mood}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.timestamp).toLocaleString('ru-RU')}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{post.text}</p>
                        <span className="text-xs text-muted-foreground">📍 {post.location}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {posts.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="MessageCircle" size={48} className="mx-auto mb-2 opacity-50" />
              <p>Постов за сегодня пока нет</p>
              <p className="text-sm">Нажмите "Сгенерировать" для создания</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Settings" />
            Настройка автозапуска
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 space-y-3">
            <p className="text-sm font-medium">Для автоматической генерации постов настрой cron-задачу:</p>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">1. Зарегистрируйся на cron-job.org</p>
              <p className="text-sm text-muted-foreground">2. Создай задачу с URL:</p>
              <div className="p-2 bg-background rounded border text-xs font-mono break-all">
                {SCHEDULER_URL}
              </div>
              <p className="text-sm text-muted-foreground">3. Установи расписание: каждый день в 8:00, 14:00, 20:00 (UTC+3)</p>
            </div>

            <div className="flex items-start gap-2 p-3 rounded bg-blue-500/10 border border-blue-500/20">
              <Icon name="Lightbulb" size={16} className="mt-0.5 text-blue-600" />
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Совет:</strong> Также можно использовать GitHub Actions или любой другой cron-сервис для запуска по расписанию
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

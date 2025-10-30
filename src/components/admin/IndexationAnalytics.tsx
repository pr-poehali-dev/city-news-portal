import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { FUNCTIONS_URL } from '@/lib/admin-constants';

interface NewsIndexation {
  id: number;
  title: string;
  published_at: string;
  indexed_yandex: boolean;
  indexed_google: boolean;
  last_ping_at: string | null;
  ping_count: number;
}

export const IndexationAnalytics = () => {
  const [news, setNews] = useState<NewsIndexation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    yandex_indexed: 0,
    google_indexed: 0,
    both_indexed: 0
  });

  const loadIndexationData = async () => {
    setLoading(true);
    try {
      const response = await fetch(FUNCTIONS_URL.news);
      const data = await response.json();
      
      const publishedNews = data.filter((n: any) => n.status === 'published');
      setNews(publishedNews);
      
      const total = publishedNews.length;
      const yandex = publishedNews.filter((n: any) => n.indexed_yandex).length;
      const google = publishedNews.filter((n: any) => n.indexed_google).length;
      const both = publishedNews.filter((n: any) => n.indexed_yandex && n.indexed_google).length;
      
      setStats({
        total,
        yandex_indexed: yandex,
        google_indexed: google,
        both_indexed: both
      });
    } catch (error) {
      console.error('Failed to load indexation data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIndexationData();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIndexationStatus = (yandex: boolean, google: boolean) => {
    if (yandex && google) return { text: 'Оба', variant: 'default' as const };
    if (yandex) return { text: 'Яндекс', variant: 'secondary' as const };
    if (google) return { text: 'Google', variant: 'secondary' as const };
    return { text: 'Не индексирована', variant: 'outline' as const };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Всего новостей
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Индексация Яндекс
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {stats.yandex_indexed}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0 ? Math.round((stats.yandex_indexed / stats.total) * 100) : 0}% охват
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Индексация Google
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {stats.google_indexed}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0 ? Math.round((stats.google_indexed / stats.total) * 100) : 0}% охват
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Оба поисковика
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.both_indexed}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0 ? Math.round((stats.both_indexed / stats.total) * 100) : 0}% охват
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Статус индексации новостей</CardTitle>
              <CardDescription>
                Отслеживание индексации в поисковых системах
              </CardDescription>
            </div>
            <Button onClick={loadIndexationData} variant="outline" size="sm">
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Обновить
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {news.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Нет опубликованных новостей
              </div>
            ) : (
              news.map((item) => {
                const status = getIndexationStatus(item.indexed_yandex, item.indexed_google);
                return (
                  <div
                    key={item.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <h4 className="font-medium mb-1 truncate">{item.title}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" size={12} />
                          {formatDate(item.published_at)}
                        </span>
                        {item.last_ping_at && (
                          <span className="flex items-center gap-1">
                            <Icon name="Send" size={12} />
                            Пинг: {formatDate(item.last_ping_at)}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Icon name="Activity" size={12} />
                          {item.ping_count} уведомлений
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.indexed_yandex && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                          <Icon name="Check" size={12} className="mr-1" />
                          Яндекс
                        </Badge>
                      )}
                      {item.indexed_google && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          <Icon name="Check" size={12} className="mr-1" />
                          Google
                        </Badge>
                      )}
                      {!item.indexed_yandex && !item.indexed_google && (
                        <Badge variant="outline">
                          <Icon name="Clock" size={12} className="mr-1" />
                          Ожидание
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="font-medium">Как работает индексация?</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>При публикации новости автоматически отправляется уведомление в Яндекс и Google</li>
                  <li>Поисковики получают обновлённую карту сайта (sitemap)</li>
                  <li>Статус обновляется при подтверждении индексации от поисковиков</li>
                  <li>Полная индексация может занять от нескольких часов до нескольких дней</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

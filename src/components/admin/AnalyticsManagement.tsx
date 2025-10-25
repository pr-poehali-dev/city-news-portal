import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface AnalyticsManagementProps {
  loading: boolean;
}

export function AnalyticsManagement({ loading }: AnalyticsManagementProps) {
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    subscribersCount: 0,
    newsCount: 0,
    commentsCount: 0
  });
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
    loadComments();
    
    const interval = setInterval(() => {
      loadAnalytics();
      loadComments();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = async () => {
    try {
      const newsResponse = await fetch('https://functions.poehali.dev/337d71bc-62a6-4d6d-bb49-7543546870fe?status=published');
      if (!newsResponse.ok) {
        console.error('Failed to fetch news');
        return;
      }
      const newsData = await newsResponse.json();
      
      const totalViews = Array.isArray(newsData) ? newsData.reduce((sum: number, news: any) => sum + (news.views || 0), 0) : 0;
      
      let subscribersCount = 0;
      try {
        const subsResponse = await fetch('https://functions.poehali.dev/b67aed3b-df61-46cb-9e8e-05d4950ef6d1?action=subscriptions');
        if (subsResponse.ok) {
          const subsData = await subsResponse.json();
          subscribersCount = Array.isArray(subsData) ? subsData.length : 0;
        }
      } catch (e) {
        console.error('Failed to load subscriptions:', e);
      }
      
      setAnalytics({
        totalViews,
        subscribersCount,
        newsCount: Array.isArray(newsData) ? newsData.length : 0,
        commentsCount: 0
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const loadComments = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/e442a5de-b5ed-4ff1-b15c-da8b0bfea9b5?action=list_all');
      if (!response.ok) {
        console.error('Failed to fetch comments');
        return;
      }
      const data = await response.json();
      const commentsArray = Array.isArray(data) ? data : [];
      setComments(commentsArray);
      setAnalytics(prev => ({ ...prev, commentsCount: commentsArray.length }));
    } catch (error) {
      console.error('Failed to load comments:', error);
      setComments([]);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base flex items-center gap-2">
              <Icon name="Eye" size={20} className="text-primary" />
              Просмотры
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">{analytics.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Всего просмотров новостей</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base flex items-center gap-2">
              <Icon name="Bell" size={20} className="text-primary" />
              Подписчики
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">{analytics.subscribersCount}</div>
            <p className="text-xs text-muted-foreground">Получают уведомления</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base flex items-center gap-2">
              <Icon name="Newspaper" size={20} className="text-primary" />
              Новости
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">{analytics.newsCount}</div>
            <p className="text-xs text-muted-foreground">Опубликовано</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base flex items-center gap-2">
              <Icon name="MessageCircle" size={20} className="text-primary" />
              Комментарии
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">{analytics.commentsCount}</div>
            <p className="text-xs text-muted-foreground">Всего комментариев</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Все комментарии ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Нет комментариев</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-3 md:p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-sm md:text-base">{comment.author_name}</span>
                        <Badge variant="outline" className="text-xs">
                          Новость #{comment.news_id}
                        </Badge>
                        {comment.is_moderated && (
                          <Badge variant="secondary" className="text-xs">
                            <Icon name="CheckCircle" size={12} className="mr-1" />
                            Проверен
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {new Date(comment.created_at).toLocaleString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm md:text-base">{comment.text}</p>
                  {comment.parent_id && (
                    <div className="pl-3 md:pl-4 border-l-2 border-muted">
                      <p className="text-xs text-muted-foreground">Ответ на комментарий #{comment.parent_id}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
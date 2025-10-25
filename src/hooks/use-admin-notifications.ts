import { useEffect, useRef } from 'react';

interface NotificationData {
  title: string;
  body: string;
  url?: string;
}

export const useAdminNotifications = () => {
  const lastCheckRef = useRef<number>(Date.now());
  const commentsCountRef = useRef<number>(0);
  const viewsCountRef = useRef<number>(0);

  useEffect(() => {
    const isSubscribed = localStorage.getItem('notifications-subscribed') === 'true';
    if (!isSubscribed || !('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const checkForUpdates = async () => {
      try {
        const commentsResponse = await fetch('https://functions.poehali.dev/e442a5de-b5ed-4ff1-b15c-da8b0bfea9b5?action=list_all');
        if (!commentsResponse.ok) return;

        const comments = await commentsResponse.json();
        
        if (commentsCountRef.current === 0) {
          commentsCountRef.current = comments.length;
          return;
        }

        if (comments.length > commentsCountRef.current) {
          const newComments = comments.slice(0, comments.length - commentsCountRef.current);
          
          for (const comment of newComments) {
            const notificationData: NotificationData = {
              title: 'Новый комментарий',
              body: `${comment.author_name} оставил комментарий к "${comment.news_title || 'новости'}"`,
              url: `/news/${comment.news_id}`
            };

            const notification = new Notification(notificationData.title, {
              body: notificationData.body,
              icon: '/icon-192.png',
              badge: '/icon-192.png',
              tag: `comment-${comment.id}`,
              requireInteraction: false
            });

            notification.onclick = () => {
              window.focus();
              if (notificationData.url) {
                window.location.href = notificationData.url;
              }
              notification.close();
            };
          }

          commentsCountRef.current = comments.length;
        }

        const newsResponse = await fetch('https://functions.poehali.dev/337d71bc-62a6-4d6d-bb49-7543546870fe?status=published');
        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          const totalViews = Array.isArray(newsData) ? newsData.reduce((sum: number, news: any) => sum + (news.views || 0), 0) : 0;
          
          if (viewsCountRef.current === 0) {
            viewsCountRef.current = totalViews;
          } else if (totalViews > viewsCountRef.current) {
            const newViews = totalViews - viewsCountRef.current;
            
            const notification = new Notification('Новые просмотры', {
              body: `+${newViews} ${newViews === 1 ? 'просмотр' : newViews < 5 ? 'просмотра' : 'просмотров'}`,
              icon: '/icon-192.png',
              badge: '/icon-192.png',
              tag: 'views-update',
              requireInteraction: false
            });

            notification.onclick = () => {
              window.focus();
              window.location.href = '/admin';
              notification.close();
            };

            viewsCountRef.current = totalViews;
          }
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    };

    const interval = setInterval(checkForUpdates, 5000);
    checkForUpdates();

    return () => clearInterval(interval);
  }, []);
};
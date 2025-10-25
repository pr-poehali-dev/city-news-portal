import { useEffect, useRef } from 'react';

interface NotificationData {
  title: string;
  body: string;
  url?: string;
}

export const useAdminNotifications = () => {
  const lastCheckRef = useRef<number>(Date.now());
  const commentsCountRef = useRef<number>(0);

  useEffect(() => {
    const isSubscribed = localStorage.getItem('notifications-subscribed') === 'true';
    if (!isSubscribed || !('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const checkForUpdates = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/e442a5de-b5ed-4ff1-b15c-da8b0bfea9b5?action=list_all');
        if (!response.ok) return;

        const comments = await response.json();
        
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
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    };

    const interval = setInterval(checkForUpdates, 30000);
    checkForUpdates();

    return () => clearInterval(interval);
  }, []);
};

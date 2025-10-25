const COMMENTS_URL = 'https://functions.poehali.dev/e442a5de-b5ed-4ff1-b15c-da8b0bfea9b5?action=list_all';
const NEWS_URL = 'https://functions.poehali.dev/337d71bc-62a6-4d6d-bb49-7543546870fe?status=published';
const NOTIFICATION_URL = 'https://functions.poehali.dev/227fae44-9767-44d7-afee-02b9dd2252dc';

let lastCommentsCount = 0;
let lastViewsCount = 0;

async function checkForUpdates() {
  try {
    const commentsResponse = await fetch(COMMENTS_URL);
    if (commentsResponse.ok) {
      const comments = await commentsResponse.json();
      
      if (lastCommentsCount === 0) {
        lastCommentsCount = comments.length;
      } else if (comments.length > lastCommentsCount) {
        const newComments = comments.slice(0, comments.length - lastCommentsCount);
        
        for (const comment of newComments) {
          await self.registration.showNotification('Новый комментарий', {
            body: `${comment.author_name} оставил комментарий`,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: `comment-${comment.id}`,
            data: { url: `/news/${comment.news_id}` }
          });
        }
        
        lastCommentsCount = comments.length;
      }
    }

    const newsResponse = await fetch(NEWS_URL);
    if (newsResponse.ok) {
      const newsData = await newsResponse.json();
      const totalViews = Array.isArray(newsData) ? newsData.reduce((sum, news) => sum + (news.views || 0), 0) : 0;
      
      if (lastViewsCount === 0) {
        lastViewsCount = totalViews;
      } else if (totalViews > lastViewsCount) {
        const newViews = totalViews - lastViewsCount;
        
        await self.registration.showNotification('Новые просмотры', {
          body: `+${newViews} ${newViews === 1 ? 'просмотр' : newViews < 5 ? 'просмотра' : 'просмотров'}`,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'views-update',
          data: { url: '/admin' }
        });
        
        lastViewsCount = totalViews;
      }
    }
  } catch (error) {
    console.error('Failed to check for updates:', error);
  }
}

setInterval(checkForUpdates, 5000);

self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/icon-192.png',
      badge: '/icon-192.png',
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
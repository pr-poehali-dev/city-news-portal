self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || 'https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/73d9a617-f287-4960-91f4-49ead8981af4.jpg',
      badge: 'https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/73d9a617-f287-4960-91f4-49ead8981af4.jpg',
      data: {
        url: data.url || '/'
      },
      requireInteraction: false,
      silent: false
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
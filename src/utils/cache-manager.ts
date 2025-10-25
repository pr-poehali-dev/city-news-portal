const APP_VERSION = '1.0.1';
const VERSION_KEY = 'app_version';

export const clearCacheIfNeeded = () => {
  const storedVersion = localStorage.getItem(VERSION_KEY);
  
  if (storedVersion !== APP_VERSION) {
    console.log(`Обнаружено обновление приложения: ${storedVersion} → ${APP_VERSION}`);
    
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
    
    const keysToPreserve = ['admin_session_id', 'likedArticles', 'theme'];
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      if (!keysToPreserve.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    localStorage.setItem(VERSION_KEY, APP_VERSION);
    
    console.log('Кэш успешно очищен');
    
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
};

export const getAppVersion = () => APP_VERSION;

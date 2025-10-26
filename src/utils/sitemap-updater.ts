import { FUNCTIONS_URL } from '@/lib/admin-constants';

export const updateSitemap = async (): Promise<boolean> => {
  try {
    const response = await fetch(FUNCTIONS_URL.syncSitemap, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('Failed to sync sitemap to cloud');
      return false;
    }
    
    const data = await response.json();
    console.log('Sitemap synced to cloud:', data.url);
    return true;
  } catch (error) {
    console.error('Error syncing sitemap:', error);
    return false;
  }
};
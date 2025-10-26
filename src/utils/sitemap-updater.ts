import { FUNCTIONS_URL } from '@/lib/admin-constants';

export const updateSitemap = async (): Promise<boolean> => {
  try {
    const response = await fetch(FUNCTIONS_URL.updateSitemap);
    
    if (!response.ok) {
      console.error('Failed to fetch sitemap data');
      return false;
    }
    
    const data = await response.json();
    const sitemapXml = data.sitemap;
    
    const blob = new Blob([sitemapXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('Sitemap updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating sitemap:', error);
    return false;
  }
};

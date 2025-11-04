import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface LatestNewsGridProps {
  news: any[];
  onNewsClick: (newsId: number) => void;
  limit?: number;
}

export const LatestNewsGrid = ({ news, onNewsClick, limit = 8 }: LatestNewsGridProps) => {
  const displayNews = news.slice(0, limit);

  const stripHtml = (html: string) => {
    if (!html) return '';
    
    let text = html;
    
    text = text.replace(/<[^>]+>/g, '');
    text = text.replace(/&nbsp;/gi, ' ');
    text = text.replace(/&mdash;/gi, '-');
    text = text.replace(/&ndash;/gi, '-');
    text = text.replace(/&rsquo;/gi, "'");
    text = text.replace(/&lsquo;/gi, "'");
    text = text.replace(/&rdquo;/gi, '"');
    text = text.replace(/&ldquo;/gi, '"');
    text = text.replace(/&hellip;/gi, '...');
    text = text.replace(/&[a-z]+;/gi, ' ');
    
    text = text.replace(/[\u00a0\u202f\u2009\u2000-\u200b]/g, ' ');
    text = text.replace(/[\u2011-\u2015]/g, '-');
    text = text.replace(/[\u2018\u2019]/g, "'");
    text = text.replace(/[\u201c\u201d]/g, '"');
    text = text.replace(/\s+/g, ' ');
    
    return text.trim();
  };

  const gradients = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-rose-500',
    'from-cyan-500 to-blue-500',
    'from-emerald-500 to-green-500',
  ];

  return (
    <section className="mb-16">
      <div className="mb-10">
        <div className="relative inline-block">
          <div className="absolute -inset-2 bg-gradient-to-r from-accent via-purple-500 to-pink-500 rounded-2xl opacity-20 blur-xl"></div>
          <h2 className="relative text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-accent via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Последние новости
          </h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayNews.map((item, index) => (
          <article
            key={item.id}
            className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            onClick={() => onNewsClick(item.id)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            
            <div className="aspect-[4/3] relative overflow-hidden">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center`}>
                  <Icon name="FileText" size={48} className="text-white/60" />
                </div>
              )}
              
              <div className="absolute top-4 left-4 z-10">
                <Badge className={`bg-gradient-to-r ${gradients[index % gradients.length]} text-white font-semibold px-3 py-1.5 text-xs rounded-full shadow-lg border-0`}>
                  {item.category}
                </Badge>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="font-display font-bold text-lg mb-3 leading-tight line-clamp-2 group-hover:text-accent transition-colors">
                {item.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                {stripHtml(item.excerpt || item.content)}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <Icon name="Calendar" size={14} />
                  <span>{new Date(item.created_at).toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon name="Eye" size={14} />
                  <span>{item.views || 0}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
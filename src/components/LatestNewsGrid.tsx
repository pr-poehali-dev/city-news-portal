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

  const patterns = [
    { gradient: 'from-red-500 to-pink-500', icon: 'Flame' },
    { gradient: 'from-blue-500 to-cyan-500', icon: 'Waves' },
    { gradient: 'from-green-500 to-emerald-500', icon: 'Leaf' },
    { gradient: 'from-purple-500 to-indigo-500', icon: 'Sparkles' },
    { gradient: 'from-orange-500 to-yellow-500', icon: 'Sun' },
    { gradient: 'from-pink-500 to-rose-500', icon: 'Heart' },
    { gradient: 'from-cyan-500 to-blue-500', icon: 'Droplets' },
    { gradient: 'from-amber-500 to-orange-500', icon: 'Zap' },
  ];

  return (
    <section className="mb-16 px-6">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl animate-pulse">
            <Icon name="Newspaper" size={28} className="text-white" />
          </div>
          <h2 className="text-5xl lg:text-6xl font-display font-black bg-gradient-to-r from-primary via-accent to-orange-500 bg-clip-text text-transparent">
            Сейчас читают
          </h2>
        </div>
        <p className="text-gray-600 text-lg">Самые обсуждаемые новости дня</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayNews.map((item, index) => {
          const pattern = patterns[index % patterns.length];
          
          return (
            <article
              key={item.id}
              className="group relative cursor-pointer overflow-hidden rounded-[2rem] bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
              onClick={() => onNewsClick(item.id)}
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-br ${pattern.gradient} rounded-[2rem] opacity-0 group-hover:opacity-75 blur transition-opacity duration-500`}></div>
              
              <div className="relative">
                <div className="aspect-[4/3] relative overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${pattern.gradient} flex items-center justify-center`}>
                      <Icon name={pattern.icon as any} size={64} className="text-white/40" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className={`bg-gradient-to-r ${pattern.gradient} text-white font-bold px-3 py-2 text-xs rounded-full shadow-xl border-0`}>
                      {item.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6 bg-white relative z-10">
                  <h3 className="font-display font-bold text-xl mb-3 leading-tight line-clamp-2 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {stripHtml(item.excerpt || item.content)}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
                      <Icon name="Calendar" size={12} />
                      <span>{new Date(item.created_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
                      <Icon name="Eye" size={12} />
                      <span>{item.views || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

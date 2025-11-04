import Icon from '@/components/ui/icon';

interface LatestNewsGridProps {
  news: any[];
  onNewsClick: (newsId: number) => void;
  limit?: number;
}

export const LatestNewsGrid = ({ news, onNewsClick, limit = 6 }: LatestNewsGridProps) => {
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

  return (
    <section className="mb-16">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
          <h2 className="text-4xl font-black text-foreground">Последние новости</h2>
        </div>
        <p className="text-muted-foreground text-lg ml-20">Самое актуальное за сегодня</p>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayNews.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden cursor-pointer rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-gray-100 hover:border-orange-500 bg-white"
            onClick={() => onNewsClick(item.id)}
          >
            <div className="relative h-56 overflow-hidden">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                  <Icon name="FileText" size={48} className="text-orange-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-3 left-3">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-4 py-2 rounded-lg text-xs uppercase shadow-lg">
                  {item.category}
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-lg leading-tight mb-3 line-clamp-3 group-hover:text-orange-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {stripHtml(item.excerpt || item.content)}
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={16} />
                  <span>
                    {new Date(item.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={16} />
                  <span>{item.read_time || '5 мин'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

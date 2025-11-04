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
    text = text.replace(/&[a-z]+;/gi, ' ');
    text = text.replace(/\s+/g, ' ');
    
    return text.trim();
  };

  return (
    <section className="bg-white">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-20 py-20 lg:py-32">
        <div className="mb-16 lg:mb-24">
          <h2 className="text-5xl lg:text-8xl font-black tracking-tight mb-4">
            Последние новости
          </h2>
          <div className="w-24 h-1 bg-black"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
          {displayNews.map((item, index) => {
            const isLarge = index === 0;
            
            return (
              <article
                key={item.id}
                className={`group cursor-pointer bg-white hover:bg-black transition-colors duration-300 ${
                  isLarge ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                onClick={() => onNewsClick(item.id)}
              >
                <div className={`p-8 lg:p-12 h-full flex flex-col justify-between ${
                  isLarge ? 'lg:p-16' : ''
                }`}>
                  <div>
                    <div className="mb-6">
                      <span className="text-xs font-mono tracking-widest uppercase text-red-500">
                        {item.category}
                      </span>
                    </div>
                    
                    <h3 className={`font-black leading-tight mb-6 group-hover:text-white transition-colors ${
                      isLarge ? 'text-3xl lg:text-6xl' : 'text-xl lg:text-2xl'
                    }`}>
                      {item.title}
                    </h3>
                    
                    {isLarge && (
                      <p className="text-lg text-gray-600 mb-8 leading-relaxed line-clamp-3 group-hover:text-gray-300 transition-colors">
                        {stripHtml(item.excerpt || item.content)}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400 group-hover:text-gray-500 transition-colors">
                    <Icon name="Calendar" size={12} />
                    <span>{new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

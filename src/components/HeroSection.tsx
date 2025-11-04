import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  mainNews: any;
  sideNews: any[];
  onNewsClick: (newsId: number) => void;
}

export const HeroSection = ({ mainNews, sideNews, onNewsClick }: HeroSectionProps) => {
  if (!mainNews) return null;

  const stripHtml = (html: string) => {
    if (!html) return '';
    let text = html;
    text = text.replace(/<[^>]+>/g, '');
    text = text.replace(/&nbsp;/gi, ' ');
    text = text.replace(/&mdash;/gi, '-');
    text = text.replace(/&ndash;/gi, '-');
    text = text.replace(/&[a-z]+;/gi, ' ');
    text = text.replace(/[\u00a0\u202f\u2009\u2000-\u200b]/g, ' ');
    text = text.replace(/[\u2011-\u2015]/g, '-');
    text = text.replace(/\s+/g, ' ');
    return text.trim();
  };

  return (
    <section className="mb-16">
      <div className="grid lg:grid-cols-3 gap-6">
        <div 
          className="lg:col-span-2 group relative overflow-hidden cursor-pointer rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 border-4 border-orange-500"
          onClick={() => onNewsClick(mainNews.id)}
        >
          <div className="relative h-[500px] lg:h-[600px] overflow-hidden">
            <img
              src={mainNews.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
              alt={mainNews.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            
            <div className="absolute top-6 left-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-black px-6 py-3 rounded-xl text-sm uppercase tracking-wider shadow-lg flex items-center gap-2">
                <Icon name="Flame" size={18} />
                ГЛАВНАЯ НОВОСТЬ
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
              <div className="inline-block bg-white/20 backdrop-blur-sm text-white font-bold px-4 py-2 rounded-lg text-sm mb-4">
                {mainNews.category}
              </div>
              <h2 className="text-white text-3xl lg:text-5xl font-black mb-4 leading-tight drop-shadow-2xl">
                {mainNews.title}
              </h2>
              <p className="text-white/90 text-lg mb-6 line-clamp-2 drop-shadow-lg">
                {stripHtml(mainNews.excerpt || mainNews.content)}
              </p>
              <div className="flex items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={18} />
                  <span className="text-base font-medium">
                    {new Date(mainNews.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={18} />
                  <span className="text-base font-medium">{mainNews.read_time || '5 мин'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-rows-2 gap-6">
          {sideNews.slice(0, 2).map((news) => (
            <div
              key={news.id}
              className="group relative overflow-hidden cursor-pointer rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 hover:border-orange-500"
              onClick={() => onNewsClick(news.id)}
            >
              <div className="relative h-[242px] lg:h-[290px] overflow-hidden">
                {news.image_url ? (
                  <img
                    src={news.image_url}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                    <Icon name="FileText" size={48} className="text-orange-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="inline-block bg-orange-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs mb-3">
                    {news.category}
                  </div>
                  <h3 className="text-white text-xl font-bold leading-tight line-clamp-2 drop-shadow-lg">
                    {news.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

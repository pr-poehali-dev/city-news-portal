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
    return html.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
  };

  return (
    <section className="relative bg-black text-white">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-20 py-12 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div 
            className="lg:col-span-8 cursor-pointer group"
            onClick={() => onNewsClick(mainNews.id)}
          >
            <div className="mb-6 lg:mb-8">
              <span className="inline-flex items-center gap-2 text-red-500 font-mono text-xs tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Сейчас читают
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black leading-[0.95] mb-8 lg:mb-12 tracking-tight">
              {mainNews.title}
            </h1>

            <div className="relative aspect-[16/9] lg:aspect-[21/9] overflow-hidden mb-8 lg:mb-12">
              <img
                src={mainNews.image_url || mainNews.image || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                alt={mainNews.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <p className="text-lg lg:text-2xl text-gray-400 leading-relaxed max-w-3xl">
                {stripHtml(mainNews.excerpt || mainNews.content).slice(0, 200)}...
              </p>

              <div className="flex items-center gap-6 text-gray-500 text-sm font-mono">
                <div className="flex items-center gap-2">
                  <Icon name="User" size={16} />
                  <span>{mainNews.author_name}</span>
                </div>
                <div className="w-px h-4 bg-gray-700"></div>
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={16} />
                  <span>
                    {new Date(mainNews.created_at).toLocaleDateString('ru-RU', { 
                      day: 'numeric', 
                      month: 'short'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6 lg:space-y-8">
            {sideNews.slice(0, 3).map((news, index) => (
              <div
                key={news.id}
                className="cursor-pointer group pb-6 lg:pb-8 border-b border-gray-800 last:border-0"
                onClick={() => onNewsClick(news.id)}
              >
                <div className="flex gap-4 lg:gap-6">
                  <span className="text-4xl lg:text-5xl font-black text-gray-800 font-mono leading-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <span className="text-xs text-red-500 font-mono tracking-widest uppercase mb-2 block">
                      {news.category}
                    </span>
                    <h3 className="text-lg lg:text-xl font-bold leading-tight mb-3 group-hover:text-red-500 transition-colors">
                      {news.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 text-xs font-mono">
                      <Icon name="Calendar" size={12} />
                      <span>{new Date(news.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
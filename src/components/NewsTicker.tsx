import Icon from '@/components/ui/icon';

interface NewsTickerProps {
  latestNews: any[];
}

export const NewsTicker = ({ latestNews }: NewsTickerProps) => {
  if (latestNews.length === 0) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary via-accent to-orange-500 py-4 shadow-lg">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="flex items-center relative z-10">
        <div className="bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-full flex items-center gap-3 flex-shrink-0 ml-6 mr-8 shadow-xl">
          <div className="relative">
            <Icon name="Zap" size={18} className="text-white" />
            <div className="absolute inset-0 animate-ping">
              <Icon name="Zap" size={18} className="text-white opacity-75" />
            </div>
          </div>
          <span className="font-black text-white text-sm uppercase tracking-wider">Сейчас</span>
        </div>
        <div className="animate-marquee whitespace-nowrap">
          {latestNews.map((news, i) => (
            <span key={news.id} className="inline-flex items-center mx-8">
              <span className="font-bold text-white text-base drop-shadow-lg">{news.title}</span>
              {i < latestNews.length - 1 && <span className="mx-8 text-white/60 text-2xl">●</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

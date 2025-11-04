import Icon from '@/components/ui/icon';

interface NewsTickerProps {
  latestNews: any[];
}

export const NewsTicker = ({ latestNews }: NewsTickerProps) => {
  if (latestNews.length === 0) return null;

  return (
    <div className="bg-black text-white overflow-hidden border-y-4 border-primary max-w-full">
      <div className="flex items-center min-w-0">
        <div className="bg-accent px-4 md:px-6 py-3 md:py-4 flex items-center gap-2 md:gap-3 flex-shrink-0 border-r-4 border-primary">
          <Icon name="Zap" size={16} className="text-white" />
          <span className="font-black uppercase tracking-widest text-xs md:text-sm">СРОЧНО</span>
        </div>
        <div className="animate-marquee whitespace-nowrap py-3 md:py-4 overflow-hidden">
          {latestNews.map((news, i) => (
            <span key={news.id} className="inline-flex items-center mx-4 md:mx-8">
              <span className="font-black uppercase tracking-wider text-sm md:text-base">{news.title}</span>
              {i < latestNews.length - 1 && <span className="mx-4 md:mx-8 text-accent">●</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
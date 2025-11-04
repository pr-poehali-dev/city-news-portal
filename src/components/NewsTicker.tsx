import Icon from '@/components/ui/icon';

interface NewsTickerProps {
  latestNews: any[];
}

export const NewsTicker = ({ latestNews }: NewsTickerProps) => {
  if (latestNews.length === 0) return null;

  return (
    <div className="bg-black text-white overflow-hidden border-y-4 border-primary max-w-full">
      <div className="flex items-center min-w-0">
        <div className="bg-accent px-3 md:px-6 py-3 md:py-4 flex items-center gap-1.5 md:gap-3 flex-shrink-0 border-r-4 border-primary">
          <Icon name="Zap" size={14} className="text-white md:w-4 md:h-4" />
          <span className="font-black uppercase tracking-widest text-[10px] md:text-sm">СРОЧНО</span>
        </div>
        <div className="flex-1 overflow-hidden py-3 md:py-4">
          <div className="animate-marquee whitespace-nowrap inline-block pl-4">
            {latestNews.concat(latestNews).map((news, i) => (
              <span key={`${news.id}-${i}`} className="inline-flex items-center mx-6 md:mx-8">
                <span className="font-black uppercase tracking-wider text-xs md:text-base">{news.title}</span>
                <span className="mx-6 md:mx-8 text-accent">●</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
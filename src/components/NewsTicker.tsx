import Icon from '@/components/ui/icon';

interface NewsTickerProps {
  latestNews: any[];
}

export const NewsTicker = ({ latestNews }: NewsTickerProps) => {
  if (latestNews.length === 0) return null;

  return (
    <div className="bg-black text-white overflow-hidden border-y-4 border-primary">
      <div className="flex items-center">
        <div className="bg-accent px-6 py-4 flex items-center gap-3 flex-shrink-0 border-r-4 border-primary">
          <Icon name="Zap" size={20} className="text-white" />
          <span className="font-black uppercase tracking-widest text-sm">СРОЧНО</span>
        </div>
        <div className="animate-marquee whitespace-nowrap py-4">
          {latestNews.map((news, i) => (
            <span key={news.id} className="inline-flex items-center mx-8">
              <span className="font-black uppercase tracking-wider text-base">{news.title}</span>
              {i < latestNews.length - 1 && <span className="mx-8 text-accent">●</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

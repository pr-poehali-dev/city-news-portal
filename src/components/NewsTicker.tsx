import Icon from '@/components/ui/icon';

interface NewsTickerProps {
  latestNews: any[];
}

export const NewsTicker = ({ latestNews }: NewsTickerProps) => {
  if (latestNews.length === 0) return null;

  return (
    <div className="bg-primary text-primary-foreground overflow-hidden border-y-4 border-primary">
      <div className="animate-marquee whitespace-nowrap py-4">
        {latestNews.map((news, i) => (
          <span key={news.id} className="inline-flex items-center mx-12">
            <span className="w-2 h-2 bg-accent mr-4"></span>
            <span className="font-black uppercase tracking-wider text-sm">{news.title}</span>
            {i < latestNews.length - 1 && <span className="mx-8 text-primary-foreground/40">|</span>}
          </span>
        ))}
      </div>
    </div>
  );
};
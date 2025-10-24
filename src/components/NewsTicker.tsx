import Icon from '@/components/ui/icon';

interface NewsTickerProps {
  latestNews: any[];
}

export const NewsTicker = ({ latestNews }: NewsTickerProps) => {
  if (latestNews.length === 0) return null;

  return (
    <div className="bg-primary text-white overflow-hidden">
      <div className="animate-marquee whitespace-nowrap py-2">
        {latestNews.map((news, i) => (
          <span key={news.id} className="inline-block mx-8">
            <Icon name="Circle" size={6} className="inline mr-2" />
            {news.title}
            {i < latestNews.length - 1 && <span className="mx-4">•</span>}
          </span>
        ))}
      </div>
    </div>
  );
};

import Icon from '@/components/ui/icon';

interface NewsTickerProps {
  latestNews: any[];
}

export const NewsTicker = ({ latestNews }: NewsTickerProps) => {
  if (latestNews.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-primary via-accent to-primary text-white overflow-hidden shadow-lg relative">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-pulse"></div>
      <div className="animate-marquee whitespace-nowrap py-3 relative z-10">
        {latestNews.map((news, i) => (
          <span key={news.id} className="inline-flex items-center mx-8">
            <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
            <span className="font-semibold">{news.title}</span>
            {i < latestNews.length - 1 && <span className="mx-6 text-white/60">•</span>}
          </span>
        ))}
      </div>
    </div>
  );
};

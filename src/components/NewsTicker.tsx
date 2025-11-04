import Icon from '@/components/ui/icon';

interface NewsTickerProps {
  latestNews: any[];
}

export const NewsTicker = ({ latestNews }: NewsTickerProps) => {
  if (latestNews.length === 0) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-accent via-purple-600 to-pink-600 py-3">
      <div className="flex items-center">
        <div className="bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full flex items-center gap-2 flex-shrink-0 ml-4 mr-6">
          <Icon name="Zap" size={16} className="text-white" />
          <span className="font-bold text-white text-sm">Срочно</span>
        </div>
        <div className="animate-marquee whitespace-nowrap">
          {latestNews.map((news, i) => (
            <span key={news.id} className="inline-flex items-center mx-6">
              <span className="font-semibold text-white text-sm">{news.title}</span>
              {i < latestNews.length - 1 && <span className="mx-6 text-white/60">•</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
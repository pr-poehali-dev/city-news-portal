import { Star, ExternalLink, Popcorn } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MovieCardProps {
  title: string;
  year: number;
  rating: number;
  poster: string;
  description: string;
  kinopoisk_url: string;
  director: string;
  genres: string[];
  size?: 'default' | 'large';
}

export default function MovieCard({
  title,
  year,
  rating,
  poster,
  description,
  kinopoisk_url,
  director,
  genres,
  size = 'default'
}: MovieCardProps) {
  return (
    <Card className={`overflow-hidden group hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-all duration-500 border-2 ${
      size === 'large' ? 'bg-gradient-to-br from-red-950/40 to-purple-950/40 border-yellow-600/30' : 'bg-gradient-to-br from-gray-900 to-black border-gray-800 hover:border-yellow-600/50'
    }`}>
      <div className={`${size === 'large' ? 'grid md:grid-cols-[300px,1fr] gap-6' : ''}`}>
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-purple-500/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img
            src={poster}
            alt={title}
            className={`w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 ${
              size === 'large' ? 'h-[450px]' : 'h-[400px]'
            }`}
            loading="lazy"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=' + encodeURIComponent(title);
            }}
          />
          <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-2 rounded-full font-black flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,215,0,0.5)] border-2 border-yellow-300">
            <Star className="w-5 h-5 fill-current animate-pulse" />
            <span className="text-lg">{rating.toFixed(1)}</span>
          </div>
          <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <Popcorn className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
          </div>
        </div>

        <div className={`p-6 ${size === 'large' ? 'flex flex-col justify-center' : ''}`}>
          <div className="flex flex-wrap gap-2 mb-4">
            {genres.map((genre, index) => (
              <span
                key={genre}
                className="px-3 py-1 bg-gradient-to-r from-red-600/30 to-purple-600/30 text-yellow-400 text-xs rounded-full font-bold border border-yellow-600/30 hover:border-yellow-400/50 transition-colors"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {genre}
              </span>
            ))}
          </div>

          <h3 className={`font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-3 ${
            size === 'large' ? 'text-3xl' : 'text-xl'
          }`}>
            {title}
          </h3>
          
          <p className="text-gray-400 text-sm mb-3 font-semibold">
            {year}
          </p>

          <p className="text-sm text-gray-400 mb-4">
            Режиссёр: <span className="text-yellow-500 font-bold">{director}</span>
          </p>

          <p className={`text-gray-300 mb-6 line-clamp-3 leading-relaxed ${
            size === 'large' ? 'text-base' : 'text-sm'
          }`}>
            {description}
          </p>

          <a
            href={kinopoisk_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-purple-600 text-white px-6 py-3 rounded-full font-black hover:shadow-[0_0_20px_rgba(255,0,0,0.5)] hover:scale-105 transition-all duration-300 group/btn w-fit border-2 border-red-500/50"
          >
            <span>Смотреть</span>
            <ExternalLink className="w-5 h-5 transition-transform group-hover/btn:translate-x-2 group-hover/btn:scale-110" />
          </a>
        </div>
      </div>
    </Card>
  );
}
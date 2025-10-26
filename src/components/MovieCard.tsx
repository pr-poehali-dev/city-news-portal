import { Star, ExternalLink } from 'lucide-react';
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
    <Card className={`overflow-hidden group hover:shadow-2xl transition-all duration-300 ${
      size === 'large' ? 'bg-gradient-to-br from-purple-900/20 to-blue-900/20' : 'bg-card'
    }`}>
      <div className={`${size === 'large' ? 'grid md:grid-cols-[300px,1fr] gap-6' : ''}`}>
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img
            src={poster}
            alt={title}
            className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              size === 'large' ? 'h-[450px]' : 'h-[400px]'
            }`}
          />
          <div className="absolute top-4 right-4 z-20 bg-yellow-400 text-black px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 shadow-lg">
            <Star className="w-4 h-4 fill-current" />
            {rating.toFixed(1)}
          </div>
        </div>

        <div className={`p-6 ${size === 'large' ? 'flex flex-col justify-center' : ''}`}>
          <div className="flex flex-wrap gap-2 mb-3">
            {genres.map((genre) => (
              <span
                key={genre}
                className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full font-medium"
              >
                {genre}
              </span>
            ))}
          </div>

          <h3 className={`font-bold text-foreground mb-2 ${
            size === 'large' ? 'text-3xl' : 'text-xl'
          }`}>
            {title} ({year})
          </h3>

          <p className="text-sm text-muted-foreground mb-3">
            Режиссёр: <span className="text-foreground font-medium">{director}</span>
          </p>

          <p className={`text-muted-foreground mb-6 line-clamp-3 ${
            size === 'large' ? 'text-base' : 'text-sm'
          }`}>
            {description}
          </p>

          <a
            href={kinopoisk_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors group/btn w-fit"
          >
            <span>Смотреть на Кинопоиске</span>
            <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </a>
        </div>
      </div>
    </Card>
  );
}

import { useState, useEffect } from 'react';
import { Film, Sparkles, Clapperboard, Camera } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/Footer';

interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  poster: string;
  description: string;
  kinopoisk_url: string;
  director: string;
  genres: string[];
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [displayCount, setDisplayCount] = useState(12);

  useEffect(() => {
    fetchAllMovies();
  }, []);

  useEffect(() => {
    setMovies(allMovies.slice(0, displayCount));
  }, [allMovies, displayCount]);

  const fetchAllMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://functions.poehali.dev/8276deb7-23a1-45e7-b53f-390b386d0d71?limit=100&offset=0'
      );
      const data = await response.json();
      setAllMovies(data.movies);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 12);
  };

  const hasMore = displayCount < allMovies.length;

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-purple-900/20 to-blue-900/20" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-yellow-400/20 animate-pulse"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 3 + 2 + 's',
              }}
            />
          ))}
        </div>

        <div className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-center gap-6 mb-8">
              <Clapperboard className="w-20 h-20 text-red-500 animate-bounce" style={{ animationDuration: '2s' }} />
              <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-purple-500 drop-shadow-2xl">
                Город смотрит
              </h1>
              <Camera className="w-20 h-20 text-yellow-400 animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.2s' }} />
            </div>
            
            <div className="text-center mb-8">
              <p className="text-2xl font-bold text-yellow-400 mb-2 tracking-wider">🎬 ПРЕМЬЕРА 🎬</p>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Топ-{total} лучших фильмов всех времён по версии Кинопоиска
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            </div>
            
            <div className="flex items-center justify-center gap-4 text-gray-400 text-sm">
              <span className="flex items-center gap-2">
                <Film className="w-4 h-4" />
                Кино
              </span>
              <span>•</span>
              <span>Рейтинги</span>
              <span>•</span>
              <span>Рецензии</span>
            </div>
          </div>
        </div>

      <div className="container mx-auto px-4 pb-20 relative z-10">
        {loading && offset === 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[400px] w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {movies.map((movie) => (
                <MovieCard key={movie.id} {...movie} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center relative">
                <div className="absolute inset-0 blur-xl bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-purple-500/20 rounded-full" />
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="relative group bg-gradient-to-r from-red-600 via-yellow-500 to-purple-600 text-white px-12 py-5 rounded-full font-black text-xl hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-yellow-400/50"
                >
                  <span className="flex items-center gap-3">
                    <Film className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    {loading ? 'Загрузка...' : 'Ещё фильмы'}
                    <Sparkles className="w-6 h-6 group-hover:-rotate-12 transition-transform" />
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
}
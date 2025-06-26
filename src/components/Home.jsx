import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const navigate = useNavigate();

  // Fetch trending movies on page load
  useEffect(() => {
    const fetchTrending = async () => {
      const url = 'https://api.themoviedb.org/3/trending/movie/week?language=en-US';
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_BEARER}`
        }
      };
      try {
        const res = await fetch(url, options);
        const data = await res.json();
        setTrending(data.results || []);
      } catch (err) {
        console.error('Error fetching trending:', err);
      }
    };
    fetchTrending();
  }, []);

  // Fetch search results
  const fetchMovies = async (e) => {
    e.preventDefault();

    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      query
    )}&include_adult=false&language=en-US&page=1`;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_BEARER}`
      }
    };

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      console.error('Error fetching movies:', err);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Site Title */}
      <div className="text-center py-6 text-4xl font-bold text-indigo-400">
        <h1>
          <a href="/">CoolMovieHub</a>
        </h1>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center items-center py-6 px-6">
        <form
          onSubmit={fetchMovies}
          className="flex items-center w-full max-w-xl bg-gray-800 rounded-full shadow-xl p-3"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a movie..."
            className="w-full h-5 p-2 bg-transparent text-white border-none focus:outline-none text-lg"
          />
          <button
            type="submit"
            className="bg-blue-700 cursor-pointer text-white px-5 py-2 h-8 rounded-full ml-4 text-sm font-semibold hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>
      </div>
        {/* Search Results */}
      {movies.length > 0 && (
        <section className="px-6 pb-12">
          <h2 className="text-2xl font-semibold text-indigo-300 mb-4">🎯 Search Results</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => navigate(`/watch/${movie.id}`)}
                className="cursor-pointer bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
              >
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-72 object-contain"
                  />
                ) : (
                  <div className="w-full h-72 bg-gray-600 flex items-center justify-center text-white text-xl">
                    No Image
                  </div>
                )}
                <h3 className="text-center p-2 font-semibold text-sm md:text-lg">{movie.title}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending Movies Section */}
      {trending.length > 0 && (
        <section className="px-6 pb-12">
          <h2 className="text-2xl font-semibold text-indigo-300 mb-4">🔥 Trending This Week</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trending.slice(0, 10).map((movie) => (
              <div
                key={movie.id}
                onClick={() => navigate(`/watch/${movie.id}`)}
                className="cursor-pointer bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
              >
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-60 object-cover"
                  />
                ) : (
                  <div className="w-full h-60 bg-gray-600 flex items-center justify-center text-white">
                    No Image
                  </div>
                )}
                <h4 className="text-center p-2 font-medium text-sm">{movie.title}</h4>
              </div>
            ))}
          </div>
        </section>
      )}

    
    </div>
  );
}

export default Home;

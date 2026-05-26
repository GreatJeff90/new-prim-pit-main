// import React from "react";

// // Placeholder movie data — swap for real API data
// const RECENTLY_WATCHED = [
//   {
//     id: "1",
//     title: "John Wick",
//     year: "2014",
//     price: "$2.99",
//     poster: "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
//   },
//   {
//     id: "2",
//     title: "Dune",
//     year: "2021",
//     price: "$3.99",
//     poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
//   },
//   {
//     id: "3",
//     title: "Oppenheimer",
//     year: "2023",
//     price: "$4.99",
//     poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
//   },
//   {
//     id: "4",
//     title: "The Batman",
//     year: "2022",
//     price: "$2.99",
//     poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
//   },
// ];

// const RecentlyWatched: React.FC = () => {
//   return (
//     <div className="flex-1 flex flex-col min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#0d0d15] via-[#12121f] to-[#0d0d15] font-[Poppins] text-white relative overflow-hidden select-none">
//       {/* Blue glow — right side */}
//       <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-700/15 blur-[130px] pointer-events-none" />

//       {/* Page content */}
//       <div className="relative z-10 flex-1 flex flex-col px-6 md:px-10 pt-8 pb-12 gap-8">
//         {/* Section heading */}
//         {/*<h2 className="text-white font-semibold text-xl md:text-2xl tracking-wide">
//           Recently Played
//         </h2>*/}

//         {/* Movie cards row */}
//         <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide">
//           {RECENTLY_WATCHED.map((movie) => (
//             <MovieCard key={movie.id} movie={movie} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ── Movie Card ──────────────────────────────────────────────────────────────

// interface MovieCardProps {
//   movie: {
//     id: string;
//     title: string;
//     year: string;
//     price: string;
//     poster: string;
//   };
// }

// const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
//   return (
//     <div className="relative flex-shrink-0 w-56 md:w-64 h-40 md:h-48 rounded-[28px] overflow-hidden cursor-pointer group shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03]">
//       {/* Poster image */}
//       <img
//         src={movie.poster}
//         alt={movie.title}
//         className="absolute inset-0 w-full h-full object-cover"
//         onError={(e) => {
//           (e.target as HTMLImageElement).src =
//             "https://placehold.co/256x192/1e1e28/ffffff?text=No+Image";
//         }}
//       />

//       {/* Dark gradient overlay — bottom half */}
//       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

//       {/* Year badge — top left */}
//       <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-orange-600 rounded-md px-2 py-0.5">
//         <span className="text-white text-[9px] font-black tracking-wide">
//           {movie.year}
//         </span>
//       </div>

//       {/* Bottom row: price + button */}
//       <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
//         <span className="text-white text-sm font-semibold drop-shadow">
//           {movie.price}
//         </span>
//         <button className="bg-[#10b981] hover:bg-[#059669] text-white text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors shadow-lg">
//           Watch again
//         </button>
//       </div>

//       {/* Title on hover */}
//       <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
//         <span className="text-white text-xs font-semibold bg-black/60 px-2 py-1 rounded-lg backdrop-blur-sm max-w-[100px] truncate block">
//           {movie.title}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default RecentlyWatched;

import React, { useEffect, useState } from "react";
import { useApi } from "../../../context/AppContext";

interface Movie {
  _id: string;
  title: string;
  year: number;
  price: number;
  posterImage?: string;
}

interface HistoryItem {
  movie: Movie;
  lastPlayedAt: string;
}

const RecentlyWatched: React.FC = () => {
  const { getRecentlyPlayed, userProfile } = useApi();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (userProfile?.isSubscribed) {
        setLoading(true);
        const data = await getRecentlyPlayed(10);
        setHistory(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userProfile?.isSubscribed]);

  // Non-premium user view
  if (!userProfile?.isSubscribed) {
    return (
      <div className="p-6 bg-[#1e1e28] text-center rounded-xl border border-dashed border-amber-500/30">
        <h3 className="text-amber-400 font-bold text-lg mb-1">
          ⭐ Premium Feature
        </h3>
        <p className="text-gray-400 text-sm max-w-sm mx-auto">
          Upgrade your subscription package to unlock your automated viewing
          history and continue right where you left off.
        </p>
        <button className="mt-4 bg-gradient-to-r from-amber-400 to-orange-600 text-white font-bold text-xs px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
          Upgrade to Premium
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#10b981]"></div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 text-sm">
        You haven't watched any movies recently.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4">
      {history.map(({ movie, lastPlayedAt }) => {
        // Fallback safely if a movie payload object is missing or null
        if (!movie) return null;

        return (
          <div
            key={movie._id}
            className="group relative bg-[#1e1e28] rounded-xl overflow-hidden shadow-md border border-gray-800 hover:border-gray-700 transition-all aspect-[4/3]"
          >
            <img
              src={
                movie.posterImage ||
                "https://placehold.co/256x192/1e1e28/ffffff?text=No+Image"
              }
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/256x192/1e1e28/ffffff?text=No+Image";
              }}
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Year badge — top left */}
            <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-orange-600 rounded-md px-2 py-0.5">
              <span className="text-white text-[9px] font-black tracking-wide">
                {movie.year}
              </span>
            </div>

            {/* Metadata container displayed inside overlay */}
            <div className="absolute inset-x-3 bottom-3 flex flex-col gap-1.5">
              <h4 className="text-white font-bold text-sm truncate drop-shadow">
                {movie.title}
              </h4>

              <div className="flex items-center justify-between gap-2">
                <span className="text-gray-300 text-xs font-semibold">
                  {movie.price === 0 ? "Free" : `$${movie.price}`}
                </span>
                <button
                  onClick={() => {
                    // Route to stream/view route layout
                    console.log(`Streaming movie: ${movie._id}`);
                  }}
                  className="bg-[#10b981] hover:bg-[#059669] text-white text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors shadow-lg"
                >
                  Watch again
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentlyWatched;

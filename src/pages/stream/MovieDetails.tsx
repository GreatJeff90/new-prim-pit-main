import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useApi, Movie } from "../../context/AppContext";
import logoIcon from "../../assets/F.png";
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Calendar, 
  Film, 
  Tv, 
  Languages, 
  Tag, 
  Sparkles, 
  DollarSign, 
  X, 
  Globe,
  Award,
  Video
} from "lucide-react";
import toast from "react-hot-toast";
import LoginModal from "../../components/login/LoginModal";
import SignupModal from "../../components/signup/SignUpModal";
import ForgotPasswordModal from "../../components/login/ForgotPasswordModal";
import ResetPasswordModal from "../../components/login/ResetPasswordModal";

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMovieById, logout, userProfile } = useApi();
  
  const isSubscribed = userProfile?.isSubscribed ?? localStorage.getItem("isSubscribed") === "true";
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const [isLoggedInState, setIsLoggedInState] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showPremiumSearchModal, setShowPremiumSearchModal] = useState(false);

  // Sync login state
  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedInState(localStorage.getItem("isLoggedIn") === "true");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    setShowForgotModal(false);
    setShowResetModal(false);
    setShowPremiumSearchModal(false);
  };

  const handleSearchClick = () => {
    if (!isLoggedInState) {
      toast.error("Please sign in to search.");
      setShowLoginModal(true);
    } else if (!isSubscribed) {
      setShowPremiumSearchModal(true);
    } else {
      toast.success("Voice Search activated! Listening...");
    }
  };

  const handleAuthSuccess = () => {
    setIsLoggedInState(true);
    closeAllModals();
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      setIsLoggedInState(false);
    } catch (err) {
      console.error("Logout failed", err);
      setIsLoggedInState(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMovieById(id)
      .then((data: any) => {
        const movieData = data?.movie || data;
        setMovie(movieData);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Failed to load movie details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, getMovieById]);

  // Set document title dynamically
  useEffect(() => {
    if (movie) {
      document.title = `${movie.title} - Flixora Premium`;
    } else {
      document.title = "Flixora Premium Streaming";
    }
  }, [movie]);

  const handlePurchase = async () => {
    if (!movie) return;
    
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please sign in to purchase movies.");
      setShowLoginModal(true);
      return;
    }

    const toastId = toast.loading("Connecting to secure payment gateway...");
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(
        `${baseUrl}api/stripe/pay`,
        {
          type: "movie",
          movieId: movie._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.paymentUrl) {
        toast.success("Redirecting to Stripe checkout...", { id: toastId });
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error("Failed to generate payment link. Please try again.", { id: toastId });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Payment initiation failed.";
      toast.error(msg, { id: toastId });
    }
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v=")) {
      const vid = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${vid}?autoplay=1`;
    }
    if (url.includes("youtu.be/")) {
      const vid = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${vid}?autoplay=1`;
    }
    return url;
  };

  // Fallback poster mapping
  const TIER_FALLBACKS = [
    "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-8 animate-pulse">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center h-12">
            <div className="w-24 h-6 bg-white/10 rounded" />
            <div className="w-32 h-8 bg-white/10 rounded" />
          </div>
          {/* Backdrop image placeholder */}
          <div className="w-full aspect-[21/9] bg-white/5 rounded-2xl" />
          {/* Metadata row placeholder */}
          <div className="flex gap-4">
            <div className="w-1/4 aspect-[2/3] bg-white/5 rounded-xl" />
            <div className="flex-1 space-y-4">
              <div className="h-10 w-2/3 bg-white/10 rounded" />
              <div className="h-4 w-1/3 bg-white/10 rounded" />
              <div className="h-20 w-full bg-white/5 rounded" />
              <div className="h-12 w-48 bg-white/15 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <X className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-wider font-sans">Error Loading Movie</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">{error || "Movie details could not be found."}</p>
          <button 
            onClick={() => navigate("/stream-movies")}
            className="w-full py-3 rounded-lg bg-white text-zinc-950 font-bold uppercase hover:bg-zinc-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const hasPoster = movie.posterImage && !movie.posterImage.includes("example.com");
  const posterUrl = hasPoster ? movie.posterImage : TIER_FALLBACKS[0];

  const hasBackdrop = movie.backdropImage && !movie.backdropImage.includes("example.com");
  const backdropUrl = hasBackdrop ? movie.backdropImage : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden font-sans">
      
      {/* Header layout */}
      <header className="absolute inset-x-0 top-0 h-[90px] px-4 sm:px-8 flex flex-row items-center justify-between z-20 bg-gradient-to-b from-black/90 to-transparent gap-4">

        {/* Left Block: Logo Brand & UK badge */}
        <div onClick={() => navigate("/stream-movies")} className="relative flex items-center cursor-pointer select-none h-[45px] shrink-0 group">
          <img 
            src={logoIcon} 
            alt="Flixora Logo" 
            className="h-[42px] w-[42px] object-contain group-hover:scale-105 transition-all duration-300"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.25))'
            }}
          />
          <span className="absolute -top-0.5 left-[36px] uppercase text-white/95 font-sans text-[8px] tracking-wider font-extrabold select-none group-hover:scale-105 transition-all duration-300">
            uk
          </span>
          {isLoggedInState && (
            <span className={`absolute top-[30px] left-[36px] uppercase font-sans sm:text-[8px] text-xs tracking-wider font-extrabold select-none group-hover:scale-105 transition-all duration-300 ${
              isSubscribed ? "text-white" : "text-white"
            }`}>
              {isSubscribed ? "Premium" : "Basic"}
            </span>
          )}
        </div>

        {/* Right Block: Action controls panel container (Search & Auth) */}
        <div className="flex items-center gap-4">
          <div 
            onClick={handleSearchClick}
            className="relative flex items-center bg-[#0d0d14]/75 border border-purple-500/35 rounded-full px-4 py-2 w-44 xs:w-56 sm:w-72 shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300 hover:border-purple-400/50 focus-within:border-purple-400/70 focus-within:shadow-[0_0_20px_rgba(168,85,247,0.35)] shrink-0 cursor-pointer"
          >
            <input
              type="text"
              placeholder="Voice Search"
              className="bg-transparent text-white text-xs outline-none w-full placeholder-white/30 font-semibold tracking-wide cursor-pointer"
              readOnly
            />
            <span className="sm:text-xl text-2xl select-none filter drop-shadow-[0_0_4px_rgba(249,115,22,0.4)]">🦊</span>
          </div>

          {isLoggedInState ? (
            <button
              onClick={handleLogoutClick}
              className="text-white/80 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-4 py-2 rounded-sm border border-white/20 text-white hover:bg-white/10 transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Hero Backdrop Banner */}
      <section 
        className="w-full aspect-[21/9] min-h-[300px] sm:min-h-[450px] bg-cover bg-center relative flex items-end"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.95)), url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent" />
      </section>

      {/* Movie Details Main Body Container */}
      <main className="max-w-[1400px] mx-auto px-6 sm:px-12 pb-24 -mt-20 sm:-mt-32 relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {!isSubscribed && (
          <div className="lg:col-span-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
            <span className="text-white/40 text-[10px] font-bold tracking-wider uppercase">
              Premium Streaming Movie
            </span>
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-[10px] text-white/50 tracking-wider font-black uppercase whitespace-nowrap">
                YOU ARE ON PAY AS YOU GO
              </span>
              <button
                type="button"
                onClick={() => {
                  if (isLoggedInState) {
                    navigate("/upgrade");
                  } else {
                    toast.error("Please sign in to upgrade to Premium.");
                    setShowLoginModal(true);
                  }
                }}
                className="px-5 py-2 rounded-sm bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white text-[11px] font-black tracking-wider uppercase shadow-[0_0_20px_rgba(236,72,153,0.35)] hover:shadow-[0_0_30px_rgba(236,72,153,0.55)] hover:scale-[1.03] transition-all duration-200 active:scale-95 cursor-pointer font-sans"
              >
                UPGRADE TO PREMIUM
              </button>
            </div>
          </div>
        )}

        {/* Left Side: Poster & Purchasing Card */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          <div className="w-full aspect-[2/3] rounded-[16px] overflow-hidden border-2 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)] bg-zinc-900 bg-cover bg-center"
               style={{ backgroundImage: `url(${posterUrl})` }}
          />
          
          {/* Rent/Buy Panel */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Premium Access</span>
              <span className="text-2xl font-black text-white">${movie.price || 12}</span>
            </div>
            
            <button 
              onClick={handlePurchase}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:from-purple-500 hover:to-red-400 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.35)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <DollarSign className="w-4 h-4" /> Rent / Buy Now
            </button>

            {movie.trailerUrl && (
              <button 
                onClick={() => setShowTrailer(true)}
                className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-purple-400 fill-purple-400" /> Watch Trailer
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Primary Info Blocks */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Title & Tagline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-arapey font-normal tracking-wide text-white uppercase leading-none">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-purple-300/80 font-serif italic text-base sm:text-lg pl-1">
                "{movie.tagline}"
              </p>
            )}
          </div>

          {/* Quick Specifications Metadata Badges */}
          <div className="flex flex-wrap gap-2.5 items-center pl-0.5">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300">
              <Calendar className="w-3.5 h-3.5 text-purple-400" /> {movie.year}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-purple-400" /> {movie.runtime ? `${Math.floor(movie.runtime/60)}h ${movie.runtime%60}m` : "2h 4m"}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 uppercase tracking-wider">
              {movie.resolution || "4K Ultra HD"}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-xs font-bold text-amber-300">
              {movie.ageRating || "PG-13"}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300">
              <Languages className="w-3.5 h-3.5 text-purple-400" /> {movie.language || "English"}
            </span>
          </div>

          {/* Genres */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {movie.genre && movie.genre.map((g, i) => (
                <span key={i} className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-medium text-white hover:border-purple-500/30 transition-colors">
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Synopsis</h3>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-4xl">
              {movie.synopsis || "No description available for this title."}
            </p>
          </div>

          {/* Cast Members */}
          {movie.cast && movie.cast.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Principal Cast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {movie.cast.map((c, i) => (
                  <div key={i} className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3.5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-purple-400 border border-purple-500/20 shadow-md shrink-0">
                      {c.name.split(" ").map(w => w[0]).join("")}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-white text-xs font-bold truncate">{c.name}</p>
                      <p className="text-zinc-500 text-[10px] truncate">{c.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Crew and Company Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-zinc-900">
            {movie.producers && movie.producers.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-purple-400" /> Producers
                </span>
                <p className="text-xs text-white leading-relaxed font-semibold">
                  {movie.producers.join(", ")}
                </p>
              </div>
            )}

            {movie.productionCompany && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-purple-400" /> Studio
                </span>
                <p className="text-xs text-white font-semibold">
                  {movie.productionCompany}
                </p>
              </div>
            )}

            {movie.distributor && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-purple-400" /> Distributor
                </span>
                <p className="text-xs text-white font-semibold">
                  {movie.distributor}
                </p>
              </div>
            )}
          </div>

          {/* Subtitles & Audio Tracks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-zinc-900">
            {movie.subtitles && movie.subtitles.length > 0 && (
              <div className="space-y-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/40">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Languages className="w-4 h-4 text-purple-400" /> Subtitles Available
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {movie.subtitles.map((sub, idx) => (
                    <span key={idx} className="text-[10px] bg-zinc-950 px-2.5 py-1 rounded border border-white/5 text-zinc-300 font-medium">
                      {sub.language}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.audioTracks && movie.audioTracks.length > 0 && (
              <div className="space-y-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/40">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-400" /> Audio Tracks
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {movie.audioTracks.map((track, idx) => (
                    <span key={idx} className="text-[10px] bg-zinc-950 px-2.5 py-1 rounded border border-white/5 text-zinc-300 font-medium">
                      {track.language} ({track.type})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Trailer Dialog Modal Overlay */}
      {showTrailer && movie.trailerUrl && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <button 
              onClick={() => setShowTrailer(false)}
              className="absolute right-4 top-4 text-white hover:text-purple-400 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-colors z-20 focus:outline-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={getEmbedUrl(movie.trailerUrl)}
              title={`${movie.title} Trailer`}
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <LoginModal 
        show={showLoginModal} 
        onClose={closeAllModals}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
        onSwitchToForgot={() => {
          setShowLoginModal(false);
          setShowForgotModal(true);
        }}
      />
      
      <SignupModal 
        show={showSignupModal} 
        onClose={closeAllModals}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
        onSuccess={handleAuthSuccess}
      />

      <ForgotPasswordModal
        show={showForgotModal}
        onClose={closeAllModals}
        onSuccess={() => {
          setShowForgotModal(false);
          setShowResetModal(true);
        }}
      />

      <ResetPasswordModal
        show={showResetModal}
        onClose={closeAllModals}
        onSuccess={() => {
          setShowResetModal(false);
          setShowLoginModal(true);
        }}
      />

      <PremiumSearchModal
        show={showPremiumSearchModal}
        onClose={closeAllModals}
        onUpgrade={() => {
          closeAllModals();
          navigate("/upgrade");
        }}
      />
    </div>
  );
}

function PremiumSearchModal({ show, onClose, onUpgrade }: { show: boolean; onClose: () => void; onUpgrade: () => void }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-md bg-black/40 animate-fade-in">
      <div className="w-full max-w-[400px] bg-zinc-900/90 rounded-2xl shadow-2xl p-6 border border-white/10 relative flex flex-col items-center">
        <button onClick={onClose} className="absolute right-4 top-4 text-white/60 hover:text-white transition-opacity">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4">
          <span className="text-xl">🦊</span>
        </div>

        <h3 className="text-xl text-white font-bold tracking-wide mb-2">Premium Search</h3>
        <p className="text-zinc-400 text-xs text-center leading-relaxed mb-6">
          Voice Search is exclusively available to Premium members. Upgrade your subscription to unlock search and get full access to the streaming catalog.
        </p>

        <div className="w-full flex flex-col gap-2">
          <button
            onClick={onUpgrade}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:from-purple-500 hover:to-red-400 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
          >
            Upgrade to Premium
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

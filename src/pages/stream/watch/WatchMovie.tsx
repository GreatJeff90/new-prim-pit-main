import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

// Types

interface MovieData {
  _id: string;
  title: string;
  synopsis: string;
  posterImage: string;
  backdropImage: string;
  trailerUrl: string;
  streamUrl: string | null;
  runtime: number;
  year: number;
  genre: string[];
  ageRating: string;
  cast: { name: string; character: string }[];
}

type PageState = "verifying" | "granted" | "denied" | "error";

// Component

export default function WatchMovie() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  const [state, setState] = useState<PageState>("verifying");
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Verify access on mount
  useEffect(() => {
    if (!id) {
      setState("error");
      setErrorMsg("No movie ID in URL.");
      return;
    }

    const verify = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const token = localStorage.getItem("authToken");

        const params = new URLSearchParams({ movieId: id });
        if (sessionId) params.set("sessionId", sessionId);

        const res = await fetch(
          `${baseUrl}api/stripe/movie-access/verify?${params.toString()}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );

        const data = await res.json();

        if (!res.ok || !data.granted) {
          setState("denied");
          setErrorMsg(data.message || "Access not granted.");
          return;
        }

        setMovie(data.movie);
        setState("granted");
      } catch (err: any) {
        setState("error");
        setErrorMsg("Could not verify your access. Please try again.");
      }
    };

    verify();
  }, [id, sessionId]);

  // Auto-hide controls on mouse idle
  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    resetControlsTimer();
  };

  // Loading / denied / error screens
  if (state === "verifying") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-5">
        <div
          className="w-14 h-14 rounded-full border-2 border-transparent animate-spin"
          style={{
            borderTopColor: "rgba(139,92,246,1)",
            borderRightColor: "rgba(219,39,119,0.5)",
          }}
        />
        <p className="text-white/50 text-sm font-bold uppercase tracking-widest">
          Verifying your access…
        </p>
      </div>
    );
  }

  if (state === "denied" || state === "error") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 p-6 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(239,68,68,0.9)"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <div>
          <h2 className="text-white text-xl font-black uppercase tracking-tight mb-2">
            {state === "denied" ? "Access Denied" : "Something went wrong"}
          </h2>
          <p className="text-white/45 text-sm max-w-sm leading-relaxed">
            {errorMsg}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/stream-movies")}
            className="px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #db2777)",
              boxShadow: "0 0 20px rgba(139,92,246,0.35)",
            }}
          >
            Browse Movies
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const backdropUrl =
    movie.backdropImage && !movie.backdropImage.includes("example.com")
      ? movie.backdropImage
      : movie.posterImage && !movie.posterImage.includes("example.com")
        ? movie.posterImage
        : null;

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-black overflow-hidden select-none"
      onMouseMove={resetControlsTimer}
      onClick={resetControlsTimer}
    >
      {movie.streamUrl ? (
        /* True Fullscreen Video Player */
        <>
          <video
            ref={videoRef}
            src={movie.streamUrl}
            className="w-full h-full object-contain"
            poster={backdropUrl || undefined}
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              setShowControls(true);
            }}
          />

          {/* Interactive Controls Overlay */}
          <div
            className="absolute inset-0 flex flex-col justify-between transition-opacity duration-300 pointer-events-none"
            style={{ opacity: showControls ? 1 : 0 }}
          >
            {/* Top Bar - Only shows when controls are active (hover/move) */}
            <div
              className="w-full px-8 py-6 flex items-start gap-5 pointer-events-auto"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.3), transparent)",
              }}
            >
              <div className="flex flex-col items-center gap-1.5">
                {/* Brand F Logo Button */}
                <button
                  onClick={() => navigate("/stream-movies")}
                  className="group flex items-center justify-center w-12 h-12 rounded-full bg-[#1c1a24] hover:bg-[#252230] border border-white/5 text-white transition-all duration-200 active:scale-95 shadow-lg shadow-black/40"
                  title="Back to Movies"
                >
                  <span
                    className="text-2xl font-black select-none tracking-tighter text-transparent bg-clip-text"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom right, #a78bfa, #f472b6)",
                      fontFamily: "'Arial Black', sans-serif",
                    }}
                  >
                    F
                  </span>
                </button>
              </div>

              <div className="flex flex-col pt-1">
                {/* Movie Title showing below the logo level horizontally */}
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase drop-shadow-md">
                  {movie.title}
                </h1>
                {movie.year > 0 && (
                  <p className="text-[11px] text-white/40 font-bold tracking-wider uppercase mt-0.5">
                    {movie.year} &bull; {movie.ageRating || "NR"}
                  </p>
                )}
              </div>
            </div>

            {/* Center Play/Pause Button */}
            <div className="flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="w-16 h-16 flex items-center justify-center rounded-full pointer-events-auto transition-all duration-200 active:scale-90 hover:bg-white/20"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {isPlaying ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <rect x="5" y="4" width="4" height="16" rx="1" />
                    <rect x="15" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <polygon points="6,3 20,12 6,21" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>

            {/* Bottom Controls Bar */}
            <div
              className="w-full px-6 py-8 pointer-events-auto"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.4), transparent)",
              }}
            >
              <NativeProgress videoRef={videoRef} />
            </div>
          </div>
        </>
      ) : movie.trailerUrl ? (
        /* Fallback: Fullscreen iframe trailer */
        <div
          className="w-full h-full relative"
          onMouseMove={resetControlsTimer}
        >
          <div
            className="absolute top-0 left-0 w-full px-8 py-6 flex items-start gap-5 z-20 transition-opacity duration-300"
            style={{
              opacity: showControls ? 1 : 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)",
            }}
          >
            <button
              onClick={() => navigate("/stream-movies")}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1c1a24] text-white font-black"
            >
              <span
                className="text-2xl text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-400"
                style={{ fontFamily: "'Arial Black', sans-serif" }}
              >
                F
              </span>
            </button>
            <div className="pt-1">
              <h1 className="text-lg font-black tracking-tight text-white uppercase">
                {movie.title} (Trailer)
              </h1>
            </div>
          </div>

          <iframe
            src={
              movie.trailerUrl.includes("youtube.com") ||
              movie.trailerUrl.includes("youtu.be")
                ? movie.trailerUrl
                    .replace("watch?v=", "embed/")
                    .replace("youtu.be/", "youtube.com/embed/") +
                  "?autoplay=1&rel=0&controls=1"
                : movie.trailerUrl
            }
            className="w-full h-full border-none"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={movie.title}
          />
        </div>
      ) : (
        /* Coming Soon Screen */
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-4 relative"
          style={{
            backgroundImage: backdropUrl ? `url(${backdropUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="absolute top-0 left-0 w-full px-8 py-6 flex items-start gap-5 z-20"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)",
            }}
          >
            <button
              onClick={() => navigate("/stream-movies")}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1c1a24] text-white font-black"
            >
              <span
                className="text-2xl text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-400"
                style={{ fontFamily: "'Arial Black', sans-serif" }}
              >
                F
              </span>
            </button>
          </div>
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.75)" }}
          />
          <div className="relative z-10 text-center px-4">
            <p className="text-white/80 text-base font-black uppercase tracking-widest mb-2">
              Stream coming soon
            </p>
            <p className="text-white/40 text-xs max-w-sm mx-auto leading-relaxed">
              Your access is verified. The full stream will be available
              shortly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Progress Bar Component

function NativeProgress({
  videoRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => {
      if (video.duration)
        setProgress((video.currentTime / video.duration) * 100);
    };
    video.addEventListener("timeupdate", onTime);
    return () => video.removeEventListener("timeupdate", onTime);
  }, [videoRef]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    video.currentTime = ratio * video.duration;
  };

  return (
    <div
      className="w-full h-1.5 rounded-full cursor-pointer group/progress transition-all duration-150 relative flex items-center"
      style={{ background: "rgba(255,255,255,0.2)" }}
      onClick={seek}
    >
      <div
        className="h-full rounded-full transition-all duration-75 relative"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(to right, #7c3aed, #db2777)",
        }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white scale-0 group-hover/progress:scale-100 transition-transform duration-150 shadow-md" />
      </div>
    </div>
  );
}

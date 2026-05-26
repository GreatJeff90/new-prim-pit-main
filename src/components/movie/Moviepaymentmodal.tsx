import { useState } from "react";
import type { Movie } from "../../context/AppContext";

interface MoviePaymentModalProps {
  show: boolean;
  movie: Movie | null;
  onClose: () => void;
  onLoginInstead: () => void;
}

/**
 * Shown when a guest (non-logged-in user) clicks Play on a movie card.
 * Calls POST /api/stripe/pay with { type: "movie", movieId }.
 * The backend creates a Stripe Checkout session and returns { paymentUrl }.
 * We redirect the browser there — Stripe collects the email and card.
 * On success Stripe redirects to /watch/:movieId?session_id=...
 */
export default function MoviePaymentModal({
  show,
  movie,
  onClose,
  onLoginInstead,
}: MoviePaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!show || !movie) return null;

  const hasPoster =
    movie.posterImage && !movie.posterImage.includes("example.com");
  const posterUrl = hasPoster
    ? movie.posterImage
    : "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop";

  const price = movie.price || 12;

  const handlePay = async () => {
    setError("");
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      // No auth token — the route accepts anonymous requests (see stripeRoutes.js)
      const response = await fetch(`${baseUrl}api/stripe/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "movie", movieId: movie._id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment initialization failed.");
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("No payment URL returned.");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(16px)", background: "rgba(0,0,0,0.75)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 480,
          height: 480,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "mpulse 3s ease-in-out infinite",
        }}
      />

      <div
        className="relative w-full max-w-[420px] rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, rgba(18,10,30,0.98) 0%, rgba(12,8,20,0.99) 100%)",
          border: "1px solid rgba(139,92,246,0.25)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(139,92,246,0.12)",
        }}
      >
        {/* Poster strip */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={posterUrl}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.5) saturate(1.2)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 15%, rgba(12,8,20,1) 100%)",
            }}
          />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-all"
            style={{
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Genre pills */}
          {movie.genre?.length > 0 && (
            <div className="absolute bottom-3 left-4 flex gap-1.5 flex-wrap">
              {movie.genre.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(139,92,246,0.2)",
                    border: "1px solid rgba(139,92,246,0.4)",
                    color: "rgba(196,167,255,0.9)",
                  }}
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-6 pb-6 -mt-1">
          {/* Title */}
          <h2
            className="text-xl font-black text-white uppercase tracking-tight leading-tight mb-1"
            style={{ fontFamily: "'Arial Black', sans-serif" }}
          >
            {movie.title}
          </h2>

          {/* Meta row */}
          <div className="flex items-center gap-2 mb-5">
            {movie.year > 0 && (
              <span className="text-[10px] text-white/40 font-bold">
                {movie.year}
              </span>
            )}
            {movie.runtime > 0 && (
              <>
                <span className="w-px h-3 bg-white/20" />
                <span className="text-[10px] text-white/40 font-bold">
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              </>
            )}
            {movie.ageRating && (
              <>
                <span className="w-px h-3 bg-white/20" />
                <span
                  className="text-[9px] font-black px-1.5 py-0.5 rounded"
                  style={{
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {movie.ageRating}
                </span>
              </>
            )}
          </div>

          {/* Price callout */}
          <div
            className="flex items-center justify-between rounded-xl px-4 py-3 mb-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(236,72,153,0.08) 100%)",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            <div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">
                One-Time Access
              </p>
              <p className="text-[11px] text-white/55 font-medium">
                No account needed · Stream immediately
              </p>
            </div>
            <span
              className="text-2xl font-black text-white"
              style={{ fontFamily: "'Arial Black', sans-serif" }}
            >
              ${price}
            </span>
          </div>

          {/* Error */}
          {error && (
            <p className="mb-3 text-[11px] text-red-400 font-medium text-center">
              {error}
            </p>
          )}

          {/* Pay CTA */}
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest text-white transition-all duration-200 mb-3"
            style={{
              background: loading
                ? "rgba(139,92,246,0.3)"
                : "linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #ef4444 100%)",
              boxShadow: loading
                ? "none"
                : "0 0 30px rgba(139,92,246,0.35), 0 4px 15px rgba(0,0,0,0.4)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Redirecting to checkout…
              </span>
            ) : (
              `Pay $${price} · Watch Now`
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
            <span className="text-[10px] text-white/25 font-bold uppercase tracking-widest">
              or
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
          </div>

          {/* Sign in instead */}
          <button
            onClick={onLoginInstead}
            className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.9)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.6)";
            }}
          >
            Sign in to your account instead
          </button>

          {/* Trust line */}
          <p className="text-center text-[9px] text-white/20 mt-4 leading-relaxed">
            Secured by Stripe · One-time charge · No subscription required
          </p>
        </div>
      </div>

      <style>{`
        @keyframes mpulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

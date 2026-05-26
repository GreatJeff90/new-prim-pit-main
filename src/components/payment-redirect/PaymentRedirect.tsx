import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApi } from "../../context/AppContext";

const PaymentRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");
  const { fetchUserProfile } = useApi();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Call profile again to get latest data
    fetchUserProfile()
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to refresh profile", err);
        setLoading(false);
      });
  }, [fetchUserProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-purple-500 border-white/20 rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold tracking-wider uppercase text-white/60">Verifying Payment...</p>
        </div>
      </div>
    );
  }

  if (plan === "premium") {
    return (
      <main className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-zinc-950 to-black flex flex-col items-center justify-center px-6 py-12">
        {/* Background radial glow */}
        <div 
          aria-hidden="true" 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none"
        />

        <section className="relative z-10 flex flex-col items-center text-center max-w-md w-full space-y-8 bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
          {/* Animated Green Checkmark */}
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-2 animate-bounce">
            <svg 
              width="36" 
              height="36" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div className="space-y-3">
            <h1 className="text-white text-3xl font-black uppercase tracking-tight font-sans">
              Upgrade Successful!
            </h1>
            <p className="text-white/60 text-xs sm:text-sm font-medium font-sans leading-relaxed">
              Thank you for subscribing! You are now a Premium member. Enjoy unlimited access to the streaming catalog and voice search features.
            </p>
          </div>

          <button
            onClick={() => navigate("/stream-movies")}
            className="w-full h-12 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:from-purple-500 hover:to-red-400 text-white text-sm font-black font-sans uppercase tracking-wider hover:shadow-[0_0_25px_rgba(236,72,153,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center"
          >
            Start Streaming
          </button>
        </section>
      </main>
    );
  }

  // Fallback for regular movie purchase success redirects
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-zinc-950 to-black flex flex-col items-center justify-center px-6 py-12">
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none"
      />

      <section className="relative z-10 flex flex-col items-center text-center max-w-md w-full space-y-8 bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-2">
          <svg 
            width="36" 
            height="36" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#10b981" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div className="space-y-3">
          <h1 className="text-white text-3xl font-black uppercase tracking-tight font-sans">
            Payment Successful
          </h1>
          <p className="text-white/60 text-xs sm:text-sm font-medium font-sans leading-relaxed">
            Your payment was processed successfully. You can now access your purchased content.
          </p>
        </div>

        <button
          onClick={() => navigate("/stream-movies")}
          className="w-full h-12 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 text-white text-sm font-bold font-sans uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center"
        >
          Back to Movies
        </button>
      </section>
    </main>
  );
};

export default PaymentRedirect;

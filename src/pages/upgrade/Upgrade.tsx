import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import logoIcon from "../../assets/F.png";

export default function Upgrade() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please sign in to access the upgrade page.");
      navigate("/login");
    }
  }, [navigate]);

  const handleActivate = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please sign in to subscribe.");
      navigate("/login");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Connecting to secure Stripe gateway...");

    try {
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL ||
        "https://prime-pit-backend-production-1236.up.railway.app/";
      const response = await axios.post(
        `${apiBaseUrl}api/stripe/subscribe/premium`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data?.paymentUrl) {
        toast.success("Redirecting to checkout...", { id: toastId });
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error("Failed to start checkout. Please try again.", {
          id: toastId,
        });
      }
    } catch (error: any) {
      console.error("Subscription payment initiation failed:", error);
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to initiate premium upgrade.";
      toast.error(errMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-zinc-950 to-black flex flex-col items-center justify-center px-6 py-12">
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-500/20 blur-[130px] sm:blur-[180px] pointer-events-none"
      />

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/50 hover:text-white transition-all text-xs uppercase tracking-wider font-semibold cursor-pointer z-10"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back
      </button>

      {/* Main Container */}
      <section className="relative z-10 flex flex-col items-center text-center max-w-lg w-full space-y-12">
        {/* Top Header Group */}
        <div className="space-y-4">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black font-['Poppins'] tracking-tight leading-tight select-none">
            Welcome to your streaming profile
          </h1>
          <p className="text-white/40 text-xs sm:text-sm font-semibold font-['Archivo'] uppercase tracking-widest leading-relaxed">
            Choose or create user's gaming profile
          </p>
        </div>

        {/* Pricing circle Card container */}
        <div className="flex flex-col items-center space-y-6 w-full max-w-sm">
          <div className="space-y-1">
            <span className="text-white/80 text-sm sm:text-base font-medium font-['Poppins'] uppercase tracking-wider">
              Monthly Activation fee
            </span>
          </div>

          {/* Glowing Circular price container */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05),_inset_0_0_20px_rgba(255,255,255,0.05)] transition-transform duration-500 hover:scale-105">
            {/* Ambient glow inside the circle */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10" />

            <span className="text-white text-4xl sm:text-5xl font-black font-['Poppins'] tracking-tight relative z-10">
              $5
            </span>
          </div>
        </div>

        {/* Activation trigger button */}
        <div className="w-full max-w-xs space-y-4">
          <button
            onClick={handleActivate}
            disabled={loading}
            className="w-full h-12 rounded-lg border border-emerald-500 bg-transparent text-emerald-400 text-sm sm:text-base font-black font-['Archivo'] uppercase tracking-wider hover:bg-emerald-500 hover:text-black hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center"
          >
            {loading ? "Processing..." : "Activate"}
          </button>
        </div>

        {/* Footer Brand integration */}
        <div className="flex flex-col items-center space-y-2 pt-6">
          {/* Logo brand styling */}
          <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity select-none">
            <span className="text-white font-black uppercase text-base tracking-widest font-sans">
              Flixora
            </span>
          </div>
          <span className="text-white/40 text-[10px] font-semibold font-['Archivo'] uppercase tracking-wider">
            Powered by Klouto
          </span>
        </div>

        {/* Consent legal guidelines */}
        <p className="text-white/30 text-[9px] sm:text-[10px] leading-relaxed max-w-xs font-medium font-['Poppins'] pt-4 select-none">
          By using our streaming site, you also consent to our user guidelines.
          All rights reserved 2024.
        </p>
      </section>
    </main>
  );
}

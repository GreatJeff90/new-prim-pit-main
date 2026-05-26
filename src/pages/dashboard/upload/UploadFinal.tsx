import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import logoIcon from "../../../assets/F.png";
import { useApi } from "../../../context/AppContext";

const UploadFinal: React.FC = () => {
  const navigate = useNavigate();

  const { movieMetadata, publishCompleteMovie } = useApi();

  const [countries, setCountries] = useState("");
  const [interests, setInterests] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [published, setPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async () => {
    if (!accepted || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await publishCompleteMovie(countries, interests);
      setPublished(true);
      setTimeout(() => navigate("/dashboard"), 1800);
    } catch {
      // Errors are already toasted inside publishCompleteMovie — nothing extra needed.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 md:p-10 min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#0d0d15] via-[#12121f] to-[#0d0d15] font-[Poppins] text-white select-none">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-8 md:mb-10">
        <img
          src={logoIcon}
          onClick={() => navigate("/dashboard")}
          alt="Logo"
          className="h-8 w-8 object-contain opacity-80 cursor-pointer"
        />
        <Link
          to="/upload-details"
          className="text-[#10b981] hover:text-[#059669] font-bold text-base md:text-lg tracking-wide transition-colors cursor-pointer"
        >
          Back
        </Link>
      </div>

      {/* Success overlay */}
      {published && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 text-center px-8">
            <div className="w-16 h-16 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center">
              <span className="text-[#10b981] text-2xl font-bold">✓</span>
            </div>
            <p className="text-white font-bold text-xl tracking-wide">
              Movie published successfully!
            </p>
            <p className="text-white/50 text-sm">Redirecting to dashboard…</p>
          </div>
        </div>
      )}

      {/* Uploading overlay — driven by the toast inside publishCompleteMovie,
          but we also show a full-screen spinner so the user can't interact */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="flex flex-col items-center gap-5 text-center px-6 max-w-sm">
            <div className="w-12 h-12 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin" />
            <p className="text-white font-semibold text-lg tracking-wide">
              Processing Upload Pipeline
            </p>
            <p className="text-white/40 text-xs leading-relaxed mt-1">
              Please keep this window open. Large files may take several
              minutes.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 w-full max-w-5xl mx-auto py-2 relative">
        {/* Vertical dashed divider */}
        <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-px border-l border-dashed border-white/15 pointer-events-none -translate-x-1/2" />

        {/* Left: Countries & Interests */}
        <div className="lg:col-span-6 flex flex-col gap-10 z-10 lg:pr-4">
          <div className="flex flex-col gap-3">
            <h2 className="text-white font-bold text-lg md:text-xl tracking-wide">
              Country (s) of viewing
            </h2>
            <label className="text-white/60 text-xs tracking-wide">
              Enter countries you want your movie to be seen in
            </label>
            <input
              type="text"
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
              placeholder="e.g. United States, United Kingdom, Nigeria"
              className="w-full bg-[#353540] text-white px-5 py-3.5 rounded border border-white/5 focus:outline-none focus:border-[#10b981] shadow-inner transition-colors hover:bg-[#3a3a45] font-semibold placeholder:text-white/20"
            />
            <span className="text-white/35 text-xs pl-1">
              separate with a comma
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-white font-bold text-lg md:text-xl tracking-wide">
              Interest of viewers
            </h2>
            <label className="text-white/60 text-xs tracking-wide">
              Enter the interests of viewers you want to see your movie
            </label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. Sci-Fi, Action, Indie Drama"
              className="w-full bg-[#353540] text-white px-5 py-3.5 rounded border border-white/5 focus:outline-none focus:border-[#10b981] shadow-inner transition-colors hover:bg-[#3a3a45] font-semibold placeholder:text-white/20"
            />
            <span className="text-white/35 text-xs pl-1">
              separate with a comma
            </span>
          </div>
        </div>

        {/* Right: Estimates */}
        <div className="lg:col-span-6 flex flex-col gap-6 z-10 lg:pl-4">
          <h2 className="text-white font-bold text-lg md:text-xl tracking-wide">
            Based on your selection
          </h2>

          {[
            { label: "Estimated number of impressions", value: "1 Million" },
            { label: "Estimated number of viewers", value: "200,000" },
            {
              label: "Estimated revenue",
              value: movieMetadata?.price
                ? `$${(200000 * parseFloat(movieMetadata.price)).toLocaleString()}`
                : "$0",
            },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <h3 className="text-white/70 font-semibold text-sm tracking-wide">
                {label}
              </h3>
              <p className="text-white font-black text-2xl md:text-3xl tracking-wider">
                {value}
              </p>
            </div>
          ))}

          <p className="text-white/50 text-xs leading-relaxed mt-2 max-w-md">
            Please note we can only guarantee 10% of the estimated revenue, as
            more revenue depends on your personal promotion rate.
          </p>
        </div>

        {/* Bottom: Terms + Publish */}
        <div className="lg:col-span-12 flex flex-col gap-6 mt-4 pt-6 border-t border-white/10 z-10">
          <div
            onClick={() => setAccepted(!accepted)}
            className="flex items-center gap-3 cursor-pointer w-fit group select-none"
          >
            <div
              className={`w-5 h-5 border flex items-center justify-center transition-colors shrink-0 ${
                accepted
                  ? "bg-[#10b981] border-[#10b981]"
                  : "border-white/40 group-hover:border-white"
              }`}
            >
              {accepted && (
                <span className="text-white text-xs font-bold">✓</span>
              )}
            </div>
            <span className="text-white font-bold text-base tracking-wide">
              I accept these terms
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <p className="text-white/70 font-semibold text-sm tracking-wide max-w-md leading-relaxed">
              Once total revenue hits $100,000+ we shall claim 10% during
              withdrawal.
            </p>

            <div className="flex items-center gap-8 ml-auto">
              <Link
                to="/upload-details"
                className="text-white font-bold text-base hover:text-white/60 transition-colors tracking-wider"
              >
                Back
              </Link>

              <button
                type="button"
                onClick={handlePublish}
                disabled={!accepted || isSubmitting}
                className={`bg-[#353540] text-white font-bold text-base px-12 py-3.5 rounded-xl shadow-xl tracking-wider border transition-all duration-200 ${
                  accepted && !isSubmitting
                    ? "hover:bg-[#3f3f4d] hover:border-[#10b981] hover:scale-105 active:scale-95 cursor-pointer border-white/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                    : "opacity-40 cursor-not-allowed border-white/5"
                }`}
              >
                {isSubmitting ? "UPLOADING…" : "PUBLISH"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFinal;

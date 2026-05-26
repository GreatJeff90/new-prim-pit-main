import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

function Dashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isUnderReview = localStorage.getItem("isVerified") === "false";

  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem("dashboard_audio_cleanup");

    if (!hasRefreshed) {
      sessionStorage.setItem("dashboard_audio_cleanup", "true");
      window.location.reload();
    }
    return () => {
      sessionStorage.removeItem("dashboard_audio_cleanup");
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col p-6 md:p-12 min-h-[calc(100vh-80px)] relative bg-gradient-to-b from-[#0d0d15] via-[#12121f] to-[#0d0d15]">
      {/* Top Action Row */}
      <div className="w-full flex justify-between items-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-2 sm:px-0">
        {/* Hamburger Menu - Mobile Only */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-[#10b981] hover:text-[#059669] transition-colors p-2 -ml-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <HiX className="w-6 h-6" />
          ) : (
            <HiMenu className="w-6 h-6" />
          )}
        </button>

        {/* Desktop Menu */}
        {/*disabled if account is under review*/}

        <div className="hidden md:block ml-auto">
          {isUnderReview ? (
            <span
              className="text-[#10b981]/30 font-bold text-sm sm:text-base md:text-lg tracking-wide cursor-not-allowed select-none"
              title="Your account is under review"
            >
              Create upload
            </span>
          ) : (
            <NavLink
              to="/upload"
              className="text-[#10b981] hover:text-[#059669] font-bold text-sm sm:text-base md:text-lg tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Create upload
            </NavLink>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 md:hidden z-40">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeMobileMenu}
          />
          {/* Mobile Menu Panel */}
          <div className="absolute top-0 right-0 h-screen w-64 bg-[#12121f] border-l border-white/10 shadow-2xl z-50 pt-6 px-6 animate-slide-in-right">
            <div className="flex flex-col gap-6">
              {isUnderReview ? (
                <span
                  className="text-[#10b981]/30 font-bold text-base tracking-wide cursor-not-allowed select-none py-3 px-4"
                  title="Your account is under review"
                >
                  Create upload
                </span>
              ) : (
                <Link
                  to="/upload"
                  onClick={closeMobileMenu}
                  className="text-[#10b981] hover:text-[#059669] font-bold text-base tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer py-3 px-4 rounded-lg hover:bg-white/5"
                >
                  Create upload
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Centered Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 text-center my-auto gap-6 md:gap-8 py-12">
        <h2 className="text-white font-semibold text-xl md:text-2xl lg:text-[28px] leading-relaxed md:leading-[1.4] tracking-wide max-w-2xl drop-shadow-md animate-fade-in">
          Once approved, you will have access and can proceed to posting your
          contents
        </h2>

        <p className="text-white/90 font-semibold text-lg md:text-xl lg:text-[22px] tracking-wide drop-shadow-md animate-fade-in animation-delay-200">
          Approval takes 24 - 48 hours
        </p>
      </div>

      {/* Blueish glow effect on the right */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] pointer-events-none" />
    </div>
  );
}

export default Dashboard;

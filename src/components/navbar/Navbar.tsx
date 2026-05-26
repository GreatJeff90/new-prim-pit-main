import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import LoginModal from "./../login/LoginModal";
import SignupModal from "../signup/SignUpModal";
import ForgotPasswordModal from "../login/ForgotPasswordModal";
import ResetPasswordModal from "../login/ResetPasswordModal";
import { FaBars, FaTimes } from "react-icons/fa";
import defaultProfileIcon from "../../assets/profileimg.png";
import { useApi } from "../../context/AppContext";

const Navbar = () => {
  const { setIsAuthFlowActive, getProfilePicture, logout } = useApi();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true",
  );
  const [profileImage, setProfileImage] = useState<string>(defaultProfileIcon);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(
    () => localStorage.getItem("isSubscribed") === "true",
  );

  useEffect(() => {
    setIsAuthFlowActive(
      showLoginModal || showSignupModal || showForgotModal || showResetModal,
    );
  }, [
    showLoginModal,
    showSignupModal,
    showForgotModal,
    showResetModal,
    setIsAuthFlowActive,
  ]);

  useEffect(() => {
    const sync = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setIsSubscribed(localStorage.getItem("isSubscribed") === "true");
    };
    window.addEventListener("storage", sync);
    const interval = setInterval(sync, 1000);
    sync();
    return () => {
      window.removeEventListener("storage", sync);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const loadProfilePic = async () => {
        try {
          const pic = await getProfilePicture();
          if (pic) setProfileImage(pic);
        } catch (err) {
          console.error("Failed to load profile pic in navbar", err);
        }
      };
      loadProfilePic();
    }
  }, [isLoggedIn, getProfilePicture]);

  useEffect(() => {
    if (
      showLoginModal ||
      showSignupModal ||
      showForgotModal ||
      showResetModal ||
      isMenuOpen
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [
    showLoginModal,
    showSignupModal,
    showForgotModal,
    showResetModal,
    isMenuOpen,
  ]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogoutClick = async () => {
    setIsLoggedIn(false);
    await logout();
    setIsMenuOpen(false);
  };

  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    setShowForgotModal(false);
    setShowResetModal(false);
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    closeAllModals();
  };

  // Reusable locked item shown in both desktop and mobile dropdowns
  const LockedItem = ({
    label,
    icon,
  }: {
    label: string;
    icon: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between p-2.5 rounded-xl opacity-40 cursor-not-allowed select-none">
      <div className="flex items-center gap-3">
        <span className="w-5 h-5 text-white/40">{icon}</span>
        <span className="text-white/60 font-medium text-sm">{label}</span>
      </div>
      <span
        className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full leading-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(219,39,119,0.4))",
          border: "1px solid rgba(139,92,246,0.4)",
          color: "rgba(196,167,255,0.8)",
        }}
      >
        Premium
      </span>
    </div>
  );

  const ProfileIcon = (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );

  const ClockIcon = (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const SignOutIcon = (
    <svg
      className="w-5 h-5 text-red-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l-4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );

  // Shared dropdown body used by both desktop and mobile
  const DropdownContent = () => (
    <>
      {/* User info header */}
      <div className="px-3 py-2 border-b border-white/10 mb-1">
        <p className="text-white font-bold text-sm truncate">
          {sessionStorage.getItem("fullname") || "User Profile"}
        </p>
        <p className="text-white/60 text-xs truncate">
          {sessionStorage.getItem("email") || ""}
        </p>
        {!isSubscribed && (
          <span
            className="inline-block mt-1.5 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Basic Plan
          </span>
        )}
        {isSubscribed && (
          <span
            className="inline-block mt-1.5 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(219,39,119,0.3))",
              border: "1px solid rgba(139,92,246,0.4)",
              color: "rgba(196,167,255,0.9)",
            }}
          >
            ✦ Premium
          </span>
        )}
      </div>

      {/* View Profile */}
      {isSubscribed ? (
        <Link
          to="/profile"
          onClick={() => setIsProfileDropdownOpen(false)}
          className="flex items-center gap-3 text-white hover:bg-white/10 p-2.5 rounded-xl transition-colors font-medium text-sm"
        >
          <span className="w-5 h-5 text-emerald-400">{ProfileIcon}</span>
          View Profile
        </Link>
      ) : (
        <LockedItem
          label="View Profile"
          icon={<span className="text-white/40">{ProfileIcon}</span>}
        />
      )}

      {/* Recently Watched */}
      {isSubscribed ? (
        <Link
          to="/dashboard/recently-watched"
          onClick={() => setIsProfileDropdownOpen(false)}
          className="flex items-center gap-3 text-white hover:bg-white/10 p-2.5 rounded-xl transition-colors font-medium text-sm"
        >
          <span className="w-5 h-5 text-emerald-400">{ClockIcon}</span>
          Recently Watched
        </Link>
      ) : (
        <LockedItem
          label="Recently Watched"
          icon={<span className="text-white/40">{ClockIcon}</span>}
        />
      )}

      {/* Sign Out */}
      <button
        onClick={() => {
          setIsProfileDropdownOpen(false);
          handleLogoutClick();
        }}
        className="w-full text-left flex items-center gap-3 text-red-400 hover:bg-red-500/10 p-2.5 rounded-xl transition-colors font-medium text-sm mt-1 cursor-pointer"
      >
        {SignOutIcon}
        Sign Out
      </button>
    </>
  );

  return (
    <>
      <nav
        className="border-b border-white border-opacity-10 flex items-center justify-between p-4 absolute w-full top-0 z-30"
        style={{
          backdropFilter: "blur(36px)",
          WebkitBackdropFilter: "blur(36px)",
          background: `linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.2) 100%)`,
          boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
        }}
      >
        {/* Logo – centred */}
        <div className="absolute left-1/2 transform -translate-x-1/2 z-30">
          <h1>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <img
                src={logo}
                alt="Logo"
                className="h-12 md:h-14"
                style={{ filter: "drop-shadow(0 0 8px rgba(0,0,0,0.5))" }}
              />
            </Link>
          </h1>
        </div>

        {/* Desktop – right side */}
        <div className="hidden md:flex items-center ml-auto relative">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full border border-white/20 transition-all shadow-lg cursor-pointer group focus:outline-none"
              >
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-white/40 group-hover:scale-105 transition-transform"
                />
                <span className="text-white font-medium text-sm tracking-wide">
                  {sessionStorage.getItem("fullname") || "User Profile"}
                </span>
                <svg
                  className={`w-4 h-4 text-white/80 transition-transform duration-200 ${isProfileDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-[#1a1a26] border border-white/20 rounded-2xl shadow-2xl py-2 px-2 z-50 animate-fade-in backdrop-blur-xl">
                  <DropdownContent />
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                className="bg-white bg-opacity-10 border border-white border-opacity-30 text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-20 transition-all duration-300 shadow-lg"
                onClick={() => setShowSignupModal(true)}
              >
                SIGN UP
              </button>
              <button
                className="bg-white bg-opacity-10 border border-white border-opacity-30 text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-20 transition-all duration-300 shadow-lg"
                onClick={() => setShowLoginModal(true)}
              >
                LOG IN
              </button>
            </div>
          )}
        </div>

        {/* Mobile – right side */}
        <div className="md:hidden z-40 ml-auto relative">
          {isLoggedIn ? (
            <div>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/40 shadow-lg active:scale-95 transition-transform"
                />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-[#1a1a26] border border-white/20 rounded-2xl shadow-2xl py-2 px-2 z-50 animate-fade-in backdrop-blur-xl">
                  <DropdownContent />
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          )}
        </div>

        {/* Mobile menu overlay (logged-out only) */}
        {!isLoggedIn && isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 z-20"
            onClick={toggleMenu}
          />
        )}

        {/* Mobile menu panel (logged-out only) */}
        {!isLoggedIn && (
          <div
            className={`fixed top-0 right-0 h-full w-64 bg-gray-900 bg-opacity-90 backdrop-blur-lg z-30 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full invisible"}`}
            style={{
              visibility: isMenuOpen ? "visible" : "hidden",
              transition: "transform 0.3s ease-in-out, visibility 0.3s",
            }}
          >
            <div className="flex flex-col h-full p-6 pt-20">
              <button
                className="bg-white bg-opacity-10 border border-white border-opacity-30 text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-20 transition-all duration-300 shadow-lg mb-4"
                onClick={() => {
                  setShowSignupModal(true);
                  setIsMenuOpen(false);
                }}
              >
                SIGN UP
              </button>
              <button
                className="bg-white bg-opacity-10 border border-white border-opacity-30 text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-20 transition-all duration-300 shadow-lg"
                onClick={() => {
                  setShowLoginModal(true);
                  setIsMenuOpen(false);
                }}
              >
                LOG IN
              </button>
            </div>
          </div>
        )}
      </nav>

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
    </>
  );
};

export default Navbar;

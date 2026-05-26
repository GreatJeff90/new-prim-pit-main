import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/F.png";
import notificationIcon from "../../assets/bell.png";
import messageIcon from "../../assets/Dm.png";
import defaultProfileIcon from "../../assets/profileimg.png";
import homeIcon from "../../assets/home.png";
import icon2 from "../../assets/Icon2.png";
import icon3 from "../../assets/icon3.png";
import icon4 from "../../assets/icon4.png";
import icon5 from "../../assets/icon5.png";
import { useApi } from "../../context/AppContext";

const Sidebar = () => {
  const { getProfilePicture, logout, getNotifications } = useApi();
  const [profileImage, setProfileImage] = useState<string>(defaultProfileIcon);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const isUnderReview = localStorage.getItem("isVerified") === "false";

  const location = useLocation();
  const currentPath = location.pathname;

  const hideIconsPaths = [
    "/dashboard/friends",
    "/dashboard/message",
    "/dashboard/withdraw",
    "/dashboard/withdraw/",
    "/dashboard/recently-watched",
  ];

  useEffect(() => {
    const loadProfilePicture = async () => {
      try {
        const imageUrl = await getProfilePicture();
        if (imageUrl) {
          setProfileImage(imageUrl);
        }
      } catch (err) {
        console.error("Error loading profile picture", err);
      }
    };

    const loadNotifications = async () => {
      try {
        const notifications = await getNotifications();
        setUnreadCount(notifications.totalUnread);
      } catch (err) {
        console.error("Error loading notifications", err);
      }
    };

    loadProfilePicture();
    if (!isUnderReview) {
      loadNotifications();
    }
    // Set up interval to periodically check for new notifications
    const intervalId = setInterval(loadNotifications, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [getProfilePicture, getNotifications, isUnderReview]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const isEarnings =
    currentPath === "/dashboard/earnings" ||
    currentPath === "/dashboard/earnings/";
  const isWithdraw =
    currentPath === "/dashboard/withdraw" ||
    currentPath === "/dashboard/withdraw/";
  const isUpload =
    currentPath === "/dashboard/upload" || currentPath === "/dashboard/upload/";
  const isUploadDetails =
    currentPath === "/dashboard/upload-details" ||
    currentPath === "/dashboard/upload-details/";
  const isUploadFinal =
    currentPath === "/dashboard/upload-final" ||
    currentPath === "/dashboard/upload-final/";
  const isSettings =
    currentPath === "/dashboard/profile-dashboard" ||
    currentPath === "/dashboard/profile-dashboard/";
  const isHome = currentPath === "/dashboard" || currentPath === "/dashboard/";
  const isRecentlyWatched =
    currentPath === "/dashboard/recently-watched" ||
    currentPath === "/dashboard/recently-watched/";

  const NavLink = ({
    to,
    isActive,
    children,
  }: {
    to: string;
    isActive?: boolean;
    children: React.ReactNode;
  }) => {
    const baseClass =
      "text-xs md:text-sm lg:text-base font-semibold transition-colors cursor-pointer";
    if (isUnderReview) {
      return (
        <span
          className={`${baseClass} text-white/30 cursor-not-allowed select-none`}
          title="Your account is under review"
        >
          {children}
        </span>
      );
    }
    return (
      <Link
        to={to}
        className={`${baseClass} ${isActive ? "text-white font-bold" : "text-white/70 hover:text-white"}`}
      >
        {children}
      </Link>
    );
  };

  return (
    <div className="flex font-[Poppins]">
      {/* Sidebar */}
      <aside className="w-[80px] md:w-[90px] bg-[#12121a] flex flex-col items-center py-6 text-white fixed left-0 top-0 bottom-0 z-30 border-r border-white/5 shadow-2xl">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 md:w-12 md:h-12 object-contain cursor-pointer mb-10 hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <div className="mt-auto mb-6">
          <button
            onClick={handleLogout}
            className="text-[#ff3b30] font-bold text-xs md:text-sm tracking-wide hover:opacity-80 transition-opacity cursor-pointer whitespace-nowrap"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main Area Header */}
      <div className="flex-1 pl-[80px] md:pl-[90px] w-full">
        {/* Top Navbar */}
        <nav className="w-full h-20 flex items-center justify-between px-6 md:px-12 text-white fixed top-0 left-[80px] md:left-[90px] right-0 z-20 bg-[#0d0d15]/90 backdrop-blur-md border-b border-white/5">
          {!hideIconsPaths.includes(currentPath) ? (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full gap-2 lg:gap-0">
              {/* Left Title / Center Alert (Only on Home Dashboard) */}

              {!isEarnings && !isSettings ? (
                <>
                  <div className="flex items-center">
                    <h2 className="text-white font-semibold text-base md:text-lg lg:text-xl tracking-wide">
                      All Uploads
                    </h2>
                  </div>

                  <div className="flex items-center justify-center">
                    <span className="text-[#ff3b30] font-bold text-xs md:text-sm lg:text-base tracking-wide animate-pulse">
                      Your account is under review!
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex-1" /> /* Spacer to push right nav to the right on earnings and settings pages */
              )}

              {/* Right Navigation & Icons */}
              <div className="flex items-center gap-4 md:gap-6 overflow-x-auto py-1">
                <NavLink to="/dashboard" isActive={isHome}>
                  Home
                </NavLink>
                <NavLink to="/dashboard/earnings" isActive={isEarnings}>
                  Earnings
                </NavLink>
                <NavLink to="/upload">Uploads</NavLink>
                <NavLink
                  to="/dashboard/profile-dashboard"
                  isActive={isSettings}
                >
                  Settings
                </NavLink>

                {/* Notification Bell */}
                {isUnderReview ? (
                  <span className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#1e1e2a] border border-white/10 opacity-30 cursor-not-allowed shrink-0">
                    <img
                      src={notificationIcon}
                      alt="Notification"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                  </span>
                ) : (
                  <Link
                    to="/dashboard/notifications"
                    className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#1e1e2a] hover:bg-[#2a2a38] transition-colors cursor-pointer shrink-0 border border-white/10"
                  >
                    <img
                      src={notificationIcon}
                      alt="Notification"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#ff3b30] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-lg">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Profile Avatar */}
                {isUnderReview ? (
                  <span className="relative shrink-0 opacity-30 cursor-not-allowed">
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-white/20 shadow-md"
                    />
                  </span>
                ) : (
                  <Link
                    to="/dashboard/profile-dashboard"
                    className="relative shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200"
                  >
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-white/20 shadow-md"
                    />
                  </Link>
                )}
              </div>
            </div>
          ) : isUploadFinal ? (
            <div className="flex items-center justify-between w-full">
              <div />
              <Link
                to="/upload-details"
                className="text-white font-bold text-base md:text-lg hover:text-white/80 transition-colors cursor-pointer tracking-wider"
              >
                Back
              </Link>
            </div>
          ) : isUploadDetails ? (
            <div className="flex items-center justify-between w-full">
              <div />
              <div className="flex items-center gap-8">
                <Link
                  to="/upload"
                  className="text-white font-bold text-base md:text-lg hover:text-white/80 transition-colors cursor-pointer tracking-wider"
                >
                  Back
                </Link>
                <Link
                  to="/upload-final"
                  className="text-white font-bold text-base md:text-lg hover:text-white/80 transition-colors cursor-pointer tracking-wider"
                >
                  Next
                </Link>
              </div>
            </div>
          ) : isUpload ? (
            <div className="flex items-center justify-between w-full">
              <div />
              <Link
                to="/upload-details"
                className="text-white font-bold text-base md:text-lg hover:text-white/80 transition-colors cursor-pointer tracking-wider"
              >
                Next
              </Link>
            </div>
          ) : isWithdraw ? (
            <div className="flex items-center justify-between w-full">
              <div />
              <Link
                to="/dashboard/earnings"
                className="text-white/60 hover:text-white text-sm font-medium transition-colors cursor-pointer"
              >
                Back to Earnings
              </Link>
            </div>
          ) : isRecentlyWatched ? (
            <div className="flex items-center justify-around w-full">
              {/* Left: page title */}
              <h2 className="text-white font-semibold text-base md:text-lg lg:text-xl tracking-wide">
                Recently Played
              </h2>

              {/* Center: streaming time */}
              <span className="text-white/50 text-[11px] font-black tracking-widest uppercase">
                Streaming time: 30 days
              </span>

              {/* Right: Home + Bell */}
              <div className="flex items-center gap-2 sm:gap-x-56">
                <Link
                  to="/dashboard"
                  className="text-white font-bold text-sm md:text-base tracking-wide hover:text-[#10b981] transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/dashboard/notifications"
                  className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#1e1e2a] hover:bg-[#2a2a38] transition-colors border border-white/10"
                >
                  <img
                    src={notificationIcon}
                    alt="Notification"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#ff3b30] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-lg">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          ) : (
            /* Fallback/minimal navbar for hidden icon paths */
            <div className="flex items-center justify-between w-full">
              <h2 className="text-white/80 font-semibold text-lg tracking-wide">
                Dashboard
              </h2>
              <Link
                to="/dashboard"
                className="text-white/60 hover:text-white text-sm font-medium transition-colors cursor-pointer"
              >
                Back to Home
              </Link>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

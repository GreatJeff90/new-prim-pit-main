import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../context/AppContext";
import PrimepitLogo from "../../assets/F.png";
import AdminAvatar from "../../assets/profileimg.png";
import AddProfileImg from "../../assets/add-profile.png";
import { toast } from "react-hot-toast";
import { Camera } from "lucide-react";

const ProfileLocked: React.FC = () => {
  const [showOnlyAddProfile, setShowOnlyAddProfile] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [profileName, setProfileName] = useState(
    () => sessionStorage.getItem("fullname") || "User",
  );
  const [profilePic, setProfilePic] = useState("");
  const navigate = useNavigate();
  const {
    initializeSubscriptionCard,
    userProfile,
    fetchUserProfile,
    fetchUserProfileDetails,
    getProfilePicture,
    uploadProfilePicture,
  } = useApi();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPic, setIsUploadingPic] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPic(true);
      const uploadedUrl = await uploadProfilePicture(file);
      if (uploadedUrl) {
        setProfilePic(uploadedUrl);
        toast.success("Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setIsUploadingPic(false);
    }
  };

  useEffect(() => {
    // Check localStorage for subscription status on component mount
    const checkSubscription = async () => {
      const storedSubscription = localStorage.getItem("isSubscribed");
      if (storedSubscription === "true") {
        setIsSubscribed(true);
        // If we have a userProfile, use that, otherwise fetch it
        if (!userProfile?.isSubscribed) {
          try {
            await fetchUserProfile();
          } catch (err) {
            console.warn(
              "Failed to fetch user profile in checkSubscription:",
              err,
            );
          }
        }
      }
    };

    checkSubscription();
  }, [fetchUserProfile, userProfile]);

  useEffect(() => {
    // Check userProfile for subscription status when it changes
    if (userProfile?.isSubscribed) {
      setIsSubscribed(true);
      localStorage.setItem("isSubscribed", "true");
    }
  }, [userProfile]);

  useEffect(() => {
    const loadProfileDetails = async () => {
      try {
        const details = await fetchUserProfileDetails();
        if (details) {
          setProfileName(
            details.username ||
              details.fullname ||
              sessionStorage.getItem("fullname") ||
              "User",
          );
        }
      } catch (error) {
        console.error("Failed to load user details on profile-locked:", error);
      }
    };

    const loadProfilePic = async () => {
      try {
        const pic = await getProfilePicture();
        if (pic) {
          setProfilePic(pic);
        }
      } catch (error) {
        console.error(
          "Failed to load profile picture on profile-locked:",
          error,
        );
      }
    };

    loadProfileDetails();
    loadProfilePic();
  }, [fetchUserProfileDetails, getProfilePicture]);

  const handleAddProfile = () => {
    setShowOnlyAddProfile(true);
  };

  const handleAdminProfile = () => {
    if (isSubscribed || userProfile?.isSubscribed) {
      navigate("/profile");
    } else {
      toast.error("Please subscribe to access your profile");
    }
  };

  const handleSubscribe = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      setIsSubscribing(true);

      const email = userProfile?.email || sessionStorage.getItem("email") || "";

      const { paymentUrl } = await initializeSubscriptionCard(email);

      // Redirect to Paystack payment URL
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to initialize subscription");
    } finally {
      setIsSubscribing(false);
    }
  };

  // If user is subscribed, show the profiles immediately
  if (isSubscribed || userProfile?.isSubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-[#0F3FFF] flex flex-col items-center justify-between text-white px-4 font-[Poppins] relative overflow-hidden">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        {isUploadingPic && (
          <div className="fixed top-4 right-4 z-50 bg-black/80 text-white px-4 py-2 rounded border border-white/20 text-xs">
            Uploading...
          </div>
        )}
        <h1 className="text-[30px] font-medium text-center mt-[120px] mb-10 z-0">
          Choose or create user's streaming profile
        </h1>

        <div className="w-full flex justify-center mb-[250px] z-0">
          {showOnlyAddProfile ? (
            <div className="flex flex-col sm:flex-row gap-16 items-center">
              <div
                className="flex flex-col items-center cursor-pointer hover:scale-105 transition"
                onClick={() => alert("Continue to profile setup")}
              >
                <div className="w-24 h-24 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center">
                  <img
                    src={AddProfileImg}
                    alt="Add Profile"
                    className="w-10 h-10"
                  />
                </div>
                <p className="mt-2 text-sm">New Profile</p>
              </div>

              <div
                className="flex flex-col items-center cursor-pointer hover:scale-105 transition"
                onClick={handleAdminProfile}
              >
                <p className="text-xs text-white mb-3">Admin profile</p>
                <img
                  src={profilePic || AdminAvatar}
                  alt="Admin Avatar"
                  className="w-24 h-24 rounded-full border border-white/30 object-cover"
                />
                <p className="mt-2 text-sm">{profileName || "Adam"}</p>
                <div
                  className="mt-2 flex items-center justify-center bg-white/10 hover:bg-white/20 p-1.5 rounded-full cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  title="Update profile picture"
                >
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-16">
              <div
                className="sm:absolute sm:left-12 flex flex-col items-center cursor-pointer hover:scale-105 transition"
                onClick={handleAddProfile}
              >
                <div className="w-24 h-24 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center">
                  <img
                    src={AddProfileImg}
                    alt="Add Profile"
                    className="w-10 h-10"
                  />
                </div>
                <p className="mt-2 text-sm">Add profile</p>
              </div>

              <div
                className="flex flex-col items-center cursor-pointer hover:scale-105 transition"
                onClick={handleAdminProfile}
              >
                <p className="text-xs text-white mb-3">Admin profile</p>
                <img
                  src={profilePic || AdminAvatar}
                  alt="Admin Avatar"
                  className="w-24 h-24 rounded-full border border-white/30 object-cover"
                />
                <p className="mt-2 text-sm">{profileName || "Adam"}</p>
                <div
                  className="mt-2 flex items-center justify-center bg-white/10 hover:bg-white/20 p-1.5 rounded-full cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  title="Update profile picture"
                >
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          )}
        </div>

        <h2 className="text-[30px] font-semibold mb-4">Flixora</h2>
        <div className="text-center mb-4 z-0">
          <img
            src={PrimepitLogo}
            alt="Primepit Logo"
            className="w-[58px] h-[72px] opacity-70 mx-auto mb-2"
          />
          <p className="text-[15px] font-semibold text-white mt-4">
            Powered by Klouto
          </p>
        </div>

        <p className="text-[10px] text-white/30 text-center max-w-sm mt-6 mb-6 z-0">
          By using our streaming site, you consent to our user guideline.
          <span className="block mt-3">All rights reserved &copy;2025</span>
        </p>
      </div>
    );
  }

  // If user is not subscribed, show the subscription modal
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0F3FFF] flex flex-col items-center justify-between text-white px-4 font-[Poppins] relative overflow-hidden">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {isUploadingPic && (
        <div className="fixed top-4 right-4 z-50 bg-black/80 text-white px-4 py-2 rounded border border-white/20 text-xs">
          Uploading...
        </div>
      )}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="absolute inset-0 bg-[#000000bb] backdrop-blur-[12px]" />

        <div className="relative z-10 w-full max-w-[400px] bg-zinc-950/85 border border-white/10 rounded-3xl p-8 text-center shadow-2xl flex flex-col items-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <span className="text-2xl">👑</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl text-white font-black uppercase tracking-tight font-sans">
              Choose Your Plan
            </h2>
            <p className="text-white/60 text-xs sm:text-sm font-medium font-sans leading-relaxed">
              Get full access to streaming profiles with Premium, or continue to
              movies with Pay As You Go.
            </p>
          </div>

          <div className="w-full flex flex-col gap-3">
            <button
              onClick={() => navigate("/upgrade")}
              className="w-full h-12 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:from-purple-500 hover:to-red-400 text-white text-sm font-black font-sans uppercase tracking-wider hover:shadow-[0_0_25px_rgba(236,72,153,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              Upgrade to Premium
            </button>
            <button
              onClick={() => navigate("/stream-movies")}
              className="w-full h-12 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 text-white text-sm font-bold font-sans uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              Pay As You Go
            </button>
          </div>
        </div>
      </div>

      <h1 className="text-[30px] font-medium text-center mt-[120px] mb-10 pb-20 z-0">
        Choose or create user’s streaming profile
      </h1>

      <div className="w-full flex justify-center mb-[250px] z-0">
        {showOnlyAddProfile ? (
          <div className="flex flex-col sm:flex-row gap-16 items-center">
            <div
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition"
              onClick={() => alert("Continue to profile setup")}
            >
              <div className="w-24 h-24 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center">
                <img
                  src={AddProfileImg}
                  alt="Add Profile"
                  className="w-10 h-10"
                />
              </div>
              <p className="mt-2 text-sm">New Profile</p>
            </div>

            <div
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition"
              onClick={handleAdminProfile}
            >
              <p className="text-xs text-white mb-3">Admin profile</p>
              <img
                src={profilePic || AdminAvatar}
                alt="Admin Avatar"
                className="w-24 h-24 rounded-full border border-white/30 object-cover"
              />
              <p className="mt-2 text-sm">{profileName || "Adam"}</p>
              <div
                className="mt-2 flex items-center justify-center bg-white/10 hover:bg-white/20 p-1.5 rounded-full cursor-pointer transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                title="Update profile picture"
              >
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-16">
            <div
              className="sm:absolute sm:left-12 flex flex-col items-center cursor-pointer hover:scale-105 transition"
              onClick={handleAddProfile}
            >
              <div className="w-24 h-24 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center">
                <img
                  src={AddProfileImg}
                  alt="Add Profile"
                  className="w-10 h-10"
                />
              </div>
              <p className="mt-2 text-sm">Add profile</p>
            </div>

            <div
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition"
              onClick={handleAdminProfile}
            >
              <p className="text-xs text-white mb-3">Admin profile</p>
              <img
                src={profilePic || AdminAvatar}
                alt="Admin Avatar"
                className="w-24 h-24 rounded-full border border-white/30 object-cover"
              />
              <p className="mt-2 text-sm">{profileName || "Adam"}</p>
              <div
                className="mt-2 flex items-center justify-center bg-white/10 hover:bg-white/20 p-1.5 rounded-full cursor-pointer transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                title="Update profile picture"
              >
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        )}
      </div>

      <h2 className="text-[30px] font-semibold mb-4">Primepit</h2>
      <div className="text-center mb-4 z-0">
        <img
          src={PrimepitLogo}
          alt="Primepit Logo"
          className="w-[58px] h-[72px] opacity-70 mx-auto mb-2"
        />
        <p className="text-[15px] font-semibold text-white mt-4">
          Powered by Klouto
        </p>
      </div>

      <p className="text-[10px] text-white/30 text-center max-w-sm mt-6 mb-6 z-0">
        By using our streaming site, you consent to our user guideline.
        <span className="block mt-3">All rights reserved &copy;2025</span>
      </p>
    </div>
  );
};

export default ProfileLocked;

import React, { useEffect, useState } from "react";
import { useApi } from "../../../context/AppContext";
import { toast } from "react-toastify";

const ProfileDashboard: React.FC = () => {
  const {
    userProfile,
    updateProfile,
    uploadProfilePicture,
    updatePassword,
    fetchUserProfile,
  } = useApi();
  const [fullName, setFullName] = useState("");
  const [productionName, setProductionName] = useState("");
  const [countryResidence, setCountryResidence] = useState("");
  const [countryProduction, setCountryProduction] = useState("");
  const [age, setAge] = useState<number | "">("");

  const [aboutYourself, setAboutYourself] = useState("");
  const [aboutMovies, setAboutMovies] = useState("");

  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullname || "");
      setUsername(userProfile.username || "");
      setEmail(userProfile.email || "");
      setAge(userProfile.age !== undefined ? userProfile.age : "");

      const producerDetails = userProfile.producer || {};

      setProductionName(producerDetails.productionName || "");
      setCountryResidence(
        producerDetails.countryOfResidence ||
          userProfile.countryResidence ||
          "",
      );
      setCountryProduction(
        producerDetails.countryOfProduction ||
          userProfile.countryProduction ||
          "",
      );
      setAboutYourself(producerDetails.bio || userProfile.bio || "");
    }
  }, [userProfile]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Client-side file size gate verification (20 MB limit)
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File is too large! Maximum allowed size is 20 MB.");
        return;
      }

      try {
        setIsUploading(true);
        toast.loading("Uploading image...", { id: "avatarUpload" });

        await uploadProfilePicture(file);

        toast.success("Profile picture updated successfully!", {
          id: "avatarUpload",
        });
      } catch (error: any) {
        toast.error("Failed to upload profile picture.", {
          id: "avatarUpload",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = async () => {
    if (age === "" || Number(age) < 16) {
      toast.error("Age must be a valid number from 16 and above.");
      return;
    }

    try {
      toast.loading("Saving changes...", { id: "saveProfile" });

      const updatedData = {
        fullname: fullName,
        username: username,
        age: Number(age),
        productionName: productionName,
        countryResidence: countryResidence,
        countryProduction: countryProduction,
        bio: aboutYourself,
      };

      await updateProfile(updatedData);

      if (password.trim() !== "") {
        await updatePassword({
          newPassword: password,
          confirmPassword: password,
        });
        setPassword("");
      }

      await fetchUserProfile();
      toast.success("Profile updated successfully!", { id: "saveProfile" });
    } catch (error: any) {
      toast.error(error.message || "Failed to update settings", {
        id: "saveProfile",
      });
    }
  };

  const handleCloseAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to close your account? This action cannot be undone.",
      )
    ) {
      alert("Account closed.");
    }
  };

  if (!userProfile) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] bg-[#0d0d15] text-white">
        <p className="animate-pulse text-lg">
          Loading user profile information...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 md:p-12 min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#0d0d15] via-[#12121f] to-[#0d0d15] font-[Poppins] text-white select-none">
      {/* Top Heading */}
      <h1 className="text-white font-bold text-2xl md:text-3xl lg:text-[32px] tracking-wide mb-12 md:mb-16 animate-fade-in">
        Your Settings
      </h1>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 w-full max-w-6xl mx-auto">
        {/* Left Column: Avatar & Profile Inputs */}
        <div className="lg:col-span-5 flex flex-col gap-8 animate-fade-in animation-delay-100">
          {/* Dynamic Avatar Section */}
          <div className="flex flex-col items-start mb-2">
            <div
              className="relative w-40 h-40 md:w-44 md:h-44 rounded-full bg-[#1b1b26] flex items-center justify-center cursor-pointer shadow-2xl hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all group border-4 border-white/10 overflow-hidden"
              style={{
                backgroundImage: userProfile.profilePicture
                  ? `url(${userProfile.profilePicture})`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className={`absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isUploading ? "opacity-100" : ""}`}
              >
                <span className="text-[#10b981] font-bold text-sm tracking-wide text-center px-2">
                  {isUploading ? "Uploading..." : "Update Picture"}
                </span>
              </div>

              {!userProfile.profilePicture && !isUploading && (
                <span className="text-gray-400 text-sm font-semibold text-center px-4">
                  No Image Uploaded
                </span>
              )}

              <input
                type="file"
                accept="image/*"
                disabled={isUploading}
                className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Update profile picture"
                onChange={handleAvatarChange}
              />
            </div>
            <span className="text-white font-semibold text-xs mt-3 ml-28 md:ml-32 tracking-wider drop-shadow opacity-90">
              Max 20 MB
            </span>
          </div>
          {/* Input Fields */}
          <div className="flex flex-col gap-6 w-full max-w-md">
            <div className="flex flex-col gap-2.5">
              <label className="text-white font-bold text-base md:text-lg tracking-wide">
                Fullname
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#252530] text-white px-4 py-3.5 rounded-xl border border-white/5 focus:outline-none focus:border-[#10b981] shadow-inner transition-colors hover:bg-[#2a2a35]"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-white font-bold text-base md:text-lg tracking-wide">
                Production name
              </label>
              <input
                type="text"
                value={productionName}
                onChange={(e) => setProductionName(e.target.value)}
                className="w-full bg-[#252530] text-white px-4 py-3.5 rounded-xl border border-white/5 focus:outline-none focus:border-[#10b981] shadow-inner transition-colors hover:bg-[#2a2a35]"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-white font-bold text-base md:text-lg tracking-wide">
                Country of residence
              </label>
              <input
                type="text"
                value={countryResidence}
                onChange={(e) => setCountryResidence(e.target.value)}
                className="w-full bg-[#252530] text-white px-4 py-3.5 rounded-xl border border-white/5 focus:outline-none focus:border-[#10b981] shadow-inner transition-colors hover:bg-[#2a2a35]"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-white font-bold text-base md:text-lg tracking-wide">
                Country of production
              </label>
              <input
                type="text"
                value={countryProduction}
                onChange={(e) => setCountryProduction(e.target.value)}
                className="w-full bg-[#252530] text-white px-4 py-3.5 rounded-xl border border-white/5 focus:outline-none focus:border-[#10b981] shadow-inner transition-colors hover:bg-[#2a2a35]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Bio Textareas, Security & Actions */}
        <div className="lg:col-span-7 flex flex-col gap-8 justify-between animate-fade-in animation-delay-200">
          <div className="flex flex-col gap-8 w-full">
            {/* About yourself */}
            <div className="flex flex-col gap-3">
              <label className="text-white font-bold text-lg md:text-xl tracking-wide">
                About yourself
              </label>
              <textarea
                rows={4}
                value={aboutYourself}
                onChange={(e) => setAboutYourself(e.target.value)}
                className="w-full bg-[#252530] text-white p-5 rounded-2xl border border-white/5 focus:outline-none focus:border-[#10b981] shadow-inner resize-none transition-colors hover:bg-[#2a2a35]"
              ></textarea>
            </div>

            {/* About your movies */}
            <div className="flex flex-col gap-3">
              <label className="text-white font-bold text-lg md:text-xl tracking-wide">
                About your movies
              </label>
              <textarea
                rows={4}
                value={aboutMovies}
                onChange={(e) => setAboutMovies(e.target.value)}
                className="w-full bg-[#252530] text-white p-5 rounded-2xl border border-white/5 focus:outline-none focus:border-[#10b981] shadow-inner resize-none transition-colors hover:bg-[#2a2a35]"
              ></textarea>
            </div>
          </div>

          {/* Security Section */}
          <div className="flex flex-col gap-5 w-full mt-2 animate-fade-in animation-delay-300">
            <h3 className="text-white font-normal text-lg md:text-xl tracking-wide">
              Security
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="flex items-center gap-4">
                <label className="text-white font-normal text-base md:text-lg whitespace-nowrap tracking-wide">
                  Password:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#252530] text-white px-4 py-3.5 rounded-xl border border-white/5 focus:outline-none focus:border-[#10b981] shadow-inner transition-colors hover:bg-[#2a2a35]"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="text-white font-normal text-base md:text-lg whitespace-nowrap tracking-wide">
                  Username:
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#252530] text-white px-4 py-3.5 rounded-xl border border-white/5 focus:outline-none focus:border-[#10b981] shadow-inner transition-colors hover:bg-[#2a2a35]"
                />
              </div>
            </div>
          </div>

          {/* Bottom Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 pt-8 border-t border-white/5 w-full animate-fade-in animation-delay-400">
            <button
              type="button"
              onClick={handleCloseAccount}
              className="text-[#ff3b30] hover:text-[#d32f2f] font-bold text-base md:text-lg tracking-wider transition-colors cursor-pointer self-start sm:self-center"
            >
              Close account!
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="bg-[#323d6d] hover:bg-[#3f4a7d] text-white font-bold text-base md:text-lg lg:text-xl px-12 md:px-16 py-3.5 md:py-4 rounded-xl shadow-2xl hover:shadow-[0_0_20px_rgba(50,61,109,0.5)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer tracking-wider w-full sm:w-auto text-center"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;

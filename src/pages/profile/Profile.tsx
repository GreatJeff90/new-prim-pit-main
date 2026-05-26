import React, { useState, useRef, useEffect } from "react";
import { useApi } from "../../context/AppContext";
import PrimepitLogo from "../../assets/F.png";
import AdminAvatar from "../../assets/profileimg.png";
import BadgeIcon from "../../assets/img.png";
import AddProfileImg from "../../assets/add-profile.png";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const [adminAvatar, setAdminAvatar] = useState(AdminAvatar);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showAddProfileModal, setShowAddProfileModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const navigate = useNavigate();
  const {
    uploadProfilePicture,
    createExtraProfile,
    fetchUserProfile,
    userProfile,
  } = useApi();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await fetchUserProfile();
        if (userProfile?.profilePicture) {
          setAdminAvatar(userProfile.profilePicture);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    loadProfile();
  }, []);

  const handleAdminProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
      toast.error("Please select a valid image file (JPEG, JPG, PNG, GIF)");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image must be less than 20MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!previewImage || !fileInputRef.current?.files?.[0]) return;

    try {
      const imageUrl = await uploadProfilePicture(
        fileInputRef.current.files[0],
      );
      setAdminAvatar(imageUrl);
      setPreviewImage(null);
      toast.success("Profile picture updated successfully!");
      await fetchUserProfile();
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to upload profile picture");
    }
  };

  const cancelUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddProfile = () => {
    setShowAddProfileModal(true);
  };

  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) {
      toast.error("Please enter a profile name");
      return;
    }

    try {
      await createExtraProfile(newProfileName);
      setNewProfileName("");
      setShowAddProfileModal(false);
      toast.success("Profile created successfully!");
      await fetchUserProfile();
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("Failed to create profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0F3FFF] flex flex-col items-center justify-between text-white px-4 font-[Poppins] relative">
      <h1 className="text-[30px] font-medium leading-[1] text-center mt-[150px] mb-10">
        Choose or create user's streamiing profile
      </h1>

      <div className="w-full flex justify-between px-12 items-start mb-[200px] relative">
        {/* Extra profiles (limited to 3) */}
        {userProfile?.extraProfiles?.slice(0, 3).map((profile, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer hover:scale-105 transition mt-[190px]"
          >
            <img
              src={AddProfileImg}
              alt={profile}
              className="w-10 h-10 rounded-full border border-purple-400 bg-purple-500/20 object-cover"
            />
            <p className="mt-2 text-sm">{profile}</p>
          </div>
        ))}

        {/* Add profile button (only show if less than 3 extra profiles) */}
        {(!userProfile?.extraProfiles ||
          userProfile.extraProfiles.length < 3) && (
          <div
            className="flex flex-col items-center cursor-pointer hover:scale-105 transition mt-[190px] ml-48"
            onClick={handleAddProfile}
          >
            <img
              src={AddProfileImg}
              alt="Add Profile"
              className="w-10 h-10 rounded-full border border-purple-400 bg-purple-500/20 object-cover"
            />
            <p className="mt-2 text-sm">Add profile</p>
          </div>
        )}

        {/* Main admin profile */}
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-[120px]">
          <div className="flex flex-col items-center">
            <p className="text-xs text-white mb-3">Admin profile</p>
            <div
              className="relative w-24 h-24 group cursor-pointer"
              onClick={handleAdminProfileClick}
            >
              <img
                src={previewImage || userProfile?.profilePicture || adminAvatar}
                alt="Admin Avatar"
                className="w-full h-full rounded-full border border-white/30 object-cover transition-all duration-300"
              />
              <img
                src={BadgeIcon}
                alt="Badge"
                className="absolute inset-0 w-12 h-12 m-auto rounded-full"
              />
              {previewImage && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 rounded-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={handleUpload}
                    className="px-3 py-1 bg-green-600 rounded text-xs hover:bg-green-500 transition"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={cancelUpload}
                    className="px-3 py-1 bg-red-600 rounded text-xs hover:bg-red-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <p
              className="mt-2 text-sm cursor-pointer hover:underline"
              onClick={() => navigate("/stream-movies")}
            >
              {userProfile?.fullname || "Admin"}
            </p>
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/jpg, image/png, image/gif"
        className="hidden"
      />

      {showAddProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-[#0F3FFF] to-black p-6 rounded-lg max-w-md w-full mx-4 border border-white/20">
            <h3 className="text-xl font-semibold mb-4">Create New Profile</h3>
            <input
              type="text"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="Enter profile name"
              className="w-full p-3 bg-black/30 border border-white/20 rounded mb-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddProfileModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProfile}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-[30px] font-semibold leading-[1] mb-4">Flixora</h2>
      <div className="text-center mb-4">
        <img
          src={PrimepitLogo}
          alt="Primepit Logo"
          className="w-[100px] h-[100px] opacity-50 mx-auto mb-2"
        />
        <p className="text-[15px] font-semibold leading-[1] text-white mt-4">
          Powered by Klouto
        </p>
      </div>

      <p className="text-[10px] font-normal leading-[1] text-white/30 text-center max-w-sm mt-6 mb-6">
        By using our streaming site, you consent to our user guideline.
        <span className="block mt-3">All rights reserved &copy;2025</span>
      </p>
    </div>
  );
};

export default Profile;

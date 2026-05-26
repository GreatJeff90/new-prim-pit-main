import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { useApi } from '../../../../context/AppContext';
import { toast } from 'react-hot-toast';

const AccountSetting: React.FC = () => {
  const { fetchUserProfileDetails, resetUserProfile, uploadProfilePicture, updateProfile } = useApi();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    age: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await fetchUserProfileDetails();
        setForm({
          fullName: profile.fullname,
          email: profile.email,
          username: profile.username,
          age: profile.age.toString(),
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [fetchUserProfileDetails]);

  const validate = (name: string, value: string) => {
    let error = '';
    if (!value.trim()) error = 'This field is required';
    else if (name === 'email' && !/^\S+@\S+\.\S+$/.test(value)) error = 'Invalid email';
    else if (name === 'age' && (!/^\d+$/.test(value) || +value < 16)) error = 'Age must be at least 16';
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: validate(name, value) });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setProfilePic(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        
        await uploadProfilePicture(file);
        toast.success("Profile picture updated successfully");
      } catch (error) {
        console.error("Failed to upload profile picture:", error);
        toast.error("Failed to upload profile picture");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = Object.keys(form).reduce((acc, key) => {
      const error = validate(key, form[key as keyof typeof form]);
      if (error) acc[key] = error;
      return acc;
    }, {} as typeof errors);
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setIsUpdating(true);
      const updatedProfile = await updateProfile({
        fullname: form.fullName,
        username: form.username,
        email: form.email,
        age: parseInt(form.age),
      });

      // Update form with the returned values in case the server modified any
      setForm({
        fullName: updatedProfile.fullname,
        email: updatedProfile.email,
        username: updatedProfile.username,
        age: updatedProfile.age.toString(),
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = async () => {
    try {
      const resetProfile = await resetUserProfile();
      setForm({
        fullName: resetProfile.fullname,
        email: resetProfile.email,
        username: resetProfile.username,
        age: resetProfile.age.toString(),
      });
      setErrors({});
      setProfilePic(null);
      setPreview('');
      toast.success("Profile reset successfully");
    } catch (error) {
      console.error("Failed to reset profile:", error);
      toast.error("Failed to reset profile");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Profile Picture */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2">Your Profile Picture</p>
        <label htmlFor="profileUpload">
          <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer overflow-hidden">
            {preview ? (
              <img src={preview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Camera className="text-gray-400 w-6 h-6" />
            )}
          </div>
        </label>
        <input
          id="profileUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* Inputs in two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['fullName', 'email', 'username', 'age'].map((field) => (
          <div key={field}>
            <label className="block text-sm mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
            <input
              name={field}
              type={field === 'age' ? 'number' : 'text'}
              value={form[field as keyof typeof form]}
              onChange={handleChange}
              className="w-full bg-[#E0E4EC] text-black border border-dark-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isUpdating}
            />
            {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-20 flex gap-4">
        <button
          type="submit"
          className="bg-[#D74632] hover:bg-red-600 text-white px-4 py-2 rounded shadow disabled:opacity-50"
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update Profile'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-white disabled:opacity-50"
          disabled={isUpdating}
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default AccountSetting;
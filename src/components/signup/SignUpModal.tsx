import React, { useState } from "react";
import { useApi } from "../../context/AppContext";
import { toast } from "react-hot-toast";
import signupSound from "../../assets/signup-sound.mp3";
import { BsEye, BsEyeSlash } from "react-icons/bs";

interface SignupModalProps {
  show: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({
  show,
  onClose,
  onSwitchToLogin,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    age: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useApi();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullname.trim()) newErrors.fullname = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid";
    if (!formData.age) newErrors.age = "Required";
    if (!formData.username) newErrors.username = "Required";
    else if (formData.username.length > 10) newErrors.username = "Max 10 chars";
    if (!formData.password) newErrors.password = "Required";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const sound = new Audio(signupSound);
      sound.volume = 0.7;
      sound.play().catch((err) => console.error("Signup sound failed:", err));

      await signup({
        fullname: formData.fullname,
        email: formData.email,
        age: Number(formData.age),
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("fullname", formData.fullname);
      sessionStorage.setItem("email", formData.email);

      // toast.success("Account created successfully!");

      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err: any) {
      const serverMsg =
        err.response?.data?.message ||
        err.message ||
        "Signup failed. Try again.";
      setErrors((prev) => ({ ...prev, server: serverMsg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-black/30">
      <div className="w-full max-w-[500px] h-auto max-h-[90vh] relative bg-zinc-300/50 rounded-2xl shadow-2xl overflow-y-auto scale-95 sm:scale-100 p-6 sm:p-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-8 sm:top-8 z-20 hover:opacity-70 transition-opacity"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >
          {/* Header */}
          <div className="text-white text-3xl sm:text-5xl font-['Arapey'] uppercase tracking-[3.36px] mb-8 sm:mb-12 mt-4">
            Sign Up
          </div>

          <div className="w-full space-y-6 sm:px-4">
            {/* Fullname */}
            <div className="w-full relative">
              <label className="text-black/60 text-xs sm:text-sm font-['Arapey'] uppercase tracking-wide block mb-1">
                Enter fullname
              </label>
              <input
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white outline-none text-white font-['Arapey'] text-lg pb-1"
              />
              {errors.fullname && (
                <span className="text-red-500 text-[10px] absolute right-0 top-0">
                  {errors.fullname}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="w-full relative">
              <label className="text-black/60 text-xs sm:text-sm font-['Arapey'] uppercase tracking-wide block mb-1">
                Enter email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white outline-none text-white font-['Arapey'] text-lg pb-1"
              />
              {errors.email && (
                <span className="text-red-500 text-[10px] absolute right-0 top-0">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Age */}
            <div className="w-full relative">
              <label className="text-black/60 text-xs sm:text-sm font-['Arapey'] uppercase tracking-wide block mb-1">
                How old are you?
              </label>
              <input
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white outline-none text-white font-['Arapey'] text-lg pb-1"
              />
              {errors.age && (
                <span className="text-red-500 text-[10px] absolute right-0 top-0">
                  {errors.age}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Username */}
              <div className="w-full sm:w-1/2 relative">
                <label className="text-black/60 text-xs sm:text-sm font-['Arapey'] uppercase tracking-wide block mb-1">
                  Create username
                </label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white outline-none text-white font-['Arapey'] text-lg pb-1"
                />
                <span className="text-white text-[8px] font-['Arapey'] uppercase tracking-wide mt-1 block">
                  Max 10 characters
                </span>
                {errors.username && (
                  <span className="text-red-500 text-[10px] absolute right-0 top-0">
                    {errors.username}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="w-full sm:w-1/2 relative">
                <label className="text-black/60 text-xs sm:text-sm font-['Arapey'] uppercase tracking-wide block mb-1">
                  Create password
                </label>
                <div className="relative w-full">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white outline-none text-white font-['Arapey'] text-lg pb-1 pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <BsEyeSlash className="w-4 h-4" />
                    ) : (
                      <BsEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <span className="text-white text-[8px] font-['Arapey'] uppercase tracking-wide mt-1 block leading-tight">
                  Must include letters, digits and special case
                </span>
                {errors.password && (
                  <span className="text-red-500 text-[10px] absolute right-0 top-0">
                    {errors.password}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Create Button & Footer */}
          <div className="w-full max-w-[320px] mb-4 sm:mb-8 mt-10 flex gap-4 items-center flex-col">
            {errors.server && (
              <div className="w-full text-red-500 text-xs text-center bg-red-500/10 py-2.5 px-3 rounded border border-red-500/20 leading-snug">
                {errors.server}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-[5px] border border-white flex items-center justify-center hover:bg-white/10 transition-colors py-3 active:scale-95 duration-200"
            >
              <span className="text-white text-base font-['Arapey'] uppercase tracking-wide">
                {isSubmitting ? "Creating..." : "Create account"}
              </span>
            </button>

            <div className="flex gap-3 items-center">
              <div className="text-black text-xs font-['Arapey'] uppercase tracking-wide opacity-80">
                Already have an account?
              </div>
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-emerald-400 text-xs font-black font-['Albert_Sans'] uppercase tracking-wide hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;

import React, { useEffect, useRef, useState } from "react";
import clickSound from "../../assets/signup-sound.mp3";
import { useApi } from "../../context/AppContext";
import { BsEye, BsEyeSlash } from "react-icons/bs";

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
  onSwitchToForgot: () => void;
  onSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  show,
  onClose,
  onSwitchToSignup,
  onSwitchToForgot,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useApi();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // useEffect(() => {
  //   if (!show && audioRef.current) {
  //     audioRef.current.pause();
  //     audioRef.current.currentTime = 0;
  //   }
  // }, [show]);
  useEffect(() => {
    audioRef.current = new Audio(clickSound);
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.load();
        audioRef.current = null;
      }
    };
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username || formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    if (
      !formData.password ||
      formData.password.length < 8 ||
      !/[A-Z]/.test(formData.password) ||
      !/\d/.test(formData.password)
    ) {
      newErrors.password =
        "Password must be at least 8 characters, include a number and uppercase letter";
    }
    return newErrors;
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const validationErrors = validate();
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   // const sound = new Audio(clickSound);
  //   if (audioRef.current) {
  //     audioRef.current.currentTime = 0; // Rewind to start if clicked again
  //     audioRef.current.play().catch((err) => {
  //       console.error("Login sound failed:", err);
  //     });
  //   }
  //   try {
  //     await login(formData);
  //     // if (audioRef.current) {
  //     //   audioRef.current.pause();
  //     //   audioRef.current.src = "";
  //     // }
  //     if (onSuccess) {
  //       onSuccess();
  //     } else {
  //       onClose();
  //     }
  //   } catch (err: any) {
  //     const serverMsg =
  //       err.response?.data?.message ||
  //       err.message ||
  //       "Login failed. Try again.";
  //     setErrors((prev) => ({ ...prev, server: serverMsg }));
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Initialize audio if not already done
    if (!audioRef.current) {
      audioRef.current = new Audio(clickSound);
      audioRef.current.volume = 0.5;
    }

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((err) => {
      console.error("Login sound failed:", err);
    });

    try {
      await login(formData);

      // ✅ Stop audio HERE, before anything closes or routes away
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      if (onSuccess) {
        audioRef.current = null;
        onSuccess();
      } else {
        onClose();
      }
    } catch (err: any) {
      const serverMsg =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Try again.";
      setErrors((prev) => ({ ...prev, server: serverMsg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg z-40"></div>

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="rounded-xl p-6 sm:p-8 w-full max-w-md h-auto max-h-[90vh] overflow-y-auto relative animate-fade-in"
          style={{ background: "rgba(217, 217, 217, 0.48)" }}
        >
          <div className="flex justify-between items-center mb-8 relative">
            <h5 className="text-3xl sm:text-4xl text-white font-arapey font-normal uppercase tracking-wider text-center w-full">
              SIGN IN
            </h5>
            <button
              className="text-white text-3xl absolute right-0 top-0 hover:opacity-70 transition-opacity"
              onClick={onClose}
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="w-full mt-8 sm:mt-[100px]">
            <div className="mb-6">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="bg-transparent border-b-2 border-white w-full py-3 text-white outline-none placeholder-gray-400"
              />
              {errors.username && (
                <span className="text-red-400 text-sm block mt-1">
                  {errors.username}
                </span>
              )}
            </div>

            <div className="mb-6">
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-transparent border-b-2 border-white w-full py-3 pr-10 text-white outline-none placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <BsEyeSlash className="w-5 h-5" />
                  ) : (
                    <BsEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-400 text-sm block mt-1">
                  {errors.password}
                </span>
              )}
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={onSwitchToForgot}
                  className="text-xs text-blue-200/80 hover:text-white transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center mt-10 sm:mt-[60px]">
              {errors.server && (
                <div className="w-full max-w-xs text-red-500 text-xs text-center bg-red-500/10 py-2.5 px-3 rounded border border-red-500/20 leading-snug mb-4">
                  {errors.server}
                </div>
              )}
              <button
                type="submit"
                className="bg-transparent border-2 border-white text-white px-6 py-2 rounded font-bold uppercase w-full max-w-xs hover:bg-white hover:bg-opacity-10 transition-colors duration-300 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
              <p className="mt-4 text-center text-white text-sm">
                Don't have an account?
                <button
                  type="button"
                  className="ml-2 text-emerald-400 underline font-semibold hover:text-emerald-300 transition-colors"
                  onClick={onSwitchToSignup}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginModal;

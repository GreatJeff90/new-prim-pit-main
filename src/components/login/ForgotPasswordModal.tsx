import React, { useState } from 'react';

interface ForgotPasswordModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void; // Transition to reset password modal
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ show, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 1500);
  };

  return (
    <>
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg z-40 transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="rounded-xl p-6 sm:p-8 w-full max-w-md h-auto max-h-[90vh] overflow-y-auto relative animate-fade-in text-white"
          style={{ background: "rgba(217, 217, 217, 0.48)" }}
        >
          <button
            className="text-white hover:opacity-70 transition-opacity absolute right-6 top-6 sm:right-8 sm:top-8 z-10"
            onClick={onClose}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="flex justify-between items-start mb-6 relative">
            <h5 className="text-3xl sm:text-4xl text-white font-arapey font-normal uppercase tracking-wider text-center w-full">
              FORGOT PASSWORD
            </h5>
          </div>

          <form onSubmit={handleSubmit} className="w-full mt-6 sm:mt-10 px-2">
            <p className="text-white text-sm text-center mb-10 opacity-90 leading-relaxed">
              Enter your email and we'll send you a link to reset your password.
            </p>

            <div className="mb-8">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-b-2 border-white w-full py-3 text-white outline-none placeholder-gray-300"
              />
              {error && (
                <span className="text-red-400 text-sm block mt-1">
                  {error}
                </span>
              )}
            </div>

            <div className="flex flex-col items-center mt-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded font-bold uppercase w-full max-w-xs hover:bg-white hover:bg-opacity-10 transition-colors duration-300 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordModal;

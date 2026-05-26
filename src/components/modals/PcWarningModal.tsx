import React from 'react';

interface PcWarningModalProps {
  show: boolean;
  onClose: () => void;
}

const PcWarningModal: React.FC<PcWarningModalProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 backdrop-blur-md bg-black/40 animate-fade-in">
      <div className="w-full max-w-[450px] bg-zinc-300/20 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 relative flex flex-col items-center">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 hover:opacity-70 transition-opacity"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6L18 18"/>
          </svg>
        </button>

        {/* Icon */}
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </div>

        <h2 className="text-2xl text-white font-bold font-['Poppins'] mb-4 text-center">
          PC Required
        </h2>
        
        <p className="text-white/80 text-center font-['Poppins'] leading-relaxed mb-8">
          The Producer onboarding process requires a desktop environment for the best experience. Please switch to a PC to continue.
        </p>

        <button
          onClick={onClose}
          className="w-full py-4 bg-white text-black rounded-full font-bold uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default PcWarningModal;

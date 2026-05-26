import React, { useState } from "react";

interface InterestsModalProps {
  show: boolean;
  onClose: () => void;
  onComplete: (interests: string[]) => void;
}

const GENRES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", 
  "Documentary", "Drama", "Family", "Fantasy", "History", 
  "Horror", "Music", "Mystery", "Romance", "Sci-Fi", 
  "Thriller", "War", "Western"
];

const InterestsModal: React.FC<InterestsModalProps> = ({ show, onClose, onComplete }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (genre: string) => {
    if (selectedInterests.includes(genre)) {
      setSelectedInterests(prev => prev.filter(i => i !== genre));
    } else if (selectedInterests.length < 5) {
      setSelectedInterests(prev => [...prev, genre]);
    }
  };

  const handleFinish = () => {
    onComplete(selectedInterests);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-md bg-black/40 animate-fade-in">
      <div className="w-full max-w-[600px] max-h-[90vh] bg-zinc-300/40 rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20 relative flex flex-col items-center mx-4">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 hover:opacity-70 transition-opacity"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6L18 18"/>
          </svg>
        </button>

        <h2 className="text-3xl sm:text-4xl text-white font-['Arapey'] uppercase tracking-[4px] mb-2 text-center">
          Your Interests
        </h2>
        <p className="text-white/70 text-[10px] sm:text-sm font-['Arapey'] uppercase tracking-widest mb-6 sm:mb-8 text-center">
          Select up to 5 genres you love
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 w-full mb-8 sm:mb-10 overflow-y-auto pr-2 custom-scrollbar">
          {GENRES.map(genre => (
            <button
              key={genre}
              onClick={() => toggleInterest(genre)}
              className={`
                px-3 sm:px-4 py-2 sm:py-3 rounded-xl border transition-all duration-300 uppercase font-['Arapey'] text-[10px] sm:text-xs tracking-widest
                ${selectedInterests.includes(genre) 
                  ? "bg-white text-black border-white scale-105 shadow-xl" 
                  : "bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white/50"}
                ${selectedInterests.length >= 5 && !selectedInterests.includes(genre) ? "opacity-40 cursor-not-allowed" : ""}
              `}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 w-full">
          <button
            onClick={handleFinish}
            disabled={selectedInterests.length === 0}
            className={`
              w-64 py-4 rounded-full font-['Albert_Sans'] font-black uppercase tracking-[2px] transition-all
              ${selectedInterests.length > 0 
                ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:scale-105" 
                : "bg-white/20 text-white/40 cursor-not-allowed"}
            `}
          >
            Continue ({selectedInterests.length}/5)
          </button>
          
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white text-[10px] font-['Arapey'] uppercase tracking-widest transition-colors"
          >
            I'll do this later
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}} />
    </div>
  );
};

export default InterestsModal;

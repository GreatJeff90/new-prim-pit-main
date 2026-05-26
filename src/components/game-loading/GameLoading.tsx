import { useEffect, useRef } from "react";
import backgroundImg from "../../assets/game-background.jpg";
import gameLoadingImg from "../../assets/golden.png";

import loadingSound from "../../assets/game-loanding-sound.mp3"; 

const GameLoading = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    el.volume = 0.5; 

    const unlock = () => {
      el.play().catch((err) => {
        console.warn("Playback still blocked after user interaction:", err);
      });
    };

    const setupUnlock = () => {
      // Try again on first user gesture if autoplay was blocked
      window.addEventListener("pointerdown", unlock, { once: true });
      window.addEventListener("keydown", unlock, { once: true });
    };

    // Initial autoplay attempt
    el.play().catch((err) => {
      console.warn("Autoplay blocked; waiting for user interaction.", err);
      setupUnlock();
    });

    return () => {
      // Clean up
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      el.pause();
      el.currentTime = 0;
    };
  }, []);

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex flex-col justify-center items-center px-4 text-white"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      {/* Hidden/Offscreen audio element that we control */}
      <audio
        ref={audioRef}
        src={loadingSound}
        loop
        autoPlay
        playsInline
      />

      <div className="relative flex items-center justify-center">
        {/* Center image */}
        <img
          src={gameLoadingImg}
          alt="Loading"
          className="w-[200px] h-[200px] object-cover"
        />

        {/* Spinner on top of the image */}
        <div className="absolute w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin" />
      </div>
    </div>
  );
};

export default GameLoading;

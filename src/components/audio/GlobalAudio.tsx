import React, { useEffect, useRef, useState } from "react";
import authMusic from "../../assets/audio/auth_section.mpeg";
import producerMusic from "../../assets/audio/producer.mpeg";
import profileMusic from "../../assets/audio/profile_page.mpeg";

interface GlobalAudioProps {
  currentPath: string;
  anyModalOpen: boolean;
}

const GlobalAudio: React.FC<GlobalAudioProps> = ({
  currentPath,
  anyModalOpen,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeSrc, setActiveSrc] = useState<string | null>(null);

  // Determine theme
  useEffect(() => {
    let theme = null;
    if (currentPath === "/become-producer") {
      theme = producerMusic;
    } else if (
      currentPath === "/profile" ||
      currentPath === "/profile-locked"
    ) {
      theme = profileMusic;
    } else if (
      currentPath === "/login" ||
      currentPath === "/sign-up" ||
      anyModalOpen
    ) {
      theme = authMusic;
    }

    if (theme !== activeSrc) {
      console.log("GlobalAudio theme changing to:", theme);
      setActiveSrc(theme);
    }
  }, [currentPath, anyModalOpen, activeSrc]);

  // Master play function
  const playAudio = () => {
    if (audioRef.current && activeSrc) {
      audioRef.current.play().catch(() => {
        console.debug("Autoplay blocked - waiting for interaction");
      });
    }
  };

  // Effect to handle source changes and interaction
  useEffect(() => {
    if (!activeSrc) {
      if (audioRef.current) audioRef.current.pause();
      return;
    }

    // Try to play immediately
    playAudio();

    // Browser interaction setup
    const interactions = [
      "click",
      "mousedown",
      "touchstart",
      "keydown",
      "scroll",
    ];
    const handleInteraction = () => {
      playAudio();
      interactions.forEach((ev) =>
        window.removeEventListener(ev, handleInteraction),
      );
    };

    interactions.forEach((ev) =>
      window.addEventListener(ev, handleInteraction),
    );

    return () => {
      interactions.forEach((ev) =>
        window.removeEventListener(ev, handleInteraction),
      );
    };
  }, [activeSrc]);

  if (!activeSrc) return null;

  return (
    <audio
      key={activeSrc} // Force new element on track change
      ref={audioRef}
      src={activeSrc}
      loop
      autoPlay
      playsInline
      onCanPlay={playAudio}
      style={{ display: "none" }}
    />
  );
};

export default GlobalAudio;

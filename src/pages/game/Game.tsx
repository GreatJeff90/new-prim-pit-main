import React, { useEffect, useRef, useState } from "react";
import backgroundImg from "../../assets/game-background.jpg";
import diamondImg from "../../assets/diamonds.png";
import brokenDiamondImg from "../../assets/diamond-break.png"; // New image
import goldenIcon from "../../assets/Off.png"; // Assuming this is the correct hit image
import { useApi } from "../../context/AppContext";
import { toast } from "react-hot-toast";
import hitImg from "../../assets/hitImg.png";


const Game: React.FC = () => {
  const diamonds = Array.from({ length: 32 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [diamondsRed, setDiamondsRed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [slotsLeft, setSlotsLeft] = useState(3);
  const [balance, setBalance] = useState(0);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [missedTiles, setMissedTiles] = useState<number[]>([]);
  const [goldenTileIndex, setGoldenTileIndex] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const { quitGame, startGame, currentGame, selectTile } = useApi();

  useEffect(() => {
    const initializeGame = async () => {
      try {
        const session = await startGame();
        if (session) {
          setSlotsLeft(session.slotsLeft);
          setBalance(session.balance);
          setGameStarted(true);
        }
      } catch (error) {
        console.error("Failed to start game:", error);
      }
    };

    if (!currentGame) {
      initializeGame();
    } else {
      setSlotsLeft(currentGame.slotsLeft);
      setBalance(currentGame.balance);
      setGameStarted(true);
    }
  }, [currentGame, startGame]);

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.warn("Autoplay blocked or failed:", err);
        });
      }
    };

    playAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gameStarted && countdown > 0 && !gameOver) {
      timer = setTimeout(() => {
        setCountdown((prev) => {
          if (prev === 21) {
            setDiamondsRed(true);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (countdown === 0 && !gameOver) {
      handleGameEnd();
    }

    return () => clearTimeout(timer);
  }, [gameStarted, countdown, gameOver]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleGameEnd = () => {
    setShowWarning(true);
    setCountdown(23);
    setDiamondsRed(true);
    setGameOver(true);
  };

  const handleEndGame = () => {
    setShowWarning(true);
    setCountdown(23);
    setDiamondsRed(true);
  };

  const handleBackToGame = () => {
    setShowWarning(false);
    setDiamondsRed(countdown <= 20);
  };

  const handleQuit = async () => {
    try {
      await quitGame();
      setShowWarning(false);
      setGameStarted(false);
      setGameOver(true);
    } catch (error) {
      console.error("Quit game failed:", error);
    }
  };

  const handleTileClick = async (index: number) => {
    if (!gameStarted || showWarning || gameOver || selectedTiles.includes(index)) {
      return;
    }

    try {
      const response = await selectTile(index);

      setSelectedTiles((prev) => [...prev, index]);
      setSlotsLeft(response.slotsLeft);
      setBalance(response.balance);

      if (response.result === "hit") {
        setGoldenTileIndex(index);
        toast.success(response.message);
        handleGameEnd();
      } else {
        setMissedTiles((prev) => [...prev, index]);
        toast.error(response.message);
      }

      if (response.gameOver || response.slotsLeft === 0) {
        handleGameEnd();
      }
    } catch (error) {
      console.error("Tile selection failed:", error);
    }
  };

  const isTileSelected = (index: number) => selectedTiles.includes(index);

  return (
    <div className="relative w-screen h-screen">
      <div
        className={`w-full h-full bg-cover bg-center px-4 py-6 text-white overflow-auto transition-all duration-300 ${
          showWarning ? "filter blur-sm" : ""
        }`}
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <audio ref={audioRef} src="/audio/game-sound.mp3" loop />

        <div className="max-w-8xl mx-auto flex flex-col items-center relative z-10">
          {/* Top Info */}
          <div className="w-full flex items-start justify-between gap-x-6 text-sm md:text-base font-medium mb-6 flex-wrap">
            <div className="flex gap-4 items-center">
              <span className="text-white font-bold text-lg">Time:</span>
              <span
                className="font-bold text-lg"
                style={{ color: countdown <= 20 ? "#FE0606" : "white" }}
              >
                {formatTime(countdown)}
              </span>
            </div>

            <div className="flex-1 flex justify-center items-center text-center">
              <div>
                <p className="font-bold text-lg mb-1">Your earning</p>
                <h1 className="text-xl font-semibold">{balance.toFixed(2)}</h1>
                <p className="text-xs text-slate-300 mt-3">
                  You can win as much as 5k to 10k if you find the golden number
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end text-right max-w-[240px]">
              <div className="flex gap-4 mb-1">
                <h4 className="text-lg font-bold">Tips</h4>
                <h4 className="text-lg font-bold">Read Rules</h4>
              </div>
              <p className="text-sm leading-tight">
                Find the golden number to win a cash prize. You have 1 minute.
                <br />
                Don't leave the screen idle while playing.
              </p>
            </div>
          </div>

          {/* Remaining Slots */}
          <div className="w-full flex flex-col gap-3 mb-4 items-start text-left">
            <p className="text-lg font-medium">
              Remaining slot:{" "}
              <span className="font-bold text-xl">{slotsLeft}</span>
            </p>
          </div>

          {/* Golden Icon Preview */}
          <div className="w-full flex justify-center mb-4">
            <div className="flex flex-row items-center gap-2">
              <p className="text-sm">Find the golden icon</p>
              <img
                src={goldenIcon}
                alt="Golden Icon"
                className="w-6 h-6 object-contain"
              />
            </div>
          </div>

          {/* Diamond Grid */}
          <div className="grid grid-cols-8 gap-4 sm:gap-6 md:gap-16">
            {diamonds.map((_, i) => (
              <button
                key={i}
                className="bg-transparent p-0 border-none focus:outline-none"
                onClick={() => handleTileClick(i)}
                disabled={!gameStarted || showWarning || gameOver || isTileSelected(i)}
              >
                <img
                  src={
                    isTileSelected(i)
                      ? goldenTileIndex === i
                        ? hitImg
                        : brokenDiamondImg
                      : diamondImg
                  }
                  alt="Tile"
                  className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain ${
                    diamondsRed ? "filter hue-rotate-60" : ""
                  } ${isTileSelected(i) ? "opacity-80" : ""}`}
                  style={diamondsRed ? { backgroundColor: "#F10B0B" } : {}}
                />
              </button>
            ))}
          </div>

          {/* End Game Button */}
          <div className="w-full flex justify-end mt-4">
            <button
              onClick={handleEndGame}
              className="text-red-500 underline text-sm sm:text-base"
              disabled={gameOver}
            >
              End and exit game
            </button>
          </div>
        </div>
      </div>

      {/* Quit Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="text-white rounded-lg p-6 w-full max-w-md mx-auto text-center">
            <h2 className="text-xl font-bold text-red-500 mb-[30px]">Warning</h2>
            <p className="mb-[30px] text-base">
              {gameOver ? "Game over!" : "You are about to forfeit your game by quitting"}
            </p>
            <p className="mb-[30px] text-base">You could lose all rewards earned</p>
            {!gameOver && (
              <p className="mb-[30px] text-base">
                You still have <span className="font-bold">{countdown}</span> seconds left
              </p>
            )}
            <div className="flex justify-center gap-4">
              {!gameOver && (
                <button
                  onClick={handleBackToGame}
                  className="px-4 py-2 border border-white rounded-md hover:text-white transition-colors"
                >
                  Back to game
                </button>
              )}
              <button
                onClick={handleQuit}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors"
              >
                {gameOver ? "Exit game" : "Quit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;

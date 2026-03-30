'use client';
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function CosmicCatch({ onBack }: { onBack: () => void }) {
  const [score, setScore] = useState(0);
  const [targetPos, setTargetPos] = useState({ top: '50%', left: '50%' });
  
  // State baru untuk Timer dan Status Game
  const [timeLeft, setTimeLeft] = useState(20);
  const [isPlaying, setIsPlaying] = useState(false);

  // useEffect ke-1: Countdown Timer
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          toast.info(`Waktu Habis! Total Energi: ${score} 🌌`, { theme: "dark" });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup function
  }, [isPlaying, timeLeft, score]);

  // useEffect ke-2: Target pindah otomatis setiap 1.2 detik biar menantang
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const mover = setInterval(() => {
      moveTarget();
    }, 1200);

    return () => clearInterval(mover); // Cleanup function
  }, [isPlaying, timeLeft]);

  const moveTarget = () => {
    const top = Math.floor(Math.random() * 80) + 10 + '%';
    const left = Math.floor(Math.random() * 80) + 10 + '%';
    setTargetPos({ top, left });
  };

  const handleCatch = () => {
    if (!isPlaying) return; // Kalau game belum mulai, target nggak bisa diklik
    setScore(s => s + 100);
    moveTarget();
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(20);
    setIsPlaying(true);
    moveTarget();
  };

  return (
    <div className="flex-1 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-[#111827] to-black p-6 flex flex-col items-center w-full h-full border border-indigo-500/30">
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-1 tracking-wider drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
        COSMIC CATCH
      </h2>
      <p className="text-indigo-300 text-xs italic mb-4 border-b border-indigo-800 pb-4 w-full text-center">
        Catch the nebula before it fades into the void.
      </p>

      {/* Info Panel: Score & Time */}
      <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 mb-4 text-center shadow-[0_0_15px_rgba(0,0,0,0.5)] flex justify-between items-center px-8">
        <div>
          <h3 className="text-white text-[10px] uppercase tracking-widest">Time Left</h3>
          <p className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-indigo-300'}`}>
            {timeLeft}s
          </p>
        </div>
        <div className="text-right">
          <h3 className="text-white text-[10px] uppercase tracking-widest">Cosmic Energy</h3>
          <p className="text-2xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">{score}</p>
        </div>
      </div>

      {/* Area Game */}
      <div className="w-full h-48 bg-black/50 border border-indigo-500/50 rounded-lg relative overflow-hidden shadow-inner cursor-crosshair">
        {isPlaying ? (
          <button 
            onClick={handleCatch}
            style={{ top: targetPos.top, left: targetPos.left }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 text-3xl hover:scale-125 transition-transform drop-shadow-[0_0_15px_rgba(236,72,153,1)]"
          >
            🌌
          </button>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
            <button 
              onClick={startGame}
              className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold py-2 px-6 rounded-full tracking-widest uppercase transition shadow-[0_0_15px_rgba(34,211,238,0.5)] transform hover:scale-105"
            >
              {score > 0 ? "Play Again" : "Start Mission"}
            </button>
          </div>
        )}
      </div>

      <button onClick={onBack} className="bg-indigo-900/50 hover:bg-indigo-800 text-indigo-200 border border-indigo-500 text-xs font-bold py-2 px-6 rounded-full mt-auto tracking-widest uppercase transition shadow-[0_0_10px_rgba(99,102,241,0.3)]">
        Return to Hub
      </button>
    </div>
  );
}
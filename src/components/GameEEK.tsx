'use client';
import { useState, useEffect } from "react";

export default function GameEEK({ onBack }: { onBack: () => void }) {
  const [score, setScore] = useState(12);
  const [level, setLevel] = useState(1);
  const [clickPower, setClickPower] = useState(1);
  const [autoClick, setAutoClick] = useState(0);

  // Kalkulasi persentase XP untuk progress bar
  const xpNeeded = level * 50;
  const progress = Math.min((score / xpNeeded) * 100, 100);

  useEffect(() => {
    setLevel(Math.floor(score / 50) + 1);
  }, [score]);

  useEffect(() => {
    if (autoClick > 0) {
      const interval = setInterval(() => {
        setScore((prev) => prev + autoClick);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoClick]);

  const handleClick = () => setScore((prev) => prev + clickPower);

  return (
    <div className="flex-1 bg-gradient-to-b from-orange-500 to-orange-600 p-6 flex flex-col items-center w-full h-full">
      <h2 className="text-3xl font-bold text-yellow-300 drop-shadow-md mb-1">Game EEK 💩</h2>
      <p className="text-white text-sm italic mb-4 border-b border-orange-300 pb-4 w-full text-center">
        Sentuh untuk Eek 💩 sebanyak mungkin!
      </p>

      {/* Score & Level Box */}
      <div className="w-full border border-yellow-400 rounded-xl p-4 mb-6 bg-orange-500/50">
        <h3 className="text-white text-lg font-bold text-center mb-2">
          Skor: <span className="text-yellow-300">{score}</span> Level: <span className="text-yellow-300">{level}</span>
        </h3>
        <div className="w-full bg-gray-900 rounded-full h-3">
          <div className="bg-yellow-400 h-3 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Main Clicker Box */}
      <div className="w-full border-2 border-yellow-400 rounded-full py-8 mb-6 flex justify-center items-center bg-orange-500/30">
        <button 
          onClick={handleClick} 
          className="text-7xl transform active:scale-90 transition-transform hover:scale-110 drop-shadow-2xl select-none"
        >
          💩
        </button>
      </div>

      {/* Upgrades Grid */}
      <div className="grid grid-cols-2 gap-3 w-full mb-6">
        <button 
          onClick={() => { if(score >= 10) { setScore(s => s - 10); setClickPower(p => p + 1); } }}
          className={`py-2 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 ${score >= 10 ? 'bg-yellow-600 hover:bg-yellow-500 text-white border border-yellow-400' : 'bg-orange-800/50 text-orange-300 cursor-not-allowed'}`}
        >
          ➕ Upgrade Klik (💩 10)
        </button>
        <button 
          onClick={() => { if(score >= 20) { setScore(s => s - 20); setAutoClick(a => a + 1); } }}
          className={`py-2 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 ${score >= 20 ? 'bg-yellow-600 hover:bg-yellow-500 text-white border border-yellow-400' : 'bg-orange-800/50 text-orange-300 cursor-not-allowed'}`}
        >
          🆙 Auto Klik (💩 20)
        </button>
        <button disabled className="py-2 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 bg-orange-800/40 text-orange-400/50 cursor-not-allowed">
          ➕ Double Poin (💩 50)
        </button>
        <button disabled className="py-2 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 bg-orange-800/40 text-orange-400/50 cursor-not-allowed">
          ➕ x5 Poin (💩 100)
        </button>
      </div>

      <button onClick={onBack} className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold py-2 px-4 rounded-md mt-auto">
        Back to Game Selection
      </button>
    </div>
  );
}
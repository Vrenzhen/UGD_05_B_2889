'use client';
import { useState, useEffect } from "react";

export default function CosmicCatch({ onBack }: { onBack: () => void }) {
  const [score, setScore] = useState(0);
  const [targetPos, setTargetPos] = useState({ top: '50%', left: '50%' });

  const moveTarget = () => {
    const top = Math.floor(Math.random() * 80) + 10 + '%';
    const left = Math.floor(Math.random() * 80) + 10 + '%';
    setTargetPos({ top, left });
  };

  const handleCatch = () => {
    setScore(s => s + 100);
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

      <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 mb-4 text-center shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <h3 className="text-white text-sm uppercase tracking-widest">Cosmic Energy</h3>
        <p className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">{score}</p>
      </div>

      <div className="w-full h-48 bg-black/50 border border-indigo-500/50 rounded-lg relative overflow-hidden shadow-inner cursor-crosshair">
        <button 
          onClick={handleCatch}
          style={{ top: targetPos.top, left: targetPos.left }}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 text-3xl hover:scale-125 transition-transform drop-shadow-[0_0_15px_rgba(236,72,153,1)]"
        >
          🌌
        </button>
      </div>

      <button onClick={onBack} className="bg-indigo-900/50 hover:bg-indigo-800 text-indigo-200 border border-indigo-500 text-xs font-bold py-2 px-6 rounded-full mt-auto tracking-widest uppercase transition shadow-[0_0_10px_rgba(99,102,241,0.3)]">
        Return to Hub
      </button>
    </div>
  );
}
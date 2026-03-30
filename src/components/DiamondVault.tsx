'use client';
import { useState } from "react";

export default function DiamondVault({ onBack }: { onBack: () => void }) {
  const [balance, setBalance] = useState(1000);
  const [mining, setMining] = useState(false);

  const mineDiamond = () => {
    setMining(true);
    setTimeout(() => {
      const reward = Math.floor(Math.random() * 500) + 50;
      setBalance(b => b + reward);
      setMining(false);
    }, 600);
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-[#1a1a1a] to-black p-6 flex flex-col items-center w-full h-full border border-yellow-600/30">
      <h2 className="text-2xl font-serif font-bold text-yellow-500 mb-1 tracking-widest uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
        Diamond Vault
      </h2>
      <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] mb-4 border-b border-yellow-900/50 pb-4 w-full text-center">
        Exclusive Mining VIP Club
      </p>

      {/* Gold Card Balance */}
      <div className="w-full bg-gradient-to-tr from-yellow-700 via-yellow-500 to-yellow-200 p-[1px] rounded-xl mb-8 shadow-[0_10px_20px_rgba(202,138,4,0.15)]">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-5 w-full h-full">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Vault Balance</p>
          <p className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 font-bold">
            ${balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* The Diamond Button */}
      <button 
        onClick={mineDiamond}
        disabled={mining}
        className={`relative group rounded-full p-8 transition-all duration-300 ${mining ? 'opacity-50 scale-95' : 'hover:scale-110'}`}
      >
        <div className="absolute inset-0 bg-yellow-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
        <span className="text-7xl relative z-10 drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]">
          💎
        </span>
      </button>

      <p className="text-yellow-600 text-xs font-serif italic mt-4 mb-auto">
        {mining ? "Extracting precious gems..." : "Tap to mine diamonds"}
      </p>

      <button onClick={onBack} className="bg-transparent hover:bg-yellow-900/30 text-yellow-600 border border-yellow-700/50 text-xs font-bold py-2 px-8 rounded uppercase tracking-widest mt-auto transition duration-300">
        Exit Vault
      </button>
    </div>
  );
}
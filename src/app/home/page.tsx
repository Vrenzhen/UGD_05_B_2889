'use client'

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPowerOff } from "react-icons/fa";
import GameEEK from "@/components/GameEEK";
import PoopSurvivors from "@/components/PoopSurvivors";
import CosmicCatch from "@/components/CosmicCatch";
import DiamondVault from "@/components/DiamondVault";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeGame, setActiveGame] = useState<string | null>(null);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      router.push("/auth/not-authorized");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-blue-400 to-blue-600 font-sans">
      {/* Header */}
      <div className="mt-10 mb-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-3">Selamat Datang!</h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition transform hover:scale-105"
        >
          <FaPowerOff size={20} />
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md bg-[#111827] min-h-[500px] rounded-xl shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Menu Pilihan Game */}
        {!activeGame && (
          <div className="flex flex-col items-center justify-center flex-1 p-8">
            <h2 className="text-2xl font-bold text-white mb-8">Choose Your Game</h2>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-6">
              <button 
                onClick={() => setActiveGame('eek')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold py-3 px-2 rounded-lg shadow-md transition transform hover:scale-105 text-sm"
              >
                Game EEK 💩
              </button>
              
              <button 
                onClick={() => setActiveGame('survivors')}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-3 px-2 rounded-lg shadow-md transition transform hover:scale-105 text-sm"
              >
                Poop Survivors 🧻
              </button>

              <button 
                onClick={() => setActiveGame('cosmic')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-2 rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-purple-400 transition transform hover:scale-105 text-sm"
              >
                Cosmic Catch 🌌
              </button>

              <button 
                onClick={() => setActiveGame('diamond')}
                className="bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-yellow-500 font-bold py-3 px-2 rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.3)] border border-yellow-600 transition transform hover:scale-105 text-sm"
              >
                Diamond Vault 💎
              </button>
            </div>

            <p className="text-gray-400 text-xs italic mt-4">Pick one to start playing and reduce lag!</p>
          </div>
        )}

        {/* Render Komponen Game Aktif */}
        {activeGame === 'eek' && <GameEEK onBack={() => setActiveGame(null)} />}
        {activeGame === 'survivors' && <PoopSurvivors onBack={() => setActiveGame(null)} />}
        {activeGame === 'cosmic' && <CosmicCatch onBack={() => setActiveGame(null)} />}
        {activeGame === 'diamond' && <DiamondVault onBack={() => setActiveGame(null)} />}

      </div>
    </div>
  );
}
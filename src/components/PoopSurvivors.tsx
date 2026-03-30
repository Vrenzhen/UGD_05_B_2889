'use client';
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";

// Tipe data untuk entitas game
type Player = { x: number; y: number };
type Enemy = { id: number; x: number; y: number; hp: number; maxHp: number };
type Projectile = { id: number; x: number; y: number; targetId: number };

export default function PoopSurvivors({ onBack }: { onBack: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [health, setHealth] = useState(100);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);

  // State terpisah untuk merender posisi (diperbarui oleh game loop)
  const [player, setPlayer] = useState<Player>({ x: 50, y: 50 });
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);

  // Menggunakan useRef untuk state internal game agar tidak memicu re-render berlebih saat kalkulasi
  const gameState = useRef({
    player: { x: 50, y: 50 },
    enemies: [] as Enemy[],
    projectiles: [] as Projectile[],
    keys: { w: false, a: false, s: false, d: false },
    lastSpawn: 0,
    lastShoot: 0,
    health: 100,
    xp: 0,
    level: 1,
  });

  const requestRef = useRef<number | undefined>(undefined);

  // Handler Input Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (gameState.current.keys.hasOwnProperty(key)) {
        gameState.current.keys[key as keyof typeof gameState.current.keys] = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (gameState.current.keys.hasOwnProperty(key)) {
        gameState.current.keys[key as keyof typeof gameState.current.keys] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Main Game Loop
  const gameLoop = useCallback((time: number) => {
    if (!isPlaying) return;
    const state = gameState.current;

    // 1. Pergerakan Player (WASD) - Dibatasi dari 0% hingga 100%
    const speed = 0.5;
    if (state.keys.w) state.player.y = Math.max(0, state.player.y - speed);
    if (state.keys.s) state.player.y = Math.min(100, state.player.y + speed);
    if (state.keys.a) state.player.x = Math.max(0, state.player.x - speed);
    if (state.keys.d) state.player.x = Math.min(100, state.player.x + speed);

    // 2. Spawning Musuh (Setiap 2 detik)
    if (time - state.lastSpawn > 2000) {
      const side = Math.floor(Math.random() * 4);
      let ex = 50, ey = 50;
      if (side === 0) { ex = Math.random() * 100; ey = 0; } // Atas
      else if (side === 1) { ex = 100; ey = Math.random() * 100; } // Kanan
      else if (side === 2) { ex = Math.random() * 100; ey = 100; } // Bawah
      else { ex = 0; ey = Math.random() * 100; } // Kiri

      state.enemies.push({ id: Date.now(), x: ex, y: ey, hp: 40, maxHp: 40 });
      state.lastSpawn = time;
    }

    // 3. Auto-Shooting (Setiap 1 detik)
    if (time - state.lastShoot > 1000 && state.enemies.length > 0) {
      // Cari musuh terdekat
      let closest = state.enemies[0];
      let minDist = Infinity;
      state.enemies.forEach(e => {
        const dist = Math.hypot(e.x - state.player.x, e.y - state.player.y);
        if (dist < minDist) { minDist = dist; closest = e; }
      });

      state.projectiles.push({ id: Date.now(), x: state.player.x, y: state.player.y, targetId: closest.id });
      state.lastShoot = time;
    }

    // 4. Update Peluru (Projectiles)
    state.projectiles.forEach((p, pIndex) => {
      const target = state.enemies.find(e => e.id === p.targetId);
      if (target) {
        const angle = Math.atan2(target.y - p.y, target.x - p.x);
        p.x += Math.cos(angle) * 2; // Kecepatan peluru
        p.y += Math.sin(angle) * 2;

        // Deteksi tabrakan peluru dengan musuh
        if (Math.hypot(target.x - p.x, target.y - p.y) < 3) {
          target.hp -= 10; // Damage Toilet Paper
          state.projectiles.splice(pIndex, 1);
        }
      } else {
        // Hapus peluru jika target sudah mati
        state.projectiles.splice(pIndex, 1);
      }
    });

    // 5. Update Musuh & Tabrakan dengan Player
    state.enemies.forEach((e, eIndex) => {
      const angle = Math.atan2(state.player.y - e.y, state.player.x - e.x);
      e.x += Math.cos(angle) * 0.2; // Kecepatan musuh
      e.y += Math.sin(angle) * 0.2;

      // Jika musuh menyentuh player
      if (Math.hypot(state.player.x - e.x, state.player.y - e.y) < 3) {
        state.health -= 0.5; // Drain health perlahan
      }

      // Jika musuh mati
      if (e.hp <= 0) {
        state.enemies.splice(eIndex, 1);
        state.xp += 10;
        if (state.xp >= 50) {
          state.level += 1;
          state.xp = 0;
          state.health = Math.min(100, state.health + 20); // Heal saat level up
        }
      }
    });

    // Cek Game Over
    if (state.health <= 0) {
      setIsPlaying(false);
      toast.error("Game Over! Kamu termakan oleh Poop! 💩", { theme: "dark" });
      state.health = 100;
      state.xp = 0;
      state.level = 1;
      state.enemies = [];
      state.projectiles = [];
      state.player = { x: 50, y: 50 };
    }

    // Sinkronisasi state ke React untuk di-render
    setPlayer({ ...state.player });
    setEnemies([...state.enemies]);
    setProjectiles([...state.projectiles]);
    setHealth(Math.max(0, Math.floor(state.health)));
    setXp(state.xp);
    setLevel(state.level);

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [isPlaying]);

  // Efek untuk menjalankan/menghentikan game
  useEffect(() => {
    if (isPlaying) {
      toast.info("🧻 Survival Started!", { theme: "dark", autoClose: 2000 });
      gameState.current.lastSpawn = performance.now();
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, gameLoop]);

  return (
    <div className="flex-1 bg-green-500 p-6 flex flex-col items-center w-full h-full rounded-b-xl border border-green-400">
      <h2 className="text-3xl font-bold text-white drop-shadow-md mb-2 flex items-center gap-2">
        Poop Survivors 🧻
      </h2>
      <p className="text-white text-xs italic mb-4 border-b border-green-400 pb-4 w-full text-center px-4">
        Survive waves of poop with WASD and auto-shooting at the nearest enemy!
      </p>

      {/* Main Game Container */}
      <div className="w-full border border-green-400 rounded-xl p-4 mb-4 bg-green-600/30">
        <div className="flex justify-between text-white text-sm mb-2 font-semibold">
          <span>Health: <span className="text-green-300">{health}</span></span>
          <span>Level: <span className="text-green-300">{level}</span> (XP: {xp}/50)</span>
        </div>
        
        {/* Layar Game / Canvas Arena */}
        <div className="w-full h-64 bg-[#1f2937] rounded-lg relative overflow-hidden shadow-inner border-2 border-gray-800">
          
          {/* Render Player */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 text-2xl z-20"
            style={{ left: `${player.x}%`, top: `${player.y}%` }}
          >
            🧻
          </div>

          {/* Render Musuh */}
          {enemies.map((enemy) => (
            <div 
              key={enemy.id} 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
              style={{ left: `${enemy.x}%`, top: `${enemy.y}%` }}
            >
              <div className="text-red-500 text-[10px] font-bold border-b border-red-500 mb-0.5">
                {enemy.hp}/{enemy.maxHp}
              </div>
              <span className="text-xl">💩</span>
            </div>
          ))}

          {/* Render Peluru (Air) */}
          {projectiles.map((proj) => (
            <div 
              key={proj.id} 
              className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_5px_#60a5fa] transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: `${proj.x}%`, top: `${proj.y}%` }}
            />
          ))}

          {!isPlaying && health === 100 && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white/50 text-sm italic z-30">
                Tekan Start Survival untuk bermain
             </div>
          )}
        </div>
      </div>

      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3 rounded-lg shadow-md transition transform hover:scale-[1.02] text-sm mb-4 border border-green-500 flex justify-center items-center gap-2"
      >
        🧻 {isPlaying ? "Stop Survival" : "Start Survival"}
      </button>

      {/* Info Stats (Persis Gambar) */}
      <div className="text-center text-white text-xs mb-4">
        <p className="font-semibold mb-1">Weapons:</p>
        <ul className="list-disc list-inside text-green-100 mb-2 space-y-1">
          <li>Toilet Paper Roll (Dmg: 10, CD: 1000ms)</li>
          <li>Water Projectile (Dmg: 20, CD: 500ms)</li>
        </ul>
        <p className="font-semibold">Controls: W (Up), A (Left), S (Down), D (Right) - Auto-shoots nearest enemy!</p>
      </div>

      <button onClick={onBack} className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold py-2 px-6 rounded-md mt-auto shadow-lg transition">
        Back to Game Selection
      </button>
    </div>
  );
}
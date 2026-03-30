'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NotAuthorized() {
  const router = useRouter();

  // Redirect otomatis ke halaman login setelah 3 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/auth/login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 w-full">
      {/* Card Wrapper */}
      <div className="bg-[#eef2ff] rounded-2xl shadow-xl text-center max-w-sm w-full overflow-hidden border border-white/50">
        
        {/* Gambar Pemandangan (Menyerupai referensi di modul) */}
        <div className="w-full h-48 bg-gray-200 relative">
          <img
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Not Authorized"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Bagian Konten */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <span className="text-red-500">❌</span> Anda belum login
          </h2>
          
          <p className="text-gray-500 text-sm mb-6">
            Silakan login terlebih dahulu.
            <br />
            <span className="text-xs text-gray-400 mt-1 inline-block">
              Anda akan diarahkan ke halaman login...
            </span>
          </p>
          
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-8 rounded-lg transition-colors inline-flex items-center gap-2 shadow-md"
          >
            <span>←</span> Kembali
          </button>
        </div>

      </div>
    </div>
  );
}
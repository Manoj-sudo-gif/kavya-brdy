import React from 'react';
import { Heart } from 'lucide-react';
import { FloatingHeartsCanvas } from './components/FloatingHeartsCanvas';
import { FloatingAudioPlayer } from './components/FloatingAudioPlayer';
import { LevelJourney } from './components/LevelJourney';
import { MusicProvider } from './context/MusicContext';

export default function App() {
  return (
    <MusicProvider>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#fff0f4] via-[#ffe4ec] to-[#ffd7e3] text-[#4a2e35] font-sans-body selection:bg-pink-300 selection:text-rose-950">
        {/* 3D Floating Hearts and Twinkling Canvas Background */}
        <FloatingHeartsCanvas />

        {/* Floating Glassmorphic Audio Player fixed at top-right */}
        <FloatingAudioPlayer />

        {/* Main Dynamic Container */}
        <main className="relative z-10 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 pt-4 sm:pt-6 pb-10 flex flex-col items-center">
          {/* Dynamic Frame-by-Frame Level Journey */}
          <div className="w-full">
            <LevelJourney />
          </div>

          {/* Romantic Tanglish Footer Note */}
          <footer id="romantic-footer" className="mt-8 sm:mt-10 text-center space-y-2 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 text-rose-400">
              <span className="w-8 h-[1px] bg-pink-300" />
              <Heart className="w-4 h-4 text-rose-500 fill-current animate-bounce" />
              <span className="w-8 h-[1px] bg-pink-300" />
            </div>

            <p className="font-handwriting text-2xl sm:text-3xl text-rose-900 font-semibold leading-relaxed">
              "Ennaikuumee un sirippu dhaan en happiness d Bujjulu Kutty. Happy Birthday once again!"
            </p>

            <p className="text-[11px] sm:text-xs text-rose-700/80">
              Made with boundless love for <strong className="text-rose-950">Kaviya</strong> • Born September 25, 2004
            </p>
          </footer>
        </main>
      </div>
    </MusicProvider>
  );
}

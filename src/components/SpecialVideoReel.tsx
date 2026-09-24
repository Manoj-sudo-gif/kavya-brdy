import React, { useEffect, useRef } from 'react';
import { Film, Heart, Volume2, VolumeX, PartyPopper } from 'lucide-react';
import { triggerGrandFireworksConfetti } from '../utils/confetti';
import { useMusic } from '../context/MusicContext';

// ScreenPal embed URL provided by the user
export const DEFAULT_SPECIAL_VIDEO_URL =
  'https://go.screenpal.com/player/cOQZDmnxDMM?ff=1&ahc=1&dcc=1&tl=1&bg=transparent&share=1&download=1&embed=1&cl=1';

interface SpecialVideoReelProps {
  onBackToPhotos?: () => void;
}

export const SpecialVideoReel: React.FC<SpecialVideoReelProps> = () => {
  const { isVideoPlaying, setIsVideoPlaying } = useMusic();

  // CRITICAL REQUIREMENT:
  // "adhey maari final video section vara apo vandhu background music vandhu stop aagiranum"
  // When arriving at the final video section, immediately pause/stop the background music!
  // When leaving this section, resume background music!
  useEffect(() => {
    setIsVideoPlaying(true);

    return () => {
      setIsVideoPlaying(false);
    };
  }, [setIsVideoPlaying]);

  // Dynamically load ScreenPal appearance script
  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://go.screenpal.com/player/appearance/cOQZDmnxDMM"]'
    );
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://go.screenpal.com/player/appearance/cOQZDmnxDMM';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div id="special-video-reel-container" className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header Card - Clean & Romantic */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 text-center border-2 border-pink-200 shadow-xl relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 border border-pink-300 text-rose-800 text-xs font-semibold uppercase tracking-wider mb-2">
          <Film className="w-3.5 h-3.5 text-rose-500" />
          <span>ScreenPal 9:16 Special Reel Format</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
        </div>

        <h2 className="font-handwriting text-3xl sm:text-4xl font-bold text-rose-950 mb-1.5">
          En Uyir Kaviya-kaga Oru Special Birthday Reel! 🎬💖
        </h2>
        <p className="text-xs sm:text-sm text-rose-800/90 max-w-md mx-auto leading-relaxed">
          Nee en life-la vandhadhuku oru kadhal video gift... Indha 9:16 reel full-ah paaru D Bujjulu Kutty! 🥰
        </p>

        {/* Video & BGM Synchronization Status Banner */}
        <div className="mt-3.5 max-w-sm mx-auto py-1.5 px-3 rounded-xl border flex items-center justify-between text-xs font-medium bg-rose-50/95 border-rose-300 shadow-2xs">
          <div className="flex items-center gap-2 text-rose-900">
            {isVideoPlaying ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span className="font-semibold text-rose-800">Final Video Section • BGM Paused 🔇</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-rose-600" />
                <span>BGM Active 🎵</span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            className="px-2.5 py-0.5 rounded-lg bg-white border border-pink-300 text-rose-700 hover:bg-pink-100 text-[10px] font-semibold transition cursor-pointer"
          >
            {isVideoPlaying ? 'Resume BGM' : 'Pause BGM'}
          </button>
        </div>

        {/* Celebrate Confetti Trigger */}
        <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={triggerGrandFireworksConfetti}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <PartyPopper className="w-3.5 h-3.5" />
            <span>Celebrate Kaviya's Birthday 🎆</span>
          </button>
        </div>
      </div>

      {/* 9:16 Vertical Reel Cinema Frame - Clean ScreenPal Embed */}
      <div className="flex justify-center">
        <div className="w-full max-w-[340px] sm:max-w-[360px] glass-card rounded-3xl p-3 sm:p-4 border-2 border-pink-300 shadow-2xl bg-gradient-to-b from-rose-950/95 to-rose-900/95 text-center">
          {/* Reel Frame Top Bar */}
          <div className="flex items-center justify-between px-2 py-1.5 text-rose-200 text-xs border-b border-rose-800/60 mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-semibold text-[11px] tracking-wide uppercase">9:16 Reel Player</span>
            </div>
            <span className="text-rose-300/80 font-mono text-[10px]">ScreenPal Video</span>
          </div>

          {/* User's Exact ScreenPal Embed Player structure */}
          <div className="w-full rounded-2xl overflow-hidden bg-black/95 shadow-inner border border-rose-700/50">
            <div
              className="sp-embed-player"
              data-id="cOQZDmnxDMM"
              data-aspect-ratio="0.450000"
              data-padding-top="222.222222%"
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '222.222222%',
                height: 0,
              }}
            >
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
                scrolling="no"
                src={DEFAULT_SPECIAL_VIDEO_URL}
                allow="fullscreen *; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Special 9:16 Birthday Video for Kaviya"
                className="rounded-2xl"
              />
            </div>
          </div>

          {/* Bottom Romantic Caption */}
          <div className="mt-3 px-2 text-center text-rose-200">
            <p className="font-handwriting text-lg sm:text-xl text-pink-200 font-semibold leading-tight">
              "Un kooda irukkura ovvoru nimishamum en vaazhkaiyoda golden memory D Kaviya! ❤️"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

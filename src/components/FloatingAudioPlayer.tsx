import React, { useState, useRef, useEffect } from 'react';
import { Music, Disc3, Play, Pause, SkipForward, SkipBack, ChevronDown, ChevronUp, Link as LinkIcon, Heart, RotateCw, Video } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const FloatingAudioPlayer: React.FC = () => {
  // Start open so user immediately sees the Spotify player and romantic songs
  const [isOpen, setIsOpen] = useState(true);
  const [customInput, setCustomInput] = useState('');
  const mountRef = useRef<HTMLDivElement>(null);
  const initializedControllerRef = useRef(false);

  const {
    playlist,
    currentTrackIndex,
    currentTrack,
    isPlaying,
    isVideoPlaying,
    hasStartedPlayback,
    setIsVideoPlaying,
    playTrackAtIndex,
    nextTrack,
    prevTrack,
    togglePlay,
    startAutoplay,
    setCustomTrackId,
    registerController,
  } = useMusic();

  // Initialize Spotify IFrame API Controller on permanent mountRef
  useEffect(() => {
    let isCancelled = false;

    const initSpotify = () => {
      if (isCancelled) return;
      const IFrameAPI = (window as any).IFrameAPI || (window as any).SpotifyIframeApi;
      if (!IFrameAPI || !mountRef.current || initializedControllerRef.current) return;

      initializedControllerRef.current = true;

      const options = {
        uri: `spotify:track:${currentTrack.id}`,
        width: '100%',
        height: '152',
      };

      try {
        IFrameAPI.createController(mountRef.current, options, (controller: any) => {
          if (isCancelled) return;
          registerController(controller);
        });
      } catch (err) {
        console.warn('Failed to create Spotify controller:', err);
      }
    };

    if ((window as any).IFrameAPI) {
      initSpotify();
    } else if (Array.isArray((window as any).__spotifyIframeApiReadyQueue)) {
      (window as any).__spotifyIframeApiReadyQueue.push(initSpotify);
    } else {
      const prevCallback = (window as any).onSpotifyIframeApiReady;
      (window as any).onSpotifyIframeApiReady = (IFrameAPI: any) => {
        (window as any).IFrameAPI = IFrameAPI;
        if (typeof prevCallback === 'function') {
          try {
            prevCallback(IFrameAPI);
          } catch {
            // ignore
          }
        }
        initSpotify();
      };
    }

    return () => {
      isCancelled = true;
    };
  }, [currentTrack.id, registerController]);

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      setCustomTrackId(customInput.trim());
      setCustomInput('');
    }
  };

  const isActuallyPlaying = isPlaying && !isVideoPlaying;

  return (
    <div id="floating-audio-player-container" className="fixed top-3 right-3 sm:top-5 sm:right-5 z-40 flex flex-col items-end">
      {/* Floating Header Pill */}
      <div
        id="audio-player-pill"
        className="glass-player px-3.5 py-2 rounded-full flex items-center gap-2.5 shadow-lg border border-pink-200/90 hover:border-pink-300 transition-all duration-300 hover:scale-[1.02] select-none cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-sm shrink-0">
          <Disc3 className={`w-4 h-4 ${isActuallyPlaying ? 'animate-spin' : ''}`} />
          {isActuallyPlaying && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-400 border border-white animate-ping" />
          )}
        </div>

        {/* Soundwave Visualizer Bars */}
        <div className="flex items-center gap-0.5 h-4 px-1" title="Romantic Soundwave">
          <span className={`w-1 bg-pink-500 rounded-full h-3 ${isActuallyPlaying ? 'animate-pulse' : 'opacity-35'}`} />
          <span className={`w-1 bg-rose-400 rounded-full h-4 ${isActuallyPlaying ? 'animate-bounce' : 'opacity-35'}`} style={{ animationDelay: '150ms' }} />
          <span className={`w-1 bg-pink-400 rounded-full h-2 ${isActuallyPlaying ? 'animate-pulse' : 'opacity-35'}`} style={{ animationDelay: '300ms' }} />
          <span className={`w-1 bg-rose-500 rounded-full h-3.5 ${isActuallyPlaying ? 'animate-bounce' : 'opacity-35'}`} style={{ animationDelay: '450ms' }} />
        </div>

        {/* Track status text */}
        <div className="flex flex-col text-left">
          <span className="text-[11px] font-bold text-rose-800 tracking-wide flex items-center gap-1">
            <span>BGM {currentTrackIndex + 1}/3</span>
            <span className="text-[10px] text-rose-500 hidden sm:inline">• {currentTrack.title}</span>
          </span>
          {!hasStartedPlayback && (
            <span className="text-[9px] text-rose-600 font-semibold animate-pulse">
              Tap to Play 🎵
            </span>
          )}
        </div>

        {/* Quick Play/Pause button directly on the pill */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!hasStartedPlayback) {
              startAutoplay();
            } else {
              togglePlay();
            }
          }}
          className="p-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-xs transition active:scale-90 ml-1"
          title={isActuallyPlaying ? 'Pause BGM' : 'Play BGM'}
        >
          {isActuallyPlaying ? (
            <Pause className="w-3 h-3 fill-current" />
          ) : (
            <Play className="w-3 h-3 fill-current ml-0.5" />
          )}
        </button>

        <div className="text-rose-500 hover:text-rose-700 transition">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expandable Glassmorphic Player Card (ALWAYS in DOM to preserve Spotify Iframe controller) */}
      <div
        id="audio-player-modal"
        className={`mt-2.5 w-[320px] sm:w-[360px] glass-player p-4 rounded-2xl shadow-2xl border border-pink-200/90 text-rose-950 transition-all duration-300 origin-top-right ${
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto block'
            : 'opacity-0 scale-95 pointer-events-none hidden'
        }`}
      >
        {/* Header without shine stars */}
        <div className="flex items-center justify-between pb-2.5 border-b border-pink-100 mb-3">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-rose-600" />
            <h4 className="text-sm font-semibold font-sans-body text-rose-900">
              Kaviya's Romantic BGM
            </h4>
          </div>

          {/* Cyclic Loop Badge */}
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-100 text-rose-700 text-[10px] font-semibold border border-pink-200">
            <RotateCw className="w-3 h-3 text-rose-500" />
            <span>Auto-Loop: 1 ➔ 2 ➔ 3</span>
          </div>
        </div>

        {/* Video Playing Notice Banner */}
        {isVideoPlaying && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-1.5 font-medium">
              <Video className="w-3.5 h-3.5 text-amber-600" />
              <span>Video playing • BGM paused</span>
            </div>
            <button
              type="button"
              onClick={() => setIsVideoPlaying(false)}
              className="text-[10px] font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
            >
              Resume BGM
            </button>
          </div>
        )}

        {/* Friendly Autoplay prompt if browser requires user gesture */}
        {!hasStartedPlayback && !isVideoPlaying && (
          <div
            onClick={startAutoplay}
            className="mb-3 p-2.5 rounded-xl bg-gradient-to-r from-rose-50 to-pink-100 border border-rose-300/80 text-rose-900 text-xs flex items-center justify-between gap-2 cursor-pointer hover:bg-rose-100/90 transition shadow-xs"
          >
            <div className="flex items-center gap-2">
              <span className="text-base animate-bounce">🎵</span>
              <span className="font-semibold text-[11px] leading-tight">
                Click here or tap screen to start Song 1!
              </span>
            </div>
            <span className="px-2 py-1 bg-rose-500 text-white rounded-lg text-[10px] font-bold shrink-0">
              Play Now ▶️
            </span>
          </div>
        )}

        <p className="text-[11px] text-rose-700/90 mb-2.5 leading-relaxed font-medium">
          3 Spotify romantic songs cyclic loop-la automatic-ah play aagum:
        </p>

        {/* 3 Spotify Songs Selected by User (Clean, no shine stars) */}
        <div className="flex flex-col gap-1.5 mb-3">
          {playlist.slice(0, 3).map((track, idx) => {
            const isSelected = currentTrackIndex === idx;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => playTrackAtIndex(idx)}
                className={`w-full text-left text-xs px-3 py-2 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-rose-500 text-white border-rose-500 shadow-xs font-semibold'
                    : 'bg-white/85 text-rose-900 border-pink-200 hover:bg-pink-100/70'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                      isSelected ? 'bg-white/20 text-white font-bold' : 'bg-pink-100 text-rose-700'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="truncate">{track.title}</span>
                </div>
                {isSelected ? (
                  <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded text-white font-medium flex items-center gap-1 shrink-0 ml-1">
                    {isActuallyPlaying ? 'Playing' : 'Ready / Paused'}
                  </span>
                ) : (
                  <span className="text-[10px] text-rose-400 shrink-0 ml-1">Play</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Track Controls Bar */}
        <div className="flex items-center justify-between px-2 py-1.5 mb-3 bg-pink-50/80 rounded-xl border border-pink-200/60">
          <button
            type="button"
            onClick={prevTrack}
            className="p-1.5 rounded-lg text-rose-700 hover:bg-pink-200/60 transition active:scale-95 cursor-pointer"
            title="Previous Track"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
            >
              {isActuallyPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play BGM</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={nextTrack}
            className="p-1.5 rounded-lg text-rose-700 hover:bg-pink-200/60 transition active:scale-95 cursor-pointer"
            title="Next Track"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Persistent Spotify Embed Player Container */}
        <div className="rounded-xl overflow-hidden shadow-inner bg-pink-50/50 mb-3 border border-pink-200/60">
          {/* Mount slot for Spotify IFrame API controller */}
          <div id="spotify-player-mount" ref={mountRef} className="w-full min-h-[152px]" />
        </div>

        {/* Custom Spotify Song Link Input */}
        <form onSubmit={handleApplyCustomUrl} className="space-y-1.5">
          <div className="flex gap-1.5">
            <div className="relative flex-1">
              <LinkIcon className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-rose-400" />
              <input
                id="spotify-url-input"
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Paste another Spotify track link..."
                className="w-full pl-8 pr-2.5 py-1.5 text-[11px] rounded-lg bg-white/90 border border-pink-200 text-rose-900 placeholder:text-rose-300 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition"
              />
            </div>
            <button
              id="apply-spotify-url-button"
              type="submit"
              className="px-2.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-medium rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
            >
              Load
            </button>
          </div>
        </form>

        {/* Romantic Footer Note inside player */}
        <div className="mt-3 pt-2.5 border-t border-pink-100 flex items-center justify-between text-[10px] text-rose-600 font-medium">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
            <span>Kaviya's Favorite Playlist</span>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-rose-400 hover:text-rose-700 underline text-[10px] cursor-pointer"
          >
            Minimize
          </button>
        </div>
      </div>
    </div>
  );
};

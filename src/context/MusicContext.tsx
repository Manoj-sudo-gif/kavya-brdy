import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

export interface SpotifyTrack {
  id: string;
  title: string;
  movie: string;
  url: string;
  audioUrl?: string;
}

export const SPOTIFY_PLAYLIST: SpotifyTrack[] = [
  {
    id: '00bHxCcteaAJhU5WiP1mtf',
    title: 'Unakkenna Venum Sollu',
    movie: 'Yennai Arindhaal',
    url: 'https://open.spotify.com/track/00bHxCcteaAJhU5WiP1mtf?si=NTO1Nqq4SA2Jy5pZgUGT3w',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/40/66/ed/4066ed37-8d03-743a-16f7-6a0104057746/mzaf_18212222963345390860.plus.aac.p.m4a',
  },
  {
    id: '1AbSrAwrzuC3FcDXoYi3ED',
    title: 'Naan Nee',
    movie: 'Madras',
    url: 'https://open.spotify.com/track/1AbSrAwrzuC3FcDXoYi3ED?si=wu9VmCIvQ5ygpNwCFv31rg',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/df/2f/7c/df2f7c11-5eda-653e-0603-396fbe4dd9b4/mzaf_2023800355482785697.plus.aac.p.m4a',
  },
  {
    id: '3B4Wf3Fo11BXSuVPi1dtDO',
    title: 'Oh Oh (First Love of Tamizh)',
    movie: 'Thanga Magan',
    url: 'https://open.spotify.com/track/3B4Wf3Fo11BXSuVPi1dtDO?si=RGyOaPEVQc6kdjRpiwPrlQ',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ea/ec/90/eaec9087-06b0-57a5-3dc6-b2ac77b0e932/mzaf_5054047264390580296.plus.aac.p.m4a',
  },
];

interface MusicContextType {
  playlist: SpotifyTrack[];
  currentTrackIndex: number;
  currentTrack: SpotifyTrack;
  isPlaying: boolean;
  isVideoPlaying: boolean;
  hasStartedPlayback: boolean;
  setIsVideoPlaying: (playing: boolean) => void;
  playTrackAtIndex: (index: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  togglePlay: () => void;
  startAutoplay: () => void;
  setCustomTrackId: (id: string) => void;
  registerController: (controller: any) => void;
  userInteracted: boolean;
  setUserInteracted: (val: boolean) => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: any) => void;
    IFrameAPI?: any;
    SpotifyIframeApi?: any;
    __spotifyIframeApiReadyQueue?: Array<(IFrameAPI: any) => void> | null;
  }
}

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlist, setPlaylist] = useState<SpotifyTrack[]>(SPOTIFY_PLAYLIST);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoPlaying, setIsVideoPlayingState] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false);

  const playlistRef = useRef<SpotifyTrack[]>(SPOTIFY_PLAYLIST);
  const controllerRef = useRef<any>(null);
  const currentTrackIndexRef = useRef(0);
  const isVideoPlayingRef = useRef(false);
  const shouldPlayRef = useRef(true);
  const wasPlayingBeforeVideoRef = useRef(true);
  const isPlaybackActiveRef = useRef(false);
  const isAdvancingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync refs
  playlistRef.current = playlist;
  currentTrackIndexRef.current = currentTrackIndex;

  const currentTrack = playlist[currentTrackIndex] || SPOTIFY_PLAYLIST[0];

  // Helper to extract track id from URL or raw ID
  const extractTrackId = (input: string): string | null => {
    if (!input) return null;
    const clean = input.trim();
    const trackMatch = clean.match(/track\/([a-zA-Z0-9]+)/);
    if (trackMatch && trackMatch[1]) return trackMatch[1];
    const uriMatch = clean.match(/spotify:track:([a-zA-Z0-9]+)/);
    if (uriMatch && uriMatch[1]) return uriMatch[1];
    if (/^[a-zA-Z0-9]{22}$/.test(clean)) return clean;
    return null;
  };

  // Play a specific track index strictly (one song at a time, never overlapping)
  const playTrackAtIndex = useCallback((index: number, forceReload = false) => {
    const list = playlistRef.current;
    const validIndex = ((index % list.length) + list.length) % list.length;
    
    // If already playing this track actively and not forced, keep playing smoothly
    if (!forceReload && validIndex === currentTrackIndexRef.current && isPlaybackActiveRef.current && isPlaying) {
      return;
    }

    setCurrentTrackIndex(validIndex);
    currentTrackIndexRef.current = validIndex;
    setIsPlaying(true);
    shouldPlayRef.current = true;

    const track = list[validIndex];
    if (!track) return;

    // SINGLE-ENGINE RULE:
    // If track has audioUrl, HTML5 Audio element is the SOLE audio generator.
    // Spotify Controller must NOT produce duplicate sound!
    if (track.audioUrl && audioRef.current) {
      try {
        // Stop any current sound completely before starting the new track
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = track.audioUrl;
        audioRef.current.load();

        if (!isVideoPlayingRef.current && shouldPlayRef.current) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                isPlaybackActiveRef.current = true;
                setHasStartedPlayback(true);
                setIsPlaying(true);
              })
              .catch((err) => {
                console.log('Audio playback pending user gesture:', err.message);
              });
          }
        }
      } catch (err) {
        console.warn('Audio element error:', err);
      }

      // Update Spotify embed visual album art ONLY, pause its audio so it NEVER overlaps!
      if (controllerRef.current) {
        try {
          controllerRef.current.loadUri(`spotify:track:${track.id}`);
          controllerRef.current.pause?.();
        } catch {
          // ignore
        }
      }
    } else {
      // Custom track without audioUrl: pause HTML5 audio and let Spotify controller play it
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (controllerRef.current && !isVideoPlayingRef.current && shouldPlayRef.current) {
        try {
          controllerRef.current.loadUri(`spotify:track:${track.id}`);
          setTimeout(() => {
            if (!isVideoPlayingRef.current && shouldPlayRef.current) {
              controllerRef.current?.play?.();
            }
          }, 300);
        } catch (err) {
          console.warn('Spotify controller error:', err);
        }
      }
    }
  }, [isPlaying]);

  // Next track in loop (0 -> 1 -> 2 -> 0...)
  const nextTrack = useCallback(() => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;
    const nextIdx = (currentTrackIndexRef.current + 1) % playlistRef.current.length;
    playTrackAtIndex(nextIdx, true);
    setTimeout(() => {
      isAdvancingRef.current = false;
    }, 600);
  }, [playTrackAtIndex]);

  // Prev track
  const prevTrack = useCallback(() => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;
    const prevIdx = ((currentTrackIndexRef.current - 1) % playlistRef.current.length + playlistRef.current.length) % playlistRef.current.length;
    playTrackAtIndex(prevIdx, true);
    setTimeout(() => {
      isAdvancingRef.current = false;
    }, 600);
  }, [playTrackAtIndex]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      shouldPlayRef.current = false;
      isPlaybackActiveRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (controllerRef.current) {
        try {
          controllerRef.current.pause?.();
        } catch {
          // ignore
        }
      }
      setIsPlaying(false);
    } else {
      shouldPlayRef.current = true;
      if (!isVideoPlayingRef.current) {
        const track = playlistRef.current[currentTrackIndexRef.current];
        if (track?.audioUrl && audioRef.current) {
          audioRef.current.play().catch(() => {});
        } else if (controllerRef.current) {
          try {
            controllerRef.current.resume?.();
            controllerRef.current.play?.();
          } catch {
            // ignore
          }
        }
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  // Start Autoplay method - called by touch/welcome interactions or button clicks
  const startAutoplay = useCallback(() => {
    setUserInteracted(true);
    shouldPlayRef.current = true;

    // If already actively playing without issue, avoid calling play() to prevent any glitch
    if (isPlaybackActiveRef.current && !isVideoPlayingRef.current) {
      return;
    }

    setIsPlaying(true);
    const track = playlistRef.current[currentTrackIndexRef.current];

    // Play native HTML5 Audio
    if (track?.audioUrl && audioRef.current && !isVideoPlayingRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isPlaybackActiveRef.current = true;
            setHasStartedPlayback(true);
            setIsPlaying(true);
          })
          .catch((err) => {
            console.log('Autoplay waiting for touch:', err.message);
          });
      }
    } else if (controllerRef.current && !isVideoPlayingRef.current) {
      try {
        controllerRef.current.resume?.();
        controllerRef.current.play?.();
      } catch (err) {
        console.warn('Autoplay Spotify error:', err);
      }
    }
  }, []);

  // Handle custom user-provided Spotify link
  const setCustomTrackId = useCallback((rawInput: string) => {
    const id = extractTrackId(rawInput);
    if (!id) return;
    const existingIndex = playlistRef.current.findIndex((t) => t.id === id);
    if (existingIndex !== -1) {
      playTrackAtIndex(existingIndex, true);
    } else {
      const newTrack: SpotifyTrack = {
        id,
        title: 'Custom Romantic Track',
        movie: 'Spotify Song',
        url: `https://open.spotify.com/track/${id}`,
      };
      setPlaylist((prev) => [...prev, newTrack]);
      playlistRef.current = [...playlistRef.current, newTrack];
      const newIndex = playlistRef.current.length - 1;
      setCurrentTrackIndex(newIndex);
      currentTrackIndexRef.current = newIndex;
      setIsPlaying(true);
      shouldPlayRef.current = true;
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (controllerRef.current) {
        try {
          controllerRef.current.loadUri(`spotify:track:${id}`);
          setTimeout(() => {
            controllerRef.current?.play?.();
          }, 300);
        } catch {
          // ignore
        }
      }
    }
  }, [playTrackAtIndex]);

  // Sync with Spotify Iframe Controller API events
  const registerController = useCallback((controller: any) => {
    controllerRef.current = controller;

    // Spotify Controller is used for visual display and metadata
    // We only play audio on it if the current track has NO audioUrl (custom track)
    const track = playlistRef.current[currentTrackIndexRef.current];
    if (track && !track.audioUrl && shouldPlayRef.current && !isVideoPlayingRef.current) {
      try {
        controller.play?.();
      } catch {
        // ignore
      }
    }

    try {
      controller.addListener('playback_update', (e: any) => {
        const data = e?.data || e;
        const position = data?.position ?? 0;
        const isPaused = data?.isPaused ?? false;

        const currentT = playlistRef.current[currentTrackIndexRef.current];
        // Only track Spotify playback state if it is a custom track (no audioUrl)
        if (!currentT?.audioUrl) {
          if (position > 0 && !isPaused) {
            isPlaybackActiveRef.current = true;
            setHasStartedPlayback(true);
            setIsPlaying(true);
          } else if (isPaused) {
            isPlaybackActiveRef.current = false;
          }
        }
      });
    } catch {
      // ignore
    }
  }, []);

  // Sync video playing state:
  // When final video section is playing, pause background music completely!
  // When final video stops or user navigates away, smoothly resume music!
  const setIsVideoPlaying = useCallback((playing: boolean) => {
    isVideoPlayingRef.current = playing;
    setIsVideoPlayingState(playing);

    if (playing) {
      wasPlayingBeforeVideoRef.current = isPlaying;
      isPlaybackActiveRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (controllerRef.current) {
        try {
          controllerRef.current.pause();
        } catch {
          // ignore
        }
      }
      setIsPlaying(false);
    } else {
      if (wasPlayingBeforeVideoRef.current) {
        shouldPlayRef.current = true;
        const track = playlistRef.current[currentTrackIndexRef.current];
        if (track?.audioUrl && audioRef.current) {
          audioRef.current.play().catch(() => {});
        } else if (controllerRef.current) {
          try {
            controllerRef.current.resume?.();
            controllerRef.current.play?.();
          } catch {
            // ignore
          }
        }
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  // Initialize native HTML5 Audio element on mount
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';
    audio.src = SPOTIFY_PLAYLIST[0].audioUrl || '';
    audioRef.current = audio;

    // STRICT SEQUENTIAL PLAYBACK:
    // When current track ends completely, wait 500ms, then advance to next track.
    // One song finishes 100% before the second song begins!
    const handleAudioEnded = () => {
      if (isAdvancingRef.current) return;
      isAdvancingRef.current = true;

      // Small natural gap between songs (500ms) for smooth transition
      setTimeout(() => {
        const nextIdx = (currentTrackIndexRef.current + 1) % playlistRef.current.length;
        playTrackAtIndex(nextIdx, true);
        setTimeout(() => {
          isAdvancingRef.current = false;
        }, 600);
      }, 500);
    };

    const handleAudioPlaying = () => {
      isPlaybackActiveRef.current = true;
      setHasStartedPlayback(true);
      setIsPlaying(true);
      isAdvancingRef.current = false;
    };

    const handleAudioPause = () => {
      // Audio paused
    };

    audio.addEventListener('ended', handleAudioEnded);
    audio.addEventListener('playing', handleAudioPlaying);
    audio.addEventListener('pause', handleAudioPause);

    // Attempt autoplay immediately on load
    if (shouldPlayRef.current && !isVideoPlayingRef.current) {
      const initialPromise = audio.play();
      if (initialPromise !== undefined) {
        initialPromise
          .then(() => {
            isPlaybackActiveRef.current = true;
            setHasStartedPlayback(true);
            setIsPlaying(true);
          })
          .catch((err) => {
            console.log('Initial browser autoplay deferred until first interaction:', err.message);
          });
      }
    }

    return () => {
      audio.removeEventListener('ended', handleAudioEnded);
      audio.removeEventListener('playing', handleAudioPlaying);
      audio.removeEventListener('pause', handleAudioPause);
      audio.pause();
      audioRef.current = null;
    };
  }, [playTrackAtIndex]);

  // Global user interaction listener:
  // Starts playback on first touch/tap anywhere if browser held initial autoplay.
  // Once playing, button clicks NEVER re-trigger play(), keeping playback 100% uninterrupted.
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);

      // Only attempt to start playback if not yet active
      if (!isPlaybackActiveRef.current && shouldPlayRef.current && !isVideoPlayingRef.current) {
        const track = playlistRef.current[currentTrackIndexRef.current];
        if (track?.audioUrl && audioRef.current) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                isPlaybackActiveRef.current = true;
                setHasStartedPlayback(true);
                setIsPlaying(true);
              })
              .catch(() => {});
          }
        } else if (controllerRef.current) {
          try {
            controllerRef.current.resume?.();
            controllerRef.current.play?.();
          } catch {
            // ignore
          }
        }
      }
    };

    window.addEventListener('click', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('pointerdown', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction, { passive: true });

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('pointerdown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  return (
    <MusicContext.Provider
      value={{
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
        userInteracted,
        setUserInteracted,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

import React, { useState, useRef, useId } from 'react';
import { motion } from 'motion/react';
import { Heart, Cake } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

interface ButterflyItem {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  scale: number;
  rotation: number;
  flyDuration: number;
  wingSpeed: 'normal' | 'fast';
  colorTheme: {
    primary: string;
    secondary: string;
    glow: string;
    accent: string;
  };
}

const COLOR_PALETTES = [
  // Romantic Rose Gold & Pink
  { primary: '#ff3366', secondary: '#ff758c', glow: 'rgba(255, 51, 102, 0.6)', accent: '#ffd1dc' },
  // Magic Lavender & Violet
  { primary: '#9333ea', secondary: '#c084fc', glow: 'rgba(147, 51, 234, 0.6)', accent: '#e9d5ff' },
  // Golden Sunset Amber
  { primary: '#f59e0b', secondary: '#fbbf24', glow: 'rgba(245, 158, 11, 0.6)', accent: '#fef3c7' },
  // Electric Turquoise & Cyan
  { primary: '#06b6d4', secondary: '#67e8f9', glow: 'rgba(6, 182, 212, 0.6)', accent: '#cffafe' },
  // Iridescent Magenta Coral
  { primary: '#ec4899', secondary: '#f472b6', glow: 'rgba(236, 72, 153, 0.6)', accent: '#fbcfe8' },
  // Rich Royal Ruby
  { primary: '#e11d48', secondary: '#fda4af', glow: 'rgba(225, 29, 72, 0.6)', accent: '#fff1f2' },
];

export const RealisticButterflySVG: React.FC<{
  colorTheme: { primary: string; secondary: string; glow: string; accent: string };
  size?: number;
  wingSpeed?: 'normal' | 'fast';
  className?: string;
}> = ({ colorTheme, size = 48, wingSpeed = 'normal', className = '' }) => {
  const gradientId = useId();

  return (
    <div
      className={`butterfly-3d-wrap relative inline-block select-none pointer-events-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size * 0.85}px`,
        filter: `drop-shadow(0 0 6px ${colorTheme.glow})`,
      }}
    >
      <svg
        viewBox="0 0 100 85"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`${gradientId}-wing`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorTheme.accent} />
            <stop offset="50%" stopColor={colorTheme.secondary} />
            <stop offset="100%" stopColor={colorTheme.primary} />
          </linearGradient>
          <linearGradient id={`${gradientId}-vein`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor={colorTheme.primary} stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* LEFT WING GROUP */}
        <g
          className={wingSpeed === 'fast' ? 'animate-wing-left-fast' : 'animate-wing-left'}
          style={{ transformOrigin: '50px 42px' }}
        >
          {/* Upper Left Wing */}
          <path
            d="M 50 42 C 40 25, 22 2, 8 10 C -4 18, 5 45, 30 48 C 45 49, 49 43, 50 42 Z"
            fill={`url(#${gradientId}-wing)`}
            stroke={colorTheme.primary}
            strokeWidth="1.2"
          />
          {/* Lower Left Wing */}
          <path
            d="M 50 45 C 42 50, 16 52, 14 68 C 12 79, 32 82, 44 64 C 48 57, 49 48, 50 45 Z"
            fill={`url(#${gradientId}-wing)`}
            stroke={colorTheme.primary}
            strokeWidth="1"
            opacity="0.95"
          />
          {/* Wing Filigree & Spots */}
          <circle cx="20" cy="24" r="3" fill="#ffffff" opacity="0.85" />
          <circle cx="28" cy="18" r="2" fill="#ffffff" opacity="0.8" />
          <circle cx="24" cy="68" r="2.5" fill="#ffffff" opacity="0.85" />
          <path
            d="M 50 42 Q 28 32 14 18 M 50 42 Q 26 42 12 36 M 50 45 Q 32 58 20 70"
            stroke={`url(#${gradientId}-vein)`}
            strokeWidth="0.8"
            strokeDasharray="2 1"
          />
        </g>

        {/* RIGHT WING GROUP */}
        <g
          className={wingSpeed === 'fast' ? 'animate-wing-right-fast' : 'animate-wing-right'}
          style={{ transformOrigin: '50px 42px' }}
        >
          {/* Upper Right Wing */}
          <path
            d="M 50 42 C 60 25, 78 2, 92 10 C 104 18, 95 45, 70 48 C 55 49, 51 43, 50 42 Z"
            fill={`url(#${gradientId}-wing)`}
            stroke={colorTheme.primary}
            strokeWidth="1.2"
          />
          {/* Lower Right Wing */}
          <path
            d="M 50 45 C 58 50, 84 52, 86 68 C 88 79, 68 82, 56 64 C 52 57, 51 48, 50 45 Z"
            fill={`url(#${gradientId}-wing)`}
            stroke={colorTheme.primary}
            strokeWidth="1"
            opacity="0.95"
          />
          {/* Wing Filigree & Spots */}
          <circle cx="80" cy="24" r="3" fill="#ffffff" opacity="0.85" />
          <circle cx="72" cy="18" r="2" fill="#ffffff" opacity="0.8" />
          <circle cx="76" cy="68" r="2.5" fill="#ffffff" opacity="0.85" />
          <path
            d="M 50 42 Q 72 32 86 18 M 50 42 Q 74 42 88 36 M 50 45 Q 68 58 80 70"
            stroke={`url(#${gradientId}-vein)`}
            strokeWidth="0.8"
            strokeDasharray="2 1"
          />
        </g>

        {/* BUTTERFLY BODY & ANTENNAE */}
        <ellipse cx="50" cy="45" rx="2.5" ry="18" fill="#38151c" />
        <ellipse cx="50" cy="27" rx="3.2" ry="3.5" fill="#501d27" />
        {/* Antennae */}
        <path d="M 48 24 Q 42 14 36 12" stroke="#501d27" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 52 24 Q 58 14 64 12" stroke="#501d27" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="35" cy="12" r="1.2" fill={colorTheme.primary} />
        <circle cx="65" cy="12" r="1.2" fill={colorTheme.primary} />
      </svg>
    </div>
  );
};

interface Props {
  onEnterLevelOne: () => void;
}

export const BirthdayButterflyWelcome: React.FC<Props> = ({ onEnterLevelOne }) => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [butterflies, setButterflies] = useState<ButterflyItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { playTrackAtIndex, startAutoplay } = useMusic();

  // Generate a dynamic swarm of butterflies flying out from touch point or center
  const triggerButterflyFlight = (originX?: number, originY?: number) => {
    if (isTriggered) return; // avoid double trigger
    setIsTriggered(true);

    // Start playing the first Spotify romantic song smoothly on touch
    startAutoplay();

    const bounds = containerRef.current?.getBoundingClientRect();
    const centerX = originX ?? (bounds ? bounds.left + bounds.width / 2 : window.innerWidth / 2);
    const centerY = originY ?? (bounds ? bounds.top + bounds.height / 2 : window.innerHeight / 2);

    // Generate 26 graceful butterflies flying out briskly and cleanly
    const swarmCount = 26;
    const items: ButterflyItem[] = [];

    for (let i = 0; i < swarmCount; i++) {
      // Angle spread evenly in all directions with upward gentle lift
      const angle = (i / swarmCount) * 2 * Math.PI + (Math.random() - 0.5) * 0.35;
      // Distance to fly smoothly across screen
      const flyDistance = 450 + Math.random() * 500;

      // Clean natural trajectory
      const targetX = centerX + Math.cos(angle) * flyDistance + (Math.random() - 0.5) * 120;
      const targetY = centerY + Math.sin(angle) * flyDistance - 180 - Math.random() * 200;

      // Snappy and dynamic flight duration between 0.75s and 1.1s
      const flyDuration = 0.75 + Math.random() * 0.35;

      // Origin point with subtle initial offset
      const startX = centerX + (Math.random() - 0.5) * 80;
      const startY = centerY + (Math.random() - 0.5) * 60;

      // Rotation towards flight direction
      const rotationDeg = (angle * 180) / Math.PI + 90;

      items.push({
        id: i,
        startX,
        startY,
        targetX,
        targetY,
        scale: 0.7 + Math.random() * 0.7, // 0.7x to 1.4x size
        rotation: rotationDeg,
        flyDuration,
        wingSpeed: 'fast',
        colorTheme: COLOR_PALETTES[i % COLOR_PALETTES.length],
      });
    }

    setButterflies(items);

    // Fast, responsive transition to Level 1 (650ms)
    setTimeout(() => {
      onEnterLevelOne();
    }, 650);
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    triggerButterflyFlight(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      triggerButterflyFlight(touch.clientX, touch.clientY);
    } else {
      triggerButterflyFlight();
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      onTouchStart={handleTouchStart}
      className="relative w-full min-h-[75vh] sm:min-h-[80vh] flex flex-col items-center justify-center cursor-pointer select-none px-3 py-6"
    >
      {/* Dynamic Butterfly Swarm Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {butterflies.map((b) => (
          <motion.div
            key={b.id}
            initial={{
              x: b.startX - 30,
              y: b.startY - 30,
              scale: 0.2,
              opacity: 0,
              rotate: b.rotation - 30,
            }}
            animate={{
              x: b.targetX - 30,
              y: b.targetY - 30,
              scale: [0.2, b.scale, b.scale * 1.15, b.scale * 0.9],
              opacity: [0, 1, 1, 0],
              rotate: [b.rotation - 30, b.rotation, b.rotation + (Math.random() > 0.5 ? 40 : -40)],
            }}
            transition={{
              duration: b.flyDuration,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute top-0 left-0"
          >
            <RealisticButterflySVG
              colorTheme={b.colorTheme}
              size={54}
              wingSpeed={b.wingSpeed}
            />
          </motion.div>
        ))}
      </div>

      {/* Main Birthday Greeting Widescreen Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{
          opacity: 1,
          scale: isTriggered ? 1.02 : 1,
          y: 0,
        }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="w-full max-w-4xl relative rounded-3xl p-6 sm:p-10 md:p-12 text-center glass-card border-2 border-pink-300/80 shadow-2xl overflow-hidden backdrop-blur-xl"
        style={{
          boxShadow: '0 25px 60px -15px rgba(244, 63, 94, 0.25), 0 0 40px rgba(251, 113, 133, 0.2)',
        }}
      >
        {/* Subtle Ambient Butterflies fluttering around the greeting */}
        <div className="absolute top-4 left-6 hidden sm:block animate-butterfly-hover pointer-events-none opacity-85">
          <RealisticButterflySVG
            colorTheme={COLOR_PALETTES[0]}
            size={42}
            wingSpeed="normal"
          />
        </div>
        <div
          className="absolute bottom-6 right-6 hidden sm:block animate-butterfly-hover pointer-events-none opacity-85"
          style={{ animationDelay: '1.2s' }}
        >
          <RealisticButterflySVG
            colorTheme={COLOR_PALETTES[1]}
            size={46}
            wingSpeed="normal"
          />
        </div>
        <div
          className="absolute top-8 right-12 hidden md:block animate-butterfly-hover pointer-events-none opacity-75"
          style={{ animationDelay: '0.6s' }}
        >
          <RealisticButterflySVG
            colorTheme={COLOR_PALETTES[2]}
            size={36}
            wingSpeed="fast"
          />
        </div>

        {/* Birthday Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/90 border border-pink-300 text-rose-800 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-xs mb-4">
          <Cake className="w-4 h-4 text-pink-500 animate-bounce" />
          <span>Born: September 25, 2004 • Special Day</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
        </div>

        {/* Primary Requested Greeting: "Wish you happy birthday chla kutty" */}
        <h1 className="font-handwriting text-5xl sm:text-6xl md:text-7xl font-bold text-rose-950 mb-3 leading-tight tracking-tight drop-shadow-xs">
          Wish you happy birthday chla kutty 🎂💖
        </h1>

        <p className="font-script text-3xl sm:text-4xl md:text-5xl text-rose-600 mb-4 drop-shadow-2xs">
          En Anbu Kaviya Kutty
        </p>

        <p className="text-sm sm:text-base md:text-lg text-rose-900/90 max-w-2xl mx-auto leading-relaxed mb-8 font-medium">
          "Unakku indha birthday-ku naan romba special romantic levels & surprise memories create panni vechu irukken D Challa Kutty! Touch panni butterflies parakka vidu, level one unlock aagum! ❤️🦋"
        </p>

        {/* Touch Trigger Interactive Portal Button */}
        <div className="flex flex-col items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              triggerButterflyFlight(e.clientX, e.clientY);
            }}
            className="group relative px-8 py-4 sm:px-10 sm:py-5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition flex items-center justify-center gap-3 cursor-pointer overflow-hidden border border-pink-300/40"
          >
            {/* Shimmer light sweep across button */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <div className="relative">
              <RealisticButterflySVG
                colorTheme={{ primary: '#ffffff', secondary: '#ffd1dc', glow: '#ff3366', accent: '#fff' }}
                size={32}
                wingSpeed="fast"
              />
            </div>

            <span className="relative font-bold tracking-wide">
              {isTriggered ? 'Butterflies Flying! 🦋' : 'Touch Me Chla Kutty 🦋'}
            </span>

            <Heart className="w-5 h-5 text-pink-200 fill-current animate-pulse relative" />
          </motion.button>

          <p className="text-xs sm:text-sm text-rose-700 font-semibold flex items-center justify-center gap-2">
            <span className="text-sm">🦋</span>
            <span>Touch anywhere to release butterflies & start Romantic BGM Song 1</span>
            <span className="text-sm">🎵</span>
          </p>
        </div>

        {/* Romantic Bottom Note */}
        <div className="mt-8 pt-4 border-t border-pink-200/70 flex items-center justify-center gap-2 text-xs sm:text-sm text-rose-800/80 font-medium">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>Crafted with infinite love for Kaviya • Forever Yours ❤️</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
        </div>
      </motion.div>
    </div>
  );
};

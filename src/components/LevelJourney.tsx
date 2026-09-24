import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Unlock,
  Heart,
  PhoneCall,
  Check,
  ArrowRight,
  ArrowLeft,
  PartyPopper,
  Cake,
  RotateCcw,
  Camera,
  Film,
  Mail,
  Smile,
  Sparkles,
} from 'lucide-react';
import { triggerLevelUnlockConfetti, triggerGrandFireworksConfetti } from '../utils/confetti';
import { TypewriterLetter } from './TypewriterLetter';
import { RomanticModal } from './RomanticModal';
import { PhotoMemoriesGallery } from './PhotoMemoriesGallery';
import { SpecialVideoReel } from './SpecialVideoReel';
import { BirthdayButterflyWelcome } from './BirthdayButterflyWelcome';

export const LevelJourney: React.FC = () => {
  // Always start from Intro (frame 0) on page load / refresh
  const [currentFrame, setCurrentFrame] = useState<number>(0);

  // Level unlock states always start fresh on page load / refresh
  const [level1Unlocked, setLevel1Unlocked] = useState<boolean>(false);
  const [level2Unlocked, setLevel2Unlocked] = useState<boolean>(false);

  // Clean up any stale legacy progress from localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('kaviya_birthday_levels_progress_v1');
      localStorage.removeItem('kaviya_birthday_levels_progress_v2');
    } catch {
      // ignore
    }
  }, []);

  // Inputs
  const [level1Input, setLevel1Input] = useState('');
  const [level2Input, setLevel2Input] = useState('');

  // Kiss counter
  const [kissCount, setKissCount] = useState(0);

  // Dynamic alert modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  // Handle kiss click
  const handleSendKiss = () => {
    setKissCount((prev) => prev + 1);
    triggerLevelUnlockConfetti();
  };

  // Reset entire journey to play again from Intro / Level 1
  const handleResetJourney = () => {
    setLevel1Unlocked(false);
    setLevel2Unlocked(false);
    setCurrentFrame(0);
    setLevel1Input('');
    setLevel2Input('');
    try {
      localStorage.removeItem('kaviya_birthday_levels_progress_v1');
      localStorage.removeItem('kaviya_birthday_levels_progress_v2');
    } catch {
      // ignore
    }
  };

  const handleUnlockLevel1 = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = level1Input.trim().toLowerCase().replace(/\s+/g, ' ');
    if (clean.includes('bujjulu') || clean.includes('bujulu')) {
      setLevel1Unlocked(true);
      triggerGrandFireworksConfetti();
    } else {
      setModalState({
        isOpen: true,
        title: 'Aiyoo Thappa Pochu D Challa Kutty!',
        message: 'Thappa type panriyae D Kaviya! Nalla yosichi paar, unna naan eppavum evalo chellama kupuduvaen... Neeyae kandupidichi type pannu! 😉❤️',
      });
    }
  };

  // Level 2 Unlock: Question: "Nammaloda first call eppo?" -> Answer: "August 15"
  const handleUnlockLevel2 = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = level2Input.trim().toLowerCase().replace(/\s+/g, ' ');
    if (
      clean.includes('august 15') ||
      clean.includes('aug 15') ||
      clean.includes('15 august') ||
      clean.includes('15 aug') ||
      clean.includes('15/08') ||
      clean.includes('15-08') ||
      clean.includes('august15')
    ) {
      setLevel2Unlocked(true);
      triggerGrandFireworksConfetti();
    } else {
      setModalState({
        isOpen: true,
        title: 'Aiyo Nyabagam Illaya D Challa Kutty!',
        message: 'Thappa type panriyae D Kaviya! Namma mudhal call andha unforgettable special day nyabagam illaya? Nalla yosichi type pannu! 😉❤️',
      });
    }
  };

  // Navigation helpers: strictly enforce sequential unlocking!
  const goToFrame = (frame: number) => {
    if (frame === 0) setCurrentFrame(0);
    else if (frame === 1) setCurrentFrame(1);
    else if (frame === 2 && level1Unlocked) setCurrentFrame(2);
    else if (frame === 3 && level2Unlocked) setCurrentFrame(3);
    else if (frame === 4 && level2Unlocked) setCurrentFrame(4);
  };

  const frameVariants = {
    initial: { opacity: 0, y: 8, scale: 0.99 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, y: -8, scale: 0.99, transition: { duration: 0.15, ease: 'easeIn' } },
  };

  return (
    <div
      id="dynamic-level-journey"
      className={`w-full mx-auto px-2 sm:px-0 transition-all duration-300 ${
        currentFrame >= 3 ? 'max-w-6xl' : 'max-w-5xl'
      }`}
    >
      {/* Top Stepper Navigation (Dynamic Frames Bar) */}
      <nav id="level-stepper-nav" aria-label="Level Progress" className="mb-3 sm:mb-5 max-w-5xl mx-auto">
        <div className="glass-card rounded-2xl p-2 sm:p-2.5 flex items-center justify-between border border-pink-200/90 shadow-md flex-wrap gap-1">
          {/* Frame 0: Birthday Wish with Butterflies */}
          <button
            type="button"
            onClick={() => goToFrame(0)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentFrame === 0
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-rose-700 hover:bg-pink-100/70'
            }`}
            title="Replay Birthday Wish & Flying Butterflies"
          >
            <span className="text-sm">🦋</span>
            <span className="hidden sm:inline">Birthday Wish</span>
            <span className="sm:hidden">Wish</span>
          </button>

          <span className="text-pink-300 font-bold">›</span>

          {/* Frame 1: Level 1 (Chella Peru) */}
          <button
            type="button"
            onClick={() => goToFrame(1)}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentFrame === 1
                ? 'bg-rose-500 text-white shadow-sm'
                : level1Unlocked
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'text-rose-600 hover:bg-pink-100/70'
            }`}
          >
            {level1Unlocked ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3 h-3" />}
            <span>Level 1</span>
          </button>

          <span className="text-pink-300 font-bold">›</span>

          {/* Frame 2: Level 2 (First Call) */}
          <button
            type="button"
            onClick={() => level1Unlocked && goToFrame(2)}
            disabled={!level1Unlocked}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentFrame === 2
                ? 'bg-rose-500 text-white shadow-sm'
                : level2Unlocked
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : level1Unlocked
                ? 'text-rose-600 hover:bg-pink-100/70 cursor-pointer'
                : 'text-gray-400 opacity-60 cursor-not-allowed'
            }`}
          >
            {level2Unlocked ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3 h-3" />}
            <span>Level 2</span>
          </button>

          <span className="text-pink-300 font-bold">›</span>

          {/* Frame 3: Level 3 (20 Photos) */}
          <button
            type="button"
            onClick={() => level2Unlocked && goToFrame(3)}
            disabled={!level2Unlocked}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentFrame === 3
                ? 'bg-rose-500 text-white shadow-sm'
                : level2Unlocked
                ? 'text-rose-700 hover:bg-pink-100/70 cursor-pointer'
                : 'text-gray-400 opacity-60 cursor-not-allowed'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-rose-500" />
            <span>Level 3 (20 Photos)</span>
          </button>

          <span className="text-pink-300 font-bold">›</span>

          {/* Frame 4: Grand Finale (16:9 Special Video) */}
          <button
            type="button"
            onClick={() => level2Unlocked && goToFrame(4)}
            disabled={!level2Unlocked}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentFrame === 4
                ? 'bg-rose-500 text-white shadow-sm'
                : level2Unlocked
                ? 'text-rose-700 hover:bg-pink-100/70 cursor-pointer'
                : 'text-gray-400 opacity-60 cursor-not-allowed'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Final Video 🎬</span>
            <span className="sm:hidden">Video</span>
          </button>

          {/* Reset Journey Option */}
          <button
            type="button"
            onClick={handleResetJourney}
            className="p-1.5 rounded-xl text-rose-400 hover:text-rose-700 hover:bg-pink-100 transition"
            title="Reset Journey from Level 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Dynamic Frame Switcher */}
      <AnimatePresence mode="wait">
        {/* ======================= FRAME 0: WISH YOU HAPPY BIRTHDAY CHLA KUTTY (BUTTERFLY SWARM) ======================= */}
        {currentFrame === 0 && (
          <motion.div
            key="frame-0"
            variants={frameVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full flex flex-col items-center"
          >
            <BirthdayButterflyWelcome
              onEnterLevelOne={() => {
                setCurrentFrame(1);
              }}
            />
          </motion.div>
        )}

        {/* ======================= FRAME 1: LEVEL 1 (CHELLA PERU -> GRAND LETTER) ======================= */}
        {currentFrame === 1 && (
          <motion.div
            key="frame-1"
            variants={frameVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full flex flex-col items-center"
          >
            {level1Unlocked ? (
              /* 16:9 Cinematic Widescreen Grand Birthday Letter Theater (No vertical scrolling!) */
              <TypewriterLetter
                onProceedToLevel2={() => setCurrentFrame(2)}
                onBackToIntro={() => setCurrentFrame(0)}
                onSendKiss={handleSendKiss}
                kissCount={kissCount}
              />
            ) : (
              /* Question & Answer card (compact, fits in 1 view) */
              <div className="glass-card w-full max-w-2xl mx-auto rounded-3xl p-5 sm:p-7 border-2 border-pink-200/90 shadow-2xl relative text-left">
                {/* Level Badge Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-pink-100 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm bg-gradient-to-tr from-pink-500 to-rose-500 animate-pulse">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-rose-500 tracking-wider uppercase">
                        Level 1 • Secret Task
                      </span>
                      <h2 className="font-handwriting text-2xl sm:text-3xl font-bold text-rose-950 leading-tight">
                        🔒 Level 1: Unnoda Chella Peru Enna?
                      </h2>
                    </div>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full font-semibold bg-pink-100 text-rose-700">
                    Task Active 🎯
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 border border-pink-200 text-center sm:text-left">
                    <p className="text-base sm:text-lg font-semibold text-rose-950 leading-relaxed">
                      "Unnoda chella peru enna? Enakku romba pudicha un nickname kandupidichi type pannu D Kutty! 😉❤️"
                    </p>
                  </div>

                  {/* Secret Nickname Input - Clean without any key or clue */}
                  <form onSubmit={handleUnlockLevel1} className="space-y-3 pt-1">
                    <label htmlFor="level1-nickname-input" className="block text-xs font-semibold text-rose-800 uppercase tracking-wider">
                      Your Answer:
                    </label>
                    <div className="relative">
                      <Heart className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400" />
                      <input
                        id="level1-nickname-input"
                        type="text"
                        value={level1Input}
                        onChange={(e) => setLevel1Input(e.target.value)}
                        placeholder="Type answer here..."
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-white/95 border border-pink-200 text-sm text-rose-900 placeholder:text-rose-400/50 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition"
                      />
                    </div>

                    <button
                      id="unlock-level-1-submit-button"
                      type="submit"
                      className="w-full py-2.5 sm:py-3 px-5 bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Submit Answer & Open Birthday Letter! ❤️</span>
                    </button>
                  </form>
                </div>

                {/* Navigation Back */}
                <div className="mt-4 pt-3 border-t border-pink-100 flex justify-between items-center text-xs text-rose-600">
                  <button
                    type="button"
                    onClick={() => setCurrentFrame(0)}
                    className="flex items-center gap-1 hover:text-rose-900 transition font-medium cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Birthday Wish 🦋</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ======================= FRAME 2: LEVEL 2 (FIRST CALL -> AUGUST 15) ======================= */}
        {currentFrame === 2 && (
          <motion.div
            key="frame-2"
            variants={frameVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full flex flex-col items-center"
          >
            {level2Unlocked ? (
              /* 16:9 Cinematic Widescreen First Call Memory Theater (No vertical scrolling!) */
              <div
                id="grand-first-call-memory-16x9"
                className="w-full max-w-5xl mx-auto md:aspect-[16/9] min-h-[500px] md:max-h-[560px] rounded-3xl p-4 sm:p-6 md:p-7 bg-gradient-to-br from-white/95 via-rose-50/90 to-amber-50/90 border-2 border-pink-300 shadow-2xl backdrop-blur-md relative flex flex-col justify-between overflow-hidden text-left"
              >
                {/* Top Header Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-pink-200/80 gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] sm:text-xs font-bold flex items-center gap-1 shadow-2xs">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Level 2 Unlocked 📞 (August 15 • First Call)</span>
                    </span>
                    <span className="hidden sm:inline-block text-xs font-semibold text-rose-500">
                      The Call That Changed My Life
                    </span>
                  </div>

                  <button
                    id="proceed-to-level-3-top-btn"
                    type="button"
                    onClick={() => setCurrentFrame(3)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Go to Level 3: 20 Photos Vault 📸</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Main 16:9 Widescreen Content: 2-Column */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 flex-1 items-stretch my-2.5 sm:my-3 min-h-0">
                  {/* Left Column: First Call Artwork & Memory Dossier */}
                  <div className="md:col-span-5 flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white/70 border border-pink-200/80 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center shadow-md animate-pulse">
                          <PhoneCall className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-rose-500">
                            August 15 • Unforgettable Memory
                          </span>
                          <h3 className="font-handwriting text-2xl sm:text-3xl font-bold text-rose-950 leading-tight">
                            Nammaloda First Call
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs sm:text-sm text-rose-900/90 leading-relaxed font-medium mt-3">
                        <div className="p-2.5 rounded-xl bg-rose-50/80 border border-pink-200/70">
                          <p className="text-xs text-rose-800 leading-relaxed font-semibold">
                            "Anniku phone-la pesumbodhu start aana andha connection... ennaikume marakka mudiyadha oru magical moment di Bujjulu! ❤️"
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-rose-600 font-semibold pt-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Memory #2 Unlocked • Forever Bond</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-pink-200/60 mt-3 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={handleSendKiss}
                        className="px-3 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 border border-pink-300 text-rose-800 font-bold text-xs transition flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-2xs"
                      >
                        <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                        <span>Send Love Kiss 😘</span>
                        {kissCount > 0 && (
                          <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                            +{kissCount}
                          </span>
                        )}
                      </button>
                      <span className="text-[11px] text-rose-500 font-semibold">August 15 Magic ✨</span>
                    </div>
                  </div>

                  {/* Right Column: Heartfelt Handwritten Plaque */}
                  <div className="md:col-span-7 flex flex-col justify-between p-4 sm:p-5 md:p-6 rounded-2xl bg-gradient-to-br from-rose-50/90 via-pink-50/80 to-amber-50/90 border-2 border-pink-200/90 shadow-md relative overflow-y-auto">
                    <div className="flex items-center gap-2 text-rose-600 mb-2">
                      <PhoneCall className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Unforgettable First Words</span>
                    </div>

                    <div className="relative font-sans-body my-auto py-2">
                      <p className="font-handwriting text-2xl sm:text-3xl text-rose-950 font-bold leading-relaxed">
                        "Andha anniku dhan bujjulu enn life la miss panna kuda dhunu nenacha oru person kitta pesuna day ,apo naan kadasi varikum nenacha dhu unna yaarukagavum miss panna kuda dhu nu mattum dhan en kaviya kadasi varikum en kuda vae irrukanum"
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-pink-200/70 flex items-center justify-between text-xs text-rose-700">
                      <span className="font-script text-2xl sm:text-3xl text-rose-600">En Bujjulu Kutty Forever ❤️</span>
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-bounce" />
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation Strip */}
                <div className="pt-2.5 border-t border-pink-200/70 flex items-center justify-between text-xs text-rose-600">
                  <button
                    type="button"
                    onClick={() => setCurrentFrame(1)}
                    className="flex items-center gap-1 hover:text-rose-900 transition font-medium cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Level 1 Letter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentFrame(3)}
                    className="text-rose-700 font-bold hover:text-rose-950 transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next: Level 3 (20 Photo Memories Vault) 📸 ›</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Question & Answer Card for Level 2 */
              <div className="glass-card w-full max-w-2xl mx-auto rounded-3xl p-5 sm:p-7 border-2 border-pink-200/90 shadow-2xl relative text-left">
                {/* Level Badge Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-pink-100 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm bg-gradient-to-tr from-pink-500 to-rose-500 animate-pulse">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-rose-500 tracking-wider uppercase">
                        Level 2 • Secret Task
                      </span>
                      <h2 className="font-handwriting text-2xl sm:text-3xl font-bold text-rose-950 leading-tight">
                        🔒 Level 2: Nammaloda First Call Eppo?
                      </h2>
                    </div>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full font-semibold bg-pink-100 text-rose-700">
                    Task Active 🎯
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 border border-pink-200 text-center sm:text-left">
                    <p className="text-base sm:text-lg font-semibold text-rose-950 leading-relaxed">
                      "Nammaloda first phone call eppo nadandhadhu D Kutty? Andha unforgettable date kandupidichi type pannu! 📞❤️"
                    </p>
                  </div>

                  {/* First Call Date Input - Clean without any key or clue */}
                  <form onSubmit={handleUnlockLevel2} className="space-y-3 pt-1">
                    <label htmlFor="level2-call-input" className="block text-xs font-semibold text-rose-800 uppercase tracking-wider">
                      Your Answer:
                    </label>
                    <div className="relative">
                      <PhoneCall className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400" />
                      <input
                        id="level2-call-input"
                        type="text"
                        value={level2Input}
                        onChange={(e) => setLevel2Input(e.target.value)}
                        placeholder="Type answer here..."
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-white/95 border border-pink-200 text-sm text-rose-900 placeholder:text-rose-400/50 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition"
                      />
                    </div>

                    <button
                      id="unlock-level-2-submit-button"
                      type="submit"
                      className="w-full py-2.5 sm:py-3 px-5 bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Submit Answer & Reveal Memory! 📞❤️</span>
                    </button>
                  </form>
                </div>

                {/* Navigation Back */}
                <div className="mt-4 pt-3 border-t border-pink-100 flex justify-between items-center text-xs text-rose-600">
                  <button
                    type="button"
                    onClick={() => setCurrentFrame(1)}
                    className="flex items-center gap-1 hover:text-rose-900 transition font-medium cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Level 1 Letter</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ======================= FRAME 3: LEVEL 3 (20 PHOTO MEMORIES VAULT) ======================= */}
        {currentFrame === 3 && (
          <motion.div
            key="frame-3"
            variants={frameVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            {/* Level 3 Header Strip */}
            <div className="flex items-center justify-between bg-white/80 p-3.5 rounded-2xl border border-pink-200 text-xs text-rose-800">
              <span className="font-semibold flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-rose-500" />
                Level 3 of 3 • 20 Photo Memories Vault
              </span>
              <button
                type="button"
                onClick={() => setCurrentFrame(4)}
                className="px-3 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-rose-800 font-semibold transition flex items-center gap-1 cursor-pointer"
              >
                <span>Final Video 🎬 ›</span>
              </button>
            </div>

            {/* 20 Photos Gallery */}
            <PhotoMemoriesGallery onGoToVideo={() => setCurrentFrame(4)} />

            {/* Bottom Stepper Bar */}
            <div className="glass-card rounded-2xl p-4 border border-pink-200 flex flex-wrap justify-between items-center gap-2 text-xs text-rose-700">
              <button
                type="button"
                onClick={() => setCurrentFrame(2)}
                className="flex items-center gap-1 hover:text-rose-900 transition font-medium cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Level 2 Memory</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentFrame(4)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              >
                <Film className="w-4 h-4" />
                <span>Next: Special 16:9 Birthday Video 🎬❤️</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ======================= FRAME 4: GRAND FINALE (9:16 SPECIAL VIDEO REEL) ======================= */}
        {currentFrame === 4 && (
          <motion.div
            key="frame-4"
            variants={frameVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            {/* Top Back Navigation */}
            <div className="flex items-center justify-between bg-white/80 p-3.5 rounded-2xl border border-pink-200 text-xs text-rose-800">
              <button
                type="button"
                onClick={() => setCurrentFrame(3)}
                className="flex items-center gap-1 hover:text-rose-950 font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to 20 Photos Vault</span>
              </button>
              <span className="font-semibold text-rose-600">Grand Finale • 9:16 Special Reel Video Gift</span>
            </div>

            {/* 9:16 Vertical Reel Video Component */}
            <SpecialVideoReel onBackToPhotos={() => setCurrentFrame(3)} />

            {/* Bottom Return Buttons */}
            <div className="glass-card rounded-2xl p-4 border border-pink-200 flex justify-between items-center text-xs text-rose-700">
              <button
                type="button"
                onClick={() => setCurrentFrame(3)}
                className="flex items-center gap-1 hover:text-rose-900 transition font-medium cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Review 20 Photos 📸</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentFrame(0)}
                className="hover:text-rose-900 transition font-medium cursor-pointer"
              >
                Return to Intro Screen 🌸
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Pop-up Alert Modal (for wrong password / hint) */}
      <RomanticModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

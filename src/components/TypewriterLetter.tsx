import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, RefreshCw, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

interface TypewriterLetterProps {
  onProceedToLevel2?: () => void;
  onBackToIntro?: () => void;
  onSendKiss?: () => void;
  kissCount?: number;
}

const FULL_LETTER_TEXT = `Enn chla Kutty.....  ❤️

Sorry bujjulu indha oru brdy va vandhu unn pakathula irrundhu celebrate panna mudila any where next brdy vandhu nama sendhu konda du vom,

enn life ipdi oru person kedacha dhuku naalam endha jenmathula punniyom panna nu therila bujjulu ur such a kind full person bujjulu ,indha brdy va happy ya celebrate pannu next brdy va paaru thooki kondaduren , once again love u bujjulu`;

export const TypewriterLetter: React.FC<TypewriterLetterProps> = ({
  onProceedToLevel2,
  onBackToIntro,
  onSendKiss,
  kissCount = 0,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [key, setKey] = useState(0); // for replaying

  useEffect(() => {
    setDisplayedText('');
    setIsFinished(false);
    let index = 0;

    const timer = setInterval(() => {
      if (index < FULL_LETTER_TEXT.length) {
        setDisplayedText(FULL_LETTER_TEXT.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsFinished(true);
      }
    }, 28);

    return () => clearInterval(timer);
  }, [key]);

  const handleShowInstant = () => {
    setDisplayedText(FULL_LETTER_TEXT);
    setIsFinished(true);
  };

  const handleReplay = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div
      id="grand-birthday-love-letter-16x9"
      className="w-full max-w-5xl mx-auto md:aspect-[16/9] min-h-[520px] md:max-h-[580px] rounded-3xl p-4 sm:p-6 md:p-7 bg-gradient-to-br from-white/95 via-rose-50/90 to-pink-100/90 border-2 border-pink-300 shadow-2xl backdrop-blur-md relative flex flex-col justify-between overflow-hidden text-left"
    >
      {/* Top Header Bar: Status Badge + Direct Level 2 Action */}
      <div className="flex items-center justify-between pb-3 border-b border-pink-200/80 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] sm:text-xs font-bold flex items-center gap-1 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Level 1 Unlocked ✨ (Bujjulu Kutty ❤️)</span>
          </span>
          <span className="hidden sm:inline-block text-xs font-semibold text-rose-500">
            Grand Birthday Letter
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!isFinished ? (
            <button
              id="instant-show-letter-button"
              type="button"
              onClick={handleShowInstant}
              className="text-xs px-2.5 py-1 rounded-full bg-pink-100 hover:bg-pink-200 text-rose-700 transition font-medium cursor-pointer"
            >
              Skip ⏩
            </button>
          ) : (
            <button
              id="replay-letter-button"
              type="button"
              onClick={handleReplay}
              className="px-2.5 py-1 rounded-full text-xs font-medium text-rose-700 bg-pink-100/80 hover:bg-pink-200/90 transition flex items-center gap-1 cursor-pointer"
              title="Replay Letter Animation"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Replay</span>
            </button>
          )}

          {onProceedToLevel2 && (
            <button
              id="proceed-to-level-2-top-btn"
              type="button"
              onClick={onProceedToLevel2}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Go to Level 2: First Call 📞</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main 16:9 Widescreen Content: 2-Column Balanced Reading Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 flex-1 items-stretch my-2.5 sm:my-3 min-h-0">
        {/* Left Column (Dossier, Wax Seal, Romantic Metadata) */}
        <div className="md:col-span-5 flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white/70 border border-pink-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center shadow-md animate-pulse">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-rose-500">
                  Personal Love Letter • Special Edition
                </span>
                <h3 className="font-handwriting text-2xl sm:text-3xl font-bold text-rose-950 leading-tight">
                  En Anbu Kaviya-vukku
                </h3>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-rose-900/90 leading-relaxed font-medium mt-3">
              <div className="p-2 rounded-xl bg-pink-50/80 border border-pink-200/70 flex items-center justify-between">
                <span>🎂 Born: <strong>September 25, 2004</strong></span>
                <span className="text-pink-500 font-bold">Legend Day</span>
              </div>
              <p className="text-xs text-rose-800 leading-normal italic">
                "Nee en life-la kedacha dhu dhaan bujjulu enakku kedacha periya gift. Indha letter unakkaga mattum dhaan  bujjulu!"
              </p>
            </div>
          </div>

          {/* Interactive Kiss Button & Key Tag */}
          <div className="pt-3 border-t border-pink-200/60 mt-3 flex items-center justify-between gap-2">
            {onSendKiss ? (
              <button
                type="button"
                onClick={onSendKiss}
                className="px-3 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 border border-pink-300 text-rose-800 font-bold text-xs transition flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-2xs"
              >
                <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                <span>Ummah! 😘</span>
                {kissCount > 0 && (
                  <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                    +{kissCount}
                  </span>
                )}
              </button>
            ) : (
              <span className="text-xs font-bold text-rose-600">Memory #1 Unlocked ✨</span>
            )}

            <span className="text-[11px] text-rose-500 font-semibold">
              100% Genuine Love ❤️
            </span>
          </div>
        </div>

        {/* Right Column (The Vintage Parchment Letter Paper) */}
        <div className="md:col-span-7 flex flex-col justify-between p-4 sm:p-5 md:p-6 rounded-2xl bg-[#fffbf8] border-2 border-rose-200/90 shadow-md relative overflow-y-auto">
          {/* Letter Body with comfortable typography */}
          <div className="relative font-sans-body">
            <p className="whitespace-pre-line text-sm sm:text-base text-rose-950 leading-relaxed font-medium">
              {displayedText}
              {!isFinished && (
                <span className="inline-block w-2 h-4.5 ml-1 bg-rose-500 animate-pulse align-middle" />
              )}
            </p>
          </div>

          {/* Handwritten Signature */}
          <div className="mt-4 pt-3 border-t border-rose-200/70 flex items-center justify-between text-right">
            <span className="text-[10px] text-rose-400 font-medium">
              25th September • Eternally Celebrated
            </span>
            <div>
              <p className="font-script text-2xl sm:text-3xl text-rose-600 tracking-wide leading-none">
                Forever Yours, Bujjulu Pandy ❤️
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Strip */}
      <div className="pt-2.5 border-t border-pink-200/70 flex items-center justify-between text-xs text-rose-600">
        {onBackToIntro ? (
          <button
            type="button"
            onClick={onBackToIntro}
            className="flex items-center gap-1 hover:text-rose-900 transition font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Birthday Wish 🦋</span>
          </button>
        ) : (
          <span />
        )}

        {onProceedToLevel2 && (
          <button
            type="button"
            onClick={onProceedToLevel2}
            className="text-rose-700 font-bold hover:text-rose-950 transition flex items-center gap-1 cursor-pointer"
          >
            <span>Next: Level 2 First Call Memory 📞 ›</span>
          </button>
        )}
      </div>

      {/* Floating Sparkles */}
      <Sparkles
        className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 animate-spin pointer-events-none"
        style={{ animationDuration: '6s' }}
      />
      <Heart className="absolute -bottom-2 -left-2 w-5 h-5 text-rose-400 fill-rose-300 animate-bounce pointer-events-none" />
    </div>
  );
};


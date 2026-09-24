import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sparkles, Heart, CheckCircle2, Lock, Unlock, Image as ImageIcon, Edit3, ZoomIn, Wand2 } from 'lucide-react';
import { PhotoMemoryItem } from '../types';
import { triggerLevelUnlockConfetti } from '../utils/confetti';

interface ScratchPhotoCardProps {
  item: PhotoMemoryItem;
  onAnswerCorrect: (id: number) => void;
  onScratchComplete: (id: number) => void;
  onWrongAnswer: (message: string) => void;
  onEditItem: (item: PhotoMemoryItem) => void;
  onChangePhoto: (id: number, newUrl: string) => void;
  onOpenLightbox: (item: PhotoMemoryItem) => void;
  cardTilt?: number;
}

const NATURAL_TILTS = [
  -1.8, 1.5, -1.2, 2.0, -2.2, 1.4, 1.8, -1.6, 1.2, -2.0,
  1.8, -1.4, 2.2, -1.9, 1.5, -1.7, 1.9, -1.5, 1.6, -1.8,
];

const WASHI_TAPES = [
  'bg-pink-200/85 border-pink-300/80',
  'bg-amber-200/85 border-amber-300/80',
  'bg-rose-200/85 border-rose-300/80',
  'bg-purple-200/85 border-purple-300/80',
  'bg-orange-200/85 border-orange-300/80',
];

export const ScratchPhotoCard: React.FC<ScratchPhotoCardProps> = ({
  item,
  onAnswerCorrect,
  onScratchComplete,
  onWrongAnswer,
  onEditItem,
  onChangePhoto,
  onOpenLightbox,
  cardTilt,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(item.isScratched ? 100 : item.scratchPercentage || 0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showPhotoUrlModal, setShowPhotoUrlModal] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [item.imageUrl]);

  // Initialize Canvas Scratch Layer once answered but not fully scratched
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || item.isScratched) return;

    const rect = container.getBoundingClientRect();
    const width = Math.round(rect.width || container.clientWidth || 320);
    const height = Math.round(rect.height || container.clientHeight || 240);
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Rose gold & glitter pink metallic gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#fda4af');
    grad.addColorStop(0.3, '#f472b6');
    grad.addColorStop(0.7, '#fb7185');
    grad.addColorStop(1, '#f43f5e');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add glitter pattern particles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let i = 0; i < 90; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const r = Math.random() * 2.5 + 0.5;
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Centered romantic scratch guide text
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 16px Poppins, sans-serif';
    ctx.shadowColor = 'rgba(190, 24, 93, 0.7)';
    ctx.shadowBlur = 8;
    ctx.fillText('✨ Scratch Me D Challa Kutty! ✨', width / 2, height / 2 - 12);

    ctx.font = '12px Poppins, sans-serif';
    ctx.fillText('👆 Touch or Drag to reveal our photo!', width / 2, height / 2 + 15);
  }, [item.isScratched]);

  useEffect(() => {
    if (item.isAnswered && !item.isScratched) {
      const raf = requestAnimationFrame(() => {
        initCanvas();
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [item.isAnswered, item.isScratched, initCanvas]);

  // Handle Option Click
  const handleSelectOption = (idx: number) => {
    if (item.isAnswered) return;
    setSelectedOption(idx);

    if (idx === item.correctIndex) {
      triggerLevelUnlockConfetti();
      onAnswerCorrect(item.id);
    } else {
      onWrongAnswer(
        `Thappa choose pannitiye Bujjulu Kutty! Option "${item.options[idx]}" illa 😉 Innoru choice try pannu ❤️`
      );
    }
  };

  // Scratch Drawing
  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || item.isScratched) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    // Check progress
    checkScratchProgress();
  };

  const checkScratchProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || item.isScratched) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const width = canvas.width;
      const height = canvas.height;
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      let clearPixels = 0;
      const totalSampled = data.length / 16; // sample every 4th pixel (4 channels = 16 bytes)

      for (let i = 3; i < data.length; i += 16) {
        if (data[i] === 0) {
          clearPixels++;
        }
      }

      const percent = Math.min(100, Math.round((clearPixels / totalSampled) * 100));
      setScratchPercent(percent);

      // Auto reveal threshold at 40%
      if (percent >= 40) {
        triggerLevelUnlockConfetti();
        onScratchComplete(item.id);
      }
    } catch {
      // ignore security restrictions if any
    }
  };

  // Instant full reveal
  const handleInstantReveal = () => {
    triggerLevelUnlockConfetti();
    setScratchPercent(100);
    onScratchComplete(item.id);
  };

  // Local File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChangePhoto(item.id, event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const tilt = cardTilt ?? NATURAL_TILTS[(item.id - 1) % NATURAL_TILTS.length];
  const tapeClass = WASHI_TAPES[(item.id - 1) % WASHI_TAPES.length];

  return (
    <div className="relative flex flex-col items-center w-full pt-3 pb-2">
      {/* Decorative Scrapbook Washi Tape on Top of Card */}
      <div className="absolute top-0.5 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div
          className={`h-4 w-20 sm:w-24 rounded-[2px] shadow-xs border flex items-center justify-center backdrop-blur-xs select-none ${tapeClass}`}
          style={{ transform: `rotate(${item.id % 2 === 0 ? -3 : 2.5}deg)` }}
        >
          <div className="w-full border-t border-dashed border-white/70 mx-1.5" />
        </div>
      </div>

      {/* The Actual Showcase Photo Card */}
      <div
        id={`scratch-photo-card-${item.id}`}
        className={`w-full glass-card showcase-card rounded-3xl p-4 sm:p-5 border-2 transition-all duration-300 ${
          item.isScratched
            ? 'border-pink-300 bg-white/95 shadow-lg hover:shadow-xl'
            : item.isAnswered
            ? 'border-amber-300 bg-white/90 shadow-md hover:shadow-lg'
            : 'border-pink-200/90 shadow-sm hover:border-pink-300 hover:shadow-md'
        }`}
        style={{
          transform: `rotate(${tilt}deg)`,
        }}
      >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-pink-100 mb-3.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-xs ${
              item.isScratched
                ? 'bg-rose-500'
                : item.isAnswered
                ? 'bg-amber-500'
                : 'bg-pink-400'
            }`}
          >
            {item.id}
          </div>
          <h3 className="text-sm font-semibold font-sans-body text-rose-950 truncate max-w-[180px] sm:max-w-xs">
            {item.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          {item.isScratched ? (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Revealed
            </span>
          ) : item.isAnswered ? (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
              <Unlock className="w-3 h-3" /> Scratch Me!
            </span>
          ) : (
            <span className="text-[10px] font-bold text-rose-700 bg-pink-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" /> Answer to Unlock
            </span>
          )}

          {/* Quick Edit Question/Answer Trigger */}
          <button
            type="button"
            onClick={() => onEditItem(item)}
            className="p-1 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-pink-100 transition"
            title="Edit Question / Options"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* QUESTION & 3 OPTIONS BLOCK (Shown until answered) */}
      {!item.isAnswered ? (
        <div className="space-y-3.5 mb-2">
          {/* Question Prompt */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200/90 text-left">
            <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider block mb-1">
              💡 Hint Question:
            </span>
            <p className="text-xs sm:text-sm font-medium text-rose-900 leading-relaxed">
              "{item.question}"
            </p>
          </div>

          {/* 3 Choose Options */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-rose-700/80 tracking-wider block pl-1">
              Choose the right answer:
            </span>
            {item.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all active:scale-98 flex items-center justify-between ${
                  selectedOption === idx && idx === item.correctIndex
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                    : 'bg-white hover:bg-pink-50/80 border-pink-200 text-rose-900 hover:border-pink-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-pink-100 text-rose-700 text-[11px] font-bold flex items-center justify-center">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
                <span className="text-pink-300 text-xs">›</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ANSWERED: SCRATCH CARD & PHOTO REVEAL AREA */
        <div className="space-y-3">
          {/* Photo + Scratch Canvas Container */}
          <div
            ref={containerRef}
            className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden shadow-inner border border-pink-200 bg-pink-100 select-none group"
          >
            {/* The Actual Hidden Photo */}
            {!imageError ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={() => setImageError(true)}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  item.isScratched ? 'group-hover:scale-105 cursor-pointer' : ''
                }`}
                onClick={() => item.isScratched && onOpenLightbox(item)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-rose-50 text-center select-text">
                <ImageIcon className="w-8 h-8 text-rose-400 mb-2" />
                <p className="text-xs font-bold text-rose-900 mb-1">
                  Google Photos Direct Link Blocked
                </p>
                <p className="text-[11px] text-rose-700 leading-tight mb-2.5">
                  Google Photos share link browser-la embed aaga block pannudhu.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Upload Photo Directly 📁</span>
                </button>
              </div>
            )}

            {/* Click to Zoom Icon when revealed */}
            {item.isScratched && (
              <button
                type="button"
                onClick={() => onOpenLightbox(item)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-xs transition"
                title="View Full Size Photo"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            )}

            {/* Interactive HTML5 Scratch Canvas Layer */}
            {!item.isScratched && (
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-pointer touch-none z-10"
                onMouseDown={(e) => {
                  setIsScratching(true);
                  scratch(e.clientX, e.clientY);
                }}
                onMouseUp={() => setIsScratching(false)}
                onMouseLeave={() => setIsScratching(false)}
                onMouseMove={(e) => isScratching && scratch(e.clientX, e.clientY)}
                onTouchStart={(e) => {
                  setIsScratching(true);
                  if (e.touches[0]) {
                    scratch(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                onTouchEnd={() => setIsScratching(false)}
                onTouchMove={(e) => {
                  if (e.touches[0]) {
                    scratch(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
              />
            )}
          </div>

          {/* Scratch Progress & Controls */}
          {!item.isScratched ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-rose-700">
                <span className="font-semibold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  Scratch to reveal: {scratchPercent}%
                </span>
                <span className="text-[11px] text-rose-500">Auto-unlocks at 40%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-pink-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-200"
                  style={{ width: `${scratchPercent}%` }}
                />
              </div>

              {/* Fast reveal button */}
              <button
                type="button"
                onClick={handleInstantReveal}
                className="w-full py-2 px-3 bg-pink-100 hover:bg-pink-200 text-rose-800 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-rose-600 fill-current" />
                <span>Quick Scratch / Reveal Photo</span>
              </button>
            </div>
          ) : (
            /* Revealed Romantic Caption */
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-pink-50 via-rose-50 to-amber-50 border border-pink-200 text-left">
              <p className="text-xs sm:text-sm font-medium text-rose-950 leading-relaxed">
                {item.romanticCaption}
              </p>
              <div className="mt-2.5 pt-2 border-t border-pink-200/60 flex items-center justify-between text-[11px]">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                  Memory Unlocked & Saved
                </span>
                <button
                  type="button"
                  onClick={() => onOpenLightbox(item)}
                  className="text-rose-600 hover:text-rose-800 font-medium underline"
                >
                  View Large
                </button>
              </div>
            </div>
          )}

          {/* Change / Upload Custom Couple Photo Buttons */}
          <div className="flex items-center justify-between pt-1 text-[11px] text-rose-600">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 hover:text-rose-900 transition font-medium"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Upload Real Photo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              type="button"
              onClick={() => setShowPhotoUrlModal(!showPhotoUrlModal)}
              className="hover:text-rose-900 transition font-medium"
            >
              Change URL
            </button>
          </div>

          {/* Custom URL Input Mini Drawer */}
          {showPhotoUrlModal && (
            <div className="p-2.5 rounded-xl bg-white border border-pink-200 space-y-2 animate-in fade-in duration-150">
              <input
                type="text"
                placeholder="Paste image URL..."
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-pink-50 border border-pink-200 text-rose-900 focus:outline-none focus:border-rose-400"
              />
              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowPhotoUrlModal(false)}
                  className="px-2 py-1 text-[10px] text-rose-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (customUrlInput.trim()) {
                      onChangePhoto(item.id, customUrlInput.trim());
                      setShowPhotoUrlModal(false);
                      setCustomUrlInput('');
                    }
                  }}
                  className="px-2.5 py-1 text-[10px] bg-rose-500 text-white rounded-md font-semibold"
                >
                  Save Photo
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

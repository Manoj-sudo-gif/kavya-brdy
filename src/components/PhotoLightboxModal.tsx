import React from 'react';
import { X, Heart, Sparkles } from 'lucide-react';
import { PhotoMemoryItem } from '../types';

interface PhotoLightboxModalProps {
  isOpen: boolean;
  item: PhotoMemoryItem | null;
  onClose: () => void;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({
  isOpen,
  item,
  onClose,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full bg-white/95 rounded-3xl overflow-hidden shadow-2xl border-2 border-pink-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition backdrop-blur-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Photo */}
        <div className="w-full max-h-[65vh] bg-black flex items-center justify-center overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="w-full h-full max-h-[65vh] object-contain"
          />
        </div>

        {/* Details footer */}
        <div className="p-5 sm:p-6 bg-gradient-to-t from-pink-50 via-white to-pink-50 text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-rose-500 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {item.title}
            </span>
            <span className="text-xs text-rose-600 font-semibold flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              Kaviya & Me
            </span>
          </div>

          <p className="text-sm sm:text-base font-medium text-rose-950 leading-relaxed">
            "{item.romanticCaption}"
          </p>

          <p className="text-xs text-rose-700/80 italic pt-1">
            Question solved: {item.question}
          </p>
        </div>
      </div>
    </div>
  );
};

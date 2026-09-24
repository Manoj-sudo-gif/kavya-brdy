import React from 'react';
import { HeartCrack, Sparkles, X } from 'lucide-react';

interface RomanticModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export const RomanticModal: React.FC<RomanticModalProps> = ({
  isOpen,
  title,
  message,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="romantic-alert-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="romantic-alert-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm glass-player rounded-3xl p-6 text-center border-2 border-pink-300 shadow-2xl relative animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          id="modal-close-button"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-rose-400 hover:text-rose-700 hover:bg-pink-100/60 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Cute Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-500 text-white flex items-center justify-center shadow-lg mb-4 animate-bounce">
          <HeartCrack className="w-7 h-7" />
        </div>

        {/* Title */}
        <h3
          id="modal-title"
          className="font-handwriting text-2xl font-bold text-rose-900 mb-2 flex items-center justify-center gap-1.5"
        >
          <span>{title}</span>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </h3>

        {/* Message */}
        <p
          id="modal-message"
          className="text-sm font-medium text-rose-800/95 leading-relaxed mb-6"
        >
          {message}
        </p>

        {/* Action Button */}
        <button
          id="modal-dismiss-button"
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          Sari, Innoru Vatti Try Panren! 🥺❤️
        </button>
      </div>
    </div>
  );
};

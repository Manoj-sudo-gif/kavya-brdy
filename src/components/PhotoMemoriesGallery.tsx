import React, { useState, useEffect } from 'react';
import { Camera, Heart, Wand2, RotateCcw, CheckCircle2, Film, ArrowRight } from 'lucide-react';
import { PhotoMemoryItem } from '../types';
import { INITIAL_PHOTO_MEMORIES } from '../data/initialPhotos';
import { ScratchPhotoCard } from './ScratchPhotoCard';
import { EditQuestionModal } from './EditQuestionModal';
import { PhotoLightboxModal } from './PhotoLightboxModal';
import { RomanticModal } from './RomanticModal';
import { triggerGrandFireworksConfetti } from '../utils/confetti';

interface PhotoMemoriesGalleryProps {
  onGoToVideo?: () => void;
}

export const PhotoMemoriesGallery: React.FC<PhotoMemoriesGalleryProps> = ({ onGoToVideo }) => {
  // Always initialize fresh from INITIAL_PHOTO_MEMORIES on page load / refresh
  const [photos, setPhotos] = useState<PhotoMemoryItem[]>(() => {
    try {
      localStorage.removeItem('kaviya_birthday_photos_v1');
      localStorage.removeItem('kaviya_birthday_photos_v2');
      localStorage.removeItem('kaviya_birthday_photos_v3');
      localStorage.removeItem('kaviya_birthday_photos_v4');
      localStorage.removeItem('kaviya_birthday_photos_v5');
      localStorage.removeItem('kaviya_birthday_photos_v6');
    } catch {
      // ignore
    }
    return INITIAL_PHOTO_MEMORIES;
  });

  const [editingItem, setEditingItem] = useState<PhotoMemoryItem | null>(null);
  const [lightboxItem, setLightboxItem] = useState<PhotoMemoryItem | null>(null);
  const [wrongModalInfo, setWrongModalInfo] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: '',
  });

  const revealedCount = photos.filter((p) => p.isScratched).length;

  // Handle correct quiz answer
  const handleAnswerCorrect = (id: number) => {
    setPhotos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isAnswered: true } : item))
    );
  };

  // Handle scratch completed
  const handleScratchComplete = (id: number) => {
    setPhotos((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? { ...item, isAnswered: true, isScratched: true, scratchPercentage: 100 }
          : item
      );
      const newRevealed = updated.filter((p) => p.isScratched).length;
      if (newRevealed === updated.length) {
        triggerGrandFireworksConfetti();
      }
      return updated;
    });
  };

  // Handle wrong answer alert
  const handleWrongAnswer = (message: string) => {
    setWrongModalInfo({
      isOpen: true,
      message,
    });
  };

  // Save edited question
  const handleSaveEdit = (updatedItem: PhotoMemoryItem) => {
    setPhotos((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  // Change custom photo
  const handleChangePhoto = (id: number, newUrl: string) => {
    setPhotos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, imageUrl: newUrl } : item))
    );
  };

  // Quick Unlock & Scratch All (only one of the two allowed controls!)
  const handleScratchAll = () => {
    triggerGrandFireworksConfetti();
    setPhotos((prev) =>
      prev.map((item) => ({
        ...item,
        isAnswered: true,
        isScratched: true,
        scratchPercentage: 100,
      }))
    );
  };

  // Reset all to fresh unscratched state so all 20 questions can be answered & scratched again
  const handleReset = () => {
    setPhotos(
      INITIAL_PHOTO_MEMORIES.map((item) => ({
        ...item,
        isAnswered: false,
        isScratched: false,
        scratchPercentage: 0,
      }))
    );
    try {
      localStorage.removeItem('kaviya_birthday_photos_v1');
      localStorage.removeItem('kaviya_birthday_photos_v2');
      localStorage.removeItem('kaviya_birthday_photos_v3');
      localStorage.removeItem('kaviya_birthday_photos_v4');
      localStorage.removeItem('kaviya_birthday_photos_v5');
      localStorage.removeItem('kaviya_birthday_photos_v6');
    } catch {
      // ignore
    }
  };

  return (
    <div id="photo-memories-gallery-container" className="w-full space-y-6">
      {/* Gallery Header Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 text-center border-2 border-pink-200 shadow-xl relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border border-pink-300 text-rose-800 text-xs font-semibold uppercase tracking-wider mb-2">
          <Camera className="w-4 h-4 text-rose-500" />
          <span>Interactive Scratch & Reveal Vault</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
        </div>

        <h2 className="font-handwriting text-3xl sm:text-5xl font-bold text-rose-950 mb-2">
          Namma 20 Secret Photo Memories! 📸❤️
        </h2>
        <p className="text-xs sm:text-sm text-rose-800/85 max-w-xl mx-auto leading-relaxed">
          Kaviya Kutty, ovvoru photo-kum oru sweet hint question irukku! Correct answer choose pannitu, andha card-ah un viral-ala (finger) scratch panni namma special photo-va reveal pannu!
        </p>

        {/* Progress Metrics Bar */}
        <div className="mt-5 max-w-md mx-auto space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-900">
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              Photos Uncovered: {revealedCount} / {photos.length}
            </span>
            <span className="text-rose-600 font-bold">
              {Math.round((revealedCount / photos.length) * 100)}% Completed
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-pink-100 p-0.5 border border-pink-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 transition-all duration-300 shadow-xs"
              style={{ width: `${(revealedCount / photos.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Controls: ONLY Reveal All and Reset & Scratch Again */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-pink-100">
          <button
            type="button"
            onClick={handleScratchAll}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            title="Reveal all 20 photos instantly"
          >
            <Wand2 className="w-4 h-4" />
            <span>Reveal All ✨</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
            title="Reset all 20 photo questions to scratch again"
          >
            <RotateCcw className="w-4 h-4 text-rose-500" />
            <span>Reset & Scratch Again 🔄</span>
          </button>
        </div>
      </div>

      {/* 20 Scratch Photo Cards Display: In sequential order 1 to 20, 3 per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-start">
        {photos.map((item) => (
          <ScratchPhotoCard
            key={item.id}
            item={item}
            onAnswerCorrect={handleAnswerCorrect}
            onScratchComplete={handleScratchComplete}
            onWrongAnswer={handleWrongAnswer}
            onEditItem={(it) => setEditingItem(it)}
            onChangePhoto={handleChangePhoto}
            onOpenLightbox={(it) => setLightboxItem(it)}
          />
        ))}
      </div>

      {/* Bottom Finished Celebration Banner */}
      {revealedCount === photos.length && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white text-center shadow-xl space-y-3 animate-in fade-in zoom-in-95 duration-300">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-amber-200" />
            <span>20 / 20 Memories Fully Unlocked!</span>
          </div>
          <h3 className="font-handwriting text-3xl sm:text-4xl font-bold">
            All 20 Photos Revealed For En Kaviya Kutty! 💖
          </h3>
          <p className="text-xs sm:text-sm text-pink-100 max-w-md mx-auto">
            Indha ovvoru moment-um enakku avlo precious. Ennaikuumee indha love namma kooda irukkum D Challa Kutty!
          </p>

          {onGoToVideo && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onGoToVideo}
                className="px-6 py-3.5 bg-white hover:bg-pink-50 text-rose-700 font-bold text-sm rounded-2xl shadow-lg transition-all active:scale-95 inline-flex items-center gap-2 cursor-pointer"
              >
                <Film className="w-4 h-4 text-rose-600" />
                <span>Go to Grand Finale: Kaviya's Special Video 🎬❤️</span>
                <ArrowRight className="w-4 h-4 text-rose-600" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit Question Modal */}
      <EditQuestionModal
        isOpen={Boolean(editingItem)}
        item={editingItem}
        onSave={handleSaveEdit}
        onClose={() => setEditingItem(null)}
      />

      {/* Photo Fullscreen Lightbox Modal */}
      <PhotoLightboxModal
        isOpen={Boolean(lightboxItem)}
        item={lightboxItem}
        onClose={() => setLightboxItem(null)}
      />

      {/* Wrong Answer Cute Alert Modal */}
      <RomanticModal
        isOpen={wrongModalInfo.isOpen}
        title="Thappa Pochu D Challa Kutty!"
        message={wrongModalInfo.message}
        onClose={() => setWrongModalInfo({ isOpen: false, message: '' })}
      />
    </div>
  );
};

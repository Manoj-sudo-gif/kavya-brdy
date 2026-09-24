import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { PhotoMemoryItem } from '../types';

interface EditQuestionModalProps {
  isOpen: boolean;
  item: PhotoMemoryItem | null;
  onSave: (updatedItem: PhotoMemoryItem) => void;
  onClose: () => void;
}

export const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  isOpen,
  item,
  onSave,
  onClose,
}) => {
  const [question, setQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [correctIndex, setCorrectIndex] = useState(0);
  const [romanticCaption, setRomanticCaption] = useState('');

  useEffect(() => {
    if (item) {
      setQuestion(item.question);
      setOptionA(item.options[0]);
      setOptionB(item.options[1]);
      setOptionC(item.options[2]);
      setCorrectIndex(item.correctIndex);
      setRomanticCaption(item.romanticCaption);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...item,
      question: question.trim() || item.question,
      options: [
        optionA.trim() || item.options[0],
        optionB.trim() || item.options[1],
        optionC.trim() || item.options[2],
      ],
      correctIndex,
      romanticCaption: romanticCaption.trim() || item.romanticCaption,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-player rounded-3xl p-6 border-2 border-pink-300 shadow-2xl text-rose-950 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-200 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <h3 className="font-semibold text-base text-rose-900">
              Edit Question for {item.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-rose-400 hover:text-rose-700 hover:bg-pink-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Question Text */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-rose-800 uppercase tracking-wider">
              Hint Question (Tanglish):
            </label>
            <textarea
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your custom romantic question..."
              className="w-full p-2.5 rounded-xl bg-white border border-pink-200 text-xs sm:text-sm text-rose-900 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
            />
          </div>

          {/* 3 Choose Options */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-rose-800 uppercase tracking-wider">
              3 Choose Options (Select radio for correct answer):
            </label>

            {/* Option A */}
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="correctChoice"
                checked={correctIndex === 0}
                onChange={() => setCorrectIndex(0)}
                id="radio-opt-0"
                className="w-4 h-4 text-rose-600 focus:ring-rose-400"
              />
              <label htmlFor="radio-opt-0" className="text-xs font-bold text-rose-700 w-6">
                A:
              </label>
              <input
                type="text"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                placeholder="Option A"
                className="flex-1 p-2 rounded-lg bg-white border border-pink-200 text-xs sm:text-sm text-rose-900 focus:outline-none focus:border-rose-400"
              />
            </div>

            {/* Option B */}
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="correctChoice"
                checked={correctIndex === 1}
                onChange={() => setCorrectIndex(1)}
                id="radio-opt-1"
                className="w-4 h-4 text-rose-600 focus:ring-rose-400"
              />
              <label htmlFor="radio-opt-1" className="text-xs font-bold text-rose-700 w-6">
                B:
              </label>
              <input
                type="text"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                placeholder="Option B"
                className="flex-1 p-2 rounded-lg bg-white border border-pink-200 text-xs sm:text-sm text-rose-900 focus:outline-none focus:border-rose-400"
              />
            </div>

            {/* Option C */}
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="correctChoice"
                checked={correctIndex === 2}
                onChange={() => setCorrectIndex(2)}
                id="radio-opt-2"
                className="w-4 h-4 text-rose-600 focus:ring-rose-400"
              />
              <label htmlFor="radio-opt-2" className="text-xs font-bold text-rose-700 w-6">
                C:
              </label>
              <input
                type="text"
                value={optionC}
                onChange={(e) => setOptionC(e.target.value)}
                placeholder="Option C"
                className="flex-1 p-2 rounded-lg bg-white border border-pink-200 text-xs sm:text-sm text-rose-900 focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>

          {/* Romantic Caption */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-rose-800 uppercase tracking-wider">
              Romantic Caption (Shown after scratching):
            </label>
            <textarea
              rows={2}
              value={romanticCaption}
              onChange={(e) => setRomanticCaption(e.target.value)}
              placeholder="Love message when revealed..."
              className="w-full p-2.5 rounded-xl bg-white border border-pink-200 text-xs sm:text-sm text-rose-900 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-pink-100 text-rose-700 hover:bg-pink-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Question</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

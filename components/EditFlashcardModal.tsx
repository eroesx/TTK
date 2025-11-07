import React, { useState, useEffect } from 'react';
import type { Flashcard } from '../types';

interface EditFlashcardModalProps {
  card: Flashcard;
  onClose: () => void;
  onSave: (updatedCard: Omit<Flashcard, 'id'>) => void;
}

const EditFlashcardModal: React.FC<EditFlashcardModalProps> = ({ card, onClose, onSave }) => {
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);

  useEffect(() => {
    setFront(card.front);
    setBack(card.back);
  }, [card]);

  const handleSave = () => {
    if (front.trim() && back.trim()) {
      onSave({ front, back });
      onClose();
    } else {
      alert("Kartın önü ve arkası boş olamaz.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-2xl font-bold text-cyan-400 mb-6">Bilgi Kartını Düzenle</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="card-front" className="block text-sm font-medium text-slate-300 mb-2">Kartın Ön Yüzü (Soru)</label>
            <textarea
              id="card-front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="card-back" className="block text-sm font-medium text-slate-300 mb-2">Kartın Arka Yüzü (Cevap)</label>
            <textarea
              id="card-back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <button type="button" onClick={onClose} className="px-6 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">İptal</button>
          <button type="button" onClick={handleSave} className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors">Kaydet</button>
        </div>
      </div>
    </div>
  );
};

export default EditFlashcardModal;
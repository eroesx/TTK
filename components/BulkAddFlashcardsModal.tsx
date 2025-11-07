import React, { useState } from 'react';
import type { Topic, Flashcard } from '../types';

interface BulkAddFlashcardsModalProps {
  topic: Topic;
  onClose: () => void;
  onSave: (topicId: string, newCards: Array<Omit<Flashcard, 'id'>>) => void;
}

const BulkAddFlashcardsModal: React.FC<BulkAddFlashcardsModalProps> = ({ topic, onClose, onSave }) => {
  const [bulkText, setBulkText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    if (!bulkText.trim()) {
      setError('Lütfen eklenecek kartları girin.');
      return;
    }

    const lines = bulkText.split('\n').filter(line => line.trim() !== '');
    const newCards: Array<Omit<Flashcard, 'id'>> = [];

    for (const line of lines) {
      const parts = line.split(';');
      if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
        setError(`Hatalı formatlı satır: "${line}". Her satır "Soru;Cevap" formatında olmalıdır.`);
        return;
      }
      newCards.push({ front: parts[0].trim(), back: parts[1].trim() });
    }

    if (newCards.length > 0) {
      onSave(topic.id, newCards);
      onClose();
    } else {
      setError('Eklenecek geçerli kart bulunamadı.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-3xl shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Toplu Bilgi Kartı Ekle</h2>
        <p className="text-slate-400 mb-4">Her satıra bir kart gelecek şekilde, soruyu ve cevabı noktalı virgül (;) ile ayırarak girin.</p>
        <p className="text-slate-500 mb-6 text-sm bg-slate-900 p-2 rounded-md">Örnek:<br/>Türkiye'nin başkenti neresidir?;Ankara<br/>2+2 kaçtır?;4</p>
        <textarea
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          rows={10}
          className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
          placeholder="Kartları buraya yapıştırın..."
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <div className="flex justify-end gap-4 pt-6">
          <button type="button" onClick={onClose} className="px-6 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">İptal</button>
          <button type="button" onClick={handleSubmit} className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors">Kartları Ekle</button>
        </div>
      </div>
    </div>
  );
};

export default BulkAddFlashcardsModal;

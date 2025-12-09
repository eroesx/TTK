import React, { useState } from 'react';

interface EditQuestionTextModalProps {
  currentText: string;
  onSave: (newText: string) => void;
  onClose: () => void;
}

const EditQuestionTextModal: React.FC<EditQuestionTextModalProps> = ({ currentText, onSave, onClose }) => {
  const [editedText, setEditedText] = useState(currentText);

  const handleSave = () => {
    if (editedText.trim()) {
      onSave(editedText.trim());
    } else {
      alert("Soru metni boş olamaz.");
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
        <h2 className="text-2xl font-bold text-cyan-400 mb-6">
          Soru Metnini Düzenle
        </h2>
        
        <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows={5}
            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
            aria-label="Soru metni düzenleme alanı"
        />
        
        <div className="flex justify-end gap-4 pt-6">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">İptal</button>
            <button type="button" onClick={handleSave} className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors">Değişiklikleri Kaydet</button>
        </div>
      </div>
    </div>
  );
};

export default EditQuestionTextModal;

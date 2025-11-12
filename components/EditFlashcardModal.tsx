import React, { useEffect, useRef } from 'react';
import type { Flashcard } from '../types';

declare const Quill: any;

interface EditFlashcardModalProps {
  card: Flashcard;
  onClose: () => void;
  onSave: (updatedCard: Omit<Flashcard, 'id'>) => void;
}

const EditFlashcardModal: React.FC<EditFlashcardModalProps> = ({ card, onClose, onSave }) => {
  const frontEditorRef = useRef<HTMLDivElement>(null);
  const backEditorRef = useRef<HTMLDivElement>(null);
  const frontQuillRef = useRef<any>(null);
  const backQuillRef = useRef<any>(null);

  useEffect(() => {
    if (!frontEditorRef.current || !backEditorRef.current) return;

    const toolbarOptions = [
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }],
      ['clean']
    ];

    frontQuillRef.current = new Quill(frontEditorRef.current, {
      modules: { toolbar: toolbarOptions },
      theme: 'snow',
      placeholder: 'Kartın ön yüzünü yazın...'
    });
    frontQuillRef.current.root.innerHTML = card.front;
    
    backQuillRef.current = new Quill(backEditorRef.current, {
      modules: { toolbar: toolbarOptions },
      theme: 'snow',
      placeholder: 'Kartın arka yüzünü yazın...'
    });
    backQuillRef.current.root.innerHTML = card.back;
    
    return () => {
        frontQuillRef.current = null;
        backQuillRef.current = null;
        if(frontEditorRef.current) frontEditorRef.current.innerHTML = "";
        if(backEditorRef.current) backEditorRef.current.innerHTML = "";
    }
  }, []);

  const handleSave = () => {
    const frontHTML = frontQuillRef.current?.root.innerHTML || '';
    const backHTML = backQuillRef.current?.root.innerHTML || '';
    
    const frontText = frontQuillRef.current?.getText().trim() || '';
    const backText = backQuillRef.current?.getText().trim() || '';

    if (frontText && backText) {
      onSave({ front: frontHTML, back: backHTML });
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
        className="bg-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl relative flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 pb-6 shrink-0 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-2xl font-bold text-cyan-400">Bilgi Kartını Düzenle</h2>
        </div>
        
        <div className="overflow-y-auto px-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Kartın Ön Yüzü (Soru)</label>
            <div ref={frontEditorRef} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Kartın Arka Yüzü (Cevap)</label>
            <div ref={backEditorRef} />
          </div>
        </div>

        <div className="flex justify-end gap-4 p-8 pt-6 shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">İptal</button>
          <button type="button" onClick={handleSave} className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors">Kaydet</button>
        </div>
      </div>
    </div>
  );
};

export default EditFlashcardModal;
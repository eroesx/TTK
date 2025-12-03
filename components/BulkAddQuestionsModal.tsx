
import React, { useState } from 'react';
import type { Topic, Question } from '../types';

interface BulkAddQuestionsModalProps {
  topic: Topic;
  onClose: () => void;
  onAddQuestions: (topicId: string, newQuestions: Question[]) => void;
}

const BulkAddQuestionsModal: React.FC<BulkAddQuestionsModalProps> = ({ topic, onClose, onAddQuestions }) => {
  const [bulkText, setBulkText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    if (!bulkText.trim()) {
      setError('Lütfen eklenecek soruları girin.');
      return;
    }

    const blocks = bulkText.trim().split(/\n\s*\n/);
    const newQuestions: Question[] = [];
    // Regex A, B, C, D, E seçeneklerini destekleyecek şekilde güncellendi
    const optionRegex = /^([A-E])[\)\.]\s+(.*)/i;
    const answerRegex = /^(?:Cevap|Yanıt|Answer):\s*([A-E])/i;

    let successCount = 0;
    let failCount = 0;

    blocks.forEach((block, index) => {
        if (!block.trim()) return;

        const lines = block.split('\n').map(l => l.trim()).filter(l => l);
        
        let questionText = '';
        const optionsMap: {[key: string]: string} = {};
        let correctAnswerIndex = -1;
        const nonOptionLines: string[] = [];

        // Cevabı Bul
        const answerLineIndex = lines.findIndex(line => answerRegex.test(line));
        if (answerLineIndex !== -1) {
            const match = lines[answerLineIndex].match(answerRegex);
            if (match) {
                const char = match[1].toUpperCase();
                correctAnswerIndex = char.charCodeAt(0) - 'A'.charCodeAt(0);
            }
            lines.splice(answerLineIndex, 1); // Cevap satırını çıkar
        }

        // Seçenekleri Bul
        lines.forEach(line => {
            const match = line.match(optionRegex);
            if (match) {
                const char = match[1].toUpperCase();
                optionsMap[char] = match[2];
            } else {
                nonOptionLines.push(line);
            }
        });

        // Soruyu Oluştur
        // Soru metninin başındaki "1.", "1)" gibi numaraları temizle
        if (nonOptionLines.length > 0) {
            nonOptionLines[0] = nonOptionLines[0].replace(/^\d+[\.\)\s]+/, '');
            questionText = nonOptionLines.join(' ');
        }

        // 5 Seçeneğe kadar kontrol et (A-E)
        // Eğer E seçeneği yoksa undefined dönecektir, filter ile temizleriz.
        const possibleOptions = ['A', 'B', 'C', 'D', 'E'];
        const optionsArr = possibleOptions.map(char => optionsMap[char]).filter(opt => opt !== undefined);

        // En az 2 seçenek olmalı ve soru metni dolu olmalı
        if (questionText && optionsArr.length >= 2 && correctAnswerIndex !== -1 && correctAnswerIndex < optionsArr.length) {
            newQuestions.push({
                id: Date.now() + index, // Basit ID oluşturma
                questionText,
                options: optionsArr,
                correctAnswerIndex
            });
            successCount++;
        } else {
            failCount++;
            console.warn('Blok ayrıştırılamadı:', block);
        }
    });

    if (newQuestions.length > 0) {
        onAddQuestions(topic.id, newQuestions);
        alert(`${successCount} soru başarıyla eklendi.${failCount > 0 ? ` ${failCount} soru format hatası nedeniyle eklenemedi.` : ''}`);
        onClose();
    } else {
        setError('Hiçbir geçerli soru bulunamadı. Lütfen formatı kontrol edin. Soru blokları arasında boşluk olduğundan ve "Cevap: X" formatının doğru olduğundan emin olun.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-4xl shadow-2xl relative max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Toplu Soru Ekle (Metin ile)</h2>
        
        <div className="text-slate-400 mb-4 text-sm bg-slate-900 p-4 rounded-md border border-slate-700 overflow-y-auto max-h-40">
            <p className="font-bold text-slate-300 mb-2">Format Kuralları:</p>
            <ul className="list-disc list-inside space-y-1">
                <li>Her soru grubu arasında <strong>bir boş satır</strong> bırakın.</li>
                <li>Seçenekler <strong>A)</strong>, <strong>B.</strong> vb. şeklinde başlamalıdır (A, B, C, D, E desteklenir).</li>
                <li>Doğru cevap en sonda <strong>Cevap: E</strong> veya <strong>Answer: A</strong> şeklinde belirtilmelidir.</li>
            </ul>
            <p className="font-semibold text-slate-300 mt-3">Örnek:</p>
            <pre className="mt-1 text-xs text-slate-500 whitespace-pre-wrap font-mono select-all bg-slate-800 p-2 rounded border border-slate-600">
{`1. Türkiye Cumhuriyeti'nin başkenti neresidir?
A) İstanbul
B) Ankara
C) İzmir
D) Bursa
E) Adana
Cevap: B

2. Aşağıdakilerden hangisi bir mevsim değildir?
A) Yaz
B) Mart
C) Kış
D) Sonbahar
Cevap: B`}
            </pre>
        </div>
        
        <textarea
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-md p-4 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition font-mono text-sm flex-grow min-h-[200px]"
          placeholder="Sorularınızı buraya yapıştırın..."
        />
        
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        
        <div className="flex justify-end gap-4 pt-6 shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">İptal</button>
          <button type="button" onClick={handleSubmit} className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors">Soruları Ekle</button>
        </div>
      </div>
    </div>
  );
};

export default BulkAddQuestionsModal;

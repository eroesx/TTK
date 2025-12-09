
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

  const parseInlineQuestion = (line: string, indexOffset: number): Question | null => {
    // 1. Extract Answer at the end
    const answerMatch = line.match(/(?:Cevap|Yanıt|Answer):\s*([A-E])\s*$/i);
    if (!answerMatch) return null;

    const answerChar = answerMatch[1].toUpperCase();
    const correctAnswerIndex = answerChar.charCodeAt(0) - 'A'.charCodeAt(0);
    
    // Remove answer part from line
    const textWithoutAnswer = line.substring(0, answerMatch.index).trim();

    // 2. Extract Options
    // We look for patterns like " A) " or " A. " to split the text
    // The first one marks the end of the question text
    const firstOptionMatch = textWithoutAnswer.match(/\s(A[\)\.])\s/);
    if (!firstOptionMatch) return null;

    const questionText = textWithoutAnswer.substring(0, firstOptionMatch.index).trim().replace(/^\d+[\.\)\s]+/, ''); // Remove leading numbering
    const optionsPart = textWithoutAnswer.substring(firstOptionMatch.index || 0);

    // Split by positive lookahead for option markers
    // This splits " A) val B) val" into [" A) val", " B) val"]
    const parts = optionsPart.split(/\s(?=[A-E][\)\.]\s)/);
    
    const optionsMap: { [key: string]: string } = {};
    parts.forEach(part => {
        const match = part.trim().match(/^([A-E])[\)\.]\s+(.*)/);
        if (match) {
            optionsMap[match[1]] = match[2].trim();
        }
    });

    // Construct options array
    const possibleOptions = ['A', 'B', 'C', 'D', 'E'];
    const optionsArr = possibleOptions.map(char => optionsMap[char]).filter(opt => opt !== undefined);

    if (optionsArr.length < 2) return null;
    if (correctAnswerIndex >= optionsArr.length) return null; // Invalid answer index

    return {
        id: Date.now() + indexOffset,
        questionText,
        options: optionsArr,
        correctAnswerIndex
    };
  };

  const parseBlockQuestion = (lines: string[], indexOffset: number): Question | null => {
    const answerRegex = /^(?:Cevap|Yanıt|Answer):\s*([A-E])/i;
    const optionRegex = /^([A-E])[\)\.]\s+(.*)/i;

    let questionText = '';
    const optionsMap: {[key: string]: string} = {};
    let correctAnswerIndex = -1;
    const nonOptionLines: string[] = [];

    // Find Answer
    const answerLineIndex = lines.findIndex(line => answerRegex.test(line));
    if (answerLineIndex !== -1) {
        const match = lines[answerLineIndex].match(answerRegex);
        if (match) {
            correctAnswerIndex = match[1].toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
        }
        // Remove answer line from consideration for text/options
        lines.splice(answerLineIndex, 1);
    } else {
        return null; // No answer found
    }

    // Process Options and Question Text
    lines.forEach(line => {
        const match = line.match(optionRegex);
        if (match) {
            optionsMap[match[1].toUpperCase()] = match[2].trim();
        } else {
            nonOptionLines.push(line);
        }
    });

    if (nonOptionLines.length > 0) {
        nonOptionLines[0] = nonOptionLines[0].replace(/^\d+[\.\)\s]+/, '');
        questionText = nonOptionLines.join(' ').trim();
    }

    const possibleOptions = ['A', 'B', 'C', 'D', 'E'];
    const optionsArr = possibleOptions.map(char => optionsMap[char]).filter(opt => opt !== undefined);

    if (questionText && optionsArr.length >= 2 && correctAnswerIndex !== -1 && correctAnswerIndex < optionsArr.length) {
        return {
            id: Date.now() + indexOffset,
            questionText,
            options: optionsArr,
            correctAnswerIndex
        };
    }
    return null;
  };

  const handleSubmit = () => {
    setError('');
    if (!bulkText.trim()) {
      setError('Lütfen eklenecek soruları girin.');
      return;
    }

    const rawLines = bulkText.split('\n');
    const newQuestions: Question[] = [];
    let buffer: string[] = [];
    let successCount = 0;
    let failCount = 0;

    // Helper to process the buffer as a block question
    const processBuffer = () => {
        if (buffer.length > 0) {
            // Filter empty lines within the buffer
            const cleanBuffer = buffer.map(l => l.trim()).filter(l => l);
            if (cleanBuffer.length > 0) {
                const q = parseBlockQuestion([...cleanBuffer], newQuestions.length); // pass copy
                if (q) {
                    newQuestions.push(q);
                    successCount++;
                } else {
                    failCount++; // Block existed but failed parsing
                }
            }
            buffer = [];
        }
    };

    for (let i = 0; i < rawLines.length; i++) {
        const line = rawLines[i].trim();
        
        if (!line) {
            // Empty line acts as a delimiter for blocks
            processBuffer();
            continue;
        }

        // Try to parse as single-line question first
        const inlineQ = parseInlineQuestion(line, newQuestions.length);
        
        if (inlineQ) {
            // If we found an inline question, any pending buffer must be a previous block
            processBuffer(); 
            newQuestions.push(inlineQ);
            successCount++;
        } else {
            // If not inline, assume it's part of a block
            buffer.push(line);
        }
    }
    // Process any remaining lines in buffer
    processBuffer();

    if (newQuestions.length > 0) {
        onAddQuestions(topic.id, newQuestions);
        alert(`${successCount} soru başarıyla eklendi.${failCount > 0 ? ` ${failCount} adet soru veya blok format hatası nedeniyle eklenemedi.` : ''}`);
        onClose();
    } else {
        setError('Hiçbir geçerli soru bulunamadı. Lütfen formatı kontrol edin. Soruların "Cevap: [A-E]" ile bittiğinden emin olun.');
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
            <p className="font-bold text-slate-300 mb-2">Desteklenen Formatlar:</p>
            <ul className="list-disc list-inside space-y-2 mb-3">
                <li>
                    <strong>Tek Satır Formatı:</strong> Soru, seçenekler ve cevap tek satırda.
                    <br/><span className="text-xs text-slate-500 ml-4">Örnek: 1. Soru Metni? A) Seçenek B) Seçenek Cevap: A</span>
                </li>
                <li>
                    <strong>Blok Formatı:</strong> Soru ve seçenekler alt alta, soru grupları arasında boş satır.
                </li>
            </ul>
            <p className="font-semibold text-slate-300">Örnek Giriş:</p>
            <pre className="mt-1 text-xs text-slate-500 whitespace-pre-wrap font-mono select-all bg-slate-800 p-2 rounded border border-slate-600">
{`4982 sayılı Kanuna göre Kurul kaç üyeden oluşur? A) 5 B) 7 C) 9 D) 11 E) 13 Cevap: C

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

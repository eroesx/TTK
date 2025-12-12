
import React, { useState, useRef, useEffect } from 'react';
import type { SettingsViewProps, Question } from '../types';
import EditableQuestionForm from './EditableQuestionForm';
import DownloadIcon from './icons/DownloadIcon';
import UploadIcon from './icons/UploadIcon';
import TrashIcon from './icons/TrashIcon';
import AddIcon from './icons/AddIcon';
import { GITHUB_REPO_URL } from '../data/quizData';
import GitHubIcon from './icons/GitHubIcon';
import RestoreIcon from './icons/RestoreIcon';
import SpeakerIcon from './icons/SpeakerIcon';
import BrainIcon from './icons/BrainIcon';

const mobileFontOptions = [
    { label: 'Küçük (10.5pt)', value: 'text-sm' },
    { label: 'Normal (12pt)', value: 'text-base' },
    { label: 'Büyük (13.5pt)', value: 'text-lg' },
    { label: 'Çok Büyük (15pt)', value: 'text-xl' },
  ];

const desktopFontOptions = [
    { label: 'Normal (15pt)', value: 'text-xl' },
    { label: 'Büyük (18pt)', value: 'text-2xl' },
    { label: 'Çok Büyük (22.5pt)', value: 'text-3xl' },
    { label: 'En Büyük (27pt)', value: 'text-4xl' },
];

const SettingsView: React.FC<SettingsViewProps> = ({ 
  onBack, 
  topics, 
  onEditQuestion, 
  onDeleteQuestion, 
  onAddNewQuestion,
  isMobileLayout,
  onToggleMobileLayout,
  onResetData,
  onBackupData,
  onRestoreData,
  onRestoreDefaultData,
  appTitle,
  onUpdateAppTitle,
  mobileFontSize,
  desktopFontSize,
  onUpdateMobileFontSize,
  onUpdateDesktopFontSize,
  isTextToSpeechEnabled,
  onToggleTextToSpeech,
  speechRate,
  onUpdateSpeechRate,
  isAiExplanationEnabled,
  onToggleAiExplanation,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?.id || '');
  
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState(['', '']); // Default 2 options
  const [newCorrectAnswerIndex, setNewCorrectAnswerIndex] = useState<number | null>(null);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state for editing app title
  const [editedAppTitle, setEditedAppTitle] = useState(appTitle);

  // Sync editedAppTitle with appTitle prop changes
  useEffect(() => {
    setEditedAppTitle(appTitle);
  }, [appTitle]);

  const selectedTopic = topics.find(t => t.id === selectedTopicId);
  const questions = selectedTopic?.questions || [];

  const handleNewOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newOptions];
    updatedOptions[index] = value;
    setNewOptions(updatedOptions);
  };

  const handleAddNewOption = () => {
    if (newOptions.length < 5) {
      setNewOptions([...newOptions, '']);
    }
  };

  const handleRemoveNewOption = (indexToRemove: number) => {
    if (newOptions.length <= 2) return;

    const updatedOptions = newOptions.filter((_, i) => i !== indexToRemove);
    setNewOptions(updatedOptions);

    if (newCorrectAnswerIndex === indexToRemove) {
      setNewCorrectAnswerIndex(null);
    } else if (newCorrectAnswerIndex !== null && newCorrectAnswerIndex > indexToRemove) {
      setNewCorrectAnswerIndex(newCorrectAnswerIndex - 1);
    }
  };

  const handleAddNewQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTopicId) {
        setAddError('Lütfen önce bir konu seçin.');
        return;
    }
    if (!newQuestionText.trim()) {
        setAddError('Soru metni boş olamaz.');
        return;
    }
    if (newOptions.some(opt => !opt.trim())) {
        setAddError('Tüm seçenekler doldurulmalıdır.');
        return;
    }
    if (newCorrectAnswerIndex === null) {
        setAddError('Doğru cevap seçilmelidir.');
        return;
    }

    const newQuestion: Question = {
      id: Date.now(),
      questionText: newQuestionText.trim(),
      options: newOptions.map(opt => opt.trim()),
      correctAnswerIndex: newCorrectAnswerIndex,
    };

    onAddNewQuestion(selectedTopicId, newQuestion);

    // Reset form and show success message
    setNewQuestionText('');
    setNewOptions(['', '']);
    setNewCorrectAnswerIndex(null);
    setAddError('');
    setAddSuccess('Soru başarıyla eklendi! Yeni bir tane daha ekleyebilirsiniz.');
    setTimeout(() => setAddSuccess(''), 4000);
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          onRestoreData(file);
      }
      if(event.target) {
          event.target.value = '';
      }
  };

  const handleSaveAppTitle = () => {
    if (editedAppTitle.trim()) {
      onUpdateAppTitle(editedAppTitle.trim());
      alert('Uygulama başlığı güncellendi!');
    } else {
      alert('Uygulama başlığı boş olamaz.');
    }
  };


  return (
    <div className="relative bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto animate-fade-in">
      <button onClick={onBack} aria-label="Ana menüye geri dön" className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors duration-200 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      
      <h2 className="text-center text-4xl font-bold text-cyan-400 mb-8">Ayarlar</h2>

      {/* --- App Settings Section --- */}
      <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Görünüm Ayarları</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <label htmlFor="app-title-input" className="block text-slate-300 font-medium cursor-pointer">
                Uygulama Başlığı
              </label>
              <p className="text-sm text-slate-500 font-normal mt-1">Ana ekranda gösterilen başlığı değiştirin.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
              <input
                id="app-title-input"
                type="text"
                value={editedAppTitle}
                onChange={(e) => setEditedAppTitle(e.target.value)}
                className="w-full sm:w-auto bg-slate-900 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition text-base text-white"
              />
              <button
                onClick={handleSaveAppTitle}
                className="px-4 py-2 rounded-md bg-cyan-600 text-white font-semibold hover:bg-cyan-500 transition-colors shrink-0"
                aria-label="Uygulama başlığını kaydet"
              >
                Kaydet
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 py-4 border-t border-slate-800">
            <div>
              <label htmlFor="mobile-layout-toggle" className="text-slate-300 font-medium cursor-pointer">
                Mobil Arayüzü
                <p className="text-sm text-slate-500 font-normal mt-1">Arayüzü mobil cihazlar için optimize edilmiş dar bir görünüme geçirir.</p>
              </label>
            </div>
            <label htmlFor="mobile-layout-toggle" className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                id="mobile-layout-toggle" 
                className="sr-only peer" 
                checked={isMobileLayout}
                onChange={onToggleMobileLayout}
              />
              <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between gap-4 py-4 border-t border-slate-800">
            <div>
              <label htmlFor="mobile-font-size" className="text-slate-300 font-medium">
                Mobil Soru Font Boyutu
              </label>
              <p className="text-sm text-slate-500 font-normal mt-1">Mobil arayüzde soru metninin boyutunu ayarlar.</p>
            </div>
            <select 
              id="mobile-font-size"
              value={mobileFontSize}
              onChange={(e) => onUpdateMobileFontSize(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition text-base text-white"
            >
              {mobileFontOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-between gap-4 py-4 border-t border-slate-800">
            <div>
              <label htmlFor="desktop-font-size" className="text-slate-300 font-medium">
                Masaüstü Soru Font Boyutu
              </label>
              <p className="text-sm text-slate-500 font-normal mt-1">Geniş ekranlarda soru metninin boyutunu ayarlar.</p>
            </div>
            <select 
              id="desktop-font-size"
              value={desktopFontSize}
              onChange={(e) => onUpdateDesktopFontSize(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition text-base text-white"
            >
              {desktopFontOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* --- Quiz Helpers Section --- */}
      <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Sınav Yardımcıları</h3>
        <div className="flex flex-col gap-4">
            {/* Text-to-Speech Toggle */}
            <div className="flex items-center justify-between gap-4 py-2">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg shrink-0">
                        <SpeakerIcon className="h-6 w-6 text-sky-400" />
                    </div>
                    <div>
                        <label htmlFor="tts-toggle" className="text-slate-300 font-medium cursor-pointer block">
                            Soruları Sesli Okuma (TTS)
                        </label>
                        <p className="text-sm text-slate-500 font-normal mt-1">Soru ekranında metni sesli okutmak için bir buton gösterir.</p>
                    </div>
                </div>
                <label htmlFor="tts-toggle" className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                        type="checkbox" 
                        id="tts-toggle" 
                        className="sr-only peer" 
                        checked={isTextToSpeechEnabled}
                        onChange={onToggleTextToSpeech}
                    />
                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
            </div>

            {/* Speech Rate Slider - Only visible if TTS is enabled */}
            {isTextToSpeechEnabled && (
                <div className="flex items-center justify-between gap-4 py-2 pl-12 pr-1 border-b border-slate-800 pb-4">
                    <div className="flex-grow">
                        <label htmlFor="speech-rate" className="text-slate-300 font-medium block text-sm">
                            Konuşma Hızı: <span className="text-cyan-400 font-bold">{speechRate}x</span>
                        </label>
                        <input
                            type="range"
                            id="speech-rate"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={speechRate}
                            onChange={(e) => onUpdateSpeechRate(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 mt-2"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span>Yavaş (0.5x)</span>
                            <span>Normal (1.0x)</span>
                            <span>Hızlı (2.0x)</span>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Explanation Toggle */}
            <div className="flex items-center justify-between gap-4 py-4 border-t border-slate-800">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg shrink-0">
                        <BrainIcon className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div>
                        <label htmlFor="ai-explanation-toggle" className="text-slate-300 font-medium cursor-pointer block">
                            Yapay Zeka (AI) Açıklama
                        </label>
                        <p className="text-sm text-slate-500 font-normal mt-1">Yanlış cevap verdiğinizde sorunun nedenini açıklayan AI butonu gösterir. (Varsayılan: Kapalı)</p>
                    </div>
                </div>
                <label htmlFor="ai-explanation-toggle" className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                        type="checkbox" 
                        id="ai-explanation-toggle" 
                        className="sr-only peer" 
                        checked={isAiExplanationEnabled}
                        onChange={onToggleAiExplanation}
                    />
                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
            </div>
        </div>
      </div>
      
      {/* --- Data Management Section --- */}
      <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Veri Yönetimi</h3>
        
        <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-800">
          <div>
            <p className="text-slate-300 font-medium">Tüm Verileri Yedekle</p>
            <p className="text-sm text-slate-500 font-normal mt-1">Tüm konuları, soruları, bilgi kartlarını ve özetleri tek bir dosyaya indirir.</p>
          </div>
          <button 
            onClick={onBackupData}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-sky-600 text-white font-semibold hover:bg-sky-500 transition-colors shrink-0"
            aria-label="Tüm verileri yedekle"
          >
            <DownloadIcon className="h-5 w-5" />
            Yedekle
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-800">
          <div>
            <p className="text-slate-300 font-medium">Yedekten Geri Yükle</p>
            <p className="text-sm text-slate-500 font-normal mt-1">Daha önce indirdiğiniz yedek dosyasından tüm verileri geri yükler. Mevcut verileriniz silinir.</p>
          </div>
          <button 
            onClick={handleRestoreClick}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-amber-600 text-white font-semibold hover:bg-amber-500 transition-colors shrink-0"
            aria-label="Yedekten geri yükle"
          >
            <UploadIcon className="h-5 w-5" />
            Geri Yükle
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />
        </div>

        <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-800">
          <div>
            <p className="text-slate-300 font-medium">Varsayılan Verileri Yükle</p>
            <p className="text-sm text-slate-500 font-normal mt-1">Uygulamayı, içinde gömülü olan zengin soru bankasıyla ilk haline getirir.</p>
          </div>
          <button 
            onClick={onRestoreDefaultData}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-teal-600 text-white font-semibold hover:bg-teal-500 transition-colors shrink-0"
            aria-label="Varsayılan verileri yükle"
          >
            <RestoreIcon className="h-5 w-5" />
            Varsayılanı Yükle
          </button>
        </div>
        
        <div className="flex items-center justify-between gap-4 pt-4">
          <div>
            <p className="text-slate-300 font-medium">Uygulama Verilerini Sıfırla</p>
            <p className="text-sm text-slate-500 font-normal mt-1">Tüm eklenen konuları, soruları ve diğer değişiklikleri silerek uygulamayı başlangıç durumuna döndürür.</p>
          </div>
          <button 
            onClick={onResetData}
            className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-500 transition-colors shrink-0"
            aria-label="Uygulama verilerini sıfırla"
          >
            Sıfırla
          </button>
        </div>
      </div>

      <h3 className="text-center text-3xl font-bold text-cyan-400 mb-8">Soru Bankası Yönetimi</h3>

      {/* --- Questions Section --- */}
      <div className="mb-6">
        <label htmlFor="topic-select-editor" className="block text-sm font-medium text-slate-300 mb-2">
          Düzenlemek veya yeni soru eklemek için bir konu seçin:
        </label>
        <select 
          id="topic-select-editor"
          value={selectedTopicId}
          onChange={(e) => setSelectedTopicId(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-md p-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
        >
          {topics.map(topic => (
            <option key={topic.id} value={topic.id}>{topic.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-4 -mr-4">
        {questions.length > 0 ? (
          questions.map(question => (
            <EditableQuestionForm
              key={question.id}
              question={question}
              onSave={(updatedQuestion) => onEditQuestion(selectedTopicId, updatedQuestion)}
              onDelete={() => onDeleteQuestion(selectedTopicId, question.id)}
            />
          ))
        ) : (
          <p className="text-center text-slate-400 py-8">Bu konu için düzenlenecek soru bulunmuyor.</p>
        )}
      </div>

       {/* --- Add New Question Form --- */}
       <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 mt-8">
        <h3 className="text-xl font-bold text-white mb-4">Yeni Soru Ekle</h3>
        {selectedTopic ? (
          <form onSubmit={handleAddNewQuestionSubmit} className="space-y-4">
            <div>
              <label htmlFor="newQuestionText" className="block text-sm font-medium text-slate-300 mb-1">Soru Metni</label>
              <textarea
                id="newQuestionText"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                rows={3}
                className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                placeholder="Yeni soruyu buraya yazın..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Seçenekler (Doğru olanı işaretleyin)</label>
              <div className="space-y-2">
                {newOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="newCorrectAnswer"
                      id={`new-option-${index}`}
                      checked={newCorrectAnswerIndex === index}
                      onChange={() => setNewCorrectAnswerIndex(index)}
                      className="h-4 w-4 text-cyan-600 bg-slate-700 border-slate-600 focus:ring-cyan-500 shrink-0"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleNewOptionChange(index, e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                      placeholder={`Seçenek ${index + 1}`}
                    />
                    {newOptions.length > 2 && (
                        <button
                        type="button"
                        onClick={() => handleRemoveNewOption(index)}
                        className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                        title="Seçeneği Sil"
                        >
                        <TrashIcon />
                        </button>
                    )}
                  </div>
                ))}
              </div>
              {newOptions.length < 5 && (
                <button
                    type="button"
                    onClick={handleAddNewOption}
                    className="mt-3 flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                >
                    <AddIcon className="h-4 w-4" />
                    Seçenek Ekle
                </button>
              )}
            </div>
            {addError && <p className="text-red-400 text-sm">{addError}</p>}
            {addSuccess && <p className="text-green-400 text-sm">{addSuccess}</p>}
            <div className="flex justify-end">
              <button type="submit" className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors">
                Soruyu Ekle
              </button>
            </div>
          </form>
        ) : (
          <p className="text-slate-400 text-center py-4">Yeni soru eklemek için lütfen yukarıdan bir konu seçin.</p>
        )}
      </div>

      {GITHUB_REPO_URL && (
        <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 mt-8 text-center">
            <h3 className="text-xl font-bold text-white mb-4">Proje Hakkında</h3>
            <a 
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-colors border border-slate-600"
            >
                <GitHubIcon className="h-6 w-6" />
                GitHub Deposuna Git
            </a>
        </div>
      )}

    </div>
  );
};

export default SettingsView;

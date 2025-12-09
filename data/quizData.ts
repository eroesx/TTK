
import React from 'react';
import ScienceIcon from '../components/icons/ScienceIcon';
import HistoryIcon from '../components/icons/HistoryIcon';
import CodeIcon from '../components/icons/CodeIcon';
import BookIcon from '../components/icons/BookIcon';
import LawIcon from '../components/icons/LawIcon';
import GlobeIcon from '../components/icons/GlobeIcon';

export const DATA_VERSION = 25; // Veri yapısı güncellendiğinde bu sürümü artırın

export const GITHUB_REPO_URL = "https://github.com/eroesx/TTK";

export const availableIcons = [
    { name: 'History', component: React.createElement(HistoryIcon) },
    { name: 'Science', component: React.createElement(ScienceIcon) },
    { name: 'Code', component: React.createElement(CodeIcon) },
    { name: 'Book', component: React.createElement(BookIcon) },
    { name: 'Law', component: React.createElement(LawIcon) },
    { name: 'Globe', component: React.createElement(GlobeIcon) }
];

export const availableColorPalettes = [
    { name: 'Orange', color: "bg-orange-500/20", bgColor: "bg-orange-900/40" },
    { name: 'Sky', color: "bg-sky-500/20", bgColor: "bg-sky-900/40" },
    { name: 'Emerald', color: "bg-emerald-500/20", bgColor: "bg-emerald-900/40" },
    { name: 'Rose', color: "bg-rose-500/20", bgColor: "bg-rose-900/40" },
    { name: 'Indigo', color: "bg-indigo-500/20", bgColor: "bg-indigo-900/40" },
    { name: 'Teal', color: "bg-teal-500/20", bgColor: "bg-teal-900/40" },
];

export const quizData = {
  "topicNames": [
    "Türkiye Cumhuriyet Anayasası",
    "Atatürk İlkeleri ve İnkilap Tarihi",
    "Türkçe Dil Bilgisi",
    "657 Sayılı Devlet Memurları Kanunu",
    "399 Sayılı Kanun Hükmünde Kararname",
    "TTK Ana Statüsü ve Teşkilat Yapısı",
    "TTK Sözleşmeli Personel Sicil Amirliği Yönetmeliği",
    "TTK Disiplin İşlemleri Usul ve Esas Yönergesi",
    "Etik İlkeleri Yönetmeliği",
    "Resmi Yazışmalarda Uygulanacak Usu ve Esaslar Hak. Yönetmelik",
    "Devlet Arşiv Hizmetleri Yönetmeliği",
    "Devlet Malını Koruma ve Tasarruf Tedbirleri",
    "4982 Sayılı Bilgi Edinme Kanunu",
    "3071 Sayılı Dilekçe Kanunu",
    "Protokol ve Misafir Ağırlama ve Nezaket Kuralları",
    "233 Sayılı KHK",
    "7201 sayılı Tebligat Kanunu"
  ],
  "summariesData": [],
  "questionsData": []
};

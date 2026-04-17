'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Sparkles, ListTodo, Briefcase, RefreshCcw, Target, LayoutTemplate, Zap } from 'lucide-react';

// API'den gelecek verinin tipini (şablonunu) tanımlıyoruz
export interface AnalysisData {
  score: number;
  jobMatchScore: number;
  jobMatchAnalysis: string; // <-- BU SATIRI EKLE
  subScores: { label: string; score: number }[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  checklist: { id: number; text: string; isCompleted: boolean }[];
}

interface ResultDashboardProps {
  data: AnalysisData;
  onReset: () => void;
}

export default function ResultDashboard({ data, onReset }: ResultDashboardProps) {
  const [checklist, setChecklist] = useState(data.checklist);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Yeni veri geldiğinde checklist'i güncelle
    setChecklist(data.checklist);
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, [data]);

  const toggleChecklist = (id: number) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: "text-emerald-500", bg: "bg-emerald-500", stroke: "stroke-emerald-500", lightBg: "bg-emerald-50" };
    if (score >= 50) return { text: "text-amber-500", bg: "bg-amber-500", stroke: "stroke-amber-500", lightBg: "bg-amber-50" };
    return { text: "text-rose-500", bg: "bg-rose-500", stroke: "stroke-rose-500", lightBg: "bg-rose-50" };
  };

  // Alt metrikler için API'den ikon gelmeyeceği için sıraya göre otomatik ikon atıyoruz
  const getSubScoreIcon = (index: number) => {
    if (index === 0) return <LayoutTemplate className="w-4 h-4" />;
    if (index === 1) return <Zap className="w-4 h-4" />;
    return <Target className="w-4 h-4" />;
  };

  const mainColors = getScoreColor(data.score);
  const jobMatchColors = getScoreColor(data.jobMatchScore);

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Üst Kısım: Hero Skorbord */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Ana Skor Kartı */}
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
          <h2 className="text-xl font-bold text-gray-800 mb-6 z-10">Genel ATS Skoru</h2>
          
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" strokeLinecap="round"
                strokeDasharray="251.2" 
                strokeDashoffset={animate ? 251.2 - (251.2 * data.score) / 100 : 251.2}
                className={`${mainColors.stroke} transition-all duration-1500 ease-out`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-black ${mainColors.text} tracking-tighter`}>{data.score}</span>
              <span className="text-xs text-gray-400 font-medium mt-1">/ 100</span>
            </div>
          </div>
          <div className={`mt-6 px-4 py-1.5 rounded-full text-sm font-semibold ${mainColors.lightBg} ${mainColors.text}`}>
            {data.score >= 80 ? 'Harika' : data.score >= 50 ? 'Geliştirilebilir' : 'Kritik Eksikler Var'}
          </div>
        </div>

        {/* Alt Metrikler ve Job Match */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Job Match Kartı */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl shadow-lg text-white flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20" />
            <div className="z-10 flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Briefcase className="w-5 h-5 text-blue-300" />
                </div>
                <h2 className="text-xl font-bold">Job Match Analizi</h2>
              </div>
              {/* Buraya AI'dan gelen özel yorumu ekledik */}
              <p className="text-slate-300 text-sm max-w-lg leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10 mt-3">
                {data.jobMatchAnalysis}
              </p>
            </div>
            
            <div className="flex-shrink-0 w-full sm:w-48 z-10">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm text-slate-300 font-medium">Uyum Skoru</span>
                <span className="text-3xl font-black text-white">%{data.jobMatchScore}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className={`${jobMatchColors.bg} h-2.5 rounded-full transition-all duration-1500 ease-out`} 
                     style={{ width: animate ? `${data.jobMatchScore}%` : '0%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">Detaylı Kırılımlar</h3>
            <div className="space-y-5">
              {data.subScores.map((sub, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span className="text-gray-400">{getSubScoreIcon(idx)}</span> {sub.label}
                    </span>
                    <span className="text-sm font-bold text-gray-900">{sub.score}/100</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${getScoreColor(sub.score).bg} h-2 rounded-full transition-all duration-1500 ease-out delay-${idx * 200}`} 
                         style={{ width: animate ? `${sub.score}%` : '0%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Önerileri */}
      <div className="relative p-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md">
        <div className="bg-white p-6 sm:p-8 rounded-[22px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900">Gemini AI Geliştirme Önerileri</h3>
              <p className="text-sm text-gray-500">CV'nizi bir üst seviyeye taşımak için yapay zeka tespitleri</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {data.suggestions.map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-5 rounded-2xl border border-indigo-100 hover:border-indigo-300 transition-colors group">
                <p className="text-sm text-gray-700 leading-relaxed font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Güçlü/Zayıf Yönler ve Checklist */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-5 flex items-center gap-2 text-gray-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Güçlü Yönler
            </h3>
            <ul className="space-y-4">
              {data.strengths.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-gray-600 text-sm items-start">
                  <span className="text-emerald-500 mt-0.5"><CheckCircle2 className="w-4 h-4" /></span> 
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-5 flex items-center gap-2 text-gray-800">
              <XCircle className="w-5 h-5 text-rose-500" /> Geliştirilmesi Gerekenler
            </h3>
            <ul className="space-y-4">
              {data.weaknesses.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-gray-600 text-sm items-start">
                  <span className="text-rose-500 mt-0.5"><XCircle className="w-4 h-4" /></span> 
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="font-bold text-xl flex items-center gap-2 text-gray-900">
              <ListTodo className="w-6 h-6 text-blue-500" /> Aksiyon Planı
            </h3>
            <p className="text-sm text-gray-500 mt-1">Bu eksikleri tamamlayarak skorunuzu artırın.</p>
          </div>
          <div className="space-y-3 flex-1">
            {checklist.map((item) => (
              <label key={item.id} 
                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border
                  ${item.isCompleted ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'}`}>
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={item.isCompleted} 
                    onChange={() => toggleChecklist(item.id)}
                    className="peer w-6 h-6 opacity-0 absolute cursor-pointer"
                  />
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                    ${item.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 peer-hover:border-blue-500'}`}>
                    {item.isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <span className={`text-sm font-medium transition-all ${item.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 pb-12 text-center">
        <button 
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 font-semibold transition-colors"
        >
          <RefreshCcw className="w-4 h-4" /> Yeni Bir CV Analiz Et
        </button>
      </div>
    </div>
  );
}
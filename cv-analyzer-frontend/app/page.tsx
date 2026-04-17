'use client';

import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ResultDashboard, { AnalysisData } from '../components/ResultDashboard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [appState, setAppState] = useState<'upload' | 'analyzing' | 'result'>('upload');
  // API'den dönen veriyi tutacağımız state
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  // FileUpload bileşeninden tetiklenecek fonksiyon. (Artık data bekliyor)
  const handleAnalyzeComplete = (data: AnalysisData) => {
    setAnalysisData(data); // Gelen veriyi kaydet
    setAppState('result'); // Sonuç ekranına geç
  };

  const resetApp = () => {
    setAnalysisData(null);
    setAppState('upload');
  };

  return (
    <main className="min-h-screen bg-[#fafafa] text-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          CV Analyzer <span className="text-blue-600">&</span> Improvement Assistant
        </h1>
        <p className="text-lg text-gray-600">
          CV'nizi yükleyin, AI motorumuzla anında değerlendirin.
        </p>
      </div>

      {appState === 'upload' && (
        <FileUpload onAnalyze={handleAnalyzeComplete} />
      )}

      {/* Eğer FileUpload kendi içinde "yükleniyor" durumunu gösteriyorsa 
          buradaki ekstra analyzing ekranına gerek kalmayabilir. 
          Ama akışı bozmamak adına şimdilik bırakıyoruz. */}

      {appState === 'result' && analysisData && (
        <ResultDashboard data={analysisData} onReset={resetApp} />
      )}
    </main>
  );
}
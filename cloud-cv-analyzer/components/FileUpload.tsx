'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, CheckCircle, Loader2 } from 'lucide-react';

export default function FileUpload({ onAnalyze }: { onAnalyze?: (data: any) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const handleStartAnalysis = async () => {
    if (!file || !onAnalyze) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    if (jobDescription) {
      formData.append("job_description", jobDescription);
    }

    try {
      // Doğrudan FastAPI sunucumuza istek atıyoruz
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        // Backend'den gelen veriyi page.tsx'e aktarıyoruz
        onAnalyze(result.data);
      } else {
        alert("Analiz sırasında bir hata oluştu: " + result.error);
      }
    } catch (error) {
      console.error("Bağlantı hatası:", error);
      alert("Backend sunucusuna ulaşılamıyor. FastAPI'nin açık olduğundan emin olun.");
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-white shadow-sm'}`}
      >
        <input {...getInputProps()} disabled={isUploading} />
        
        {isUploading ? (
          <div className="flex flex-col items-center text-blue-600">
            <Loader2 className="w-12 h-12 mb-3 animate-spin" />
            <p className="font-semibold text-lg">Değerlendirmeler yükleniyor...</p>
          </div>
        ) : file ? (
          <div className="flex flex-col items-center text-emerald-600">
            <CheckCircle className="w-12 h-12 mb-3" />
            <p className="font-semibold text-lg">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1"> Özgeçmişiniz Analize hazırlanıyor.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <UploadCloud className="w-12 h-12 mb-3 text-gray-400" />
            <p className="font-semibold text-lg text-gray-700">CV'nizi buraya sürükleyin</p>
            <p className="text-sm text-gray-400 mt-1">veya seçmek için tıklayın (PDF, DOCX)</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Hedef İş İlanı (Opsiyonel Job Match için)</label>
        <textarea 
          className="w-full border border-gray-200 rounded-xl p-4 h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="CV'nizin uyumluluğunu test etmek istediğiniz iş ilanını buraya yapıştırın..."
          
          /* ŞİMDİ EKLEDİĞİMİZ İKİ SATIR: */
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      <button 
        disabled={!file || isUploading}
        onClick={handleStartAnalysis}
        className={`w-full mt-6 py-4 rounded-xl font-bold text-white shadow-sm transition-all
          ${(!file || isUploading) ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'}`}
      >
        Analizi Başlat
      </button>
    </div>
  );
}
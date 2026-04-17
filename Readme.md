# 🚀 Cloud CV Analyzer & Improvement Assistant

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_Llama_3-F55036?style=for-the-badge&logo=groq&logoColor=white)

## 📌 Proje Hakkında

**Cloud CV Analyzer**, adayların CV’lerini saniyeler içinde analiz eden, ATS (Aday Takip Sistemi) uyumluluğunu ölçen ve yapay zeka destekli geliştirme önerileri sunan modern bir web uygulamasıdır.

Sistem:
- PDF CV’leri analiz eder  
- ATS uyum skorunu hesaplar  
- İş ilanına göre eşleşme (job match) yapar  
- AI ile kişiselleştirilmiş geri bildirim üretir  

⚡ Tüm analizler **Groq LPU (Llama 3.3 70B)** altyapısı ile ultra hızlı şekilde gerçekleştirilir.

---

## ✨ Özellikler

- 📄 **Akıllı PDF Ayrıştırma**  
  CV dosyaları güvenli şekilde okunur ve metne dönüştürülür.

- ⚡ **Gerçek Zamanlı AI Analizi**  
  Groq API kullanılarak anlık ve yapılandırılmış (JSON) analiz yapılır.

- 📊 **ATS Skorlama Sistemi**  
  - Format  
  - Etki  
  - Sayısal veri kullanımı  
  - Anahtar kelime uyumu  

- 🎯 **Job Match (İş Uyumu Analizi)**  
  İş ilanına göre:
  - Uyum skoru  
  - Eksik yetenekler  
  - Fazla / gereksiz içerik analizi  

- ✅ **Aksiyon Planı (Checklist)**  
  CV’yi geliştirmek için yapılacaklar listesi sunulur.

---

## 🛠️ Teknoloji Yığını

### Frontend
- Next.js (App Router)
- React & TypeScript
- Tailwind CSS
- React Dropzone
- Lucide Icons

### Backend
- FastAPI (Python)
- Uvicorn
- Groq API (`llama-3.3-70b-versatile`)
- pdfplumber
- Pydantic

---

## ⚙️ Kurulum (Local Development)

### 📌 Ön Koşullar

- Node.js (v18+)
- Python (3.9+)
- Groq API Key → https://console.groq.com/

---

## 🔧 Backend Kurulumu

```bash
cd cv-analyzer-backend

python -m venv venv
Ortamı aktif et:

Mac/Linux
 source venv/bin/activate

Windows
 venv\Scripts\activate

Bağımlılıkları yükle:
pip install fastapi "uvicorn[standard]" python-multipart pdfplumber groq python-dotenv pydantic

.env oluştur:
GROQ_API_KEY=your_api_key_here

Backend’i başlat:
uvicorn main:app --reload

➡️ Backend: http://localhost:8000

 💻 Frontend Kurulumu
cd cloud-cv-analyzer

npm install
npm run dev

➡️ Frontend: http://localhost:3000


### 📂 Proje Yapısı
├── cv-analyzer-backend
│   ├── main.py
│   ├── services/
│   └── utils/
│
├── cloud-cv-analyzer
│   ├── app/
│   ├── components/
│   └── lib/

## 👨‍💻 Geliştirici

Akın Mert Ak\
https://github.com/akinmertak

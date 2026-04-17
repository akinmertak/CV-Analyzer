# 🚀 CV Analyzer & Improvement Assistant

Bu proje, adayların özgeçmişlerini (CV) saniyeler içinde analiz eden, ATS (Aday Takip Sistemi) standartlarına göre puanlayan ve yapay zeka destekli geri bildirimler sunan modern bir web uygulamasıdır. 

Sistem, yüklenen PDF dosyalarını ayrıştırır ve **Groq LPU (Llama 3.3 70B)** altyapısını kullanarak ışık hızında, kişiselleştirilmiş bir CV geliştirme raporu sunar. Ayrıca kullanıcılar, hedefledikleri bir **İş İlanı** metnini sisteme girerek CV'lerinin o ilana ne kadar uygun olduğunu (Job Match Skoru) detaylı bir analizle görebilirler.

## ✨ Özellikler

* **📄 Akıllı PDF Ayrıştırma:** CV'ler bellekte güvenli bir şekilde okunur ve metne dönüştürülür.
* **⚡ Ultra Hızlı AI Analizi:** Groq API (Llama 3.3 70B) kullanılarak bekleme süresi olmadan anlık JSON tabanlı analiz üretilir.
* **📊 Detaylı ATS Skoru:** Format, etki, sayısal veri ve anahtar kelime uyumuna göre alt metrikler hesaplanır.
* **🎯 Job Match (İş İlanı Eşleşmesi):** Girilen iş ilanına göre özel uyum skoru ve eksik/fazla yetenek analizi.
* **✅ İnteraktif Aksiyon Planı:** Adayın CV'sini geliştirmesi için yapay zeka tarafından oluşturulan "yapılacaklar" (checklist) listesi.

## 🛠️ Teknoloji Yığını (Tech Stack)

**Frontend:**
* Next.js (App Router)
* React & TypeScript
* Tailwind CSS
* Lucide React (İkonlar)
* React Dropzone (Sürükle-Bırak dosya yükleme)

**Backend:**
* FastAPI (Python)
* Uvicorn (ASGI Sunucu)
* Groq API (`llama-3.3-70b-versatile` modeli)
* `pdfplumber` (PDF metin çıkarma)

## ⚙️ Kurulum ve Çalıştırma (Local Development)

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin.

### Ön Koşullar
* Node.js (v18 veya üzeri)
* Python (3.9 veya üzeri)
* Ücretsiz bir [Groq API Key](https://console.groq.com/)

### 1. Backend (FastAPI) Kurulumu

```bash
# Backend klasörüne girin
cd cv-analyzer-backend

# Python sanal ortamını (virtual environment) oluşturun ve aktif edin
python -m venv venv
source venv/bin/activate  # Windows için: venv\Scripts\activate

# Gerekli bağımlılıkları yükleyin
pip install fastapi "uvicorn[standard]" python-multipart pdfplumber groq python-dotenv pydantic

# .env dosyası oluşturun ve Groq API anahtarınızı ekleyin
echo "GROQ_API_KEY=sizin_groq_api_anahtariniz" > .env

# Sunucuyu başlatın
uvicorn main:app --reload

Backend sunucusu http://localhost:8000 adresinde çalışmaya başlayacaktır.

2. Frontend (Next.js) Kurulumu
Bash
# Frontend klasörüne girin
cd cloud-cv-analyzer

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

Frontend sunucusu http://localhost:3000 adresinde çalışmaya başlayacaktır.


👨‍💻 Geliştirici
Akın Mert Ak

GitHub: @akinmertak

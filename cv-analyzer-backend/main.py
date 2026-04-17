import os
import io
import json
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
from groq import Groq
from dotenv import load_dotenv

# .env dosyasındaki değişkenleri yükle
load_dotenv()

# Groq İstemcisini Başlat
client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)

app = FastAPI(title="Cloud CV Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_cv(
    file: UploadFile = File(...),
    job_description: str = Form(None)
):
    try:
        # 1. PDF'i bellekte oku
        content = await file.read()
        pdf_file = io.BytesIO(content)
        
        extracted_text = ""
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                extracted_text += page.extract_text() + "\n"

        print(f"Metin başarıyla çıkarıldı. Uzunluk: {len(extracted_text)} karakter. Groq'a gönderiliyor...")

        # 2. Yapay Zeka İçin Prompt Hazırlığı
        # JSON mode kullanırken prompt içinde mutlaka "JSON" kelimesi geçmelidir.
        # 2. Yapay Zeka İçin Prompt Hazırlığı
        prompt = f"""
        Aşağıdaki CV metnini detaylıca analiz et.
        
        Görevlerin:
        1. CV'yi "Format ve Okunabilirlik", "Etki ve Sayısal Veri", "Anahtar Kelime Uyumu" kriterlerine göre 100 üzerinden puanla.
        2. CV'nin güçlü ve zayıf yönlerini bul (Her biri için en az 3 madde).
        3. Adayın CV'sini geliştirmesi için uygulanabilir, profesyonel öneriler sun.
        4. Adayın hemen yapması gereken aksiyonları bir "checklist" olarak hazırla.
        5. İŞ İLANI EŞLEŞMESİ: Eğer aşağıda bir iş ilanı verilmişse, CV ile ilanı karşılaştır. CV'nin ilana ne kadar uyduğunu "jobMatchScore" olarak (0-100 arası) hesapla. Ayrıca "jobMatchAnalysis" alanına, hangi yeteneklerin uyuştuğunu ve nelerin eksik kaldığını anlatan 2-3 cümlelik detaylı bir analiz yaz. Eğer ilan girilmemişse skoru 0 yap ve yoruma "İş ilanı metni girilmediği için eşleşme analizi yapılamadı." yaz.

        LÜTFEN YALNIZCA AŞAĞIDAKİ JSON FORMATINDA YANIT VER:
        {{
            "score": 85,
            "jobMatchScore": 60,
            "jobMatchAnalysis": "İlanda istenen React ve Node.js deneyimi CV'nizde net bir şekilde görülüyor, ancak AWS ve bulut mimarisi tecrübesi eksik olduğu için puan kırıldı.",
            "subScores": [
                {{ "label": "Format ve Okunabilirlik", "score": 90 }},
                {{ "label": "Etki ve Sayısal Veri", "score": 70 }},
                {{ "label": "Anahtar Kelime (ATS) Uyumu", "score": 85 }}
            ],
            "strengths": ["Eğitim bilgileri net.", "Teknolojiler iyi kategorize edilmiş."],
            "weaknesses": ["Sayısal başarı metrikleri eksik."],
            "suggestions": ["Projelere GitHub linki ekleyin."],
            "checklist": [
                {{ "id": 1, "text": "Özet bölümünü genişlet", "isCompleted": false }},
                {{ "id": 2, "text": "Sayısal veriler ekle", "isCompleted": false }}
            ]
        }}

        CV Metni:
        {extracted_text}

        İş İlanı (Opsiyonel):
        {job_description or "Belirtilmedi"}
        """

        # 3. Groq'a İstek At (Llama 3 70B modelini kullanıyoruz, çok zekidir)
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "Sen kıdemli bir İK uzmanısın. Yalnızca geçerli bir JSON objesi döndür."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
            temperature=0.2, # Daha stabil ve tutarlı JSON üretmesi için düşük tutuyoruz
        )
        
        # 4. Gelen yanıtı Python objesine çevir
        response_content = chat_completion.choices[0].message.content
        analysis_result = json.loads(response_content)
        print("Groq analizi ışık hızında tamamladı!")

        return {
            "success": True,
            "message": "CV başarıyla analiz edildi.",
            "data": analysis_result
        }

    except Exception as e:
        print("Hata detayı:", str(e))
        return {"success": False, "error": str(e)}
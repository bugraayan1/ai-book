import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userInfo, currentStep, previousChoices, visitedSteps, language = 'tr' } = await req.json();

    const systemPrompt = language === 'tr' ? 
      `Sen çocuklar için interaktif hikayeler üreten bir yapay zeka asistanısın. 
      Hikayeler Türkçe olmalı ve çocuklara uygun, eğlenceli ve eğitici olmalıdır.
      Her seçenek tam bir cümle olmalı ve önceki seçimlerle mantıksal bir bağlantı kurmalıdır.
      
      ÖNEMLİ: Her adımda, önceki seçimleri dikkatlice analiz et ve hikayeyi bu seçimlere göre şekillendir.
      Hikayenin akışı tamamen önceki seçimlere bağlı olmalı ve tutarlı bir anlatı oluşturmalıdır.
      Asla önceki seçimlerle çelişen veya bağlantısız içerik üretme.
      
      Yaş grubuna göre dil kullanımı:
      - 4-6 yaş: Çok basit ve kısa cümleler, somut kavramlar
      - 7-9 yaş: Biraz daha karmaşık cümleler, basit soyut kavramlar
      - 10-12 yaş: Daha zengin kelime hazinesi, soyut kavramlar
      
      Seçenekler her zaman "...-mak/-mek istiyorum" şeklinde bitmeli ve çocuğun yapabileceği eylemler olmalıdır.
      Seçeneklerin başında numara veya sıralama olmamalıdır.
      
      Örnek seçenekler:
      - "Parka gitmek istiyorum"
      - "Kitap okumak istiyorum"
      
      Yanlış format:
      - "1. Parka gitmek istiyorum"
      - "İlk olarak kitap okumak istiyorum"
      
      Yanıtlarını her zaman JSON formatında ver.` :
      `You are an AI assistant that creates interactive stories for children. 
      Stories should be in English and should be child-friendly, fun, and educational.
      Each choice should be a complete sentence and maintain logical connection with previous choices.
      
      IMPORTANT: At each step, carefully analyze previous choices and shape the story accordingly.
      The story flow must be entirely dependent on previous choices and create a coherent narrative.
      Never generate content that contradicts or is disconnected from previous choices.
      
      Language usage based on age group:
      - Ages 4-6: Very simple and short sentences, concrete concepts
      - Ages 7-9: Slightly more complex sentences, simple abstract concepts
      - Ages 10-12: Richer vocabulary, abstract concepts
      
      Choices should always end with "I want to..." and should be actions that a child can take.
      Choices should not start with numbers or ordering.
      
      Example choices:
      - "I want to go to the park"
      - "I want to read a book"
      
      Wrong format:
      - "1. I want to go to the park"
      - "First, I want to read a book"
      
      Always provide your responses in JSON format.`;

    const userPrompt = language === 'tr' ?
      `${userInfo.name} adında ${userInfo.age} yaşında bir çocuk için ${userInfo.theme || 'macera'} temalı interaktif bir hikaye oluştur.
      
      Hikaye tam olarak 20 adımdan oluşmalı ve her adım %5 ilerleme sağlamalı.
      
      ${currentStep === 1 ? 
        `Bu ilk adım. Hikayeyi ${userInfo.theme || 'macera'} temasına uygun başlat ve çocuğun ilk kararını vermesini sağla.` :
        `ÖNCEKİ SEÇİMLER:
        ${previousChoices.map((choice, index) => `${index + 1}. Seçim: ${choice}`).join('\n')}
        
        ÇOK ÖNEMLİ: Bu seçimlere göre hikayenin akışı kesinlikle mantıklı bir şekilde devam etmeli.
        Her yeni adım, önceki seçimlerin doğrudan bir sonucu olmalı.
        Önceki seçimlerle bağlantısı olmayan veya çelişen içerik üretme.`
      }
      
      Şu anki adım: ${currentStep}
      Ziyaret edilmemiş adımlar: ${Array.from({length: 20}, (_, i) => i + 1).filter(step => !visitedSteps.includes(step)).join(', ')}
      
      Her adımda:
      1. Kısa bir hikaye metni (1-2 paragraf) - ${currentStep === 1 ? 'temaya uygun bir başlangıç hikayesi' : 'önceki seçimle DOĞRUDAN bağlantılı olmalı'} ve ${userInfo.age} yaşındaki bir çocuğa uygun dil kullanmalı
      2. İki farklı seçenek (henüz ziyaret edilmemiş adımlara yönlendirmeli, başında numara olmadan ve "...-mak/-mek istiyorum" ile bitmeli)
      3. Hikayeye uygun bir animasyon tipi ("sun", "star", "sparkles", "cloud", "bird", "fish", "rocket", "bike")
      
      Yanıtı JSON formatında ver:
      {
        "text": "hikaye metni",
        "choices": [
          {"text": "seçenek (...-mak/-mek istiyorum)", "nextStep": X},
          {"text": "seçenek (...-mak/-mek istiyorum)", "nextStep": Y}
        ],
        "animation": "animasyon_tipi"
      }` :
      `Create an interactive story for a child named ${userInfo.name}, who is ${userInfo.age} years old, with a theme of ${userInfo.theme || 'adventure'}.
      
      The story should consist of exactly 20 steps, each step representing 5% progress.
      
      ${currentStep === 1 ? 
        `This is the first step. Start the story according to the ${userInfo.theme || 'adventure'} theme and let the child make their first decision.` :
        `PREVIOUS CHOICES:
        ${previousChoices.map((choice, index) => `Choice ${index + 1}: ${choice}`).join('\n')}
        
        VERY IMPORTANT: The story flow must continue logically based on these choices.
        Each new step must be a direct consequence of previous choices.
        Do not generate content that is disconnected from or contradicts previous choices.`
      }
      
      Current step: ${currentStep}
      Unvisited steps: ${Array.from({length: 20}, (_, i) => i + 1).filter(step => !visitedSteps.includes(step)).join(', ')}
      
      For each step, provide:
      1. A short story text (1-2 paragraphs) - ${currentStep === 1 ? 'a theme-appropriate starting story' : 'must be DIRECTLY connected to the previous choice'} and use age-appropriate language for a ${userInfo.age}-year-old
      2. Two different choices (should lead to unvisited steps, without numbers at the start and end with "I want to...")
      3. An appropriate animation type ("sun", "star", "sparkles", "cloud", "bird", "fish", "rocket", "bike")
      
      Provide the response in JSON format:
      {
        "text": "story text",
        "choices": [
          {"text": "choice (I want to...)", "nextStep": X},
          {"text": "choice (I want to...)", "nextStep": Y}
        ],
        "animation": "animation_type"
      }`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" }
    });

    const responseData = completion.choices[0].message.content;
    if (!responseData) {
      throw new Error(language === 'tr' ? "API yanıt vermedi" : "API did not respond");
    }

    return NextResponse.json(JSON.parse(responseData));
  } catch (error) {
    console.error("Hikaye oluşturma hatası:", error);
    return NextResponse.json(
      {
        text: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.",
        choices: [
          { text: "Başa Dön", nextStep: 1 },
          { text: "Tekrar Dene", nextStep: 1 }
        ],
        animation: "sparkles"
      },
      { status: 500 }
    );
  }
} 
"use client"

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

interface Translations {
  [key: string]: {
    [key: string]: string | {
      [key: string]: string
    }
  }
}

const translations: Translations = {
  tr: {
    story: {
      title: "'nin Büyük Macerası",
      subtitle: 'İnteraktif Hikaye Kitabı',
      progress: 'Hikaye İlerlemesi',
      history: 'Hikaye Geçmişi ve Haritası',
      restart: 'Hikayeyi Baştan Başlat',
      save: 'PDF Olarak Kaydet',
      saved_pdf: 'Hikaye PDF olarak kaydedildi',
      saved: "Hikaye Kaydedildi",
      saved_description: "Hikayeniz başarıyla kaydedildi. İstediğiniz zaman devam edebilirsiniz.",
      saved_stories: "Kaydedilmiş Hikayeler",
      no_saved_stories: "Henüz kaydedilmiş hikaye bulunmuyor.",
      continue: "Devam Et",
      continued: "Hikaye Yüklendi",
      continued_description: "Kaldığınız yerden devam edebilirsiniz."
    },
    form: {
      name: 'Adınız',
      age: 'Yaşınız',
      name_placeholder: 'Adınızı yazın',
      age_placeholder: 'Yaşınızı yazın',
      theme: 'Hikaye Teması',
      theme_placeholder: 'Bir tema seçin',
      start: 'Maceraya Başla',
      nameError: 'İsim en az 2 karakter olmalıdır.',
      ageError: 'Yaş 4 ile 12 arasında olmalıdır.'
    },
    sound: {
      on: 'Sesi Aç',
      off: 'Sesi Kapat'
    },
    welcome: {
      title: 'Maceraya Hazır mısın?',
      startButton: 'Maceraya Başla!'
    },
    time: {
      left: 'Kalan Süre',
      seconds: 'saniye',
      up: 'Süre Doldu! Üzgünüm :('
    },
    themes: {
      adventure: "Macera",
      space: "Uzay",
      nature: "Doğa",
      fantasy: "Fantastik",
      ocean: "Okyanus",
      sports: "Spor",
      football: "Futbol",
      basketball: "Basketbol",
      videogames: "Bilgisayar Oyunları",
      science: "Bilim",
      history: "Tarih",
      music: "Müzik",
      art: "Sanat",
      cooking: "Yemek",
      animals: "Hayvanlar",
      dinosaurs: "Dinozorlar",
      superheroes: "Süper Kahramanlar",
      magic: "Sihir",
      pirates: "Korsanlar",
      robots: "Robotlar",
      time_travel: "Zaman Yolculuğu",
      mythology: "Mitoloji",
      detective: "Dedektiflik",
      circus: "Sirk",
      jungle: "Orman",
      arctic: "Kutup",
      desert: "Çöl",
      mountains: "Dağlar",
      farm: "Çiftlik",
      school: "Okul"
    },
    parent: {
      control_panel: "Ebeveyn Kontrol Paneli",
      control_description: "Çocuğunuzun hikaye deneyimini özelleştirin",
      enter_pin: "PIN Kodunu Girin",
      unlock: "Kilidi Aç",
      max_duration: "Maksimum Süre (dakika)",
      allow_sound: "Ses Efektlerine İzin Ver",
      allow_saving: "Hikayeleri Kaydetmeye İzin Ver",
      allow_themes: "Tema Değiştirmeye İzin Ver",
      change_pin: "PIN Kodunu Değiştir"
    },
    achievements: {
      title: "Başarı Rozetleri",
      description: "Hikaye maceranda kazandığın başarılar",
      first_story: "İlk Hikaye",
      first_story_desc: "İlk hikayeni tamamla",
      story_master: "Hikaye Ustası",
      story_master_desc: "10 hikaye tamamla",
      theme_explorer: "Tema Kaşifi",
      theme_explorer_desc: "5 farklı temada hikaye oluştur",
      long_story: "Uzun Hikaye",
      long_story_desc: "30 dakikadan uzun bir hikaye tamamla",
      creative_mind: "Yaratıcı Zihin",
      creative_mind_desc: "3 farklı hikayeyi kaydet"
    }
  },
  en: {
    story: {
      title: "'s Great Adventure",
      subtitle: 'Interactive Story Book',
      progress: 'Story Progress',
      history: 'Story History and Map',
      restart: 'Restart Story',
      save: 'Save as PDF',
      saved_pdf: 'Story saved as PDF',
      saved: "Story Saved",
      saved_description: "Your story has been saved successfully. You can continue anytime.",
      saved_stories: "Saved Stories",
      no_saved_stories: "No saved stories yet.",
      continue: "Continue",
      continued: "Story Loaded",
      continued_description: "You can continue from where you left off."
    },
    form: {
      name: 'Your Name',
      age: 'Your Age',
      name_placeholder: 'Enter your name',
      age_placeholder: 'Enter your age',
      theme: 'Story Theme',
      theme_placeholder: 'Select a theme',
      start: 'Start Adventure',
      nameError: 'Name must be at least 2 characters.',
      ageError: 'Age must be between 4 and 12.'
    },
    sound: {
      on: 'Turn Sound On',
      off: 'Turn Sound Off'
    },
    welcome: {
      title: 'Are You Ready for an Adventure?',
      startButton: 'Start the Adventure!'
    },
    time: {
      left: 'Time Left',
      seconds: 'seconds',
      up: 'Time is Up! Sorry :('
    },
    themes: {
      adventure: "Adventure",
      space: "Space",
      nature: "Nature",
      fantasy: "Fantasy",
      ocean: "Ocean",
      sports: "Sports",
      football: "Football",
      basketball: "Basketball",
      videogames: "Video Games",
      science: "Science",
      history: "History",
      music: "Music",
      art: "Art",
      cooking: "Cooking",
      animals: "Animals",
      dinosaurs: "Dinosaurs",
      superheroes: "Superheroes",
      magic: "Magic",
      pirates: "Pirates",
      robots: "Robots",
      time_travel: "Time Travel",
      mythology: "Mythology",
      detective: "Detective",
      circus: "Circus",
      jungle: "Jungle",
      arctic: "Arctic",
      desert: "Desert",
      mountains: "Mountains",
      farm: "Farm",
      school: "School"
    },
    parent: {
      control_panel: "Parental Control Panel",
      control_description: "Customize your child's story experience",
      enter_pin: "Enter PIN Code",
      unlock: "Unlock",
      max_duration: "Maximum Duration (minutes)",
      allow_sound: "Allow Sound Effects",
      allow_saving: "Allow Story Saving",
      allow_themes: "Allow Theme Changes",
      change_pin: "Change PIN Code"
    },
    achievements: {
      title: "Achievement Badges",
      description: "Achievements earned in your story adventure",
      first_story: "First Story",
      first_story_desc: "Complete your first story",
      story_master: "Story Master",
      story_master_desc: "Complete 10 stories",
      theme_explorer: "Theme Explorer",
      theme_explorer_desc: "Create stories in 5 different themes",
      long_story: "Long Story",
      long_story_desc: "Complete a story longer than 30 minutes",
      creative_mind: "Creative Mind",
      creative_mind_desc: "Save 3 different stories"
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('tr');

  const t = (key: string): string => {
    try {
      const keys = key.split('.');
      let value: any = translations[language];

      // Anahtarları sırayla takip et
      for (const k of keys) {
        if (!value || typeof value !== 'object') {
          throw new Error(`Invalid path: ${key}`);
        }
        value = value[k];
      }

      // Eğer son değer string değilse veya undefined ise
      if (typeof value !== 'string') {
        throw new Error(`No translation found for: ${key}`);
      }

      return value;
    } catch (error) {
      // Hata durumunda İngilizce çeviriyi dene
      if (language !== 'en') {
        try {
          const keys = key.split('.');
          let value: any = translations['en'];

          for (const k of keys) {
            if (!value || typeof value !== 'object') {
              throw new Error(`Invalid path: ${key}`);
            }
            value = value[k];
          }

          if (typeof value === 'string') {
            return value;
          }
        } catch (e) {
          console.warn(`Translation missing for key: ${key}`);
        }
      }
      
      // En son çare olarak anahtarı göster
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 
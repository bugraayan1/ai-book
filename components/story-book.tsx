"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Star, Sun, Cloud, Bird, Fish, Rocket, Bike, ChevronDown, Loader2, Frown, MinusCircle, RefreshCw, Save, BookOpen, Download, Shield, Medal } from "lucide-react"
import { StoryForm } from "./story-form"
import { generateStoryStep, UserInfo, StoryStep } from "@/lib/story-generator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useLanguage } from "@/lib/language-context"
import { useToast } from "@/components/ui/use-toast"
import { jsPDF } from 'jspdf';

// Basit animasyon türleri
const animations = {
  sun: () => <Sun className="text-yellow-500 animate-pulse" size={64} />,
  star: () => <Star className="text-yellow-500 animate-pulse" size={64} />,
  sparkles: () => <Sparkles className="text-yellow-500 animate-pulse" size={64} />,
  cloud: () => <Cloud className="text-gray-500 animate-bounce" size={64} />,
  bird: () => <Bird className="text-blue-500 animate-bounce" size={64} />,
  fish: () => <Fish className="text-blue-500 animate-bounce" size={64} />,
  rocket: () => <Rocket className="text-purple-500 animate-pulse" size={64} />,
  bike: () => <Bike className="text-green-500 animate-bounce" size={64} />,
} as const;

type AnimationType = keyof typeof animations;

interface StoryBookProps {
  userInfo: UserInfo
}

interface SavedStory {
  currentStep: StoryStep;
  visitedSteps: number[];
  progress: number;
}

export function StoryBook({ userInfo }: StoryBookProps) {
  const { t, language } = useLanguage()
  const [currentStep, setCurrentStep] = useState<StoryStep | null>(null)
  const [loading, setLoading] = useState(true)
  const [visitedSteps, setVisitedSteps] = useState<StoryStep[]>([])
  const [previousChoices, setPreviousChoices] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(45)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [showTimeUpMessage, setShowTimeUpMessage] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showAnimation, setShowAnimation] = useState(false)
  const [currentStepData, setCurrentStepData] = useState<{
    text: string;
    choices: Array<{ text: string; nextStep: number }>;
    animation: AnimationType;
  } | null>(null)
  const { toast } = useToast()

  // Yeni state'ler
  const [savedStories, setSavedStories] = useState<Record<string, SavedStory>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savedStories")
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })

  // Hikayeyi kaydet
  const handleSaveStory = () => {
    if (!currentStep) return;
    
    // Hikayeyi localStorage'a kaydet
    setSavedStories(prev => ({
      ...prev,
      [userInfo?.name || 'default']: {
        currentStep,
        visitedSteps: visitedSteps.map(step => step.nextStep || 0),
        progress: (visitedSteps.length / 10) * 100
      }
    }));

    // PDF olarak kaydet
    if (!userInfo?.name) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      compress: true
    });

    // Türkçe karakter desteği için font ayarları
    doc.setFont("helvetica", "normal");
    doc.setLanguage("tr");

    const title = `${userInfo.name}${t('story.title')}`;
    const content = visitedSteps
      .filter((step): step is StoryStep => step !== undefined)
      .map((step, index) => `${index + 1}. ${step.text}`)
      .join('\n\n');

    // Başlık için ayarlar
    doc.setFontSize(18);
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getStringUnitWidth(title) * doc.getFontSize() / doc.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 20);

    // İçerik için ayarlar
    doc.setFontSize(12);
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    
    // İçeriği sayfalara böl
    const lines = doc.setFont("helvetica")
                    .setFontSize(12)
                    .splitTextToSize(content, maxWidth);
    
    let y = 40;
    const lineHeight = 7;
    
    lines.forEach((line: string) => {
      if (y > 270) { // Sayfa sonuna yaklaşıldığında
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });

    const date = new Date().toLocaleDateString('tr-TR');
    doc.save(`${userInfo.name}_hikaye_${date}.pdf`);

    toast({
      title: t('story.saved'),
      description: t('story.saved_description'),
      duration: 2000
    });
  };

  // Kaydedilmiş hikayeleri göster
  const [showSavedStories, setShowSavedStories] = useState(false)

  // Kaydedilmiş hikayeye devam et
  const handleLoadStory = (savedStory: SavedStory) => {
    setCurrentStep(savedStory.currentStep);
    setVisitedSteps(savedStory.visitedSteps.map(stepNumber => ({
      text: '',
      choices: [],
      nextStep: stepNumber,
      animation: 'sparkles' as AnimationType
    })));
    setProgress(savedStory.progress);
    setShowSavedStories(false);
    toast({
      title: t('story.continued'),
      description: t('story.continued_description'),
      duration: 2000
    });
  };

  // Arka plan müziğini başlat
  useEffect(() => {
    if (userInfo) {
      // Ses kaldırıldı
    }
  }, [userInfo]);

  // Hikaye ilerlemesini hesapla - 20 bölümlük hikaye için
  useEffect(() => {
    const newProgress = Math.min(visitedSteps.length * 5, 100);
    setProgress(newProgress);
  }, [visitedSteps.length]);

  // İlk hikaye adımını yükle
  useEffect(() => {
    const loadInitialStep = async () => {
      try {
        const initialStep = await generateStoryStep(userInfo, 1, [], [], language)
        setCurrentStep(initialStep)
        setTimeLeft(45)
        setIsTimerActive(true)
        setShowTimeUpMessage(false)
      } catch (error) {
        console.error("İlk hikaye adımı yüklenirken hata:", error)
      } finally {
        setLoading(false)
      }
    }
    loadInitialStep()
  }, [userInfo, language])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isTimerActive) {
      setShowTimeUpMessage(true)
      setIsTimerActive(false)
    }
    return () => clearInterval(timer)
  }, [timeLeft, isTimerActive])

  const handleChoice = async (nextStep: number) => {
    setLoading(true);
    try {
      const newStep = await generateStoryStep(userInfo, nextStep, previousChoices, visitedSteps.map(step => step.nextStep), language);
      setCurrentStep(newStep);
      setVisitedSteps([...visitedSteps, newStep]);
      setPreviousChoices([...previousChoices, newStep.text]);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const restartStory = async () => {
    setLoading(true)
    setCurrentStep(null)
    setPreviousChoices([])
    setVisitedSteps([])
    setTimeLeft(45)
    setIsTimerActive(true)
    setShowTimeUpMessage(false)

    try {
      const newStep = await generateStoryStep(userInfo, 1, [], [], language)
      setCurrentStep(newStep)
    } catch (error) {
      console.error("Hikaye başlatılırken hata:", error)
    } finally {
      setLoading(false)
    }
  }

  const AnimationComponent = currentStep && animations[currentStep.animation];

  const timeProgress = (timeLeft / 45) * 100

  const [showParentControls, setShowParentControls] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [isParentControlsLocked, setIsParentControlsLocked] = useState(() => {
    if (typeof window !== "undefined") {
      const unlocked = localStorage.getItem("parentControlsUnlocked")
      return unlocked !== "true"
    }
    return true
  })
  const [pinInput, setPinInput] = useState("")
  const [pinError, setPinError] = useState(false)
  const CORRECT_PIN = "1967"

  const handlePinSubmit = () => {
    if (pinInput === CORRECT_PIN) {
      setIsParentControlsLocked(false)
      setPinError(false)
      setPinInput("")
      localStorage.setItem("parentControlsUnlocked", "true")
    } else {
      setPinError(true)
      setPinInput("")
    }
  }

  const handleLockParentControls = () => {
    setIsParentControlsLocked(true)
    localStorage.removeItem("parentControlsUnlocked")
  }

  const handleParentControlsClick = () => {
    if (isParentControlsLocked) {
      setShowParentControls(true)
    } else {
      setShowParentControls(!showParentControls)
    }
  }

  if (loading || !currentStep) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <Card className="w-full max-w-3xl p-6 bg-white shadow-xl rounded-xl">
      <div className="text-center mb-8 relative">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveStory}
              aria-label="Hikayeyi Kaydet"
            >
              <Save className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={restartStory}
              aria-label="Hikayeyi Yeniden Başlat"
            >
              <RefreshCw className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSavedStories(!showSavedStories)}
              aria-label={t("story.saved_stories")}
            >
              <BookOpen className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleParentControlsClick}
              aria-label={t("parent.control_panel")}
            >
              <Shield className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowAchievements(!showAchievements)}
              aria-label={t("achievements.title")}
            >
              <Medal className="w-4 h-4" />
            </Button>
          </div>
          <center><h3 className="text-3xl font-bold text-purple-600 mb-2">{userInfo.name}'nin Büyük Macerası</h3></center>
        </div>
      </div>

      {showParentControls && (
        <Card className="p-4 mb-4">
          <h3 className="text-lg font-bold mb-2">{t("parent.control_panel")}</h3>
          <p className="text-sm text-gray-600 mb-4">{t("parent.control_description")}</p>
          
          {isParentControlsLocked ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">{t("parent.enter_pin")}</p>
              <div className="flex gap-2">
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="****"
                />
                <Button onClick={handlePinSubmit} variant="outline">
                  {t("parent.unlock")}
                </Button>
              </div>
              {pinError && (
                <p className="text-sm text-red-500">PIN kodu yanlış!</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>{t("parent.max_duration")}</span>
                <input
                  type="number"
                  min="1"
                  max="60"
                  className="w-20 p-2 border rounded"
                  defaultValue="45"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>{t("parent.allow_saving")}</span>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <span>{t("parent.allow_themes")}</span>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={handleLockParentControls}
              >
                {t("parent.change_pin")}
              </Button>
            </div>
          )}
        </Card>
      )}

      {showAchievements && (
        <Card className="p-4 mb-4">
          <h3 className="text-lg font-bold mb-2">{t("achievements.title")}</h3>
          <p className="text-sm text-gray-600 mb-4">{t("achievements.description")}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <h4 className="font-semibold">{t("achievements.first_story")}</h4>
              </div>
              <p className="text-sm text-gray-600">{t("achievements.first_story_desc")}</p>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <Medal className="w-5 h-5 text-yellow-500" />
                <h4 className="font-semibold">{t("achievements.story_master")}</h4>
              </div>
              <p className="text-sm text-gray-600">{t("achievements.story_master_desc")}</p>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h4 className="font-semibold">{t("achievements.theme_explorer")}</h4>
              </div>
              <p className="text-sm text-gray-600">{t("achievements.theme_explorer_desc")}</p>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold">{t("achievements.creative_mind")}</h4>
              </div>
              <p className="text-sm text-gray-600">{t("achievements.creative_mind_desc")}</p>
            </div>
          </div>
        </Card>
      )}

      {showSavedStories && (
        <Card className="p-4 mb-4">
          <h3 className="text-lg font-bold mb-2">{t("story.saved_stories")}</h3>
          {Object.entries(savedStories).length === 0 ? (
            <p>{t("story.no_saved_stories")}</p>
          ) : (
            <ScrollArea className="h-48">
              {Object.entries(savedStories).map(([key, story]) => (
                <div key={key} className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                  <span>{new Date(parseInt(key.split('_')[1])).toLocaleString()}</span>
          <Button
                    variant="ghost"
                    onClick={() => handleLoadStory(story)}
          >
                    {t("story.continue")}
          </Button>
                </div>
              ))}
            </ScrollArea>
          )}
        </Card>
      )}

      {/* İlerleme Çubuğu */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{t('story.progress')}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Zaman Çubuğu */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            {t('timeLeft')}: {timeLeft} {t('seconds')}
          </span>
          {showTimeUpMessage && (
            <div className="flex items-center gap-2 text-red-500">
              <MinusCircle className="animate-bounce" />
              <span>{t('timeUp')}</span>
            </div>
          )}
        </div>
        <Progress value={timeProgress} className="h-2" 
          style={{
            background: timeLeft < 10 ? '#fee2e2' : '#f3f4f6',
            '--progress-value': `${timeProgress}%`
          } as any}
        />
      </div>

      {/* Hikaye Geçmişi ve Haritası */}
      <Accordion type="single" collapsible className="mb-6">
        <AccordionItem value="history">
          <AccordionTrigger className="text-purple-600">
            {t('story.history')}
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="space-y-4">
                {previousChoices.map((choice, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">{choice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {currentStep && (
        <div>
          <div className="mb-8">
            <p className="text-lg text-gray-800 mb-6">{currentStep.text}</p>

            <AnimatePresence>
              {showAnimation && AnimationComponent && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex justify-center items-center h-40 mb-6"
                >
                  <AnimationComponent />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentStep.choices.map((choice, index) => (
              <Button
                key={index}
                onClick={() => handleChoice(choice.nextStep)}
                className={`p-6 h-auto min-h-[80px] text-base font-medium whitespace-normal ${
                  index === 0
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {choice.text}
              </Button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}


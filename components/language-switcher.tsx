"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
      className="fixed top-4 right-4 z-50"
    >
      {language === 'tr' ? 'English' : 'Türkçe'}
    </Button>
  )
} 
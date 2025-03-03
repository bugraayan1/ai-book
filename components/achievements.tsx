import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/lib/language-context"
import { Trophy, Star, Medal, Crown, Award } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Achievement {
  id: string
  icon: React.ReactElement
  title: string
  description: string
  isUnlocked: boolean
  progress: number
  maxProgress: number
}

const defaultAchievements: Achievement[] = [
  {
    id: "first_story",
    icon: <Trophy className="w-6 h-6 text-yellow-500" />,
    title: "first_story",
    description: "first_story_desc",
    isUnlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: "story_master",
    icon: <Star className="w-6 h-6 text-purple-500" />,
    title: "story_master",
    description: "story_master_desc",
    isUnlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: "theme_explorer",
    icon: <Medal className="w-6 h-6 text-blue-500" />,
    title: "theme_explorer",
    description: "theme_explorer_desc",
    isUnlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: "long_story",
    icon: <Crown className="w-6 h-6 text-amber-500" />,
    title: "long_story",
    description: "long_story_desc",
    isUnlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: "creative_mind",
    icon: <Award className="w-6 h-6 text-green-500" />,
    title: "creative_mind",
    description: "creative_mind_desc",
    isUnlocked: false,
    progress: 0,
    maxProgress: 3
  }
]

export function Achievements() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("achievements")
      return saved ? JSON.parse(saved) : defaultAchievements
    }
    return defaultAchievements
  })

  useEffect(() => {
    localStorage.setItem("achievements", JSON.stringify(achievements))
  }, [achievements])

  const updateAchievement = (id: string, progress: number) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.id === id) {
        const newProgress = Math.min(achievement.maxProgress, achievement.progress + progress)
        return {
          ...achievement,
          progress: newProgress,
          isUnlocked: newProgress >= achievement.maxProgress
        }
      }
      return achievement
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Trophy className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("achievements.title")}</DialogTitle>
          <DialogDescription>{t("achievements.description")}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`p-4 ${achievement.isUnlocked ? 'bg-accent' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{t(`achievements.${achievement.title}`)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t(`achievements.${achievement.description}`)}
                    </p>
                    <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: `${(achievement.progress / achievement.maxProgress) * 100}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {achievement.progress} / {achievement.maxProgress}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 
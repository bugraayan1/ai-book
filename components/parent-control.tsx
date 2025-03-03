import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/lib/language-context"
import { Lock, Settings } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ParentControlSettings {
  maxDuration: number
  allowSoundEffects: boolean
  allowSaving: boolean
  allowThemeChange: boolean
  parentalPin: string
}

const defaultSettings: ParentControlSettings = {
  maxDuration: 30,
  allowSoundEffects: true,
  allowSaving: true,
  allowThemeChange: true,
  parentalPin: "0000"
}

export function ParentControl() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [pin, setPin] = useState("")
  const [settings, setSettings] = useState<ParentControlSettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("parentalSettings")
      return saved ? JSON.parse(saved) : defaultSettings
    }
    return defaultSettings
  })
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handlePinSubmit = () => {
    if (pin === settings.parentalPin) {
      setIsAuthenticated(true)
      setPin("")
    }
  }

  const handleSettingChange = (key: keyof ParentControlSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem("parentalSettings", JSON.stringify(newSettings))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("parent.control_panel")}</DialogTitle>
          <DialogDescription>{t("parent.control_description")}</DialogDescription>
        </DialogHeader>

        {!isAuthenticated ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="text-muted-foreground" />
              <Label>{t("parent.enter_pin")}</Label>
            </div>
            <div className="flex gap-2">
              <Input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="****"
              />
              <Button onClick={handlePinSubmit}>{t("parent.unlock")}</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>{t("parent.max_duration")}</Label>
              <Input
                type="number"
                min={5}
                max={60}
                value={settings.maxDuration}
                onChange={(e) => handleSettingChange("maxDuration", parseInt(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>{t("parent.allow_sound")}</Label>
              <Switch
                checked={settings.allowSoundEffects}
                onCheckedChange={(checked) => handleSettingChange("allowSoundEffects", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>{t("parent.allow_saving")}</Label>
              <Switch
                checked={settings.allowSaving}
                onCheckedChange={(checked) => handleSettingChange("allowSaving", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>{t("parent.allow_themes")}</Label>
              <Switch
                checked={settings.allowThemeChange}
                onCheckedChange={(checked) => handleSettingChange("allowThemeChange", checked)}
              />
            </div>

            <div className="space-y-4">
              <Label>{t("parent.change_pin")}</Label>
              <Input
                type="password"
                maxLength={4}
                placeholder="****"
                onChange={(e) => handleSettingChange("parentalPin", e.target.value)}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 
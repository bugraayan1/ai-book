"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/lib/language-context"
import { motion } from "framer-motion"
import { Sparkles, Star, Sun, Cloud, Bird } from "lucide-react"

const animations = [
  <Sparkles key="sparkles" className="text-yellow-500 animate-pulse" size={32} />,
  <Star key="star" className="text-yellow-500 animate-pulse" size={32} />,
  <Sun key="sun" className="text-yellow-500 animate-pulse" size={32} />,
  <Cloud key="cloud" className="text-blue-500 animate-bounce" size={32} />,
  <Bird key="bird" className="text-blue-500 animate-bounce" size={32} />,
]

const formSchema = z.object({
  name: z.string().min(2, {
    message: "İsim en az 2 karakter olmalıdır.",
  }),
  age: z.string().refine((val) => {
    const num = parseInt(val);
    return num >= 1 && num <= 12;
  }, "Yaş 1-12 arasında olmalıdır."),
  theme: z.enum([
    "adventure", "space", "nature", "fantasy", "ocean",
    "sports", "football", "basketball", "videogames", "science",
    "history", "music", "art", "cooking", "animals",
    "dinosaurs", "superheroes", "magic", "pirates", "robots",
    "time_travel", "mythology", "detective", "circus", "jungle",
    "arctic", "desert", "mountains", "farm", "school"
  ]),
})

export function StoryForm({ onSubmit }: { onSubmit: (values: z.infer<typeof formSchema>) => void }) {
  const { t } = useLanguage()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      theme: "adventure",
    },
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto"
    >
      <Card className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200 shadow-xl rounded-xl">
        <div className="flex justify-center space-x-4 mb-6">
          {animations.map((icon, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {icon}
            </motion.div>
          ))}
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-800">
          {t('welcome.title')}
        </h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("form.name_placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.age")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("form.age_placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.theme")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("form.theme_placeholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="adventure">{t("themes.adventure")}</SelectItem>
                      <SelectItem value="space">{t("themes.space")}</SelectItem>
                      <SelectItem value="nature">{t("themes.nature")}</SelectItem>
                      <SelectItem value="fantasy">{t("themes.fantasy")}</SelectItem>
                      <SelectItem value="ocean">{t("themes.ocean")}</SelectItem>
                      <SelectItem value="sports">{t("themes.sports")}</SelectItem>
                      <SelectItem value="football">{t("themes.football")}</SelectItem>
                      <SelectItem value="basketball">{t("themes.basketball")}</SelectItem>
                      <SelectItem value="videogames">{t("themes.videogames")}</SelectItem>
                      <SelectItem value="science">{t("themes.science")}</SelectItem>
                      <SelectItem value="history">{t("themes.history")}</SelectItem>
                      <SelectItem value="music">{t("themes.music")}</SelectItem>
                      <SelectItem value="art">{t("themes.art")}</SelectItem>
                      <SelectItem value="cooking">{t("themes.cooking")}</SelectItem>
                      <SelectItem value="animals">{t("themes.animals")}</SelectItem>
                      <SelectItem value="dinosaurs">{t("themes.dinosaurs")}</SelectItem>
                      <SelectItem value="superheroes">{t("themes.superheroes")}</SelectItem>
                      <SelectItem value="magic">{t("themes.magic")}</SelectItem>
                      <SelectItem value="pirates">{t("themes.pirates")}</SelectItem>
                      <SelectItem value="robots">{t("themes.robots")}</SelectItem>
                      <SelectItem value="time_travel">{t("themes.time_travel")}</SelectItem>
                      <SelectItem value="mythology">{t("themes.mythology")}</SelectItem>
                      <SelectItem value="detective">{t("themes.detective")}</SelectItem>
                      <SelectItem value="circus">{t("themes.circus")}</SelectItem>
                      <SelectItem value="jungle">{t("themes.jungle")}</SelectItem>
                      <SelectItem value="arctic">{t("themes.arctic")}</SelectItem>
                      <SelectItem value="desert">{t("themes.desert")}</SelectItem>
                      <SelectItem value="mountains">{t("themes.mountains")}</SelectItem>
                      <SelectItem value="farm">{t("themes.farm")}</SelectItem>
                      <SelectItem value="school">{t("themes.school")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center"
            >
              <Button 
                type="submit" 
                className="w-full max-w-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 text-lg rounded-full shadow-lg transform transition-all duration-200"
              >
                {t('welcome.startButton')}
              </Button>
            </motion.div>
          </form>
        </Form>
      </Card>
    </motion.div>
  )
} 
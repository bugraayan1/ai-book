"use client"

import { useState } from "react"
import { StoryBook } from "@/components/story-book"
import { StoryForm } from "@/components/story-form"
import { ParentControl } from "@/components/parent-control"
import { Achievements } from "@/components/achievements"
import { LanguageSwitcher } from "@/components/language-switcher"
import { UserInfo } from "@/lib/story-generator"

export default function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  const handleFormSubmit = (values: { name: string; age: string; theme: string }) => {
    setUserInfo({
      name: values.name,
      age: parseInt(values.age),
      theme: values.theme
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="absolute top-4 right-4 flex flex-row gap-4">
        <LanguageSwitcher />
        <ParentControl />
        <Achievements />
      </div>
      {userInfo ? (
        <StoryBook userInfo={userInfo} />
      ) : (
        <StoryForm onSubmit={handleFormSubmit} />
      )}
    </main>
  )
}


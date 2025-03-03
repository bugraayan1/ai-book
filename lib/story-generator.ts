export interface UserInfo {
  name: string;
  age: number;
  theme?: string;
}

export type StoryStep = {
  text: string;
  choices: Array<{
    text: string;
    nextStep: number;
  }>;
  animation: "sun" | "star" | "sparkles" | "cloud" | "bird" | "fish" | "rocket" | "bike";
  nextStep?: number;
};

export async function generateStoryStep(
  userInfo: UserInfo,
  currentStep: number,
  previousChoices: string[],
  visitedSteps: number[] = [],
  language: string = 'tr'
): Promise<StoryStep> {
  try {
    const response = await fetch('/api/story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInfo,
        currentStep,
        previousChoices,
        visitedSteps,
        language,
      }),
    });

    if (!response.ok) {
      throw new Error(language === 'tr' ? 'API yanıt vermedi' : 'API did not respond');
    }

    const data = await response.json();
    return data as StoryStep;
  } catch (error) {
    console.error(language === 'tr' ? 'Hikaye adımı oluşturma hatası:' : 'Error generating story step:', error);
    return {
      text: language === 'tr' 
        ? "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin."
        : "Sorry, an error occurred. Please try again.",
      choices: [
        { 
          text: language === 'tr' ? "Başa Dön" : "Start Over", 
          nextStep: 1 
        },
        { 
          text: language === 'tr' ? "Tekrar Dene" : "Try Again", 
          nextStep: currentStep 
        }
      ],
      animation: "sparkles"
    };
  }
} 
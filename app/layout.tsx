import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/lib/language-context'
import { LanguageSwitcher } from '@/components/language-switcher'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Oguz Adventure - İnteraktif Hikaye',
  description: 'Çocuklar için özel olarak tasarlanmış interaktif hikaye deneyimi',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <LanguageSwitcher />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

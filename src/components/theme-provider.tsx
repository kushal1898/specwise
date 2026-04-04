'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: 'dark'
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

const ThemeContext = React.createContext<{
  theme: string
  setTheme: (theme: string) => void
}>({
  theme: 'dark',
  setTheme: () => {},
})

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Always force dark theme
    document.documentElement.classList.remove('light')
    document.documentElement.classList.add('dark')
  }, [])

  const setTheme = () => {
    // No-op to prevent theme changes
  }

  return (
    <ThemeContext.Provider value={{ theme: 'dark', setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}


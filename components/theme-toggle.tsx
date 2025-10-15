'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Constants
const THEME_KEY = 'app-theme-preference'
const DARK = 'dark'
const LIGHT = 'light'

export function ThemeToggle() {
  // Local state for theme
  const [currentTheme, setCurrentTheme] = React.useState(LIGHT)
  const [isInitialized, setIsInitialized] = React.useState(false)

  // Initialize theme on component mount
  React.useEffect(() => {
    // Function to detect and set initial theme
    const initializeTheme = () => {
      try {
        // Check localStorage first
        const savedTheme = localStorage.getItem(THEME_KEY)
        
        // Check system preference if no saved theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        
        // Determine theme based on available information
        let themeToUse = LIGHT
        if (savedTheme === DARK || (!savedTheme && prefersDark)) {
          themeToUse = DARK
        }
        
        // Apply theme
        applyTheme(themeToUse)
        setCurrentTheme(themeToUse)
      } catch (error) {
        console.error('Error initializing theme:', error)
        // Fallback to light theme
        applyTheme(LIGHT)
        setCurrentTheme(LIGHT)
      }
      
      setIsInitialized(true)
    }
    
    initializeTheme()
  }, [])
  
  // Function to apply theme to document
  const applyTheme = (theme: string) => {
    try {
      // Remove both classes first
      document.documentElement.classList.remove(DARK, LIGHT)
      // Add the new theme class
      document.documentElement.classList.add(theme)
      
      // Store in localStorage
      localStorage.setItem(THEME_KEY, theme)
    } catch (error) {
      console.error('Error applying theme:', error)
    }
  }
  
  // Toggle theme function
  const toggleTheme = React.useCallback(() => {
    const newTheme = currentTheme === DARK ? LIGHT : DARK
    applyTheme(newTheme)
    setCurrentTheme(newTheme)
  }, [currentTheme])
  
  // Show loading state until initialized
  if (!isInitialized) {
    return (
      <Button variant="outline" size="icon" className="rounded-full">
        <div className="h-5 w-5 animate-pulse bg-gray-300 rounded-full" />
        <span className="sr-only">Loading theme</span>
      </Button>
    )
  }
  
  // Determine if dark mode is active
  const isDark = currentTheme === DARK
  
  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme}
      className={`
        rounded-full relative overflow-hidden
        transition-colors duration-300
        ${isDark 
          ? 'bg-slate-800 hover:bg-slate-700 border-slate-600' 
          : 'bg-slate-100 hover:bg-slate-200 border-slate-300'}
      `}
      aria-label={`Switch to ${isDark ? LIGHT : DARK} theme`}
    >
      <Sun 
        className={`
          absolute h-5 w-5 
          transition-all duration-300 ease-spring
          ${isDark 
            ? 'opacity-0 scale-0 rotate-90 translate-y-2' 
            : 'opacity-100 scale-100 rotate-0 translate-y-0 text-amber-500'}
        `} 
      />
      <Moon 
        className={`
          absolute h-5 w-5 
          transition-all duration-300 ease-spring
          ${isDark 
            ? 'opacity-100 scale-100 rotate-0 translate-y-0 text-indigo-300' 
            : 'opacity-0 scale-0 rotate-90 -translate-y-2'}
        `} 
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
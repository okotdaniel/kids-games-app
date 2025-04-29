"use client"

import { createContext, useContext, useRef, useState, useEffect } from "react"

const sounds = {
  correct: "/audio/correct.mp3",
  incorrect: "/audio/incorrect.mp3",
  click: "/audio/click.mp3",
  success: "/audio/success.mp3",
  pop: "/audio/pop.mp3",
  complete: "/audio/complete.mp3",
}

type SoundType = keyof typeof sounds

const AudioContext = createContext<{
  playAudio: (sound: SoundType) => void
  setMuted: (muted: boolean) => void
  muted: boolean
} | null>(null)

export function AudioProvider({ children }) {
  const audioRefs = useRef<Record<SoundType, HTMLAudioElement | null>>({
    correct: null,
    incorrect: null,
    click: null,
    success: null,
    pop: null,
    complete: null,
  })

  const [muted, setMuted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Only load audio in the browser
    if (typeof window !== "undefined") {
      // Load previous muted state
      const savedMuted = localStorage.getItem("audioMuted")
      if (savedMuted) {
        setMuted(savedMuted === "true")
      }

      // Initialize audio elements
      Object.entries(sounds).forEach(([key, src]) => {
        const audio = new Audio(src)
        audio.preload = "auto"
        audioRefs.current[key as SoundType] = audio
      })

      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("audioMuted", muted.toString())
    }
  }, [muted, isLoaded])

  const playAudio = (sound: SoundType) => {
    if (muted || !isLoaded) return

    const audio = audioRefs.current[sound]
    if (audio) {
      audio.currentTime = 0
      audio.play().catch((e) => {
        // Ignore autoplay policy errors
        console.log("Audio play error:", e)
      })
    }
  }

  return <AudioContext.Provider value={{ playAudio, setMuted, muted }}>{children}</AudioContext.Provider>
}

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}

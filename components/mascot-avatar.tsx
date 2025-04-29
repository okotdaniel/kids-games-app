"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useAudio } from "./audio-provider"

export function MascotAvatar() {
  const [isHovering, setIsHovering] = useState(false)
  const [messages] = useState([
    "Keep learning!",
    "You're doing great!",
    "Try another game!",
    "Let's play together!",
    "You're so smart!",
  ])
  const [message, setMessage] = useState("")
  const { playAudio } = useAudio()

  const handleMouseEnter = () => {
    setIsHovering(true)
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    setMessage(randomMessage)
    playAudio("pop")
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setMessage("")
  }

  return (
    <div className="relative flex items-center">
      <motion.div
        className="relative h-12 w-12 cursor-pointer rounded-full border-2 border-purple-300 bg-yellow-100 p-1 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src="/placeholder.svg?height=96&width=96"
          alt="Buddy the Learning Owl"
          width={96}
          height={96}
          className="h-full w-full rounded-full object-cover"
        />
        <motion.div
          className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        />
      </motion.div>

      <div className="ml-3">
        <h3 className="text-sm font-medium">Buddy</h3>
        <p className="text-xs text-muted-foreground">Your Helper</p>
      </div>

      {isHovering && (
        <motion.div
          className="absolute -top-14 left-0 right-0 z-10 rounded-lg bg-yellow-100 p-2 text-center text-sm font-medium text-yellow-800 shadow-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          {message}
          <div className="absolute -bottom-2 left-6 h-4 w-4 rotate-45 transform bg-yellow-100" />
        </motion.div>
      )}
    </div>
  )
}

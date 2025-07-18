"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, Star, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ColorGamePage() {
  const { toast } = useToast()
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [gameState, setGameState] = useState("playing") // playing, success, failure
  const [currentColor, setCurrentColor] = useState(null)
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)

  const colors = [
    { name: "Red", hex: "#ef4444" },
    { name: "Blue", hex: "#3b82f6" },
    { name: "Green", hex: "#22c55e" },
    { name: "Yellow", hex: "#eab308" },
    { name: "Purple", hex: "#a855f7" },
    { name: "Orange", hex: "#f97316" },
    { name: "Pink", hex: "#ec4899" },
    { name: "Brown", hex: "#a16207" },
    { name: "Black", hex: "#171717" },
    { name: "White", hex: "#f9fafb" },
  ]

  // Generate game data based on current level
  useEffect(() => {
    generateGame(currentLevel)
  }, [currentLevel])

  const generateGame = (level) => {
    // Reset game state
    setGameState("playing")
    setSelectedOption(null)

    // Determine how many colors to use based on level
    const numColors = Math.min(3 + Math.floor(level / 2), colors.length)

    // Select a subset of colors
    const availableColors = [...colors].sort(() => Math.random() - 0.5).slice(0, numColors)

    // Pick one as the correct answer
    const correctColor = availableColors[Math.floor(Math.random() * availableColors.length)]

    // Create options (3 options including the correct one)
    let gameOptions = [correctColor]

    // Add wrong options
    while (gameOptions.length < 3 && gameOptions.length < availableColors.length) {
      const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)]
      if (!gameOptions.includes(randomColor)) {
        gameOptions.push(randomColor)
      }
    }

    // Shuffle options
    gameOptions = gameOptions.sort(() => Math.random() - 0.5)

    setCurrentColor(correctColor)
    setOptions(gameOptions)

    // Update progress
    setProgress((level - 1) * 10)
  }

  const handleOptionSelect = (option) => {
    setSelectedOption(option)

    // Check if answer is correct
    const isCorrect = option.name === currentColor.name

    if (isCorrect) {
      setGameState("success")
      setScore(score + 10)

      // Show success toast
      toast({
        title: "Great job!",
        description: `That's right! This is ${currentColor.name}!`,
        variant: "success",
      })

      // Move to next level after delay
      setTimeout(() => {
        if (currentLevel < 10) {
          setCurrentLevel(currentLevel + 1)
        } else {
          // Game completed
          toast({
            title: "Amazing!",
            description: "You've completed all levels!",
            variant: "success",
          })
        }
      }, 1500)
    } else {
      setGameState("failure")

      // Show failure toast
      toast({
        title: "Try again!",
        description: `That's not ${currentColor.name}. Let's try again!`,
        variant: "destructive",
      })

      // Reset after delay
      setTimeout(() => {
        setGameState("playing")
        setSelectedOption(null)
      }, 1500)
    }
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-orange-100 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/games" className="inline-flex items-center text-blue-600">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Back to Games</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center">
              <Star className="h-5 w-5 text-yellow-500 fill-current mr-1" />
              <span className="font-bold text-yellow-700">{score}</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-orange-300 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-orange-600">Color Match</h1>
              <div className="text-sm font-medium bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                Level {currentLevel}/10
              </div>
            </div>

            <Progress value={progress} className="h-4 mb-8" />

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-700 mb-2">What color is this?</h2>
              <p className="text-gray-600">Look at the color and select its name!</p>
            </div>

            {currentColor && (
              <div className="h-40 rounded-2xl mb-8 shadow-inner" style={{ backgroundColor: currentColor.hex }} />
            )}

            <div className="grid grid-cols-3 gap-4 mb-4">
              {options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className={`h-16 text-xl font-bold rounded-2xl ${
                    selectedOption === option
                      ? gameState === "success"
                        ? "bg-green-500 hover:bg-green-600"
                        : gameState === "failure"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  disabled={gameState !== "playing"}
                >
                  {option.name}
                </Button>
              ))}
            </div>

            {gameState === "success" && (
              <div className="flex items-center justify-center p-4 bg-green-100 rounded-xl text-green-700">
                <Check className="h-6 w-6 mr-2" />
                <span className="font-bold">Correct! That's {currentColor.name}!</span>
              </div>
            )}

            {gameState === "failure" && (
              <div className="flex items-center justify-center p-4 bg-red-100 rounded-xl text-red-700">
                <X className="h-6 w-6 mr-2" />
                <span className="font-bold">Not quite. Try again!</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link href="/games">
              <Button variant="outline" className="rounded-full px-6">
                Choose Another Game
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

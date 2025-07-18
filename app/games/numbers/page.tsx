"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, Star, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NumberGamePage() {
  const { toast } = useToast()
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [gameState, setGameState] = useState("playing") // playing, success, failure
  const [objects, setObjects] = useState([])
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)

  // Generate game data based on current level
  useEffect(() => {
    generateGame(currentLevel)
  }, [currentLevel])

  const generateGame = (level) => {
    // Reset game state
    setGameState("playing")
    setSelectedOption(null)

    // Generate number of objects based on level (1-10)
    const count = level <= 5 ? level : 5 + Math.floor(Math.random() * 5)

    // Generate objects
    const newObjects = Array(count)
      .fill(0)
      .map((_, i) => ({
        id: i,
        type: ["apple", "star", "ball", "block"][Math.floor(Math.random() * 4)],
      }))

    // Generate answer options (including the correct one)
    const correctAnswer = count
    let newOptions = [correctAnswer]

    // Add 2 wrong options
    while (newOptions.length < 3) {
      const wrongOption = Math.max(
        1,
        correctAnswer + (Math.random() > 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 2)),
      )
      if (!newOptions.includes(wrongOption) && wrongOption <= 10) {
        newOptions.push(wrongOption)
      }
    }

    // Shuffle options
    newOptions = newOptions.sort(() => Math.random() - 0.5)

    setObjects(newObjects)
    setOptions(newOptions)

    // Update progress
    setProgress((level - 1) * 10)
  }

  const handleOptionSelect = (option) => {
    setSelectedOption(option)

    // Check if answer is correct
    const isCorrect = option === objects.length

    if (isCorrect) {
      setGameState("success")
      setScore(score + 10)

      // Show success toast
      toast({
        title: "Great job!",
        description: "You counted correctly!",
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
        description: "That's not the right number. Let's count together!",
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
    <div className="w-screen h-screen bg-gradient-to-b from-teal-100 to-blue-100">
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
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-teal-300 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-teal-600">Number Fun</h1>
              <div className="text-sm font-medium bg-teal-100 text-teal-700 px-3 py-1 rounded-full">
                Level {currentLevel}/10
              </div>
            </div>

            <Progress value={progress} className="h-4 mb-8" />

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-700 mb-2">How many objects do you see?</h2>
              <p className="text-gray-600">Count the objects and select the correct number!</p>
            </div>

            <div className="bg-teal-50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-5 gap-4 justify-items-center">
                {objects.map((object) => (
                  <div key={object.id} className="w-16 h-16 flex items-center justify-center">
                    {object.type === "apple" && <div className="text-4xl">🍎</div>}
                    {object.type === "star" && <div className="text-4xl">⭐</div>}
                    {object.type === "ball" && <div className="text-4xl">🏀</div>}
                    {object.type === "block" && <div className="text-4xl">🧱</div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {options.map((option) => (
                <Button
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  className={`h-20 text-3xl font-bold rounded-2xl ${
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
                  {option}
                </Button>
              ))}
            </div>

            {gameState === "success" && (
              <div className="flex items-center justify-center p-4 bg-green-100 rounded-xl text-green-700">
                <Check className="h-6 w-6 mr-2" />
                <span className="font-bold">Correct! Great job!</span>
              </div>
            )}

            {gameState === "failure" && (
              <div className="flex items-center justify-center p-4 bg-red-100 rounded-xl text-red-700">
                <X className="h-6 w-6 mr-2" />
                <span className="font-bold">Not quite. Try counting again!</span>
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

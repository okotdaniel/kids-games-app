"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, Star, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ShapeGamePage() {
  const { toast } = useToast()
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [gameState, setGameState] = useState("playing") // playing, success, failure
  const [currentShape, setCurrentShape] = useState(null)
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)

  const shapes = [
    {
      name: "Circle",
      render: (color) => <div className={`w-32 h-32 rounded-full ${color} mx-auto`}></div>,
    },
    {
      name: "Square",
      render: (color) => <div className={`w-32 h-32 ${color} mx-auto`}></div>,
    },
    {
      name: "Triangle",
      render: (color) => (
        <div
          className={`w-0 h-0 border-l-[60px] border-r-[60px] border-b-[104px] border-l-transparent border-r-transparent ${color.replace("bg-", "border-b-")} mx-auto`}
        ></div>
      ),
    },
    {
      name: "Rectangle",
      render: (color) => <div className={`w-48 h-24 ${color} mx-auto`}></div>,
    },
    {
      name: "Oval",
      render: (color) => <div className={`w-48 h-24 rounded-full ${color} mx-auto`}></div>,
    },
    {
      name: "Diamond",
      render: (color) => <div className={`w-32 h-32 ${color} mx-auto transform rotate-45`}></div>,
    },
  ]

  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"]

  // Generate game data based on current level
  useEffect(() => {
    generateGame(currentLevel)
  }, [currentLevel])

  const generateGame = (level) => {
    // Reset game state
    setGameState("playing")
    setSelectedOption(null)

    // Determine how many shapes to use based on level
    const numShapes = Math.min(3 + Math.floor(level / 2), shapes.length)

    // Select a subset of shapes
    const availableShapes = [...shapes].sort(() => Math.random() - 0.5).slice(0, numShapes)

    // Pick one as the correct answer
    const correctShape = availableShapes[Math.floor(Math.random() * availableShapes.length)]

    // Pick a random color
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    // Create options (3 options including the correct one)
    let gameOptions = [correctShape]

    // Add wrong options
    while (gameOptions.length < 3 && gameOptions.length < availableShapes.length) {
      const randomShape = availableShapes[Math.floor(Math.random() * availableShapes.length)]
      if (!gameOptions.find((s) => s.name === randomShape.name)) {
        gameOptions.push(randomShape)
      }
    }

    // Shuffle options
    gameOptions = gameOptions.sort(() => Math.random() - 0.5)

    setCurrentShape({ ...correctShape, color: randomColor })
    setOptions(gameOptions)

    // Update progress
    setProgress((level - 1) * 10)
  }

  const handleOptionSelect = (option) => {
    setSelectedOption(option)

    // Check if answer is correct
    const isCorrect = option.name === currentShape.name

    if (isCorrect) {
      setGameState("success")
      setScore(score + 10)

      // Show success toast
      toast({
        title: "Great job!",
        description: `That's right! This is a ${currentShape.name}!`,
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
        description: `That's not a ${currentShape.name}. Let's try again!`,
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
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100">
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
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-purple-300 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-purple-600">Shape Sort</h1>
              <div className="text-sm font-medium bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                Level {currentLevel}/10
              </div>
            </div>

            <Progress value={progress} className="h-4 mb-8" />

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-700 mb-2">What shape is this?</h2>
              <p className="text-gray-600">Look at the shape and select its name!</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 mb-8 h-48 flex items-center justify-center">
              {currentShape && currentShape.render(currentShape.color)}
            </div>

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
                <span className="font-bold">Correct! That's a {currentShape.name}!</span>
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

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, Star, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LetterGamePage() {
  const { toast } = useToast()
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [gameState, setGameState] = useState("playing") // playing, success, failure
  const [currentLetter, setCurrentLetter] = useState(null)
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)

  const letters = [
    { letter: "A", image: "🍎", word: "Apple" },
    { letter: "B", image: "🐻", word: "Bear" },
    { letter: "C", image: "🐱", word: "Cat" },
    { letter: "D", image: "🦮", word: "Dog" },
    { letter: "E", image: "🐘", word: "Elephant" },
    { letter: "F", image: "🐟", word: "Fish" },
    { letter: "G", image: "🦒", word: "Giraffe" },
    { letter: "H", image: "🏠", word: "House" },
    { letter: "I", image: "🍦", word: "Ice cream" },
    { letter: "J", image: "🤹", word: "Juggler" },
    { letter: "K", image: "🪁", word: "Kite" },
    { letter: "L", image: "🦁", word: "Lion" },
    { letter: "M", image: "🐵", word: "Monkey" },
    { letter: "N", image: "📰", word: "Newspaper" },
    { letter: "O", image: "🦉", word: "Owl" },
    { letter: "P", image: "🐧", word: "Penguin" },
    { letter: "Q", image: "👸", word: "Queen" },
    { letter: "R", image: "🌈", word: "Rainbow" },
    { letter: "S", image: "🌞", word: "Sun" },
    { letter: "T", image: "🐯", word: "Tiger" },
    { letter: "U", image: "☂️", word: "Umbrella" },
    { letter: "V", image: "🚐", word: "Van" },
    { letter: "W", image: "🐺", word: "Wolf" },
    { letter: "X", image: "📦", word: "Box" },
    { letter: "Y", image: "🧶", word: "Yarn" },
    { letter: "Z", image: "🦓", word: "Zebra" },
  ]

  // Generate game data based on current level
  useEffect(() => {
    generateGame(currentLevel)
  }, [currentLevel])

  const generateGame = (level) => {
    // Reset game state
    setGameState("playing")
    setSelectedOption(null)

    // For early levels, use first few letters
    // For higher levels, use more of the alphabet
    let availableLetters = []
    if (level <= 5) {
      // First 5 levels: A-E, F-J, K-O, P-T, U-Z
      const startIndex = (level - 1) * 5
      availableLetters = letters.slice(startIndex, startIndex + 5)
    } else {
      // Later levels: random selection from the whole alphabet
      availableLetters = [...letters].sort(() => Math.random() - 0.5).slice(0, 10)
    }

    // Pick one as the correct answer
    const correctLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)]

    // Create options (3 options including the correct one)
    let gameOptions = [correctLetter]

    // Add wrong options
    while (gameOptions.length < 3 && gameOptions.length < availableLetters.length) {
      const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)]
      if (!gameOptions.find((l) => l.letter === randomLetter.letter)) {
        gameOptions.push(randomLetter)
      }
    }

    // Shuffle options
    gameOptions = gameOptions.sort(() => Math.random() - 0.5)

    setCurrentLetter(correctLetter)
    setOptions(gameOptions)

    // Update progress
    setProgress((level - 1) * 10)
  }

  const handleOptionSelect = (option) => {
    setSelectedOption(option)

    // Check if answer is correct
    const isCorrect = option.letter === currentLetter.letter

    if (isCorrect) {
      setGameState("success")
      setScore(score + 10)

      // Show success toast
      toast({
        title: "Great job!",
        description: `That's right! ${currentLetter.letter} is for ${currentLetter.word}!`,
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
        description: `That's not the letter for ${currentLetter.word}. Let's try again!`,
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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100">
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
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-blue-300 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-blue-600">Letter Land</h1>
              <div className="text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                Level {currentLevel}/10
              </div>
            </div>

            <Progress value={progress} className="h-4 mb-8" />

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-700 mb-2">
                Which letter does {currentLetter?.word} start with?
              </h2>
              <p className="text-gray-600">Look at the picture and choose the correct letter!</p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-8 mb-8 flex items-center justify-center">
              <div className="text-8xl">{currentLetter?.image}</div>
              <div className="ml-6 text-4xl font-bold text-blue-700">{currentLetter?.word}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className={`h-20 text-4xl font-bold rounded-2xl ${
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
                  {option.letter}
                </Button>
              ))}
            </div>

            {gameState === "success" && (
              <div className="flex items-center justify-center p-4 bg-green-100 rounded-xl text-green-700">
                <Check className="h-6 w-6 mr-2" />
                <span className="font-bold">
                  Correct! {currentLetter.letter} is for {currentLetter.word}!
                </span>
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

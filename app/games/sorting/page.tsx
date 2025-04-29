"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, Star, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SortingGamePage() {
  const { toast } = useToast()
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [progress, setProgress] = useState(0)
  const [gameState, setGameState] = useState("playing") // playing, success, failure
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [draggedItem, setDraggedItem] = useState(null)
  const [correctPlacements, setCorrectPlacements] = useState([])
  const [attempts, setAttempts] = useState(0)

  // Game categories and items
  const gameLevels = [
    {
      name: "Colors",
      categories: [
        { id: "red", name: "Red", color: "bg-red-100 border-red-300" },
        { id: "blue", name: "Blue", color: "bg-blue-100 border-blue-300" },
        { id: "yellow", name: "Yellow", color: "bg-yellow-100 border-yellow-300" },
      ],
      items: [
        { id: "apple", emoji: "🍎", category: "red" },
        { id: "strawberry", emoji: "🍓", category: "red" },
        { id: "blueberry", emoji: "🫐", category: "blue" },
        { id: "water", emoji: "💧", category: "blue" },
        { id: "banana", emoji: "🍌", category: "yellow" },
        { id: "sun", emoji: "☀️", category: "yellow" },
      ],
    },
    {
      name: "Animals",
      categories: [
        { id: "water", name: "Water Animals", color: "bg-blue-100 border-blue-300" },
        { id: "land", name: "Land Animals", color: "bg-green-100 border-green-300" },
        { id: "air", name: "Air Animals", color: "bg-purple-100 border-purple-300" },
      ],
      items: [
        { id: "fish", emoji: "🐠", category: "water" },
        { id: "dolphin", emoji: "🐬", category: "water" },
        { id: "dog", emoji: "🐕", category: "land" },
        { id: "elephant", emoji: "🐘", category: "land" },
        { id: "bird", emoji: "🐦", category: "air" },
        { id: "butterfly", emoji: "🦋", category: "air" },
      ],
    },
    {
      name: "Shapes",
      categories: [
        { id: "round", name: "Round", color: "bg-pink-100 border-pink-300" },
        { id: "square", name: "Square", color: "bg-orange-100 border-orange-300" },
        { id: "triangle", name: "Triangle", color: "bg-teal-100 border-teal-300" },
      ],
      items: [
        { id: "ball", emoji: "⚽", category: "round" },
        { id: "orange", emoji: "🍊", category: "round" },
        { id: "box", emoji: "📦", category: "square" },
        { id: "tv", emoji: "📺", category: "square" },
        { id: "pizza", emoji: "🍕", category: "triangle" },
        { id: "mountain", emoji: "⛰️", category: "triangle" },
      ],
    },
  ]

  // Initialize game
  useEffect(() => {
    initializeGame(level)
  }, [level])

  const initializeGame = (currentLevel) => {
    // Reset game state
    setGameState("playing")
    setCorrectPlacements([])
    setAttempts(0)
    setDraggedItem(null)

    // Get level data (capped at available levels)
    const levelIndex = Math.min(currentLevel - 1, gameLevels.length - 1)
    const levelData = gameLevels[levelIndex]

    // Set categories and shuffle items
    setCategories(levelData.categories)
    setItems([...levelData.items].sort(() => Math.random() - 0.5))

    // Update progress
    setProgress(((currentLevel - 1) / 3) * 100)
  }

  const handleDragStart = (e, item) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e, category) => {
    e.preventDefault()
  }

  const handleDrop = (e, category) => {
    e.preventDefault()

    if (!draggedItem) return

    // Check if the item is already correctly placed
    if (correctPlacements.includes(draggedItem.id)) return

    // Check if the drop is correct
    const isCorrect = draggedItem.category === category.id

    // Update attempts
    setAttempts(attempts + 1)

    if (isCorrect) {
      // Add to correct placements
      setCorrectPlacements([...correctPlacements, draggedItem.id])

      // Remove from items
      setItems(items.filter((item) => item.id !== draggedItem.id))

      // Show success toast
      toast({
        title: "Great job!",
        description: `That's right! ${draggedItem.emoji} belongs in ${category.name}!`,
        variant: "success",
      })

      // Check if level is complete
      if (correctPlacements.length + 1 === items.length) {
        handleLevelComplete()
      }
    } else {
      // Show failure toast
      toast({
        title: "Try again!",
        description: `That doesn't belong there. Try another category!`,
        variant: "destructive",
      })
    }

    setDraggedItem(null)
  }

  const handleLevelComplete = () => {
    setGameState("success")

    // Calculate score based on attempts
    const perfectScore = items.length
    const attemptPenalty = Math.max(0, attempts - items.length)
    const levelScore = Math.max(5, 10 - attemptPenalty)

    setScore(score + levelScore)

    toast({
      title: "Level Complete!",
      description: "You've sorted all the items correctly!",
      variant: "success",
    })
  }

  const handleNextLevel = () => {
    if (level < gameLevels.length) {
      setLevel(level + 1)
    } else {
      // Game completed
      toast({
        title: "Game Complete!",
        description: "You've completed all sorting levels!",
        variant: "success",
      })
    }
  }

  const handleRestart = () => {
    initializeGame(level)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100">
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
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-green-300 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-green-600">Sorting Game</h1>
              <div className="text-sm font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">
                Level {level}/{gameLevels.length}
              </div>
            </div>

            <Progress value={progress} className="h-4 mb-8" />

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-700 mb-2">Sort the Items into the Right Categories!</h2>
              <p className="text-gray-600">Drag and drop each item to where it belongs!</p>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onDragOver={(e) => handleDragOver(e, category)}
                  onDrop={(e) => handleDrop(e, category)}
                  className={`${category.color} border-2 rounded-xl p-4 min-h-[150px] flex flex-col items-center`}
                >
                  <h3 className="font-bold mb-2">{category.name}</h3>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {items
                      .filter((item) => item.category === category.id && correctPlacements.includes(item.id))
                      .map((item) => (
                        <div
                          key={item.id}
                          className="w-16 h-16 bg-white rounded-lg shadow flex items-center justify-center text-3xl"
                        >
                          {item.emoji}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Items to sort */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-bold text-gray-700 mb-3">Items to Sort:</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {items
                  .filter((item) => !correctPlacements.includes(item.id))
                  .map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      className="w-16 h-16 bg-white rounded-lg shadow flex items-center justify-center text-3xl cursor-move hover:shadow-md transition-shadow"
                    >
                      {item.emoji}
                    </div>
                  ))}
              </div>
            </div>

            {gameState === "success" && (
              <div className="mt-6 text-center">
                <div className="bg-green-100 p-4 rounded-xl text-green-700 mb-4">
                  <h3 className="font-bold text-lg mb-1">Level Complete!</h3>
                  <p>You've sorted all the items correctly!</p>
                </div>
                <Button onClick={handleNextLevel} className="bg-green-500 hover:bg-green-600 rounded-xl">
                  {level < gameLevels.length ? "Next Level" : "Finish Game"}
                </Button>
              </div>
            )}

            <div className="flex justify-center mt-4">
              <Button onClick={handleRestart} variant="outline" size="sm" className="rounded-full">
                <RotateCcw className="h-4 w-4 mr-1" /> Restart Level
              </Button>
            </div>
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

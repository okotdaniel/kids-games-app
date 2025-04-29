"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, Star, RotateCcw, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MemoryGamePage() {
  const { toast } = useToast()
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [cards, setCards] = useState([])
  const [flippedIndices, setFlippedIndices] = useState([])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [timer, setTimer] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)

  const emojis = [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐵",
    "🐔",
    "🦄",
    "🐙",
    "🐢",
    "🦋",
    "🐬",
    "🦕",
    "🦖",
    "🐘",
  ]

  // Initialize game
  useEffect(() => {
    initializeGame(level)
  }, [level])

  // Timer
  useEffect(() => {
    let interval
    if (timerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerRunning])

  const initializeGame = (currentLevel) => {
    // Reset game state
    setFlippedIndices([])
    setMatchedPairs([])
    setMoves(0)
    setTimer(0)
    setGameStarted(false)
    setGameCompleted(false)
    setTimerRunning(false)

    // Determine number of pairs based on level
    const numPairs = Math.min(4 + currentLevel, 12)

    // Select emojis for this level
    const selectedEmojis = [...emojis].sort(() => Math.random() - 0.5).slice(0, numPairs)

    // Create pairs and shuffle
    const cardPairs = selectedEmojis.flatMap((emoji) => [
      { id: `${emoji}-1`, emoji, matched: false },
      { id: `${emoji}-2`, emoji, matched: false },
    ])

    setCards(cardPairs.sort(() => Math.random() - 0.5))
  }

  const handleCardClick = (index) => {
    // Start the game and timer on first card click
    if (!gameStarted) {
      setGameStarted(true)
      setTimerRunning(true)
    }

    // Ignore click if card is already flipped or matched
    if (flippedIndices.includes(index) || matchedPairs.includes(cards[index].emoji)) {
      return
    }

    // Ignore if two cards are already flipped
    if (flippedIndices.length === 2) {
      return
    }

    // Flip the card
    const newFlippedIndices = [...flippedIndices, index]
    setFlippedIndices(newFlippedIndices)

    // If this is the second card
    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1)

      const [firstIndex, secondIndex] = newFlippedIndices

      // Check if cards match
      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        // It's a match!
        setMatchedPairs([...matchedPairs, cards[firstIndex].emoji])

        // Clear flipped indices
        setTimeout(() => {
          setFlippedIndices([])

          // Check if game is complete
          if (matchedPairs.length + 1 === cards.length / 2) {
            handleGameComplete()
          }
        }, 500)
      } else {
        // Not a match, flip cards back
        setTimeout(() => {
          setFlippedIndices([])
        }, 1000)
      }
    }
  }

  const handleGameComplete = () => {
    setGameCompleted(true)
    setTimerRunning(false)

    // Calculate score based on level, moves and time
    const baseScore = level * 10
    const movesPenalty = Math.max(0, moves - cards.length / 2) * 2
    const timePenalty = Math.floor(timer / 10)
    const levelScore = Math.max(5, baseScore - movesPenalty - timePenalty)

    setScore(score + levelScore)

    toast({
      title: "Level Complete!",
      description: `You found all pairs in ${moves} moves and ${timer} seconds!`,
      variant: "success",
    })
  }

  const handleNextLevel = () => {
    setLevel(level + 1)
  }

  const handleRestart = () => {
    initializeGame(level)
  }

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100">
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
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-indigo-300 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-indigo-600">Memory Match</h1>
              <div className="text-sm font-medium bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                Level {level}
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 px-3 py-1 rounded-full flex items-center">
                  <Clock className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="font-medium text-purple-700">{formatTime(timer)}</span>
                </div>
                <div className="bg-blue-100 px-3 py-1 rounded-full flex items-center">
                  <span className="font-medium text-blue-700">Moves: {moves}</span>
                </div>
              </div>
              <Button onClick={handleRestart} variant="outline" size="sm" className="rounded-full">
                <RotateCcw className="h-4 w-4 mr-1" /> Restart
              </Button>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-700 mb-2">Find the Matching Pairs!</h2>
              <p className="text-gray-600">
                {!gameStarted
                  ? "Click on any card to start the game!"
                  : `Match all ${cards.length / 2} pairs to complete the level!`}
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-6">
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  className={`aspect-square rounded-xl cursor-pointer transition-all duration-300 transform ${
                    flippedIndices.includes(index) || matchedPairs.includes(card.emoji)
                      ? "rotate-y-180 bg-white"
                      : "bg-indigo-500 hover:bg-indigo-600"
                  } ${
                    matchedPairs.includes(card.emoji) ? "ring-2 ring-green-500" : ""
                  } flex items-center justify-center shadow-md`}
                >
                  {flippedIndices.includes(index) || matchedPairs.includes(card.emoji) ? (
                    <div className="text-4xl">{card.emoji}</div>
                  ) : (
                    <div className="text-2xl text-white">?</div>
                  )}
                </div>
              ))}
            </div>

            <Progress
              value={(matchedPairs.length / (cards.length / 2)) * 100}
              className="h-4 mb-4"
              indicatorClassName="bg-indigo-500"
            />

            {gameCompleted && (
              <div className="mt-6 text-center">
                <div className="bg-green-100 p-4 rounded-xl text-green-700 mb-4">
                  <h3 className="font-bold text-lg mb-1">Level Complete!</h3>
                  <p>
                    You found all pairs in {moves} moves and {formatTime(timer)}!
                  </p>
                </div>
                <Button onClick={handleNextLevel} className="bg-indigo-500 hover:bg-indigo-600 rounded-xl">
                  Next Level
                </Button>
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

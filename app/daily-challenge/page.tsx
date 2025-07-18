"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Calendar, Star, Check, X, Trophy, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAudio } from "@/components/audio-provider"
import { Badge } from "@/components/ui/badge"
import confetti from "canvas-confetti"

export default function DailyChallengePages() {
  const { toast } = useToast()
  const { playAudio } = useAudio()
  const [currentStep, setCurrentStep] = useState(0)
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [gameState, setGameState] = useState("intro") // intro, playing, success, completed
  const [selectedOption, setSelectedOption] = useState(null)
  const [timer, setTimer] = useState(0)
  const [streak, setStreak] = useState(4)
  const [remainingTime, setRemainingTime] = useState(30)
  const [showConfetti, setShowConfetti] = useState(false)

  // Challenge content - this would come from an API in a real app
  const challenges = [
    {
      type: "letter",
      question: "Which letter makes the 'sss' sound?",
      options: [
        { id: 1, text: "C" },
        { id: 2, text: "S" },
        { id: 3, text: "Z" },
      ],
      correctAnswer: 2,
    },
    {
      type: "shape",
      question: "Which shape has 3 sides?",
      options: [
        { id: 1, text: "Circle" },
        { id: 2, text: "Square" },
        { id: 3, text: "Triangle" },
      ],
      correctAnswer: 3,
    },
    {
      type: "counting",
      question: "How many apples do you see?",
      image: "🍎🍎🍎🍎",
      options: [
        { id: 1, text: "3" },
        { id: 2, text: "4" },
        { id: 3, text: "5" },
      ],
      correctAnswer: 2,
    },
    {
      type: "color",
      question: "What color is a banana?",
      options: [
        { id: 1, text: "Red" },
        { id: 2, text: "Green" },
        { id: 3, text: "Yellow" },
      ],
      correctAnswer: 3,
    },
    {
      type: "matching",
      question: "Which animal says 'Moo'?",
      options: [
        { id: 1, text: "Dog 🐕" },
        { id: 2, text: "Cow 🐄" },
        { id: 3, text: "Cat 🐱" },
      ],
      correctAnswer: 2,
    },
  ]

  // Timer for countdown
  useEffect(() => {
    let interval
    if (gameState === "playing" && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((time) => time - 1)
      }, 1000)
    } else if (remainingTime === 0 && gameState === "playing") {
      // Time's up
      handleTimeUp()
    }

    return () => clearInterval(interval)
  }, [gameState, remainingTime])

  const startChallenge = () => {
    setGameState("playing")
    setCurrentStep(0)
    setScore(0)
    setProgress(0)
    setRemainingTime(30)
    playAudio("click")
  }

  const handleOptionSelect = (optionId) => {
    if (gameState !== "playing") return

    setSelectedOption(optionId)
    const currentChallenge = challenges[currentStep]
    const isCorrect = optionId === currentChallenge.correctAnswer

    if (isCorrect) {
      setGameState("success")
      setScore(score + 10)
      playAudio("correct")

      toast({
        title: "Correct!",
        description: "Great job! You got it right!",
        variant: "success",
      })

      setTimeout(() => {
        if (currentStep < challenges.length - 1) {
          setCurrentStep(currentStep + 1)
          setProgress(((currentStep + 1) / challenges.length) * 100)
          setSelectedOption(null)
          setGameState("playing")
          setRemainingTime(30) // Reset timer for next question
        } else {
          // Challenge completed
          setGameState("completed")
          handleChallengeComplete()
        }
      }, 1500)
    } else {
      setGameState("failure")
      playAudio("incorrect")

      toast({
        title: "Try again",
        description: "That's not the right answer. Keep trying!",
        variant: "destructive",
      })

      setTimeout(() => {
        setSelectedOption(null)
        setGameState("playing")
      }, 1500)
    }
  }

  const handleTimeUp = () => {
    toast({
      title: "Time's up!",
      description: "You ran out of time for this question.",
      variant: "destructive",
    })

    playAudio("incorrect")

    setTimeout(() => {
      if (currentStep < challenges.length - 1) {
        setCurrentStep(currentStep + 1)
        setProgress(((currentStep + 1) / challenges.length) * 100)
        setSelectedOption(null)
        setGameState("playing")
        setRemainingTime(30) // Reset timer for next question
      } else {
        // Challenge completed
        setGameState("completed")
        handleChallengeComplete()
      }
    }, 1500)
  }

  const handleChallengeComplete = () => {
    setStreak(streak + 1)
    playAudio("complete")
    setShowConfetti(true)

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    toast({
      title: "Challenge Complete!",
      description: `You've completed today's challenge! Come back tomorrow for more!`,
      variant: "success",
    })
  }

  const currentChallenge = challenges[currentStep]

  return (
    <div className="w-screen h-screen mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="inline-flex items-center text-blue-600">
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center">
            <Star className="h-5 w-5 text-yellow-500 fill-current mr-1" />
            <span className="font-bold text-yellow-700">{score}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-4 border-purple-300 mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center">
                  <Calendar className="h-6 w-6 mr-2" /> Daily Challenge
                </h1>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-500">
                    <Trophy className="h-3 w-3 mr-1" />
                    <span>{streak} day streak</span>
                  </Badge>
                </div>
              </div>
            </div>

            {gameState === "intro" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 text-center">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-purple-700 mb-2">Today's Challenge: Alphabet Adventure</h2>
                  <p className="text-gray-600 mb-4">Complete 5 fun activities to earn your daily reward!</p>

                  <div className="flex justify-center mb-6">
                    <div className="flex -space-x-3">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-12 h-12 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-purple-700 font-bold"
                        >
                          {i === 0 ? "A" : i === 1 ? "B" : i === 2 ? "1" : i === 3 ? "🎨" : "🧩"}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mb-6">
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="font-bold text-yellow-700">Rewards:</span>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <div className="bg-white p-2 rounded-lg text-center">
                        <Star className="h-5 w-5 text-yellow-500 fill-current mx-auto" />
                        <span className="text-xs font-medium">10 Stars</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg text-center">
                        <div className="text-xl mx-auto w-fit">🏆</div>
                        <span className="text-xs font-medium">New Badge</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg text-center">
                        <Calendar className="h-5 w-5 text-green-500 mx-auto" />
                        <span className="text-xs font-medium">Streak +1</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={startChallenge}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 text-xl font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  Start Today's Challenge
                </Button>
              </motion.div>
            )}

            {(gameState === "playing" || gameState === "success" || gameState === "failure") && currentChallenge && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm font-medium bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                    Question {currentStep + 1} of {challenges.length}
                  </div>
                  <div className="flex items-center text-red-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="font-medium">{remainingTime}s</span>
                  </div>
                </div>

                <Progress value={progress} className="h-4 mb-8" />

                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-700 mb-2">{currentChallenge.question}</h2>

                  {currentChallenge.image && <div className="text-5xl my-4">{currentChallenge.image}</div>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  {currentChallenge.options.map((option) => (
                    <Button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      className={`h-16 text-xl font-medium rounded-xl ${
                        selectedOption === option.id
                          ? gameState === "success"
                            ? "bg-green-500 hover:bg-green-600"
                            : gameState === "failure"
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-blue-500 hover:bg-blue-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                      disabled={gameState !== "playing"}
                    >
                      {option.text}
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
                    <span className="font-bold">Not quite. Try again!</span>
                  </div>
                )}
              </div>
            )}

            {gameState === "completed" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 text-center"
              >
                <div className="mb-8">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-10 w-10 text-yellow-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-purple-700 mb-2">Challenge Complete!</h2>
                  <p className="text-gray-600">You've completed today's challenge!</p>

                  <div className="mt-6 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    <h3 className="font-bold text-yellow-700 mb-2">Rewards Earned:</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white p-3 rounded-lg">
                        <div className="font-bold text-2xl text-yellow-500">{score}</div>
                        <div className="text-xs text-gray-500">Stars</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="font-bold text-2xl text-purple-500">1</div>
                        <div className="text-xs text-gray-500">New Badge</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="font-bold text-2xl text-green-500">{streak}</div>
                        <div className="text-xs text-gray-500">Day Streak</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/games">
                    <Button variant="outline" className="rounded-full px-6">
                      Play More Games
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button className="rounded-full px-6 bg-gradient-to-r from-purple-600 to-blue-600">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

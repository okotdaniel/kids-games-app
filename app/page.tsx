"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Award, BookOpen, Palette, Shapes, Brain, Bell, ArrowRight } from "lucide-react"
import { useAudio } from "@/components/audio-provider"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const { playAudio } = useAudio()
  const [showWelcome, setShowWelcome] = useState(true)
  const [progress, setProgress] = useState({
    stars: 42,
    badges: 5,
    completed: 18,
    streak: 4,
  })

  const [featuredGames, setFeaturedGames] = useState([
    {
      title: "Color Match",
      description: "Match colors with their names",
      icon: <Palette className="h-6 w-6 text-orange-500" />,
      color: "orange",
      href: "/games/colors",
      isNew: false,
    },
    {
      title: "Shape Sort",
      description: "Identify different shapes",
      icon: <Shapes className="h-6 w-6 text-purple-500" />,
      color: "purple",
      href: "/games/shapes",
      isNew: true,
    },
    {
      title: "Memory Match",
      description: "Find matching pairs",
      icon: <Brain className="h-6 w-6 text-teal-500" />,
      color: "teal",
      href: "/games/memory",
      isNew: false,
    },
  ])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handlePlayClick = () => {
    playAudio("click")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {showWelcome && (
        <motion.div
          className="mb-8 rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-center text-white shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <h1 className="text-3xl font-bold">Welcome back, Daniel!</h1>
            <p className="mt-2">Ready for more learning adventures today?</p>
          </motion.div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="col-span-1 md:col-span-2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="mb-8">
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              <h2 className="text-2xl font-bold text-purple-700">
                <span className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Daily Challenge
                </span>
              </h2>
              <Badge variant="outline" className="w-fit">
                <Bell className="mr-1 h-3 w-3" /> New challenge available
              </Badge>
            </div>

            <Card className="mt-3 overflow-hidden border-2 border-purple-200">
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=200&width=800"
                  alt="Daily challenge"
                  width={800}
                  height={200}
                  className="h-[140px] w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">Alphabet Adventure</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 text-yellow-400" />
                      <Star className="h-4 w-4 text-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-gray-600">Learn 5 new letters and their sounds in today's special challenge!</p>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-gray-50 p-4">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-400 text-xs font-bold text-white"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-bold text-gray-600">
                      +2
                    </div>
                  </div>
                </div>
                <Link href="/daily-challenge">
                  <Button onClick={handlePlayClick} className="group rounded-full gap-1">
                    Start Challenge <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-purple-700">Featured Games</h2>
              <Link href="/games" className="text-sm text-blue-600 hover:underline">
                View all games
              </Link>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {featuredGames.map((game, index) => (
                <GameCard
                  key={game.title}
                  title={game.title}
                  description={game.description}
                  icon={game.icon}
                  color={game.color}
                  href={game.href}
                  isNew={game.isNew}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="col-span-1"
        >
          <h2 className="text-2xl font-bold text-purple-700">My Progress</h2>

          <Card className="mt-3 border-2 border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle>Learning Stats</CardTitle>
              <CardDescription>Your adventure so far</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatItem
                icon={<Star className="h-5 w-5 text-yellow-500" />}
                label="Stars Earned"
                value={progress.stars}
                color="bg-yellow-100"
                textColor="text-yellow-700"
              />
              <StatItem
                icon={<Award className="h-5 w-5 text-purple-500" />}
                label="Badges Collected"
                value={progress.badges}
                color="bg-purple-100"
                textColor="text-purple-700"
              />
              <StatItem
                icon={<BookOpen className="h-5 w-5 text-blue-500" />}
                label="Games Completed"
                value={progress.completed}
                color="bg-blue-100"
                textColor="text-blue-700"
              />
              <StatItem
                icon={<Bell className="h-5 w-5 text-green-500" />}
                label="Day Streak"
                value={progress.streak}
                suffix="days"
                color="bg-green-100"
                textColor="text-green-700"
              />
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Link href="/profile" className="w-full">
                <Button
                  onClick={handlePlayClick}
                  variant="outline"
                  className="w-full border-dashed border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  View Full Progress
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="mt-4 border-2 border-green-100">
            <CardHeader className="pb-2">
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <AchievementItem
                title="Color Expert"
                description="Matched all colors correctly"
                color="bg-orange-100"
                icon={<Palette className="h-5 w-5 text-orange-500" />}
              />
              <AchievementItem
                title="Memory Master"
                description="Completed level 5 of Memory Match"
                color="bg-purple-100"
                icon={<Brain className="h-5 w-5 text-purple-500" />}
                isNew
              />
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Link href="/profile" className="w-full">
                <Button
                  onClick={handlePlayClick}
                  variant="outline"
                  className="w-full border-dashed border-green-200 text-green-700 hover:bg-green-50"
                >
                  View All Achievements
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 text-center"
      >
        <Link href="/games">
          <Button
            onClick={handlePlayClick}
            className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 text-xl font-bold shadow-lg hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            Start Learning!
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}

function GameCard({ title, description, icon, color, href, isNew, delay = 0 }) {
  const { playAudio } = useAudio()
  const colorMap = {
    orange: "border-orange-200 bg-orange-50 hover:border-orange-300",
    purple: "border-purple-200 bg-purple-50 hover:border-purple-300",
    teal: "border-teal-200 bg-teal-50 hover:border-teal-300",
    blue: "border-blue-200 bg-blue-50 hover:border-blue-300",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 + delay }}
    >
      <Link href={href} onClick={() => playAudio("click")}>
        <Card
          className={`relative border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${colorMap[color]}`}
        >
          {isNew && (
            <Badge className="absolute right-2 top-2 bg-green-500 px-1.5 py-0.5 text-[10px]" variant="success">
              NEW
            </Badge>
          )}
          <CardHeader className="pb-2">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
              {icon}
            </div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="text-xs">{description}</CardDescription>
          </CardHeader>
          <CardFooter className="border-t bg-white/50 pt-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
              ))}
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}

function StatItem({ icon, label, value, suffix = "", color, textColor }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${color}`}>{icon}</div>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className={`font-bold ${textColor}`}>
        {value} {suffix}
      </span>
    </div>
  )
}

function AchievementItem({ title, description, color, icon, isNew = false }) {
  return (
    <div className={`relative rounded-lg p-3 ${color}`}>
      {isNew && (
        <Badge className="absolute right-2 top-2 bg-green-500 px-1.5 py-0.5 text-[10px]" variant="success">
          NEW
        </Badge>
      )}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">{icon}</div>
        <div>
          <h3 className="font-bold">{title}</h3>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  )
}

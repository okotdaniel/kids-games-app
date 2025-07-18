import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Star, Palette, Shapes, BookOpen, Music, Brain, MoveHorizontal } from "lucide-react"

export default function GamesPage() {
  return (
    <div className="w-screen bg-gradient-to-b from-green-100 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-600 mb-6">
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>Back to Home</span>
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-green-600 mb-2">Play & Learn</h1>
          <p className="text-xl text-blue-700">Choose a fun game to play!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <GameCard
            title="Color Match"
            description="Match colors with their names and objects"
            icon={<Palette className="h-10 w-10 text-orange-500" />}
            color="orange"
            level="Easy"
            stars={4}
            href="/games/colors"
          />

          <GameCard
            title="Shape Sort"
            description="Identify and sort different shapes"
            icon={<Shapes className="h-10 w-10 text-purple-500" />}
            color="purple"
            level="Medium"
            stars={3}
            href="/games/shapes"
          />

          <GameCard
            title="Number Fun"
            description="Count objects and learn numbers"
            icon={<span className="text-teal-500 font-bold text-2xl">123</span>}
            color="teal"
            level="Easy"
            stars={5}
            href="/games/numbers"
          />

          <GameCard
            title="Letter Land"
            description="Learn letters and simple words"
            icon={<BookOpen className="h-10 w-10 text-blue-500" />}
            color="blue"
            level="Medium"
            stars={4}
            href="/games/letters"
          />

          <GameCard
            title="Music Maker"
            description="Create music and learn about sounds"
            icon={<Music className="h-10 w-10 text-pink-500" />}
            color="pink"
            level="Easy"
            stars={3}
            href="/games/music"
          />

          <GameCard
            title="Memory Match"
            description="Find matching pairs and improve memory"
            icon={<Brain className="h-10 w-10 text-indigo-500" />}
            color="indigo"
            level="Hard"
            stars={2}
            href="/games/memory"
          />

          <GameCard
            title="Sorting Game"
            description="Drag and drop items into the right categories"
            icon={<MoveHorizontal className="h-10 w-10 text-green-500" />}
            color="green"
            level="Medium"
            stars={4}
            href="/games/sorting"
          />
        </div>
      </div>
    </div>
  )
}

function GameCard({ title, description, icon, color, level, stars, href }) {
  const colorMap = {
    orange: "bg-orange-100 border-orange-300 hover:border-orange-400",
    purple: "bg-purple-100 border-purple-300 hover:border-purple-400",
    teal: "bg-teal-100 border-teal-300 hover:border-teal-400",
    blue: "bg-blue-100 border-blue-300 hover:border-blue-400",
    pink: "bg-pink-100 border-pink-300 hover:border-pink-400",
    indigo: "bg-indigo-100 border-indigo-300 hover:border-indigo-400",
    green: "bg-green-100 border-green-300 hover:border-green-400",
  }

  const levelColorMap = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  }

  return (
    <Link href={href}>
      <div
        className={`rounded-3xl p-6 shadow-md border-4 ${colorMap[color]} hover:shadow-lg transition-all transform hover:-translate-y-1`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm">{icon}</div>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${levelColorMap[level]}`}>{level}</span>
        </div>

        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>

        <div className="flex justify-between items-center">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-5 w-5 ${i < stars ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
            ))}
          </div>
          <Button className="rounded-full bg-white text-gray-700 hover:bg-gray-100 border border-gray-200">Play</Button>
        </div>
      </div>
    </Link>
  )
}

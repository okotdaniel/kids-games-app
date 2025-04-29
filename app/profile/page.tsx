import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Star, ChevronLeft, Award, Rocket } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-600 mb-6">
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-purple-300 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-yellow-100 border-4 border-yellow-300 flex items-center justify-center overflow-hidden">
                <Image
                  src="/placeholder.svg?height=128&width=128"
                  alt="Profile avatar"
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl">
                K
              </div>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-purple-600">Alex's Learning Journey</h1>
              <p className="text-gray-600 mt-2">Kindergarten Explorer</p>

              <div className="mt-4 flex items-center gap-2">
                <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 fill-current mr-1" />
                  <span className="font-bold text-yellow-700">42 Stars</span>
                </div>
                <div className="bg-blue-100 px-3 py-1 rounded-full flex items-center">
                  <Award className="h-5 w-5 text-blue-500 mr-1" />
                  <span className="font-bold text-blue-700">5 Badges</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">My Learning Progress</h2>

            <div className="space-y-6">
              <ProgressItem title="Numbers" progress={80} color="bg-green-500" stars={4} />
              <ProgressItem title="Letters" progress={60} color="bg-blue-500" stars={3} />
              <ProgressItem title="Colors" progress={90} color="bg-orange-500" stars={5} />
              <ProgressItem title="Shapes" progress={40} color="bg-purple-500" stars={2} />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Recent Achievements</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <AchievementCard
                title="Color Expert"
                description="Matched all colors correctly!"
                icon={<Award className="h-8 w-8 text-yellow-500" />}
              />
              <AchievementCard
                title="Number Whiz"
                description="Counted to 20 without mistakes!"
                icon={<Rocket className="h-8 w-8 text-blue-500" />}
              />
              <AchievementCard
                title="Shape Master"
                description="Identified all basic shapes!"
                icon={<Award className="h-8 w-8 text-purple-500" />}
              />
            </div>
          </div>

          <div className="text-center">
            <Link href="/games">
              <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2 text-lg font-bold">
                Continue Learning
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProgressItem({ title, progress, color, stars }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-bold text-gray-700">{title}</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-5 w-5 ${i < stars ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
          ))}
        </div>
      </div>
      <Progress value={progress} className="h-4 bg-gray-100" indicatorClassName={color} />
    </div>
  )
}

function AchievementCard({ title, description, icon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-yellow-100 p-2 rounded-lg">{icon}</div>
        <h3 className="font-bold">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

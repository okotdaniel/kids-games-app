"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ChevronLeft, Star, Play, Pause, Save, Music, Volume2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MusicMakerPage() {
  const { toast } = useToast()
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(50)
  const [tempo, setTempo] = useState(120)
  const [selectedInstrument, setSelectedInstrument] = useState("piano")
  const [composition, setComposition] = useState(Array(16).fill(null))
  const timerRef = useRef(null)
  const [currentBeat, setCurrentBeat] = useState(-1)

  const instruments = [
    { id: "piano", name: "Piano", emoji: "🎹", color: "bg-blue-100 border-blue-300" },
    { id: "drum", name: "Drum", emoji: "🥁", color: "bg-red-100 border-red-300" },
    { id: "guitar", name: "Guitar", emoji: "🎸", color: "bg-green-100 border-green-300" },
    { id: "xylophone", name: "Xylophone", emoji: "🔔", color: "bg-purple-100 border-purple-300" },
  ]

  const notes = [
    { id: "C", name: "Do", color: "bg-red-500" },
    { id: "D", name: "Re", color: "bg-orange-500" },
    { id: "E", name: "Mi", color: "bg-yellow-500" },
    { id: "F", name: "Fa", color: "bg-green-500" },
    { id: "G", name: "Sol", color: "bg-blue-500" },
    { id: "A", name: "La", color: "bg-indigo-500" },
    { id: "B", name: "Ti", color: "bg-purple-500" },
  ]

  // Play a note
  const playNote = (note) => {
    if (!note) return

    // In a real app, we would use the Web Audio API to play actual sounds
    // For this demo, we'll just show a toast
    toast({
      title: `Playing ${note.name}`,
      description: `Instrument: ${selectedInstrument}`,
      duration: 500,
    })
  }

  // Toggle a note in the composition
  const toggleNote = (beatIndex, note) => {
    const newComposition = [...composition]

    if (newComposition[beatIndex] && newComposition[beatIndex].id === note.id) {
      // If the same note is clicked again, remove it
      newComposition[beatIndex] = null
    } else {
      // Otherwise, set the note
      newComposition[beatIndex] = note
    }

    setComposition(newComposition)

    // Play the note when added
    if (newComposition[beatIndex]) {
      playNote(newComposition[beatIndex])
    }
  }

  // Play or pause the composition
  const togglePlay = () => {
    if (isPlaying) {
      // Stop playing
      clearInterval(timerRef.current)
      setIsPlaying(false)
      setCurrentBeat(-1)
    } else {
      // Start playing
      setIsPlaying(true)
      setCurrentBeat(0)

      const beatDuration = 60000 / tempo / 4 // Quarter notes at the given tempo

      timerRef.current = setInterval(() => {
        setCurrentBeat((prevBeat) => {
          const nextBeat = (prevBeat + 1) % 16

          // Play the note at this beat if there is one
          if (composition[nextBeat]) {
            playNote(composition[nextBeat])
          }

          return nextBeat
        })
      }, beatDuration)
    }
  }

  // Save the composition
  const saveComposition = () => {
    // In a real app, we would save this to a database
    setScore(score + 10)
    toast({
      title: "Composition Saved!",
      description: "Your musical masterpiece has been saved!",
      variant: "success",
    })
  }

  // Clear the composition
  const clearComposition = () => {
    setComposition(Array(16).fill(null))
    toast({
      title: "Composition Cleared",
      description: "Start creating a new musical masterpiece!",
    })
  }

  // Clean up the interval when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Update the timer when tempo changes
  useEffect(() => {
    if (isPlaying) {
      clearInterval(timerRef.current)

      const beatDuration = 60000 / tempo / 4

      timerRef.current = setInterval(() => {
        setCurrentBeat((prevBeat) => {
          const nextBeat = (prevBeat + 1) % 16

          if (composition[nextBeat]) {
            playNote(composition[nextBeat])
          }

          return nextBeat
        })
      }, beatDuration)
    }
  }, [tempo, isPlaying, composition])

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-pink-100 to-purple-100">
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
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-pink-300 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-pink-600">Music Maker</h1>
              <div className="text-sm font-medium bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
                <Music className="h-4 w-4 inline mr-1" />
                <span>Create Music</span>
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-700 mb-2">Make Your Own Music!</h2>
              <p className="text-gray-600">Click on the grid to add notes and create a melody!</p>
            </div>

            {/* Instrument Selection */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-2">Choose an Instrument:</h3>
              <div className="grid grid-cols-4 gap-2">
                {instruments.map((instrument) => (
                  <button
                    key={instrument.id}
                    onClick={() => setSelectedInstrument(instrument.id)}
                    className={`p-3 rounded-xl border-2 ${instrument.color} ${
                      selectedInstrument === instrument.id ? "ring-2 ring-offset-2 ring-pink-500" : ""
                    }`}
                  >
                    <div className="text-2xl mb-1">{instrument.emoji}</div>
                    <div className="text-sm font-medium">{instrument.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Music Grid */}
            <div className="mb-6 overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-16 gap-1 mb-2">
                  {Array(16)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className={`h-6 flex items-center justify-center text-xs font-medium ${
                          i % 4 === 0 ? "text-pink-600" : "text-gray-400"
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                </div>

                {notes.map((note, noteIndex) => (
                  <div key={note.id} className="grid grid-cols-16 gap-1 mb-1">
                    <div className="col-span-1 flex items-center justify-center text-xs font-medium text-gray-600 pr-2">
                      {note.name}
                    </div>
                    {Array(16)
                      .fill(0)
                      .map((_, beatIndex) => (
                        <button
                          key={beatIndex}
                          onClick={() => toggleNote(beatIndex, note)}
                          className={`h-10 rounded-md ${
                            composition[beatIndex]?.id === note.id ? note.color : "bg-gray-100 hover:bg-gray-200"
                          } ${currentBeat === beatIndex ? "ring-2 ring-pink-500" : ""}`}
                        ></button>
                      ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Playback Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-bold text-gray-700 mb-2">Tempo: {tempo} BPM</h3>
                <Slider
                  value={[tempo]}
                  min={60}
                  max={200}
                  step={5}
                  onValueChange={(value) => setTempo(value[0])}
                  className="mb-4"
                />

                <h3 className="font-bold text-gray-700 mb-2">Volume: {volume}%</h3>
                <div className="flex items-center">
                  <Volume2 className="h-5 w-5 text-gray-500 mr-2" />
                  <Slider value={[volume]} min={0} max={100} step={5} onValueChange={(value) => setVolume(value[0])} />
                </div>
              </div>

              <div className="flex flex-col justify-center gap-3">
                <Button
                  onClick={togglePlay}
                  className={`h-12 rounded-xl ${
                    isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-5 w-5 mr-2" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" /> Play
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={saveComposition} className="bg-blue-500 hover:bg-blue-600 rounded-xl">
                    <Save className="h-5 w-5 mr-2" /> Save
                  </Button>
                  <Button onClick={clearComposition} variant="outline" className="rounded-xl">
                    Clear
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-pink-50 p-4 rounded-xl text-pink-700 text-center">
              <p className="font-medium">
                Create your own melody by clicking on the grid! Each row is a different note, and each column is a beat
                in your song.
              </p>
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

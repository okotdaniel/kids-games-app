"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Award,
  BookOpen,
  Settings,
  Users,
  Star,
  Palette,
  Shapes,
  Music,
  Brain,
  MoveHorizontal,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuBadge,
  useSidebar,
} from "@/components/ui/sidebar"
import { MascotAvatar } from "@/components/mascot-avatar"
import { Badge } from "@/components/ui/badge"
import { useAudio } from "@/components/audio-provider"

export function AppSidebar() {
  const pathname = usePathname()
  const { playAudio } = useAudio()
  const { isMobile } = useSidebar()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  const handleMenuClick = () => {
    if (!isMobile) {
      playAudio("click")
    }
  }

  const gameItems = [
    { href: "/games/colors", label: "Color Match", icon: <Palette className="h-4 w-4" /> },
    { href: "/games/shapes", label: "Shape Sort", icon: <Shapes className="h-4 w-4" /> },
    { href: "/games/numbers", label: "Number Fun", icon: <span className="text-xs font-semibold">123</span> },
    { href: "/games/letters", label: "Letter Land", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/games/music", label: "Music Maker", icon: <Music className="h-4 w-4" /> },
    { href: "/games/memory", label: "Memory Match", icon: <Brain className="h-4 w-4" /> },
    { href: "/games/sorting", label: "Sorting Game", icon: <MoveHorizontal className="h-4 w-4" /> },
  ]

  return (
    <Sidebar variant="floating">
      <SidebarHeader className="px-3 py-2">
        <Link href="/" className="flex items-center" onClick={handleMenuClick}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700">
            <Star className="h-5 w-5 fill-current" />
          </div>
          <div className="ml-2">
            <h1 className="text-xl font-bold text-purple-700">Kidsploer</h1>
            <p className="text-xs text-muted-foreground">Games app </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/"}>
              <Link href="/" onClick={handleMenuClick}>
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/profile"}>
              <Link href="/profile" onClick={handleMenuClick}>
                <Award className="h-4 w-4" />
                <span>My Progress</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuBadge>5</SidebarMenuBadge>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/games"}>
              <Link href="/games" onClick={handleMenuClick}>
                <BookOpen className="h-4 w-4" />
                <span>All Games</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/daily-challenge"}>
              <Link href="/daily-challenge" onClick={handleMenuClick}>
                <Star className="h-4 w-4" />
                <span>Daily Challenge</span>
              </Link>
            </SidebarMenuButton>
            <Badge variant="outline" className="absolute right-2 top-2 px-1 py-0 text-[10px] font-normal">
              NEW
            </Badge>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator className="my-4" />

        <SidebarGroup>
          <SidebarGroupLabel>Games</SidebarGroupLabel>
          <SidebarMenu>
            {gameItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href} onClick={handleMenuClick}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="p-3">
          <MascotAvatar />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/parent-dashboard" onClick={handleMenuClick}>
                <Users className="h-4 w-4" />
                <span>Parent Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings" onClick={handleMenuClick}>
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

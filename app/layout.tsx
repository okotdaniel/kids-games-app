import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { AudioProvider } from "@/components/audio-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "KidsPlorer- Fun games for your kids",
  description: "Fun and personalized learning games for your  kids",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AudioProvider>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <AppSidebar />
                <main className="">
                  {children}
                </main>
              </div>
              <Toaster />
            </SidebarProvider>
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

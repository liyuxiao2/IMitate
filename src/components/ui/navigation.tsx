"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface NavigationProps {
  user?: {
    username: string
    email: string
    rank: number
    avgScore: number
    streak: number
  }
}

export default function Navigation({user }: NavigationProps) {
  const [panelOpen, setPanelOpen] = useState(false)

  const navItems = ["Home", "Career", "Friends"]

  const router = useRouter()

  const handleRedirect = (name: string) => {
    router.push("/" + name)
  }
  return (
    <>
      {/* ✅ Profile Slide-Over Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-mcmaster-maroon text-white border-4 border-black shadow-lg p-6 transform transition-transform duration-300 z-50 ${
          panelOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-3xl">
            👤
          </div>
        </div>
        <p><strong>Username:</strong> {user?.username ?? "N/A"}</p>
        <p><strong>Leaderboard:</strong> <span className="text-blue-600">{user?.rank ?? "X"}</span></p>
        <p><strong>Avg Score:</strong> <span className="text-blue-600">{user?.avgScore ?? "X"}</span></p>
        <p><strong>Streak:</strong> <span className="text-blue-600">{user?.streak ?? "X"}</span></p>
        <p className="break-words mt-2">{user?.email ?? "email@example.com"}</p>
      </div>

      {/* ✅ Navigation Bar */}
      <nav className="bg-mcmaster-maroon shadow-lg relative z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <img
                src="/IMlogo.png"
                alt="Logo"
                className="w-10 h-10 rounded-full object-contain"
              />
              <button
                onClick={() => setPanelOpen(!panelOpen)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-mcmaster-maroon font-bold hover:scale-110 transition-transform duration-300"
                title="Toggle Profile Panel"
              >
                👤
              </button>
            </div>

            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item}>
                  <button
                    onClick={() => handleRedirect(item)}
                    className="text-white font-medium px-4 py-2 rounded transition-colors duration-300 text-sm sm:text-base hover:bg-mcmaster-light"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}
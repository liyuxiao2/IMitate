"use client"

import Navigation from "./navigation"
import HeroSection from "./hero-section"
import router from "next/router"

export default function HomeClient() {
  const handleProfileClick = () => {
    router.push("/chat")
  }

  return (
    <div className="bg-gradient-to-br from-[#e66465] to-[#9198e5] min-h-screen flex flex-col">

      <Navigation onProfileClick={handleProfileClick} />
      <HeroSection />
    </div>
  )
}

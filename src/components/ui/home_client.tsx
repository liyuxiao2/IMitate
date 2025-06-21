"use client"

import Navigation from "./navigation"
import HeroSection from "./hero-section"


export default function HomeClient() {
  return (
    <div className="bg-gradient-to-br from-[#e66465] to-[#9198e5] min-h-screen flex flex-col">

      <Navigation />
      <HeroSection />
    </div>
  )
}

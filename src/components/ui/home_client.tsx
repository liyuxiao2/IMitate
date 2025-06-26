"use client";

import Navigation from "./navigation";
import HeroSection from "./hero-section";

export default function HomeClient() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <HeroSection />
    </div>
  );
}

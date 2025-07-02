"use client";

import Header from "./header";
import HeroSection from "./hero-section";

export default function HomeClient() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />
    </div>
  );
}

"use client"
import { useRouter } from "next/navigation"


export default function HeroSection() {
  const router = useRouter()

  const handleChatRedirect = () => {
    router.push("/chat")
  }

  return (
    <main
      className="relative flex-1 flex flex-col justify-center items-center text-center px-4 py-8 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/IMBACK.png')" }}
    >

      <button
  onClick={handleChatRedirect}
  className="mt-125 bg-gradient-to-r from-mcmaster-maroon to-mcmaster-light text-white font-bold text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-full hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all duration-300 uppercase tracking-wider animate-fade-in-up animate-delay-600 shadow-mcmaster"
      >
        CHAT NOW
      </button>
    </main>
  )
}
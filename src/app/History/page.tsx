"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dumbbell, Users, Clock, User, ChevronDown } from "lucide-react"
import Link from "next/link"

interface CaseHistory {
  patientName: string;
  diagnosis: string;
  score: string;
  date: string;
}

const historyData: CaseHistory[] = [
    { patientName: "Charles Li", diagnosis: "Angina", score: "37/50", date: "06/21/2025" },
    { patientName: "Daniel Yu", diagnosis: "Tuberculosis", score: "22/50", date: "06/20/2025" },
    { patientName: "Alex Li", diagnosis: "Osteoarthritis", score: "42/50", date: "06/20/2025" },
    { patientName: "Anson Wang", diagnosis: "Type 2 Diabetes Mellitus", score: "36/50", date: "06/17/2025" },
    { patientName: "Kevin Li", diagnosis: "Hyperlipidemia", score: "12/50", date: "06/16/2025" },
    { patientName: "Anna Wei", diagnosis: "Asthma", score: "2/50", date: "06/16/2025" },
    { patientName: "Amanda Xu", diagnosis: "GERD", score: "41/50", date: "06/15/2025" },
    { patientName: "Jason Deng", diagnosis: "Pneumonia", score: "48/50", date: "06/14/2025" },
    { patientName: "Lebron James", diagnosis: "UTI", score: "32/50", date: "05/30/2025" },
    { patientName: "Kai Cenat", diagnosis: "Atrial Fibrillation", score: "22/50", date: "05/29/2025" },
    { patientName: "Linda Chow", diagnosis: "Acute Cholecystitis", score: "12/50", date: "05/16/2025" },
    { patientName: "Isaac Lee", diagnosis: "Iron Deficiency Anemia", score: "15/50", date: "05/13/2025" },
]

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-200 flex">
      {/* Sidebar */}
      <div className="w-64 bg-mcmaster-maroon text-white flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <Link href="/">
            <img src="/IMlogo.png" alt="IMitate Logo" className="h-8 w-auto" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <div className="space-y-2">
            <Link href="/chat">
              <div className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer">
                <Dumbbell className="w-5 h-5" />
                <span>Practice</span>
              </div>
            </Link>
            <Link href="/Career">
              <div className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer">
                <Users className="w-5 h-5" />
                <span>Social</span>
              </div>
            </Link>
            <div className="flex items-center gap-3 px-4 py-3 bg-white/20 rounded-lg cursor-pointer">
              <Clock className="w-5 h-5" />
              <span>History</span>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="bg-mcmaster-maroon px-8 py-4 flex justify-end">
          <Link href="/Profile">
            <Avatar className="w-10 h-10 cursor-pointer">
              <AvatarFallback className="bg-gray-300 text-gray-600">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
        <div className="flex-1 p-12">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl font-bold text-mcmaster-maroon mb-2">History</h1>
            <p className="text-xl text-gray-600 mb-12">View your past cases and feedback</p>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-mcmaster-maroon text-white">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold">Patient Name</th>
                    <th className="py-4 px-6 text-left font-semibold">Correct Diagnosis</th>
                    <th className="py-4 px-6 text-left font-semibold">Score</th>
                    <th className="py-4 px-6 text-left font-semibold">Date</th>
                    <th className="py-4 px-6 text-left font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {historyData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-4 px-6">{item.patientName}</td>
                      <td className="py-4 px-6 font-medium">{item.diagnosis}</td>
                      <td className="py-4 px-6">{item.score}</td>
                      <td className="py-4 px-6">{item.date}</td>
                      <td className="py-4 px-6">
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
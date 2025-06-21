import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dumbbell, Users, Clock, User, Edit } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-200 flex">
      {/* Sidebar */}
      <div className="w-64 bg-mcmaster-maroon text-white flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <Link href="/">
            <img src="/IMlogo.png" alt="IMitate Logo" className="h-12 w-auto" />
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
            <Link href="/History">
              <div className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer">
                <Clock className="w-5 h-5" />
                <span>History</span>
              </div>
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="bg-top-bar px-8 py-4 flex justify-end">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-gray-300 text-gray-600">
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 p-12">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl font-bold text-mcmaster-maroon mb-16">Profile</h1>

            <div className="grid grid-cols-3 gap-x-24 items-start">
              {/* Form Section */}
              <div className="col-span-2 space-y-12">
                {/* Display Name */}
                <div className="space-y-3">
                  <Label className="text-xl font-medium text-mcmaster-maroon">Display Name</Label>
                  <div className="relative">
                    <Input
                      defaultValue="Christopher Zhu"
                      className="bg-gray-300 border-0 text-gray-800 text-xl py-4 pr-14 rounded-full w-full"
                      readOnly
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 h-10 w-10"
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-3">
                  <Label className="text-xl font-medium text-mcmaster-maroon">Username</Label>
                  <div className="relative">
                    <Input
                      defaultValue="chris"
                      className="bg-gray-300 border-0 text-gray-800 text-xl py-4 pr-14 rounded-full w-full"
                      readOnly
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 h-10 w-10"
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <Label className="text-xl font-medium text-mcmaster-maroon">E-Mail</Label>
                  <div className="relative">
                    <Input
                      defaultValue="chrisshzhuu@gmail.com"
                      className="bg-gray-300 border-0 text-gray-800 text-xl py-4 pr-14 rounded-full w-full"
                      readOnly
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 h-10 w-10"
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-3">
                  <Label className="text-xl font-medium text-mcmaster-maroon">Password</Label>
                  <div className="relative">
                    <Input
                      type="password"
                      defaultValue="password123"
                      className="bg-gray-300 border-0 text-gray-800 text-xl py-4 pr-14 rounded-full w-full"
                      readOnly
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 h-10 w-10"
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Profile Picture Section */}
              <div className="col-span-1 flex flex-col items-center justify-start space-y-8 pt-4">
                <div className="relative">
                  <div className="w-60 h-60 rounded-full border-8 border-mcmaster-maroon bg-gray-300 flex items-center justify-center overflow-hidden">
                    <Avatar className="w-full h-full">
                      <AvatarFallback className="bg-gray-400 text-gray-600">
                        <User className="w-28 h-28" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <Button className="bg-mcmaster-maroon hover:bg-mcmaster-light text-white px-10 py-4 rounded-full text-lg font-semibold">
                  CHANGE PHOTO
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

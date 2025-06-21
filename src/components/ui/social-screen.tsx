"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dumbbell, Users, History, User } from "lucide-react"
import Link from "next/link"

interface LeaderboardUser {
  rank: number
  username: string
  points: number
  avatar: string
}

const topUsers: LeaderboardUser[] = [
  { rank: 1, username: "@chris", points: 240039, avatar: "/avatars/chris.png" },
  { rank: 2, username: "@_liyxiao", points: 18394, avatar: "/avatars/li.png" },
  { rank: 3, username: "@jeff", points: 12224, avatar: "/avatars/jeff.png" },
]

const leaderboardUsers: Omit<LeaderboardUser, "avatar">[] = [
  { rank: 4, username: "@insertname", points: 11002 },
  { rank: 5, username: "@insertname", points: 8192 },
  { rank: 6, username: "@insertname", points: 7337 },
  { rank: 7, username: "@insertname", points: 5323 },
]

export default function SocialScreen() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-mcmaster-maroon px-8 py-4 flex justify-end">
        <Link href="/Profile" passHref>
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-gray-300 text-gray-600">
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-bold text-mcmaster-maroon mb-2">Social</h1>
          <p className="text-xl text-gray-600 mb-12">Monthly Global Leaderboard</p>

          {/* Top 3 Users */}
          <div className="flex justify-center items-end gap-8 mb-16">
            {/* 2nd Place */}
            <div className="text-center">
              <Avatar className="w-32 h-32 border-8 border-gray-400">
                <AvatarImage src={topUsers[1].avatar} />
                <AvatarFallback>
                  <User className="w-16 h-16" />
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 bg-mcmaster-maroon text-white rounded-full px-6 py-3">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold">2</span>
                  <div>
                    <div className="font-semibold text-lg">{topUsers[1].username}</div>
                    <div className="text-white/80 italic">{topUsers[1].points.toLocaleString()} Points</div>
                  </div>
                </div>
              </div>
            </div>
            {/* 1st Place */}
            <div className="text-center">
              <Avatar className="w-40 h-40 border-8 border-yellow-400">
                <AvatarImage src={topUsers[0].avatar} />
                <AvatarFallback>
                  <User className="w-20 h-20" />
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 bg-mcmaster-maroon text-white rounded-full px-6 py-3">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold">1</span>
                  <div>
                    <div className="font-semibold text-xl">{topUsers[0].username}</div>
                    <div className="text-white/80 italic">{topUsers[0].points.toLocaleString()} Points</div>
                  </div>
                </div>
              </div>
            </div>
            {/* 3rd Place */}
            <div className="text-center">
              <Avatar className="w-32 h-32 border-8 border-yellow-600">
                <AvatarImage src={topUsers[2].avatar} />
                <AvatarFallback>
                  <User className="w-16 h-16" />
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 bg-mcmaster-maroon text-white rounded-full px-6 py-3">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold">3</span>
                  <div>
                    <div className="font-semibold text-lg">{topUsers[2].username}</div>
                    <div className="text-white/80 italic">{topUsers[2].points.toLocaleString()} Points</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 px-6 py-3 text-gray-600 font-medium text-lg">
              <div>User</div>
              <div className="text-center">Rank</div>
              <div className="text-right">Total Points</div>
            </div>

            {/* Leaderboard Rows */}
            {leaderboardUsers.map((user) => (
              <div key={user.rank} className="bg-gray-300 rounded-full px-6 py-4 grid grid-cols-3 gap-4 items-center">
                <div className="text-gray-800 font-medium flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600" />
                  {user.username}
                </div>
                <div className="text-center text-gray-700 font-semibold">{user.rank}</div>
                <div className="text-right text-gray-600 italic">{user.points.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


import React from "react";
import { Avatar, AvatarFallback } from "./avatar";
import { User } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <div className="bg-mcmaster-maroon px-8 py-4 flex justify-end">
      <Link href="/Profile">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-gray-300 text-gray-600">
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      </Link>
    </div>
  );
}

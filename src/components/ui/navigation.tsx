"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navigation() {
  const navItems = ["Social"];

  const router = useRouter();

  const handleRedirect = (name: string) => {
    router.push("/" + name);
  };
  const handleProfileRedirect = () => {
    router.push("/Profile");
  };
  return (
    <nav className="bg-mcmaster-maroon shadow-lg relative z-40">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end py-4">
          {/* ✅ Navigation links on left */}
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

          <div className="flex items-center gap-3 ml-4">
            {/* ✅ Logo and Profile button on right */}
            <button
              onClick={handleProfileRedirect}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-mcmaster-maroon font-bold hover:scale-110 transition-transform duration-300"
              title="Profile"
            >
              👤
            </button>
            <Image
              src="/IMlogo.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-contain"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

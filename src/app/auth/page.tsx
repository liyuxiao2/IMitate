"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/ui/navigation";
import { supabase } from "@/lib/supabaseClient";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignUp = async () => {
    setError(null);
    setMessage(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: username,
        },
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for the confirmation link!");
    }
  };

  const handleLogin = async () => {
    setError(null);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage("Logged in successfully! Redirecting...");
      // You can redirect the user here, e.g., router.push('/chat')
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-sm rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <Input
                name="fullName"
                type="text"
                placeholder="Full Name"
                required
                className="bg-white/50 border-0 placeholder-gray-600 text-black"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                name="username"
                type="text"
                placeholder="Username"
                required
                className="bg-white/50 border-0 placeholder-gray-600 text-black"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </>
          )}
          <Input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="bg-white/50 border-0 placeholder-gray-600 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="bg-white/50 border-0 placeholder-gray-600 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {message && <p className="text-green-300 text-sm">{message}</p>}
          <Button
            type="submit"
            className="w-full bg-white text-blue-600 hover:bg-gray-200"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </Button>
        </form>
        <p className="text-center text-white mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold hover:underline focus:outline-none"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default function AuthPage() {
  return (
    <div className="bg-gradient-to-br from-[#e66465] to-[#9198e5] min-h-screen flex flex-col">
      <Navigation />
      <AuthForm />
    </div>
  );
}

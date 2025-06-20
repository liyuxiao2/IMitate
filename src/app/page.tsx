"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Bot, Send, Mic, MicOff } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hello! I'm IMitate, your medical education assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addMessage = (type: "user" | "bot", content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const generateBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()

    // Simple response logic - you can expand this
    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      return "Hello! How can I assist you with your medical education today?"
    } else if (lowerInput.includes("help")) {
      return "I'm here to help with medical education topics. You can ask me about symptoms, diagnoses, medical procedures, or general medical knowledge."
    } else if (lowerInput.includes("symptom")) {
      return "I can help you understand various symptoms and their potential causes. What specific symptoms would you like to discuss?"
    } else if (lowerInput.includes("diagnosis")) {
      return "Diagnosis is a crucial skill in medicine. Would you like to practice with a case study or learn about diagnostic approaches?"
    } else if (lowerInput.includes("thank")) {
      return "You're welcome! I'm always here to help with your medical education journey."
    } else {
      return "That's an interesting question! Could you provide more details so I can give you a more specific answer?"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    addMessage("user", input)
    const userInput = input
    setInput("")

    // Show typing indicator
    setIsTyping(true)

    // Simulate bot thinking time
    setTimeout(
      () => {
        const response = generateBotResponse(userInput)
        addMessage("bot", response)
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">IMitate</h1>
            <p className="text-sm text-gray-600">Medical Education Assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              {message.type === "bot" && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
              )}
              <div
                className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-2xl ${
                  message.type === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-white border border-gray-200 rounded-bl-md"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {message.type === "user" && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about medical education..."
                className="pr-12 py-3 text-sm resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                disabled={isTyping}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setIsListening(!isListening)}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button type="submit" size="icon" className="h-10 w-10" disabled={!input.trim() || isTyping}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  Bot,
  Send,
  Mic,
  MicOff,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import startSpeechRecognition from "./voice";
import Sidebar from "@/components/ui/sidebar";
import { loadPatient, Patient } from "./loadPatient";
import CountdownTimer from "@/components/ui/timer";

import Header from "@/components/ui/header";
import { supabase } from "@/lib/supabaseClient";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}



export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "...",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [patientContext, setPatientContext] = useState<string>("");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [aftercareInput, setAftercareInput] = useState("");
  const [viewMode, setViewMode] = useState<"chat" | "results">("chat");
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);
  const [evaluationScore, setEvaluationScore] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);

  useEffect(() => {
    loadPatient({
      setPatient,
      setPatientContext,
      setDoctorNotes,
      setIsModalOpen,
      setDiagnosisInput,
      setAftercareInput,
      setMessages,
      setIsIntroModalOpen,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (type: "user" | "bot", content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const fetchGeminiResponse = async (userInput: string): Promise<string> => {
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userInput }),
      });

      if (!res.ok) throw new Error("Gemini API error");

      const data = await res.json();
      return data.reply || "Sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Error calling FastAPI:", error);
      return "Oops! Something went wrong.";
    }
  };

  const handleMicClick = async () => {
    if (isListening) return; // Already listening, block further clicks

    setIsListening(true); // 🔴 Show mic is on immediately

    try {
      const transcript = await startSpeechRecognition(
        () => console.log("Speech started"),
        () => {
          console.log("Speech ended");
          setIsListening(false); // 🔵 Show mic is off when done
        }
      );

      if (transcript.trim()) {
        setInput(transcript); // 💬 Put transcript into input box
        setIsListening(false);
      }
    } catch (error) {
      setIsListening(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    addMessage("user", input);
    const userInput = input;
    setInput("");

    // Show typing indicator
    setIsTyping(true);

    try {
      const prompt = patientContext
        ? `${patientContext}\n\nUser: ${userInput}`
        : userInput;
      const response = await fetchGeminiResponse(prompt);
      addMessage("bot", response);
    } catch {
      addMessage("bot", "Sorry, something went wrong.");
    } finally {
      setIsTyping(false);
    }
  };

  const getChatHistory = () => {
    return messages
      .map((msg) => `${msg.type === "user" ? "User" : "Bot"}: ${msg.content}`)
      .join("\n");
  };

  const handleBeginCheckup = () => {
    setIsIntroModalOpen(false);
    setMessages([
      {
        id: Date.now().toString(),
        type: "bot",
        content:
          "The patient is ready for you. You can start by asking a question.",
        timestamp: new Date(),
      },
    ]);
  };

   const handleStartNewCase = () => {
    setViewMode("chat");
    setEvaluationResult(null);
    setEvaluationScore(0);
    // loadPatient will handle resetting all other relevant states
    loadPatient({
      setPatient,
      setPatientContext,
      setDoctorNotes,
      setIsModalOpen,
      setDiagnosisInput,
      setAftercareInput,
      setMessages,
      setIsIntroModalOpen, // ✅ now required
    });
  }

  const handleSubmitDiagnosis = async (score: number) => {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      console.log("Submitting score:", score);

      try {
        const res = await fetch("http://localhost:8000/addScore", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ score: score })
        });

        if (!res.ok) {
          throw new Error("Failed to update score");
        }

        const result = await res.json();
        console.log("Score updated successfully:", result);
      } catch (err) {
        console.error("Error adding score:", err);
      }
  }

  

  return (
    <div className="flex h-screen bg-stone-200 font-sans">
      {/* Modals and Overlays */}
      {isEvaluating && (
        <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex flex-col items-center justify-center">
          <Bot className="w-16 h-16 text-[#7a003c] animate-pulse" />
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Evaluating your performance...
          </p>
        </div>
      )}

      {isIntroModalOpen && patient && (
        <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-100 p-8 rounded-xl shadow-xl w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-6 text-[#7a003c]">
              New Patient Case
            </h2>
            <div className="text-left space-y-3 mb-8 text-gray-700">
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {patient.first_name} {patient.last_name}
              </p>
              <p>
                <span className="font-semibold">Age:</span> {patient.age}
              </p>
              <p>
                <span className="font-semibold">Sex:</span> {patient.sex}
              </p>
              <p>
                <span className="font-semibold">Vitals:</span> H:{" "}
                {patient.height_cm}cm, W: {patient.weight_kg}kg, T:{" "}
                {patient.temp_c}°C, HR: {patient.heart_rate_bpm}bpm
              </p>
              <p>
                <span className="font-semibold">Chief Complaint:</span>{" "}
                {patient.primary_complaint}
              </p>
            </div>
            <Button
              onClick={handleBeginCheckup}
              size="lg"
              className="w-full bg-[#7a003c] hover:bg-[#5d002e] text-white"
            >
              Begin Checkup
            </Button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-stone-900/70 backdrop-blur-sm z-40 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-stone-100 rounded-xl shadow-xl w-full max-w-lg z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center bg-[#7a003c] p-4 text-white">
              <h2 className="text-xl font-bold">Edit Diagnosis & Aftercare</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                if (!patient) {
                  console.error(
                    "Cannot submit evaluation without a loaded patient."
                  );
                  setIsModalOpen(false);
                  return;
                }

                setIsModalOpen(false);
                setIsEvaluating(true);

                const chatHistory = getChatHistory();
                const evaluationData = {
                  patientData: patient,
                  chatHistory: chatHistory,
                  submittedDiagnosis: diagnosisInput,
                  submittedAftercare: aftercareInput,
                };

                try {
                  console.log("Submitting for evaluation...", evaluationData);
                  const res = await fetch("http://localhost:8000/evaluate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(evaluationData),
                  });

                  if (!res.ok) {
                    throw new Error(`Evaluation API error: ${res.status}`);
                  }

                  const result = await res.json();
                  setEvaluationResult(result.evaluation);
                  setEvaluationScore(result.score);
                  
                  handleSubmitDiagnosis(result.score);
                  setViewMode("results");
                } catch (error) {
                  console.error("Failed to submit evaluation:", error);
                  // Optionally, show an alert to the user here
                } finally {
                  setIsEvaluating(false);
                }
              }}
            >
              <div className="space-y-4 p-6">
                <div>
                  <label
                    htmlFor="diagnosis"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Diagnosis
                  </label>
                  <textarea
                    id="diagnosis"
                    value={diagnosisInput}
                    onChange={(e) => setDiagnosisInput(e.target.value)}
                    rows={3}
                    className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-[#7a003c] focus:border-[#7a003c]"
                    placeholder="Enter the diagnosis..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="aftercare"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Aftercare
                  </label>
                  <textarea
                    id="aftercare"
                    value={aftercareInput}
                    onChange={(e) => setAftercareInput(e.target.value)}
                    rows={5}
                    className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-[#7a003c] focus:border-[#7a003c]"
                    placeholder="Provide aftercare instructions..."
                  />
                </div>
              </div>
              <div className="flex justify-end bg-stone-200 p-4">
                <Button
                  type="submit"
                  className="bg-[#7a003c] hover:bg-[#5d002e] text-white"
                >
                  Submit Diagnosis
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          {viewMode === "chat" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Column */}
              <div className="lg:col-span-2 flex flex-col h-[calc(100vh-10rem)]">
                <div className="bg-[#7a003c] text-white font-semibold py-2 px-4 rounded-t-xl">
                  Chat
                </div>
                <ScrollArea className="flex-1 bg-stone-100 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.type === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {message.type === "bot" && (
                          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-[#7a003c]" />
                          </div>
                        )}
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow ${
                            message.type === "user"
                              ? "bg-[#7a003c] text-white rounded-br-none"
                              : "bg-white text-gray-800 rounded-bl-none"
                          }`}
                        >
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        </div>
                        {message.type === "user" && (
                          <div className="w-8 h-8 rounded-full bg-[#7a003c] flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-[#7a003c]" />
                        </div>
                        <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow">
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
                <div className="bg-stone-100 p-4 rounded-b-xl">
                  <form onSubmit={handleSubmit} className="flex gap-3">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Start Typing..."
                      className="flex-1 bg-white border-gray-300 rounded-full"
                      disabled={isTyping}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={handleMicClick}
                    >
                      {isListening ? (
                        <Mic className="w-4 h-4" />
                      ) : (
                        <MicOff className="w-4 h-4" />
                      )}

                    </Button>
                    <Button
                      type="submit"
                      size="icon"
                      className="rounded-full bg-[#7a003c] hover:bg-[#5d002e] text-white"
                      disabled={!input.trim() || isTyping}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </div>

              {/* Patient Info & Notes Column */}
              <div className="lg:col-span-1 space-y-6">
                {/* Timer */}
                
                <div className="bg-transparent rounded-xl">
                  <div className="bg-[#7a003c] text-white font-semibold py-2 px-4 rounded-t-xl">
                    Timer
                  </div>

                  <CountdownTimer
                      seconds={600}
                      onTimeout={() => {
                        setIsTyping(true);       
                        setIsListening(false);
                        setEvaluationResult("❌ You ran out of time.")
                      }}
                      
                    />
                </div>

                {/* Patient Info */}
                <div className="bg-transparent rounded-xl">
                  <div className="bg-[#7a003c] text-white font-semibold py-2 px-4 rounded-t-xl">
                    Patient Information
                  </div>
                  <div className="bg-stone-100 p-4 rounded-b-xl">
                    {patient ? (
                      <div className="space-y-2 text-sm text-gray-700">
                        <p>
                          <span className="font-semibold">Name:</span>{" "}
                          {patient.first_name} {patient.last_name}
                        </p>
                        <p>
                          <span className="font-semibold">Age:</span>{" "}
                          {patient.age}
                        </p>
                        <p>
                          <span className="font-semibold">Sex:</span>{" "}
                          {patient.sex} ({patient.pronouns})
                        </p>
                        <p>
                          <span className="font-semibold">Vitals:</span> H:{" "}
                          {patient.height_cm}cm, W: {patient.weight_kg}kg, T:{" "}
                          {patient.temp_c}°C, HR: {patient.heart_rate_bpm}bpm
                        </p>
                        <p>
                          <span className="font-semibold">
                            Chief Complaint(s):
                          </span>{" "}
                          {patient.primary_complaint}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No patient loaded. Click the button above to start.
                      </p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-transparent rounded-xl">
                  <div className="bg-[#7a003c] text-white font-semibold py-2 px-4 rounded-t-xl">
                    Notes
                  </div>
                  <div className="bg-stone-100 p-4 rounded-b-xl">
                    <textarea
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      placeholder="Start Typing..."
                      className="w-full h-32 p-2 bg-stone-100 border-none rounded-md text-sm focus:ring-0"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-[#7a003c] hover:bg-[#5d002e] text-white"
                  disabled={!patient}
                >
                  Edit Diagnosis
                </Button>
              </div>
            </div>
          ) : (
            // Results View
            <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
              <h1 className="text-3xl font-bold mb-4">Evaluation Results</h1>
              <div className="bg-white p-6 rounded-lg shadow-md prose max-w-none">
                {evaluationResult ? (
                  <ReactMarkdown>{evaluationResult}</ReactMarkdown>
                ) : (
                  <p>No evaluation available.</p>
                )}
              </div>
              <div className="mt-8 text-center">
                <Button onClick={handleStartNewCase}>Start New Case</Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
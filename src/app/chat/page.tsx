"use client";

import type React from "react";
import Image from "next/image";

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
  Stethoscope,
  X,
  Book,
  History,
  Users,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import startSpeechRecognition from "./voice";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

// Add Patient interface
interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  sex: string;
  pronouns: string;
  height_cm: number | null;
  weight_kg: number | null;
  temp_c: number | null;
  heart_rate_bpm: number | null;
  primary_complaint: string;
  personality: string;
  symptoms: string;
  medical_history: string;
  correct_diagnosis: string;
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
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);

  useEffect(() => {
    loadPatient();
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
    // loadPatient will handle resetting all other relevant states
    loadPatient();
  };

  // Function to load patient data from backend
  const loadPatient = async () => {
    console.log("Load Patient button pressed – starting fetch...");
    setDoctorNotes(""); // Clear notes for new patient
    setIsModalOpen(false); // Ensure modal is closed
    setDiagnosisInput(""); // Clear previous diagnosis
    setAftercareInput(""); // Clear previous aftercare
    try {
      const res = await fetch(`http://localhost:8000/patients/random`);
      console.log("Fetch completed with status", res.status);
      const data = await res.json();
      console.log("Received data:", data);

      if (data) {
        setPatient(data.patient);
        // ✅ Construct context string (used for chat prompts)
        console.log(patient);

        if (data && Array.isArray(data.patient)) {
          const patientObj: Patient = {
            id: data.patient[0],
            first_name: data.patient[1],
            last_name: data.patient[2],
            age: data.patient[3],
            sex: data.patient[4],
            pronouns: data.patient[5],
            height_cm: data.patient[6],
            weight_kg: data.patient[7],
            temp_c: data.patient[8],
            heart_rate_bpm: data.patient[9],
            primary_complaint: data.patient[10],
            personality: data.patient[11],
            symptoms: data.patient[12],
            medical_history: data.patient[13],
            correct_diagnosis: data.patient[14],
          };

          setPatient(patientObj);

          const contextString = `
              Patient Details:
              Name: ${patientObj.first_name} ${patientObj.last_name}
              Age: ${patientObj.age}
              Sex: ${patientObj.sex}
              Pronouns: ${patientObj.pronouns}
              Height: ${patientObj.height_cm} cm
              Weight: ${patientObj.weight_kg} kg
              Temperature: ${patientObj.temp_c} C
              Heart Rate: ${patientObj.heart_rate_bpm} bpm
              Primary Complaint: ${patientObj.primary_complaint}
              Symptoms: ${patientObj.symptoms}
              Personality: ${patientObj.personality}
              Medical History: ${patientObj.medical_history}
            `.trim();

          setPatientContext(contextString);
          setMessages([]); // Clear chat history
          setIsIntroModalOpen(true); // Open the intro modal
        }
        setMessages([
          {
            id: Date.now().toString(),
            type: "bot",
            content: "Patient loaded. How can I assist you with this case?",
            timestamp: new Date(),
          },
        ]);
      } else {
        console.warn("No patients found in response.");
      }
    } catch (err) {
      console.error("Failed to load patient", err);
    }
  };

  const logFullDatabase = async () => {
    try {
      console.log("Fetching full database from /patients...");
      const res = await fetch("http://localhost:8000/patients");
      const data = await res.json();
      console.log("--- Full Database Content ---");
      console.table(data.patients); // Using console.table for better readability
      console.log("---------------------------");
    } catch (error) {
      console.error("Failed to fetch database:", error);
    }
  };

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

      {/* Sidebar */}
      <aside className="w-60 bg-[#5d002e] text-white flex flex-col">
        <div className="p-5 border-b border-white/10">
          <Image src="/IMlogo.png" alt="IMitate Logo" width={100} height={40} />
        </div>
        <nav className="flex-1 p-3 space-y-2">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium bg-white/10"
          >
            <Stethoscope className="w-5 h-5" /> Practice
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10"
          >
            <Users className="w-5 h-5" /> Social
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10"
          >
            <History className="w-5 h-5" /> History
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex justify-end items-center px-6">
          <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
        </header>

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

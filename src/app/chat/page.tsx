"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Bot, Send, Mic, MicOff, Stethoscope, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

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

  useEffect(() => {
    // Automatically load a patient when the component mounts
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
          const patientObj = {
            id: data.patient[0],
            first_name: data.patient[1],
            last_name: data.patient[2],
            age: data.patient[3],
            sex: data.patient[4],
            pronouns: data.patient[5],
            primary_complaint: data.patient[6],
            personality: data.patient[7],
            symptoms: data.patient[8],
            medical_history: data.patient[9],
            correct_diagnosis: data.patient[10],
          };

          setPatient(patientObj);

          const contextString = `
              Patient Details:
              Name: ${patientObj.first_name} ${patientObj.last_name}
              Age: ${patientObj.age}
              Sex: ${patientObj.sex}
              Pronouns: ${patientObj.pronouns}
              Primary Complaint: ${patientObj.primary_complaint}
              Symptoms: ${patientObj.symptoms}
              Personality: ${patientObj.personality}
              Medical History: ${patientObj.medical_history}
            `.trim();

          setPatientContext(contextString);
          setMessages([
            {
              id: Date.now().toString(),
              type: "bot",
              content: "Patient loaded. How can I assist you with this case?",
              timestamp: new Date(),
            },
          ]);
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">IMitate</h1>
              <p className="text-sm text-gray-600">
                Medical Education Assistant
              </p>
            </div>
          </div>
        </div>
      </div>

      {isEvaluating && (
        <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex flex-col items-center justify-center">
          <Bot className="w-16 h-16 text-blue-600 animate-pulse" />
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Evaluating your performance...
          </p>
        </div>
      )}

      {viewMode === "chat" ? (
        <>
          {/* Main Content: Chat + Patient Panel */}
          <div className="flex flex-1 overflow-hidden max-w-6xl mx-auto w-full">
            {/* Chat Section */}
            <div className="flex flex-col flex-1">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
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
                        <div className="prose prose-sm text-black max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        <p className="text-xs mt-1 opacity-70 text-black">
                          {message.timestamp.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "UTC",
                          })}
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
                      {isListening ? (
                        <MicOff className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      type="submit"
                      size="icon"
                      className="h-10 w-10"
                      disabled={!input.trim() || isTyping}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Patient Panel */}
            <div className="w-96 border-l border-gray-200 bg-white p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" /> Patient Info
                </h2>
                <Button size="sm" onClick={loadPatient}>
                  Load Patient
                </Button>
              </div>

              {patient ? (
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {patient.first_name} {patient.last_name}
                  </p>
                  <p>
                    <span className="font-medium">Age:</span> {patient.age}
                  </p>
                  <p>
                    <span className="font-medium">Sex:</span> {patient.sex} (
                    {patient.pronouns})
                  </p>
                  <p>
                    <span className="font-medium">Chief Complaint:</span>{" "}
                    {patient.primary_complaint}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button
                      size="sm"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full"
                    >
                      Edit Diagnosis
                    </Button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="font-semibold text-base mb-2">
                      Doctor's Notes
                    </h3>
                    <textarea
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      placeholder="Type your notes here..."
                      className="w-full h-32 p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No patient loaded. Click "Load Patient" to fetch one.
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
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

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-40 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Diagnosis & Aftercare</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
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
              <div className="space-y-4">
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Provide aftercare instructions..."
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button type="submit">Submit Diagnosis</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

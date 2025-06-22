"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, ChevronDown } from "lucide-react";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import { supabase } from "@/lib/supabaseClient";

interface HistoryEntry {
  id: number;
  user_id: string;
  patient_info: {
    first_name: string;
    last_name: string;
    [key: string]: any;
  };
  score: number;
  submitted_diagnosis: string;
  submitted_aftercare: string;
  feedback: string;
  created_at: string;
}

interface CaseHistory {
  patientName: string;
  diagnosis: string;
  score: string;
  date: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<CaseHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistory = async () => {
      console.log("🔄 Starting fetchHistory…");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Session object:", session);

      const token = session?.access_token;
      if (!token) {
        console.error("No authenticated session.");
        setLoading(false);
        return;
      }
      console.log("Access token:", token);

      try {
        const res = await fetch("http://localhost:8000/fetchHistory", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Raw response status:", res.status, res.statusText);

        if (!res.ok) {
          const text = await res.text();
          console.error("Server error body:", text);
          throw new Error(`Error ${res.status} – ${text}`);
        }

        const data: HistoryEntry[] = await res.json();
        console.log("✅ Fetched data:", data);

        // Transform into CaseHistory
        const transformed: CaseHistory[] = data.map((entry) => ({
          patientName: `${entry.patient_info.first_name} ${entry.patient_info.last_name}`,
          diagnosis: entry.submitted_diagnosis,
          score: `${entry.score}/50`,
          date: new Date(entry.created_at).toLocaleDateString(),
        }));
        console.log("📝 Transformed history:", transformed);

        setHistory(transformed);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
        console.log("⏹️ fetchHistory finished; loading =", false);
      }
    };

    fetchHistory();
  }, []);

  // Log whenever history state updates
  useEffect(() => {
    console.log("📋 history state now:", history);
  }, [history]);

  return (
    <div className="min-h-screen bg-gray-200 flex">
      <Sidebar activePage="History" />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-12">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl font-bold text-mcmaster-maroon mb-2">
              History
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              View your past cases and feedback
            </p>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-mcmaster-maroon text-white">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold">
                      Patient Name
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Your Diagnosis
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">Score</th>
                    <th className="py-4 px-6 text-left font-semibold">Date</th>
                    <th className="py-4 px-6 text-left font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-4 px-6 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : history.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 px-6 text-center">
                        No history found.
                      </td>
                    </tr>
                  ) : (
                    history.map((item, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-200 hover:bg-gray-100"
                      >
                        <td className="py-4 px-6">{item.patientName}</td>
                        <td className="py-4 px-6 font-medium">
                          {item.diagnosis}
                        </td>
                        <td className="py-4 px-6">{item.score}</td>
                        <td className="py-4 px-6">{item.date}</td>
                        <td className="py-4 px-6">
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

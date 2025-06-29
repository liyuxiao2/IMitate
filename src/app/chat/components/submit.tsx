"use client";


import { supabase } from "@/lib/supabaseClient";
import { apiEndpoints } from "@/lib/apiConfig";
import { Patient } from "../page";

export async function handleSubmitDiagnosis(
  token: string,
  patient: Patient,
  diagnosisInput: string,
  aftercareInput: string,
  score: number,
  feedbackText: string,
  time: number
) {
  try {
    const res = await fetch(apiEndpoints.addScore, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ score }),
    });

    if (!res.ok) {
      throw new Error("Failed to update score");
    }

    const result = await res.json();
    console.log("Score updated successfully:", result);
  } catch (err) {
    console.error("Error adding score:", err);
  }

  try {
    const res = await fetch(apiEndpoints.addMatch, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        patient_info: patient,
        submitted_diagnosis: diagnosisInput,
        submitted_aftercare: aftercareInput,
        score,
        feedback: feedbackText ?? "No History Saved",
        time: time
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to update matches");
    }
  } catch (err) {
    console.error("Error adding match:", err);
  }
}


export async function submitEvaluation(
  e: React.FormEvent,
  {
    patient,
    diagnosisInput,
    aftercareInput,
    timeLeft,
    getChatHistory,
    setIsModalOpen,
    setIsEvaluating,
    setEvaluationResult,
    setEvaluationScore,
    setViewMode,
  }: {
    patient: Patient;
    diagnosisInput: string;
    aftercareInput: string;
    timeLeft: number;
    getChatHistory: () => string;
    setIsModalOpen: (val: boolean) => void;
    setIsEvaluating: (val: boolean) => void;
    setEvaluationResult: (val: string) => void;
    setEvaluationScore: (val: number) => void;
    setViewMode: React.Dispatch<React.SetStateAction<"chat" | "results">>;
  }
) {
  e.preventDefault();

  if (!patient) {
    console.error("Cannot submit evaluation without a loaded patient.");
    setIsModalOpen(false);
    return;
  }

  setIsModalOpen(false);
  setIsEvaluating(true);

  const chatHistory = getChatHistory();
  const evaluationData = {
    patientData: patient,
    chatHistory,
    submittedDiagnosis: diagnosisInput,
    submittedAftercare: aftercareInput,
    timeLeft: timeLeft
  };

  try {
    console.log("Submitting for evaluation...", evaluationData);
    const res = await fetch(apiEndpoints.evaluate, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evaluationData),
    });

    if (!res.ok) {
      throw new Error(`Evaluation API error: ${res.status}`);
    }

    const result = await res.json();
    const feedbackText = result.evaluation;
    const score = result.score;

    setEvaluationResult(feedbackText);
    setEvaluationScore(score);

    const token = (await supabase.auth.getSession()).data.session?.access_token;
    if (token) {
      await handleSubmitDiagnosis(
        token,
        patient,
        diagnosisInput,
        aftercareInput,
        score,
        feedbackText,
        timeLeft
      );
    }

    setViewMode("results");
  } catch (error) {
    console.error("Failed to submit evaluation:", error);
  } finally {
    setIsEvaluating(false);
  }
}


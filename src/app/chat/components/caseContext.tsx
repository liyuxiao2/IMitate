"use client";
import React, { createContext, useContext, useState } from "react";
import { Patient } from "@/types/chat";

type CaseState = {
  patient: Patient | null;
  setPatient: React.Dispatch<React.SetStateAction<Patient | null>>;
  patientContext: string;
  setPatientContext: (s: string) => void;
  doctorNotes: string;
  setDoctorNotes: (s: string) => void;
};

const CaseContext = createContext<CaseState | null>(null);

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [patientContext, setPatientContext] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");

  return (
    <CaseContext.Provider
      value={{
        patient,
        setPatient,
        patientContext,
        setPatientContext,
        doctorNotes,
        setDoctorNotes,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = () => {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error("useCase must be used within CaseProvider");
  return ctx;
};

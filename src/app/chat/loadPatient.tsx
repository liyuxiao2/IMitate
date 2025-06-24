// loadPatient.ts
import { apiEndpoints } from "@/lib/apiConfig";

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  sex: string;
  pronouns: string;
  height_cm: number;
  weight_kg: number;
  temp_c: number;
  heart_rate_bpm: number;
  primary_complaint: string;
  personality: string;
  symptoms: string;
  medical_history: string;
  correct_diagnosis: string;
}

interface LoadPatientParams {
  setPatient: (p: Patient) => void;
  setPatientContext: (c: string) => void;
  setDoctorNotes: (n: string) => void;
  setIsModalOpen: (b: boolean) => void;
  setDiagnosisInput: (s: string) => void;
  setAftercareInput: (s: string) => void;
  setMessages: (
    m: Array<{
      id: string;
      type: "user" | "bot";
      content: string;
      timestamp: Date;
    }>,
  ) => void;
  setIsIntroModalOpen: (b: boolean) => void;
}

export async function loadPatient({
  setPatient,
  setPatientContext,
  setDoctorNotes,
  setIsModalOpen,
  setDiagnosisInput,
  setAftercareInput,
  setMessages,
  setIsIntroModalOpen,
}: LoadPatientParams) {
  console.log("Load Patient button pressed – starting fetch...");
  setDoctorNotes("");
  setIsModalOpen(false);
  setDiagnosisInput("");
  setAftercareInput("");

  try {
    console.log("Fetching patient from:", apiEndpoints.getRandomPatient);
    const res = await fetch(apiEndpoints.getRandomPatient);
    console.log("Fetch completed with status", res.status);
    const data = await res.json();
    console.log("Received data:", data);

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
}

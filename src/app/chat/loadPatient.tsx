// loadPatient.ts
import { apiEndpoints } from "@/lib/apiConfig";
import { supabase } from "@/lib/supabaseClient";

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
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    const res = await fetch(apiEndpoints.getRandomPatient, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Fetch completed with status", res.status);
    const data = await res.json();
    console.log("Received data:", data);

    // **Handle object shape directly**:
    if (data && data.id) {
      const patientObj: Patient = {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        age: data.age,
        sex: data.sex,
        pronouns: data.pronouns,
        height_cm: data.height_cm,
        weight_kg: data.weight_kg,
        temp_c: data.temp_c,
        heart_rate_bpm: data.heart_rate_bpm,
        primary_complaint: data.primary_complaint,
        personality: data.personality,
        symptoms: data.symptoms,
        medical_history: data.medical_history,
        correct_diagnosis: data.correct_diagnosis,
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
        Temperature: ${patientObj.temp_c}°C
        Heart Rate: ${patientObj.heart_rate_bpm} bpm
        Primary Complaint: ${patientObj.primary_complaint}
        Symptoms: ${patientObj.symptoms}
        Personality: ${patientObj.personality}
        Medical History: ${patientObj.medical_history}
      `.trim();

      setPatientContext(contextString);
      setMessages([]);
      setIsIntroModalOpen(true);
      setMessages([
        {
          id: Date.now().toString(),
          type: "bot",
          content: "Patient loaded. How can I assist you with this case?",
          timestamp: new Date(),
        },
      ]);

    } else {
      console.warn("Unexpected response shape:", data);
    }
  } catch (err) {
    console.error("Failed to load patient", err);
  }
}
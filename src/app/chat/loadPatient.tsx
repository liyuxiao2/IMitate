// loadPatient.ts
export interface Patient {
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

interface LoadPatientParams {
  setPatient: (p: Patient) => void;
  setPatientContext: (c: string) => void;
  setDoctorNotes: (n: string) => void;
  setIsModalOpen: (b: boolean) => void;
  setDiagnosisInput: (s: string) => void;
  setAftercareInput: (s: string) => void;
  setMessages: (m: any) => void;
}

export async function loadPatient({
  setPatient,
  setPatientContext,
  setDoctorNotes,
  setIsModalOpen,
  setDiagnosisInput,
  setAftercareInput,
  setMessages,
}: LoadPatientParams) {
  console.log("Load Patient button pressed – starting fetch...");
  setDoctorNotes("");
  setIsModalOpen(false);
  setDiagnosisInput("");
  setAftercareInput("");

  try {
    const res = await fetch(`http://localhost:8000/patients/random`);
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
    } else {
      console.warn("No patients found in response.");
    }
  } catch (err) {
    console.error("Failed to load patient", err);
  }
}

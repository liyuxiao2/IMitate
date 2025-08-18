export interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

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

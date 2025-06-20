# 🧬 PatientZero: Clinical Diagnosis Simulator

**PatientZero** is an AI-powered clinical diagnosis simulator designed to train medical students and healthcare learners in diagnostic reasoning through immersive patient interviews. Built on GPT technology, the simulator allows users to question virtual patients via voice or text, arrive at a diagnosis, and receive real-time, rubric-based feedback.

---

## 📌 Purpose

PatientZero bridges the gap between theory and real-world clinical reasoning. It simulates realistic patient encounters, allowing users to:

- Practice OLDCARTS and history-taking
- Test diagnostic reasoning under time pressure
- Receive structured feedback and performance scoring
- Improve both communication and clinical judgment skills

---

## 👥 Target Audience

- Medical students (pre-clerkship and clerkship)
- Physician Assistant (PA) and Nursing students
- MCAT and clinical prep learners
- Medical educators and instructors
- Hackathon judges evaluating AI in education

---

## ⚙️ Core Features

### 🔁 Dual Interaction Modes

- **Text Mode**: Type questions, receive text responses  
- **Voice Mode**: Speak via microphone, receive spoken responses  
- ✅ Seamless mode switching between input styles

### 🧠 GPT-Powered Patient Simulation

- Simulated patients powered by GPT-4o
- Personality-driven, context-aware replies
- Responses limited to patient’s knowledge
- Diagnosis is only revealed when appropriate

### 📄 Structured Cases

Each case contains:

- Patient profile (age, gender, name, setting)
- Presenting complaint
- Hidden diagnosis
- Key expected questions and answers (OLDCARTS, red flags, etc.)
- Grading rubric for evaluation

### 🎯 Scoring System (/50)

- ✅ **25 pts** — Correct diagnosis  
- ✅ **12 pts** — OLDCARTS completeness  
- ✅ **5 pts** — Differential diagnoses  
- ✅ **5 pts** — Associated symptom questions  
- ✅ **4 pts** — History gathering (meds, PMHx, social, family)  
- ✅ **2 pts** — Logical and focused questioning  
- ✅ **2 pts** — Completed in under 10 minutes  

**Feedback tiers** (e.g. *Residency Ready*, *Partial Collapse*) based on performance.

### 📊 Feedback Report

- Breakdown of score with explanations
- Missed questions highlighted
- Retry option or view model answers

---

## 🧑‍💻 Technical Stack

### 🖥️ Frontend

- React.js (chat UI, toggles, timers)
- Web Speech API (voice input)
- `window.speechSynthesis` (text-to-speech)

### 🖧 Backend (Optional)

- Node.js + Express (proxy API keys, manage case data)
- Firebase / Supabase (case storage, progress tracking)
- OpenAI API (GPT simulation, optional Whisper/TTS for audio)

---

## 🧩 Case Engine Design

Each case is stored as a structured object with:

- GPT system prompt
- Answer key (OLDCARTS, red flags, etc.)
- Hidden diagnosis and accepted differentials
- Case ID and metadata (for scoring and randomization)

---

## ♿ Accessibility Features

- Voice and text input/output
- On-screen transcripts and subtitles
- Adjustable speech rate and volume
- Keyboard navigation + ARIA roles for screen readers

---

## 🚀 Stretch Goals

- Multiple patient personas (e.g., anxious, stoic, vague)
- User case builder (custom cases)
- Multiplayer or group-based diagnosis
- Case difficulty levels
- Leaderboard or user progress tracking
- Integration with medical databases (Merck Manual, UptoDate)

---

## 🔄 User Flow

1. User selects interaction mode (text or voice)
2. A patient scenario loads with intro info
3. User interacts with the simulated patient
4. AI responds in-character to questions
5. User submits diagnosis and differentials
6. App scores the attempt and gives feedback
7. User can retry or continue to another case

---

## 🩺 Use Cases

- OSCE / Step 2 CS practice
- Group simulations in classrooms
- Self-study during clinical rotations
- Hackathons showcasing LLMs in medical education

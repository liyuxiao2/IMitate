-- Clear the existing table to ensure a fresh start
DROP TABLE IF EXISTS patient_data;

-- Create the new table schema with additional vitals columns
CREATE TABLE patient_data (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    sex TEXT NOT NULL,
    pronouns TEXT NOT NULL,
    height_cm INTEGER,
    weight_kg INTEGER,
    temp_c REAL,
    heart_rate_bpm INTEGER,
    primary_complaint TEXT NOT NULL,
    personality TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    medical_history TEXT NOT NULL,
    correct_diagnosis TEXT NOT NULL
);

-- Populate the table with 10 realistic patient entries
INSERT INTO patient_data VALUES
('a1', 'John', 'Smith', 28, 'Male', 'he/him', 180, 85, 37.0, 75, 'Twisted ankle playing basketball', 'Athletic and a bit impatient, minimizes pain.', 'Swelling and pain in the right ankle, difficulty bearing weight. Happened 2 hours ago.', 'No significant past medical history. No allergies.', 'Ankle Sprain (Grade II)'),
('a2', 'Maria', 'Garcia', 72, 'Female', 'she/her', 160, 68, 38.1, 110, 'Feeling confused and unwell', 'Pleasant but disoriented to time and place. Daughter is present and concerned.', 'Sudden onset of confusion, frequent and painful urination for 2 days, general weakness.', 'Hypertension, Type 2 Diabetes. Allergic to sulfa drugs.', 'Urinary Tract Infection (UTI) with associated delirium'),
('a3', 'David', 'Chen', 45, 'Male', 'he/him', 175, 95, 37.2, 80, 'Burning feeling in my chest', 'Anxious about symptoms, worries it''s his heart. Works a stressful office job.', 'Burning sensation in the chest, especially after eating spicy food or lying down. Sour taste in mouth. Occurs 3-4 times a week for the last 2 months.', 'Hyperlipidemia. Takes atorvastatin. Social drinker.', 'Gastroesophageal Reflux Disease (GERD)'),
('a4', 'Emily', 'Jones', 19, 'Female', 'she/her', 165, 58, 38.5, 95, 'Sore throat and extreme fatigue', 'College student, worried about missing exams. Appears exhausted.', 'Severe sore throat, swollen glands in neck, profound fatigue for a week. Lost her appetite.', 'No chronic illnesses. Allergic to penicillin (rash).', 'Infectious Mononucleosis'),
('a5', 'Robert', 'Miller', 65, 'Male', 'he/him', 182, 88, 36.9, 68, 'Trouble urinating', 'Stoic and straightforward, a bit embarrassed to discuss the topic.', 'Difficulty starting a stream, weak flow, feeling of incomplete emptying. Wakes up 3-4 times a night to urinate. Worsening over the last year.', 'History of kidney stones 10 years ago. Takes a daily aspirin.', 'Benign Prostatic Hyperplasia (BPH)'),
('a6', 'Jessica', 'Williams', 34, 'Female', 'she/her', 170, 72, 37.0, 72, 'Constant, dull headache', 'Stressed, describes a "band-like" pressure around her head. Works as a lawyer.', 'Headache is present most days for the past month, worse in the afternoons. No nausea or light sensitivity.', 'History of migraines but says this feels different. Drinks 3-4 cups of coffee a day.', 'Tension-Type Headache'),
('a7', 'Leo', 'Brown', 8, 'Male', 'he/him', 130, 28, 38.9, 120, 'My ear really hurts', 'Crying and tugging at his right ear. Mother reports he was up all night.', 'Sudden onset of severe right ear pain, fever. Had a cold for the past few days.', 'Recurrent ear infections as a toddler. Up-to-date on immunizations.', 'Acute Otitis Media'),
('a8', 'Susan', 'Davis', 58, 'Female', 'she/her', 163, 75, 37.1, 85, 'Pain in my right knee', 'Frustrated with chronic pain, walks with a slight limp.', 'Deep, aching pain in the right knee, worse with activity and better with rest. Morning stiffness lasts about 15 minutes. Has been getting worse for years.', 'Meniscus surgery on the same knee 5 years ago. Takes ibuprofen as needed.', 'Osteoarthritis of the Knee'),
('a9', 'Michael', 'Wilson', 40, 'Male', 'he/him', 178, 80, 37.5, 98, 'Vomiting and diarrhea', 'Appears dehydrated and tired. Reports eating at a new restaurant last night.', 'Started with nausea about 12 hours ago, followed by 5 episodes of vomiting and multiple watery bowel movements. Has abdominal cramping.', 'No significant medical history.', 'Acute Gastroenteritis'),
('a10', 'Chloe', 'Taylor', 22, 'Female', 'she/her', 168, 54, 36.8, 105, 'I''m tired all the time', 'Pale and low-energy. Reports feeling breathless when walking up stairs.', 'Progressive fatigue and weakness over the last 3 months. Reports heavy menstrual periods. Craves chewing on ice.', 'Vegetarian for the last 5 years. No other medical issues.', 'Iron-Deficiency Anemia');

import sqlite3
import uuid
from typing import Dict, Any

DATABASE_PATH = "patient_data.db"

def init_database():
    """Initialize the database and create tables"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Create patient_data table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS patient_data (
            id TEXT PRIMARY KEY,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            age INTEGER NOT NULL,
            sex TEXT NOT NULL,
            pronouns TEXT NOT NULL,
            primary_complaint TEXT NOT NULL,
            personality TEXT NOT NULL,
            symptoms TEXT NOT NULL,
            medical_history TEXT NOT NULL,
            correct_diagnosis TEXT NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()

    # Seed the database with sample patients
    seed_database()

def seed_database():
    """Populate the database with initial sample patients (idempotent)."""
    sample_patients = [
        {
            "id": "a1f4d2b0-9e77-4c89-8749-b31f6d8d81af",
            "first_name": "Linda",
            "last_name": "Chow",
            "age": 47,
            "sex": "Female",
            "pronouns": "she/her",
            "primary_complaint": "Sharp upper abdominal pain",
            "personality": "Worried and cooperative, speaks concisely but with urgency. Somewhat health-literate due to working as a pharmacist assistant.",
            "symptoms": "Sharp pain in the upper right abdomen, especially after meals. Nausea, mild fever, and recent vomiting. Symptoms started 2 days ago and have worsened.",
            "medical_history": "Hyperlipidemia diagnosed 3 years ago. No history of surgeries. No smoking or alcohol use. Allergic to penicillin.",
            "correct_diagnosis": "Acute cholecystitis",
        },
        {
            "id": "b2c5e3d1-8f20-4aa6-bb11-92e2c9b6c1d4",
            "first_name": "Mark",
            "last_name": "Singh",
            "age": 29,
            "sex": "Male",
            "pronouns": "he/him",
            "primary_complaint": "Persistent productive cough",
            "personality": "Easy-going but concerned about missing work. Non-smoker, athletic.",
            "symptoms": "Cough with greenish sputum for 8 days, low-grade fever, shortness of breath on exertion.",
            "medical_history": "Seasonal allergies. Childhood asthma (resolved). Up-to-date on vaccinations.",
            "correct_diagnosis": "Community-acquired pneumonia",
        },
        {
            "id": "c3d6f4e2-1a33-48bf-95ec-0f9bd3a72ee1",
            "first_name": "Julia",
            "last_name": "Hernandez",
            "age": 63,
            "sex": "Female",
            "pronouns": "she/her",
            "primary_complaint": "Chest tightness with exertion",
            "personality": "Retired teacher, detail-oriented, expresses anxiety about health.",
            "symptoms": "Central chest pressure radiating to left arm when climbing stairs, relieved by rest. Occasional nausea and diaphoresis.",
            "medical_history": "Type 2 diabetes for 10 years, hypertension, hyperlipidemia. Smoked 1 ppd, quit 5 years ago.",
            "correct_diagnosis": "Stable angina pectoris",
        },
        {
            "id": "d4e7g5h3-2b44-4c9d-aa21-1f08c7f6d4b9",
            "first_name": "Kevin",
            "last_name": "O'Neill",
            "age": 52,
            "sex": "Male",
            "pronouns": "he/him",
            "primary_complaint": "Frequent urination and thirst",
            "personality": "Pragmatic, accountant, concerned about recent weight loss.",
            "symptoms": "Polyuria, polydipsia, unintentional 6-lb weight loss over 4 weeks, blurred vision at times.",
            "medical_history": "BMI 31 kg/m², father with type 2 diabetes. Mild hypertension on lisinopril.",
            "correct_diagnosis": "New-onset type 2 diabetes mellitus",
        },
        {
            "id": "e5f8h6i4-3c55-401e-bd32-2a19d8f7e6ca",
            "first_name": "Sara",
            "last_name": "Ahmed",
            "age": 35,
            "sex": "Female",
            "pronouns": "she/her",
            "primary_complaint": "Recurrent severe headaches",
            "personality": "Software engineer, analytical, keeps a symptom diary.",
            "symptoms": "Unilateral throbbing headaches with photophobia and nausea, lasting 6-12 h, 3–4 times/month.",
            "medical_history": "No chronic illnesses. Mother has migraines. Uses combined oral contraceptive.",
            "correct_diagnosis": "Migraine without aura",
        },
    ]

    # Insert each sample patient
    for patient in sample_patients:
        insert_patient(patient)

def insert_patient(patient_data: Dict[str, Any]):
    """Insert a new patient into the database"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT OR REPLACE INTO patient_data 
        (id, first_name, last_name, age, sex, pronouns, primary_complaint, personality, symptoms, medical_history, correct_diagnosis)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        patient_data['id'],
        patient_data['first_name'],
        patient_data['last_name'],
        patient_data['age'],
        patient_data['sex'],
        patient_data['pronouns'],
        patient_data['primary_complaint'],
        patient_data['personality'],
        patient_data['symptoms'],
        patient_data['medical_history'],
        patient_data['correct_diagnosis']
    ))
    
    conn.commit()
    conn.close()

def get_all_patients():
    """Get all patients from the database"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM patient_data')
    patients = cursor.fetchall()
    
    conn.close()
    return patients

def get_patient_by_id(patient_id: str):
    """Get a specific patient by ID"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM patient_data WHERE id = ?', (patient_id,))
    patient = cursor.fetchone()
    
    conn.close()
    return patient

# Initialize database and insert sample data
if __name__ == "__main__":
    init_database()
    print("Database initialized and seeded with sample patient data!") 
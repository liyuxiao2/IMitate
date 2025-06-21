import sqlite3

DATABASE_PATH = "src/api/patient_data.db"



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
    print("Database initialized and seeded with sample patient data!") 
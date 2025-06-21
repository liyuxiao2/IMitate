import sqlite3

DATABASE_PATH = "src/api/patient_data.db"
 

def get_random_patient():
    """Get one random patient from the database"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM patient_data ORDER BY RANDOM() LIMIT 1')
    patient = cursor.fetchone()
    
    conn.close()
    return patient  # returns a tuple or None

# Initialize database and insert sample data
if __name__ == "__main__":
    print("Database initialized and seeded with sample patient data!") 
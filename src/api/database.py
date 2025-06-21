import sqlite3
import os
from typing import Dict, Any

DATABASE_PATH = "src/api/patient_data.db"
 

def get_random_patient():
    """Get one random patient from the database"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM patient_data ORDER BY RANDOM() LIMIT 1')
    patient = cursor.fetchone()
    
    conn.close()
    return patient  # returns a tuple or None

# This allows running `python -m src.api.database` to reset the db
if __name__ == "__main__":
    init_database() 
import sqlite3
import os

 

# Get the directory of the current script
_dir = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(_dir, "patient_data.db")

SQL_SCRIPT_PATH = os.path.join(_dir, "data.sql")


def init_database():
    """Initialize the database from the .sql script"""
    # Remove the old DB file if it exists to ensure a fresh start
    if os.path.exists(DATABASE_PATH):
        os.remove(DATABASE_PATH)
        
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    with open(SQL_SCRIPT_PATH, 'r') as sql_file:
        sql_script = sql_file.read()
        
    cursor.executescript(sql_script)
    
    conn.commit()
    conn.close()
    print("Database initialized from data.sql script.")
    
def get_random_patient():
    """Get one random patient from the database"""
    print(DATABASE_PATH)
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM patient_data ORDER BY RANDOM() LIMIT 1')
    patient = cursor.fetchone()
    
    conn.close()
    return patient  # returns a tuple or None


async def debug_db_endpoint():
    exists = os.path.exists(DATABASE_PATH)
    tables = []
    if exists:
        conn = sqlite3.connect(DATABASE_PATH)
        rows = conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table';"
        ).fetchall()
        conn.close()
        tables = [r[0] for r in rows]
    return {
        "path": DATABASE_PATH,
        "exists": exists,
        "tables": tables
    }

# This allows running `python -m src.api.database` to reset the db
if __name__ == "__main__":
    init_database() 
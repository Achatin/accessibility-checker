import sqlite3
from pathlib import Path
import datetime

DB_FILE = Path("reports.db")

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            date TEXT NOT NULL,
            total_violations INTEGER NOT NULL,
            format TEXT NOT NULL,
            file_path TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def add_report(url, total_violations, format, file_path):
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO reports (url, date, total_violations, format, file_path) VALUES (?, ?, ?, ?, ?)",
        (url, datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), total_violations, format, str(file_path)),
    )
    conn.commit()
    conn.close()

def load_reports():
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute("SELECT id, url, date, total_violations, format, file_path FROM reports ORDER BY date DESC")
    rows = cur.fetchall()
    conn.close()
    return [
        {"id": r[0], "url": r[1], "date": r[2], "total_violations": r[3], "format": r[4], "file_path": r[5]}
        for r in rows
    ]

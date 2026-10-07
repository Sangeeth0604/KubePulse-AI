import sqlite3
from datetime import datetime

DB_NAME = "campuspulse.db"

def create_table():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pod_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            pod_name TEXT,
            cpu TEXT,
            memory TEXT
        )
    """)

    conn.commit()
    conn.close()


def insert_metric(pod_name, cpu, memory):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO pod_metrics (timestamp, pod_name, cpu, memory)
        VALUES (?, ?, ?, ?)
    """, (datetime.now().isoformat(), pod_name, cpu, memory))

    conn.commit()
    conn.close()


def get_recent_metrics():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT timestamp, pod_name, cpu, memory 
        FROM pod_metrics 
        ORDER BY id DESC 
        LIMIT 50
    """)

    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "timestamp": row[0],
            "pod": row[1],
            "cpu": row[2],
            "memory": row[3]
        }
        for row in rows
    ]
"""
UniTrack — Kaggle Dataset Seeder
Dataset: https://www.kaggle.com/datasets/benroshan/factors-affecting-campus-placement

Usage:
  pip install pandas psycopg2-binary python-dotenv
  kaggle datasets download -d benroshan/factors-affecting-campus-placement
  unzip factors-affecting-campus-placement.zip
  python seed_kaggle.py
"""

import pandas as pd
import psycopg2
import bcrypt
import os
import random
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost/unitrack_db")

BRANCHES   = ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT']
COMPANIES  = ['TCS', 'Infosys', 'Wipro', 'Amazon', 'Google', 'Microsoft',
              'Deloitte', 'L&T', 'Accenture', 'Flipkart', 'HCL', 'Cognizant']
ROLES      = ['Software Engineer', 'Data Analyst', 'Systems Engineer',
              'Product Manager', 'ML Engineer', 'Business Analyst', 'DevOps Engineer']

def get_conn():
    return psycopg2.connect(DATABASE_URL)

def hash_password(plain):
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()

def seed_from_kaggle(csv_path="Placement_Data_Full_Class.csv"):
    print(f"📂 Reading {csv_path} ...")
    df = pd.read_csv(csv_path)
    print(f"   {len(df)} rows found\n")

    # Column mapping for Kaggle placement dataset
    # ssc_p, hsc_p, degree_p, etest_p, mba_p, salary, status
    df.columns = [c.strip().lower() for c in df.columns]

    conn = get_conn()
    cur  = conn.cursor()
    seeded = 0

    for idx, row in df.iterrows():
        try:
            is_placed  = str(row.get('status', '')).strip().lower() == 'placed'
            salary_raw = row.get('salary', None)
            salary_lpa = float(salary_raw) / 100000 if pd.notna(salary_raw) and salary_raw else None
            cgpa_raw   = row.get('degree_p', 7.5)
            cgpa       = round(float(cgpa_raw) / 10, 2) if cgpa_raw > 10 else round(float(cgpa_raw), 2)
            cgpa       = max(0.0, min(10.0, cgpa))

            name   = f"Student {idx+1:04d}"
            email  = f"student{idx+1:04d}@university.edu"
            branch = random.choice(BRANCHES)
            batch  = random.choice([2021, 2022, 2023, 2024])
            roll   = f"{batch}{str(idx+1).zfill(4)}"

            # Insert user
            cur.execute(
                "INSERT INTO users(name, email, password_hash, role) VALUES(%s,%s,%s,'Student') "
                "ON CONFLICT (email) DO NOTHING RETURNING id",
                (name, email, hash_password("student123"))
            )
            result = cur.fetchone()
            if not result:
                continue
            user_id = result[0]

            # Insert student
            status = 'Placed' if is_placed else 'Unplaced'
            if is_placed and salary_lpa and salary_lpa >= 15:
                status = 'Dream'

            cur.execute(
                "INSERT INTO students(user_id, roll_number, branch, batch_year, cgpa, placement_status) "
                "VALUES(%s,%s,%s,%s,%s,%s) RETURNING id",
                (user_id, roll, branch, batch, cgpa, status)
            )
            student_id = cur.fetchone()[0]

            # Insert placement if placed
            if is_placed and salary_lpa:
                company = random.choice(COMPANIES)
                role    = random.choice(ROLES)
                # Get company_id
                cur.execute("SELECT id FROM companies WHERE name = %s", (company,))
                co_row = cur.fetchone()
                if co_row:
                    cur.execute(
                        "INSERT INTO placements(student_id, company_id, role, package_lpa, offer_type, year) "
                        "VALUES(%s,%s,%s,%s,%s,%s)",
                        (student_id, co_row[0], role, round(salary_lpa, 2),
                         random.choice(['On-Campus','Off-Campus','PPO']), batch)
                    )

            seeded += 1
            if seeded % 50 == 0:
                conn.commit()
                print(f"   ✅ Seeded {seeded} records...")

        except Exception as e:
            print(f"   ⚠️  Row {idx} skipped: {e}")
            conn.rollback()

    conn.commit()
    cur.close()
    conn.close()
    print(f"\n🎉 Done! {seeded} student records seeded from Kaggle dataset.")

def seed_alumni(count=200):
    """Seed synthetic alumni records"""
    print(f"\n📝 Seeding {count} alumni records...")
    conn = get_conn()
    cur  = conn.cursor()

    first_names = ['Aditya','Priya','Rahul','Sneha','Arjun','Pooja','Vikram','Neha','Amit','Kavya',
                   'Harsh','Divya','Saurabh','Anjali','Rohit','Riya','Karan','Nidhi','Suraj','Meera']
    last_names  = ['Singh','Patel','Sharma','Gupta','Kumar','Mishra','Reddy','Joshi','Tiwari','Nair',
                   'Agarwal','Sinha','Yadav','Mehta','Desai','Kapoor','Shah','Verma','Pandey','Pillai']

    for i in range(count):
        name   = f"{random.choice(first_names)} {random.choice(last_names)}"
        email  = f"alum{i+1:04d}@university.edu"
        branch = random.choice(BRANCHES)
        batch  = random.choice(range(2015, 2023))
        company= random.choice(COMPANIES)
        role   = random.choice(ROLES)
        pkg    = round(random.uniform(3.5, 28.0), 2)
        cgpa   = round(random.uniform(6.0, 10.0), 2)

        try:
            cur.execute(
                "INSERT INTO users(name, email, password_hash, role) VALUES(%s,%s,%s,'Alumni') "
                "ON CONFLICT (email) DO NOTHING RETURNING id",
                (name, email, hash_password("alumni123"))
            )
            result = cur.fetchone()
            if not result:
                continue
            user_id = result[0]

            cur.execute(
                "INSERT INTO alumni(user_id, batch_year, branch, cgpa, company, role, package_lpa, verified) "
                "VALUES(%s,%s,%s,%s,%s,%s,%s,true)",
                (user_id, batch, branch, cgpa, company, role, pkg)
            )
        except Exception as e:
            conn.rollback()
            continue

    conn.commit()
    cur.close()
    conn.close()
    print(f"   ✅ {count} alumni records seeded!")

if __name__ == "__main__":
    import sys
    print("=" * 50)
    print("  UniTrack — Database Seeder")
    print("=" * 50)

    if len(sys.argv) > 1 and sys.argv[1] == "--alumni-only":
        seed_alumni(200)
    elif os.path.exists("Placement_Data_Full_Class.csv"):
        seed_from_kaggle()
        seed_alumni(200)
    else:
        print("\n⚠️  Kaggle CSV not found. Seeding alumni only...")
        print("   To use Kaggle data:")
        print("   1. pip install kaggle")
        print("   2. kaggle datasets download -d benroshan/factors-affecting-campus-placement")
        print("   3. unzip the file and re-run\n")
        seed_alumni(200)

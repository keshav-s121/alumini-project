-- ============================================================
-- UniTrack — PostgreSQL Database Schema
-- Run: psql -U postgres -d unitrack_db -f schema.sql
-- ============================================================

-- Create DB (run separately if needed):
-- CREATE DATABASE unitrack_db;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(120)  NOT NULL,
  email         VARCHAR(200)  UNIQUE NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  role          VARCHAR(20)   NOT NULL DEFAULT 'Student'
                              CHECK (role IN ('Admin','Alumni','Student')),
  is_active     BOOLEAN       DEFAULT true,
  created_at    TIMESTAMP     DEFAULT NOW(),
  last_login    TIMESTAMP,
  updated_at    TIMESTAMP     DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER       REFERENCES users(id) ON DELETE CASCADE,
  roll_number       VARCHAR(20)   UNIQUE NOT NULL,
  branch            VARCHAR(10)   NOT NULL
                                  CHECK (branch IN ('CSE','ECE','ME','CE','EE','IT','BT','CH')),
  batch_year        INTEGER       NOT NULL,
  cgpa              DECIMAL(4,2)  CHECK (cgpa BETWEEN 0 AND 10),
  placement_status  VARCHAR(20)   DEFAULT 'Unplaced'
                                  CHECK (placement_status IN ('Placed','Unplaced','Dream','PPO','Higher Studies')),
  phone             VARCHAR(15),
  address           TEXT,
  created_at        TIMESTAMP     DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alumni (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER       REFERENCES users(id) ON DELETE CASCADE,
  batch_year      INTEGER       NOT NULL,
  branch          VARCHAR(10)   NOT NULL,
  cgpa            DECIMAL(4,2),
  company         VARCHAR(150),
  role            VARCHAR(150),
  package_lpa     DECIMAL(6,2),
  linkedin_url    VARCHAR(300),
  current_city    VARCHAR(100),
  verified        BOOLEAN       DEFAULT false,
  created_at      TIMESTAMP     DEFAULT NOW(),
  updated_at      TIMESTAMP     DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS companies (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(150)  UNIQUE NOT NULL,
  sector       VARCHAR(80)   NOT NULL,
  website      VARCHAR(200),
  hr_contact   VARCHAR(100),
  hr_email     VARCHAR(200),
  is_active    BOOLEAN       DEFAULT true,
  last_visit   DATE,
  created_at   TIMESTAMP     DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS placements (
  id            SERIAL PRIMARY KEY,
  student_id    INTEGER       REFERENCES students(id)  ON DELETE CASCADE,
  company_id    INTEGER       REFERENCES companies(id) ON DELETE SET NULL,
  role          VARCHAR(150)  NOT NULL,
  package_lpa   DECIMAL(6,2) NOT NULL CHECK (package_lpa > 0),
  offer_type    VARCHAR(20)  CHECK (offer_type IN ('On-Campus','Off-Campus','PPO','Lateral')),
  year          INTEGER      NOT NULL,
  offer_date    DATE,
  joining_date  DATE,
  is_confirmed  BOOLEAN      DEFAULT true,
  notes         TEXT,
  created_at    TIMESTAMP    DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_alumni_batch    ON alumni(batch_year);
CREATE INDEX IF NOT EXISTS idx_alumni_branch   ON alumni(branch);
CREATE INDEX IF NOT EXISTS idx_alumni_pkg      ON alumni(package_lpa);
CREATE INDEX IF NOT EXISTS idx_alumni_company  ON alumni(company);
CREATE INDEX IF NOT EXISTS idx_students_branch ON students(branch);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(placement_status);
CREATE INDEX IF NOT EXISTS idx_students_batch  ON students(batch_year);
CREATE INDEX IF NOT EXISTS idx_placements_year ON placements(year);
CREATE INDEX IF NOT EXISTS idx_placements_co   ON placements(company_id);
CREATE INDEX IF NOT EXISTS idx_placements_stu  ON placements(student_id);
CREATE INDEX IF NOT EXISTS idx_users_email     ON users(email);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Dr. Priya Sharma',  'admin@university.edu',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin'),
  ('Arjun Mehta',       'arjun@alumni.edu',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Alumni'),
  ('Sneha Patel',       'sneha@student.edu',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Student')
ON CONFLICT (email) DO NOTHING;

-- Companies
INSERT INTO companies (name, sector, website, last_visit) VALUES
  ('TCS',           'Technology',    'https://tcs.com',           '2024-03-15'),
  ('Infosys',       'Technology',    'https://infosys.com',       '2024-03-20'),
  ('Wipro',         'Technology',    'https://wipro.com',         '2024-02-28'),
  ('Goldman Sachs', 'Finance',       'https://goldmansachs.com',  '2024-01-20'),
  ('Amazon',        'E-Commerce',    'https://amazon.jobs',       '2024-03-10'),
  ('Google',        'Technology',    'https://careers.google.com','2024-02-15'),
  ('Deloitte',      'Consulting',    'https://deloitte.com',      '2024-03-25'),
  ('L&T',           'Manufacturing', 'https://lntecc.com',        '2024-03-05'),
  ('Microsoft',     'Technology',    'https://microsoft.com',     '2024-02-22'),
  ('Accenture',     'Consulting',    'https://accenture.com',     '2024-03-18')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- USEFUL VIEWS
-- ============================================================

CREATE OR REPLACE VIEW v_placement_summary AS
SELECT
  s.branch,
  s.batch_year,
  COUNT(*)                                                      AS total_students,
  SUM(CASE WHEN s.placement_status IN ('Placed','Dream') THEN 1 ELSE 0 END) AS placed,
  ROUND(AVG(p.package_lpa)::NUMERIC, 2)                        AS avg_package,
  MAX(p.package_lpa)                                           AS max_package
FROM students s
LEFT JOIN placements p ON s.id = p.student_id
GROUP BY s.branch, s.batch_year
ORDER BY s.batch_year DESC, placed DESC;

CREATE OR REPLACE VIEW v_company_stats AS
SELECT
  c.id, c.name, c.sector,
  COUNT(p.id)                             AS total_hires,
  ROUND(AVG(p.package_lpa)::NUMERIC, 2)  AS avg_package,
  MAX(p.package_lpa)                      AS max_package,
  MIN(p.package_lpa)                      AS min_package
FROM companies c
LEFT JOIN placements p ON c.id = p.company_id
GROUP BY c.id
ORDER BY total_hires DESC;

CREATE OR REPLACE VIEW v_alumni_full AS
SELECT
  a.id, u.name, u.email,
  a.batch_year, a.branch, a.cgpa,
  a.company, a.role, a.package_lpa,
  a.linkedin_url, a.current_city, a.verified
FROM alumni a
JOIN users u ON a.user_id = u.id;

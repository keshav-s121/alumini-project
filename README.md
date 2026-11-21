# ⚜ UniTrack — Alumni & Placement Analytics System

A complete full-stack web application for university alumni tracking and placement analytics.

---

## 🚀 Quick Start (Open Without a Server)

Just open `frontend/index.html` in any browser — no server needed!
The frontend works fully standalone with built-in demo data.

**Demo Login Credentials:**
| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Admin   | admin@university.edu     | admin123    |
| Alumni  | arjun@alumni.edu         | alumni123   |
| Student | sneha@student.edu        | student123  |

---

## 📁 Project Structure

```
unitrack/
├── frontend/
│   ├── index.html        ← Main UI (open this in browser)
│   └── app.js            ← All frontend logic
├── backend/
│   ├── server.js         ← Express REST API
│   ├── package.json      ← Node dependencies
│   └── .env.example      ← Environment variables template
├── database/
│   ├── schema.sql        ← PostgreSQL schema + seed data
│   └── seed_kaggle.py    ← Kaggle dataset seeder
└── README.md
```

---

## 🛠 Full Stack Setup (With Backend + Database)

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Python 3.8+ (for seeding)

### 2. Database Setup
```bash
# Create database
psql -U postgres -c "CREATE DATABASE unitrack_db;"

# Run schema
psql -U postgres -d unitrack_db -f database/schema.sql
```

### 3. Backend Setup
```bash
cd backend

# Copy env file
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# Install dependencies
npm install

# Start server
npm start
# API runs at http://localhost:5000
```

### 4. Kaggle Data Seeding (Optional)
```bash
cd database

# Install Python deps
pip install pandas psycopg2-binary python-dotenv bcrypt kaggle

# Download Kaggle dataset
kaggle datasets download -d benroshan/factors-affecting-campus-placement
unzip factors-affecting-campus-placement.zip

# Seed the database
python seed_kaggle.py

# Or seed alumni only (no Kaggle account needed)
python seed_kaggle.py --alumni-only
```

### 5. Connect Frontend to Backend
In `frontend/app.js`, update the API base URL at the top:
```js
const API_BASE = 'http://localhost:5000/api';
```

---

## 📊 Features

### Dashboard
- Placement rate, alumni count, avg. package, company stats
- Year-wise placement bar chart
- Salary distribution pie chart
- Top companies horizontal bar chart
- Branch-wise placement progress bars

### Alumni Directory
- Search by name, company, role
- Filter by batch year, branch, minimum package
- Paginated card grid view
- Click to view full profile
- Add new alumni (Admin only)

### Student Profiles
- Tabbed view: All / Placed / Unplaced / Dream Offer
- Status badges (Placed / Unplaced / Dream)
- Individual profile modals

### Placements
- Full placement records with offer type
- Filter by year and type (On-Campus / Off-Campus / PPO)
- Add new placement records (Admin only)

### Companies
- Hiring partner tracker
- Sector-wise filtering
- Avg and max package per company

### Analytics
- Salary trend line chart (2018–2024)
- Sector-wise hiring doughnut
- Gender-wise placement split
- Offer type breakdown
- Top roles offered

### Admin Panel
- User management (view, edit, toggle active)
- System settings (university info, notifications)
- Activity logs with IP tracking

---

## 🔌 API Reference

| Method | Endpoint                    | Auth  | Description                    |
|--------|-----------------------------|-------|--------------------------------|
| POST   | /api/auth/login             | No    | Login, returns JWT             |
| POST   | /api/auth/register          | No    | Register new user              |
| GET    | /api/alumni                 | Yes   | List alumni (filter/paginate)  |
| POST   | /api/alumni                 | Admin | Add alumni record              |
| PUT    | /api/alumni/:id             | Admin | Update alumni record           |
| DELETE | /api/alumni/:id             | Admin | Delete alumni record           |
| GET    | /api/students               | Yes   | List students                  |
| POST   | /api/students               | Admin | Add student                    |
| GET    | /api/placements             | Yes   | List placements                |
| POST   | /api/placements             | Admin | Record new placement           |
| GET    | /api/companies              | Yes   | List companies with stats      |
| POST   | /api/companies              | Admin | Add company                    |
| GET    | /api/analytics/summary      | Yes   | Dashboard summary stats        |
| GET    | /api/analytics/trends       | Yes   | Year-wise placement trends     |
| GET    | /api/analytics/branch       | Yes   | Branch-wise analytics          |
| GET    | /api/analytics/companies    | Yes   | Company hiring analytics       |
| GET    | /api/users                  | Admin | List all users                 |
| PUT    | /api/users/:id              | Admin | Update user                    |
| DELETE | /api/users/:id              | Admin | Delete user                    |

---

## 🌐 Deployment

### Deploy Frontend (Free — Netlify)
```bash
# Just drag and drop the /frontend folder to netlify.com/drop
# Or use Netlify CLI:
npm install -g netlify-cli
netlify deploy --dir=frontend --prod
```

### Deploy Backend (Free — Railway / Render)
```bash
# Railway:
railway init
railway add postgresql
railway up

# Render:
# 1. Push to GitHub
# 2. Create new Web Service at render.com
# 3. Set build command: cd backend && npm install
# 4. Set start command: node backend/server.js
# 5. Add environment variables from .env.example
```

---

## 🔒 Security Notes

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens expire in 24 hours
- Role-based access control on all admin routes
- SQL injection prevention via parameterized queries
- CORS configured for production domains

---

## 📄 License
MIT License — Free to use for educational purposes.

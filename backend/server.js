// ============================================================
// UniTrack Backend — Node.js + Express REST API
// ============================================================
const express   = require('express');
const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcryptjs');
const cors      = require('cors');
const path = require('path');
const { Pool }  = require('pg');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend'))); // Serve frontend from /frontend

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const JWT_SECRET = process.env.JWT_SECRET || 'unitrack_secret_2024';

// ---- MIDDLEWARE ----
function authMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Access forbidden' });
      }
      req.user = decoded;
      next();
    } catch {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

// ============================================================
// AUTH ROUTES
// ============================================================

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1 AND is_active = true', [email]);
    if (!rows.length || !bcrypt.compareSync(password, rows[0].password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user  = rows[0];
    const token = jwt.sign({ id:user.id, email:user.email, name:user.name, role:user.role }, JWT_SECRET, { expiresIn: '24h' });
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
    res.json({ token, user: { id:user.id, name:user.name, email:user.email, role:user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'Student' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length) return res.status(409).json({ error: 'Email already registered' });
    const hash = bcrypt.hashSync(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users(name, email, password_hash, role) VALUES($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hash, role]
    );
    res.status(201).json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authMiddleware(), (req, res) => {
  res.json({ user: req.user });
});

// ============================================================
// ALUMNI ROUTES
// ============================================================

// GET /api/alumni  — search, filter, paginate
app.get('/api/alumni', authMiddleware(), async (req, res) => {
  try {
    const { batch, branch, min_pkg, search, page = 0, limit = 20 } = req.query;
    let q = `SELECT a.*, u.name, u.email FROM alumni a JOIN users u ON a.user_id = u.id WHERE 1=1`;
    const params = [];
    if (batch)  { params.push(batch);         q += ` AND a.batch_year = $${params.length}`; }
    if (branch) { params.push(branch);        q += ` AND a.branch = $${params.length}`; }
    if (min_pkg){ params.push(min_pkg);       q += ` AND a.package_lpa >= $${params.length}`; }
    if (search) { params.push(`%${search}%`); q += ` AND (u.name ILIKE $${params.length} OR a.company ILIKE $${params.length} OR a.role ILIKE $${params.length})`; }
    params.push(parseInt(limit));
    params.push(parseInt(page) * parseInt(limit));
    q += ` ORDER BY a.batch_year DESC LIMIT $${params.length-1} OFFSET $${params.length}`;
    const { rows } = await pool.query(q, params);
    const total   = await pool.query('SELECT COUNT(*) FROM alumni');
    res.json({ data: rows, total: parseInt(total.rows[0].count) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/alumni/:id
app.get('/api/alumni/:id', authMiddleware(), async (req, res) => {
  const { rows } = await pool.query('SELECT a.*, u.name, u.email FROM alumni a JOIN users u ON a.user_id = u.id WHERE a.id = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// POST /api/alumni  (Admin only)
app.post('/api/alumni', authMiddleware(['Admin']), async (req, res) => {
  try {
    const { user_id, batch_year, branch, cgpa, company, role, package_lpa, linkedin_url, current_city } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO alumni(user_id, batch_year, branch, cgpa, company, role, package_lpa, linkedin_url, current_city)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [user_id, batch_year, branch, cgpa, company, role, package_lpa, linkedin_url, current_city]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/alumni/:id
app.put('/api/alumni/:id', authMiddleware(['Admin']), async (req, res) => {
  const { company, role, package_lpa, linkedin_url, current_city } = req.body;
  const { rows } = await pool.query(
    `UPDATE alumni SET company=$1, role=$2, package_lpa=$3, linkedin_url=$4, current_city=$5, updated_at=NOW()
     WHERE id=$6 RETURNING *`,
    [company, role, package_lpa, linkedin_url, current_city, req.params.id]
  );
  res.json(rows[0]);
});

// DELETE /api/alumni/:id
app.delete('/api/alumni/:id', authMiddleware(['Admin']), async (req, res) => {
  await pool.query('DELETE FROM alumni WHERE id = $1', [req.params.id]);
  res.json({ message: 'Deleted successfully' });
});

// ============================================================
// STUDENT ROUTES
// ============================================================

app.get('/api/students', authMiddleware(), async (req, res) => {
  try {
    const { branch, status, search, page = 0, limit = 20 } = req.query;
    let q = `SELECT s.*, u.name, u.email FROM students s JOIN users u ON s.user_id = u.id WHERE 1=1`;
    const params = [];
    if (branch) { params.push(branch); q += ` AND s.branch = $${params.length}`; }
    if (status) { params.push(status); q += ` AND s.placement_status = $${params.length}`; }
    if (search) { params.push(`%${search}%`); q += ` AND (u.name ILIKE $${params.length} OR s.roll_number ILIKE $${params.length})`; }
    params.push(parseInt(limit));
    params.push(parseInt(page) * parseInt(limit));
    q += ` ORDER BY s.id LIMIT $${params.length-1} OFFSET $${params.length}`;
    const { rows } = await pool.query(q, params);
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/students', authMiddleware(['Admin']), async (req, res) => {
  const { user_id, roll_number, branch, batch_year, cgpa, phone } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO students(user_id, roll_number, branch, batch_year, cgpa, phone) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [user_id, roll_number, branch, batch_year, cgpa, phone]
  );
  res.status(201).json(rows[0]);
});

app.put('/api/students/:id', authMiddleware(['Admin']), async (req, res) => {
  const { cgpa, placement_status, phone } = req.body;
  const { rows } = await pool.query(
    `UPDATE students SET cgpa=$1, placement_status=$2, phone=$3 WHERE id=$4 RETURNING *`,
    [cgpa, placement_status, phone, req.params.id]
  );
  res.json(rows[0]);
});

// ============================================================
// PLACEMENT ROUTES
// ============================================================

app.get('/api/placements', authMiddleware(), async (req, res) => {
  try {
    const { year, type, company_id, page = 0, limit = 20 } = req.query;
    let q = `SELECT p.*, u.name as student_name, s.branch, c.name as company_name
             FROM placements p
             JOIN students s ON p.student_id = s.id
             JOIN users u ON s.user_id = u.id
             JOIN companies c ON p.company_id = c.id
             WHERE 1=1`;
    const params = [];
    if (year)       { params.push(year);       q += ` AND p.year = $${params.length}`; }
    if (type)       { params.push(type);       q += ` AND p.offer_type = $${params.length}`; }
    if (company_id) { params.push(company_id); q += ` AND p.company_id = $${params.length}`; }
    params.push(parseInt(limit));
    params.push(parseInt(page) * parseInt(limit));
    q += ` ORDER BY p.package_lpa DESC LIMIT $${params.length-1} OFFSET $${params.length}`;
    const { rows } = await pool.query(q, params);
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/placements', authMiddleware(['Admin']), async (req, res) => {
  try {
    const { student_id, company_id, role, package_lpa, offer_type, year, offer_date, joining_date } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO placements(student_id, company_id, role, package_lpa, offer_type, year, offer_date, joining_date)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [student_id, company_id, role, package_lpa, offer_type, year, offer_date, joining_date]
    );
    // Update student status
    const status = package_lpa >= 15 ? 'Dream' : 'Placed';
    await pool.query('UPDATE students SET placement_status = $1 WHERE id = $2', [status, student_id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// COMPANY ROUTES
// ============================================================

app.get('/api/companies', authMiddleware(), async (req, res) => {
  const { rows } = await pool.query(`
    SELECT c.*, COUNT(p.id) as total_hires,
           ROUND(AVG(p.package_lpa)::numeric, 2) as avg_pkg,
           MAX(p.package_lpa) as max_pkg
    FROM companies c
    LEFT JOIN placements p ON c.id = p.company_id
    GROUP BY c.id
    ORDER BY total_hires DESC NULLS LAST`);
  res.json({ data: rows });
});

app.post('/api/companies', authMiddleware(['Admin']), async (req, res) => {
  const { name, sector, website, hr_contact, hr_email } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO companies(name, sector, website, hr_contact, hr_email) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [name, sector, website, hr_contact, hr_email]
  );
  res.status(201).json(rows[0]);
});

// ============================================================
// ANALYTICS ROUTES
// ============================================================

app.get('/api/analytics/summary', authMiddleware(), async (req, res) => {
  try {
    const [total, placed, avgPkg, maxPkg, companies, alumni] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM students"),
      pool.query("SELECT COUNT(*) FROM students WHERE placement_status IN ('Placed','Dream')"),
      pool.query("SELECT ROUND(AVG(package_lpa)::numeric,2) FROM placements"),
      pool.query("SELECT MAX(package_lpa) FROM placements"),
      pool.query("SELECT COUNT(DISTINCT company_id) FROM placements"),
      pool.query("SELECT COUNT(*) FROM alumni"),
    ]);
    const t = parseInt(total.rows[0].count);
    const p = parseInt(placed.rows[0].count);
    res.json({
      totalStudents:   t,
      placedStudents:  p,
      placementRate:   t ? +(p/t*100).toFixed(1) : 0,
      avgPackage:      parseFloat(avgPkg.rows[0].round || 0),
      maxPackage:      parseFloat(maxPkg.rows[0].max   || 0),
      companiesHiring: parseInt(companies.rows[0].count),
      totalAlumni:     parseInt(alumni.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/analytics/trends', authMiddleware(), async (req, res) => {
  const { rows } = await pool.query(`
    SELECT year,
           COUNT(*) as placements,
           ROUND(AVG(package_lpa)::numeric,2) as avg_pkg,
           MAX(package_lpa) as max_pkg
    FROM placements
    GROUP BY year ORDER BY year`);
  res.json({ data: rows });
});

app.get('/api/analytics/branch', authMiddleware(), async (req, res) => {
  const { rows } = await pool.query(`
    SELECT s.branch,
           COUNT(*) as total,
           SUM(CASE WHEN s.placement_status IN ('Placed','Dream') THEN 1 ELSE 0 END) as placed,
           ROUND(AVG(p.package_lpa)::numeric,2) as avg_pkg
    FROM students s
    LEFT JOIN placements p ON s.id = p.student_id
    GROUP BY s.branch ORDER BY placed DESC`);
  res.json({ data: rows });
});

app.get('/api/analytics/companies', authMiddleware(), async (req, res) => {
  const { rows } = await pool.query(`
    SELECT c.name, c.sector, COUNT(p.id) as hires,
           ROUND(AVG(p.package_lpa)::numeric,2) as avg_pkg
    FROM companies c
    JOIN placements p ON c.id = p.company_id
    GROUP BY c.id ORDER BY hires DESC LIMIT 10`);
  res.json({ data: rows });
});

// ============================================================
// USER MANAGEMENT (Admin)
// ============================================================

app.get('/api/users', authMiddleware(['Admin']), async (req, res) => {
  const { rows } = await pool.query('SELECT id, name, email, role, is_active, created_at, last_login FROM users ORDER BY created_at DESC');
  res.json({ data: rows });
});

app.put('/api/users/:id', authMiddleware(['Admin']), async (req, res) => {
  const { name, role, is_active } = req.body;
  const { rows } = await pool.query(
    'UPDATE users SET name=$1, role=$2, is_active=$3 WHERE id=$4 RETURNING id, name, email, role, is_active',
    [name, role, is_active, req.params.id]
  );
  res.json(rows[0]);
});

app.delete('/api/users/:id', authMiddleware(['Admin']), async (req, res) => {
  if (parseInt(req.params.id) === req.user.id) return res.status(400).json({ error: 'Cannot delete own account' });
  await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
  res.json({ message: 'User deleted' });
});

// ---- START ----
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n✅ UniTrack API running on http://localhost:${PORT}`);
  console.log(`   Frontend: http://localhost:${PORT}`);
  console.log(`   API Base: http://localhost:${PORT}/api\n`);
});

module.exports = app;

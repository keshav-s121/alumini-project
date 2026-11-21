// ============================================================
// UniTrack — Alumni & Placement Analytics System
// Frontend App Logic (Vanilla JS, no framework required)
// ============================================================

// ---- MOCK DATA ----
const USERS = [
  { id:1, name:'Dr. Priya Sharma',  email:'admin@university.edu',  pass:'admin123',   role:'Admin',   joined:'2018-01-15', lastLogin:'2024-04-19', status:'Active' },
  { id:2, name:'Arjun Mehta',       email:'arjun@alumni.edu',       pass:'alumni123',  role:'Alumni',  joined:'2020-06-01', lastLogin:'2024-04-17', status:'Active' },
  { id:3, name:'Sneha Patel',       email:'sneha@student.edu',      pass:'student123', role:'Student', joined:'2023-08-01', lastLogin:'2024-04-18', status:'Active' },
  { id:4, name:'Rohit Kumar',       email:'rohit@alumni.edu',       pass:'alumni123',  role:'Alumni',  joined:'2019-06-01', lastLogin:'2024-03-22', status:'Active' },
  { id:5, name:'Anita Joshi',       email:'anita@student.edu',      pass:'student123', role:'Student', joined:'2023-08-01', lastLogin:'2024-04-10', status:'Inactive' },
  { id:6, name:'Vikash Sinha',      email:'vikash@admin.edu',       pass:'admin123',   role:'Admin',   joined:'2017-06-01', lastLogin:'2024-04-15', status:'Active' },
];

const COMPANIES_DATA = [
  { name:'TCS',           sector:'Technology',    hires:87, avg:4.8,  max:8,   last:'2024-03-15', status:'Active' },
  { name:'Infosys',       sector:'Technology',    hires:74, avg:5.2,  max:9,   last:'2024-03-20', status:'Active' },
  { name:'Wipro',         sector:'Technology',    hires:61, avg:4.5,  max:7.5, last:'2024-02-28', status:'Active' },
  { name:'Goldman Sachs', sector:'Finance',       hires:12, avg:18.5, max:28,  last:'2024-01-20', status:'Active' },
  { name:'Amazon',        sector:'E-Commerce',    hires:34, avg:22,   max:28,  last:'2024-03-10', status:'Active' },
  { name:'Google',        sector:'Technology',    hires:8,  avg:24,   max:28,  last:'2024-02-15', status:'Active' },
  { name:'Deloitte',      sector:'Consulting',    hires:45, avg:7.2,  max:12,  last:'2024-03-25', status:'Active' },
  { name:'L&T',           sector:'Manufacturing', hires:38, avg:6.1,  max:10,  last:'2024-03-05', status:'Active' },
  { name:'Microsoft',     sector:'Technology',    hires:15, avg:20,   max:26,  last:'2024-02-22', status:'Active' },
  { name:'Accenture',     sector:'Consulting',    hires:52, avg:6.8,  max:11,  last:'2024-03-18', status:'Active' },
  { name:'Flipkart',      sector:'E-Commerce',    hires:19, avg:14,   max:20,  last:'2024-02-10', status:'Active' },
  { name:'HDFC Bank',     sector:'Finance',       hires:28, avg:5.5,  max:8,   last:'2024-01-15', status:'Inactive' },
];

const AVATARS = ['#c9a84c','#3b82f6','#22c55e','#a855f7','#f97316','#ec4899','#06b6d4','#f59e0b'];

function genAlumni() {
  const names = ['Aditya Singh','Priya Patel','Rahul Sharma','Sneha Gupta','Arjun Kumar','Pooja Mishra','Vikram Reddy','Neha Joshi','Amit Tiwari','Kavya Nair','Harsh Agarwal','Divya Sinha','Saurabh Yadav','Anjali Mehta','Rohit Desai','Riya Kapoor','Karan Shah','Nidhi Verma','Suraj Pandey','Meera Pillai','Varun Bhatt','Swati Srivastava','Nikhil Jain','Sonali Chaudhari','Tarun Malhotra','Priya Khanna','Deepak Negi','Ananya Roy','Siddharth Iyer','Shruti Bansal','Manish Chauhan','Ritika Singh','Ashish Dubey','Tanvi Joshi','Vivek Tripathi','Pallavi Mishra','Gaurav Pandey','Smita Kulkarni','Rajesh Naik','Preeti Doshi'];
  const cos = ['TCS','Infosys','Wipro','Amazon','Google','Microsoft','Deloitte','Accenture','Flipkart','Goldman Sachs','L&T','HCL','Cognizant','IBM','Oracle'];
  const branches = ['CSE','ECE','ME','CE','EE','IT'];
  const roles = ['Software Engineer','Data Analyst','Systems Engineer','Product Manager','ML Engineer','DevOps Engineer','Business Analyst','Full Stack Dev'];
  const arr = [];
  for (let i = 0; i < 120; i++) {
    const batch  = 2018 + Math.floor(Math.random() * 7);
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const co     = cos[Math.floor(Math.random() * cos.length)];
    const pkg    = +(3 + Math.random() * 25).toFixed(1);
    arr.push({ id:i+1, name:names[i % names.length], batch, branch, company:co, role:roles[Math.floor(Math.random()*roles.length)], pkg, cgpa:(6+Math.random()*4).toFixed(2), email:`alumni${i+1}@university.edu` });
  }
  return arr;
}

function genStudents() {
  const names = ['Aakash Mehta','Bhavna Sharma','Chirag Patel','Deepika Nair','Eshan Kumar','Farida Ansari','Gaurav Singh','Himani Gupta','Ishaan Roy','Jyoti Verma','Kartik Yadav','Lavanya Iyer','Mohan Das','Nisha Pandey','Omkar Joshi','Pooja Tiwari','Qasim Ali','Rekha Sinha','Sameer Reddy','Tanya Mishra','Ujwal Negi','Vaishali Bhatt','Waqar Khan','Yash Malhotra','Zara Kapoor','Akanksha Chauhan','Brijesh Dubey','Chandni Shah','Dev Tripathi','Eesha Gupta'];
  const cos = ['TCS','Infosys','Amazon','Google','Wipro','Deloitte','Microsoft',null,null,null];
  const branches = ['CSE','ECE','ME','CE','EE','IT'];
  const roles = ['Software Engineer','Data Analyst','Systems Engineer','Backend Dev','Frontend Dev'];
  const arr = [];
  for (let i = 0; i < 60; i++) {
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const co     = cos[Math.floor(Math.random() * cos.length)];
    const placed = co !== null;
    const pkg    = placed ? +(4 + Math.random() * 18).toFixed(1) : null;
    const status = pkg && pkg >= 15 ? 'Dream' : placed ? 'Placed' : 'Unplaced';
    arr.push({ id:i+1, name:names[i % names.length], roll:`2024${String(i+1).padStart(3,'0')}`, branch, cgpa:(6+Math.random()*4).toFixed(2), company:co, role:placed ? roles[Math.floor(Math.random()*roles.length)] : null, pkg, status });
  }
  return arr;
}

function genLogs() {
  const actions = ['User login','Record added','Profile updated','Alumni registered','Placement record created','Password changed','Data exported','Settings updated'];
  const users   = ['Dr. Priya Sharma','Arjun Mehta','Sneha Patel','Rohit Kumar'];
  const arr = [];
  for (let i = 0; i < 20; i++) {
    const d = new Date(2024, 3, 19-i, 8 + Math.floor(Math.random()*10), Math.floor(Math.random()*60));
    arr.push({ ts:d.toLocaleString('en-IN'), user:users[Math.floor(Math.random()*users.length)], action:actions[Math.floor(Math.random()*actions.length)], details:'System event', ip:`192.168.${Math.floor(Math.random()*5)+1}.${Math.floor(Math.random()*255)}` });
  }
  return arr;
}

// ---- APP STATE ----
window._alumni           = genAlumni();
window._students         = genStudents();
window._placements       = window._alumni.slice(0,80).map((a,i)=>({...a, type:['On-Campus','Off-Campus','PPO'][i%3], year:a.batch}));
window._logs             = genLogs();
window._filteredAlumni   = [...window._alumni];
window._filteredStudents = [...window._students];
window._filteredPlac     = [...window._placements];
window._alumniPage = 0; window._studentPage = 0; window._placPage = 0;
window._studentTab = 'all';
window._loggedUser = null;
window._chartsInited = false;

// ---- AUTH ----
function selectRole(r, el) {
  document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const emails = { admin:'admin@university.edu', alumni:'arjun@alumni.edu', student:'sneha@student.edu' };
  const passes = { admin:'admin123', alumni:'alumni123', student:'student123' };
  document.getElementById('loginEmail').value = emails[r];
  document.getElementById('loginPass').value  = passes[r];
}

function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value.trim();
  const u = USERS.find(u => u.email === email && u.pass === pass);
  if (!u) { document.getElementById('loginErr').textContent = 'Invalid credentials. Use demo values below.'; return; }
  document.getElementById('loginErr').textContent = '';
  window._loggedUser = u;
  document.getElementById('sidebarUserName').textContent = u.name;
  document.getElementById('sidebarUserRole').textContent  = u.role;
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appShell').style.display   = 'flex';
  if (u.role !== 'Admin') document.getElementById('adminNavItem').style.display = 'none';
  else document.getElementById('adminNavItem').style.display = '';
  renderAll();
  if (!window._chartsInited) { setTimeout(initCharts, 150); window._chartsInited = true; }
}

function doLogout() {
  window._loggedUser = null;
  window._chartsInited = false;
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('appShell').style.display   = 'none';
}

// ---- NAVIGATION ----
function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  el.classList.add('active');
}

// ---- RENDER ALL ----
function renderAll() {
  filterAlumni(); filterStudents(); filterPlacements();
  renderCompanies(); renderAdminUsers(); renderLogs();
  renderBranchProgress(); renderRolesList();
}

// ---- ALUMNI ----
function renderAlumni() {
  const per = 9, page = window._alumniPage;
  const slice = window._filteredAlumni.slice(page*per, (page+1)*per);
  document.getElementById('alumniGrid').innerHTML = slice.map(a => {
    const init = a.name.split(' ').map(x=>x[0]).join('').slice(0,2);
    const col  = AVATARS[a.id % AVATARS.length];
    return `<div class="profile-card" onclick="viewAlumni(${a.id})">
      <div class="avatar" style="background:${col}">${init}</div>
      <div class="pname">${a.name}</div>
      <div class="pmeta">${a.branch} &middot; Batch ${a.batch}</div>
      <div class="pmeta" style="margin-top:4px">${a.role} @ ${a.company}</div>
      <div class="ppkg">₹${a.pkg}L CTC</div>
      <span class="badge badge-green" style="margin-top:.5rem">Placed</span>
    </div>`;
  }).join('');
  renderPagination('alumniPagination', window._filteredAlumni.length, per, page, 'alumniPage');
}

function filterAlumni() {
  const q      = document.getElementById('alumniSearch').value.toLowerCase();
  const batch  = document.getElementById('alumBatch').value;
  const branch = document.getElementById('alumBranch').value;
  const pkg    = document.getElementById('alumPkg').value;
  window._filteredAlumni = window._alumni.filter(a => {
    if (q && !a.name.toLowerCase().includes(q) && !a.company.toLowerCase().includes(q) && !a.role.toLowerCase().includes(q)) return false;
    if (batch  && String(a.batch)  !== batch)  return false;
    if (branch && a.branch         !== branch) return false;
    if (pkg    && a.pkg             < Number(pkg)) return false;
    return true;
  });
  window._alumniPage = 0;
  renderAlumni();
}

function viewAlumni(id) {
  const a = window._alumni.find(x => x.id === id);
  openModal(`<div class="modal-title"><span class="modal-close" onclick="closeModal()">✕</span>${a.name}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px;color:var(--text2)">
      <div><div style="color:var(--slate);font-size:11px;text-transform:uppercase;margin-bottom:3px">Branch</div>${a.branch}</div>
      <div><div style="color:var(--slate);font-size:11px;text-transform:uppercase;margin-bottom:3px">Batch</div>${a.batch}</div>
      <div><div style="color:var(--slate);font-size:11px;text-transform:uppercase;margin-bottom:3px">Company</div>${a.company}</div>
      <div><div style="color:var(--slate);font-size:11px;text-transform:uppercase;margin-bottom:3px">Role</div>${a.role}</div>
      <div><div style="color:var(--slate);font-size:11px;text-transform:uppercase;margin-bottom:3px">Package</div><span style="color:var(--green)">₹${a.pkg}L CTC</span></div>
      <div><div style="color:var(--slate);font-size:11px;text-transform:uppercase;margin-bottom:3px">CGPA</div>${a.cgpa}</div>
      <div><div style="color:var(--slate);font-size:11px;text-transform:uppercase;margin-bottom:3px">Email</div>${a.email}</div>
      <div><div style="color:var(--slate);font-size:11px;text-transform:uppercase;margin-bottom:3px">Status</div><span class="badge badge-green">Placed</span></div>
    </div>
    <button class="btn btn-outline btn-sm" style="margin-top:1.2rem" onclick="closeModal()">Close</button>`);
}

function openAddAlumniModal() {
  openModal(`<div class="modal-title"><span class="modal-close" onclick="closeModal()">✕</span>Add Alumni Record</div>
    <div class="form-group"><label class="form-label">Full Name</label><input class="form-input" id="newAlumName" placeholder="Enter full name"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div class="form-group"><label class="form-label">Branch</label><select class="form-input" id="newAlumBranch"><option>CSE</option><option>ECE</option><option>ME</option><option>CE</option><option>EE</option><option>IT</option></select></div>
      <div class="form-group"><label class="form-label">Batch Year</label><input class="form-input" id="newAlumBatch" placeholder="2024" type="number" value="2024"></div>
      <div class="form-group"><label class="form-label">Company</label><input class="form-input" id="newAlumCo" placeholder="Company name"></div>
      <div class="form-group"><label class="form-label">Package (LPA)</label><input class="form-input" id="newAlumPkg" placeholder="e.g. 8.5" type="number"></div>
    </div>
    <div class="form-group"><label class="form-label">Role</label><input class="form-input" id="newAlumRole" placeholder="e.g. Software Engineer"></div>
    <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="newAlumEmail" placeholder="alumni@email.com" type="email"></div>
    <div style="display:flex;gap:10px;margin-top:.5rem">
      <button class="btn btn-gold" onclick="saveAlumni()">Add Record</button>
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
    </div>`);
}

function saveAlumni() {
  const name   = document.getElementById('newAlumName').value.trim();
  const branch = document.getElementById('newAlumBranch').value;
  const batch  = parseInt(document.getElementById('newAlumBatch').value);
  const co     = document.getElementById('newAlumCo').value.trim();
  const pkg    = parseFloat(document.getElementById('newAlumPkg').value);
  const role   = document.getElementById('newAlumRole').value.trim();
  const email  = document.getElementById('newAlumEmail').value.trim();
  if (!name || !co || !pkg) { alert('Please fill all required fields.'); return; }
  const newId = window._alumni.length + 1;
  window._alumni.unshift({ id:newId, name, branch, batch, company:co, pkg, role, cgpa:'8.00', email });
  filterAlumni();
  closeModal();
}

// ---- STUDENTS ----
function switchStudentTab(tab, el) {
  window._studentTab = tab;
  document.querySelectorAll('#page-students .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  filterStudents();
}

function renderStudents() {
  const per = 10, page = window._studentPage;
  const slice = window._filteredStudents.slice(page*per, (page+1)*per);
  document.getElementById('studentTbody').innerHTML = slice.map(s => {
    const sc = s.status === 'Dream' ? 'badge-gold' : s.status === 'Placed' ? 'badge-green' : 'badge-red';
    return `<tr>
      <td>${s.name}</td>
      <td style="color:var(--slate)">${s.roll}</td>
      <td><span class="badge badge-blue">${s.branch}</span></td>
      <td>${s.cgpa}</td>
      <td>${s.company || '—'}</td>
      <td>${s.pkg ? `<span style="color:var(--green)">₹${s.pkg}L</span>` : '—'}</td>
      <td><span class="badge ${sc}">${s.status}</span></td>
      <td><button class="btn btn-outline btn-sm" onclick="viewStudent(${s.id})">View</button></td>
    </tr>`;
  }).join('');
  renderPagination('studentPagination', window._filteredStudents.length, per, page, 'studentPage');
}

function filterStudents() {
  const q      = document.getElementById('studentSearch').value.toLowerCase();
  const branch = document.getElementById('stuBranch').value;
  const tab    = window._studentTab;
  window._filteredStudents = window._students.filter(s => {
    if (q && !s.name.toLowerCase().includes(q) && !s.roll.includes(q)) return false;
    if (branch && s.branch !== branch) return false;
    if (tab === 'placed'   && s.status === 'Unplaced') return false;
    if (tab === 'unplaced' && s.status !== 'Unplaced') return false;
    if (tab === 'dream'    && s.status !== 'Dream')    return false;
    return true;
  });
  window._studentPage = 0;
  renderStudents();
}

function viewStudent(id) {
  const s = window._students.find(x => x.id === id);
  const sc = s.status === 'Dream' ? 'badge-gold' : s.status === 'Placed' ? 'badge-green' : 'badge-red';
  openModal(`<div class="modal-title"><span class="modal-close" onclick="closeModal()">✕</span>${s.name}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px;color:var(--text2)">
      <div><div style="color:var(--slate);font-size:11px;text-transform:uppercase;margin-bottom:3px">Roll No.</div>${s.roll}</div>
      <div><div style="color:var(--slate);font-size:11px;text-transform:uppercase;margin-bottom:3px">Branch</div>${s.branch}</div>
      <div><div style="color:var(--slate);font-size:11px;text-transform:uppercase;margin-bottom:3px">CGPA</div>${s.cgpa}</div>
      <div><div style="color:var(--slate);font-size:11px;text-transform:uppercase;margin-bottom:3px">Status</div><span class="badge ${sc}">${s.status}</span></div>
      ${s.company ? `<div><div style="color:var(--slate);font-size:11px;text-transform:uppercase;margin-bottom:3px">Company</div>${s.company}</div><div><div style="color:var(--slate);font-size:11px;text-transform:uppercase;margin-bottom:3px">Package</div><span style="color:var(--green)">₹${s.pkg}L</span></div>` : ''}
    </div>
    <button class="btn btn-outline btn-sm" style="margin-top:1.2rem" onclick="closeModal()">Close</button>`);
}

// ---- PLACEMENTS ----
function renderPlacements() {
  const per = 10, page = window._placPage;
  const slice = window._filteredPlac.slice(page*per, (page+1)*per);
  const typeColor = { 'On-Campus':'badge-green', 'Off-Campus':'badge-blue', 'PPO':'badge-gold' };
  document.getElementById('placTbody').innerHTML = slice.map(p => `<tr>
    <td>${p.name}</td>
    <td><span class="badge badge-blue">${p.branch}</span></td>
    <td>${p.company}</td>
    <td style="color:var(--slate);font-size:11px">${p.role}</td>
    <td><span style="color:var(--green);font-weight:500">₹${p.pkg}L</span></td>
    <td><span class="badge ${typeColor[p.type] || 'badge-blue'}">${p.type}</span></td>
    <td>${p.year}</td>
    <td><span class="badge badge-green">Confirmed</span></td>
  </tr>`).join('');
  renderPagination('placPagination', window._filteredPlac.length, per, page, 'placPage');
}

function filterPlacements() {
  const q    = document.getElementById('placSearch').value.toLowerCase();
  const year = document.getElementById('placYear').value;
  const type = document.getElementById('placType').value;
  window._filteredPlac = window._placements.filter(p => {
    if (q && !p.name.toLowerCase().includes(q) && !p.company.toLowerCase().includes(q)) return false;
    if (year && String(p.year) !== year) return false;
    if (type && p.type !== type) return false;
    return true;
  });
  window._placPage = 0;
  renderPlacements();
}

function openAddPlacementModal() {
  openModal(`<div class="modal-title"><span class="modal-close" onclick="closeModal()">✕</span>Add Placement Record</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div class="form-group"><label class="form-label">Student Name</label><input class="form-input" placeholder="Name"></div>
      <div class="form-group"><label class="form-label">Company</label><input class="form-input" placeholder="Company"></div>
      <div class="form-group"><label class="form-label">Role</label><input class="form-input" placeholder="Role"></div>
      <div class="form-group"><label class="form-label">Package (LPA)</label><input class="form-input" type="number" placeholder="e.g. 12"></div>
      <div class="form-group"><label class="form-label">Type</label><select class="form-input"><option>On-Campus</option><option>Off-Campus</option><option>PPO</option></select></div>
      <div class="form-group"><label class="form-label">Year</label><input class="form-input" type="number" placeholder="2024" value="2024"></div>
    </div>
    <div style="display:flex;gap:10px;margin-top:.5rem">
      <button class="btn btn-gold" onclick="closeModal();alert('Placement record saved!')">Save Record</button>
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
    </div>`);
}

// ---- COMPANIES ----
function renderCompanies() {
  const q      = (document.getElementById('compSearch')  || {}).value || '';
  const sector = (document.getElementById('compSector') || {}).value || '';
  let data = COMPANIES_DATA.filter(c => {
    if (q      && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (sector && c.sector !== sector) return false;
    return true;
  });
  document.getElementById('compTbody').innerHTML = data.map(c => `<tr>
    <td style="font-weight:500">${c.name}</td>
    <td><span class="badge badge-purple">${c.sector}</span></td>
    <td>${c.hires}</td>
    <td style="color:var(--gold2)">₹${c.avg}L</td>
    <td style="color:var(--green)">₹${c.max}L</td>
    <td style="color:var(--slate);font-size:12px">${c.last}</td>
    <td><span class="badge ${c.status === 'Active' ? 'badge-green' : 'badge-red'}">${c.status}</span></td>
  </tr>`).join('');
}
function filterCompanies() { renderCompanies(); }

// ---- ADMIN ----
function renderAdminUsers() {
  const q    = (document.getElementById('adminSearch') || {}).value || '';
  const role = (document.getElementById('adminRole')   || {}).value || '';
  let users = USERS.filter(u => {
    if (q    && !u.name.toLowerCase().includes(q.toLowerCase()) && !u.email.toLowerCase().includes(q.toLowerCase())) return false;
    if (role && u.role !== role) return false;
    return true;
  });
  document.getElementById('adminUserTbody').innerHTML = users.map(u => `<tr>
    <td>${u.name}</td>
    <td style="color:var(--slate);font-size:11px">${u.email}</td>
    <td><span class="badge ${u.role==='Admin'?'badge-gold':u.role==='Alumni'?'badge-blue':'badge-purple'}">${u.role}</span></td>
    <td style="color:var(--slate);font-size:11px">${u.joined}</td>
    <td style="color:var(--slate);font-size:11px">${u.lastLogin}</td>
    <td><span class="badge ${u.status==='Active'?'badge-green':'badge-red'}">${u.status}</span></td>
    <td><button class="btn btn-outline btn-sm" onclick="alert('Edit user: ${u.name}')">Edit</button></td>
  </tr>`).join('');
}
function filterAdminUsers() { renderAdminUsers(); }

function switchAdminTab(tab, el) {
  document.querySelectorAll('#adminTabBar .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  ['Users','Settings','Logs'].forEach(t => {
    const el2 = document.getElementById('admin' + t);
    if (el2) el2.style.display = t === tab ? 'block' : 'none';
  });
}

function renderLogs() {
  document.getElementById('logsTbody').innerHTML = window._logs.map(l => `<tr>
    <td style="font-size:11px;color:var(--slate)">${l.ts}</td>
    <td>${l.user}</td>
    <td style="color:var(--gold2)">${l.action}</td>
    <td style="color:var(--slate);font-size:11px">${l.details}</td>
    <td style="font-size:11px;color:var(--slate)">${l.ip}</td>
  </tr>`).join('');
}

// ---- BRANCH PROGRESS ----
function renderBranchProgress() {
  const data = { CSE:94, ECE:88, IT:91, EE:82, ME:79, CE:75 };
  document.getElementById('branchProg').innerHTML = Object.entries(data).map(([b,v]) => `
    <div class="prog-row">
      <div class="prog-label"><span>${b}</span><span style="color:var(--gold2)">${v}%</span></div>
      <div class="prog-bar"><div class="prog-fill" style="width:${v}%"></div></div>
    </div>`).join('');
}

function renderRolesList() {
  const roles = [['Software Engineer','312'],['Data Analyst','184'],['Systems Engineer','156'],['Product Manager','89'],['ML/AI Engineer','67'],['DevOps Engineer','54']];
  document.getElementById('rolesList').innerHTML = roles.map(([r,n]) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:.4rem 0;border-bottom:1px solid rgba(201,168,76,.07)">
      <span style="font-size:12px;color:var(--text2)">${r}</span>
      <span class="badge badge-gold">${n}</span>
    </div>`).join('');
}

// ---- PAGINATION ----
function renderPagination(elId, total, per, current, key) {
  const pages = Math.ceil(total / per);
  const el = document.getElementById(elId);
  if (!el || pages <= 1) { if (el) el.innerHTML = ''; return; }
  let html = '';
  const start = Math.max(0, current - 2);
  const end   = Math.min(pages - 1, current + 2);
  if (start > 0) html += `<button class="page-btn" onclick="goPage('${key}',0)">1</button>`;
  for (let i = start; i <= end; i++) html += `<button class="page-btn ${i===current?'active':''}" onclick="goPage('${key}',${i})">${i+1}</button>`;
  if (end < pages-1) html += `<button class="page-btn" onclick="goPage('${key}',${pages-1})">${pages}</button>`;
  el.innerHTML = html;
}

function goPage(key, n) {
  if (key === 'alumniPage')  { window._alumniPage  = n; renderAlumni(); }
  if (key === 'studentPage') { window._studentPage = n; renderStudents(); }
  if (key === 'placPage')    { window._placPage    = n; renderPlacements(); }
}

// ---- MODAL ----
function openModal(html) {
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ---- CHARTS ----
function initCharts() {
  const textColor  = '#8a9ab8';
  const gridColor  = 'rgba(138,154,184,0.15)';
  const scaleOpts  = { ticks:{ color:textColor, font:{ size:10 } }, grid:{ color:gridColor } };

  // Dashboard: Yearly Placement Rate
  new Chart(document.getElementById('chartYrPlacement'), {
    type: 'bar',
    data: {
      labels: ['2018','2019','2020','2021','2022','2023','2024'],
      datasets: [{ data:[72,76,69,81,85,87,89], backgroundColor:['#c9a84c33','#c9a84c44','#c9a84c33','#c9a84c66','#c9a84c88','#c9a84c99','#c9a84c'], borderColor:'#c9a84c', borderWidth:1, borderRadius:4 }]
    },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:scaleOpts, y:{ ...scaleOpts, min:60, max:95, ticks:{ ...scaleOpts.ticks, callback:v=>v+'%' } } } }
  });

  // Dashboard: Salary Distribution
  new Chart(document.getElementById('chartSalDist'), {
    type: 'pie',
    data: {
      labels: ['<4L','4-6L','6-10L','10-15L','>15L'],
      datasets: [{ data:[8,28,38,18,8], backgroundColor:['#374151','#4b5563','#c9a84c','#e8c46a','#22c55e'], borderWidth:0 }]
    },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ color:textColor, font:{ size:10 }, boxWidth:10, padding:8 } } } }
  });

  // Dashboard: Top Companies
  new Chart(document.getElementById('chartCompany'), {
    type: 'bar',
    data: {
      labels: COMPANIES_DATA.slice(0,8).map(c=>c.name),
      datasets: [{ data:COMPANIES_DATA.slice(0,8).map(c=>c.hires), backgroundColor:'#c9a84c55', borderColor:'#c9a84c', borderWidth:1, borderRadius:4 }]
    },
    options: { indexAxis:'y', responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:scaleOpts, y:scaleOpts } }
  });

  // Analytics: Salary Trend
  new Chart(document.getElementById('chartSalTrend'), {
    type: 'line',
    data: {
      labels: ['2018','2019','2010','2021','2022','2023','2024'],
      datasets: [{ data:[5.2,5.8,5.4,6.3,7.1,7.9,8.6], borderColor:'#c9a84c', backgroundColor:'rgba(201,168,76,.1)', tension:.4, fill:true, pointBackgroundColor:'#c9a84c', pointRadius:4 }]
    },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:scaleOpts, y:{ ...scaleOpts, ticks:{ ...scaleOpts.ticks, callback:v=>'₹'+v+'L' } } } }
  });

  // Analytics: Sector-wise
  new Chart(document.getElementById('chartSector'), {
    type: 'doughnut',
    data: {
      labels: ['Technology','Finance','Consulting','Manufacturing','E-Commerce'],
      datasets: [{ data:[48,15,18,11,8], backgroundColor:['#c9a84c','#3b82f6','#a855f7','#22c55e','#f97316'], borderWidth:0, cutout:'68%' }]
    },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ color:textColor, font:{ size:10 }, boxWidth:10, padding:8 } } } }
  });

  // Analytics: Gender
  new Chart(document.getElementById('chartGender'), {
    type: 'doughnut',
    data: { labels:['Male','Female'], datasets:[{ data:[61,39], backgroundColor:['#3b82f6','#ec4899'], borderWidth:0, cutout:'65%' }] },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ color:textColor, font:{ size:10 }, boxWidth:10, padding:8 } } } }
  });

  // Analytics: Offer Type
  new Chart(document.getElementById('chartOfferType'), {
    type: 'bar',
    data: { labels:['On-Campus','Off-Campus','PPO'], datasets:[{ data:[58,30,12], backgroundColor:['#c9a84c','#3b82f6','#22c55e'], borderRadius:5, borderWidth:0 }] },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:scaleOpts, y:{ ...scaleOpts, ticks:{ ...scaleOpts.ticks, callback:v=>v+'%' } } } }
  });
}

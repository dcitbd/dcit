/**
 * DREAM CAREER IT - Complete Dynamic Admin Control Panel (admin/index.html)
 * Full CRUD for Certificates, Students, Payments, Admissions, Classes, Courses, Teachers & Settings
 */
function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

let currentTab = 'dashboard';
let flashMsg = '';

function isLogged() {
    return DCITStore.isLogged();
}

function setLogged(val) {
    DCITStore.setLogged(val);
}

function switchTab(tab, msg = '') {
    currentTab = tab;
    flashMsg = msg;
    renderAdminApp();
}

function renderAdminApp() {
    const root = document.getElementById('adminAppRoot');
    if (!isLogged()) {
        root.innerHTML = `
        <div style="margin:auto; width:100%; max-width:420px; background:#fff; padding:32px; border-radius:16px; box-shadow:0 15px 40px rgba(0,0,0,0.2); text-align:center;">
            <img src="../assets/img/logo.jpg" style="width:84px; height:84px; border-radius:50%; border:3px solid #0f766e; margin:0 auto 12px;">
            <h2>Dream Career IT</h2>
            <p style="color:#64748b; font-size:0.9rem; margin-bottom:18px;">ডাইনামিক এডমিন প্যানেল লগইন</p>
            <div id="loginErr"></div>
            <form id="spaLoginForm" style="text-align:left;">
                <div class="form-group"><label>ইউজারনেম অথবা ইমেইল</label><input type="text" id="lUser" class="form-control" value="admin" required></div>
                <div class="form-group"><label>পাসওয়ার্ড</label><input type="password" id="lPass" class="form-control" value="admin123" required></div>
                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; padding:11px;"><i class="fa fa-sign-in"></i> লগইন করুন</button>
            </form>
            <div style="background:#f0fdf4; border:1px dashed #16a34a; padding:10px; border-radius:8px; margin-top:14px; font-size:0.82rem; text-align:left;">
                <strong>লগইন তথ্যঃ</strong> ইউজারনেম: <code>admin</code> | পাসওয়ার্ড: <code>admin123</code>
            </div>
            <p style="margin-top:14px;"><a href="../index.html" style="color:#0f766e; font-weight:700; text-decoration:none;">&larr; মূল ওয়েবসাইটে ফিরে যান</a></p>
        </div>`;
        document.getElementById('spaLoginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const u = document.getElementById('lUser').value.trim();
            const p = document.getElementById('lPass').value.trim();
            if ((u === 'admin' || u === 'sagor' || u === 'dc13edubd@gmail.com') && p === 'admin123') {
                setLogged(true);
                renderAdminApp();
            } else {
                document.getElementById('loginErr').innerHTML = `<div class="alert alert-danger">ভুল ইউজারনেম বা পাসওয়ার্ড! (ডিফল্ট: admin / admin123)</div>`;
            }
        });
        return;
    }

    const db = DCITStore.getDB();
    const pendingAdm = (db.admissions || []).filter(a => a.status === 'Pending').length;

    root.innerHTML = `
    <aside class="dcp-sidebar">
        <div class="dcp-brand">
            <img src="../assets/img/logo.jpg" alt="Logo">
            <div>
                <h2>Dream Career IT</h2>
                <span>Dynamic Control Panel</span>
            </div>
        </div>
        <ul class="dcp-nav">
            <li><a href="#dashboard" onclick="switchTab('dashboard')" class="${currentTab==='dashboard'?'active':''}"><span><i class="fa fa-tachometer"></i> ড্যাশবোর্ড</span></a></li>
            <li><a href="#certificates" onclick="switchTab('certificates')" class="${currentTab==='certificates'?'active':''}"><span><i class="fa fa-certificate"></i> সার্টিফিকেট ম্যানেজমেন্ট</span></a></li>
            <li><a href="#students" onclick="switchTab('students')" class="${currentTab==='students'?'active':''}"><span><i class="fa fa-graduation-cap"></i> স্টুডেন্ট, বায়োডাটা ও রেজাল্ট</span></a></li>
            <li><a href="#payments" onclick="switchTab('payments')" class="${currentTab==='payments'?'active':''}"><span><i class="fa fa-money"></i> পেমেন্ট ও ক্যাশ মেমো</span></a></li>
            <li><a href="#admissions" onclick="switchTab('admissions')" class="${currentTab==='admissions'?'active':''}"><span><i class="fa fa-user-plus"></i> অনলাইন ভর্তি আবেদন</span> ${pendingAdm ? `<b class="dcp-badge">${pendingAdm}</b>` : ''}</a></li>
            <li><a href="#classes" onclick="switchTab('classes')" class="${currentTab==='classes'?'active':''}"><span><i class="fa fa-clock-o"></i> ক্লাস রুটিন ও ব্যাচ</span></a></li>
            <li><a href="#courses" onclick="switchTab('courses')" class="${currentTab==='courses'?'active':''}"><span><i class="fa fa-book"></i> কোর্স ও সিলেবাস</span></a></li>
            <li><a href="#teachers" onclick="switchTab('teachers')" class="${currentTab==='teachers'?'active':''}"><span><i class="fa fa-users"></i> শিক্ষক ও প্রশাসন</span></a></li>
            <li><a href="#settings" onclick="switchTab('settings')" class="${currentTab==='settings'?'active':''}"><span><i class="fa fa-cogs"></i> ওয়েবসাইট সেটিংস</span></a></li>
            <li style="margin-top:12px; border-top:1px solid rgba(255,255,255,0.1); padding-top:10px;">
                <a href="../index.html"><i class="fa fa-globe"></i> মূল ওয়েবসাইট দেখুন</a>
            </li>
            <li><a href="#logout" onclick="setLogged(false); renderAdminApp();" style="color:#fca5a5;"><i class="fa fa-sign-out"></i> লগআউট</a></li>
        </ul>
    </aside>
    <div class="dcp-main">
        <header class="dcp-topbar">
            <h1>Dream Career IT — এডমিন কন্ট্রোল প্যানেল</h1>
            <div class="dcp-user-bar">
                <span class="badge badge-info"><i class="fa fa-phone"></i> 01771770044</span>
                <a href="../index.html" class="btn btn-outline btn-xs"><i class="fa fa-external-link"></i> Live Website</a>
                <button onclick="setLogged(false); renderAdminApp();" class="btn btn-danger btn-xs"><i class="fa fa-power-off"></i> লগআউট</button>
            </div>
        </header>
        <main class="dcp-content" id="dcpTabBody">
            ${flashMsg ? `<div class="alert alert-success">${esc(flashMsg)}</div>` : ''}
        </main>
    </div>`;

    const body = document.getElementById('dcpTabBody');
    if (currentTab === 'dashboard') renderTabDashboard(body, db);
    else if (currentTab === 'certificates') renderTabCertificates(body, db);
    else if (currentTab === 'students') renderTabStudents(body, db);
    else if (currentTab === 'payments') renderTabPayments(body, db);
    else if (currentTab === 'admissions') renderTabAdmissions(body, db);
    else if (currentTab === 'classes') renderTabClasses(body, db);
    else if (currentTab === 'courses') renderTabCourses(body, db);
    else if (currentTab === 'teachers') renderTabTeachers(body, db);
    else if (currentTab === 'settings') renderTabSettings(body, db);
}

function renderTabDashboard(body, db) {
    const paid = (db.payments || []).reduce((s, p) => s + (Number(p.paid_amount)||0), 0);
    const due  = (db.payments || []).reduce((s, p) => s + (Number(p.due_amount)||0), 0);
    body.innerHTML += `
    <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-info"><h4>মোট স্টুডেন্ট</h4><h2>${(db.students||[]).length}</h2></div><div class="kpi-icon" style="background:#ccfbf1; color:#0f766e;"><i class="fa fa-graduation-cap"></i></div></div>
        <div class="kpi-card"><div class="kpi-info"><h4>ইস্যুকৃত সার্টিফিকেট</h4><h2>${(db.certificates||[]).length}</h2></div><div class="kpi-icon" style="background:#fef3c7; color:#d97706;"><i class="fa fa-certificate"></i></div></div>
        <div class="kpi-card"><div class="kpi-info"><h4>মোট পেমেন্ট কালেকশন</h4><h2>৳ ${paid.toLocaleString()}</h2></div><div class="kpi-icon" style="background:#dcfce7; color:#15803d;"><i class="fa fa-money"></i></div></div>
        <div class="kpi-card"><div class="kpi-info"><h4>মোট বকেয়া (Due)</h4><h2>৳ ${due.toLocaleString()}</h2></div><div class="kpi-icon" style="background:#fee2e2; color:#b91c1c;"><i class="fa fa-exclamation-circle"></i></div></div>
        <div class="kpi-card"><div class="kpi-info"><h4>মোট কোর্স</h4><h2>${(db.courses||[]).length}</h2></div><div class="kpi-icon" style="background:#e0e7ff; color:#4338ca;"><i class="fa fa-book"></i></div></div>
        <div class="kpi-card"><div class="kpi-info"><h4>ক্লাস টাইম স্লট</h4><h2>${(db.classes||[]).length}</h2></div><div class="kpi-icon" style="background:#fae8ff; color:#a21caf;"><i class="fa fa-clock-o"></i></div></div>
    </div>
    <div class="panel-card">
        <div class="panel-header"><h3>কুইক অ্যাকশন (Quick Management)</h3></div>
        <div class="panel-body" style="display:flex; gap:10px; flex-wrap:wrap;">
            <button onclick="switchTab('students')" class="btn btn-primary"><i class="fa fa-plus"></i> স্টুডেন্ট যোগ / ম্যানেজ</button>
            <button onclick="switchTab('certificates')" class="btn btn-accent"><i class="fa fa-certificate"></i> সার্টিফিকেট ইস্যু</button>
            <button onclick="switchTab('payments')" class="btn btn-success"><i class="fa fa-money"></i> পেমেন্ট ও ক্যাশ মেমো</button>
            <button onclick="switchTab('admissions')" class="btn btn-outline"><i class="fa fa-user-plus"></i> অনলাইন ভর্তি অনুমোদন</button>
            <button onclick="switchTab('courses')" class="btn btn-outline"><i class="fa fa-book"></i> কোর্স ম্যানেজমেন্ট</button>
            <button onclick="switchTab('classes')" class="btn btn-outline"><i class="fa fa-clock-o"></i> ক্লাস ও ব্যাচ</button>
            <button onclick="switchTab('teachers')" class="btn btn-outline"><i class="fa fa-users"></i> শিক্ষক ম্যানেজমেন্ট</button>
        </div>
    </div>`;
}

function renderTabCertificates(body, db) {
    const nextCert = 'DCIT-' + new Date().getFullYear() + '-' + String((db.certificates||[]).length + 1).padStart(6, '0');
    body.innerHTML += `
    <div class="panel-card">
        <div class="panel-header"><h3>নতুন সার্টিফিকেট ইস্যু করুন</h3></div>
        <div class="panel-body">
            <form id="addCertForm">
                <div class="form-grid">
                    <div class="form-group"><label>সার্টিফিকেট নং *</label><input type="text" name="cert_no" class="form-control" value="${nextCert}" required></div>
                    <div class="form-group"><label>রেজিস্ট্রেশন নং *</label><input type="text" name="reg_no" class="form-control" placeholder="000001" required></div>
                    <div class="form-group"><label>শিক্ষার্থীর নাম *</label><input type="text" name="student_name" class="form-control" required></div>
                    <div class="form-group"><label>পিতার নাম</label><input type="text" name="father_name" class="form-control"></div>
                    <div class="form-group"><label>মাতার নাম</label><input type="text" name="mother_name" class="form-control"></div>
                    <div class="form-group"><label>কোর্সের নাম *</label><input type="text" name="course_name" class="form-control" value="Advance Microsoft Office" required></div>
                    <div class="form-group"><label>গ্রেড *</label><input type="text" name="grade" class="form-control" value="A+" required></div>
                    <div class="form-group"><label>ইস্যু তারিখ *</label><input type="date" name="issue_date" class="form-control" value="${new Date().toISOString().slice(0,10)}" required></div>
                </div>
                <button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> সার্টিফিকেট ইস্যু করুন</button>
            </form>
        </div>
    </div>
    <div class="panel-card">
        <div class="panel-header"><h3>সকল ইস্যুকৃত সার্টিফিকেট তালিকা</h3></div>
        <div class="dcp-table-wrap"><table class="dcp-table">
            <thead><tr><th>সার্টিফিকেট নং</th><th>রেজিঃ নং</th><th>শিক্ষার্থীর নাম</th><th>কোর্স</th><th>গ্রেড</th><th>তারিখ</th><th>অ্যাকশন</th></tr></thead>
            <tbody>
                ${(db.certificates||[]).map((c, idx) => `
                <tr>
                    <td><strong>${esc(c.cert_no)}</strong></td>
                    <td>${esc(c.reg_no)}</td>
                    <td>${esc(c.student_name)}</td>
                    <td>${esc(c.course_name)}</td>
                    <td><span class="badge badge-success">${esc(c.grade)}</span></td>
                    <td>${esc(c.issue_date)}</td>
                    <td><button onclick="deleteRecord('certificates', ${idx})" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button></td>
                </tr>`).join('')}
            </tbody>
        </table></div>
    </div>`;

    document.getElementById('addCertForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const fd = new FormData(this);
        const curDB = DCITStore.getDB();
        curDB.certificates.unshift({
            id: Date.now(),
            cert_no: fd.get('cert_no'),
            reg_no: fd.get('reg_no'),
            student_name: fd.get('student_name'),
            father_name: fd.get('father_name'),
            mother_name: fd.get('mother_name'),
            course_name: fd.get('course_name'),
            batch_year: new Date().getFullYear(),
            session_quarter: 'January to March',
            duration: '3 Months',
            grade: fd.get('grade'),
            issue_date: fd.get('issue_date'),
            verification_code: 'VER-DCIT-' + fd.get('reg_no'),
            status: 'Issued'
        });
        DCITStore.saveDB(curDB);
        switchTab('certificates', 'নতুন সার্টিফিকেট সফলভাবে ইস্যু করা হয়েছে!');
    });
}

function renderTabStudents(body, db) {
    body.innerHTML += `
    <div class="panel-card">
        <div class="panel-header"><h3>নতুন স্টুডেন্ট, বায়োডাটা ও রেজাল্ট যোগ করুন</h3></div>
        <div class="panel-body">
            <form id="addStudentForm">
                <div class="form-grid">
                    <div class="form-group"><label>রেজিঃ নং *</label><input type="text" name="reg_no" class="form-control" value="${DCITStore.nextRegNo()}" required></div>
                    <div class="form-group"><label>রোল নং *</label><input type="text" name="roll_no" class="form-control" value="${DCITStore.nextRollNo()}" required></div>
                    <div class="form-group"><label>শিক্ষার্থীর নাম *</label><input type="text" name="name" class="form-control" required></div>
                    <div class="form-group"><label>পিতার নাম</label><input type="text" name="father_name" class="form-control"></div>
                    <div class="form-group"><label>মাতার নাম</label><input type="text" name="mother_name" class="form-control"></div>
                    <div class="form-group"><label>মোবাইল নম্বর *</label><input type="text" name="phone" class="form-control" required></div>
                    <div class="form-group"><label>কোর্সের নাম *</label><input type="text" name="course_name" class="form-control" value="Advance Microsoft Office" required></div>
                    <div class="form-group"><label>ক্লাস টাইম</label><input type="text" name="class_slot" class="form-control" value="8:00 AM - 9:30 AM"></div>
                    <div class="form-group"><label>রেজাল্ট / গ্রেড</label><input type="text" name="result_grade" class="form-control" value="A+"></div>
                    <div class="form-group"><label>সিজিপিএ (GPA)</label><input type="text" name="cgpa" class="form-control" value="5.00"></div>
                    <div class="form-group"><label>ঠিকানা</label><input type="text" name="present_address" class="form-control"></div>
                    <div class="form-group"><label>অভিজ্ঞতা (Bio-Data)</label><input type="text" name="experience" class="form-control" value="MS Office, Graphic Design, Internet & Freelancing"></div>
                </div>
                <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> স্টুডেন্ট সংরক্ষণ করুন</button>
            </form>
        </div>
    </div>
    <div class="panel-card">
        <div class="panel-header"><h3>সকল স্টুডেন্ট তালিকা (${(db.students||[]).length} জন)</h3></div>
        <div class="dcp-table-wrap"><table class="dcp-table">
            <thead><tr><th>রেজিঃ ও রোল</th><th>নাম ও পিতা</th><th>মোবাইল</th><th>কোর্স ও ক্লাস টাইম</th><th>রেজাল্ট</th><th>অ্যাকশন</th></tr></thead>
            <tbody>
                ${(db.students||[]).map((s, idx) => `
                <tr>
                    <td><strong>${esc(s.reg_no)}</strong> (Roll: ${esc(s.roll_no)})</td>
                    <td><strong>${esc(s.name)}</strong><br><small>পিতা: ${esc(s.father_name)}</small></td>
                    <td>${esc(s.phone)}</td>
                    <td>${esc(s.course_name)}<br><small>${esc(s.class_slot)}</small></td>
                    <td><span class="badge badge-success">${esc(s.result_grade)} (${esc(s.cgpa)})</span></td>
                    <td><button onclick="deleteRecord('students', ${idx})" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button></td>
                </tr>`).join('')}
            </tbody>
        </table></div>
    </div>`;

    document.getElementById('addStudentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const fd = new FormData(this);
        const curDB = DCITStore.getDB();
        curDB.students.unshift({
            id: Date.now(),
            reg_no: fd.get('reg_no'),
            roll_no: fd.get('roll_no'),
            name: fd.get('name'),
            father_name: fd.get('father_name'),
            mother_name: fd.get('mother_name'),
            phone: fd.get('phone'),
            course_name: fd.get('course_name'),
            class_slot: fd.get('class_slot'),
            result_grade: fd.get('result_grade'),
            cgpa: fd.get('cgpa'),
            present_address: fd.get('present_address'),
            permanent_address: fd.get('present_address'),
            experience: fd.get('experience'),
            batch_year: new Date().getFullYear(),
            session_quarter: 'January to March',
            batch_type: 'New Batch',
            photo: 'assets/img/logo.jpg',
            status: 'Active'
        });
        DCITStore.saveDB(curDB);
        switchTab('students', 'নতুন স্টুডেন্ট সফলভাবে যোগ করা হয়েছে!');
    });
}

function renderTabPayments(body, db) {
    const nextInv = 'INV-' + new Date().getFullYear() + '-' + String((db.payments||[]).length + 1).padStart(3, '0');
    body.innerHTML += `
    <div class="panel-card">
        <div class="panel-header"><h3>নতুন পেমেন্ট গ্রহণ ও ক্যাশ মেমো তৈরি করুন</h3></div>
        <div class="panel-body">
            <form id="addPayForm">
                <div class="form-grid">
                    <div class="form-group"><label>রিসিপ্ট নং *</label><input type="text" name="receipt_no" class="form-control" value="${nextInv}" required></div>
                    <div class="form-group"><label>স্টুডেন্ট রেজিঃ নং *</label><input type="text" name="reg_no" class="form-control" required placeholder="000001"></div>
                    <div class="form-group"><label>শিক্ষার্থীর নাম *</label><input type="text" name="student_name" class="form-control" required></div>
                    <div class="form-group"><label>কোর্সের নাম *</label><input type="text" name="course_name" class="form-control" value="Advance Microsoft Office" required></div>
                    <div class="form-group"><label>মোট ফি (৳) *</label><input type="number" name="total_fee" class="form-control" value="1500" required></div>
                    <div class="form-group"><label>জমা / পরিশোধিত (৳) *</label><input type="number" name="paid_amount" class="form-control" value="1500" required></div>
                    <div class="form-group"><label>মাধ্যম</label><select name="payment_method" class="form-control"><option>Cash</option><option>bKash</option><option>Nagad</option></select></div>
                    <div class="form-group"><label>তারিখ *</label><input type="date" name="payment_date" class="form-control" value="${new Date().toISOString().slice(0,10)}" required></div>
                </div>
                <button type="submit" class="btn btn-success"><i class="fa fa-check"></i> পেমেন্ট সেভ করুন</button>
            </form>
        </div>
    </div>
    <div class="panel-card">
        <div class="panel-header"><h3>সকল পেমেন্ট তালিকা</h3></div>
        <div class="dcp-table-wrap"><table class="dcp-table">
            <thead><tr><th>রিসিপ্ট নং</th><th>তারিখ</th><th>শিক্ষার্থী (রেজিঃ)</th><th>কোর্স</th><th>মোট ফি</th><th>পরিশোধিত</th><th>বকেয়া</th><th>অ্যাকশন</th></tr></thead>
            <tbody>
                ${(db.payments||[]).map((p, idx) => `
                <tr>
                    <td><strong>${esc(p.receipt_no)}</strong></td>
                    <td>${esc(p.payment_date)}</td>
                    <td>${esc(p.student_name)} (${esc(p.reg_no)})</td>
                    <td>${esc(p.course_name)}</td>
                    <td>৳${Number(p.total_fee)}</td>
                    <td style="color:#15803d; font-weight:700;">৳${Number(p.paid_amount)}</td>
                    <td style="color:#dc2626; font-weight:700;">৳${Number(p.due_amount)}</td>
                    <td>
                        <button onclick="printCashMemo(${idx})" class="btn btn-primary btn-xs"><i class="fa fa-print"></i> মেমো</button>
                        <button onclick="deleteRecord('payments', ${idx})" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>`).join('')}
            </tbody>
        </table></div>
    </div>`;

    document.getElementById('addPayForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const fd = new FormData(this);
        const tot = parseFloat(fd.get('total_fee')) || 0;
        const paid = parseFloat(fd.get('paid_amount')) || 0;
        const due = Math.max(0, tot - paid);
        const curDB = DCITStore.getDB();
        curDB.payments.unshift({
            id: Date.now(),
            receipt_no: fd.get('receipt_no'),
            reg_no: fd.get('reg_no'),
            student_name: fd.get('student_name'),
            course_name: fd.get('course_name'),
            total_fee: tot,
            paid_amount: paid,
            due_amount: due,
            payment_type: due <= 0 ? 'Full Course Fee' : 'Installment',
            payment_method: fd.get('payment_method'),
            trx_id: 'CASH',
            payment_date: fd.get('payment_date'),
            status: due <= 0 ? 'Paid' : 'Partial'
        });
        DCITStore.saveDB(curDB);
        switchTab('payments', 'পেমেন্ট রেকর্ড সংরক্ষণ করা হয়েছে!');
    });
}

function renderTabAdmissions(body, db) {
    body.innerHTML += `
    <div class="panel-card">
        <div class="panel-header"><h3>অনলাইন ভর্তি আবেদন তালিকা</h3></div>
        <div class="dcp-table-wrap"><table class="dcp-table">
            <thead><tr><th>আবেদন নং</th><th>নাম ও পিতা</th><th>মোবাইল ও ঠিকানা</th><th>কোর্স ও স্লট</th><th>ভর্তি ফি</th><th>স্ট্যাটাস</th><th>অ্যাকশন</th></tr></thead>
            <tbody>
                ${(db.admissions||[]).map((a, idx) => `
                <tr>
                    <td><strong>${esc(a.application_no)}</strong></td>
                    <td><strong>${esc(a.full_name)}</strong><br><small>পিতা: ${esc(a.father_name)}</small></td>
                    <td>${esc(a.phone)}<br><small>${esc(a.address)}</small></td>
                    <td>${esc(a.course_name)}<br><small>${esc(a.preferred_slot)}</small></td>
                    <td>৳${Number(a.paid_amount)} (${esc(a.payment_method)})</td>
                    <td><span class="badge ${a.status==='Approved'?'badge-success':'badge-warning'}">${esc(a.status)}</span></td>
                    <td>
                        ${a.status !== 'Approved' ? `<button onclick="approveAdmission(${idx})" class="btn btn-success btn-xs"><i class="fa fa-check"></i> অনুমোদন ও ভর্তি</button>` : ''}
                        <button onclick="deleteRecord('admissions', ${idx})" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>`).join('')}
            </tbody>
        </table></div>
    </div>`;
}

function approveAdmission(idx) {
    const curDB = DCITStore.getDB();
    const adm = curDB.admissions[idx];
    if (!adm) return;
    const regNo = DCITStore.nextRegNo();
    const rollNo = DCITStore.nextRollNo();
    adm.status = 'Approved';
    adm.enrolled_reg_no = regNo;
    curDB.students.unshift({
        id: Date.now(),
        reg_no: regNo,
        roll_no: rollNo,
        name: adm.full_name,
        father_name: adm.father_name,
        present_address: adm.address,
        permanent_address: adm.address,
        phone: adm.phone,
        email: adm.email,
        course_name: adm.course_name,
        class_slot: adm.preferred_slot,
        batch_year: new Date().getFullYear(),
        session_quarter: 'January to March',
        batch_type: 'New Batch',
        result_grade: 'Running',
        cgpa: '0.00',
        photo: 'assets/img/logo.jpg',
        status: 'Active'
    });
    DCITStore.saveDB(curDB);
    switchTab('admissions', `ভর্তি অনুমোদিত হয়েছে! নতুন স্টুডেন্ট রেজিঃ নং: ${regNo}`);
}

function renderTabClasses(body, db) {
    body.innerHTML += `
    <div class="panel-card">
        <div class="panel-header"><h3>নতুন ক্লাস টাইম স্লট / ব্যাচ যোগ করুন</h3></div>
        <div class="panel-body">
            <form id="addClassForm">
                <div class="form-grid">
                    <div class="form-group"><label>ক্লাস টাইম *</label><input type="text" name="time_label" class="form-control" placeholder="8:00 AM - 9:30 AM" required></div>
                    <div class="form-group"><label>ব্যাচের নাম *</label><input type="text" name="batch_name" class="form-control" placeholder="Morning Batch" required></div>
                    <div class="form-group"><label>কোর্স</label><input type="text" name="course_name" class="form-control" value="Advance Microsoft Office"></div>
                    <div class="form-group"><label>শিক্ষক</label><input type="text" name="teacher_name" class="form-control" value="DR. A.K.M Lokman"></div>
                    <div class="form-group"><label>রুম / ল্যাব</label><input type="text" name="room_no" class="form-control" value="Lab-01"></div>
                    <div class="form-group"><label>বার</label><input type="text" name="days_of_week" class="form-control" value="Sat, Mon, Wed"></div>
                </div>
                <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> সংরক্ষণ করুন</button>
            </form>
        </div>
    </div>
    <div class="panel-card">
        <div class="panel-header"><h3>সকল ক্লাস টাইম স্লট তালিকা</h3></div>
        <div class="dcp-table-wrap"><table class="dcp-table">
            <thead><tr><th>ক্লাস টাইম</th><th>ব্যাচ</th><th>কোর্স</th><th>শিক্ষক</th><th>ল্যাব ও বার</th><th>অ্যাকশন</th></tr></thead>
            <tbody>
                ${(db.classes||[]).map((cl, idx) => `
                <tr>
                    <td><strong>${esc(cl.time_label)}</strong></td>
                    <td>${esc(cl.batch_name)}</td>
                    <td>${esc(cl.course_name)}</td>
                    <td>${esc(cl.teacher_name)}</td>
                    <td>${esc(cl.room_no)} (${esc(cl.days_of_week)})</td>
                    <td><button onclick="deleteRecord('classes', ${idx})" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button></td>
                </tr>`).join('')}
            </tbody>
        </table></div>
    </div>`;

    document.getElementById('addClassForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const fd = new FormData(this);
        const curDB = DCITStore.getDB();
        curDB.classes.push({
            id: Date.now(),
            slot_code: 'slot-' + Date.now(),
            time_label: fd.get('time_label'),
            batch_name: fd.get('batch_name'),
            course_name: fd.get('course_name'),
            teacher_name: fd.get('teacher_name'),
            room_no: fd.get('room_no'),
            days_of_week: fd.get('days_of_week'),
            session_name: 'January to March',
            batch_year: new Date().getFullYear(),
            rules_text: 'ক্লাস শুরু হওয়ার ১০ মিনিট পূর্বে উপস্থিত থাকতে হবে।',
            max_seats: 20,
            status: 'Active'
        });
        DCITStore.saveDB(curDB);
        switchTab('classes', 'নতুন ক্লাস স্লট যুক্ত করা হয়েছে!');
    });
}

function renderTabCourses(body, db) {
    body.innerHTML += `
    <div class="panel-card">
        <div class="panel-header"><h3>নতুন কোর্স যোগ করুন</h3></div>
        <div class="panel-body">
            <form id="addCourseForm">
                <div class="form-grid">
                    <div class="form-group"><label>কোর্সের নাম (English) *</label><input type="text" name="title" class="form-control" required></div>
                    <div class="form-group"><label>কোর্সের নাম (বাংলায়) *</label><input type="text" name="title_bn" class="form-control" required></div>
                    <div class="form-group"><label>কোর্স ফি (৳) *</label><input type="number" name="fee" class="form-control" value="2000" required></div>
                    <div class="form-group"><label>মেয়াদ</label><input type="text" name="duration" class="form-control" value="3 Months"></div>
                    <div class="form-group"><label>মোট ক্লাস</label><input type="number" name="total_classes" class="form-control" value="36"></div>
                    <div class="form-group"><label>বিবরণ (বাংলায়)</label><input type="text" name="description_bn" class="form-control"></div>
                </div>
                <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> কোর্স সংরক্ষণ করুন</button>
            </form>
        </div>
    </div>
    <div class="panel-card">
        <div class="panel-header"><h3>সকল কোর্স তালিকা</h3></div>
        <div class="dcp-table-wrap"><table class="dcp-table">
            <thead><tr><th>কোর্সের নাম</th><th>বাংলা নাম</th><th>কোর্স ফি</th><th>মেয়াদ ও ক্লাস</th><th>অ্যাকশন</th></tr></thead>
            <tbody>
                ${(db.courses||[]).map((c, idx) => `
                <tr>
                    <td><strong>${esc(c.title)}</strong></td>
                    <td>${esc(c.title_bn)}</td>
                    <td style="color:#ea580c; font-weight:700;">৳${Number(c.fee)}</td>
                    <td>${esc(c.duration)} (${Number(c.total_classes)} Classes)</td>
                    <td><button onclick="deleteRecord('courses', ${idx})" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button></td>
                </tr>`).join('')}
            </tbody>
        </table></div>
    </div>`;

    document.getElementById('addCourseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const fd = new FormData(this);
        const curDB = DCITStore.getDB();
        curDB.courses.push({
            id: Date.now(),
            slug: 'course-' + Date.now(),
            title: fd.get('title'),
            title_bn: fd.get('title_bn'),
            fee: parseFloat(fd.get('fee')) || 0,
            duration: fd.get('duration'),
            class_duration: '1.30 Hours',
            weekly_days: '3 Days / Week',
            total_classes: parseInt(fd.get('total_classes'), 10) || 36,
            has_certificate: 1,
            description_bn: fd.get('description_bn'),
            image: 'assets/img/course-webdesign.jpg',
            status: 'Active'
        });
        DCITStore.saveDB(curDB);
        switchTab('courses', 'নতুন কোর্স সফলভাবে যুক্ত হয়েছে!');
    });
}

function renderTabTeachers(body, db) {
    body.innerHTML += `
    <div class="panel-card">
        <div class="panel-header"><h3>নতুন শিক্ষক যোগ করুন</h3></div>
        <div class="panel-body">
            <form id="addTeacherForm">
                <div class="form-grid">
                    <div class="form-group"><label>নাম *</label><input type="text" name="name" class="form-control" required></div>
                    <div class="form-group"><label>পদবী *</label><input type="text" name="designation" class="form-control" required></div>
                    <div class="form-group"><label>মোবাইল নম্বর *</label><input type="text" name="phone" class="form-control" required></div>
                    <div class="form-group"><label>ইমেইল</label><input type="email" name="email" class="form-control"></div>
                    <div class="form-group"><label>যোগ্যতা</label><input type="text" name="qualification" class="form-control"></div>
                    <div class="form-group"><label>ঠিকানা</label><input type="text" name="address" class="form-control"></div>
                </div>
                <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> শিক্ষক সংরক্ষণ করুন</button>
            </form>
        </div>
    </div>
    <div class="panel-card">
        <div class="panel-header"><h3>শিক্ষক ও কর্মকর্তা তালিকা</h3></div>
        <div class="dcp-table-wrap"><table class="dcp-table">
            <thead><tr><th>নাম</th><th>পদবী</th><th>মোবাইল</th><th>ইমেইল</th><th>অ্যাকশন</th></tr></thead>
            <tbody>
                ${(db.teachers||[]).map((t, idx) => `
                <tr>
                    <td><strong>${esc(t.name)}</strong></td>
                    <td>${esc(t.designation)}</td>
                    <td>${esc(t.phone)}</td>
                    <td>${esc(t.email)}</td>
                    <td><button onclick="deleteRecord('teachers', ${idx})" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button></td>
                </tr>`).join('')}
            </tbody>
        </table></div>
    </div>`;

    document.getElementById('addTeacherForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const fd = new FormData(this);
        const curDB = DCITStore.getDB();
        curDB.teachers.push({
            id: Date.now(),
            name: fd.get('name'),
            designation: fd.get('designation'),
            phone: fd.get('phone'),
            email: fd.get('email'),
            qualification: fd.get('qualification'),
            address: fd.get('address'),
            photo: 'assets/img/logo.jpg',
            status: 'Active'
        });
        DCITStore.saveDB(curDB);
        switchTab('teachers', 'নতুন শিক্ষক সফলভাবে যুক্ত হয়েছে!');
    });
}

function renderTabSettings(body, db) {
    body.innerHTML += `
    <div class="panel-card">
        <div class="panel-header">
            <h3>ওয়েবসাইট সেটিংস (Dream Career IT)</h3>
            <button onclick="if(confirm('ডিফল্ট ডাটা রিসেট করতে চান?')){DCITStore.resetDB(); switchTab('settings','ডিফল্ট ডাটা রিস্টোর হয়েছে!');}" class="btn btn-outline btn-xs">ডিফল্ট ডাটা রিসেট</button>
        </div>
        <div class="panel-body">
            <form id="saveSettingsForm">
                <div class="form-grid">
                    <div class="form-group"><label>প্রতিষ্ঠানের নাম (Training Center Name)</label><input type="text" name="site_name" class="form-control" value="${esc(DCITStore.setting('site_name', 'Dream Career IT'))}"></div>
                    <div class="form-group"><label>প্রধান মোবাইল নম্বর (Phone)</label><input type="text" name="phone_1" class="form-control" value="${esc(DCITStore.setting('phone_1', '01771770044'))}"></div>
                    <div class="form-group"><label>ইমেইল</label><input type="email" name="email_1" class="form-control" value="${esc(DCITStore.setting('email_1', 'dc13edubd@gmail.com'))}"></div>
                    <div class="form-group" style="grid-column:1/-1;"><label>ঠিকানা (বাংলায়)</label><input type="text" name="address_bn" class="form-control" value="${esc(DCITStore.setting('address_bn'))}"></div>
                    <div class="form-group" style="grid-column:1/-1;"><label>নোটিশ বার্তা</label><input type="text" name="notice_text" class="form-control" value="${esc(DCITStore.setting('notice_text'))}"></div>
                </div>
                <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> সেটিংস সংরক্ষণ করুন</button>
            </form>
        </div>
    </div>`;

    document.getElementById('saveSettingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const fd = new FormData(this);
        DCITStore.updateSettings({
            site_name: fd.get('site_name'),
            phone_1: fd.get('phone_1'),
            email_1: fd.get('email_1'),
            address_bn: fd.get('address_bn'),
            notice_text: fd.get('notice_text')
        });
        switchTab('settings', 'ওয়েবসাইট সেটিংস সফলভাবে আপডেট হয়েছে!');
    });
}

function deleteRecord(table, idx) {
    if (!confirm('আপনি কি নিশ্চিতভাবে এই রেকর্ডটি মুছে ফেলতে চান?')) return;
    const curDB = DCITStore.getDB();
    curDB[table].splice(idx, 1);
    DCITStore.saveDB(curDB);
    switchTab(currentTab, 'রেকর্ড মুছে ফেলা হয়েছে।');
}

document.addEventListener('DOMContentLoaded', function() {
    renderAdminApp();
});


function printCashMemo(idx) {
    const db = DCITStore.getDB();
    const inv = (db.payments || [])[idx];
    if (!inv) return;
    const body = document.getElementById('dcpTabBody');
    body.innerHTML = `
    <div style="max-width:750px; margin:0 auto;">
        <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
            <button onclick="switchTab('payments')" class="btn btn-outline btn-xs">&larr; পেমেন্ট তালিকায় ফিরে যান</button>
            <button onclick="window.print()" class="btn btn-primary btn-xs"><i class="fa fa-print"></i> মানি রিসিপ্ট প্রিন্ট করুন</button>
        </div>
        <div style="background:#fff; border:2px solid #0f766e; border-radius:12px; padding:28px;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px dashed #0f766e; padding-bottom:16px; margin-bottom:18px;">
                <img src="../assets/img/logo.jpg" style="width:68px; height:68px; border-radius:50%; border:2px solid #0f766e;">
                <div style="text-align:center; flex:1;">
                    <h2 style="margin:0; color:#151442;">Dream Career IT</h2>
                    <p style="font-size:0.86rem; color:#475569;">ভাই ভাই সুপার মার্কেট, পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা | ফোনঃ 01771770044</p>
                </div>
                <span class="badge badge-info" style="font-size:0.9rem; padding:6px 12px;">CASH MEMO</span>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:18px; font-size:0.92rem;">
                <div><strong>রিসিপ্ট নং:</strong> ${esc(inv.receipt_no)}</div>
                <div style="text-align:right;"><strong>তারিখ:</strong> ${esc(inv.payment_date)}</div>
                <div><strong>শিক্ষার্থীর নাম:</strong> ${esc(inv.student_name)}</div>
                <div style="text-align:right;"><strong>রেজিঃ নং:</strong> ${esc(inv.reg_no)}</div>
                <div><strong>মাধ্যম:</strong> ${esc(inv.payment_method)}</div>
                <div style="text-align:right;"><strong>স্ট্যাটাস:</strong> ${esc(inv.status)}</div>
            </div>
            <table class="dcp-table" style="min-width:100%; border:1px solid #cbd5e1; margin-bottom:36px;">
                <thead><tr><th>কোর্স / বিবরণ</th><th>মোট কোর্স ফি</th><th>জমা (Paid)</th><th>বকেয়া (Due)</th></tr></thead>
                <tbody>
                    <tr>
                        <td><strong>${esc(inv.course_name)}</strong></td>
                        <td>৳ ${Number(inv.total_fee).toFixed(2)}</td>
                        <td style="color:#15803d; font-weight:700;">৳ ${Number(inv.paid_amount).toFixed(2)}</td>
                        <td style="color:#dc2626; font-weight:700;">৳ ${Number(inv.due_amount).toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            <div style="display:flex; justify-content:space-between; margin-top:40px; font-size:0.85rem;">
                <div style="border-top:1px solid #334155; width:180px; text-align:center; padding-top:6px;">শিক্ষার্থীর স্বাক্ষর</div>
                <div style="border-top:1px solid #334155; width:180px; text-align:center; padding-top:6px;">কর্তৃপক্ষের স্বাক্ষর</div>
            </div>
        </div>
    </div>`;
}

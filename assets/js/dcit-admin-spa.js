/**
 * DREAM CAREER IT - Complete Enterprise Admin Control Panel (v3.0)
 * Features:
 * 1. 2-Step Animated Login + Live Time Lock (e.g. 01:25 AM -> 0125AM)
 * 2. Full Add / Edit / Delete CRUD synced with Customer Viewer Page
 * 3. Auto Secret Code Generator (Name + Course + Batch + Serial)
 * 4. Digital Counter Filters, Search, CSV Export & Print on every list
 * 5. Bulk Student Entry, 1-Click Transfer to Old Batch, Class Schedule Assign/Remove
 * 6. Year, Month & Batch-wise Student Report & Payment Report (View, Print, Download CSV)
 * 7. 1-Click Direct SMS / WhatsApp Sender & Quick View Popups
 */
function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

let currentTab = 'dashboard';
let flashMsg = '';
let subFilter = 'ALL';
let searchQuery = '';

function getTimeLockStrings() {
    const now = new Date();
    const makeCode = (d) => {
        let h = d.getHours();
        const m = d.getMinutes();
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        if (h === 0) h = 12;
        const hh = String(h).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        return {
            display: `${hh}:${mm} ${ampm}`,
            code: `${hh}${mm}${ampm}`,
            shortCode: `${h}${mm}${ampm}`
        };
    };
    const curr = makeCode(now);
    const prev = makeCode(new Date(now.getTime() - 60000));
    const next = makeCode(new Date(now.getTime() + 60000));
    return { curr, prev, next };
}

function openAdminModal(title, html) {
    const m = document.getElementById('dcpQuickModal');
    const t = document.getElementById('dcpModalTitle');
    const b = document.getElementById('dcpModalBody');
    if (t) t.innerHTML = title;
    if (b) b.innerHTML = html;
    if (m) m.classList.add('open');
}

function closeAdminModal() {
    const m = document.getElementById('dcpQuickModal');
    if (m) m.classList.remove('open');
}

function openSmsModal(name, phone, defaultMsg = '') {
    const cleanPhone = String(phone || '').replace(/[^0-9+]/g, '');
    const msg = defaultMsg || `প্রিয় ${name}, Dream Career IT (পদুয়ার বাজার, কুমিল্লা) থেকে আপনাকে শুভেচ্ছা। জরুরি যোগাযোগঃ 01771770044।`;
    openAdminModal(`💬 এক ক্লিকে মেসেজ পাঠান — ${esc(name)} (${esc(phone)})`, `
        <div>
            <div class="form-group">
                <label>প্রাপকের মোবাইল নাম্বার</label>
                <input type="text" id="smsPhoneInput" class="form-control" value="${esc(cleanPhone)}">
            </div>
            <div class="form-group">
                <label>রেডিমেড মেসেজ টেমপ্লেট সিলেক্ট করুন</label>
                <select onchange="document.getElementById('smsBodyInput').value=this.value" class="form-control">
                    <option value="${esc(msg)}">-- ডিফল্ট মেসেজ --</option>
                    <option value="প্রিয় ${esc(name)}, আপনার ভর্তি ও রেজিস্ট্রেশন সম্পন্ন হয়েছে। Dream Career IT, হটলাইনঃ 01771770044।">ভর্তি কনফার্মেশন মেসেজ</option>
                    <option value="প্রিয় ${esc(name)}, আপনার কোর্সের বকেয়া ফি দ্রুত পরিশোধ করার জন্য অনুরোধ করা হচ্ছে। Dream Career IT (01771770044)।">বকেয়া ফি রিমাইন্ডার মেসেজ</option>
                    <option value="প্রিয় ${esc(name)}, আপনার ফলাফল ও সার্টিফিকেট প্রকাশিত হয়েছে। গোপন কোড দিয়ে ওয়েবসাইট থেকে প্রিন্ট করুন।">রেজাল্ট ও সার্টিফিকেট মেসেজ</option>
                </select>
            </div>
            <div class="form-group">
                <label>মেসেজ বডি</label>
                <textarea id="smsBodyInput" class="form-control" rows="4">${esc(msg)}</textarea>
            </div>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <a href="sms:${esc(cleanPhone)}?body=${encodeURIComponent(msg)}" id="directSmsLink" class="btn btn-primary" onclick="this.href='sms:'+document.getElementById('smsPhoneInput').value+'?body='+encodeURIComponent(document.getElementById('smsBodyInput').value)">
                    <i class="fa fa-mobile"></i> সরাসরি মোবাইলে SMS পাঠান
                </a>
                <a href="https://wa.me/88${esc(cleanPhone)}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener noreferrer" class="btn btn-success" onclick="this.href='https://wa.me/88'+document.getElementById('smsPhoneInput').value+'?text='+encodeURIComponent(document.getElementById('smsBodyInput').value)">
                    <i class="fa fa-whatsapp"></i> WhatsApp-এ পাঠান
                </a>
            </div>
        </div>
    `);
}

function exportTableCSV(filename, headers, rows) {
    const csvContent = '\uFEFF' + [headers.join(',')].concat(
        rows.map(r => r.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    ).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function switchTab(tab, msg = '', filter = 'ALL') {
    currentTab = tab;
    flashMsg = msg;
    subFilter = filter;
    closeAdminModal();
    renderAdminApp();
}

function renderAdminApp() {
    const root = document.getElementById('adminAppRoot');
    clearInterval(window._timeLockInterval);

    // STEP 1: Username & Password Login
    if (!DCITStore.isStep1Passed() && !DCITStore.isLogged()) {
        root.innerHTML = `
        <div class="login-stage-wrap">
            <div class="login-anim-card">
                <img src="../assets/img/logo.jpg" alt="Dream Career IT">
                <h2 style="color:#151442; margin-bottom:4px;">Dream Career IT</h2>
                <p style="color:#0f766e; font-weight:700; font-size:0.9rem; margin-bottom:18px;">ধাপ ১/২ঃ এডমিন ইউজার ও পাসওয়ার্ড ভেরিফিকেশন</p>
                <div id="loginStep1Err"></div>
                <form id="spaLoginStep1Form" style="text-align:left;">
                    <div class="form-group">
                        <label><i class="fa fa-user"></i> ইউজারনেম অথবা ইমেইল *</label>
                        <input type="text" id="lUser" class="form-control" value="admin" required placeholder="admin">
                    </div>
                    <div class="form-group">
                        <label><i class="fa fa-lock"></i> পাসওয়ার্ড *</label>
                        <input type="password" id="lPass" class="form-control" value="admin123" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; padding:12px; font-size:0.96rem;">
                        <i class="fa fa-arrow-right"></i> পরবর্তী ধাপ (Time Lock Verification) &rarr;
                    </button>
                </form>
                <div style="background:#f0fdf4; border:1px dashed #16a34a; padding:10px; border-radius:8px; margin-top:16px; font-size:0.82rem; text-align:left;">
                    <strong>ডিফল্ট লগইনঃ</strong> ইউজার: <code>admin</code> | পাসওয়ার্ড: <code>admin123</code>
                </div>
                <p style="margin-top:14px;"><a href="../index.html" style="color:#0f766e; font-weight:700; text-decoration:none;">&larr; মূল ওয়েবসাইটে ফিরে যান</a></p>
            </div>
        </div>`;

        document.getElementById('spaLoginStep1Form').addEventListener('submit', function(e) {
            e.preventDefault();
            const u = document.getElementById('lUser').value.trim().toLowerCase();
            const p = document.getElementById('lPass').value.trim();
            if ((u === 'admin' || u === 'sagor' || u === 'dc13edubd@gmail.com') && p === 'admin123') {
                DCITStore.setStep1Passed(true);
                renderAdminApp();
            } else {
                document.getElementById('loginStep1Err').innerHTML = `<div class="alert alert-danger">ভুল ইউজারনেম বা পাসওয়ার্ড!</div>`;
            }
        });
        return;
    }

    // STEP 2: Animated Time Lock Security Verification (e.g. 01:25 AM -> 0125AM)
    if (!DCITStore.isLogged()) {
        const tl = getTimeLockStrings();
        root.innerHTML = `
        <div class="login-stage-wrap">
            <div class="login-anim-card" style="border-top-color:#0f766e;">
                <img src="../assets/img/logo.jpg" alt="Dream Career IT">
                <span class="badge badge-info" style="margin-bottom:6px;"><i class="fa fa-clock-o"></i> ধাপ ২/২ঃ টাইম-লক সিকিউরিটি (Time Lock)</span>
                <h2 style="color:#151442; margin-bottom:4px;">Time Lock Verification</h2>
                <p style="color:#475569; font-size:0.86rem;">বর্তমান ঘড়ির সময় অনুযায়ী কোলন ও স্পেস ছাড়া টাইম কোড লিখুন (যেমনঃ <strong id="tlExampleText">${tl.curr.display}</strong> হলে লিখুন <strong style="color:#ea580c;" id="tlCodeHint">${tl.curr.code}</strong>)</p>

                <div class="timelock-clock-badge" id="liveTimeLockClock">${tl.curr.display}</div>

                <div id="loginStep2Err"></div>
                <form id="spaLoginStep2Form" style="text-align:left;">
                    <div class="form-group">
                        <label><i class="fa fa-key"></i> টাইম লক কোড লিখুন (Format: HHMMAM/PM) *</label>
                        <input type="text" id="timeLockInput" class="form-control" required placeholder="যেমন: ${tl.curr.code}" style="text-align:center; font-size:1.2rem; font-weight:800; letter-spacing:2px; text-transform:uppercase;">
                    </div>
                    <button type="submit" class="btn btn-accent" style="width:100%; justify-content:center; padding:12px; font-size:0.96rem;">
                        <i class="fa fa-unlock-alt"></i> টাইম লক খুলে ড্যাশবোর্ডে প্রবেশ করুন
                    </button>
                </form>
                <div style="margin-top:14px; display:flex; justify-content:space-between; font-size:0.84rem;">
                    <a href="#back" onclick="DCITStore.setStep1Passed(false); renderAdminApp();" style="color:#64748b; text-decoration:none;">&larr; ইউজার লগইনে ফিরুন</a>
                    <a href="#autofill" onclick="document.getElementById('timeLockInput').value=getTimeLockStrings().curr.code; return false;" style="color:#0f766e; font-weight:700; text-decoration:none;"><i class="fa fa-magic"></i> বর্তমান টাইম বসিয়ে দিন</a>
                </div>
            </div>
        </div>`;

        window._timeLockInterval = setInterval(() => {
            const c = getTimeLockStrings().curr;
            const clk = document.getElementById('liveTimeLockClock');
            const ex = document.getElementById('tlExampleText');
            const hint = document.getElementById('tlCodeHint');
            if (clk) clk.textContent = c.display;
            if (ex) ex.textContent = c.display;
            if (hint) hint.textContent = c.code;
        }, 1000);

        document.getElementById('spaLoginStep2Form').addEventListener('submit', function(e) {
            e.preventDefault();
            const entered = document.getElementById('timeLockInput').value.replace(/[\s:]/g, '').toUpperCase();
            const validSet = getTimeLockStrings();
            const allowed = [
                validSet.curr.code, validSet.curr.shortCode,
                validSet.prev.code, validSet.prev.shortCode,
                validSet.next.code, validSet.next.shortCode
            ];
            if (allowed.includes(entered)) {
                clearInterval(window._timeLockInterval);
                DCITStore.setLogged(true);
                renderAdminApp();
            } else {
                document.getElementById('loginStep2Err').innerHTML = `<div class="alert alert-danger">টাইম লক কোড মিলেনি! বর্তমান সময় <strong>${validSet.curr.code}</strong> লিখে সাবমিট করুন।</div>`;
            }
        });
        return;
    }

    const db = DCITStore.getDB();
    const pendingAdm = (db.admissions || []).filter(a => a.status === 'Pending').length;
    const pendingPay = (db.payments || []).filter(p => Number(p.due_amount) > 0).length;

    root.innerHTML = `
    <aside class="dcp-sidebar">
        <div class="dcp-brand">
            <img src="../assets/img/logo.jpg" alt="Logo">
            <div>
                <h2>Dream Career IT</h2>
                <span>Enterprise Admin v3.0</span>
            </div>
        </div>
        <ul class="dcp-nav">
            <li><a href="#dashboard" onclick="switchTab('dashboard')" class="${currentTab==='dashboard'?'active':''}"><span><i class="fa fa-tachometer"></i> ড্যাশবোর্ড</span></a></li>
            <li><a href="#students" onclick="switchTab('students')" class="${currentTab==='students'?'active':''}"><span><i class="fa fa-graduation-cap"></i> স্টুডেন্ট ও বাল্ক এন্ট্রি</span></a></li>
            <li><a href="#certificates" onclick="switchTab('certificates')" class="${currentTab==='certificates'?'active':''}"><span><i class="fa fa-certificate"></i> সার্টিফিকেট ও গোপন কোড</span></a></li>
            <li><a href="#payments" onclick="switchTab('payments')" class="${currentTab==='payments'?'active':''}"><span><i class="fa fa-money"></i> পেমেন্ট ও বকেয়া হিসাব</span> ${pendingPay ? `<b class="dcp-badge">${pendingPay}</b>` : ''}</a></li>
            <li><a href="#admissions" onclick="switchTab('admissions')" class="${currentTab==='admissions'?'active':''}"><span><i class="fa fa-user-plus"></i> অনলাইন ভর্তি আবেদন</span> ${pendingAdm ? `<b class="dcp-badge">${pendingAdm}</b>` : ''}</a></li>
            <li><a href="#classes" onclick="switchTab('classes')" class="${currentTab==='classes'?'active':''}"><span><i class="fa fa-clock-o"></i> ক্লাস রুটিন ও ব্যাচ</span></a></li>
            <li><a href="#courses" onclick="switchTab('courses')" class="${currentTab==='courses'?'active':''}"><span><i class="fa fa-book"></i> কোর্স ও সিলেবাস</span></a></li>
            <li><a href="#teachers" onclick="switchTab('teachers')" class="${currentTab==='teachers'?'active':''}"><span><i class="fa fa-sitemap"></i> প্রশাসন (৫ ক্যাটাগরি)</span></a></li>
            <li><a href="#notices" onclick="switchTab('notices')" class="${currentTab==='notices'?'active':''}"><span><i class="fa fa-bell"></i> নোটিশ ও সাকসেস স্টোরি</span></a></li>
            <li><a href="#reports" onclick="switchTab('reports')" class="${currentTab==='reports'?'active':''}"><span><i class="fa fa-bar-chart"></i> স্টুডেন্ট ও পেমেন্ট রিপোর্ট</span></a></li>
            <li><a href="#settings" onclick="switchTab('settings')" class="${currentTab==='settings'?'active':''}"><span><i class="fa fa-cogs"></i> সেটিংস ও ডিসকাউন্ট</span></a></li>
            <li style="margin-top:10px; border-top:1px solid rgba(255,255,255,0.1); padding-top:8px;">
                <a href="../index.html"><i class="fa fa-globe"></i> কাস্টমার ভিউ পেজ দেখুন</a>
            </li>
            <li><a href="#logout" onclick="DCITStore.setLogged(false); renderAdminApp();" style="color:#fca5a5;"><i class="fa fa-sign-out"></i> লগআউট (Time Lock)</a></li>
        </ul>
    </aside>
    <div class="dcp-main">
        <header class="dcp-topbar">
            <h1>Dream Career IT — এডমিন কন্ট্রোল প্যানেল</h1>
            <div class="dcp-user-bar">
                <input type="search" id="globalAdminFilter" class="form-control" placeholder="টেবিলে দ্রুত সার্চ করুন..." style="width:210px;" oninput="filterActiveAdminTable(this.value)">
                <span class="badge badge-success"><i class="fa fa-shield"></i> Time-Lock Verified</span>
                <a href="../index.html" class="btn btn-outline btn-xs"><i class="fa fa-external-link"></i> Live Site</a>
                <button onclick="DCITStore.setLogged(false); renderAdminApp();" class="btn btn-danger btn-xs"><i class="fa fa-lock"></i> লক করুন</button>
            </div>
        </header>
        <main class="dcp-content" id="dcpTabBody">
            ${flashMsg ? `<div class="alert alert-success">${esc(flashMsg)}</div>` : ''}
        </main>
    </div>`;

    const body = document.getElementById('dcpTabBody');
    if (currentTab === 'dashboard') renderTabDashboard(body, db);
    else if (currentTab === 'students') renderTabStudents(body, db);
    else if (currentTab === 'certificates') renderTabCertificates(body, db);
    else if (currentTab === 'payments') renderTabPayments(body, db);
    else if (currentTab === 'admissions') renderTabAdmissions(body, db);
    else if (currentTab === 'classes') renderTabClasses(body, db);
    else if (currentTab === 'courses') renderTabCourses(body, db);
    else if (currentTab === 'teachers') renderTabTeachers(body, db);
    else if (currentTab === 'notices') renderTabNotices(body, db);
    else if (currentTab === 'reports') renderTabReports(body, db);
    else if (currentTab === 'settings') renderTabSettings(body, db);
}

function filterActiveAdminTable(q) {
    const val = String(q || '').toLowerCase();
    document.querySelectorAll('.dcp-table tbody tr').forEach(tr => {
        tr.style.display = tr.innerText.toLowerCase().includes(val) ? '' : 'none';
    });
}

/* ==========================================================================
   1. DASHBOARD TAB
   ========================================================================== */
function renderTabDashboard(body, db) {
    const paid = (db.payments || []).reduce((s, p) => s + (Number(p.paid_amount)||0), 0);
    const due  = (db.payments || []).reduce((s, p) => s + (Number(p.due_amount)||0), 0);
    const newB = (db.students || []).filter(s => s.batch_type === 'New Batch').length;
    const oldB = (db.students || []).filter(s => s.batch_type === 'Old Batch').length;

    body.innerHTML += `
    <div class="kpi-grid">
        <div class="kpi-card" onclick="switchTab('students')" style="cursor:pointer;"><div class="kpi-info"><h4>মোট স্টুডেন্ট (New: ${newB} | Old: ${oldB})</h4><h2>${(db.students||[]).length}</h2></div><div class="kpi-icon" style="background:#ccfbf1; color:#0f766e;"><i class="fa fa-graduation-cap"></i></div></div>
        <div class="kpi-card" onclick="switchTab('certificates')" style="cursor:pointer;"><div class="kpi-info"><h4>ইস্যুকৃত সার্টিফিকেট</h4><h2>${(db.certificates||[]).length}</h2></div><div class="kpi-icon" style="background:#fef3c7; color:#d97706;"><i class="fa fa-certificate"></i></div></div>
        <div class="kpi-card" onclick="switchTab('payments')" style="cursor:pointer;"><div class="kpi-info"><h4>মোট পেমেন্ট আদায়</h4><h2 style="color:#15803d;">৳ ${paid.toLocaleString()}</h2></div><div class="kpi-icon" style="background:#dcfce7; color:#15803d;"><i class="fa fa-money"></i></div></div>
        <div class="kpi-card" onclick="switchTab('payments','','DUE')" style="cursor:pointer;"><div class="kpi-info"><h4>পেন্ডিং / বকেয়া পেমেন্ট</h4><h2 style="color:#dc2626;">৳ ${due.toLocaleString()}</h2></div><div class="kpi-icon" style="background:#fee2e2; color:#b91c1c;"><i class="fa fa-exclamation-circle"></i></div></div>
        <div class="kpi-card" onclick="switchTab('admissions')" style="cursor:pointer;"><div class="kpi-info"><h4>অনলাইন ভর্তি আবেদন</h4><h2>${(db.admissions||[]).length}</h2></div><div class="kpi-icon" style="background:#ffedd5; color:#ea580c;"><i class="fa fa-user-plus"></i></div></div>
        <div class="kpi-card" onclick="switchTab('courses')" style="cursor:pointer;"><div class="kpi-info"><h4>মোট কোর্স</h4><h2>${(db.courses||[]).length}</h2></div><div class="kpi-icon" style="background:#e0e7ff; color:#4338ca;"><i class="fa fa-book"></i></div></div>
        <div class="kpi-card" onclick="switchTab('classes')" style="cursor:pointer;"><div class="kpi-info"><h4>ক্লাস রুটিন ও শিফট</h4><h2>${(db.classes||[]).length}</h2></div><div class="kpi-icon" style="background:#fae8ff; color:#a21caf;"><i class="fa fa-clock-o"></i></div></div>
        <div class="kpi-card" onclick="switchTab('teachers')" style="cursor:pointer;"><div class="kpi-info"><h4>প্রশাসন ও শিক্ষক</h4><h2>${(db.teachers||[]).length}</h2></div><div class="kpi-icon" style="background:#e0f2fe; color:#0369a1;"><i class="fa fa-sitemap"></i></div></div>
    </div>

    <div class="panel-card">
        <div class="panel-header"><h3><i class="fa fa-bolt"></i> কুইক ম্যানেজমেন্ট ও রিপোর্ট শর্টকাট</h3></div>
        <div class="panel-body" style="display:flex; gap:10px; flex-wrap:wrap;">
            <button onclick="switchTab('students')" class="btn btn-primary"><i class="fa fa-user-plus"></i> নতুন ও বাল্ক স্টুডেন্ট যুক্ত করুন</button>
            <button onclick="switchTab('payments','','DUE')" class="btn btn-danger"><i class="fa fa-exclamation-triangle"></i> পেন্ডিং পেমেন্ট তালিকা দেখুন</button>
            <button onclick="switchTab('reports')" class="btn btn-accent"><i class="fa fa-bar-chart"></i> সাল/মাস/ব্যাচ রিপোর্ট ডাউনলোড</button>
            <button onclick="switchTab('certificates')" class="btn btn-success"><i class="fa fa-certificate"></i> গোপন কোড ও সার্টিফিকেট ইস্যু</button>
            <button onclick="switchTab('admissions')" class="btn btn-outline"><i class="fa fa-check-square-o"></i> অনলাইন আবেদন অনুমোদন</button>
            <button onclick="switchTab('notices')" class="btn btn-outline"><i class="fa fa-bell"></i> নোটিশ ও সাকসেস স্টুডেন্ট</button>
        </div>
    </div>`;
}

/* ==========================================================================
   2. STUDENTS, BIO-DATA, SECRET CODE, BULK ENTRY & BATCH/SCHEDULE TRANSFER
   ========================================================================== */
function renderTabStudents(body, db) {
    const all = db.students || [];
    const newCnt = all.filter(s => s.batch_type === 'New Batch').length;
    const oldCnt = all.filter(s => s.batch_type === 'Old Batch').length;
    const compCnt = all.filter(s => s.status === 'Completed').length;

    let list = all;
    if (subFilter === 'NEW') list = all.filter(s => s.batch_type === 'New Batch');
    else if (subFilter === 'OLD') list = all.filter(s => s.batch_type === 'Old Batch');
    else if (subFilter === 'COMPLETED') list = all.filter(s => s.status === 'Completed');

    const courses = db.courses || [];
    const classes = db.classes || [];
    const nextReg = DCITStore.nextRegNo();
    const nextRoll = DCITStore.nextRollNo();
    const initSec = DCITStore.generateSecretCode('STUDENT', 'Advance Microsoft Office', new Date().getFullYear(), nextReg);

    body.innerHTML += `
    <!-- Digital Counter Filter, Search & Export Bar -->
    <div class="counter-filter-bar">
        <div class="counter-pills">
            <button onclick="switchTab('students','','ALL')" class="counter-pill ${subFilter==='ALL'?'active':''}">সকল স্টুডেন্ট <b>${all.length}</b></button>
            <button onclick="switchTab('students','','NEW')" class="counter-pill ${subFilter==='NEW'?'active':''}">বর্তমান ব্যাচ (New Batch) <b>${newCnt}</b></button>
            <button onclick="switchTab('students','','OLD')" class="counter-pill ${subFilter==='OLD'?'active':''}">পুরাতন ব্যাচ (Old Batch) <b>${oldCnt}</b></button>
            <button onclick="switchTab('students','','COMPLETED')" class="counter-pill ${subFilter==='COMPLETED'?'active':''}">কোর্স সম্পন্ন <b>${compCnt}</b></button>
        </div>
        <div style="display:flex; gap:8px;">
            <button onclick="openBulkStudentModal()" class="btn btn-accent btn-xs"><i class="fa fa-users"></i> বাল্ক স্টুডেন্ট যুক্ত করুন (Bulk Add)</button>
            <button onclick="exportStudentsCSV()" class="btn btn-success btn-xs"><i class="fa fa-download"></i> CSV এক্সপোর্ট</button>
            <button onclick="window.print()" class="btn btn-outline btn-xs"><i class="fa fa-print"></i> প্রিন্ট</button>
        </div>
    </div>

    <div class="panel-card">
        <div class="panel-header"><h3><i class="fa fa-user-plus"></i> নতুন স্টুডেন্ট যুক্ত / সম্পাদনা করুন (অটো গোপন কোড জেনারেশন সহ)</h3></div>
        <div class="panel-body">
            <form id="addStudentForm">
                <input type="hidden" id="stEditIdx" value="-1">
                <div class="form-grid">
                    <div class="form-group"><label>রেজিস্ট্রেশন নং *</label><input type="text" id="stReg" name="reg_no" class="form-control" value="${nextReg}" required></div>
                    <div class="form-group"><label>রোল নং *</label><input type="text" id="stRoll" name="roll_no" class="form-control" value="${nextRoll}" required></div>
                    <div class="form-group"><label>শিক্ষার্থীর নাম *</label><input type="text" id="stName" name="name" class="form-control" required oninput="autoUpdateStudentSecret()"></div>
                    <div class="form-group">
                        <label><i class="fa fa-key" style="color:#ea580c;"></i> স্টুডেন্ট গোপন কোড (অটো জেনারেটেড) *</label>
                        <input type="text" id="stSecret" name="secret_code" class="form-control" value="${initSec}" required style="background:#fffbeb; font-weight:800; color:#ea580c;">
                    </div>
                    <div class="form-group"><label>পিতার নাম *</label><input type="text" id="stFather" name="father_name" class="form-control" required></div>
                    <div class="form-group"><label>মাতার নাম *</label><input type="text" id="stMother" name="mother_name" class="form-control" required></div>
                    <div class="form-group"><label>মোবাইল নম্বর *</label><input type="text" id="stPhone" name="phone" class="form-control" required></div>
                    <div class="form-group">
                        <label>কোর্সের নাম *</label>
                        <select id="stCourse" name="course_name" class="form-control" onchange="autoUpdateStudentSecret()">
                            ${courses.map(c => `<option value="${esc(c.title)}">${esc(c.title)}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>ক্লাস শিডিউল / টাইম স্লট</label>
                        <select id="stSlot" name="class_slot" class="form-control">
                            <option value="Unassigned">-- শিডিউল ছাড়া --</option>
                            ${classes.map(cl => `<option value="${esc(cl.time_label)}">${esc(cl.time_label)} (${esc(cl.batch_name)})</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>ব্যাচের ধরন</label>
                        <select id="stBatchType" name="batch_type" class="form-control">
                            <option value="New Batch">New Batch (বর্তমান ব্যাচ)</option>
                            <option value="Old Batch">Old Batch (পুরাতন ব্যাচ)</option>
                        </select>
                    </div>
                    <div class="form-group"><label>ব্যাচ সাল (Year)</label><input type="number" id="stYear" name="batch_year" class="form-control" value="${new Date().getFullYear()}" oninput="autoUpdateStudentSecret()"></div>
                    <div class="form-group">
                        <label>ভর্তির মাস (Month)</label>
                        <select id="stMonth" name="admission_month" class="form-control">
                            ${['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => `<option value="${m}">${m}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>সেশন</label>
                        <select id="stSession" name="session_quarter" class="form-control">
                            <option>January to March</option><option>April to June</option><option>July to September</option><option>October to December</option>
                        </select>
                    </div>
                    <div class="form-group"><label>রেজাল্ট / গ্রেড</label><input type="text" id="stGrade" name="result_grade" class="form-control" value="A+"></div>
                    <div class="form-group"><label>সিজিপিএ (GPA)</label><input type="text" id="stCgpa" name="cgpa" class="form-control" value="5.00"></div>
                    <div class="form-group"><label>শিক্ষাগত যোগ্যতা ও প্রতিষ্ঠান</label><input type="text" id="stEdu" name="education" class="form-control" value="HSC" placeholder="যেমন: HSC (Cumilla Victoria College)"></div>
                    <div class="form-group"><label>পূর্ণ ঠিকানা</label><input type="text" id="stAddr" name="present_address" class="form-control"></div>
                    <div class="form-group"><label>অভিজ্ঞতা (Bio-Data)</label><input type="text" id="stExp" name="experience" class="form-control" value="MS Office, Graphic Design, Web Design & Freelancing"></div>
                </div>
                <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> স্টুডেন্ট তথ্য সংরক্ষণ করুন</button>
            </form>
        </div>
    </div>

    <div class="panel-card">
        <div class="panel-header"><h3><i class="fa fa-list"></i> স্টুডেন্ট তালিকা (${list.length} জন)</h3></div>
        <div class="dcp-table-wrap"><table class="dcp-table">
            <thead>
                <tr>
                    <th>রেজিঃ ও রোল</th>
                    <th>শিক্ষার্থীর নাম ও পিতা</th>
                    <th>গোপন কোড (Secret Code)</th>
                    <th>মোবাইল ও মেসেজ</th>
                    <th>কোর্স ও ক্লাস শিডিউল</th>
                    <th>ব্যাচ স্ট্যাটাস</th>
                    <th>রেজাল্ট</th>
                    <th>অ্যাকশন</th>
                </tr>
            </thead>
            <tbody>
                ${list.map((s) => {
                    const realIdx = all.findIndex(x => x.reg_no === s.reg_no);
                    return `
                    <tr>
                        <td><strong>Reg: ${esc(s.reg_no)}</strong><br><small>Roll: ${esc(s.roll_no)}</small></td>
                        <td><strong>${esc(s.name)}</strong><br><small>পিতা: ${esc(s.father_name)}</small></td>
                        <td><code style="background:#fffbeb; padding:3px 7px; border-radius:6px; border:1px solid #fde68a; color:#b45309; font-weight:800;">${esc(s.secret_code)}</code></td>
                        <td>
                            ${esc(s.phone)}<br>
                            <button onclick="openSmsModal('${esc(s.name)}','${esc(s.phone)}','প্রিয় ${esc(s.name)}, আপনার রেজিঃ নং: ${esc(s.reg_no)} এবং গোপন কোড: ${esc(s.secret_code)}। - Dream Career IT')" class="btn btn-success btn-xs" style="margin-top:3px;">
                                <i class="fa fa-comment"></i> মেসেজ পাঠান
                            </button>
                        </td>
                        <td>
                            <strong>${esc(s.course_name)}</strong><br>
                            <select onchange="changeStudentSlot(${realIdx}, this.value)" class="form-control" style="padding:3px 6px; font-size:0.78rem; margin-top:4px; width:165px;">
                                <option value="Unassigned" ${s.class_slot==='Unassigned'?'selected':''}>-- শিডিউল ছাড়া --</option>
                                ${classes.map(cl => `<option value="${esc(cl.time_label)}" ${s.class_slot===cl.time_label?'selected':''}>${esc(cl.time_label)}</option>`).join('')}
                            </select>
                        </td>
                        <td>
                            <span class="badge ${s.batch_type==='New Batch'?'badge-info':'badge-warning'}">${esc(s.batch_type)} (${esc(s.batch_year)})</span><br>
                            ${s.batch_type === 'New Batch' ? `
                                <button onclick="moveStudentBatch(${realIdx}, 'Old Batch')" class="btn btn-outline btn-xs" style="margin-top:4px;" title="কোর্স শেষ হলে পুরাতন ব্যাচে পাঠান">
                                    <i class="fa fa-check-circle"></i> কোর্স শেষ &rarr; পুরাতন ব্যাচ
                                </button>` : `
                                <button onclick="moveStudentBatch(${realIdx}, 'New Batch')" class="btn btn-outline btn-xs" style="margin-top:4px;">
                                    <i class="fa fa-refresh"></i> বর্তমান ব্যাচে আনুন
                                </button>`}
                        </td>
                        <td><span class="badge badge-success">${esc(s.result_grade)} (${esc(s.cgpa)})</span></td>
                        <td style="white-space:nowrap;">
                            <button onclick="quickViewStudent(${realIdx})" class="btn btn-outline btn-xs" title="কুইক ভিউ পপআপ"><i class="fa fa-eye"></i></button>
                            <button onclick="editStudentRow(${realIdx})" class="btn btn-primary btn-xs" title="এডিট"><i class="fa fa-edit"></i></button>
                            <button onclick="deleteRecord('students', ${realIdx})" class="btn btn-danger btn-xs" title="ডিলিট"><i class="fa fa-trash"></i></button>
                        </td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table></div>
    </div>`;

    document.getElementById('addStudentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const fd = new FormData(this);
        const curDB = DCITStore.getDB();
        const editIdx = parseInt(document.getElementById('stEditIdx').value, 10);
        const record = {
            id: editIdx >= 0 ? curDB.students[editIdx].id : Date.now(),
            reg_no: fd.get('reg_no'),
            roll_no: fd.get('roll_no'),
            secret_code: fd.get('secret_code'),
            name: fd.get('name'),
            father_name: fd.get('father_name'),
            mother_name: fd.get('mother_name'),
            phone: fd.get('phone'),
            course_name: fd.get('course_name'),
            class_slot: fd.get('class_slot'),
            batch_type: fd.get('batch_type'),
            batch_year: parseInt(fd.get('batch_year'), 10) || new Date().getFullYear(),
            admission_month: fd.get('admission_month'),
            session_quarter: fd.get('session_quarter'),
            result_grade: fd.get('result_grade'),
            cgpa: fd.get('cgpa'),
            education: fd.get('education'),
            school_college: fd.get('education'),
            present_address: fd.get('present_address'),
            permanent_address: fd.get('present_address'),
            experience: fd.get('experience'),
            photo: editIdx >= 0 ? curDB.students[editIdx].photo : 'assets/img/logo.jpg',
            status: fd.get('batch_type') === 'Old Batch' ? 'Completed' : 'Active'
        };
        if (editIdx >= 0) curDB.students[editIdx] = record;
        else curDB.students.unshift(record);

        // Also sync with certificates table so secret code works immediately!
        const cIdx = (curDB.certificates || []).findIndex(c => c.reg_no === record.reg_no);
        if (cIdx >= 0) {
            curDB.certificates[cIdx].secret_code = record.secret_code;
            curDB.certificates[cIdx].student_name = record.name;
            curDB.certificates[cIdx].grade = record.result_grade;
        } else {
            curDB.certificates.unshift({
                id: Date.now() + 1,
                cert_no: 'DCIT-' + record.batch_year + '-' + record.reg_no,
                reg_no: record.reg_no,
                roll_no: record.roll_no,
                secret_code: record.secret_code,
                student_name: record.name,
                father_name: record.father_name,
                mother_name: record.mother_name,
                course_name: record.course_name,
                batch_year: record.batch_year,
                session_quarter: record.session_quarter,
                duration: '3 Months',
                grade: record.result_grade,
                cgpa: record.cgpa,
                issue_date: new Date().toISOString().slice(0, 10),
                verification_code: 'VER-DCIT-' + record.reg_no,
                status: 'Issued'
            });
        }
        DCITStore.saveDB(curDB);
        switchTab('students', 'স্টুডেন্ট ও গোপন কোড সফলভাবে সংরক্ষণ করা হয়েছে!');
    });
}

function autoUpdateStudentSecret() {
    const editIdx = parseInt((document.getElementById('stEditIdx')||{}).value || '-1', 10);
    if (editIdx >= 0) return;
    const nm = (document.getElementById('stName')||{}).value || 'STD';
    const cr = (document.getElementById('stCourse')||{}).value || 'CRS';
    const yr = (document.getElementById('stYear')||{}).value || '2026';
    const rg = (document.getElementById('stReg')||{}).value || '001';
    const secEl = document.getElementById('stSecret');
    if (secEl) secEl.value = DCITStore.generateSecretCode(nm, cr, yr, rg);
}

function editStudentRow(idx) {
    const s = DCITStore.getDB().students[idx];
    if (!s) return;
    document.getElementById('stEditIdx').value = idx;
    document.getElementById('stReg').value = s.reg_no;
    document.getElementById('stRoll').value = s.roll_no;
    document.getElementById('stName').value = s.name;
    document.getElementById('stSecret').value = s.secret_code;
    document.getElementById('stFather').value = s.father_name || '';
    document.getElementById('stMother').value = s.mother_name || '';
    document.getElementById('stPhone').value = s.phone || '';
    document.getElementById('stCourse').value = s.course_name;
    document.getElementById('stSlot').value = s.class_slot;
    document.getElementById('stBatchType').value = s.batch_type;
    document.getElementById('stYear').value = s.batch_year;
    document.getElementById('stGrade').value = s.result_grade;
    document.getElementById('stCgpa').value = s.cgpa;
    document.getElementById('stEdu').value = s.education || '';
    document.getElementById('stAddr').value = s.present_address || '';
    document.getElementById('stExp').value = s.experience || '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function moveStudentBatch(idx, targetBatchType) {
    const curDB = DCITStore.getDB();
    if (!curDB.students[idx]) return;
    curDB.students[idx].batch_type = targetBatchType;
    curDB.students[idx].status = targetBatchType === 'Old Batch' ? 'Completed' : 'Active';
    DCITStore.saveDB(curDB);
    switchTab('students', `স্টুডেন্টকে সফলভাবে ${targetBatchType}-এ স্থানান্তর করা হয়েছে!`);
}

function changeStudentSlot(idx, newSlot) {
    const curDB = DCITStore.getDB();
    if (!curDB.students[idx]) return;
    curDB.students[idx].class_slot = newSlot;
    DCITStore.saveDB(curDB);
    switchTab('students', `স্টুডেন্টের ক্লাস শিডিউল (${newSlot}) আপডেট করা হয়েছে!`);
}

function quickViewStudent(idx) {
    const s = DCITStore.getDB().students[idx];
    if (!s) return;
    openAdminModal(`🎓 স্টুডেন্ট কুইক ভিউ — ${esc(s.name)}`, `
        <div>
            <p><strong>রেজিঃ নং:</strong> ${esc(s.reg_no)} | <strong>রোল:</strong> ${esc(s.roll_no)} | <strong>গোপন কোড:</strong> <code style="color:#ea580c; font-weight:800;">${esc(s.secret_code)}</code></p>
            <p><strong>পিতা:</strong> ${esc(s.father_name)} | <strong>মাতা:</strong> ${esc(s.mother_name)}</p>
            <p><strong>মোবাইল:</strong> ${esc(s.phone)} | <strong>ঠিকানা:</strong> ${esc(s.present_address)}</p>
            <p><strong>কোর্স:</strong> ${esc(s.course_name)} | <strong>ক্লাস টাইম:</strong> ${esc(s.class_slot)}</p>
            <p><strong>ব্যাচ:</strong> ${esc(s.batch_type)} (${esc(s.session_quarter)} - ${esc(s.batch_year)}) | <strong>রেজাল্ট:</strong> ${esc(s.result_grade)} (${esc(s.cgpa)})</p>
        </div>
    `);
}

function openBulkStudentModal() {
    openAdminModal('👥 বাল্ক স্টুডেন্ট যুক্ত করুন (Bulk Student Import)', `
        <div>
            <p style="font-size:0.88rem; color:#475569; margin-bottom:10px;">
                প্রতি লাইনে একজন স্টুডেন্টের তথ্য কমা (<code>,</code>) দিয়ে লিখুনঃ<br>
                <code>নাম, পিতার নাম, মোবাইল, কোর্সের নাম, ক্লাস টাইম, গ্রেড</code>
            </p>
            <textarea id="bulkStudentsText" class="form-control" rows="6" placeholder="Karim Uddin, Rahim Uddin, 01711223344, Advance Microsoft Office, 8:00 AM - 9:30 AM, A+&#10;Sumaiya Akter, Jamal Hossain, 01811223355, Graphic Design, 11:00 AM - 12:30 PM, A+"></textarea>
            <button onclick="processBulkStudents()" class="btn btn-primary" style="margin-top:12px; width:100%;"><i class="fa fa-check-circle"></i> এক ক্লিকে সকল স্টুডেন্ট যুক্ত করুন</button>
        </div>
    `);
}

function processBulkStudents() {
    const raw = (document.getElementById('bulkStudentsText')||{}).value || '';
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) return;
    const curDB = DCITStore.getDB();
    let added = 0;
    lines.forEach(line => {
        const parts = line.split(',').map(p => p.trim());
        if (parts[0]) {
            const regNo = DCITStore.nextRegNo();
            const rollNo = DCITStore.nextRollNo();
            const cName = parts[3] || 'Advance Microsoft Office';
            const sec = DCITStore.generateSecretCode(parts[0], cName, new Date().getFullYear(), regNo);
            curDB.students.unshift({
                id: Date.now() + added,
                reg_no: regNo,
                roll_no: rollNo,
                secret_code: sec,
                name: parts[0],
                father_name: parts[1] || 'N/A',
                mother_name: 'N/A',
                phone: parts[2] || '01771770044',
                course_name: cName,
                class_slot: parts[4] || '8:00 AM - 9:30 AM',
                result_grade: parts[5] || 'A+',
                cgpa: '5.00',
                batch_year: new Date().getFullYear(),
                admission_month: 'January',
                session_quarter: 'January to March',
                batch_type: 'New Batch',
                present_address: 'Cumilla',
                permanent_address: 'Cumilla',
                experience: 'Computer Application & IT',
                photo: 'assets/img/logo.jpg',
                status: 'Active'
            });
            added++;
        }
    });
    DCITStore.saveDB(curDB);
    switchTab('students', `${added} জন স্টুডেন্ট বাল্ক পদ্ধতিতে সফলভাবে যুক্ত হয়েছে!`);
}

function exportStudentsCSV() {
    const sList = DCITStore.getDB().students || [];
    exportTableCSV('DreamCareerIT_Students.csv',
        ['Reg No', 'Roll No', 'Secret Code', 'Name', 'Father Name', 'Phone', 'Course', 'Batch Type', 'Year', 'Class Slot', 'Grade'],
        sList.map(s => [s.reg_no, s.roll_no, s.secret_code, s.name, s.father_name, s.phone, s.course_name, s.batch_type, s.batch_year, s.class_slot, s.result_grade])
    );
}

/* ==========================================================================
   3. CERTIFICATES & SECRET CODE MANAGEMENT TAB
   ========================================================================== */
function renderTabCertificates(body, db) {
    const all = db.certificates || [];
    const nextCert = 'DCIT-' + new Date().getFullYear() + '-' + String(all.length + 1).padStart(6, '0');
    const students = db.students || [];

    body.innerHTML += `
    <div class="counter-filter-bar">
        <div class="counter-pills">
            <button class="counter-pill active">মোট ইস্যুকৃত সার্টিফিকেট <b>${all.length}</b></button>
        </div>
        <div style="display:flex; gap:8px;">
            <button onclick="exportTableCSV('Certificates.csv',['Cert No','Reg No','Secret Code','Student','Course','Grade','Date'],DCITStore.getDB().certificates.map(c=>[c.cert_no,c.reg_no,c.secret_code,c.student_name,c.course_name,c.grade,c.issue_date]))" class="btn btn-success btn-xs"><i class="fa fa-download"></i> CSV এক্সপোর্ট</button>
            <button onclick="window.print()" class="btn btn-outline btn-xs"><i class="fa fa-print"></i> প্রিন্ট</button>
        </div>
    </div>

    <div class="panel-card">
        <div class="panel-header"><h3>নতুন সার্টিফিকেট ইস্যু করুন (স্টুডেন্ট সিলেক্ট করলে গোপন কোড অটো বসবে)</h3></div>
        <div class="panel-body">
            <form id="addCertForm">
                <div class="form-group" style="background:#f0fdf4; padding:10px; border-radius:8px; border:1px dashed #16a34a;">
                    <label>স্টুডেন্ট তালিকা থেকে সিলেক্ট করুন (অটো-ফিল):</label>
                    <select onchange="fillCertFromStudent(this.value)" class="form-control">
                        <option value="">-- স্টুডেন্ট সিলেক্ট করুন --</option>
                        ${students.map((s, idx) => `<option value="${idx}">${esc(s.reg_no)} - ${esc(s.name)} (${esc(s.course_name)}) [Secret: ${esc(s.secret_code)}]</option>`).join('')}
                    </select>
                </div>
                <div class="form-grid">
                    <div class="form-group"><label>সার্টিফিকেট নং *</label><input type="text" id="ctNo" name="cert_no" class="form-control" value="${nextCert}" required></div>
                    <div class="form-group"><label>রেজিস্ট্রেশন নং *</label><input type="text" id="ctReg" name="reg_no" class="form-control" required></div>
                    <div class="form-group"><label>গোপন কোড (Secret Code) *</label><input type="text" id="ctSec" name="secret_code" class="form-control" required style="background:#fffbeb; font-weight:800; color:#ea580c;"></div>
                    <div class="form-group"><label>শিক্ষার্থীর নাম *</label><input type="text" id="ctName" name="student_name" class="form-control" required></div>
                    <div class="form-group"><label>পিতার নাম</label><input type="text" id="ctFather" name="father_name" class="form-control"></div>
                    <div class="form-group"><label>মাতার নাম</label><input type="text" id="ctMother" name="mother_name" class="form-control"></div>
                    <div class="form-group"><label>কোর্সের নাম *</label><input type="text" id="ctCourse" name="course_name" class="form-control" value="Advance Microsoft Office" required></div>
                    <div class="form-group"><label>গ্রেড *</label><input type="text" id="ctGrade" name="grade" class="form-control" value="A+" required></div>
                    <div class="form-group"><label>ইস্যু তারিখ *</label><input type="date" name="issue_date" class="form-control" value="${new Date().toISOString().slice(0,10)}" required></div>
                </div>
                <button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> সার্টিফিকেট ইস্যু ও সংরক্ষণ করুন</button>
            </form>
        </div>
    </div>

    <div class="panel-card">
        <div class="panel-header"><h3>সকল সার্টিফিকেট ও গোপন কোড তালিকা</h3></div>
        <div class="dcp-table-wrap"><table class="dcp-table">
            <thead><tr><th>সার্টিফিকেট নং</th><th>রেজিঃ নং</th><th>গোপন কোড (Secret Code)</th><th>শিক্ষার্থীর নাম</th><th>কোর্স</th><th>গ্রেড</th><th>তারিখ</th><th>অ্যাকশন</th></tr></thead>
            <tbody>
                ${all.map((c, idx) => `
                <tr>
                    <td><strong>${esc(c.cert_no)}</strong></td>
                    <td><strong>${esc(c.reg_no)}</strong></td>
                    <td><code style="background:#fffbeb; padding:3px 7px; border-radius:6px; color:#b45309; font-weight:800;">${esc(c.secret_code)}</code></td>
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
            secret_code: fd.get('secret_code'),
            student_name: fd.get('student_name'),
            father_name: fd.get('father_name'),
            mother_name: fd.get('mother_name'),
            course_name: fd.get('course_name'),
            batch_year: new Date().getFullYear(),
            session_quarter: 'January to March',
            duration: '3 Months',
            grade: fd.get('grade'),
            cgpa: '5.00',
            issue_date: fd.get('issue_date'),
            verification_code: 'VER-DCIT-' + fd.get('reg_no'),
            status: 'Issued'
        });
        DCITStore.saveDB(curDB);
        switchTab('certificates', 'সার্টিফিকেট সফলভাবে ইস্যু করা হয়েছে!');
    });
}

function fillCertFromStudent(idx) {
    if (idx === '') return;
    const s = DCITStore.getDB().students[Number(idx)];
    if (!s) return;
    document.getElementById('ctReg').value = s.reg_no;
    document.getElementById('ctSec').value = s.secret_code;
    document.getElementById('ctName').value = s.name;
    document.getElementById('ctFather').value = s.father_name || '';
    document.getElementById('ctMother').value = s.mother_name || '';
    document.getElementById('ctCourse').value = s.course_name;
    document.getElementById('ctGrade').value = s.result_grade;
}

/* ==========================================================================
   4. PAYMENTS, AUTO-CALC, PENDING DUE FILTER & 1-CLICK SMS REMINDER
   ========================================================================== */
function renderTabPayments(body, db) {
    const all = db.payments || [];
    const paidList = all.filter(p => Number(p.due_amount) <= 0);
    const dueList  = all.filter(p => Number(p.due_amount) > 0);
    const list = subFilter === 'DUE' ? dueList : (subFilter === 'PAID' ? paidList : all);
    const nextInv = 'INV-' + new Date().getFullYear() + '-' + String(all.length + 1).padStart(3, '0');
    let payMethods = ["Cash", "bKash (01771770044)", "Nagad (01771770044)", "Rocket (01771770044)", "Bank Transfer"];
    try {
        const pmRaw = DCITStore.setting('payment_methods_json', '');
        if (pmRaw) payMethods = JSON.parse(pmRaw);
    } catch(e){}

    body.innerHTML += `
    <div class="counter-filter-bar">
        <div class="counter-pills">
            <button onclick="switchTab('payments','','ALL')" class="counter-pill ${subFilter==='ALL'?'active':''}">সকল পেমেন্ট <b>${all.length}</b></button>
            <button onclick="switchTab('payments','','PAID')" class="counter-pill ${subFilter==='PAID'?'active':''}">পরিশোধিত (Paid) <b>${paidList.length}</b></button>
            <button onclick="switchTab('payments','','DUE')" class="counter-pill ${subFilter==='DUE'?'active':''}" style="border-color:#dc2626; color:${subFilter==='DUE'?'#fff':'#dc2626'};">পেন্ডিং / বকেয়া (Due) <b>${dueList.length}</b></button>
        </div>
        <div style="display:flex; gap:8px;">
            <button onclick="exportTableCSV('Payments.csv',['Receipt','Date','Reg No','Student','Course','Total','Paid','Due','Method'],DCITStore.getDB().payments.map(p=>[p.receipt_no,p.payment_date,p.reg_no,p.student_name,p.course_name,p.total_fee,p.paid_amount,p.due_amount,p.payment_method]))" class="btn btn-success btn-xs"><i class="fa fa-download"></i> CSV এক্সপোর্ট</button>
            <button onclick="window.print()" class="btn btn-outline btn-xs"><i class="fa fa-print"></i> প্রিন্ট</button>
        </div>
    </div>

    <div class="panel-card">
        <div class="panel-header"><h3>পেমেন্ট গ্রহণ ও অটো ডিউ ক্যালকুলেশন</h3></div>
        <div class="panel-body">
            <form id="addPayForm">
                <div class="form-grid">
                    <div class="form-group"><label>রিসিপ্ট নং *</label><input type="text" name="receipt_no" class="form-control" value="${nextInv}" required></div>
                    <div class="form-group"><label>স্টুডেন্ট রেজিঃ নং *</label><input type="text" name="reg_no" class="form-control" required placeholder="000001"></div>
                    <div class="form-group"><label>শিক্ষার্থীর নাম *</label><input type="text" name="student_name" class="form-control" required></div>
                    <div class="form-group"><label>মোবাইল নম্বর *</label><input type="text" name="phone" class="form-control" value="01771770044" required></div>
                    <div class="form-group"><label>কোর্সের নাম *</label><input type="text" name="course_name" class="form-control" value="Advance Microsoft Office" required></div>
                    <div class="form-group"><label>ব্যাচ নং</label><input type="text" name="batch_name" class="form-control" value="Batch-2026-01"></div>
                    <div class="form-group"><label>মোট ফি (Total Fee ৳) *</label><input type="number" id="pmTotal" name="total_fee" class="form-control" value="1500" required oninput="calcAdminPayDue()"></div>
                    <div class="form-group"><label>জমা / পেইড (Paid ৳) *</label><input type="number" id="pmPaid" name="paid_amount" class="form-control" value="1500" required oninput="calcAdminPayDue()"></div>
                    <div class="form-group"><label>বকেয়া (Due ৳ - অটো)</label><input type="number" id="pmDue" name="due_amount" class="form-control" value="0" readonly style="background:#f1f5f9; font-weight:800; color:#dc2626;"></div>
                    <div class="form-group">
                        <label>পেমেন্ট মেথড</label>
                        <select name="payment_method" class="form-control">
                            ${payMethods.map(m => `<option value="${esc(m)}">${esc(m)}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>মাস (Month)</label>
                        <select name="payment_month" class="form-control">
                            ${['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => `<option value="${m}">${m}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group"><label>তারিখ *</label><input type="date" name="payment_date" class="form-control" value="${new Date().toISOString().slice(0,10)}" required></div>
                </div>
                <button type="submit" class="btn btn-success"><i class="fa fa-check"></i> পেমেন্ট সেভ ও মেমো তৈরি করুন</button>
            </form>
        </div>
    </div>

    <div class="panel-card">
        <div class="panel-header"><h3>পেমেন্ট ও বকেয়া তালিকা (${list.length} টি)</h3></div>
        <div class="dcp-table-wrap"><table class="dcp-table">
            <thead><tr><th>রিসিপ্ট নং</th><th>তারিখ ও মাস</th><th>শিক্ষার্থী (রেজিঃ)</th><th>কোর্স ও ব্যাচ</th><th>মোট ফি</th><th>পেইড</th><th>বকেয়া (Due)</th><th>মাধ্যম</th><th>অ্যাকশন</th></tr></thead>
            <tbody>
                ${list.map((p) => {
                    const realIdx = all.findIndex(x => x.receipt_no === p.receipt_no);
                    return `
                    <tr>
                        <td><strong>${esc(p.receipt_no)}</strong></td>
                        <td>${esc(p.payment_date)}<br><small>${esc(p.payment_month || 'January')}</small></td>
                        <td><strong>${esc(p.student_name)}</strong> (${esc(p.reg_no)})<br><small>${esc(p.phone || '')}</small></td>
                        <td>${esc(p.course_name)}<br><small>${esc(p.batch_name || '')}</small></td>
                        <td>৳${Number(p.total_fee)}</td>
                        <td style="color:#15803d; font-weight:700;">৳${Number(p.paid_amount)}</td>
                        <td style="color:${Number(p.due_amount)>0?'#dc2626':'#64748b'}; font-weight:800;">৳${Number(p.due_amount)}</td>
                        <td>${esc(p.payment_method)}</td>
                        <td style="white-space:nowrap;">
                            ${Number(p.due_amount) > 0 ? `<button onclick="openSmsModal('${esc(p.student_name)}','${esc(p.phone || '01771770044')}','প্রিয় ${esc(p.student_name)}, আপনার ${esc(p.course_name)} কোর্সের বকেয়া ফি ৳${Number(p.due_amount)} দ্রুত পরিশোধ করার অনুরোধ করা হচ্ছে। - Dream Career IT')" class="btn btn-accent btn-xs"><i class="fa fa-comment"></i> বকেয়া SMS</button>` : ''}
                            <button onclick="printCashMemo(${realIdx})" class="btn btn-primary btn-xs"><i class="fa fa-print"></i> মেমো</button>
                            <button onclick="deleteRecord('payments', ${realIdx})" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>
                        </td>
                    </tr>`;
                }).join('')}
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
            phone: fd.get('phone'),
            course_name: fd.get('course_name'),
            batch_name: fd.get('batch_name'),
            payment_month: fd.get('payment_month'),
            payment_year: new Date().getFullYear(),
            total_fee: tot,
            paid_amount: paid,
            due_amount: due,
            payment_type: due <= 0 ? 'Full Course Fee' : 'Installment',
            payment_method: fd.get('payment_method'),
            payment_date: fd.get('payment_date'),
            status: due <= 0 ? 'Paid' : 'Partial'
        });
        DCITStore.saveDB(curDB);
        switchTab('payments', 'পেমেন্ট সফলভাবে সংরক্ষণ করা হয়েছে!');
    });
}

function calcAdminPayDue() {
    const t = parseFloat((document.getElementById('pmTotal')||{}).value) || 0;
    const p = parseFloat((document.getElementById('pmPaid')||{}).value) || 0;
    const d = document.getElementById('pmDue');
    if (d) d.value = Math.max(0, t - p);
}

/* ==========================================================================
   5. REPORTS TAB (Year, Month & Batch-wise Student & Payment Reports!)
   ========================================================================== */
function renderTabReports(body, db) {
    const yr = window._repYear || '';
    const mn = window._repMonth || '';
    const bt = window._repBatch || '';

    let stList = db.students || [];
    let pmList = db.payments || [];

    if (yr) {
        stList = stList.filter(s => String(s.batch_year) === String(yr));
        pmList = pmList.filter(p => String(p.payment_year || p.payment_date.slice(0,4)) === String(yr));
    }
    if (mn) {
        stList = stList.filter(s => (s.admission_month || 'January') === mn);
        pmList = pmList.filter(p => (p.payment_month || 'January') === mn);
    }
    if (bt) {
        stList = stList.filter(s => s.batch_type === bt || s.batch_no === bt);
        pmList = pmList.filter(p => (p.batch_name || '') === bt);
    }

    const totPaid = pmList.reduce((acc, p) => acc + (Number(p.paid_amount)||0), 0);
    const totDue  = pmList.reduce((acc, p) => acc + (Number(p.due_amount)||0), 0);

    body.innerHTML += `
    <div class="panel-card no-print">
        <div class="panel-header"><h3><i class="fa fa-filter"></i> সাল, মাস ও ব্যাচ অনুযায়ী স্টুডেন্ট ও পেমেন্ট রিপোর্ট ফিল্টার</h3></div>
        <div class="panel-body">
            <div class="form-grid" style="align-items:flex-end;">
                <div class="form-group">
                    <label>সাল (Year)</label>
                    <select onchange="window._repYear=this.value; renderAdminApp();" class="form-control">
                        <option value="">-- সকল সাল --</option>
                        ${[2026,2025,2024,2023,2022,2021,2020].map(y => `<option value="${y}" ${String(yr)===String(y)?'selected':''}>${y}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>মাস (Month)</label>
                    <select onchange="window._repMonth=this.value; renderAdminApp();" class="form-control">
                        <option value="">-- সকল মাস --</option>
                        ${['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => `<option value="${m}" ${mn===m?'selected':''}>${m}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>ব্যাচ (Batch)</label>
                    <select onchange="window._repBatch=this.value; renderAdminApp();" class="form-control">
                        <option value="">-- সকল ব্যাচ --</option>
                        <option value="New Batch" ${bt==='New Batch'?'selected':''}>New Batch</option>
                        <option value="Old Batch" ${bt==='Old Batch'?'selected':''}>Old Batch</option>
                    </select>
                </div>
                <div class="form-group" style="display:flex; gap:8px;">
                    <button onclick="window.print()" class="btn btn-primary"><i class="fa fa-print"></i> রিপোর্ট প্রিন্ট করুন</button>
                    <button onclick="exportStudentsCSV()" class="btn btn-success"><i class="fa fa-download"></i> স্টুডেন্ট CSV</button>
                </div>
            </div>
        </div>
    </div>

    <div class="panel-card">
        <div class="panel-header">
            <h3>📊 ১. স্টুডেন্ট রিপোর্ট (মোটঃ ${stList.length} জন)</h3>
        </div>
        <div class="dcp-table-wrap"><table class="dcp-table">
            <thead><tr><th>রেজিঃ নং</th><th>রোল</th><th>নাম</th><th>গোপন কোড</th><th>কোর্স</th><th>ব্যাচ ও সাল</th><th>মাস</th><th>রেজাল্ট</th></tr></thead>
            <tbody>
                ${stList.map(s => `<tr><td>${esc(s.reg_no)}</td><td>${esc(s.roll_no)}</td><td><strong>${esc(s.name)}</strong></td><td><code>${esc(s.secret_code)}</code></td><td>${esc(s.course_name)}</td><td>${esc(s.batch_type)} (${esc(s.batch_year)})</td><td>${esc(s.admission_month||'January')}</td><td>${esc(s.result_grade)}</td></tr>`).join('')}
            </tbody>
        </table></div>
    </div>

    <div class="panel-card">
        <div class="panel-header">
            <h3>💰 ২. পেমেন্ট রিপোর্ট (মোট আদায়ঃ ৳${totPaid.toLocaleString()} | মোট বকেয়াঃ ৳${totDue.toLocaleString()})</h3>
        </div>
        <div class="dcp-table-wrap"><table class="dcp-table">
            <thead><tr><th>রিসিপ্ট নং</th><th>তারিখ</th><th>শিক্ষার্থী (রেজিঃ)</th><th>কোর্স</th><th>মোট ফি</th><th>আদায় (Paid)</th><th>বকেয়া (Due)</th><th>মাধ্যম</th></tr></thead>
            <tbody>
                ${pmList.map(p => `<tr><td>${esc(p.receipt_no)}</td><td>${esc(p.payment_date)}</td><td><strong>${esc(p.student_name)}</strong> (${esc(p.reg_no)})</td><td>${esc(p.course_name)}</td><td>৳${Number(p.total_fee)}</td><td style="color:#15803d; font-weight:700;">৳${Number(p.paid_amount)}</td><td style="color:#dc2626; font-weight:700;">৳${Number(p.due_amount)}</td><td>${esc(p.payment_method)}</td></tr>`).join('')}
            </tbody>
        </table></div>
    </div>`;
}

/* ==========================================================================
   6. ONLINE ADMISSIONS TAB (Quick View, 1-Click SMS & Approve)
   ========================================================================== */
function renderTabAdmissions(body, db) {
    const all = db.admissions || [];
    const pend = all.filter(a => a.status === 'Pending');
    const list = subFilter === 'PENDING' ? pend : all;

    body.innerHTML += `
    <div class="counter-filter-bar">
        <div class="counter-pills">
            <button onclick="switchTab('admissions','','ALL')" class="counter-pill ${subFilter==='ALL'?'active':''}">সকল আবেদন <b>${all.length}</b></button>
            <button onclick="switchTab('admissions','','PENDING')" class="counter-pill ${subFilter==='PENDING'?'active':''}">পেন্ডিং আবেদন <b>${pend.length}</b></button>
        </div>
    </div>
    <div class="panel-card">
        <div class="panel-header"><h3>অনলাইন ভর্তি আবেদন তালিকা</h3></div>
        <div class="dcp-table-wrap"><table class="dcp-table">
            <thead><tr><th>আবেদন নং ও গোপন কোড</th><th>নাম ও পিতা</th><th>মোবাইল ও ডিসএবিলিটি</th><th>কোর্স ও স্লট</th><th>ফি, পেইড ও ডিউ</th><th>স্ট্যাটাস</th><th>অ্যাকশন</th></tr></thead>
            <tbody>
                ${list.map((a, idx) => `
                <tr>
                    <td><strong>${esc(a.application_no)}</strong><br><code style="color:#ea580c; font-weight:800;">${esc(a.secret_code||'')}</code></td>
                    <td><strong>${esc(a.full_name)}</strong><br><small>পিতা: ${esc(a.father_name)}</small></td>
                    <td>
                        ${esc(a.phone)}<br>
                        <span class="badge ${a.has_disability==='হ্যাঁ'?'badge-warning':'badge-info'}">Disabilities: ${esc(a.has_disability||'না')}</span>
                    </td>
                    <td>${esc(a.course_name)}<br><small>${esc(a.preferred_slot)}</small></td>
                    <td>মোট: ৳${Number(a.course_fee||1500)}<br><small style="color:#15803d;">পেইড: ৳${Number(a.paid_amount)}</small> | <small style="color:#dc2626;">ডিউ: ৳${Number(a.due_amount||0)}</small></td>
                    <td><span class="badge ${a.status==='Approved'?'badge-success':'badge-warning'}">${esc(a.status)}</span></td>
                    <td style="white-space:nowrap;">
                        <button onclick="quickViewAdmission(${idx})" class="btn btn-outline btn-xs" title="কুইক ভিউ"><i class="fa fa-eye"></i></button>
                        <button onclick="openSmsModal('${esc(a.full_name)}','${esc(a.phone)}','প্রিয় ${esc(a.full_name)}, আপনার অনলাইন ভর্তি আবেদন (${esc(a.application_no)}) গৃহীত হয়েছে। গোপন কোড: ${esc(a.secret_code)}। - Dream Career IT')" class="btn btn-primary btn-xs"><i class="fa fa-comment"></i> SMS</button>
                        ${a.status !== 'Approved' ? `<button onclick="approveAdmission(${idx})" class="btn btn-success btn-xs"><i class="fa fa-check"></i> অনুমোদন</button>` : ''}
                        <button onclick="deleteRecord('admissions', ${idx})" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>`).join('')}
            </tbody>
        </table></div>
    </div>`;
}

function quickViewAdmission(idx) {
    const a = DCITStore.getDB().admissions[idx];
    if (!a) return;
    openAdminModal(`📋 অনলাইন আবেদন কুইক ভিউ — ${esc(a.full_name)}`, `
        <div>
            <p><strong>আবেদন নং:</strong> ${esc(a.application_no)} | <strong>গোপন কোড:</strong> <code>${esc(a.secret_code)}</code></p>
            <p><strong>নাম:</strong> ${esc(a.full_name)} | <strong>পিতা:</strong> ${esc(a.father_name)} | <strong>মাতা:</strong> ${esc(a.mother_name||'')}</p>
            <p><strong>এনআইডি/জন্মনিবন্ধন:</strong> ${esc(a.nid_birth_reg||'')} | <strong>জন্ম তারিখ:</strong> ${esc(a.dob)}</p>
            <p><strong>মোবাইল:</strong> ${esc(a.phone)} | <strong>ঠিকানা:</strong> ${esc(a.address)}</p>
            <p><strong>শিক্ষা প্রতিষ্ঠান:</strong> ${esc(a.school_college)} (${esc(a.education)}) | <strong>মাধ্যম:</strong> ${esc(a.how_heard||'')}</p>
            <p><strong>ডিসএবিলিটি:</strong> ${esc(a.has_disability||'না')} (${Number(a.discount_percent||0)}% ডিসকাউন্ট)</p>
            <p><strong>কোর্স:</strong> ${esc(a.course_name)} | <strong>কোর্স ফি:</strong> ৳${Number(a.course_fee||1500)} | <strong>পেইড:</strong> ৳${Number(a.paid_amount)} | <strong>ডিউ:</strong> ৳${Number(a.due_amount||0)}</p>
            <p><strong>পেমেন্ট মেথড:</strong> ${esc(a.payment_method)} (TrxID: ${esc(a.trx_id)})</p>
        </div>
    `);
}

function approveAdmission(idx) {
    const curDB = DCITStore.getDB();
    const adm = curDB.admissions[idx];
    if (!adm) return;
    const regNo = DCITStore.nextRegNo();
    const rollNo = DCITStore.nextRollNo();
    const secCode = adm.secret_code || DCITStore.generateSecretCode(adm.full_name, adm.course_name, new Date().getFullYear(), regNo);
    adm.status = 'Approved';
    adm.enrolled_reg_no = regNo;

    curDB.students.unshift({
        id: Date.now(),
        reg_no: regNo,
        roll_no: rollNo,
        secret_code: secCode,
        name: adm.full_name,
        father_name: adm.father_name,
        mother_name: adm.mother_name || 'N/A',
        nid_birth_reg: adm.nid_birth_reg || '',
        present_address: adm.address,
        permanent_address: adm.address,
        phone: adm.phone,
        email: adm.email || '',
        dob: adm.dob,
        education: adm.education,
        school_college: adm.school_college,
        has_disability: adm.has_disability || 'না',
        course_name: adm.course_name,
        course_duration: adm.course_duration || '3 Months',
        class_slot: adm.preferred_slot,
        batch_year: new Date().getFullYear(),
        admission_month: 'January',
        session_quarter: 'January to March',
        batch_type: 'New Batch',
        result_grade: 'A+',
        cgpa: '5.00',
        photo: 'assets/img/logo.jpg',
        status: 'Active'
    });

    curDB.payments.unshift({
        id: Date.now() + 2,
        receipt_no: 'INV-' + new Date().getFullYear() + '-' + regNo.slice(-3),
        reg_no: regNo,
        student_name: adm.full_name,
        phone: adm.phone,
        course_name: adm.course_name,
        batch_name: 'Batch-' + new Date().getFullYear(),
        payment_month: 'January',
        payment_year: new Date().getFullYear(),
        total_fee: Number(adm.course_fee) || 1500,
        paid_amount: Number(adm.paid_amount) || 0,
        due_amount: Number(adm.due_amount) || 0,
        payment_method: adm.payment_method,
        payment_date: new Date().toISOString().slice(0, 10),
        status: Number(adm.due_amount) <= 0 ? 'Paid' : 'Partial'
    });

    DCITStore.saveDB(curDB);
    switchTab('admissions', `ভর্তি অনুমোদিত! রেজিঃ নং: ${regNo} এবং গোপন কোড: ${secCode}`);
}

/* ==========================================================================
   7. CLASSES, COURSES, TEACHERS (5 Categories), NOTICES & SETTINGS TABS
   ========================================================================== */
function renderTabClasses(body, db) {
    body.innerHTML += `
    <div class="panel-card">
        <div class="panel-header"><h3>নতুন ক্লাস রুটিন ও সময়সূচি যোগ করুন</h3></div>
        <div class="panel-body">
            <form id="addClassForm">
                <div class="form-grid">
                    <div class="form-group"><label>ক্লাস টাইম *</label><input type="text" name="time_label" class="form-control" placeholder="8:00 AM - 9:30 AM" required></div>
                    <div class="form-group"><label>ব্যাচের নাম *</label><input type="text" name="batch_name" class="form-control" placeholder="Morning Batch" required></div>
                    <div class="form-group"><label>কোর্স</label><input type="text" name="course_name" class="form-control" value="Advance Microsoft Office"></div>
                    <div class="form-group"><label>শিক্ষক</label><input type="text" name="teacher_name" class="form-control" value="DR. A.K.M Lokman"></div>
                    <div class="form-group"><label>রুম / ল্যাব</label><input type="text" name="room_no" class="form-control" value="Lab-01"></div>
                    <div class="form-group"><label>বার</label><input type="text" name="days_of_week" class="form-control" value="Sat, Mon, Wed"></div>
                    <div class="form-group" style="grid-column:1/-1;"><label>ক্লাস রুলস</label><input type="text" name="rules_text" class="form-control" value="ক্লাস শুরু হওয়ার ১০ মিনিট পূর্বে উপস্থিত থাকতে হবে।"></div>
                </div>
                <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> সংরক্ষণ করুন</button>
            </form>
        </div>
    </div>
    <div class="panel-card">
        <div class="panel-header"><h3>সকল ক্লাস শিডিউল ও স্টুডেন্ট সংখ্যা</h3></div>
        <div class="dcp-table-wrap"><table class="dcp-table">
            <thead><tr><th>ক্লাস টাইম</th><th>ব্যাচ</th><th>কোর্স ও শিক্ষক</th><th>ল্যাব ও বার</th><th>স্টুডেন্ট সংখ্যা</th><th>অ্যাকশন</th></tr></thead>
            <tbody>
                ${(db.classes||[]).map((cl, idx) => {
                    const stCnt = (db.students||[]).filter(s => s.class_slot === cl.time_label).length;
                    return `
                    <tr>
                        <td><strong>${esc(cl.time_label)}</strong></td>
                        <td>${esc(cl.batch_name)}</td>
                        <td>${esc(cl.course_name)}<br><small>${esc(cl.teacher_name)}</small></td>
                        <td>${esc(cl.room_no)} (${esc(cl.days_of_week)})</td>
                        <td><span class="badge badge-info">${stCnt} জন</span></td>
                        <td><button onclick="deleteRecord('classes', ${idx})" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button></td>
                    </tr>`;
                }).join('')}
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
            rules_text: fd.get('rules_text'),
            session_name: 'January to March',
            batch_year: new Date().getFullYear(),
            max_seats: 20,
            status: 'Active'
        });
        DCITStore.saveDB(curDB);
        switchTab('classes', 'নতুন ক্লাস রুটিন যুক্ত করা হয়েছে!');
    });
}

function renderTabCourses(body, db) {
    body.innerHTML += `
    <div class="panel-card">
        <div class="panel-header"><h3>নতুন কোর্স যোগ করুন (কাস্টমার ভিউ পেজে অটো যুক্ত হবে)</h3></div>
        <div class="panel-body">
            <form id="addCourseForm">
                <div class="form-grid">
                    <div class="form-group"><label>কোর্সের নাম (English) *</label><input type="text" name="title" class="form-control" required></div>
                    <div class="form-group"><label>কোর্সের নাম (বাংলায়) *</label><input type="text" name="title_bn" class="form-control" required></div>
                    <div class="form-group"><label>কোর্স ফি (৳) *</label><input type="number" name="fee" class="form-control" value="2000" required></div>
                    <div class="form-group"><label>মেয়াদ (Duration) *</label><input type="text" name="duration" class="form-control" value="3 Months" required></div>
                    <div class="form-group"><label>মোট ক্লাস</label><input type="number" name="total_classes" class="form-control" value="36"></div>
                    <div class="form-group"><label>বিবরণ (বাংলায়)</label><input type="text" name="description_bn" class="form-control"></div>
                </div>
                <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> কোর্স সংরক্ষণ করুন</button>
            </form>
        </div>
    </div>
    <div class="panel-card">
        <div class="panel-header"><h3>সকল কোর্স তালিকা (${(db.courses||[]).length} টি)</h3></div>
        <div class="dcp-table-wrap"><table class="dcp-table">
            <thead><tr><th>কোর্সের নাম</th><th>বাংলা নাম</th><th>কোর্স ফি</th><th>মেয়াদ ও ক্লাস</th><th>অ্যাকশন</th></tr></thead>
            <tbody>
                ${(db.courses||[]).map((c, idx) => `
                <tr>
                    <td><strong>${esc(c.title)}</strong></td>
                    <td>${esc(c.title_bn)}</td>
                    <td style="color:#ea580c; font-weight:800;">৳${Number(c.fee)}</td>
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
    const roles = ['শিক্ষক', 'ট্রেইনার', 'পরিচালক', 'ফাউন্ডার', 'সদস্য'];
    body.innerHTML += `
    <div class="panel-card">
        <div class="panel-header"><h3>প্রশাসন ও শিক্ষক যুক্ত করুন (শিক্ষক, ট্রেইনার, পরিচালক, ফাউন্ডার, সদস্য)</h3></div>
        <div class="panel-body">
            <form id="addTeacherForm">
                <div class="form-grid">
                    <div class="form-group"><label>নাম *</label><input type="text" name="name" class="form-control" required></div>
                    <div class="form-group"><label>পদবী *</label><input type="text" name="designation" class="form-control" required></div>
                    <div class="form-group">
                        <label>ক্যাটাগরি (Role Category) *</label>
                        <select name="role_type" class="form-control">
                            ${roles.map(r => `<option value="${r}">${r}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group"><label>মোবাইল নম্বর *</label><input type="text" name="phone" class="form-control" required></div>
                    <div class="form-group"><label>ইমেইল</label><input type="email" name="email" class="form-control"></div>
                    <div class="form-group"><label>ক্লাস রুটিন ও সময়সূচি তথ্য</label><input type="text" name="schedule_info" class="form-control" value="সকাল ৮:০০ - দুপুর ২:০০"></div>
                    <div class="form-group" style="grid-column:1/-1;"><label>সংক্ষিপ্ত পরিচিতি (Bio)</label><input type="text" name="bio" class="form-control"></div>
                </div>
                <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> সংরক্ষণ করুন</button>
            </form>
        </div>
    </div>
    <div class="panel-card">
        <div class="panel-header"><h3>প্রশাসন তালিকা (${(db.teachers||[]).length} জন)</h3></div>
        <div class="dcp-table-wrap"><table class="dcp-table">
            <thead><tr><th>নাম</th><th>ক্যাটাগরি</th><th>পদবী</th><th>মোবাইল ও মেসেজ</th><th>সময়সূচি</th><th>অ্যাকশন</th></tr></thead>
            <tbody>
                ${(db.teachers||[]).map((t, idx) => `
                <tr>
                    <td><strong>${esc(t.name)}</strong></td>
                    <td><span class="badge badge-info">${esc(t.role_type)}</span></td>
                    <td>${esc(t.designation)}</td>
                    <td>${esc(t.phone)} <button onclick="openSmsModal('${esc(t.name)}','${esc(t.phone)}')" class="btn btn-success btn-xs"><i class="fa fa-comment"></i></button></td>
                    <td><small>${esc(t.schedule_info||'')}</small></td>
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
            role_type: fd.get('role_type'),
            phone: fd.get('phone'),
            email: fd.get('email'),
            schedule_info: fd.get('schedule_info'),
            bio: fd.get('bio'),
            address: 'Poduar Bazar, Cumilla',
            photo: 'assets/img/logo.jpg',
            status: 'Active'
        });
        DCITStore.saveDB(curDB);
        switchTab('teachers', 'নতুন কর্মকর্তা/শিক্ষক যুক্ত হয়েছে!');
    });
}

function renderTabNotices(body, db) {
    body.innerHTML += `
    <div class="panel-card">
        <div class="panel-header"><h3>নতুন নোটিশ প্রকাশ করুন</h3></div>
        <div class="panel-body">
            <form id="addNoticeForm">
                <div class="form-grid">
                    <div class="form-group"><label>নোটিশের শিরোনাম *</label><input type="text" name="title" class="form-control" required></div>
                    <div class="form-group"><label>ক্যাটাগরি</label><input type="text" name="category" class="form-control" value="ভর্তি ও ক্লাস বিজ্ঞপ্তি"></div>
                    <div class="form-group"><label>তারিখ *</label><input type="date" name="publish_date" class="form-control" value="${new Date().toISOString().slice(0,10)}" required></div>
                    <div class="form-group" style="grid-column:1/-1;"><label>বিস্তারিত বিবরণ *</label><textarea name="details" class="form-control" rows="2" required></textarea></div>
                </div>
                <button type="submit" class="btn btn-primary"><i class="fa fa-bullhorn"></i> নোটিশ প্রকাশ করুন</button>
            </form>
        </div>
    </div>
    <div class="panel-card">
        <div class="panel-header"><h3>সকল নোটিশ তালিকা</h3></div>
        <div class="dcp-table-wrap"><table class="dcp-table">
            <thead><tr><th>তারিখ</th><th>শিরোনাম</th><th>ক্যাটাগরি</th><th>বিবরণ</th><th>অ্যাকশন</th></tr></thead>
            <tbody>
                ${(db.notices||[]).map((n, idx) => `<tr><td>${esc(n.publish_date)}</td><td><strong>${esc(n.title)}</strong></td><td>${esc(n.category)}</td><td><small>${esc(n.details)}</small></td><td><button onclick="deleteRecord('notices', ${idx})" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button></td></tr>`).join('')}
            </tbody>
        </table></div>
    </div>`;

    document.getElementById('addNoticeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const fd = new FormData(this);
        const curDB = DCITStore.getDB();
        curDB.notices = curDB.notices || [];
        curDB.notices.unshift({
            id: Date.now(),
            title: fd.get('title'),
            category: fd.get('category'),
            publish_date: fd.get('publish_date'),
            details: fd.get('details'),
            status: 'Active'
        });
        DCITStore.saveDB(curDB);
        switchTab('notices', 'নতুন নোটিশ প্রকাশিত হয়েছে!');
    });
}

function renderTabSettings(body, db) {
    let payMethodsStr = "bKash (01771770044), Nagad (01771770044), Rocket (01771770044), Bank Transfer, Cash";
    try {
        const pm = JSON.parse(DCITStore.setting('payment_methods_json', '[]'));
        if (pm.length) payMethodsStr = pm.join(', ');
    } catch(e){}

    body.innerHTML += `
    <div class="panel-card">
        <div class="panel-header">
            <h3>ওয়েবসাইট সেটিংস, পেমেন্ট মেথড ও ডিসএবিলিটি ডিসকাউন্ট কনফিগারেশন</h3>
            <button onclick="if(confirm('ডিফল্ট ডাটা রিসেট করতে চান?')){DCITStore.resetDB(); switchTab('settings','ডিফল্ট ডাটা রিস্টোর হয়েছে!');}" class="btn btn-outline btn-xs">ডিফল্ট ডাটা রিসেট</button>
        </div>
        <div class="panel-body">
            <form id="saveSettingsForm">
                <div class="form-grid">
                    <div class="form-group"><label>প্রতিষ্ঠানের নাম (Site Name)</label><input type="text" name="site_name" class="form-control" value="${esc(DCITStore.setting('site_name', 'Dream Career IT'))}"></div>
                    <div class="form-group"><label>স্লোগান (Slogan)</label><input type="text" name="site_slogan" class="form-control" value="${esc(DCITStore.setting('site_slogan'))}"></div>
                    <div class="form-group"><label>প্রধান মোবাইল নম্বর (Phone)</label><input type="text" name="phone_1" class="form-control" value="${esc(DCITStore.setting('phone_1', '01771770044'))}"></div>
                    <div class="form-group"><label>ডিসএবিলিটি ডিসকাউন্ট পার্সেন্টেজ (%)</label><input type="number" name="disability_discount_percent" class="form-control" value="${esc(DCITStore.setting('disability_discount_percent', '25'))}"></div>
                    <div class="form-group" style="grid-column:1/-1;"><label>পেমেন্ট মেথড সমূহ (কমা দিয়ে লিখুন — ভর্তি ফর্মে অটো যুক্ত হবে)</label><input type="text" name="payment_methods" class="form-control" value="${esc(payMethodsStr)}"></div>
                    <div class="form-group" style="grid-column:1/-1;"><label>ঠিকানা (বাংলায়)</label><input type="text" name="address_bn" class="form-control" value="${esc(DCITStore.setting('address_bn'))}"></div>
                    <div class="form-group" style="grid-column:1/-1;"><label>স্ক্রলিং নোটিশ বার্তা (Marquee Notice)</label><input type="text" name="notice_text" class="form-control" value="${esc(DCITStore.setting('notice_text'))}"></div>
                </div>
                <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> সকল সেটিংস আপডেট করুন</button>
            </form>
        </div>
    </div>`;

    document.getElementById('saveSettingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const fd = new FormData(this);
        const pmArr = String(fd.get('payment_methods')||'').split(',').map(s=>s.trim()).filter(Boolean);
        DCITStore.updateSettings({
            site_name: fd.get('site_name'),
            site_slogan: fd.get('site_slogan'),
            phone_1: fd.get('phone_1'),
            disability_discount_percent: fd.get('disability_discount_percent'),
            payment_methods_json: JSON.stringify(pmArr),
            address_bn: fd.get('address_bn'),
            notice_text: fd.get('notice_text')
        });
        switchTab('settings', 'ওয়েবসাইট সেটিংস, পেমেন্ট মেথড ও ডিসকাউন্ট সফলভাবে আপডেট হয়েছে!');
    });
}

function printCashMemo(idx) {
    const db = DCITStore.getDB();
    const inv = (db.payments || [])[idx];
    if (!inv) return;
    const body = document.getElementById('dcpTabBody');
    body.innerHTML = `
    <div style="max-width:750px; margin:0 auto;">
        <div class="no-print" style="display:flex; justify-content:space-between; margin-bottom:15px;">
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

function deleteRecord(table, idx) {
    if (!confirm('আপনি কি নিশ্চিতভাবে এই রেকর্ডটি মুছে ফেলতে চান?')) return;
    const curDB = DCITStore.getDB();
    curDB[table].splice(idx, 1);
    DCITStore.saveDB(curDB);
    switchTab(currentTab, 'রেকর্ড মুছে ফেলা হয়েছে।', subFilter);
}

document.addEventListener('DOMContentLoaded', function() {
    renderAdminApp();
});

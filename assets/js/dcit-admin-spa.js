/**
 * DREAM CAREER IT - Enterprise Admin Control Panel Engine (v5.0)
 */
function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

let currentTab = 'dashboard';
let subFilter = 'ALL';
window._admPaging = { page: 1, perPage: 30 };
window._stSearch = { year: '', batch: '', duration: '', status: '' };
window._repFilter = { type: 'COMBINED', year: '', month: '', batch: '' };
window._dynamicCourseClasses = [
    { num: 'Class 01 - 04', type: 'Theory & Practical', desc: 'Computer Fundamental, Keyboard, Mouse & Typing Practice' },
    { num: 'Class 05 - 15', type: 'Practical Lab', desc: 'MS Word Document Design, Page Setup, Table & Official Formatting' }
];

function showAdminToast(type, title, msg) {
    const old = document.querySelector('.awesome-toast');
    if (old) old.remove();
    const div = document.createElement('div');
    div.className = 'awesome-toast ' + (type === 'error' ? 'error' : (type === 'warning' ? 'warning' : 'success'));
    const icon = type === 'error' ? 'fa-times-circle' : (type === 'warning' ? 'fa-exclamation-triangle' : 'fa-check-circle');
    const icColor = type === 'error' ? '#ef4444' : (type === 'warning' ? '#f59e0b' : '#10b981');
    div.innerHTML = `
        <i class="fa ${icon}" style="font-size:1.85rem; color:${icColor};"></i>
        <div style="flex:1;">
            <strong style="display:block; font-size:0.95rem; margin-bottom:2px;">${esc(title)}</strong>
            <span style="font-size:0.85rem; color:#cbd5e1;">${esc(msg)}</span>
        </div>
        <button onclick="this.parentElement.remove()" style="background:none; border:none; color:#94a3b8; cursor:pointer; font-size:1.1rem;">&times;</button>
    `;
    document.body.appendChild(div);
    setTimeout(() => { if (div.parentElement) div.remove(); }, 4200);
}

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
    return {
        curr: makeCode(now),
        prev: makeCode(new Date(now.getTime() - 60000)),
        next: makeCode(new Date(now.getTime() + 60000))
    };
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

function previewAdminFile(inputEl, previewBoxId) {
    const box = document.getElementById(previewBoxId);
    if (!box || !inputEl.files || !inputEl.files[0]) return;
    const file = inputEl.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        inputEl.setAttribute('data-base64', e.target.result);
        const isImg = file.type.startsWith('image/');
        box.innerHTML = `
            ${isImg ? `<img src="${e.target.result}" alt="Preview">` : `<div style="width:48px;height:48px;border-radius:8px;background:#0f766e;color:#fff;display:flex;align-items:center;justify-content:center;"><i class="fa fa-file-text-o"></i></div>`}
            <div>
                <strong style="color:#0f766e; display:block; font-size:0.82rem;">✓ ফাইল প্রিভিউ প্রস্তুত</strong>
                <small style="color:#475569;">${esc(file.name)}</small>
            </div>
        `;
        box.classList.add('active');
    };
    reader.readAsDataURL(file);
}

// Universal Admin Pagination & Bulk Action Helper
function paginateAdminList(items) {
    const st = window._admPaging;
    const total = items.length;
    const perPage = Number(st.perPage) || 30;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    if (st.page > totalPages) st.page = totalPages;
    if (st.page < 1) st.page = 1;
    const start = (st.page - 1) * perPage;
    const sliced = items.slice(start, start + perPage);

    let btns = `<button class="page-btn" ${st.page<=1?'disabled':''} onclick="changeAdminPage(${st.page-1})">&lt;</button>`;
    for (let p = 1; p <= totalPages; p++) {
        if (totalPages <= 10 || p <= 3 || p > totalPages - 2 || Math.abs(p - st.page) <= 1) {
            btns += `<button class="page-btn ${p===st.page?'active':''}" onclick="changeAdminPage(${p})">${p}</button>`;
        } else if (p === 4 && st.page > 5) {
            btns += `<span style="padding:0 5px;">...</span>`;
        } else if (p === totalPages - 2 && st.page < totalPages - 4) {
            btns += `<span style="padding:0 5px;">...</span>`;
        }
    }
    btns += `<button class="page-btn" ${st.page>=totalPages?'disabled':''} onclick="changeAdminPage(${st.page+1})">&gt;</button>`;

    const barHTML = `
    <div class="pagination-bar no-print">
        <div style="display:flex; align-items:center; gap:10px; font-size:0.85rem; font-weight:700;">
            <span>মোটঃ ${total} টি | প্রতি পেজে দেখুনঃ</span>
            <select onchange="changeAdminPerPage(this.value)" class="form-control" style="width:92px; padding:4px 8px;">
                ${[30, 50, 100].map(n => `<option value="${n}" ${perPage===n?'selected':''}>${n} জন</option>`).join('')}
            </select>
        </div>
        <div class="page-numbers">${btns}</div>
    </div>`;

    return { sliced, barHTML, start };
}

function changeAdminPage(p) {
    window._admPaging.page = Number(p);
    renderAdminApp();
}

function changeAdminPerPage(n) {
    window._admPaging.perPage = Number(n);
    window._admPaging.page = 1;
    renderAdminApp();
}

function renderBulkToolbar(tableKey, extraStatusOptions = []) {
    return `
    <div class="bulk-action-bar no-print">
        <div style="display:flex; align-items:center; gap:10px;">
            <label style="display:flex; align-items:center; gap:6px; font-weight:700; font-size:0.85rem; cursor:pointer;">
                <input type="checkbox" onchange="toggleSelectAllRows(this)"> সব সিলেক্ট করুন (Bulk Select)
            </label>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
            ${extraStatusOptions.length ? `
                <select id="bulkStatusSelect_${tableKey}" class="form-control" style="width:170px; padding:5px 8px; font-size:0.82rem;">
                    <option value="">-- বাল্ক স্ট্যাটাস আপডেট --</option>
                    ${extraStatusOptions.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('')}
                </select>
                <button onclick="executeBulkUpdate('${tableKey}')" class="btn btn-primary btn-xs"><i class="fa fa-refresh"></i> বাল্ক আপডেট</button>
            ` : ''}
            <button onclick="openBulkSmsModalForSelected('${tableKey}')" class="btn btn-success btn-xs"><i class="fa fa-paper-plane"></i> বাল্ক অটো মেসেজ পাঠান</button>
            <button onclick="executeBulkDelete('${tableKey}')" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i> বাল্ক ডিলিট</button>
        </div>
    </div>`;
}

function toggleSelectAllRows(masterChk) {
    document.querySelectorAll('.row-bulk-chk').forEach(c => { c.checked = masterChk.checked; });
}

function getSelectedBulkIndices() {
    return Array.from(document.querySelectorAll('.row-bulk-chk:checked')).map(c => Number(c.value)).sort((a,b) => b - a);
}

function executeBulkDelete(tableKey) {
    const indices = getSelectedBulkIndices();
    if (!indices.length) { showAdminToast('warning', 'সিলেক্ট করুন!', 'বাল্ক ডিলিট করার জন্য অন্তত একটি রো টিক (✓) দিন।'); return; }
    if (!confirm(`আপনি কি নির্বাচিত ${indices.length} টি রেকর্ড একসাথে মুছে ফেলতে চান?`)) return;
    const db = DCITStore.getDB();
    indices.forEach(idx => { if (db[tableKey] && db[tableKey][idx]) db[tableKey].splice(idx, 1); });
    DCITStore.saveDB(db);
    showAdminToast('success', 'বাল্ক ডিলিট সম্পন্ন!', `${indices.length} টি রেকর্ড মুছে ফেলা হয়েছে।`);
    renderAdminApp();
}

function executeBulkUpdate(tableKey) {
    const indices = getSelectedBulkIndices();
    const sel = document.getElementById('bulkStatusSelect_' + tableKey);
    const val = sel ? sel.value : '';
    if (!indices.length || !val) { showAdminToast('warning', 'তথ্য দিন!', 'রো সিলেক্ট করুন এবং ড্রপডাউন থেকে স্ট্যাটাস বেছে নিন।'); return; }
    const db = DCITStore.getDB();
    indices.forEach(idx => {
        const item = db[tableKey][idx];
        if (!item) return;
        if (tableKey === 'students') {
            if (['নতুন স্টুডেন্ট', 'পরীক্ষায় অংশগ্রহণ করেছে', 'পাস করেছে'].includes(val)) item.exam_status = val;
            else if (['New Batch', 'Old Batch'].includes(val)) item.batch_type = val;
            else item.result_grade = val;
        } else if (tableKey === 'admissions') {
            item.status = val;
        } else if (tableKey === 'messages') {
            item.is_read = val === 'Seen' ? 1 : 0;
        } else {
            item.status = val;
        }
    });
    DCITStore.saveDB(db);
    showAdminToast('success', 'বাল্ক আপডেট সম্পন্ন!', `${indices.length} টি রেকর্ডের তথ্য আপডেট করা হয়েছে।`);
    renderAdminApp();
}

function openBulkSmsModalForSelected(tableKey) {
    const indices = getSelectedBulkIndices();
    const db = DCITStore.getDB();
    const list = db[tableKey] || [];
    let phones = [];
    if (indices.length) {
        indices.forEach(idx => {
            const it = list[idx];
            if (it && (it.phone || it.contact_info)) phones.push(it.phone || it.contact_info);
        });
    } else {
        list.forEach(it => { if (it.phone || it.contact_info) phones.push(it.phone || it.contact_info); });
    }
    openAutoSmsGatewayModal(phones.join(', '), `প্রিয় শিক্ষার্থী/সদস্য, Dream Career IT (পদুয়ার বাজার, কুমিল্লা) থেকে বিশেষ বিজ্ঞপ্তি। যোগাযোগঃ 01771770044।`);
}

function openAutoSmsGatewayModal(phonesStr, defaultMsg = '') {
    openAdminModal('📡 স্বয়ংক্রিয় ক্লাউড মেসেজ গেটওয়ে (কোনো সিম বা মোবাইল ছাড়াই অটো মেসেজ)', `
        <div>
            <div class="qv-hero-banner" style="padding:16px 20px;">
                <i class="fa fa-cloud-upload" style="font-size:2.4rem; color:#fde68a;"></i>
                <div>
                    <span class="badge badge-success">Simless Automatic PHP/Cloud SMS Gateway</span>
                    <h3 style="margin-top:4px; color:#fff;">সিঙ্গেল ও বাল্ক অটোমেটিক মেসেজ প্রেরণ</h3>
                </div>
            </div>
            <div class="form-group">
                <label>প্রাপকের মোবাইল নাম্বার সমূহ (কমা বা স্পেস দিয়ে একাধিক নাম্বার)</label>
                <textarea id="autoSmsPhones" class="form-control" rows="2">${esc(phonesStr || '01771770044')}</textarea>
            </div>
            <div class="form-group">
                <label>মেসেজ টেমপ্লেট</label>
                <select onchange="document.getElementById('autoSmsBody').value=this.value" class="form-control">
                    <option value="${esc(defaultMsg || 'প্রিয় শিক্ষার্থী, Dream Career IT-তে আপনার ভর্তি ও রেজিস্ট্রেশন সম্পন্ন হয়েছে। হটলাইনঃ 01771770044।')}">-- মেসেজ টেমপ্লেট সিলেক্ট করুন --</option>
                    <option value="প্রিয় শিক্ষার্থী, আপনার কোর্সের বকেয়া ফি দ্রুত পরিশোধ করার জন্য অনুরোধ করা হচ্ছে। - Dream Career IT (01771770044)">বকেয়া ফি রিমাইন্ডার</option>
                    <option value="প্রিয় শিক্ষার্থী, আপনার পরীক্ষার ফলাফল ও সার্টিফিকেট প্রকাশিত হয়েছে। গোপন কোড দিয়ে ওয়েবসাইট থেকে প্রিন্ট করুন। - Dream Career IT">রেজাল্ট ও সার্টিফিকেট নোটিশ</option>
                    <option value="আগামীকাল নির্ধারিত সময়ে ক্লাস অনুষ্ঠিত হবে। সকলকে উপস্থিত থাকার জন্য অনুরোধ করা হলো। - Dream Career IT">ক্লাস উপস্থিতি নোটিশ</option>
                </select>
            </div>
            <div class="form-group">
                <label>মেসেজ বডি *</label>
                <textarea id="autoSmsBody" class="form-control" rows="4">${esc(defaultMsg || 'প্রিয় শিক্ষার্থী, Dream Career IT-তে আপনার ভর্তি ও রেজিস্ট্রেশন সম্পন্ন হয়েছে। হটলাইনঃ 01771770044।')}</textarea>
            </div>
            <button onclick="dispatchSimlessAutoSMS()" class="btn btn-primary" style="width:100%; padding:12px;"><i class="fa fa-paper-plane"></i> এখনই স্বয়ংক্রিয়ভাবে মেসেজ পাঠান (No SIM Required)</button>
        </div>
    `);
}

async function dispatchSimlessAutoSMS() {
    const ph = document.getElementById('autoSmsPhones').value.trim();
    const bd = document.getElementById('autoSmsBody').value.trim();
    if (!ph || !bd) { showAdminToast('error', 'ত্রুটি!', 'প্রাপকের নাম্বার এবং মেসেজ বডি লিখুন।'); return; }
    const log = await DCITStore.sendAutomaticSMS(ph, bd, 'DCIT PHP Auto Cloud Gateway');
    closeAdminModal();
    showAdminToast('success', 'অটোমেটিক মেসেজ প্রেরিত হয়েছে!', `${log.recipient_count} জন প্রাপকের কাছে সিম ছাড়াই মেসেজ ডেলিভারি সম্পন্ন হয়েছে।`);
    if (currentTab === 'sms') renderAdminApp();
}

function switchTab(tab, msg = '', filter = 'ALL') {
    currentTab = tab;
    subFilter = filter;
    window._admPaging.page = 1;
    closeAdminModal();
    renderAdminApp();
    if (msg) showAdminToast('success', 'সফল!', msg);
}

/* ==========================================================================
   MAIN ADMIN APP ROUTER & ZERO-HINT LOGIN + TIME-LOCK
   ========================================================================== */
function renderAdminApp() {
    const root = document.getElementById('adminAppRoot');
    clearInterval(window._timeLockInterval);

    // STEP 1: Zero-Hint Blank Username & Password Login
    if (!DCITStore.isStep1Passed() && !DCITStore.isLogged()) {
        root.innerHTML = `
        <div class="login-stage-wrap">
            <div class="login-anim-card">
                <img src="../assets/img/logo.jpg" alt="Dream Career IT">
                <h2 style="color:#151442; margin-bottom:18px;">Dream Career IT</h2>
                <form id="spaLoginStep1Form" style="text-align:left;" autocomplete="off">
                    <div class="form-group">
                        <label><i class="fa fa-user"></i> User ID</label>
                        <input type="text" id="lUser" class="form-control" value="" required autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label><i class="fa fa-lock"></i> Password</label>
                        <input type="password" id="lPass" class="form-control" value="" required autocomplete="new-password">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; padding:12px; font-size:0.96rem;">
                        <i class="fa fa-sign-in"></i> Login
                    </button>
                </form>
                <p style="margin-top:16px;"><a href="../index.html" style="color:#0f766e; font-weight:700; text-decoration:none;">&larr; Website</a></p>
            </div>
        </div>`;

        document.getElementById('spaLoginStep1Form').addEventListener('submit', function(e) {
            e.preventDefault();
            const u = document.getElementById('lUser').value.trim().toLowerCase();
            const p = document.getElementById('lPass').value.trim();
            if ((u === 'admin' || u === 'sagor' || u === 'dc13edubd@gmail.com') && p === 'admin123') {
                DCITStore.setStep1Passed(true, u);
                showAdminToast('success', 'ধাপ ১ সম্পন্ন!', 'এখন টাইম লক ভেরিফিকেশন সম্পন্ন করুন।');
                renderAdminApp();
            } else {
                showAdminToast('error', 'লগইন ব্যর্থ!', 'ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়।');
            }
        });
        return;
    }

    // STEP 2: Zero-Hint Digital Clock ONLY Time-Lock Screen
    if (!DCITStore.isLogged()) {
        const tl = getTimeLockStrings();
        root.innerHTML = `
        <div class="login-stage-wrap">
            <div class="login-anim-card" style="border-top-color:#0f766e;">
                <img src="../assets/img/logo.jpg" alt="Dream Career IT">
                <h2 style="color:#151442; margin-bottom:6px;">Time Lock Security</h2>
                <div class="timelock-clock-badge" id="liveTimeLockClock">${tl.curr.display}</div>
                <form id="spaLoginStep2Form" style="text-align:left;" autocomplete="off">
                    <div class="form-group">
                        <input type="password" id="timeLockInput" class="form-control" value="" required autocomplete="off" style="text-align:center; font-size:1.25rem; font-weight:800; letter-spacing:3px;">
                    </div>
                    <button type="submit" class="btn btn-accent" style="width:100%; justify-content:center; padding:12px; font-size:0.96rem;">
                        <i class="fa fa-unlock-alt"></i> Unlock Dashboard
                    </button>
                </form>
                <div style="margin-top:14px;">
                    <a href="#back" onclick="DCITStore.setStep1Passed(false); renderAdminApp();" style="color:#64748b; text-decoration:none; font-size:0.84rem;">&larr; Back</a>
                </div>
            </div>
        </div>`;

        window._timeLockInterval = setInterval(() => {
            const c = getTimeLockStrings().curr;
            const clk = document.getElementById('liveTimeLockClock');
            if (clk) clk.textContent = c.display;
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
                DCITStore.setLogged(true, entered);
                showAdminToast('success', 'স্বাগতম!', 'টাইম-লক ভেরিফিকেশন সফল হয়েছে।');
                renderAdminApp();
            } else {
                showAdminToast('error', 'ভেরিফিকেশন ব্যর্থ!', 'টাইম লক কোড সঠিক নয়।');
            }
        });
        return;
    }

    const db = DCITStore.getDB();
    const pendingAdm = (db.admissions || []).filter(a => a.status === 'Pending').length;
    const pendingPay = (db.payments || []).filter(p => Number(p.due_amount) > 0).length;
    const unseenMsg  = (db.messages || []).filter(m => !Number(m.is_read)).length;

    root.innerHTML = `
    <aside class="dcp-sidebar">
        <div class="dcp-brand">
            <img src="../assets/img/logo.jpg" alt="Logo">
            <div>
                <h2>Dream Career IT</h2>
                <span>Enterprise Admin v5.0</span>
            </div>
        </div>
        <ul class="dcp-nav">
            <li><a href="#dashboard" onclick="switchTab('dashboard')" class="${currentTab==='dashboard'?'active':''}"><span><i class="fa fa-tachometer"></i> ড্যাশবোর্ড ও গ্রাফ</span></a></li>
            <li><a href="#students" onclick="switchTab('students')" class="${currentTab==='students'?'active':''}"><span><i class="fa fa-graduation-cap"></i> স্টুডেন্ট ও বাল্ক এন্ট্রি</span></a></li>
            <li><a href="#results" onclick="switchTab('results')" class="${currentTab==='results'?'active':''}"><span><i class="fa fa-trophy"></i> রেজাল্ট আপডেট সেকশন</span></a></li>
            <li><a href="#certificates" onclick="switchTab('certificates')" class="${currentTab==='certificates'?'active':''}"><span><i class="fa fa-certificate"></i> সার্টিফিকেট ও গোপন কোড</span></a></li>
            <li><a href="#admissions" onclick="switchTab('admissions')" class="${currentTab==='admissions'?'active':''}"><span><i class="fa fa-user-plus"></i> অনলাইন ভর্তি আবেদন</span> ${pendingAdm ? `<b class="dcp-badge">${pendingAdm}</b>` : ''}</a></li>
            <li><a href="#classes" onclick="switchTab('classes')" class="${currentTab==='classes'?'active':''}"><span><i class="fa fa-clock-o"></i> ক্লাস রুটিন ও ব্যাচ</span></a></li>
            <li><a href="#courses" onclick="switchTab('courses')" class="${currentTab==='courses'?'active':''}"><span><i class="fa fa-book"></i> কোর্স ও সিলেবাস (+)</span></a></li>
            <li><a href="#teachers" onclick="switchTab('teachers')" class="${currentTab==='teachers'?'active':''}"><span><i class="fa fa-sitemap"></i> প্রশাসন (৫ ক্যাটাগরি)</span></a></li>
            <li><a href="#notices" onclick="switchTab('notices')" class="${currentTab==='notices'?'active':''}"><span><i class="fa fa-bell"></i> নোটিশ ও সাকসেস স্টোরি</span></a></li>
            <li><a href="#payments" onclick="switchTab('payments')" class="${currentTab==='payments'?'active':''}"><span><i class="fa fa-money"></i> পেমেন্ট ও ডিউ লিস্ট</span> ${pendingPay ? `<b class="dcp-badge">${pendingPay}</b>` : ''}</a></li>
            <li><a href="#reports" onclick="switchTab('reports')" class="${currentTab==='reports'?'active':''}"><span><i class="fa fa-bar-chart"></i> স্টুডেন্ট ও পেমেন্ট রিপোর্ট</span></a></li>
            <li><a href="#sms" onclick="switchTab('sms')" class="${currentTab==='sms'?'active':''}"><span><i class="fa fa-paper-plane"></i> অটো মেসেজ মডিউল (PHP)</span></a></li>
            <li><a href="#subscribers" onclick="switchTab('subscribers')" class="${currentTab==='subscribers'?'active':''}"><span><i class="fa fa-envelope-open"></i> সাবস্ক্রাইবার লিস্ট</span></a></li>
            <li><a href="#messages" onclick="switchTab('messages')" class="${currentTab==='messages'?'active':''}"><span><i class="fa fa-inbox"></i> কন্টাক্ট ইনবক্স</span> ${unseenMsg ? `<b class="dcp-badge">${unseenMsg}</b>` : ''}</a></li>
            <li><a href="#login_history" onclick="switchTab('login_history')" class="${currentTab==='login_history'?'active':''}"><span><i class="fa fa-history"></i> লগইন হিস্ট্রি</span></a></li>
            <li><a href="#settings" onclick="switchTab('settings')" class="${currentTab==='settings'?'active':''}"><span><i class="fa fa-cogs"></i> সেটিংস ও ডিসকাউন্ট</span></a></li>
            <li style="margin-top:8px; border-top:1px solid rgba(255,255,255,0.1); padding-top:8px;">
                <a href="../index.html"><i class="fa fa-globe"></i> কাস্টমার ভিউ পেজ</a>
            </li>
            <li><a href="#logout" onclick="DCITStore.setLogged(false); renderAdminApp();" style="color:#fca5a5;"><i class="fa fa-sign-out"></i> লগআউট</a></li>
        </ul>
    </aside>
    <div class="dcp-main">
        <header class="dcp-topbar">
            <h1>Dream Career IT — এন্টারপ্রাইজ এডমিন প্যানেল</h1>
            <div class="dcp-user-bar">
                <input type="search" class="form-control" placeholder="দ্রুত সার্চ করুন..." style="width:200px;" oninput="filterActiveAdminTable(this.value)">
                <button onclick="openAutoSmsGatewayModal('01771770044')" class="btn btn-primary btn-xs"><i class="fa fa-paper-plane"></i> কুইক অটো SMS</button>
                <a href="../index.html" class="btn btn-outline btn-xs"><i class="fa fa-external-link"></i> ভিউয়ার পেজ</a>
                <button onclick="DCITStore.setLogged(false); renderAdminApp();" class="btn btn-danger btn-xs"><i class="fa fa-power-off"></i> লগআউট</button>
            </div>
        </header>
        <main class="dcp-content" id="dcpTabBody"></main>
    </div>`;

    const body = document.getElementById('dcpTabBody');
    if (currentTab === 'dashboard') renderTabDashboard(body, db);
    else if (currentTab === 'students') renderTabStudents(body, db);
    else if (currentTab === 'results') renderTabResults(body, db);
    else if (currentTab === 'certificates') renderTabCertificates(body, db);
    else if (currentTab === 'admissions') renderTabAdmissions(body, db);
    else if (currentTab === 'classes') renderTabClasses(body, db);
    else if (currentTab === 'courses') renderTabCourses(body, db);
    else if (currentTab === 'teachers') renderTabTeachers(body, db);
    else if (currentTab === 'notices') renderTabNotices(body, db);
    else if (currentTab === 'payments') renderTabPayments(body, db);
    else if (currentTab === 'reports') renderTabReports(body, db);
    else if (currentTab === 'sms') renderTabSmsModule(body, db);
    else if (currentTab === 'subscribers') renderTabSubscribers(body, db);
    else if (currentTab === 'messages') renderTabMessages(body, db);
    else if (currentTab === 'login_history') renderTabLoginHistory(body, db);
    else if (currentTab === 'settings') renderTabSettings(body, db);
}

function filterActiveAdminTable(q) {
    const val = String(q || '').toLowerCase();
    document.querySelectorAll('.dcp-table tbody tr').forEach(tr => {
        tr.style.display = tr.innerText.toLowerCase().includes(val) ? '' : 'none';
    });
}

/* ==========================================================================
   1. DASHBOARD TAB (With Analytics Graph, Recent Online Applications & Due List!)
   ========================================================================== */
function renderTabDashboard(body, db) {
    const paid = (db.payments || []).reduce((s, p) => s + (Number(p.paid_amount)||0), 0);
    const due  = (db.payments || []).reduce((s, p) => s + (Number(p.due_amount)||0), 0);
    const duePayments = (db.payments || []).filter(p => Number(p.due_amount) > 0);
    const recentAdms = (db.admissions || []).slice(0, 5);
    const courses = db.courses || [];

    body.innerHTML = `
    <div class="kpi-grid">
        <div class="kpi-card" onclick="switchTab('students')" style="cursor:pointer;"><div class="kpi-info"><h4>মোট স্টুডেন্ট</h4><h2>${(db.students||[]).length}</h2></div><div class="kpi-icon" style="background:#ccfbf1; color:#0f766e;"><i class="fa fa-graduation-cap"></i></div></div>
        <div class="kpi-card" onclick="switchTab('certificates')" style="cursor:pointer;"><div class="kpi-info"><h4>ইস্যুকৃত সার্টিফিকেট</h4><h2>${(db.certificates||[]).length}</h2></div><div class="kpi-icon" style="background:#fef3c7; color:#d97706;"><i class="fa fa-certificate"></i></div></div>
        <div class="kpi-card" onclick="switchTab('payments')" style="cursor:pointer;"><div class="kpi-info"><h4>মোট পেমেন্ট আদায়</h4><h2 style="color:#15803d;">৳ ${paid.toLocaleString()}</h2></div><div class="kpi-icon" style="background:#dcfce7; color:#15803d;"><i class="fa fa-money"></i></div></div>
        <div class="kpi-card" onclick="switchTab('payments','','DUE')" style="cursor:pointer;"><div class="kpi-info"><h4>মোট বকেয়া (Due)</h4><h2 style="color:#dc2626;">৳ ${due.toLocaleString()}</h2></div><div class="kpi-icon" style="background:#fee2e2; color:#b91c1c;"><i class="fa fa-exclamation-circle"></i></div></div>
    </div>

    <!-- Visual Analytics Graph -->
    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-bar-chart" style="color:#0f766e;"></i> কোর্স ভিত্তিক স্টুডেন্ট ও পেমেন্ট অ্যানালিটিক্স গ্রাফ (Live Chart)</h3>
            <span class="badge badge-info">আদায়ঃ ৳${paid.toLocaleString()} vs বকেয়াঃ ৳${due.toLocaleString()}</span>
        </div>
        <div class="panel-body">
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:16px; align-items:flex-end; height:190px; padding:20px 14px 10px; background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
                ${courses.map((c, idx) => {
                    const cnt = (db.students||[]).filter(s => s.course_name === c.title).length;
                    const pct = Math.min(100, Math.max(22, cnt * 28));
                    const colors = ['#0f766e', '#ea580c', '#2563eb', '#7c3aed', '#16a34a', '#d97706'];
                    const col = colors[idx % colors.length];
                    return `
                    <div style="text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; height:100%;">
                        <strong style="font-size:0.82rem; color:${col}; margin-bottom:4px;">${cnt} জন (৳${Number(c.fee)})</strong>
                        <div style="width:46px; height:${pct}%; background:linear-gradient(180deg, ${col}, #151442); border-radius:8px 8px 0 0; transition:height 0.5s;"></div>
                        <small style="margin-top:6px; font-weight:700; font-size:0.75rem; color:#334155;">${esc(c.title.slice(0,16))}</small>
                    </div>`;
                }).join('')}
            </div>
        </div>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(440px, 1fr)); gap:20px;">
        <!-- Recent Online Applications -->
        <div class="panel-card">
            <div class="panel-header">
                <h3><i class="fa fa-user-plus" style="color:#ea580c;"></i> রিসেন্ট অনলাইন এপ্লিকেশন (${recentAdms.length})</h3>
                <button onclick="switchTab('admissions')" class="btn btn-primary btn-xs">সব দেখুন</button>
            </div>
            <div class="dcp-table-wrap"><table class="dcp-table" style="min-width:100%;">
                <thead><tr><th>আবেদন নং</th><th>নাম ও মোবাইল</th><th>কোর্স</th><th>স্ট্যাটাস</th><th>অ্যাকশন</th></tr></thead>
                <tbody>
                    ${recentAdms.map((a, idx) => `
                    <tr>
                        <td><strong>${esc(a.application_no)}</strong></td>
                        <td>${esc(a.full_name)}<br><small>${esc(a.phone)}</small></td>
                        <td>${esc(a.course_name)}</td>
                        <td><span class="badge ${a.status==='Approved'?'badge-success':'badge-warning'}">${esc(a.status)}</span></td>
                        <td><button onclick="quickViewAdmission(${idx})" class="btn btn-outline btn-xs"><i class="fa fa-eye"></i></button></td>
                    </tr>`).join('')}
                </tbody>
            </table></div>
        </div>

        <!-- Due / Pending Payment List -->
        <div class="panel-card">
            <div class="panel-header">
                <h3><i class="fa fa-exclamation-triangle" style="color:#dc2626;"></i> বকেয়া / ডিউ পেমেন্ট লিস্ট (${duePayments.length})</h3>
                <button onclick="switchTab('payments','','DUE')" class="btn btn-danger btn-xs">সব ডিউ দেখুন</button>
            </div>
            <div class="dcp-table-wrap"><table class="dcp-table" style="min-width:100%;">
                <thead><tr><th>রিসিপ্ট</th><th>শিক্ষার্থী (রেজিঃ)</th><th>কোর্স</th><th>বকেয়া (Due)</th><th>অ্যাকশন</th></tr></thead>
                <tbody>
                    ${duePayments.map(p => `
                    <tr>
                        <td><strong>${esc(p.receipt_no)}</strong></td>
                        <td>${esc(p.student_name)} (${esc(p.reg_no)})</td>
                        <td>${esc(p.course_name)}</td>
                        <td style="color:#dc2626; font-weight:800;">৳${Number(p.due_amount)}</td>
                        <td><button onclick="openAutoSmsGatewayModal('${esc(p.phone||'01771770044')}','প্রিয় ${esc(p.student_name)}, আপনার ${esc(p.course_name)} কোর্সের বকেয়া ফি ৳${Number(p.due_amount)} পরিশোধ করার অনুরোধ করা হচ্ছে। - Dream Career IT')" class="btn btn-accent btn-xs"><i class="fa fa-paper-plane"></i> অটো SMS</button></td>
                    </tr>`).join('')}
                </tbody>
            </table></div>
        </div>
    </div>`;
}

// ============================================================================
// 2. STUDENTS & BULK ENTRY + POPUP FORM + INLINE DROPDOWNS + CONDITIONAL GPA
// ============================================================================
let stuFilterYear = '';
let stuFilterBatch = '';
let stuFilterDuration = '';
let stuFilterExamStatus = '';

function applyStudentMultiFilter() {
    stuFilterYear = document.getElementById('sf-year')?.value || '';
    stuFilterBatch = document.getElementById('sf-batch')?.value || '';
    stuFilterDuration = document.getElementById('sf-duration')?.value || '';
    stuFilterExamStatus = document.getElementById('sf-exam-status')?.value || '';
    adminPages['students'] = 1;
    renderAdminApp();
}

function resetStudentMultiFilter() {
    stuFilterYear = ''; stuFilterBatch = ''; stuFilterDuration = ''; stuFilterExamStatus = '';
    currentSearch = ''; currentCourseFilter = '';
    adminPages['students'] = 1;
    renderAdminApp();
}

function renderTabStudents(el, db) {
    const courses = db.courses || [];
    const classes = db.classes || [];
    const allStudents = db.students || [];

    const countNew = allStudents.filter(s => (s.exam_status || 'নতুন স্টুডেন্ট') === 'নতুন স্টুডেন্ট').length;
    const countExam = allStudents.filter(s => s.exam_status === 'পরীক্ষায় অংশগ্রহণ করেছে').length;
    const countPassed = allStudents.filter(s => s.exam_status === 'পাস করেছে').length;

    const filtered = allStudents.filter(s => {
        const q = currentSearch.toLowerCase();
        const matchQ = !q || [s.name, s.reg_no, s.roll_no, s.phone, s.secret_code, s.father_name].some(v => String(v||'').toLowerCase().includes(q));
        const matchCourse = !currentCourseFilter || s.course_name === currentCourseFilter;
        const matchYear = !stuFilterYear || String(s.session || '') === stuFilterYear;
        const matchBatch = !stuFilterBatch || String(s.batch_no || '').toLowerCase().includes(stuFilterBatch.toLowerCase());
        const matchDur = !stuFilterDuration || String(s.duration || '') === stuFilterDuration;
        const matchExam = !stuFilterExamStatus || (s.exam_status || 'নতুন স্টুডেন্ট') === stuFilterExamStatus;
        return matchQ && matchCourse && matchYear && matchBatch && matchDur && matchExam;
    });

    const pg = paginateAdminList(filtered, 'students');
    const years = [...new Set(allStudents.map(s => s.session || '2026'))];
    const batches = [...new Set([...allStudents.map(s => s.batch_no), ...classes.map(c => c.batch_name)].filter(Boolean))];
    const durations = [...new Set([...allStudents.map(s => s.duration), ...courses.map(c => c.duration)].filter(Boolean))];
    const schedules = [...new Set([...allStudents.map(s => s.class_schedule), ...classes.map(c => c.days + ' (' + c.time_slot + ')')].filter(Boolean))];

    el.innerHTML = `
    <div class="digital-counter-grid">
        <div class="digital-counter-card ${stuFilterExamStatus===''?'active':''}" onclick="stuFilterExamStatus='';adminPages['students']=1;renderAdminApp();">
            <div><div class="dc-num">${allStudents.length}</div><div class="dc-lbl">সকল স্টুডেন্ট (Total)</div></div>
            <div class="dc-icon"><i class="fa fa-users"></i></div>
        </div>
        <div class="digital-counter-card ${stuFilterExamStatus==='নতুন স্টুডেন্ট'?'active':''}" onclick="stuFilterExamStatus='নতুন স্টুডেন্ট';adminPages['students']=1;renderAdminApp();">
            <div><div class="dc-num" style="color:#0284c7;">${countNew}</div><div class="dc-lbl">নতুন স্টুডেন্ট</div></div>
            <div class="dc-icon" style="background:#e0f2fe; color:#0284c7;"><i class="fa fa-user-plus"></i></div>
        </div>
        <div class="digital-counter-card ${stuFilterExamStatus==='পরীক্ষায় অংশগ্রহণ করেছে'?'active':''}" onclick="stuFilterExamStatus='পরীক্ষায় অংশগ্রহণ করেছে';adminPages['students']=1;renderAdminApp();">
            <div><div class="dc-num" style="color:#d97706;">${countExam}</div><div class="dc-lbl">পরীক্ষায় অংশগ্রহণ করেছে</div></div>
            <div class="dc-icon" style="background:#fef3c7; color:#d97706;"><i class="fa fa-pencil-square-o"></i></div>
        </div>
        <div class="digital-counter-card ${stuFilterExamStatus==='পাস করেছে'?'active':''}" onclick="stuFilterExamStatus='পাস করেছে';adminPages['students']=1;renderAdminApp();">
            <div><div class="dc-num" style="color:#16a34a;">${countPassed}</div><div class="dc-lbl">পাস করেছে (Passed)</div></div>
            <div class="dc-icon" style="background:#dcfce7; color:#16a34a;"><i class="fa fa-check-circle"></i></div>
        </div>
    </div>

    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-users"></i> স্টুডেন্ট ও বাল্ক এন্ট্রি ম্যানেজমেন্ট (${filtered.length} জন)</h3>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <button onclick="openStudentPopupModal()" class="btn btn-primary btn-sm"><i class="fa fa-plus-circle"></i> ➕ এড স্টুডেন্ট (পপআপ ফর্ম)</button>
                <button onclick="toggleBulkStudentCreator()" class="btn btn-accent btn-sm"><i class="fa fa-table"></i> বাল্ক স্টুডেন্ট এন্ট্রি</button>
                <button onclick="window.print()" class="btn btn-outline btn-sm"><i class="fa fa-print"></i> প্রিন্ট</button>
            </div>
        </div>

        <div class="filter-bar">
            <select id="sf-year" class="form-control" style="max-width:130px;">
                <option value="">সকল সাল (Year)</option>
                ${years.map(y => `<option value="${esc(y)}" ${stuFilterYear===y?'selected':''}>${esc(y)}</option>`).join('')}
            </select>
            <select id="sf-batch" class="form-control" style="max-width:150px;">
                <option value="">সকল ব্যাচ নং</option>
                ${batches.map(b => `<option value="${esc(b)}" ${stuFilterBatch===b?'selected':''}>${esc(b)}</option>`).join('')}
            </select>
            <select id="sf-duration" class="form-control" style="max-width:160px;">
                <option value="">সকল কোর্স ডিউরেশন</option>
                ${durations.map(d => `<option value="${esc(d)}" ${stuFilterDuration===d?'selected':''}>${esc(d)}</option>`).join('')}
            </select>
            <select id="sf-exam-status" class="form-control" style="max-width:190px;">
                <option value="">সকল কোর্স স্ট্যাটাস</option>
                <option value="নতুন স্টুডেন্ট" ${stuFilterExamStatus==='নতুন স্টুডেন্ট'?'selected':''}>নতুন স্টুডেন্ট</option>
                <option value="পরীক্ষায় অংশগ্রহণ করেছে" ${stuFilterExamStatus==='পরীক্ষায় অংশগ্রহণ করেছে'?'selected':''}>পরীক্ষায় অংশগ্রহণ করেছে</option>
                <option value="পাস করেছে" ${stuFilterExamStatus==='পাস করেছে'?'selected':''}>পাস করেছে</option>
            </select>
            <input type="text" id="stu-q" class="form-control" placeholder="নাম, রেজিঃ, রোল, মোবাইল, সিক্রেট কোড..." value="${esc(currentSearch)}" style="max-width:220px;">
            <button onclick="currentSearch=document.getElementById('stu-q').value;applyStudentMultiFilter();" class="btn btn-primary btn-sm"><i class="fa fa-search"></i> সার্চ</button>
            <button onclick="resetStudentMultiFilter()" class="btn btn-outline btn-sm">রিসেট</button>
        </div>

        <div id="bulk-stu-drawer" style="display:none; padding:18px; background:#f0f9ff; border-bottom:1px solid #bae6fd;">
            <h4 style="margin:0 0 8px; color:#0369a1;"><i class="fa fa-bolt"></i> বাল্ক স্টুডেন্ট এন্ট্রি (প্রতি লাইনে ১ জন: নাম, পিতার নাম, মাতার নাম, মোবাইল, কোর্স নাম, ব্যাচ নং)</h4>
            <textarea id="bulk-stu-lines" class="form-control" rows="4" placeholder="রহিম উদ্দিন, করিম উদ্দিন, ফাতেমা বেগম, 01711000000, Office Application, Batch-28&#10;সুমাইয়া আক্তার, জসিম উদ্দিন, রাবেয়া খাতুন, 01811000000, Graphic Design, Batch-29"></textarea>
            <div style="margin-top:10px; display:flex; gap:10px;">
                <button onclick="processBulkStudents()" class="btn btn-success btn-sm"><i class="fa fa-check"></i> বাল্ক সাবমিট করুন</button>
                <button onclick="toggleBulkStudentCreator()" class="btn btn-outline btn-sm">বন্ধ করুন</button>
            </div>
        </div>

        ${renderBulkToolbarHtml('students', `<select onchange="if(this.value) { bulkChangeStudentExamStatus(this.value); this.value=''; }" class="form-control" style="width:auto; padding:5px 10px; font-size:12px;">
            <option value="">বাল্ক স্ট্যাটাস আপডেট...</option>
            <option value="নতুন স্টুডেন্ট">নতুন স্টুডেন্ট</option>
            <option value="পরীক্ষায় অংশগ্রহণ করেছে">পরীক্ষায় অংশগ্রহণ করেছে</option>
            <option value="পাস করেছে">পাস করেছে (A+)</option>
        </select>`)}

        <div class="dcp-table-wrap">
            <table class="dcp-table">
                <thead>
                    <tr>
                        <th style="width:36px;"><input type="checkbox" onchange="toggleSelectAllRows('students', this.checked, ${ JSON.stringify(pg.slice.map(s=>s.reg_no)).replace(/"/g,'&quot;') })"></th>
                        <th>ছবি</th>
                        <th>রেজিঃ <br> রোল <br> সিক্রেট কোড</th>
                        <th>শিক্ষার্থীর নাম <br> পিতা <br> মাতা</th>
                        <th>মোবাইল নাম্বার <br> মেসেজ পাঠান</th>
                        <th>কোর্স ড্রপডাউন <br> ডিউরেশন ড্রপডাউন <br> ক্লাস সিডিউল ড্রপডাউন</th>
                        <th>ব্যাচ-সাল <br> ব্যাচ নং</th>
                        <th>কোর্স স্ট্যাটাস ড্রপডাউন <br> ও জিপিএ (পাস করলে)</th>
                        <th>কুইক ভিউ, এডিট, ডিলিট</th>
                    </tr>
                </thead>
                <tbody>
                    ${pg.slice.length === 0 ? `<tr><td colspan="9" style="text-align:center; padding:30px; color:#64748b;">কোনো শিক্ষার্থী পাওয়া যায়নি।</td></tr>` :
                    pg.slice.map((s) => {
                        const realIdx = allStudents.findIndex(x => x.reg_no === s.reg_no);
                        const examSt = s.exam_status || (s.result && s.result !== 'Pending' ? 'পাস করেছে' : 'নতুন স্টুডেন্ট');
                        const isPassed = examSt === 'পাস করেছে';
                        const checked = (bulkSelected['students'] || []).includes(s.reg_no) ? 'checked' : '';
                        return `
                        <tr>
                            <td><input type="checkbox" ${checked} onchange="toggleBulkRow('students','${esc(s.reg_no)}',this.checked)"></td>
                            <td><img src="${esc(s.photo || '../images/students/sagor.jpg')}" style="width:46px;height:54px;object-fit:cover;border-radius:8px;border:2px solid #cbd5e1;" onerror="this.src='../images/logo.png'"></td>
                            <td>
                                <strong style="color:#0f172a;">${esc(s.reg_no)}</strong><br>
                                <span style="font-size:12px; color:#475569;">রোল: ${esc(s.roll_no)}</span><br>
                                <span class="badge badge-info" style="font-family:monospace; letter-spacing:0.5px;" title="১০ অক্ষরের গোপন কোড"><i class="fa fa-key"></i> ${esc(s.secret_code || 'DC20SAG001')}</span>
                            </td>
                            <td>
                                <strong style="color:#1e293b; font-size:14px;">${esc(s.name)}</strong><br>
                                <small style="color:#475569;">পিতা: ${esc(s.father_name || '-')}</small><br>
                                <small style="color:#64748b;">মাতা: ${esc(s.mother_name || '-')}</small>
                            </td>
                            <td>
                                <strong style="color:#0f172a;">${esc(s.phone || '01771770044')}</strong><br>
                                <button onclick="openAutoSmsGatewayModal('${esc(s.phone||'01771770044')}','প্রিয় ${esc(s.name)}, ড্রিম ক্যারিয়ার আইটি থেকে আপনার রেজিঃ ${esc(s.reg_no)} এবং সিক্রেট কোড: ${esc(s.secret_code)}।')" class="btn btn-accent btn-xs" style="margin-top:4px;"><i class="fa fa-paper-plane"></i> মেসেজ পাঠান</button>
                            </td>
                            <td>
                                <select onchange="inlineUpdateStudentField(${realIdx},'course_name',this.value)" class="inline-select">
                                    ${courses.map(c => `<option value="${esc(c.title)}" ${s.course_name===c.title?'selected':''}>${esc(c.title)}</option>`).join('')}
                                    ${!courses.some(c=>c.title===s.course_name) ? `<option value="${esc(s.course_name)}" selected>${esc(s.course_name)}</option>` : ''}
                                </select>
                                <select onchange="inlineUpdateStudentField(${realIdx},'duration',this.value)" class="inline-select">
                                    ${['3 Months','6 Months','1 Year'].map(d => `<option value="${d}" ${s.duration===d?'selected':''}>${d}</option>`).join('')}
                                </select>
                                <select onchange="inlineUpdateStudentField(${realIdx},'class_schedule',this.value)" class="inline-select">
                                    ${['শনি - সোম - বুধ (সকাল ১০টা)','রবি - মঙ্গল - বৃহঃ (বিকাল ৪টা)','শুক্রবার স্পেশাল ব্যাচ', ...schedules].filter((v,i,a)=>a.indexOf(v)===i).map(sch => `<option value="${esc(sch)}" ${s.class_schedule===sch?'selected':''}>${esc(sch)}</option>`).join('')}
                                </select>
                            </td>
                            <td>
                                <input type="text" value="${esc(s.session || '2026')}" onchange="inlineUpdateStudentField(${realIdx},'session',this.value)" class="inline-select" style="width:85px;" title="ব্যাচ-সাল"><br>
                                <input type="text" value="${esc(s.batch_no || 'Batch-28')}" onchange="inlineUpdateStudentField(${realIdx},'batch_no',this.value)" class="inline-select" style="width:85px;" title="ব্যাচ নং">
                            </td>
                            <td>
                                <select onchange="inlineUpdateStudentExamStatus(${realIdx}, this.value)" class="inline-select" style="font-weight:700; ${isPassed?'background:#dcfce7;border-color:#16a34a;color:#166534;':''}">
                                    <option value="নতুন স্টুডেন্ট" ${examSt==='নতুন স্টুডেন্ট'?'selected':''}>নতুন স্টুডেন্ট</option>
                                    <option value="পরীক্ষায় অংশগ্রহণ করেছে" ${examSt==='পরীক্ষায় অংশগ্রহণ করেছে'?'selected':''}>পরীক্ষায় অংশগ্রহণ করেছে</option>
                                    <option value="পাস করেছে" ${examSt==='পাস করেছে'?'selected':''}>পাস করেছে</option>
                                </select>
                                ${isPassed ? `
                                <div style="margin-top:4px;">
                                    <select onchange="inlineUpdateStudentGpa(${realIdx}, this.value)" class="inline-select" style="background:#fef9c3; border-color:#eab308; font-weight:800; color:#854d0e;">
                                        <option value="">-- জিপিএ নির্বাচন --</option>
                                        <option value="A+ (5.00)" ${(s.result||'').includes('A+') && !String(s.result).includes('A-') ?'selected':''}>A+ (5.00)</option>
                                        <option value="A (4.00)" ${s.result==='A (4.00)' || s.gpa==='4.00'?'selected':''}>A (4.00)</option>
                                        <option value="A- (3.50)" ${s.result==='A- (3.50)' || s.gpa==='3.50'?'selected':''}>A- (3.50)</option>
                                        <option value="B (3.00)" ${s.result==='B (3.00)' || s.gpa==='3.00'?'selected':''}>B (3.00)</option>
                                    </select>
                                </div>` : `<div style="font-size:11px; color:#64748b; margin-top:2px;">পাস করলে জিপিএ অপশন আসবে</div>`}
                            </td>
                            <td style="white-space:nowrap;">
                                <button onclick="quickViewStudent(${realIdx})" class="btn btn-outline btn-xs" title="কুইক ভিউ"><i class="fa fa-eye"></i></button>
                                <button onclick="openStudentPopupModal(${realIdx})" class="btn btn-primary btn-xs" title="এডিট"><i class="fa fa-edit"></i></button>
                                <button onclick="deleteStudent(${realIdx})" class="btn btn-danger btn-xs" title="ডিলিট"><i class="fa fa-trash"></i></button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
        ${renderAdminPaginationHtml('students', pg)}
    </div>`;
}

function inlineUpdateStudentField(idx, field, val) {
    DCITStore.updateDB(db => {
        if (db.students[idx]) db.students[idx][field] = val;
    });
    notifyToast('শিক্ষার্থীর তথ্য আপডেট হয়েছে!');
}

function inlineUpdateStudentExamStatus(idx, examStatus) {
    DCITStore.updateDB(db => {
        const s = db.students[idx];
        if (!s) return;
        s.exam_status = examStatus;
        if (examStatus === 'পাস করেছে') {
            if (!s.result || s.result === 'Pending') {
                s.result = 'A+ (5.00)';
                s.gpa = '5.00';
            }
            s.status = 'Completed';
        } else {
            s.result = 'Pending';
            s.gpa = 'Pending';
            s.status = 'Active';
        }
    });
    renderAdminApp();
    notifyToast('কোর্স স্ট্যাটাস আপডেট হয়েছে!');
}

function inlineUpdateStudentGpa(idx, gradeStr) {
    if (!gradeStr) return;
    DCITStore.updateDB(db => {
        const s = db.students[idx];
        if (!s) return;
        s.result = gradeStr;
        const m = gradeStr.match(/\(([\d.]+)\)/);
        s.gpa = m ? m[1] : '5.00';
        s.exam_status = 'পাস করেছে';
        s.status = 'Completed';
        let cert = (db.certificates || []).find(c => String(c.reg_no) === String(s.reg_no));
        if (!cert) {
            db.certificates = db.certificates || [];
            db.certificates.unshift({
                cert_no: 'DCIT-' + s.session + '-' + s.roll_no,
                reg_no: s.reg_no,
                roll_no: s.roll_no,
                secret_code: s.secret_code || DCITStore.generateSecretCode10(s.session, s.name, s.roll_no),
                student_name: s.name,
                father_name: s.father_name,
                mother_name: s.mother_name,
                course_name: s.course_name,
                duration: s.duration,
                batch_no: s.batch_no,
                grade: gradeStr,
                issue_date: new Date().toISOString().slice(0,10),
                status: 'Verified'
            });
        } else {
            cert.grade = gradeStr;
        }
    });
    renderAdminApp();
    notifyToast('জিপিএ ও সার্টিফিকেট রেকর্ড স্বয়ংক্রিয়ভাবে আপডেট হয়েছে!');
}

function bulkChangeStudentExamStatus(statusVal) {
    const ids = bulkSelected['students'] || [];
    if (!ids.length) return;
    DCITStore.updateDB(db => {
        db.students.forEach(s => {
            if (ids.includes(s.reg_no)) {
                s.exam_status = statusVal;
                if (statusVal === 'পাস করেছে') {
                    s.result = 'A+ (5.00)';
                    s.gpa = '5.00';
                    s.status = 'Completed';
                } else {
                    s.result = 'Pending';
                    s.gpa = 'Pending';
                }
            }
        });
    });
    clearBulkSelection('students');
    notifyToast(ids.length + ' জন শিক্ষার্থীর স্ট্যাটাস একসাথে আপডেট হয়েছে!');
}

function toggleBulkStudentCreator() {
    const el = document.getElementById('bulk-stu-drawer');
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function processBulkStudents() {
    const raw = (document.getElementById('bulk-stu-lines')?.value || '').trim();
    if (!raw) { alert('কমপক্ষে ১টি লাইন লিখুন!'); return; }
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    let added = 0;
    DCITStore.updateDB(db => {
        lines.forEach((line, idx) => {
            const parts = line.split(',').map(p => p.trim());
            if (parts.length >= 2) {
                const regNo = String(202600 + db.students.length + 1);
                const rollNo = String(db.students.length + 1).padStart(2, '0');
                const name = parts[0];
                const secret = DCITStore.generateSecretCode10('2026', name, rollNo);
                db.students.unshift({
                    id: Date.now() + idx,
                    reg_no: regNo,
                    roll_no: rollNo,
                    secret_code: secret,
                    name: name,
                    father_name: parts[1] || 'মোঃ আব্দুল করিম',
                    mother_name: parts[2] || 'মিসেস রোকেয়া বেগম',
                    phone: parts[3] || '01771770044',
                    course_name: parts[4] || 'Office Application',
                    batch_no: parts[5] || 'Batch-28',
                    duration: '6 Months',
                    class_schedule: 'শনি - সোম - বুধ (সকাল ১০টা)',
                    session: '2026',
                    exam_status: 'নতুন স্টুডেন্ট',
                    result: 'Pending',
                    gpa: 'Pending',
                    status: 'Active',
                    photo: '../images/logo.png'
                });
                added++;
            }
        });
    });
    renderAdminApp();
    notifyToast(added + ' জন শিক্ষার্থী বাল্ক এন্ট্রি করা হয়েছে!');
}

function openStudentPopupModal(editIdx = null) {
    const db = DCITStore.getDB();
    const s = editIdx !== null ? db.students[editIdx] : null;
    const courses = db.courses || [];
    const settings = db.settings || {};
    const disPct = Number(settings.disability_discount_percent || 25);
    const refPct = Number(settings.teacher_refer_discount_percent || 10);
    const payMethods = (settings.payment_methods || 'বিকাশ, নগদ, রকেট, ব্যাংক, ক্যাশ').split(',').map(m => m.trim()).filter(Boolean);
    const nextReg = s ? s.reg_no : String(202600 + db.students.length + 1);
    const nextRoll = s ? s.roll_no : String(db.students.length + 1).padStart(2, '0');
    const nextSecret = s ? (s.secret_code || DCITStore.generateSecretCode10('2026', s.name, s.roll_no)) : DCITStore.generateSecretCode10('2026', 'STU', nextRoll);

    const html = `
    <form onsubmit="saveStudentFromPopup(event, ${editIdx !== null ? editIdx : 'null'})">
        <div class="form-grid">
            <div class="form-group">
                <label>পাসপোর্ট সাইজের ছবি আপলোড (প্রিভিউ সহ)</label>
                <input type="file" accept="image/*" class="form-control" onchange="previewUploadImg(this,'stu-pop-photo-prev','stu-pop-photo-val')">
                <input type="hidden" id="stu-pop-photo-val" value="${esc(s ? s.photo : '../images/logo.png')}">
                <img id="stu-pop-photo-prev" src="${esc(s ? s.photo : '../images/logo.png')}" style="margin-top:6px; width:70px; height:82px; object-fit:cover; border-radius:8px; border:2px solid #0ea5e9;">
            </div>
            <div class="form-group">
                <label>সার্টিফিকেট / জন্মনিবন্ধন ছবি আপলোড</label>
                <input type="file" accept="image/*" class="form-control" onchange="previewUploadImg(this,'stu-pop-cert-prev','stu-pop-cert-val')">
                <input type="hidden" id="stu-pop-cert-val" value="${esc(s?.cert_doc || '')}">
                <img id="stu-pop-cert-prev" src="${esc(s?.cert_doc || '../images/logo.png')}" style="margin-top:6px; width:70px; height:55px; object-fit:cover; border-radius:8px; border:1px dashed #94a3b8;">
            </div>
            <div class="form-group"><label>রেজিস্ট্রেশন নাম্বার *</label><input type="text" id="sp-reg" class="form-control" value="${esc(nextReg)}" required></div>
            <div class="form-group"><label>রোল নাম্বার *</label><input type="text" id="sp-roll" class="form-control" value="${esc(nextRoll)}" required></div>
            <div class="form-group"><label>১০ অক্ষরের গোপন কোড (Secret Code) *</label><input type="text" id="sp-secret" class="form-control" maxlength="10" value="${esc(nextSecret)}" required></div>
            <div class="form-group"><label>শিক্ষার্থীর নাম *</label><input type="text" id="sp-name" class="form-control" value="${esc(s?.name || '')}" required></div>
            <div class="form-group"><label>পিতার নাম *</label><input type="text" id="sp-father" class="form-control" value="${esc(s?.father_name || '')}" required></div>
            <div class="form-group"><label>মাতার নাম *</label><input type="text" id="sp-mother" class="form-control" value="${esc(s?.mother_name || '')}" required></div>
            <div class="form-group"><label>জন্ম-তারিখ (DOB) *</label><input type="date" id="sp-dob" class="form-control" value="${esc(s?.dob || '2003-01-15')}" required></div>
            <div class="form-group"><label>এনআইডি / জন্মনিবন্ধন নাম্বার *</label><input type="text" id="sp-nid" class="form-control" value="${esc(s?.nid || '')}" required></div>
            <div class="form-group"><label>মোবাইল নাম্বার *</label><input type="text" id="sp-phone" class="form-control" value="${esc(s?.phone || '')}" required></div>
            <div class="form-group"><label>শিক্ষাগত যোগ্যতা</label><input type="text" id="sp-edu" class="form-control" value="${esc(s?.education || 'HSC / Diploma')}"></div>
            <div class="form-group"><label>বর্তমান শিক্ষা প্রতিষ্ঠান</label><input type="text" id="sp-inst" class="form-control" value="${esc(s?.current_institute || 'Cumilla Victoria Govt. College')}"></div>
            <div class="form-group"><label>কোথা থেকে আমাদের প্রতিষ্ঠান সম্পর্কে জেনেছেন?</label>
                <select id="sp-heard" class="form-control" onchange="recalcPopupStudentFee()">
                    ${['ফেসবুক পেজ','প্রাক্তন শিক্ষার্থী','শিক্ষক রেফারেন্স (ডিসকাউন্ট প্রযোজ্য)','ব্যানার / পোস্টার','ওয়েবসাইট'].map(h => `<option value="${h}" ${s?.heard_from===h?'selected':''}>${h}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label>কোনো ডিসএবিলিটিস (শারীরিক প্রতিবন্ধকতা) আছে?</label>
                <select id="sp-disability" class="form-control" onchange="togglePopupDisabilityRow();recalcPopupStudentFee();">
                    <option value="না" ${s?.disability!=='হ্যাঁ'?'selected':''}>না (No)</option>
                    <option value="হ্যাঁ" ${s?.disability==='হ্যাঁ'?'selected':''}>হ্যাঁ (Yes - ${disPct}% ডিসকাউন্ট)</option>
                </select>
            </div>
            <div class="form-group" id="sp-med-row" style="display:${s?.disability==='হ্যাঁ'?'block':'none'}; background:#fef2f2; padding:10px; border-radius:8px; border:1px solid #fecaca;">
                <label style="color:#dc2626;">মেডিক্যাল রিপোর্ট আপলোড করুন (${disPct}% বিশেষ ছাড়)</label>
                <input type="file" accept="image/*,.pdf" class="form-control" onchange="previewUploadImg(this,'sp-med-prev','sp-med-val')">
                <input type="hidden" id="sp-med-val" value="${esc(s?.medical_report || '')}">
                <img id="sp-med-prev" src="${esc(s?.medical_report || '../images/logo.png')}" style="width:55px;height:45px;margin-top:4px;object-fit:cover;">
            </div>
            <div class="form-group"><label>কোর্স নাম *</label>
                <select id="sp-course" class="form-control" onchange="autoSelectCourseFeeDuration()" required>
                    ${courses.map(c => `<option value="${esc(c.title)}" data-fee="${c.fee}" data-dur="${esc(c.duration)}" ${s?.course_name===c.title?'selected':''}>${esc(c.title)}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label>কোর্স ফি (অটো সিলেক্ট + ডিসকাউন্ট ক্যালকুলেশন)</label><input type="number" id="sp-fee" class="form-control" value="${esc(s?.course_fee || (courses[0]?.fee || 4000))}" readonly style="background:#f1f5f9;font-weight:800;"></div>
            <div class="form-group"><label>কোর্সের মেয়াদ (অটো সিলেক্ট)</label><input type="text" id="sp-duration" class="form-control" value="${esc(s?.duration || (courses[0]?.duration || '6 Months'))}"></div>
            <div class="form-group"><label>পেমেন্ট মেথড</label>
                <select id="sp-pay-method" class="form-control" onchange="togglePopupTrxRow()">
                    ${payMethods.map(m => `<option value="${esc(m)}" ${s?.payment_method===m?'selected':''}>${esc(m)}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label>পেইড এমাউন্ট (Paid Amount ৳) *</label><input type="number" id="sp-paid" class="form-control" value="${esc(s?.paid_amount ?? (courses[0]?.fee || 4000))}" oninput="recalcPopupDue()" required></div>
            <div class="form-group"><label>ডিউ এমাউন্ট (Due Amount ৳ - অটো ক্যালকুলেট)</label><input type="number" id="sp-due" class="form-control" value="${esc(s?.due_amount ?? 0)}" readonly style="background:#fff1f2;color:#dc2626;font-weight:800;"></div>
            <div class="form-group" id="sp-trx-row" style="display:${s?.payment_method==='ক্যাশ' || s?.payment_method==='Cash'?'none':'block'};">
                <label>ট্রানজেকশন আইডি (Transaction ID)</label>
                <input type="text" id="sp-trx" class="form-control" placeholder="যেমন: 9H7G6F5D" value="${esc(s?.trx_id || 'TRX' + Date.now().toString().slice(-6))}">
            </div>
            <div class="form-group"><label>ব্যাচ নং ও সেশন সাল</label>
                <div style="display:flex;gap:6px;">
                    <input type="text" id="sp-batch" class="form-control" value="${esc(s?.batch_no || 'Batch-28')}" placeholder="Batch-28">
                    <input type="text" id="sp-session" class="form-control" value="${esc(s?.session || '2026')}" placeholder="2026">
                </div>
            </div>
            <div class="form-group"><label>অনুমোদন স্ট্যাটাস (Approval)</label>
                <select id="sp-approval" class="form-control">
                    <option value="Approved" ${s?.approval_status!=='Pending'?'selected':''}>অনুমোদিত (Approved)</option>
                    <option value="Pending" ${s?.approval_status==='Pending'?'selected':''}>অপেক্ষমান (Pending)</option>
                </select>
            </div>
            <div class="form-group" style="grid-column:1/-1;"><label>বর্তমান ও স্থায়ী ঠিকানা *</label><input type="text" id="sp-address" class="form-control" value="${esc(s?.address || 'পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা')}" required></div>
            <div class="form-group" style="grid-column:1/-1; background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #cbd5e1;">
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;margin:0;">
                    <input type="checkbox" id="sp-oath" checked required>
                    <span><strong>শপথনামা:</strong> আমি অঙ্গীকার করছি যে উপরের সকল তথ্য সঠিক এবং আমি প্রতিষ্ঠানের সকল নিয়ম-শৃঙ্খলা মেনে চলব। (শিক্ষক রেফার ছাড়: ${refPct}%, প্রতিবন্ধী ছাড়: ${disPct}%)</span>
                </label>
            </div>
        </div>
        <div style="margin-top:18px; display:flex; justify-content:flex-end; gap:10px;">
            <button type="button" onclick="closeAdminModal()" class="btn btn-outline">বাতিল</button>
            <button type="submit" class="btn btn-primary"><i class="fa fa-check-circle"></i> সাবমিট ও সংরক্ষণ করুন</button>
        </div>
    </form>`;
    openAdminModal(s ? 'শিক্ষার্থীর তথ্য সম্পাদনা করুন' : 'নতুন স্টুডেন্ট এড করুন (কমপ্লিট পপআপ ফর্ম)', html);
}

function previewUploadImg(input, imgId, hiddenId) {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const imgEl = document.getElementById(imgId);
        const hidEl = document.getElementById(hiddenId);
        if (imgEl) imgEl.src = e.target.result;
        if (hidEl) hidEl.value = e.target.result;
    };
    reader.readAsDataURL(file);
}

function togglePopupDisabilityRow() {
    const v = document.getElementById('sp-disability')?.value;
    const row = document.getElementById('sp-med-row');
    if (row) row.style.display = v === 'হ্যাঁ' ? 'block' : 'none';
}

function togglePopupTrxRow() {
    const m = (document.getElementById('sp-pay-method')?.value || '').trim();
    const row = document.getElementById('sp-trx-row');
    if (row) row.style.display = (m === 'ক্যাশ' || m.toLowerCase() === 'cash') ? 'none' : 'block';
}

function autoSelectCourseFeeDuration() {
    const sel = document.getElementById('sp-course');
    if (!sel) return;
    const opt = sel.options[sel.selectedIndex];
    const dur = opt?.getAttribute('data-dur') || '6 Months';
    document.getElementById('sp-duration').value = dur;
    recalcPopupStudentFee();
}

function recalcPopupStudentFee() {
    const db = DCITStore.getDB();
    const settings = db.settings || {};
    const disPct = Number(settings.disability_discount_percent || 25);
    const refPct = Number(settings.teacher_refer_discount_percent || 10);
    const sel = document.getElementById('sp-course');
    const opt = sel ? sel.options[sel.selectedIndex] : null;
    let baseFee = Number(opt?.getAttribute('data-fee') || 4000);
    const isDis = document.getElementById('sp-disability')?.value === 'হ্যাঁ';
    const isRef = (document.getElementById('sp-heard')?.value || '').includes('শিক্ষক');
    let totalDiscPct = (isDis ? disPct : 0) + (isRef ? refPct : 0);
    let finalFee = Math.round(baseFee * (1 - totalDiscPct / 100));
    document.getElementById('sp-fee').value = finalFee;
    recalcPopupDue();
}

function recalcPopupDue() {
    const fee = Number(document.getElementById('sp-fee')?.value || 0);
    const paid = Number(document.getElementById('sp-paid')?.value || 0);
    const dueEl = document.getElementById('sp-due');
    if (dueEl) dueEl.value = Math.max(0, fee - paid);
}

function saveStudentFromPopup(e, editIdx) {
    e.preventDefault();
    const obj = {
        reg_no: document.getElementById('sp-reg').value.trim(),
        roll_no: document.getElementById('sp-roll').value.trim(),
        secret_code: document.getElementById('sp-secret').value.trim().slice(0,10).padEnd(10,'0'),
        name: document.getElementById('sp-name').value.trim(),
        father_name: document.getElementById('sp-father').value.trim(),
        mother_name: document.getElementById('sp-mother').value.trim(),
        dob: document.getElementById('sp-dob').value,
        nid: document.getElementById('sp-nid').value.trim(),
        phone: document.getElementById('sp-phone').value.trim(),
        education: document.getElementById('sp-edu').value.trim(),
        current_institute: document.getElementById('sp-inst').value.trim(),
        heard_from: document.getElementById('sp-heard').value,
        disability: document.getElementById('sp-disability').value,
        medical_report: document.getElementById('sp-med-val').value,
        cert_doc: document.getElementById('sp-cert-val')?.value || '',
        course_name: document.getElementById('sp-course').value,
        course_fee: Number(document.getElementById('sp-fee').value || 0),
        duration: document.getElementById('sp-duration').value,
        payment_method: document.getElementById('sp-pay-method').value,
        paid_amount: Number(document.getElementById('sp-paid').value || 0),
        due_amount: Number(document.getElementById('sp-due').value || 0),
        trx_id: document.getElementById('sp-trx').value.trim(),
        batch_no: document.getElementById('sp-batch').value.trim(),
        session: document.getElementById('sp-session').value.trim(),
        approval_status: document.getElementById('sp-approval').value,
        address: document.getElementById('sp-address').value.trim(),
        photo: document.getElementById('stu-pop-photo-val').value || '../images/logo.png'
    };

    DCITStore.updateDB(db => {
        if (editIdx !== null && db.students[editIdx]) {
            db.students[editIdx] = { ...db.students[editIdx], ...obj };
        } else {
            obj.id = Date.now();
            obj.exam_status = 'নতুন স্টুডেন্ট';
            obj.result = 'Pending';
            obj.gpa = 'Pending';
            obj.status = 'Active';
            obj.class_schedule = 'শনি - সোম - বুধ (সকাল ১০টা)';
            db.students.unshift(obj);
            db.payments = db.payments || [];
            db.payments.unshift({
                id: Date.now(),
                receipt_no: 'MR-' + Date.now().toString().slice(-5),
                reg_no: obj.reg_no,
                student_name: obj.name,
                phone: obj.phone,
                course_name: obj.course_name,
                batch_no: obj.batch_no,
                total_fee: obj.course_fee,
                paid_amount: obj.paid_amount,
                due_amount: obj.due_amount,
                method: obj.payment_method,
                trx_id: obj.trx_id || 'CASH',
                payment_date: new Date().toISOString().slice(0,10),
                status: obj.due_amount > 0 ? 'Partial Due' : 'Paid'
            });
        }
    });
    closeAdminModal();
    renderAdminApp();
    notifyToast('শিক্ষার্থীর তথ্য ও পেমেন্ট রেকর্ড সফলভাবে সংরক্ষিত হয়েছে!');
}

function quickViewStudent(idx) {
    const db = DCITStore.getDB();
    const s = db.students[idx];
    if (!s) return;
    const html = `
    <div class="qv-profile-header">
        <img src="${esc(s.photo || '../images/logo.png')}" class="qv-avatar" onerror="this.src='../images/logo.png'">
        <div>
            <h2 style="margin:0 0 6px; font-size:22px;">${esc(s.name)}</h2>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <span class="badge badge-info">রেজিঃ ${esc(s.reg_no)}</span>
                <span class="badge badge-warning">রোলঃ ${esc(s.roll_no)}</span>
                <span class="badge badge-success">গোপন কোডঃ ${esc(s.secret_code || 'DC20SAG001')}</span>
            </div>
            <p style="margin:8px 0 0; opacity:0.9; font-size:13px;"><i class="fa fa-graduation-cap"></i> ${esc(s.course_name)} (${esc(s.duration || '6 Months')}) — ${esc(s.batch_no || 'Batch-28')}</p>
        </div>
    </div>
    <div class="qv-grid">
        <div class="qv-box"><span class="lbl">পিতার নাম</span><span class="val">${esc(s.father_name || '-')}</span></div>
        <div class="qv-box"><span class="lbl">মাতার নাম</span><span class="val">${esc(s.mother_name || '-')}</span></div>
        <div class="qv-box"><span class="lbl">মোবাইল নাম্বার</span><span class="val">${esc(s.phone || '01771770044')}</span></div>
        <div class="qv-box"><span class="lbl">জন্ম-তারিখ ও এনআইডি</span><span class="val">${esc(s.dob || '2003-01-15')} | ${esc(s.nid || 'N/A')}</span></div>
        <div class="qv-box"><span class="lbl">কোর্স স্ট্যাটাস ও ফলাফল</span><span class="val">${esc(s.exam_status || 'নতুন স্টুডেন্ট')} — জিপিএ: ${esc(s.result || 'Pending')}</span></div>
        <div class="qv-box"><span class="lbl">ক্লাস সিডিউল ও সেশন</span><span class="val">${esc(s.class_schedule || 'শনি-সোম-বুধ')} (${esc(s.session || '2026')})</span></div>
        <div class="qv-box"><span class="lbl">পেমেন্ট ও বকেয়া তথ্য</span><span class="val">ফি: ৳${s.course_fee||4000} | পরিশোধ: ৳${s.paid_amount||4000} | বকেয়া: ৳${s.due_amount||0}</span></div>
        <div class="qv-box"><span class="lbl">ঠিকানা ও প্রতিষ্ঠান</span><span class="val">${esc(s.address || 'কুমিল্লা')} (${esc(s.current_institute || '-')})</span></div>
    </div>
    <div style="margin-top:18px; display:flex; justify-content:flex-end; gap:10px;">
        <button onclick="openAutoSmsGatewayModal('${esc(s.phone||'01771770044')}','প্রিয় ${esc(s.name)}, আপনার রেজিঃ ${esc(s.reg_no)} এবং গোপন কোড ${esc(s.secret_code)}।')" class="btn btn-accent btn-sm"><i class="fa fa-paper-plane"></i> মেসেজ পাঠান</button>
        <button onclick="closeAdminModal();openStudentPopupModal(${idx});" class="btn btn-primary btn-sm"><i class="fa fa-edit"></i> এডিট করুন</button>
        <button onclick="closeAdminModal()" class="btn btn-outline btn-sm">বন্ধ করুন</button>
    </div>`;
    openAdminModal('শিক্ষার্থীর বিস্তারিত প্রোফাইল (Quick View Card)', html);
}

function deleteStudent(idx) {
    if (!confirm('আপনি কি নিশ্চিতভাবে এই শিক্ষার্থীর তথ্য মুছে ফেলতে চান?')) return;
    DCITStore.updateDB(db => { db.students.splice(idx, 1); });
    renderAdminApp();
    notifyToast('শিক্ষার্থী মুছে ফেলা হয়েছে।', 'danger');
}

function renderTabResults(el, db) {
    renderTabStudents(el, db);
    const hdr = el.querySelector('.panel-header h3');
    if (hdr) hdr.innerHTML = `<i class="fa fa-trophy" style="color:#eab308;"></i> রেজাল্ট আপডেট ও জিপিএ পাবলিশিং সেকশন (পাস সিলেক্ট করলেই জিপিএ ও সার্টিফিকেট অটো জেনারেট হবে)`;
}

// ============================================================================
// 4. CERTIFICATES, ADMISSIONS, CLASSES, COURSES, TEACHERS, NOTICES, REPORTS, SMS, SETTINGS
// ============================================================================
let certStatusFilter = '';
function renderTabCertificates(el, db) {
    const certs = db.certificates || [];
    const verifiedCount = certs.filter(c => c.status !== 'Revoked').length;
    const filtered = certs.filter(c => {
        const q = currentSearch.toLowerCase();
        const matchQ = !q || [c.cert_no, c.reg_no, c.student_name, c.secret_code, c.course_name].some(v => String(v||'').toLowerCase().includes(q));
        const matchSt = !certStatusFilter || (c.status || 'Verified') === certStatusFilter;
        return matchQ && matchSt;
    });
    const pg = paginateAdminList(filtered, 'certificates');

    el.innerHTML = `
    <div class="digital-counter-grid">
        <div class="digital-counter-card ${certStatusFilter===''?'active':''}" onclick="certStatusFilter='';renderAdminApp();">
            <div><div class="dc-num">${certs.length}</div><div class="dc-lbl">মোট সার্টিফিকেট</div></div>
            <div class="dc-icon"><i class="fa fa-certificate"></i></div>
        </div>
        <div class="digital-counter-card ${certStatusFilter==='Verified'?'active':''}" onclick="certStatusFilter='Verified';renderAdminApp();">
            <div><div class="dc-num" style="color:#16a34a;">${verifiedCount}</div><div class="dc-lbl">ভেরিফাইড সার্টিফিকেট</div></div>
            <div class="dc-icon" style="background:#dcfce7;color:#16a34a;"><i class="fa fa-check-circle"></i></div>
        </div>
    </div>

    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-certificate"></i> সার্টিফিকেট ও ১০-অক্ষরের গোপন কোড ম্যানেজমেন্ট (${filtered.length})</h3>
            <button onclick="openCertificateModal()" class="btn btn-primary btn-sm"><i class="fa fa-plus-circle"></i> ➕ নতুন সার্টিফিকেট ইস্যু করুন (রেজিঃ সার্চ সহ)</button>
        </div>
        <div class="filter-bar">
            <input type="text" class="form-control" placeholder="রেজিঃ নং, নাম, সার্টিফিকেট নং বা গোপন কোড দিয়ে খুঁজুন..." value="${esc(currentSearch)}" oninput="currentSearch=this.value;adminPages['certificates']=1;renderAdminApp();" style="max-width:340px;">
        </div>
        ${renderBulkToolbarHtml('certificates')}
        <div class="dcp-table-wrap">
            <table class="dcp-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" onchange="toggleSelectAllRows('certificates',this.checked,${JSON.stringify(pg.slice.map(c=>c.reg_no)).replace(/"/g,'&quot;')})"></th>
                        <th>সার্টিফিকেট নং</th>
                        <th>রেজিঃ ও রোল</th>
                        <th>১০-অক্ষরের গোপন কোড</th>
                        <th>শিক্ষার্থীর নাম ও পিতা</th>
                        <th>কোর্স ও মেয়াদ</th>
                        <th>গ্রেড / ফলাফল</th>
                        <th>ইস্যু তারিখ</th>
                        <th>অ্যাকশন</th>
                    </tr>
                </thead>
                <tbody>
                    ${pg.slice.map((c) => {
                        const realIdx = certs.findIndex(x => x.reg_no === c.reg_no && x.cert_no === c.cert_no);
                        const checked = (bulkSelected['certificates']||[]).includes(c.reg_no) ? 'checked' : '';
                        return `
                        <tr>
                            <td><input type="checkbox" ${checked} onchange="toggleBulkRow('certificates','${esc(c.reg_no)}',this.checked)"></td>
                            <td><strong>${esc(c.cert_no)}</strong></td>
                            <td>রেজিঃ <strong>${esc(c.reg_no)}</strong><br><small>রোলঃ ${esc(c.roll_no)}</small></td>
                            <td><span class="badge badge-info" style="font-family:monospace;font-size:13px;"><i class="fa fa-key"></i> ${esc(c.secret_code || 'DC20SAG001')}</span></td>
                            <td><strong>${esc(c.student_name)}</strong><br><small>পিতা: ${esc(c.father_name || '-')}</small></td>
                            <td>${esc(c.course_name)}<br><small>${esc(c.duration || '6 Months')}</small></td>
                            <td><span class="badge badge-success">${esc(c.grade)}</span></td>
                            <td>${esc(c.issue_date)}</td>
                            <td>
                                <button onclick="quickViewCert(${realIdx})" class="btn btn-outline btn-xs" title="কুইক ভিউ"><i class="fa fa-eye"></i></button>
                                <button onclick="openCertificateModal(${realIdx})" class="btn btn-primary btn-xs" title="এডিট"><i class="fa fa-edit"></i></button>
                                <button onclick="deleteCert(${realIdx})" class="btn btn-danger btn-xs" title="ডিলিট"><i class="fa fa-trash"></i></button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
        ${renderAdminPaginationHtml('certificates', pg)}
    </div>`;
}

function openCertificateModal(editIdx = null) {
    const db = DCITStore.getDB();
    const c = editIdx !== null ? db.certificates[editIdx] : null;
    const html = `
    <div style="background:#f0f9ff; padding:14px; border-radius:10px; border:1px solid #bae6fd; margin-bottom:16px;">
        <label style="font-weight:700; color:#0369a1; display:block; margin-bottom:6px;"><i class="fa fa-magic"></i> স্টুডেন্ট রেজিস্ট্রেশন নাম্বার দিয়ে অটো-ফিল করুন:</label>
        <div style="display:flex; gap:8px;">
            <input type="text" id="cert-lookup-reg" class="form-control" placeholder="যেমন: 202320 বা রেজিঃ নাম্বার লিখুন..." value="${esc(c?.reg_no || '')}">
            <button type="button" onclick="autoFillCertByRegNo()" class="btn btn-primary"><i class="fa fa-search"></i> সার্চ ও অটো-ফিল</button>
        </div>
    </div>
    <form onsubmit="saveCertModal(event, ${editIdx !== null ? editIdx : 'null'})">
        <div class="form-grid">
            <div class="form-group"><label>সার্টিফিকেট নাম্বার *</label><input type="text" id="cm-certno" class="form-control" value="${esc(c?.cert_no || 'DCIT-2026-' + Math.floor(100+Math.random()*900))}" required></div>
            <div class="form-group"><label>রেজিস্ট্রেশন নাম্বার *</label><input type="text" id="cm-reg" class="form-control" value="${esc(c?.reg_no || '')}" required></div>
            <div class="form-group"><label>রোল নাম্বার *</label><input type="text" id="cm-roll" class="form-control" value="${esc(c?.roll_no || '')}" required></div>
            <div class="form-group"><label>১০ অক্ষরের গোপন কোড (Secret Code) *</label><input type="text" id="cm-secret" class="form-control" maxlength="10" value="${esc(c?.secret_code || 'DC26STU001')}" required></div>
            <div class="form-group"><label>শিক্ষার্থীর নাম *</label><input type="text" id="cm-name" class="form-control" value="${esc(c?.student_name || '')}" required></div>
            <div class="form-group"><label>পিতার নাম *</label><input type="text" id="cm-father" class="form-control" value="${esc(c?.father_name || '')}" required></div>
            <div class="form-group"><label>মাতার নাম *</label><input type="text" id="cm-mother" class="form-control" value="${esc(c?.mother_name || '')}" required></div>
            <div class="form-group"><label>কোর্স নাম *</label><input type="text" id="cm-course" class="form-control" value="${esc(c?.course_name || 'Office Application')}" required></div>
            <div class="form-group"><label>কোর্সের মেয়াদ *</label><input type="text" id="cm-dur" class="form-control" value="${esc(c?.duration || '6 Months')}" required></div>
            <div class="form-group"><label>ব্যাচ নং *</label><input type="text" id="cm-batch" class="form-control" value="${esc(c?.batch_no || 'Batch-28')}" required></div>
            <div class="form-group"><label>জিপিএ / গ্রেড *</label><input type="text" id="cm-grade" class="form-control" value="${esc(c?.grade || 'A+ (5.00)')}" required></div>
            <div class="form-group"><label>ইস্যু তারিখ *</label><input type="date" id="cm-date" class="form-control" value="${esc(c?.issue_date || new Date().toISOString().slice(0,10))}" required></div>
        </div>
        <div style="margin-top:16px; display:flex; justify-content:flex-end; gap:10px;">
            <button type="button" onclick="closeAdminModal()" class="btn btn-outline">বাতিল</button>
            <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> সার্টিফিকেট সংরক্ষণ করুন</button>
        </div>
    </form>`;
    openAdminModal(c ? 'সার্টিফিকেট তথ্য এডিট করুন' : 'নতুন সার্টিফিকেট তৈরি করুন (রেজিঃ অটো-ফিল)', html);
}

function autoFillCertByRegNo() {
    const reg = (document.getElementById('cert-lookup-reg')?.value || '').trim();
    const db = DCITStore.getDB();
    const s = (db.students || []).find(x => String(x.reg_no) === reg);
    if (!s) {
        alert('এই রেজিস্ট্রেশন নাম্বারে কোনো শিক্ষার্থী পাওয়া যায়নি!');
        return;
    }
    document.getElementById('cm-reg').value = s.reg_no;
    document.getElementById('cm-roll').value = s.roll_no || '';
    document.getElementById('cm-secret').value = (s.secret_code || DCITStore.generateSecretCode10(s.session, s.name, s.roll_no)).slice(0,10);
    document.getElementById('cm-name').value = s.name || '';
    document.getElementById('cm-father').value = s.father_name || '';
    document.getElementById('cm-mother').value = s.mother_name || '';
    document.getElementById('cm-course').value = s.course_name || '';
    document.getElementById('cm-dur').value = s.duration || '6 Months';
    document.getElementById('cm-batch').value = s.batch_no || 'Batch-28';
    document.getElementById('cm-grade').value = (s.result && s.result !== 'Pending') ? s.result : 'A+ (5.00)';
    document.getElementById('cm-certno').value = 'DCIT-' + (s.session || '2026') + '-' + (s.roll_no || '01');
    notifyToast('শিক্ষার্থীর সকল তথ্য স্বয়ংক্রিয়ভাবে ফর্মে বসানো হয়েছে!');
}

function saveCertModal(e, editIdx) {
    e.preventDefault();
    const obj = {
        cert_no: document.getElementById('cm-certno').value.trim(),
        reg_no: document.getElementById('cm-reg').value.trim(),
        roll_no: document.getElementById('cm-roll').value.trim(),
        secret_code: document.getElementById('cm-secret').value.trim().slice(0,10).padEnd(10,'0'),
        student_name: document.getElementById('cm-name').value.trim(),
        father_name: document.getElementById('cm-father').value.trim(),
        mother_name: document.getElementById('cm-mother').value.trim(),
        course_name: document.getElementById('cm-course').value.trim(),
        duration: document.getElementById('cm-dur').value.trim(),
        batch_no: document.getElementById('cm-batch').value.trim(),
        grade: document.getElementById('cm-grade').value.trim(),
        issue_date: document.getElementById('cm-date').value,
        status: 'Verified'
    };
    DCITStore.updateDB(db => {
        if (editIdx !== null && db.certificates[editIdx]) db.certificates[editIdx] = obj;
        else db.certificates.unshift(obj);
    });
    closeAdminModal();
    renderAdminApp();
    notifyToast('সার্টিফিকেট সংরক্ষিত হয়েছে!');
}

function quickViewCert(idx) {
    const c = DCITStore.getDB().certificates[idx];
    if (!c) return;
    openAdminModal('সার্টিফিকেট কুইক ভিউ', `
        <div class="qv-profile-header">
            <div style="font-size:44px;color:#38bdf8;"><i class="fa fa-certificate"></i></div>
            <div>
                <h2 style="margin:0;">${esc(c.student_name)}</h2>
                <p style="margin:4px 0 0;">সার্টিফিকেট নং: <strong>${esc(c.cert_no)}</strong> | গোপন কোড: <strong>${esc(c.secret_code)}</strong></p>
            </div>
        </div>
        <div class="qv-grid">
            <div class="qv-box"><span class="lbl">রেজিস্ট্রেশন ও রোল</span><span class="val">রেজিঃ ${esc(c.reg_no)} | রোলঃ ${esc(c.roll_no)}</span></div>
            <div class="qv-box"><span class="lbl">পিতা ও মাতার নাম</span><span class="val">${esc(c.father_name)} / ${esc(c.mother_name)}</span></div>
            <div class="qv-box"><span class="lbl">কোর্স ও মেয়াদ</span><span class="val">${esc(c.course_name)} (${esc(c.duration)})</span></div>
            <div class="qv-box"><span class="lbl">জিপিএ এবং ইস্যু তারিখ</span><span class="val">${esc(c.grade)} | ${esc(c.issue_date)}</span></div>
        </div>
    `);
}

function deleteCert(idx) {
    if (!confirm('সার্টিফিকেটটি ডিলিট করতে চান?')) return;
    DCITStore.updateDB(db => { db.certificates.splice(idx, 1); });
    renderAdminApp();
}

let admStatusFilter = '';
function renderTabAdmissions(el, db) {
    const adms = db.admissions || [];
    const cntPending = adms.filter(a => a.status !== 'Approved').length;
    const cntApproved = adms.filter(a => a.status === 'Approved').length;
    const filtered = adms.filter(a => {
        const q = currentSearch.toLowerCase();
        const matchQ = !q || [a.application_no, a.full_name, a.phone, a.course_name].some(v => String(v||'').toLowerCase().includes(q));
        const matchSt = !admStatusFilter || a.status === admStatusFilter;
        return matchQ && matchSt;
    });
    const pg = paginateAdminList(filtered, 'admissions');

    el.innerHTML = `
    <div class="digital-counter-grid">
        <div class="digital-counter-card ${admStatusFilter===''?'active':''}" onclick="admStatusFilter='';renderAdminApp();">
            <div><div class="dc-num">${adms.length}</div><div class="dc-lbl">সকল অনলাইন আবেদন</div></div>
            <div class="dc-icon"><i class="fa fa-id-card-o"></i></div>
        </div>
        <div class="digital-counter-card ${admStatusFilter==='Pending Review'?'active':''}" onclick="admStatusFilter='Pending Review';renderAdminApp();">
            <div><div class="dc-num" style="color:#d97706;">${cntPending}</div><div class="dc-lbl">পেন্ডিং আবেদন</div></div>
            <div class="dc-icon" style="background:#fef3c7;color:#d97706;"><i class="fa fa-clock-o"></i></div>
        </div>
        <div class="digital-counter-card ${admStatusFilter==='Approved'?'active':''}" onclick="admStatusFilter='Approved';renderAdminApp();">
            <div><div class="dc-num" style="color:#16a34a;">${cntApproved}</div><div class="dc-lbl">অনুমোদিত (Approved)</div></div>
            <div class="dc-icon" style="background:#dcfce7;color:#16a34a;"><i class="fa fa-check"></i></div>
        </div>
    </div>

    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-id-card-o"></i> অনলাইন ভর্তি আবেদন তালিকা (${filtered.length})</h3>
        </div>
        ${renderBulkToolbarHtml('admissions')}
        <div class="dcp-table-wrap">
            <table class="dcp-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" onchange="toggleSelectAllRows('admissions',this.checked,${JSON.stringify(pg.slice.map(a=>a.application_no)).replace(/"/g,'&quot;')})"></th>
                        <th>আবেদন নং</th>
                        <th>আবেদনকারীর নাম ও পিতা</th>
                        <th>মোবাইল ও মেসেজ</th>
                        <th>কোর্স ও ব্যাচ</th>
                        <th>পেমেন্ট ও ট্রানজেকশন</th>
                        <th>স্ট্যাটাস</th>
                        <th>কুইক ভিউ, অনুমোদন, ডিলিট</th>
                    </tr>
                </thead>
                <tbody>
                    ${pg.slice.map(a => {
                        const realIdx = adms.findIndex(x => x.application_no === a.application_no);
                        const checked = (bulkSelected['admissions']||[]).includes(a.application_no) ? 'checked' : '';
                        return `
                        <tr>
                            <td><input type="checkbox" ${checked} onchange="toggleBulkRow('admissions','${esc(a.application_no)}',this.checked)"></td>
                            <td><strong>${esc(a.application_no)}</strong><br><small>${esc(a.applied_at || '')}</small></td>
                            <td><strong>${esc(a.full_name)}</strong><br><small>পিতা: ${esc(a.father_name || '-')}</small></td>
                            <td>${esc(a.phone)}<br><button onclick="openAutoSmsGatewayModal('${esc(a.phone)}','প্রিয় ${esc(a.full_name)}, আপনার ভর্তি আবেদন (${esc(a.application_no)}) গৃহীত হয়েছে।')" class="btn btn-accent btn-xs"><i class="fa fa-paper-plane"></i> SMS</button></td>
                            <td>${esc(a.course_name)}<br><small>${esc(a.preferred_batch || '')}</small></td>
                            <td>${esc(a.payment_method || 'bKash')} (${esc(a.trx_id || 'N/A')})</td>
                            <td><span class="badge ${a.status==='Approved'?'badge-success':'badge-warning'}">${esc(a.status)}</span></td>
                            <td>
                                <button onclick="quickViewAdmission(${realIdx})" class="btn btn-outline btn-xs" title="কুইক ভিউ"><i class="fa fa-eye"></i></button>
                                ${a.status !== 'Approved' ? `<button onclick="approveAdmission(${realIdx})" class="btn btn-success btn-xs" title="অনুমোদন ও স্টুডেন্ট লিস্টে যুক্ত করুন"><i class="fa fa-check"></i> Approve</button>` : ''}
                                <button onclick="deleteAdmission(${realIdx})" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
        ${renderAdminPaginationHtml('admissions', pg)}
    </div>`;
}

function quickViewAdmission(idx) {
    const a = DCITStore.getDB().admissions[idx];
    if (!a) return;
    openAdminModal('অনলাইন ভর্তি আবেদন — বিস্তারিত কুইক ভিউ', `
        <div class="qv-profile-header">
            <img src="${esc(a.photo || '../images/logo.png')}" class="qv-avatar">
            <div>
                <h2 style="margin:0;">${esc(a.full_name)}</h2>
                <p style="margin:4px 0 0;">আবেদন নং: <strong>${esc(a.application_no)}</strong> | কোর্স: <strong>${esc(a.course_name)}</strong></p>
            </div>
        </div>
        <div class="qv-grid">
            <div class="qv-box"><span class="lbl">পিতা ও মাতার নাম</span><span class="val">${esc(a.father_name || '-')} / ${esc(a.mother_name || '-')}</span></div>
            <div class="qv-box"><span class="lbl">মোবাইল ও ইমেইল</span><span class="val">${esc(a.phone)} | ${esc(a.email || 'N/A')}</span></div>
            <div class="qv-box"><span class="lbl">পেমেন্ট তথ্য</span><span class="val">${esc(a.payment_method || 'bKash')} | TrxID: ${esc(a.trx_id || 'N/A')} | ৳${esc(a.paid_amount || 0)}</span></div>
            <div class="qv-box"><span class="lbl">প্রতিবন্ধকতা ও রেফারেন্স</span><span class="val">প্রতিবন্ধকতা: ${esc(a.disability || 'না')} | মাধ্যম: ${esc(a.heard_from || 'ওয়েবসাইট')}</span></div>
            <div class="qv-box" style="grid-column:1/-1;"><span class="lbl">ঠিকানা</span><span class="val">${esc(a.address || 'কুমিল্লা')}</span></div>
        </div>
    `);
}

function approveAdmission(idx) {
    DCITStore.updateDB(db => {
        const a = db.admissions[idx];
        if (!a) return;
        a.status = 'Approved';
        const regNo = String(202600 + db.students.length + 1);
        const rollNo = String(db.students.length + 1).padStart(2, '0');
        db.students.unshift({
            id: Date.now(),
            reg_no: regNo,
            roll_no: rollNo,
            secret_code: DCITStore.generateSecretCode10('2026', a.full_name, rollNo),
            name: a.full_name,
            father_name: a.father_name || '',
            mother_name: a.mother_name || '',
            phone: a.phone,
            course_name: a.course_name,
            duration: a.duration || '6 Months',
            batch_no: 'Batch-28',
            session: '2026',
            exam_status: 'নতুন স্টুডেন্ট',
            result: 'Pending',
            gpa: 'Pending',
            status: 'Active',
            photo: a.photo || '../images/logo.png'
        });
    });
    renderAdminApp();
    notifyToast('আবেদন অনুমোদিত হয়েছে এবং স্টুডেন্ট লিস্টে যুক্ত হয়েছে!');
}

function deleteAdmission(idx) {
    if (!confirm('আবেদনটি মুছে ফেলতে চান?')) return;
    DCITStore.updateDB(db => { db.admissions.splice(idx, 1); });
    renderAdminApp();
}

function renderTabClasses(el, db) {
    const classes = db.classes || [];
    const pg = paginateAdminList(classes, 'classes');
    el.innerHTML = `
    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-calendar"></i> ক্লাস রুটিন ও ব্যাচ ম্যানেজমেন্ট (${classes.length}টি ব্যাচ)</h3>
            <button onclick="openClassModal()" class="btn btn-primary btn-sm"><i class="fa fa-plus"></i> ➕ নতুন ব্যাচ / রুটিন যুক্ত করুন</button>
        </div>
        ${renderBulkToolbarHtml('classes')}
        <div class="dcp-table-wrap">
            <table class="dcp-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" onchange="toggleSelectAllRows('classes',this.checked,${JSON.stringify(pg.slice.map(c=>c.batch_code)).replace(/"/g,'&quot;')})"></th>
                        <th>ব্যাচ কোড ও নাম</th>
                        <th>কোর্স নাম</th>
                        <th>বার ও সময়</th>
                        <th>ইনস্ট্রাক্টর ও ল্যাব</th>
                        <th>ব্যাচের স্টুডেন্ট সংখ্যা</th>
                        <th>স্ট্যাটাস</th>
                        <th>কুইক ভিউ (ব্যাচ স্টুডেন্ট লিস্ট সহ), এডিট, ডিলিট</th>
                    </tr>
                </thead>
                <tbody>
                    ${pg.slice.map((c) => {
                        const realIdx = classes.findIndex(x => x.batch_code === c.batch_code);
                        const batchStudents = (db.students || []).filter(s => s.batch_no === c.batch_code || s.batch_no === c.batch_name || s.course_name === c.course_name);
                        return `
                        <tr>
                            <td><input type="checkbox" onchange="toggleBulkRow('classes','${esc(c.batch_code)}',this.checked)"></td>
                            <td><strong>${esc(c.batch_code)}</strong><br><small>${esc(c.batch_name)}</small></td>
                            <td><strong>${esc(c.course_name)}</strong></td>
                            <td>${esc(c.days)}<br><small>${esc(c.time_slot)}</small></td>
                            <td>${esc(c.instructor)}<br><small>${esc(c.room_no)}</small></td>
                            <td><span class="badge badge-info">${batchStudents.length} জন শিক্ষার্থী</span></td>
                            <td><span class="badge badge-success">${esc(c.status || 'Running')}</span></td>
                            <td>
                                <button onclick="quickViewBatchWithStudents(${realIdx})" class="btn btn-accent btn-xs" title="ব্যাচের স্টুডেন্ট লিস্ট ও রেজিঃ দিয়ে স্টুডেন্ট এড"><i class="fa fa-eye"></i> কুইক ভিউ ও স্টুডেন্ট লিস্ট</button>
                                <button onclick="openClassModal(${realIdx})" class="btn btn-primary btn-xs"><i class="fa fa-edit"></i></button>
                                <button onclick="deleteClassBatch(${realIdx})" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
        ${renderAdminPaginationHtml('classes', pg)}
    </div>`;
}

function quickViewBatchWithStudents(idx) {
    const db = DCITStore.getDB();
    const c = db.classes[idx];
    if (!c) return;
    const batchStudents = (db.students || []).filter(s => s.batch_no === c.batch_code || s.batch_no === c.batch_name || (c.enrolled_regs || []).includes(String(s.reg_no)));

    const html = `
    <div class="qv-profile-header">
        <div style="font-size:38px;color:#38bdf8;"><i class="fa fa-users"></i></div>
        <div>
            <h2 style="margin:0;">${esc(c.batch_name)} (${esc(c.batch_code)}) — ${esc(c.course_name)}</h2>
            <p style="margin:4px 0 0;">বার: ${esc(c.days)} | সময়: ${esc(c.time_slot)} | প্রশিক্ষক: ${esc(c.instructor)} | রুম: ${esc(c.room_no)}</p>
        </div>
    </div>

    <div style="background:#f0fdf4; padding:14px; border-radius:10px; border:1px solid #bbf7d0; margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;">
        <div>
            <strong style="color:#166534;"><i class="fa fa-user-plus"></i> শুধুমাত্র রেজিস্ট্রেশন নাম্বার দিয়ে এই ব্যাচে স্টুডেন্ট যুক্ত করুন:</strong>
        </div>
        <div style="display:flex; gap:8px;">
            <input type="text" id="batch-add-reg-inp" class="form-control" placeholder="রেজিস্ট্রেশন নাম্বার লিখুন (যেমন: 202320)" style="width:240px;">
            <button onclick="addStudentToBatchByReg(${idx})" class="btn btn-success btn-sm"><i class="fa fa-plus-circle"></i> ব্যাচে যুক্ত করুন</button>
        </div>
    </div>

    <h4 style="margin:0 0 10px; color:#0f172a;"><i class="fa fa-list-ul"></i> এই ব্যাচের স্টুডেন্ট লিস্ট (${batchStudents.length} জন)</h4>
    <div class="dcp-table-wrap">
        <table class="dcp-table" style="min-width:100%;">
            <thead>
                <tr>
                    <th>রেজিঃ ও রোল</th>
                    <th>শিক্ষার্থীর নাম</th>
                    <th>পিতার নাম</th>
                    <th>মাতার নাম</th>
                    <th>মোবাইল</th>
                    <th>কোর্স নাম</th>
                </tr>
            </thead>
            <tbody>
                ${batchStudents.length === 0 ? `<tr><td colspan="6" style="text-align:center;padding:18px;">এই ব্যাচে এখনো কোনো শিক্ষার্থী যুক্ত নেই। উপরে রেজিঃ নাম্বার দিয়ে যুক্ত করুন।</td></tr>` :
                batchStudents.map(s => `
                <tr>
                    <td><strong>${esc(s.reg_no)}</strong> (রোল: ${esc(s.roll_no)})</td>
                    <td><strong>${esc(s.name)}</strong></td>
                    <td>${esc(s.father_name || '-')}</td>
                    <td>${esc(s.mother_name || '-')}</td>
                    <td>${esc(s.phone || '01771770044')}</td>
                    <td>${esc(s.course_name)}</td>
                </tr>`).join('')}
            </tbody>
        </table>
    </div>`;
    openAdminModal('ব্যাচ কুইক ভিউ এবং ব্যাচের স্টুডেন্ট ম্যানেজমেন্ট', html);
}

function addStudentToBatchByReg(batchIdx) {
    const reg = (document.getElementById('batch-add-reg-inp')?.value || '').trim();
    if (!reg) { alert('রেজিস্ট্রেশন নাম্বার লিখুন!'); return; }
    let found = false;
    DCITStore.updateDB(db => {
        const c = db.classes[batchIdx];
        const s = (db.students || []).find(x => String(x.reg_no) === reg);
        if (c && s) {
            s.batch_no = c.batch_code;
            c.enrolled_regs = c.enrolled_regs || [];
            if (!c.enrolled_regs.includes(reg)) c.enrolled_regs.push(reg);
            found = true;
        }
    });
    if (!found) {
        alert('এই রেজিস্ট্রেশন নাম্বারে কোনো শিক্ষার্থী পাওয়া যায়নি!');
        return;
    }
    notifyToast('শিক্ষার্থী সফলভাবে এই ব্যাচে যুক্ত হয়েছে!');
    quickViewBatchWithStudents(batchIdx);
    renderAdminApp();
}

function openClassModal(editIdx = null) {
    const db = DCITStore.getDB();
    const c = editIdx !== null ? db.classes[editIdx] : null;
    openAdminModal(c ? 'ব্যাচ রুটিন সম্পাদনা' : 'নতুন ব্যাচ / রুটিন তৈরি করুন', `
    <form onsubmit="saveClassModal(event, ${editIdx !== null ? editIdx : 'null'})">
        <div class="form-grid">
            <div class="form-group"><label>ব্যাচ কোড *</label><input type="text" id="cl-code" class="form-control" value="${esc(c?.batch_code || 'Batch-30')}" required></div>
            <div class="form-group"><label>ব্যাচের নাম *</label><input type="text" id="cl-name" class="form-control" value="${esc(c?.batch_name || '৩০তম ব্যাচ')}" required></div>
            <div class="form-group"><label>কোর্স নাম *</label><input type="text" id="cl-course" class="form-control" value="${esc(c?.course_name || 'Office Application')}" required></div>
            <div class="form-group"><label>ক্লাসের বার *</label><input type="text" id="cl-days" class="form-control" value="${esc(c?.days || 'শনি - সোম - বুধ')}" required></div>
            <div class="form-group"><label>সময় (Time Slot) *</label><input type="text" id="cl-time" class="form-control" value="${esc(c?.time_slot || 'সকাল ১০:০০ - ১২:০০')}" required></div>
            <div class="form-group"><label>প্রশিক্ষকের নাম *</label><input type="text" id="cl-inst" class="form-control" value="${esc(c?.instructor || 'মোঃ আরিফুল ইসলাম')}" required></div>
            <div class="form-group"><label>ল্যাব / রুম নং</label><input type="text" id="cl-room" class="form-control" value="${esc(c?.room_no || 'Lab-01')}"></div>
        </div>
        <div style="margin-top:16px;text-align:right;"><button type="submit" class="btn btn-primary">সংরক্ষণ করুন</button></div>
    </form>`);
}

function saveClassModal(e, editIdx) {
    e.preventDefault();
    const obj = {
        batch_code: document.getElementById('cl-code').value.trim(),
        batch_name: document.getElementById('cl-name').value.trim(),
        course_name: document.getElementById('cl-course').value.trim(),
        days: document.getElementById('cl-days').value.trim(),
        time_slot: document.getElementById('cl-time').value.trim(),
        instructor: document.getElementById('cl-inst').value.trim(),
        room_no: document.getElementById('cl-room').value.trim(),
        status: 'Running'
    };
    DCITStore.updateDB(db => {
        if (editIdx !== null && db.classes[editIdx]) db.classes[editIdx] = { ...db.classes[editIdx], ...obj };
        else db.classes.unshift(obj);
    });
    closeAdminModal();
    renderAdminApp();
    notifyToast('ব্যাচ রুটিন সংরক্ষিত হয়েছে!');
}

function deleteClassBatch(idx) {
    if (!confirm('ব্যাচটি মুছে ফেলতে চান?')) return;
    DCITStore.updateDB(db => { db.classes.splice(idx, 1); });
    renderAdminApp();
}

function renderTabCourses(el, db) {
    const courses = db.courses || [];
    const pg = paginateAdminList(courses, 'courses');
    el.innerHTML = `
    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-book"></i> কোর্স ও ডাইনামিক সিলেবাস ম্যানেজমেন্ট (${courses.length}টি কোর্স)</h3>
            <button onclick="openCourseModal()" class="btn btn-primary btn-sm"><i class="fa fa-plus-circle"></i> ➕ এড কোর্স (ডাইনামিক + ক্লাস সিলেবাস সহ)</button>
        </div>
        ${renderBulkToolbarHtml('courses')}
        <div class="dcp-table-wrap">
            <table class="dcp-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" onchange="toggleSelectAllRows('courses',this.checked,${JSON.stringify(pg.slice.map(c=>c.code)).replace(/"/g,'&quot;')})"></th>
                        <th>ছবি</th>
                        <th>কোর্স শিরোনাম (EN & BN)</th>
                        <th>কোর্স ফি</th>
                        <th>মেয়াদ ও মোট ক্লাস</th>
                        <th>কোর্স টপিকস ও ডাইনামিক সিলেবাস</th>
                        <th>কুইক ভিউ, এডিট, ডিলিট</th>
                    </tr>
                </thead>
                <tbody>
                    ${pg.slice.map((c) => {
                        const realIdx = courses.findIndex(x => x.code === c.code || x.title === c.title);
                        const sylCount = (c.syllabus_classes || []).length;
                        return `
                        <tr>
                            <td><input type="checkbox" onchange="toggleBulkRow('courses','${esc(c.code)}',this.checked)"></td>
                            <td><img src="${esc(c.image || '../images/courses/office.png')}" style="width:56px;height:42px;object-fit:cover;border-radius:6px;" onerror="this.src='../images/logo.png'"></td>
                            <td><strong>${esc(c.title)}</strong><br><small>${esc(c.title_bn || '')}</small></td>
                            <td><strong style="color:#0284c7;">৳${Number(c.fee)}</strong></td>
                            <td>${esc(c.duration)}<br><small>${esc(c.total_classes || '36টি ক্লাস')}</small></td>
                            <td><small>${esc((c.topics || c.description || '').slice(0,60))}...</small><br><span class="badge badge-info">${sylCount}টি সিলেবাস ক্লাস</span></td>
                            <td>
                                <button onclick="quickViewCourse(${realIdx})" class="btn btn-outline btn-xs"><i class="fa fa-eye"></i></button>
                                <button onclick="openCourseModal(${realIdx})" class="btn btn-primary btn-xs"><i class="fa fa-edit"></i></button>
                                <button onclick="deleteCourse(${realIdx})" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
        ${renderAdminPaginationHtml('courses', pg)}
    </div>`;
}

function openCourseModal(editIdx = null) {
    const db = DCITStore.getDB();
    const c = editIdx !== null ? db.courses[editIdx] : null;
    const sylList = (c && Array.isArray(c.syllabus_classes) && c.syllabus_classes.length) ? c.syllabus_classes : [
        { class_no: 'ক্লাস ০১', details: 'কম্পিউটার পরিচিতি, হার্ডওয়্যার ও সফটওয়্যার ফান্ডামেন্টালস', type: 'থিওরি ও প্র্যাকটিক্যাল' },
        { class_no: 'ক্লাস ০২', details: 'মাইক্রোসফট ওয়ার্ড ডকুমেন্ট ফরম্যাটিং ও অফিসিয়াল লেটার ডিজাইন', type: 'প্র্যাকটিক্যাল ল্যাব' }
    ];

    const html = `
    <form onsubmit="saveCourseModal(event, ${editIdx !== null ? editIdx : 'null'})">
        <div class="form-grid">
            <div class="form-group">
                <label>কোর্স ছবি আপলোড (প্রিভিউ সহ)</label>
                <input type="file" accept="image/*" class="form-control" onchange="previewUploadImg(this,'crs-img-prev','crs-img-val')">
                <input type="hidden" id="crs-img-val" value="${esc(c?.image || '../images/courses/office.png')}">
                <img id="crs-img-prev" src="${esc(c?.image || '../images/courses/office.png')}" style="width:90px;height:55px;object-fit:cover;margin-top:6px;border-radius:6px;border:1px solid #cbd5e1;">
            </div>
            <div class="form-group"><label>কোর্স শিরোনাম (ইংরেজি) *</label><input type="text" id="crs-title" class="form-control" value="${esc(c?.title || '')}" required></div>
            <div class="form-group"><label>কোর্স শিরোনাম (বাংলা) *</label><input type="text" id="crs-title-bn" class="form-control" value="${esc(c?.title_bn || '')}" required></div>
            <div class="form-group"><label>কোর্স ফি (৳) *</label><input type="number" id="crs-fee" class="form-control" value="${esc(c?.fee || 4000)}" required></div>
            <div class="form-group"><label>মেয়াদ (Duration) *</label><input type="text" id="crs-dur" class="form-control" value="${esc(c?.duration || '3 Months / 6 Months')}" required></div>
            <div class="form-group"><label>মোট ক্লাস সংখ্যা *</label><input type="text" id="crs-total-cls" class="form-control" value="${esc(c?.total_classes || '৩৬টি ক্লাস')}" required></div>
            <div class="form-group" style="grid-column:1/-1;">
                <label>কোর্স টপিকস (Textarea - কমা বা নতুন লাইনে লিখুন) *</label>
                <textarea id="crs-topics" class="form-control" rows="3" required>${esc(c?.topics || c?.description || 'MS Word, MS Excel, MS PowerPoint, Internet & Email, Freelancing Guidelines')}</textarea>
            </div>
        </div>

        <div style="margin-top:16px; background:#f8fafc; padding:16px; border-radius:12px; border:1px solid #cbd5e1;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <h4 style="margin:0; color:#0f172a;"><i class="fa fa-list-ol"></i> কোর্সের ক্লাস সমূহ (ক্লাস সংখ্যা | ক্লাসের বিবরণ | ক্লাস টাইপ)</h4>
                <button type="button" onclick="addDynamicSyllabusRow()" class="btn btn-success btn-sm"><i class="fa fa-plus-circle"></i> ➕ নতুন ক্লাস রো যুক্ত করুন (+)</button>
            </div>
            <div id="dynamic-syllabus-rows">
                ${sylList.map((row) => `
                <div class="syl-row" style="display:grid; grid-template-columns:1fr 2.5fr 1.2fr auto; gap:8px; margin-bottom:8px;">
                    <input type="text" class="form-control syl-no" placeholder="ক্লাস সংখ্যা (যেমন: ক্লাস ০১)" value="${esc(row.class_no)}" required>
                    <input type="text" class="form-control syl-desc" placeholder="ক্লাসের বিবরণ" value="${esc(row.details)}" required>
                    <input type="text" class="form-control syl-type" placeholder="ক্লাস টাইপ (প্র্যাকটিক্যাল/থিওরি)" value="${esc(row.type)}" required>
                    <button type="button" onclick="this.parentElement.remove()" class="btn btn-danger btn-xs"><i class="fa fa-times"></i></button>
                </div>`).join('')}
            </div>
        </div>

        <div style="margin-top:18px; display:flex; justify-content:flex-end; gap:10px;">
            <button type="button" onclick="closeAdminModal()" class="btn btn-outline">বাতিল</button>
            <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> কোর্স ও সিলেবাস সংরক্ষণ করুন</button>
        </div>
    </form>`;
    openAdminModal(c ? 'কোর্স ও সিলেবাস সম্পাদনা' : 'নতুন কোর্স যুক্ত করুন (ডাইনামিক + ক্লাস সিলেবাস)', html);
}

function addDynamicSyllabusRow() {
    const wrap = document.getElementById('dynamic-syllabus-rows');
    if (!wrap) return;
    const count = wrap.querySelectorAll('.syl-row').length + 1;
    const div = document.createElement('div');
    div.className = 'syl-row';
    div.style.cssText = 'display:grid; grid-template-columns:1fr 2.5fr 1.2fr auto; gap:8px; margin-bottom:8px;';
    div.innerHTML = `
        <input type="text" class="form-control syl-no" placeholder="ক্লাস সংখ্যা" value="ক্লাস ০${count}" required>
        <input type="text" class="form-control syl-desc" placeholder="ক্লাসের বিবরণ লিখুন..." required>
        <input type="text" class="form-control syl-type" placeholder="ক্লাস টাইপ" value="প্র্যাকটিক্যাল ল্যাব" required>
        <button type="button" onclick="this.parentElement.remove()" class="btn btn-danger btn-xs"><i class="fa fa-times"></i></button>
    `;
    wrap.appendChild(div);
}

function saveCourseModal(e, editIdx) {
    e.preventDefault();
    const rows = [...document.querySelectorAll('#dynamic-syllabus-rows .syl-row')].map(r => ({
        class_no: r.querySelector('.syl-no').value.trim(),
        details: r.querySelector('.syl-desc').value.trim(),
        type: r.querySelector('.syl-type').value.trim()
    }));
    const obj = {
        code: 'CRS-' + Date.now().toString().slice(-4),
        title: document.getElementById('crs-title').value.trim(),
        title_bn: document.getElementById('crs-title-bn').value.trim(),
        fee: Number(document.getElementById('crs-fee').value || 4000),
        duration: document.getElementById('crs-dur').value.trim(),
        total_classes: document.getElementById('crs-total-cls').value.trim(),
        topics: document.getElementById('crs-topics').value.trim(),
        description: document.getElementById('crs-topics').value.trim(),
        image: document.getElementById('crs-img-val').value,
        syllabus_classes: rows,
        status: 'Active'
    };
    DCITStore.updateDB(db => {
        if (editIdx !== null && db.courses[editIdx]) db.courses[editIdx] = { ...db.courses[editIdx], ...obj };
        else db.courses.unshift(obj);
    });
    closeAdminModal();
    renderAdminApp();
    notifyToast('কোর্স এবং ডাইনামিক ক্লাস সিলেবাস সংরক্ষিত হয়েছে!');
}

function quickViewCourse(idx) {
    const c = DCITStore.getDB().courses[idx];
    if (!c) return;
    const syl = c.syllabus_classes || [];
    openAdminModal('কোর্স ও সিলেবাস কুইক ভিউ', `
        <div class="qv-profile-header">
            <img src="${esc(c.image || '../images/logo.png')}" class="qv-avatar">
            <div>
                <h2 style="margin:0;">${esc(c.title)} (${esc(c.title_bn || '')})</h2>
                <p style="margin:4px 0 0;">কোর্স ফি: <strong>৳${c.fee}</strong> | মেয়াদ: ${esc(c.duration)} | মোট ক্লাস: ${esc(c.total_classes || '36')}</p>
            </div>
        </div>
        <div class="qv-box" style="margin-bottom:14px;"><span class="lbl">কোর্স টপিকস</span><span class="val">${esc(c.topics || c.description || '')}</span></div>
        <h4>ডাইনামিক ক্লাস সিলেবাস (${syl.length}টি ক্লাস)</h4>
        <div class="dcp-table-wrap"><table class="dcp-table" style="min-width:100%;">
            <thead><tr><th>ক্লাস সংখ্যা</th><th>ক্লাসের বিবরণ</th><th>ক্লাস টাইপ</th></tr></thead>
            <tbody>${syl.map(r => `<tr><td><strong>${esc(r.class_no)}</strong></td><td>${esc(r.details)}</td><td><span class="badge badge-info">${esc(r.type)}</span></td></tr>`).join('')}</tbody>
        </table></div>
    `);
}

function deleteCourse(idx) {
    if (!confirm('কোর্সটি মুছে ফেলতে চান?')) return;
    DCITStore.updateDB(db => { db.courses.splice(idx, 1); });
    renderAdminApp();
}

let teacherCatFilter = '';
function renderTabTeachers(el, db) {
    const teachers = db.teachers || [];
    const cats = ['শিক্ষক', 'ট্রেইনার', 'পরিচালক', 'ফাউন্ডার', 'সদস্য'];
    const filtered = teachers.filter(t => !teacherCatFilter || (t.category || 'শিক্ষক') === teacherCatFilter);
    const pg = paginateAdminList(filtered, 'teachers');

    el.innerHTML = `
    <div class="digital-counter-grid">
        <div class="digital-counter-card ${teacherCatFilter===''?'active':''}" onclick="teacherCatFilter='';renderAdminApp();">
            <div><div class="dc-num">${teachers.length}</div><div class="dc-lbl">সকল প্রশাসন ও শিক্ষক</div></div>
            <div class="dc-icon"><i class="fa fa-user-circle"></i></div>
        </div>
        ${cats.map(cat => `
        <div class="digital-counter-card ${teacherCatFilter===cat?'active':''}" onclick="teacherCatFilter='${cat}';renderAdminApp();">
            <div><div class="dc-num">${teachers.filter(t=>(t.category||'শিক্ষক')===cat).length}</div><div class="dc-lbl">${cat}</div></div>
            <div class="dc-icon"><i class="fa fa-id-badge"></i></div>
        </div>`).join('')}
    </div>

    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-user-circle"></i> প্রশাসন ও শিক্ষক প্যানেল (${filtered.length} জন)</h3>
            <button onclick="openTeacherModal()" class="btn btn-primary btn-sm"><i class="fa fa-plus-circle"></i> ➕ নতুন সদস্য / শিক্ষক যুক্ত করুন</button>
        </div>
        ${renderBulkToolbarHtml('teachers')}
        <div class="dcp-table-wrap">
            <table class="dcp-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" onchange="toggleSelectAllRows('teachers',this.checked,${JSON.stringify(pg.slice.map(t=>t.name)).replace(/"/g,'&quot;')})"></th>
                        <th>ছবি</th>
                        <th>নাম ও পদবী</th>
                        <th>ক্যাটাগরি</th>
                        <th>বিভাগ ও যোগ্যতা</th>
                        <th>কোন সাল থেকে আমাদের সাথে আছে</th>
                        <th>বর্তমান স্ট্যাটাস</th>
                        <th>মোবাইল ও ইমেইল</th>
                        <th>কুইক ভিউ, এডিট, ডিলিট</th>
                    </tr>
                </thead>
                <tbody>
                    ${pg.slice.map(t => {
                        const realIdx = teachers.findIndex(x => x.name === t.name);
                        const empSt = t.employment_status || 'বর্তমান';
                        return `
                        <tr>
                            <td><input type="checkbox" onchange="toggleBulkRow('teachers','${esc(t.name)}',this.checked)"></td>
                            <td><img src="${esc(t.photo || '../images/logo.png')}" style="width:48px;height:54px;object-fit:cover;border-radius:8px;"></td>
                            <td><strong>${esc(t.name)}</strong><br><small>${esc(t.designation)}</small></td>
                            <td><span class="badge badge-info">${esc(t.category || 'শিক্ষক')}</span></td>
                            <td>${esc(t.department || 'IT')}<br><small>${esc(t.qualification || '')}</small></td>
                            <td><strong>${esc(t.joining_year || '2020')} সাল থেকে</strong></td>
                            <td><span class="badge ${empSt==='বর্তমান'?'badge-success':'badge-warning'}">${esc(empSt)}</span></td>
                            <td>${esc(t.phone)}<br><small>${esc(t.email || '')}</small></td>
                            <td>
                                <button onclick="quickViewTeacher(${realIdx})" class="btn btn-outline btn-xs"><i class="fa fa-eye"></i></button>
                                <button onclick="openTeacherModal(${realIdx})" class="btn btn-primary btn-xs"><i class="fa fa-edit"></i></button>
                                <button onclick="deleteTeacher(${realIdx})" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
        ${renderAdminPaginationHtml('teachers', pg)}
    </div>`;
}

function openTeacherModal(editIdx = null) {
    const db = DCITStore.getDB();
    const t = editIdx !== null ? db.teachers[editIdx] : null;
    openAdminModal(t ? 'প্রশাসন / শিক্ষক তথ্য এডিট করুন' : 'নতুন শিক্ষক / প্রশাসন সদস্য যুক্ত করুন', `
    <form onsubmit="saveTeacherModal(event, ${editIdx !== null ? editIdx : 'null'})">
        <div class="form-grid">
            <div class="form-group">
                <label>ছবি আপলোড করুন (প্রিভিউ সহ)</label>
                <input type="file" accept="image/*" class="form-control" onchange="previewUploadImg(this,'tch-img-prev','tch-img-val')">
                <input type="hidden" id="tch-img-val" value="${esc(t?.photo || '../images/logo.png')}">
                <img id="tch-img-prev" src="${esc(t?.photo || '../images/logo.png')}" style="width:65px;height:72px;object-fit:cover;margin-top:6px;border-radius:8px;border:2px solid #0ea5e9;">
            </div>
            <div class="form-group"><label>নাম *</label><input type="text" id="tch-name" class="form-control" value="${esc(t?.name || '')}" required></div>
            <div class="form-group"><label>পদবী (Designation) *</label><input type="text" id="tch-desig" class="form-control" value="${esc(t?.designation || 'সিনিয়র ইনস্ট্রাক্টর')}" required></div>
            <div class="form-group"><label>ক্যাটাগরি (প্রশাসন বিভাগ) *</label>
                <select id="tch-cat" class="form-control">
                    ${['শিক্ষক','ট্রেইনার','পরিচালক','ফাউন্ডার','সদস্য'].map(c => `<option value="${c}" ${t?.category===c?'selected':''}>${c}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label>কোন সাল থেকে আমাদের সাথে আছেন? *</label><input type="text" id="tch-year" class="form-control" value="${esc(t?.joining_year || '2020')}" required></div>
            <div class="form-group"><label>বর্তমান স্ট্যাটাস (বর্তমান / অবসরপ্রাপ্ত) *</label>
                <select id="tch-emp-st" class="form-control">
                    <option value="বর্তমান" ${t?.employment_status!=='অবসরপ্রাপ্ত'?'selected':''}>বর্তমান (Active)</option>
                    <option value="অবসরপ্রাপ্ত" ${t?.employment_status==='অবসরপ্রাপ্ত'?'selected':''}>অবসরপ্রাপ্ত (Retired / Former)</option>
                </select>
            </div>
            <div class="form-group"><label>বিভাগ (Department)</label><input type="text" id="tch-dept" class="form-control" value="${esc(t?.department || 'কম্পিউটার ও আইটি বিভাগ')}"></div>
            <div class="form-group"><label>শিক্ষাগত যোগ্যতা</label><input type="text" id="tch-qual" class="form-control" value="${esc(t?.qualification || 'B.Sc in CSE')}"></div>
            <div class="form-group"><label>মোবাইল নাম্বার *</label><input type="text" id="tch-phone" class="form-control" value="${esc(t?.phone || '01771770044')}" required></div>
            <div class="form-group"><label>ইমেইল</label><input type="email" id="tch-email" class="form-control" value="${esc(t?.email || 'info@dreamcareerit.com')}"></div>
        </div>
        <div style="margin-top:16px;text-align:right;"><button type="submit" class="btn btn-primary">সংরক্ষণ করুন</button></div>
    </form>`);
}

function saveTeacherModal(e, editIdx) {
    e.preventDefault();
    const obj = {
        name: document.getElementById('tch-name').value.trim(),
        designation: document.getElementById('tch-desig').value.trim(),
        category: document.getElementById('tch-cat').value,
        joining_year: document.getElementById('tch-year').value.trim(),
        employment_status: document.getElementById('tch-emp-st').value,
        department: document.getElementById('tch-dept').value.trim(),
        qualification: document.getElementById('tch-qual').value.trim(),
        phone: document.getElementById('tch-phone').value.trim(),
        email: document.getElementById('tch-email').value.trim(),
        photo: document.getElementById('tch-img-val').value || '../images/logo.png',
        status: 'Active'
    };
    DCITStore.updateDB(db => {
        if (editIdx !== null && db.teachers[editIdx]) db.teachers[editIdx] = { ...db.teachers[editIdx], ...obj };
        else db.teachers.unshift(obj);
    });
    closeAdminModal();
    renderAdminApp();
    notifyToast('প্রশাসন সদস্যের তথ্য সংরক্ষিত হয়েছে!');
}

function quickViewTeacher(idx) {
    const t = DCITStore.getDB().teachers[idx];
    if (!t) return;
    openAdminModal('প্রশাসন ও শিক্ষক প্রোফাইল কুইক ভিউ', `
        <div class="qv-profile-header">
            <img src="${esc(t.photo || '../images/logo.png')}" class="qv-avatar">
            <div>
                <h2 style="margin:0;">${esc(t.name)}</h2>
                <p style="margin:4px 0 0;">${esc(t.designation)} (${esc(t.category || 'শিক্ষক')})</p>
                <span class="badge badge-success" style="margin-top:6px;">${esc(t.joining_year || '2020')} সাল থেকে যুক্ত | স্ট্যাটাস: ${esc(t.employment_status || 'বর্তমান')}</span>
            </div>
        </div>
        <div class="qv-grid">
            <div class="qv-box"><span class="lbl">বিভাগ ও যোগ্যতা</span><span class="val">${esc(t.department || '')} | ${esc(t.qualification || '')}</span></div>
            <div class="qv-box"><span class="lbl">মোবাইল ও ইমেইল</span><span class="val">${esc(t.phone)} | ${esc(t.email || '')}</span></div>
        </div>
    `);
}

function deleteTeacher(idx) {
    if (!confirm('সদস্যের তথ্য মুছে ফেলতে চান?')) return;
    DCITStore.updateDB(db => { db.teachers.splice(idx, 1); });
    renderAdminApp();
}

function renderTabNotices(el, db) {
    const notices = db.notices || [];
    const pg = paginateAdminList(notices, 'notices');
    el.innerHTML = `
    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-bullhorn"></i> নোটিশ ও সাকসেস স্টোরি (MS Word স্টাইল রিচ টেক্সট ফরম্যাটিং সহ)</h3>
            <button onclick="openNoticeRichModal()" class="btn btn-primary btn-sm"><i class="fa fa-plus-circle"></i> ➕ নতুন ফরম্যাটেড নোটিশ তৈরি করুন</button>
        </div>
        ${renderBulkToolbarHtml('notices')}
        <div class="dcp-table-wrap">
            <table class="dcp-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" onchange="toggleSelectAllRows('notices',this.checked,${JSON.stringify(pg.slice.map(n=>String(n.id))).replace(/"/g,'&quot;')})"></th>
                        <th>শিরোনাম</th>
                        <th>ক্যাটাগরি</th>
                        <th>প্রকাশের তারিখ</th>
                        <th>বিবরণ প্রিভিউ</th>
                        <th>কুইক ভিউ, এডিট, ডিলিট</th>
                    </tr>
                </thead>
                <tbody>
                    ${pg.slice.map(n => {
                        const realIdx = notices.findIndex(x => String(x.id) === String(n.id));
                        return `
                        <tr>
                            <td><input type="checkbox" onchange="toggleBulkRow('notices','${esc(n.id)}',this.checked)"></td>
                            <td><strong>${esc(n.title)}</strong></td>
                            <td><span class="badge badge-info">${esc(n.category || 'Academic')}</span></td>
                            <td>${esc(n.publish_date)}</td>
                            <td><div style="max-width:340px; max-height:48px; overflow:hidden; font-size:12px;">${n.details || ''}</div></td>
                            <td>
                                <button onclick="quickViewNotice(${realIdx})" class="btn btn-outline btn-xs"><i class="fa fa-eye"></i></button>
                                <button onclick="openNoticeRichModal(${realIdx})" class="btn btn-primary btn-xs"><i class="fa fa-edit"></i></button>
                                <button onclick="deleteNotice(${realIdx})" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
        ${renderAdminPaginationHtml('notices', pg)}
    </div>`;
}

function execRichCmd(cmd, val = null) {
    document.execCommand(cmd, false, val);
    document.getElementById('nt-rich-editor')?.focus();
}

function openNoticeRichModal(editIdx = null) {
    const db = DCITStore.getDB();
    const n = editIdx !== null ? db.notices[editIdx] : null;
    openAdminModal(n ? 'নোটিশ সম্পাদনা করুন (Rich Text Editor)' : 'নতুন নোটিশ প্রকাশ করুন (MS Word স্টাইল এডিটর)', `
    <form onsubmit="saveNoticeRichModal(event, ${editIdx !== null ? editIdx : 'null'})">
        <div class="form-grid">
            <div class="form-group"><label>নোটিশের শিরোনাম *</label><input type="text" id="nt-title" class="form-control" value="${esc(n?.title || '')}" required></div>
            <div class="form-group"><label>ক্যাটাগরি *</label>
                <select id="nt-cat" class="form-control">
                    ${['Admission','Exam','Result','Scholarship','Event','Success Story'].map(c => `<option value="${c}" ${n?.category===c?'selected':''}>${c}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label>প্রকাশের তারিখ *</label><input type="date" id="nt-date" class="form-control" value="${esc(n?.publish_date || new Date().toISOString().slice(0,10))}" required></div>
        </div>
        <div class="form-group" style="margin-top:12px;">
            <label>নোটিশের বিস্তারিত বিবরণ (বোল্ড, কালার, হেডিং, লিস্ট ফরম্যাটিং ভিউয়ার পেজে হুবহু দেখাবে) *</label>
            <div class="rich-editor-toolbar">
                <button type="button" onclick="execRichCmd('bold')" title="Bold"><i class="fa fa-bold"></i> বোল্ড</button>
                <button type="button" onclick="execRichCmd('italic')" title="Italic"><i class="fa fa-italic"></i> ইটালিক</button>
                <button type="button" onclick="execRichCmd('underline')" title="Underline"><i class="fa fa-underline"></i> আন্ডারলাইন</button>
                <button type="button" onclick="execRichCmd('formatBlock','H3')">হেডিং H3</button>
                <button type="button" onclick="execRichCmd('insertUnorderedList')"><i class="fa fa-list-ul"></i> বুলেট লিস্ট</button>
                <button type="button" onclick="execRichCmd('insertOrderedList')"><i class="fa fa-list-ol"></i> নাম্বার লিস্ট</button>
                <input type="color" onchange="execRichCmd('foreColor',this.value)" title="টেক্সট কালার" style="height:28px;width:36px;border:none;cursor:pointer;">
            </div>
            <div id="nt-rich-editor" class="rich-editor-area" contenteditable="true">${n?.details || '<p>নোটিশের বিস্তারিত বিবরণ এখানে লিখুন...</p>'}</div>
        </div>
        <div style="margin-top:16px;text-align:right;"><button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> নোটিশ প্রকাশ করুন</button></div>
    </form>`);
}

function saveNoticeRichModal(e, editIdx) {
    e.preventDefault();
    const obj = {
        id: editIdx !== null ? DCITStore.getDB().notices[editIdx].id : Date.now(),
        title: document.getElementById('nt-title').value.trim(),
        category: document.getElementById('nt-cat').value,
        publish_date: document.getElementById('nt-date').value,
        details: document.getElementById('nt-rich-editor').innerHTML,
        priority: 'High'
    };
    DCITStore.updateDB(db => {
        if (editIdx !== null && db.notices[editIdx]) db.notices[editIdx] = obj;
        else db.notices.unshift(obj);
    });
    closeAdminModal();
    renderAdminApp();
    notifyToast('ফরম্যাটেড নোটিশ সফলভাবে প্রকাশিত হয়েছে!');
}

function quickViewNotice(idx) {
    const n = DCITStore.getDB().notices[idx];
    if (!n) return;
    openAdminModal('নোটিশ কুইক ভিউ', `
        <div class="qv-profile-header">
            <div style="font-size:36px;color:#38bdf8;"><i class="fa fa-bullhorn"></i></div>
            <div><h2 style="margin:0;">${esc(n.title)}</h2><p style="margin:4px 0 0;">ক্যাটাগরি: ${esc(n.category)} | তারিখ: ${esc(n.publish_date)}</p></div>
        </div>
        <div class="qv-box" style="line-height:1.7;">${n.details || ''}</div>
    `);
}

function deleteNotice(idx) {
    if (!confirm('নোটিশটি ডিলিট করতে চান?')) return;
    DCITStore.updateDB(db => { db.notices.splice(idx, 1); });
    renderAdminApp();
}

function renderTabPayments(el, db) {
    const payments = db.payments || [];
    const filtered = payments.filter(p => {
        if (currentCourseFilter === 'DUE') return Number(p.due_amount || 0) > 0;
        const q = currentSearch.toLowerCase();
        return !q || [p.receipt_no, p.student_name, p.reg_no, p.course_name].some(v => String(v||'').toLowerCase().includes(q));
    });
    const pg = paginateAdminList(filtered, 'payments');

    el.innerHTML = `
    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-money"></i> পেমেন্ট ও মানি রিসিপ্ট লেজার (${filtered.length})</h3>
            <div style="display:flex;gap:8px;">
                <button onclick="currentCourseFilter='';renderAdminApp();" class="btn btn-outline btn-xs">সকল পেমেন্ট</button>
                <button onclick="currentCourseFilter='DUE';renderAdminApp();" class="btn btn-danger btn-xs">শুধুমাত্র বকেয়া (Due List)</button>
            </div>
        </div>
        <div class="dcp-table-wrap">
            <table class="dcp-table">
                <thead><tr><th>রিসিপ্ট নং</th><th>শিক্ষার্থী ও রেজিঃ</th><th>কোর্স</th><th>মোট ফি</th><th>পরিশোধ (Paid)</th><th>বকেয়া (Due)</th><th>মেথড ও TrxID</th><th>তারিখ</th></tr></thead>
                <tbody>
                    ${pg.slice.map(p => `
                    <tr>
                        <td><strong>${esc(p.receipt_no)}</strong></td>
                        <td><strong>${esc(p.student_name)}</strong> (${esc(p.reg_no)})</td>
                        <td>${esc(p.course_name)}</td>
                        <td>৳${Number(p.total_fee || p.amount || 0)}</td>
                        <td style="color:#16a34a;font-weight:700;">৳${Number(p.paid_amount ?? p.amount ?? 0)}</td>
                        <td style="color:#dc2626;font-weight:800;">৳${Number(p.due_amount || 0)}</td>
                        <td>${esc(p.method)} (${esc(p.trx_id || 'CASH')})</td>
                        <td>${esc(p.payment_date)}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>
        ${renderAdminPaginationHtml('payments', pg)}
    </div>`;
}

let repType = 'ALL';
let repYear = '';
let repMonth = '';
let repBatch = '';

function renderTabReports(el, db) {
    const students = db.students || [];
    const payments = db.payments || [];
    const unified = students.map(s => {
        const pay = payments.find(p => String(p.reg_no) === String(s.reg_no)) || {};
        const fee = Number(s.course_fee || pay.total_fee || pay.amount || 4000);
        const paid = Number(s.paid_amount ?? pay.paid_amount ?? pay.amount ?? fee);
        const due = Math.max(0, fee - paid);
        const pDate = pay.payment_date || (s.session || '2026') + '-01-15';
        return {
            reg_no: s.reg_no,
            roll_no: s.roll_no,
            name: s.name,
            phone: s.phone || '01771770044',
            course_name: s.course_name,
            batch_no: s.batch_no || 'Batch-28',
            year: String(s.session || pDate.slice(0,4) || '2026'),
            month: pDate.slice(5,7) || '01',
            fee, paid, due,
            exam_status: s.exam_status || 'নতুন স্টুডেন্ট',
            result: s.result || 'Pending'
        };
    }).filter(r => {
        if (repType === 'DUE_ONLY' && r.due <= 0) return false;
        if (repType === 'PAID_ONLY' && r.due > 0) return false;
        if (repType === 'PASSED_ONLY' && r.exam_status !== 'পাস করেছে') return false;
        if (repYear && r.year !== repYear) return false;
        if (repMonth && r.month !== repMonth) return false;
        if (repBatch && r.batch_no !== repBatch) return false;
        return true;
    });

    const totalFee = unified.reduce((a,b) => a + b.fee, 0);
    const totalPaid = unified.reduce((a,b) => a + b.paid, 0);
    const totalDue = unified.reduce((a,b) => a + b.due, 0);
    const batches = [...new Set(students.map(s => s.batch_no).filter(Boolean))];

    el.innerHTML = `
    <div class="panel-card">
        <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:3px double #0284c7; padding:18px 22px; background:#f8fafc;">
            <div style="display:flex; align-items:center; gap:14px;">
                <img src="../images/logo.png" style="width:64px;height:64px;object-fit:contain;">
                <div>
                    <h2 style="margin:0; color:#0f172a; font-size:22px;">ড্রিম ক্যারিয়ার আইটি (Dream Career IT)</h2>
                    <p style="margin:3px 0 0; font-size:13px; color:#334155;">ভাই ভাই সুপার মার্কেট, নতুন পদুয়ার বাজার মসজিদের পাশে, পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা - ৩৫০০</p>
                    <p style="margin:2px 0 0; font-size:12px; color:#0284c7; font-weight:700;">হটলাইন: 01771770044 | অফিশিয়াল স্টুডেন্ট ও পেমেন্ট সমন্বিত রিপোর্ট</p>
                </div>
            </div>
            <div class="no-print" style="display:flex; gap:8px;">
                <button onclick="window.print()" class="btn btn-primary btn-sm"><i class="fa fa-print"></i> হেডারসহ প্রিন্ট / PDF ডাউনলোড</button>
            </div>
        </div>

        <div class="filter-bar no-print">
            <select onchange="repType=this.value;renderAdminApp();" class="form-control" style="max-width:200px;">
                <option value="ALL" ${repType==='ALL'?'selected':''}>সকল সমন্বিত রিপোর্ট (All)</option>
                <option value="PAID_ONLY" ${repType==='PAID_ONLY'?'selected':''}>সম্পূর্ণ পরিশোধিত (Paid)</option>
                <option value="DUE_ONLY" ${repType==='DUE_ONLY'?'selected':''}>বকেয়া তালিকা (Due List)</option>
                <option value="PASSED_ONLY" ${repType==='PASSED_ONLY'?'selected':''}>উত্তীর্ণ শিক্ষার্থী (Passed)</option>
            </select>
            <select onchange="repYear=this.value;renderAdminApp();" class="form-control" style="max-width:140px;">
                <option value="">সকল সাল (Year)</option>
                ${['2026','2025','2024','2023','2022','2021','2020'].map(y => `<option value="${y}" ${repYear===y?'selected':''}>${y}</option>`).join('')}
            </select>
            <select onchange="repMonth=this.value;renderAdminApp();" class="form-control" style="max-width:150px;">
                <option value="">সকল মাস (Month)</option>
                ${[['01','জানুয়ারি'],['02','ফেব্রুয়ারি'],['03','মার্চ'],['04','এপ্রিল'],['05','মে'],['06','জুন'],['07','জুলাই'],['08','আগস্ট'],['09','সেপ্টেম্বর'],['10','অক্টোবর'],['11','নভেম্বর'],['12','ডিসেম্বর']].map(([m,n]) => `<option value="${m}" ${repMonth===m?'selected':''}>${n}</option>`).join('')}
            </select>
            <select onchange="repBatch=this.value;renderAdminApp();" class="form-control" style="max-width:160px;">
                <option value="">সকল ব্যাচ (Batch)</option>
                ${batches.map(b => `<option value="${esc(b)}" ${repBatch===b?'selected':''}>${esc(b)}</option>`).join('')}
            </select>
            <button onclick="repType='ALL';repYear='';repMonth='';repBatch='';renderAdminApp();" class="btn btn-outline btn-sm">রিসেট</button>
        </div>

        <div style="padding:14px 20px; background:#eff6ff; display:flex; justify-content:space-around; font-weight:800; border-bottom:1px solid #bfdbfe;">
            <span>মোট শিক্ষার্থী: ${unified.length} জন</span>
            <span style="color:#0369a1;">মোট কোর্স ফি: ৳${totalFee.toLocaleString()}</span>
            <span style="color:#16a34a;">মোট আদায় (Paid): ৳${totalPaid.toLocaleString()}</span>
            <span style="color:#dc2626;">মোট বকেয়া (Due): ৳${totalDue.toLocaleString()}</span>
        </div>

        <div class="dcp-table-wrap">
            <table class="dcp-table" style="min-width:100%;">
                <thead>
                    <tr>
                        <th>ক্রমিক</th>
                        <th>রেজিঃ ও রোল</th>
                        <th>শিক্ষার্থীর নাম ও মোবাইল</th>
                        <th>কোর্স ও ব্যাচ</th>
                        <th>সাল</th>
                        <th>কোর্স ফি</th>
                        <th>পরিশোধ (Paid)</th>
                        <th>বকেয়া (Due)</th>
                        <th>স্ট্যাটাস ও জিপিএ</th>
                    </tr>
                </thead>
                <tbody>
                    ${unified.map((r, i) => `
                    <tr>
                        <td>${i + 1}</td>
                        <td><strong>${esc(r.reg_no)}</strong> (রোল: ${esc(r.roll_no)})</td>
                        <td><strong>${esc(r.name)}</strong><br><small>${esc(r.phone)}</small></td>
                        <td>${esc(r.course_name)} (${esc(r.batch_no)})</td>
                        <td>${esc(r.year)}</td>
                        <td>৳${r.fee}</td>
                        <td style="color:#16a34a;font-weight:700;">৳${r.paid}</td>
                        <td style="color:#dc2626;font-weight:800;">৳${r.due}</td>
                        <td>${esc(r.exam_status)} (${esc(r.result)})</td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>
    </div>`;
}

function renderTabSmsModule(el, db) {
    const logs = db.sms_logs || [];
    el.innerHTML = `
    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-paper-plane"></i> অটোমেটিক মেসেজ মডিউল (সিম ও মোবাইল ছাড়াই PHP Cloud SMS Gateway)</h3>
            <button onclick="openAutoSmsGatewayModal('01771770044','ড্রিম ক্যারিয়ার আইটি থেকে বিশেষ নোটিশ: আগামী শনিবার সকাল ১০টায় ক্লাস অনুষ্ঠিত হবে।')" class="btn btn-primary btn-sm"><i class="fa fa-paper-plane"></i> ➕ নতুন অটো মেসেজ পাঠান</button>
        </div>
        <div class="dcp-table-wrap">
            <table class="dcp-table" style="min-width:100%;">
                <thead><tr><th>ডিসপ্যাচ আইডি</th><th>প্রাপক নাম্বার</th><th>মেসেজের বিবরণ</th><th>গেটওয়ে মোড</th><th>সময়</th><th>স্ট্যাটাস</th></tr></thead>
                <tbody>
                    ${logs.length === 0 ? `<tr><td colspan="6" style="text-align:center;padding:24px;">এখনো কোনো মেসেজ লগ নেই। উপরে "নতুন অটো মেসেজ পাঠান" বাটনে ক্লিক করে পাঠান।</td></tr>` :
                    logs.map(l => `
                    <tr>
                        <td><strong>${esc(l.dispatch_id)}</strong></td>
                        <td>${esc(l.recipients)} (${l.count || 1} জন)</td>
                        <td>${esc(l.message)}</td>
                        <td><span class="badge badge-info">${esc(l.mode || 'SIMLESS_CLOUD_PHP_GATEWAY')}</span></td>
                        <td>${esc(l.sent_at)}</td>
                        <td><span class="badge badge-success">${esc(l.status)}</span></td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>
    </div>`;
}

function renderTabSubscribers(el, db) {
    const subs = db.subscribers || [];
    const pg = paginateAdminList(subs, 'subscribers');
    el.innerHTML = `
    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-bell"></i> নিউজলেটার সাবস্ক্রাইবার লিস্ট (${subs.length})</h3>
        </div>
        ${renderBulkToolbarHtml('subscribers')}
        <div class="dcp-table-wrap">
            <table class="dcp-table" style="min-width:100%;">
                <thead>
                    <tr>
                        <th><input type="checkbox" onchange="toggleSelectAllRows('subscribers',this.checked,${JSON.stringify(pg.slice.map(s=>String(s.id))).replace(/"/g,'&quot;')})"></th>
                        <th>ইমেইল / মোবাইল</th>
                        <th>সাবস্ক্রিপশন তারিখ</th>
                        <th>সিন স্ট্যাটাস</th>
                        <th>কুইক ভিউ, এডিট, ডিলিট</th>
                    </tr>
                </thead>
                <tbody>
                    ${pg.slice.map(s => {
                        const realIdx = subs.findIndex(x => String(x.id) === String(s.id));
                        return `
                        <tr>
                            <td><input type="checkbox" onchange="toggleBulkRow('subscribers','${esc(s.id)}',this.checked)"></td>
                            <td><strong>${esc(s.email)}</strong></td>
                            <td>${esc(s.subscribed_at)}</td>
                            <td><span class="badge ${s.seen?'badge-success':'badge-warning'}">${s.seen?'Seen (দেখা হয়েছে)':'Unseen (নতুন)'}</span></td>
                            <td>
                                <button onclick="quickViewSubscriber(${realIdx})" class="btn btn-outline btn-xs"><i class="fa fa-eye"></i></button>
                                <button onclick="editSubscriberModal(${realIdx})" class="btn btn-primary btn-xs"><i class="fa fa-edit"></i></button>
                                <button onclick="DCITStore.updateDB(d=>d.subscribers.splice(${realIdx},1));renderAdminApp();" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
        ${renderAdminPaginationHtml('subscribers', pg)}
    </div>`;
}

function quickViewSubscriber(idx) {
    const s = DCITStore.getDB().subscribers[idx];
    if (!s) return;
    DCITStore.updateDB(db => { if (db.subscribers[idx]) db.subscribers[idx].seen = true; });
    renderAdminApp();
    openAdminModal('সাবস্ক্রাইবার কুইক ভিউ', `<div class="qv-box"><span class="lbl">ইমেইল / কন্টাক্ট</span><span class="val">${esc(s.email)} (তারিখ: ${esc(s.subscribed_at)})</span></div>`);
}

function editSubscriberModal(idx) {
    const s = DCITStore.getDB().subscribers[idx];
    if (!s) return;
    openAdminModal('সাবস্ক্রাইবার এডিট', `
        <form onsubmit="event.preventDefault();DCITStore.updateDB(d=>{d.subscribers[${idx}].email=document.getElementById('sub-ed-em').value;});closeAdminModal();renderAdminApp();">
            <div class="form-group"><label>ইমেইল</label><input type="text" id="sub-ed-em" class="form-control" value="${esc(s.email)}" required></div>
            <button type="submit" class="btn btn-primary" style="margin-top:12px;">আপডেট</button>
        </form>
    `);
}

let msgSeenFilter = '';
function renderTabMessages(el, db) {
    const msgs = db.messages || [];
    const unseenCnt = msgs.filter(m => !m.seen).length;
    const seenCnt = msgs.filter(m => m.seen).length;
    const filtered = msgs.filter(m => {
        if (msgSeenFilter === 'UNSEEN') return !m.seen;
        if (msgSeenFilter === 'SEEN') return !!m.seen;
        return true;
    });
    const pg = paginateAdminList(filtered, 'messages');

    el.innerHTML = `
    <div class="digital-counter-grid">
        <div class="digital-counter-card ${msgSeenFilter===''?'active':''}" onclick="msgSeenFilter='';renderAdminApp();">
            <div><div class="dc-num">${msgs.length}</div><div class="dc-lbl">মোট মেসেজ ইনবক্স</div></div>
            <div class="dc-icon"><i class="fa fa-envelope"></i></div>
        </div>
        <div class="digital-counter-card ${msgSeenFilter==='UNSEEN'?'active':''}" onclick="msgSeenFilter='UNSEEN';renderAdminApp();">
            <div><div class="dc-num" style="color:#d97706;">${unseenCnt}</div><div class="dc-lbl">Unseen (অপঠিত মেসেজ)</div></div>
            <div class="dc-icon" style="background:#fef3c7;color:#d97706;"><i class="fa fa-envelope-o"></i></div>
        </div>
        <div class="digital-counter-card ${msgSeenFilter==='SEEN'?'active':''}" onclick="msgSeenFilter='SEEN';renderAdminApp();">
            <div><div class="dc-num" style="color:#16a34a;">${seenCnt}</div><div class="dc-lbl">Seen (পঠিত মেসেজ)</div></div>
            <div class="dc-icon" style="background:#dcfce7;color:#16a34a;"><i class="fa fa-envelope-open-o"></i></div>
        </div>
    </div>

    <div class="panel-card">
        <div class="panel-header"><h3><i class="fa fa-envelope"></i> কন্টাক্ট মেসেজ ইনবক্স (${filtered.length})</h3></div>
        ${renderBulkToolbarHtml('messages')}
        <div class="dcp-table-wrap">
            <table class="dcp-table" style="min-width:100%;">
                <thead>
                    <tr>
                        <th><input type="checkbox" onchange="toggleSelectAllRows('messages',this.checked,${JSON.stringify(pg.slice.map(m=>String(m.id))).replace(/"/g,'&quot;')})"></th>
                        <th>প্রেরকের নাম ও মোবাইল</th>
                        <th>বিষয় ও বার্তা</th>
                        <th>তারিখ</th>
                        <th>Seen / Unseen</th>
                        <th>কুইক ভিউ, রিপ্লাই, ডিলিট</th>
                    </tr>
                </thead>
                <tbody>
                    ${pg.slice.map(m => {
                        const realIdx = msgs.findIndex(x => String(x.id) === String(m.id));
                        return `
                        <tr style="${!m.seen?'background:#fffbeb;font-weight:700;':''}">
                            <td><input type="checkbox" onchange="toggleBulkRow('messages','${esc(m.id)}',this.checked)"></td>
                            <td><strong>${esc(m.sender_name)}</strong><br><small>${esc(m.phone)}</small></td>
                            <td><strong>${esc(m.subject || 'সাধারণ জিজ্ঞাসা')}</strong><br><small>${esc(m.message)}</small></td>
                            <td>${esc(m.sent_at)}</td>
                            <td><span class="badge ${m.seen?'badge-success':'badge-warning'}">${m.seen?'Seen':'Unseen'}</span></td>
                            <td>
                                <button onclick="quickViewInboxMessage(${realIdx})" class="btn btn-outline btn-xs"><i class="fa fa-eye"></i> কুইক ভিউ</button>
                                <button onclick="openAutoSmsGatewayModal('${esc(m.phone)}','প্রিয় ${esc(m.sender_name)}, আপনার বার্তার জন্য ধন্যবাদ। - Dream Career IT')" class="btn btn-accent btn-xs"><i class="fa fa-reply"></i> অটো SMS</button>
                                <button onclick="DCITStore.updateDB(d=>d.messages.splice(${realIdx},1));renderAdminApp();" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
        ${renderAdminPaginationHtml('messages', pg)}
    </div>`;
}

function quickViewInboxMessage(idx) {
    const m = DCITStore.getDB().messages[idx];
    if (!m) return;
    DCITStore.updateDB(db => { if (db.messages[idx]) { db.messages[idx].seen = true; db.messages[idx].status = 'Read'; } });
    renderAdminApp();
    openAdminModal('মেসেজ কুইক ভিউ', `
        <div class="qv-grid">
            <div class="qv-box"><span class="lbl">প্রেরক ও মোবাইল</span><span class="val">${esc(m.sender_name)} (${esc(m.phone)})</span></div>
            <div class="qv-box"><span class="lbl">সময় ও স্ট্যাটাস</span><span class="val">${esc(m.sent_at)} (Seen)</span></div>
            <div class="qv-box" style="grid-column:1/-1;"><span class="lbl">বার্তার বিস্তারিত</span><span class="val">${esc(m.message)}</span></div>
        </div>
    `);
}

function renderTabLoginHistory(el, db) {
    const logs = db.login_history || [];
    el.innerHTML = `
    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-history"></i> এডমিন লগইন হিস্ট্রি ও সিকিউরিটি অডিট লগ (${logs.length})</h3>
        </div>
        <div class="dcp-table-wrap">
            <table class="dcp-table" style="min-width:100%;">
                <thead><tr><th>ইউজারনেম</th><th>নাম ও রোল</th><th>লগইন সময়</th><th>ডিভাইস ও ব্রাউজার</th><th>সিকিউরিটি স্ট্যাটাস</th></tr></thead>
                <tbody>
                    ${logs.map(l => `
                    <tr>
                        <td><strong>${esc(l.username)}</strong></td>
                        <td>${esc(l.name)} (${esc(l.role)})</td>
                        <td>${esc(l.login_time)}</td>
                        <td><small>${esc(l.device || 'Browser Session')}</small></td>
                        <td><span class="badge badge-success">${esc(l.status)}</span></td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>
    </div>`;
}

function renderTabSettings(el, db) {
    const s = db.settings || {};
    const banners = db.welcome_banners || [];
    el.innerHTML = `
    <div class="panel-card" style="padding:22px;">
        <h3 style="margin-top:0;"><i class="fa fa-cogs"></i> প্রতিষ্ঠান সেটিংস, ডিসকাউন্ট ও ওয়েলকাম পপআপ ব্যানার কনফিগারেশন</h3>
        <form onsubmit="saveGlobalSettings(event)">
            <div class="form-grid">
                <div class="form-group"><label>প্রতিষ্ঠানের নাম (বাংলা)</label><input type="text" id="st-name-bn" class="form-control" value="${esc(s.institute_name_bn || 'ড্রিম ক্যারিয়ার আইটি')}"></div>
                <div class="form-group"><label>প্রতিষ্ঠানের নাম (ইংরেজি)</label><input type="text" id="st-name-en" class="form-control" value="${esc(s.institute_name || 'Dream Career IT')}"></div>
                <div class="form-group"><label>হটলাইন ফোন</label><input type="text" id="st-phone" class="form-control" value="${esc(s.phone || '01771770044')}"></div>
                <div class="form-group"><label>প্রতিবন্ধী কোটা ডিসকাউন্ট পার্সেন্টেজ (%)</label><input type="number" id="st-dis-pct" class="form-control" value="${esc(s.disability_discount_percent || 25)}"></div>
                <div class="form-group"><label>শিক্ষক রেফারেন্স ডিসকাউন্ট পার্সেন্টেজ (%)</label><input type="number" id="st-ref-pct" class="form-control" value="${esc(s.teacher_refer_discount_percent || 10)}"></div>
                <div class="form-group"><label>পেমেন্ট মেথড সমূহ (কমা দিয়ে লিখুন)</label><input type="text" id="st-pay-methods" class="form-control" value="${esc(s.payment_methods || 'বিকাশ, নগদ, রকেট, ব্যাংক, ক্যাশ')}"></div>
                <div class="form-group" style="grid-column:1/-1;"><label>ঠিকানা</label><input type="text" id="st-addr" class="form-control" value="${esc(s.address || 'ভাই ভাই সুপার মার্কেট, নতুন পদুয়ার বাজার মসজিদের পাশে, পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা - ৩৫০০')}"></div>
                <div class="form-group" style="grid-column:1/-1;"><label>স্ক্রলিং নোটিশ টিকার (হেডার মারকিউ)</label><input type="text" id="st-ticker" class="form-control" value="${esc(s.notice_ticker || '')}"></div>
            </div>
            <button type="submit" class="btn btn-primary" style="margin-top:14px;"><i class="fa fa-save"></i> সেটিংস ও ডিসকাউন্ট সংরক্ষণ করুন</button>
        </form>
    </div>

    <div class="panel-card" style="padding:22px;">
        <div class="panel-header" style="padding:0 0 14px; border:none;">
            <h3 style="margin:0;"><i class="fa fa-picture-o"></i> ওয়েবসাইট ওয়েলকাম নোটিশ পপআপ ব্যানার (সাইটে ঢুকলেই প্রদর্শিত হবে)</h3>
            <button onclick="openWelcomeBannerModal()" class="btn btn-accent btn-sm"><i class="fa fa-plus"></i> ➕ নতুন ওয়েলকাম ব্যানার যুক্ত করুন</button>
        </div>
        <div class="dcp-table-wrap">
            <table class="dcp-table" style="min-width:100%;">
                <thead><tr><th>ছবি</th><th>শিরোনাম ও সাবটাইটেল</th><th>বাটন টেক্সট</th><th>স্ট্যাটাস</th><th>অ্যাকশন</th></tr></thead>
                <tbody>
                    ${banners.map((b, idx) => `
                    <tr>
                        <td><img src="${esc(b.image || '../images/logo.png')}" style="width:70px;height:44px;object-fit:cover;border-radius:6px;"></td>
                        <td><strong>${esc(b.title)}</strong><br><small>${esc(b.subtitle)}</small></td>
                        <td>${esc(b.cta_text || 'এখনই ভর্তি হোন')}</td>
                        <td><span class="badge ${b.active?'badge-success':'badge-warning'}">${b.active?'Active':'Inactive'}</span></td>
                        <td>
                            <button onclick="openWelcomeBannerModal(${idx})" class="btn btn-primary btn-xs"><i class="fa fa-edit"></i></button>
                            <button onclick="DCITStore.updateDB(d=>d.welcome_banners.splice(${idx},1));renderAdminApp();" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>
                        </td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>
    </div>`;
}

function saveGlobalSettings(e) {
    e.preventDefault();
    DCITStore.updateDB(db => {
        db.settings.institute_name_bn = document.getElementById('st-name-bn').value.trim();
        db.settings.institute_name = document.getElementById('st-name-en').value.trim();
        db.settings.phone = document.getElementById('st-phone').value.trim();
        db.settings.disability_discount_percent = Number(document.getElementById('st-dis-pct').value || 25);
        db.settings.teacher_refer_discount_percent = Number(document.getElementById('st-ref-pct').value || 10);
        db.settings.payment_methods = document.getElementById('st-pay-methods').value.trim();
        db.settings.address = document.getElementById('st-addr').value.trim();
        db.settings.notice_ticker = document.getElementById('st-ticker').value.trim();
    });
    notifyToast('সকল সেটিংস ও ডিসকাউন্ট পার্সেন্টেজ আপডেট হয়েছে!');
}

function openWelcomeBannerModal(editIdx = null) {
    const b = editIdx !== null ? DCITStore.getDB().welcome_banners[editIdx] : null;
    openAdminModal(b ? 'ওয়েলকাম পপআপ ব্যানার এডিট' : 'নতুন ওয়েলকাম পপআপ ব্যানার', `
    <form onsubmit="saveWelcomeBannerModal(event, ${editIdx !== null ? editIdx : 'null'})">
        <div class="form-grid">
            <div class="form-group"><label>ব্যানার শিরোনাম *</label><input type="text" id="wb-title" class="form-control" value="${esc(b?.title || '২০২৬ শিক্ষাবর্ষে ভর্তি চলছে!')}" required></div>
            <div class="form-group"><label>সাবটাইটেল / বিবরণ *</label><input type="text" id="wb-sub" class="form-control" value="${esc(b?.subtitle || 'সরকারি সনদপ্রাপ্ত কোর্সে বিশেষ ছাড়ে আজই অনলাইনে আবেদন করুন।')}" required></div>
            <div class="form-group">
                <label>ব্যানার ছবি আপলোড</label>
                <input type="file" accept="image/*" class="form-control" onchange="previewUploadImg(this,'wb-prev','wb-val')">
                <input type="hidden" id="wb-val" value="${esc(b?.image || '../images/slider/slide1.png')}">
                <img id="wb-prev" src="${esc(b?.image || '../images/slider/slide1.png')}" style="width:90px;height:50px;margin-top:6px;object-fit:cover;">
            </div>
            <div class="form-group"><label>স্ট্যাটাস</label>
                <select id="wb-active" class="form-control">
                    <option value="1" ${b?.active!==false?'selected':''}>চালু (Active)</option>
                    <option value="0" ${b?.active===false?'selected':''}>বন্ধ (Inactive)</option>
                </select>
            </div>
        </div>
        <div style="margin-top:16px;text-align:right;"><button type="submit" class="btn btn-primary">সংরক্ষণ করুন</button></div>
    </form>`);
}

function saveWelcomeBannerModal(e, editIdx) {
    e.preventDefault();
    const obj = {
        id: Date.now(),
        title: document.getElementById('wb-title').value.trim(),
        subtitle: document.getElementById('wb-sub').value.trim(),
        image: document.getElementById('wb-val').value,
        cta_text: 'এখনই অনলাইনে ভর্তি হোন',
        cta_link: '#apply-online',
        active: document.getElementById('wb-active').value === '1'
    };
    DCITStore.updateDB(db => {
        db.welcome_banners = db.welcome_banners || [];
        if (editIdx !== null && db.welcome_banners[editIdx]) db.welcome_banners[editIdx] = obj;
        else db.welcome_banners.unshift(obj);
    });
    closeAdminModal();
    renderAdminApp();
    notifyToast('ওয়েলকাম পপআপ ব্যানার সংরক্ষিত হয়েছে!');
}

document.addEventListener('DOMContentLoaded', () => {
    renderAdminApp();
});

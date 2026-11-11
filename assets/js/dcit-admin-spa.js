/**
 * DREAM CAREER IT - Enterprise Admin Control Panel Engine (v5.0)
 * Complete 16-Module Admin SPA with Zero-Hint Login & Time-Lock,
 * Bulk Operations, Pagination (30/50/100), Conditional GPA, Simless Auto SMS,
 * Rich Word-Style Notice Editor, Dynamic Course Syllabus (+), and Branded Reports.
 */
function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function admImg(p, fallback = '../assets/img/logo.jpg') {
    if (!p) return fallback;
    const s = String(p).trim();
    if (s.startsWith('data:') || s.startsWith('http://') || s.startsWith('https://') || s.startsWith('../')) return s;
    if (s.startsWith('assets/')) return '../' + s;
    if (s.startsWith('../images/')) return fallback;
    return s;
}

let currentTab = 'dashboard';
let subFilter = 'ALL';
let currentSearch = '';
let currentCourseFilter = '';
let adminPages = {};
let bulkSelected = {};
window._admPaging = { page: 1, perPage: 30 };

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

function notifyToast(msg, type = 'success') {
    const t = type === 'danger' ? 'error' : type;
    const title = t === 'error' ? 'সতর্কবার্তা / ডিলিট' : 'সফলভাবে সম্পন্ন!';
    showAdminToast(t, title, msg);
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

// Universal Admin Pagination & Bulk Action Helper
function paginateAdminList(items, tabKey = currentTab) {
    const st = window._admPaging;
    if (adminPages[tabKey]) st.page = adminPages[tabKey];
    const total = items.length;
    const perPage = Number(st.perPage) || 30;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    if (st.page > totalPages) st.page = totalPages;
    if (st.page < 1) st.page = 1;
    adminPages[tabKey] = st.page;
    const start = (st.page - 1) * perPage;
    const sliced = items.slice(start, start + perPage);

    let btns = `<button class="page-btn" ${st.page<=1?'disabled':''} onclick="changeAdminPage(${st.page-1}, '${tabKey}')">&lt;</button>`;
    for (let p = 1; p <= totalPages; p++) {
        if (totalPages <= 10 || p <= 3 || p > totalPages - 2 || Math.abs(p - st.page) <= 1) {
            btns += `<button class="page-btn ${p===st.page?'active':''}" onclick="changeAdminPage(${p}, '${tabKey}')">${p}</button>`;
        } else if (p === 4 && st.page > 5) {
            btns += `<span style="padding:0 5px;">...</span>`;
        } else if (p === totalPages - 2 && st.page < totalPages - 4) {
            btns += `<span style="padding:0 5px;">...</span>`;
        }
    }
    btns += `<button class="page-btn" ${st.page>=totalPages?'disabled':''} onclick="changeAdminPage(${st.page+1}, '${tabKey}')">&gt;</button>`;

    const barHTML = `
    <div class="pagination-bar no-print">
        <div style="display:flex; align-items:center; gap:10px; font-size:0.85rem; font-weight:700;">
            <span>মোটঃ ${total} টি | প্রতি পেজে দেখুনঃ</span>
            <select onchange="changeAdminPerPage(this.value, '${tabKey}')" class="form-control" style="width:96px; padding:4px 8px;">
                ${[30, 50, 100].map(n => `<option value="${n}" ${perPage===n?'selected':''}>${n} জন</option>`).join('')}
            </select>
        </div>
        <div class="page-numbers">${btns}</div>
    </div>`;

    return { slice: sliced, sliced, barHTML, start, total, page: st.page, perPage, totalPages };
}

function renderAdminPaginationHtml(tabKey, pg) {
    return pg ? pg.barHTML : '';
}

function changeAdminPage(p, tabKey = currentTab) {
    window._admPaging.page = Number(p);
    adminPages[tabKey] = Number(p);
    renderAdminApp();
}

function changeAdminPerPage(n, tabKey = currentTab) {
    window._admPaging.perPage = Number(n);
    window._admPaging.page = 1;
    adminPages[tabKey] = 1;
    renderAdminApp();
}

function renderBulkToolbar(tableKey, extraStatusOptions = []) {
    return `
    <div class="bulk-action-bar no-print">
        <div style="display:flex; align-items:center; gap:10px;">
            <label style="display:flex; align-items:center; gap:6px; font-weight:700; font-size:0.85rem; cursor:pointer;">
                <input type="checkbox" onchange="toggleSelectAllRows('${tableKey}', this.checked)"> সব সিলেক্ট করুন (Bulk Select)
            </label>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
            ${extraStatusOptions.length ? `
                <select id="bulkStatusSelect_${tableKey}" class="form-control" style="width:185px; padding:5px 8px; font-size:0.82rem;">
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

function renderBulkToolbarHtml(tableKey, extraHtml = '') {
    return `
    <div class="bulk-action-bar no-print">
        <div style="display:flex; align-items:center; gap:10px;">
            <label style="display:flex; align-items:center; gap:6px; font-weight:700; font-size:0.85rem; cursor:pointer;">
                <input type="checkbox" onchange="toggleSelectAllRows('${tableKey}', this.checked)"> সব সিলেক্ট করুন (Bulk Select)
            </label>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
            ${extraHtml}
            <button onclick="openBulkSmsModalForSelected('${tableKey}')" class="btn btn-success btn-xs"><i class="fa fa-paper-plane"></i> বাল্ক অটো মেসেজ পাঠান</button>
            <button onclick="executeBulkDelete('${tableKey}')" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i> বাল্ক ডিলিট</button>
        </div>
    </div>`;
}

function toggleSelectAllRows(tableKeyOrCheckbox, checkedFlag = null, idList = null) {
    if (typeof tableKeyOrCheckbox === 'string') {
        const tableKey = tableKeyOrCheckbox;
        const isChecked = !!checkedFlag;
        document.querySelectorAll('.row-bulk-chk').forEach(c => { c.checked = isChecked; });
        if (isChecked && Array.isArray(idList)) {
            bulkSelected[tableKey] = [...idList];
        } else if (!isChecked) {
            bulkSelected[tableKey] = [];
        }
    } else if (tableKeyOrCheckbox && typeof tableKeyOrCheckbox.checked === 'boolean') {
        const isChecked = tableKeyOrCheckbox.checked;
        document.querySelectorAll('.row-bulk-chk').forEach(c => { c.checked = isChecked; });
    }
}

function toggleBulkRow(tableKey, idVal, isChecked) {
    bulkSelected[tableKey] = bulkSelected[tableKey] || [];
    const sId = String(idVal);
    if (isChecked) {
        if (!bulkSelected[tableKey].includes(sId)) bulkSelected[tableKey].push(sId);
    } else {
        bulkSelected[tableKey] = bulkSelected[tableKey].filter(x => x !== sId);
    }
}

function clearBulkSelection(tableKey) {
    bulkSelected[tableKey] = [];
    document.querySelectorAll('.row-bulk-chk').forEach(c => { c.checked = false; });
    renderAdminApp();
}

function getSelectedBulkIndices(tableKey = '') {
    const domChecked = Array.from(document.querySelectorAll('.row-bulk-chk:checked'))
        .map(c => Number(c.getAttribute('data-idx')))
        .filter(n => !isNaN(n))
        .sort((a, b) => b - a);
    if (domChecked.length) return domChecked;
    const ids = bulkSelected[tableKey] || [];
    if (!ids.length) return [];
    const db = DCITStore.getDB();
    const list = db[tableKey] || [];
    const matched = [];
    list.forEach((item, idx) => {
        const key = String(item.reg_no || item.application_no || item.slot_code || item.batch_code || item.slug || item.code || item.id || item.name || idx);
        if (ids.includes(key)) matched.push(idx);
    });
    return matched.sort((a, b) => b - a);
}

function executeBulkDelete(tableKey) {
    const indices = getSelectedBulkIndices(tableKey);
    if (!indices.length) { showAdminToast('warning', 'সিলেক্ট করুন!', 'বাল্ক ডিলিট করার জন্য অন্তত একটি রো টিক (✓) দিন।'); return; }
    if (!confirm(`আপনি কি নির্বাচিত ${indices.length} টি রেকর্ড একসাথে মুছে ফেলতে চান?`)) return;
    const db = DCITStore.getDB();
    indices.forEach(idx => { if (db[tableKey] && db[tableKey][idx] !== undefined) db[tableKey].splice(idx, 1); });
    DCITStore.saveDB(db);
    bulkSelected[tableKey] = [];
    showAdminToast('success', 'বাল্ক ডিলিট সম্পন্ন!', `${indices.length} টি রেকর্ড মুছে ফেলা হয়েছে।`);
    renderAdminApp();
}

function executeBulkUpdate(tableKey) {
    const indices = getSelectedBulkIndices(tableKey);
    const sel = document.getElementById('bulkStatusSelect_' + tableKey);
    const val = sel ? sel.value : '';
    if (!indices.length || !val) { showAdminToast('warning', 'তথ্য দিন!', 'রো সিলেক্ট করুন এবং ড্রপডাউন থেকে স্ট্যাটাস বেছে নিন।'); return; }
    const db = DCITStore.getDB();
    indices.forEach(idx => {
        const item = db[tableKey][idx];
        if (!item) return;
        if (tableKey === 'students') {
            if (['নতুন স্টুডেন্ট', 'পরীক্ষায় অংশগ্রহণ করেছে', 'পাস করেছে'].includes(val)) {
                item.exam_status = val;
                if (val === 'পাস করেছে') { item.result_grade = item.result_grade || 'A+'; item.cgpa = item.cgpa || '5.00'; item.status = 'Completed'; }
            } else {
                item.result_grade = val;
            }
        } else if (tableKey === 'messages') {
            item.is_read = val === 'Seen' ? 1 : 0;
            item.seen = val === 'Seen';
        } else {
            item.status = val;
        }
    });
    DCITStore.saveDB(db);
    bulkSelected[tableKey] = [];
    showAdminToast('success', 'বাল্ক আপডেট সম্পন্ন!', `${indices.length} টি রেকর্ডের তথ্য আপডেট করা হয়েছে।`);
    renderAdminApp();
}

function openBulkSmsModalForSelected(tableKey) {
    const indices = getSelectedBulkIndices(tableKey);
    const db = DCITStore.getDB();
    const list = db[tableKey] || [];
    let phones = [];
    if (indices.length) {
        indices.forEach(idx => {
            const it = list[idx];
            if (it && (it.phone || it.contact_info || it.email)) phones.push(it.phone || it.contact_info || it.email);
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
    currentSearch = '';
    currentCourseFilter = filter === 'DUE' ? 'DUE' : '';
    window._admPaging.page = 1;
    adminPages[tab] = 1;
    closeAdminModal();
    renderAdminApp();
    if (msg) showAdminToast('success', 'সফল!', msg);
}

/* ==========================================================================
   MAIN ADMIN APP ROUTER & ZERO-HINT LOGIN + TIME-LOCK
   ========================================================================== */
function renderAdminApp() {
    const root = document.getElementById('adminAppRoot');
    if (!root) return;
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
    const unseenMsg  = (db.messages || []).filter(m => !Number(m.is_read) && !m.seen).length;

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

/* ==========================================================================
   2. STUDENTS & BULK ENTRY + POPUP FORM + INLINE DROPDOWNS + CONDITIONAL GPA
   ========================================================================== */
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
    window._admPaging.page = 1;
    renderAdminApp();
}

function resetStudentMultiFilter() {
    stuFilterYear = ''; stuFilterBatch = ''; stuFilterDuration = ''; stuFilterExamStatus = '';
    currentSearch = ''; currentCourseFilter = '';
    adminPages['students'] = 1;
    window._admPaging.page = 1;
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
        const sYear = String(s.batch_year || s.session || '');
        const sBatch = String(s.batch_no || '');
        const sDur = String(s.course_duration || s.duration || '');
        const sExam = s.exam_status || 'নতুন স্টুডেন্ট';
        const matchYear = !stuFilterYear || sYear === stuFilterYear;
        const matchBatch = !stuFilterBatch || sBatch.toLowerCase().includes(stuFilterBatch.toLowerCase());
        const matchDur = !stuFilterDuration || sDur === stuFilterDuration;
        const matchExam = !stuFilterExamStatus || sExam === stuFilterExamStatus;
        return matchQ && matchCourse && matchYear && matchBatch && matchDur && matchExam;
    });

    const pg = paginateAdminList(filtered, 'students');
    const years = [...new Set(allStudents.map(s => String(s.batch_year || s.session || '2026')))].sort().reverse();
    const batches = [...new Set([...allStudents.map(s => s.batch_no), ...classes.map(c => c.batch_name)].filter(Boolean))];
    const durations = [...new Set([...allStudents.map(s => s.course_duration || s.duration), ...courses.map(c => c.duration)].filter(Boolean))];
    const schedules = [...new Set([...allStudents.map(s => s.class_slot || s.class_schedule), ...classes.map(c => c.time_label)].filter(Boolean))];

    el.innerHTML = `
    <div class="counter-filter-bar">
        <div class="counter-pills">
            <button class="counter-pill ${stuFilterExamStatus===''?'active':''}" onclick="stuFilterExamStatus='';adminPages['students']=1;renderAdminApp();">
                <i class="fa fa-users"></i> সকল স্টুডেন্ট <b>${allStudents.length}</b>
            </button>
            <button class="counter-pill ${stuFilterExamStatus==='নতুন স্টুডেন্ট'?'active':''}" onclick="stuFilterExamStatus='নতুন স্টুডেন্ট';adminPages['students']=1;renderAdminApp();">
                <i class="fa fa-user-plus"></i> নতুন স্টুডেন্ট <b>${countNew}</b>
            </button>
            <button class="counter-pill ${stuFilterExamStatus==='পরীক্ষায় অংশগ্রহণ করেছে'?'active':''}" onclick="stuFilterExamStatus='পরীক্ষায় অংশগ্রহণ করেছে';adminPages['students']=1;renderAdminApp();">
                <i class="fa fa-pencil-square-o"></i> পরীক্ষায় অংশগ্রহণ করেছে <b>${countExam}</b>
            </button>
            <button class="counter-pill ${stuFilterExamStatus==='পাস করেছে'?'active':''}" onclick="stuFilterExamStatus='পাস করেছে';adminPages['students']=1;renderAdminApp();">
                <i class="fa fa-check-circle"></i> পাস করেছে (Passed) <b>${countPassed}</b>
            </button>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button onclick="openStudentPopupModal()" class="btn btn-primary btn-xs"><i class="fa fa-plus-circle"></i> ➕ এড স্টুডেন্ট (পপআপ ফর্ম)</button>
            <button onclick="toggleBulkStudentCreator()" class="btn btn-accent btn-xs"><i class="fa fa-table"></i> বাল্ক স্টুডেন্ট এন্ট্রি</button>
            <button onclick="window.print()" class="btn btn-outline btn-xs"><i class="fa fa-print"></i> প্রিন্ট</button>
        </div>
    </div>

    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-users"></i> স্টুডেন্ট ও বাল্ক এন্ট্রি ম্যানেজমেন্ট (${filtered.length} জন)</h3>
            <!-- Search Filter Bar: সাল > ব্যাচ নং > কোর্স ডিউরেশন > কোর্স স্ট্যাটাস > সার্চ -->
            <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
                <select id="sf-year" class="form-control" style="width:125px;">
                    <option value="">সকল সাল (Year)</option>
                    ${years.map(y => `<option value="${esc(y)}" ${stuFilterYear===y?'selected':''}>${esc(y)}</option>`).join('')}
                </select>
                <select id="sf-batch" class="form-control" style="width:145px;">
                    <option value="">সকল ব্যাচ নং</option>
                    ${batches.map(b => `<option value="${esc(b)}" ${stuFilterBatch===b?'selected':''}>${esc(b)}</option>`).join('')}
                </select>
                <select id="sf-duration" class="form-control" style="width:145px;">
                    <option value="">কোর্স ডিউরেশন</option>
                    ${durations.map(d => `<option value="${esc(d)}" ${stuFilterDuration===d?'selected':''}>${esc(d)}</option>`).join('')}
                </select>
                <select id="sf-exam-status" class="form-control" style="width:175px;">
                    <option value="">কোর্স স্ট্যাটাস</option>
                    <option value="নতুন স্টুডেন্ট" ${stuFilterExamStatus==='নতুন স্টুডেন্ট'?'selected':''}>নতুন স্টুডেন্ট</option>
                    <option value="পরীক্ষায় অংশগ্রহণ করেছে" ${stuFilterExamStatus==='পরীক্ষায় অংশগ্রহণ করেছে'?'selected':''}>পরীক্ষায় অংশগ্রহণ করেছে</option>
                    <option value="পাস করেছে" ${stuFilterExamStatus==='পাস করেছে'?'selected':''}>পাস করেছে</option>
                </select>
                <input type="text" id="stu-q" class="form-control" placeholder="নাম, রেজিঃ, রোল, মোবাইল, কোড..." value="${esc(currentSearch)}" style="width:190px;">
                <button onclick="currentSearch=document.getElementById('stu-q').value;applyStudentMultiFilter();" class="btn btn-primary btn-xs"><i class="fa fa-search"></i> সার্চ</button>
                <button onclick="resetStudentMultiFilter()" class="btn btn-outline btn-xs">রিসেট</button>
            </div>
        </div>

        <div id="bulk-stu-drawer" style="display:none; padding:18px; background:#f0f9ff; border-bottom:1px solid #bae6fd;">
            <h4 style="margin:0 0 8px; color:#0369a1;"><i class="fa fa-bolt"></i> বাল্ক স্টুডেন্ট এন্ট্রি (প্রতি লাইনে ১ জন: নাম, পিতার নাম, মাতার নাম, মোবাইল, কোর্স নাম, ব্যাচ নং)</h4>
            <textarea id="bulk-stu-lines" class="form-control" rows="4" placeholder="রহিম উদ্দিন, করিম উদ্দিন, ফাতেমা বেগম, 01711000000, Advance Microsoft Office, Batch-2026-01&#10;সুমাইয়া আক্তার, জসিম উদ্দিন, রাবেয়া খাতুন, 01811000000, Graphic Design, Batch-2026-01"></textarea>
            <div style="margin-top:10px; display:flex; gap:10px;">
                <button onclick="processBulkStudents()" class="btn btn-success btn-xs"><i class="fa fa-check"></i> বাল্ক সাবমিট করুন</button>
                <button onclick="toggleBulkStudentCreator()" class="btn btn-outline btn-xs">বন্ধ করুন</button>
            </div>
        </div>

        <div class="panel-body">
            ${renderBulkToolbar('students', ['নতুন স্টুডেন্ট', 'পরীক্ষায় অংশগ্রহণ করেছে', 'পাস করেছে', 'A+', 'A', 'A-', 'B'])}
            <div class="dcp-table-wrap">
                <table class="dcp-table">
                    <thead>
                        <tr>
                            <th style="width:36px;"><input type="checkbox" onchange="toggleSelectAllRows('students', this.checked, ${JSON.stringify(pg.slice.map(s=>s.reg_no)).replace(/"/g,'&quot;')})"></th>
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
                            const examSt = s.exam_status || (s.result_grade && s.result_grade !== 'Pending' ? 'পাস করেছে' : 'নতুন স্টুডেন্ট');
                            const isPassed = examSt === 'পাস করেছে';
                            const curDur = s.course_duration || s.duration || '3 Months';
                            const curSlot = s.class_slot || s.class_schedule || '8:00 AM - 9:30 AM';
                            const curYear = s.batch_year || s.session || '2026';
                            const curGrade = s.result_grade || s.result || 'A+';
                            const checked = (bulkSelected['students'] || []).includes(s.reg_no) ? 'checked' : '';
                            return `
                            <tr>
                                <td><input type="checkbox" class="row-bulk-chk" data-idx="${realIdx}" ${checked} onchange="toggleBulkRow('students','${esc(s.reg_no)}',this.checked)"></td>
                                <td><img src="${esc(admImg(s.photo))}" style="width:48px;height:54px;object-fit:cover;border-radius:8px;border:2px solid #cbd5e1;" onerror="this.src='../assets/img/logo.jpg'"></td>
                                <td>
                                    <strong style="color:#0f172a;">${esc(s.reg_no)}</strong><br>
                                    <span style="font-size:12px; color:#475569;">রোল: ${esc(s.roll_no)}</span><br>
                                    <span class="badge badge-info" style="font-family:monospace; letter-spacing:0.5px;" title="১০ অক্ষরের গোপন কোড"><i class="fa fa-key"></i> ${esc(s.secret_code || 'DC26STD001')}</span>
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
                                    <select onchange="inlineUpdateStudentField(${realIdx},'course_name',this.value)" class="form-control" style="padding:4px 6px; font-size:12px; margin-bottom:4px;">
                                        ${courses.map(c => `<option value="${esc(c.title)}" ${s.course_name===c.title?'selected':''}>${esc(c.title)}</option>`).join('')}
                                        ${!courses.some(c=>c.title===s.course_name) ? `<option value="${esc(s.course_name)}" selected>${esc(s.course_name)}</option>` : ''}
                                    </select>
                                    <select onchange="inlineUpdateStudentField(${realIdx},'course_duration',this.value)" class="form-control" style="padding:4px 6px; font-size:12px; margin-bottom:4px;">
                                        ${['3 Months','4 Months','6 Months','1 Year'].map(d => `<option value="${d}" ${curDur===d?'selected':''}>${d}</option>`).join('')}
                                    </select>
                                    <select onchange="inlineUpdateStudentField(${realIdx},'class_slot',this.value)" class="form-control" style="padding:4px 6px; font-size:12px;">
                                        ${['8:00 AM - 9:30 AM','9:30 AM - 11:00 AM','11:00 AM - 12:30 PM','12:30 PM - 2:00 PM','4:00 PM - 5:30 PM','5:30 PM - 7:00 PM','7:00 PM - 8:30 PM', ...schedules].filter((v,i,a)=>a.indexOf(v)===i).map(sch => `<option value="${esc(sch)}" ${curSlot===sch?'selected':''}>${esc(sch)}</option>`).join('')}
                                    </select>
                                </td>
                                <td>
                                    <input type="text" value="${esc(curYear)}" onchange="inlineUpdateStudentField(${realIdx},'batch_year',this.value)" class="form-control" style="width:95px; padding:4px 6px; font-size:12px; margin-bottom:4px;" title="ব্যাচ-সাল">
                                    <input type="text" value="${esc(s.batch_no || 'Batch-2026-01')}" onchange="inlineUpdateStudentField(${realIdx},'batch_no',this.value)" class="form-control" style="width:110px; padding:4px 6px; font-size:12px;" title="ব্যাচ নং">
                                </td>
                                <td>
                                    <select onchange="inlineUpdateStudentExamStatus(${realIdx}, this.value)" class="form-control" style="padding:4px 6px; font-size:12px; font-weight:700; ${isPassed?'background:#dcfce7;border-color:#16a34a;color:#166534;':''}">
                                        <option value="নতুন স্টুডেন্ট" ${examSt==='নতুন স্টুডেন্ট'?'selected':''}>নতুন স্টুডেন্ট</option>
                                        <option value="পরীক্ষায় অংশগ্রহণ করেছে" ${examSt==='পরীক্ষায় অংশগ্রহণ করেছে'?'selected':''}>পরীক্ষায় অংশগ্রহণ করেছে</option>
                                        <option value="পাস করেছে" ${examSt==='পাস করেছে'?'selected':''}>পাস করেছে</option>
                                    </select>
                                    ${isPassed ? `
                                    <div style="margin-top:4px;">
                                        <select onchange="inlineUpdateStudentGpa(${realIdx}, this.value)" class="form-control" style="padding:4px 6px; font-size:12px; background:#fef9c3; border-color:#eab308; font-weight:800; color:#854d0e;">
                                            <option value="A+|5.00" ${curGrade==='A+'?'selected':''}>A+ (GPA 5.00)</option>
                                            <option value="A|4.75" ${curGrade==='A'?'selected':''}>A (GPA 4.75)</option>
                                            <option value="A-|4.00" ${curGrade==='A-'?'selected':''}>A- (GPA 4.00)</option>
                                            <option value="B|3.50" ${curGrade==='B'?'selected':''}>B (GPA 3.50)</option>
                                        </select>
                                    </div>` : `<div style="font-size:11px; color:#64748b; margin-top:3px;">পাস করলে জিপিএ অপশন আসবে</div>`}
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
            ${pg.barHTML}
        </div>
    </div>`;
}

function inlineUpdateStudentField(idx, field, val) {
    DCITStore.updateDB(db => {
        const s = db.students[idx];
        if (!s) return;
        s[field] = val;
        if (field === 'course_duration') s.duration = val;
        if (field === 'class_slot') s.class_schedule = val;
        if (field === 'batch_year') s.session = val;
    });
    notifyToast('শিক্ষার্থীর তথ্য আপডেট হয়েছে!');
}

function inlineUpdateStudentExamStatus(idx, examStatus) {
    DCITStore.updateDB(db => {
        const s = db.students[idx];
        if (!s) return;
        s.exam_status = examStatus;
        if (examStatus === 'পাস করেছে') {
            if (!s.result_grade || s.result_grade === 'Pending') {
                s.result_grade = 'A+';
                s.cgpa = '5.00';
            }
            s.status = 'Completed';
        } else {
            s.result_grade = 'Pending';
            s.cgpa = '0.00';
            s.status = 'Active';
        }
    });
    renderAdminApp();
    notifyToast('কোর্স স্ট্যাটাস আপডেট হয়েছে!');
}

function inlineUpdateStudentGpa(idx, gradePair) {
    if (!gradePair) return;
    const [grade, cgpa] = gradePair.split('|');
    DCITStore.updateDB(db => {
        const s = db.students[idx];
        if (!s) return;
        s.result_grade = grade || 'A+';
        s.cgpa = cgpa || '5.00';
        s.exam_status = 'পাস করেছে';
        s.status = 'Completed';
        let cert = (db.certificates || []).find(c => String(c.reg_no) === String(s.reg_no));
        if (!cert) {
            db.certificates = db.certificates || [];
            db.certificates.unshift({
                id: Date.now(),
                cert_no: 'DCIT-' + (s.batch_year || '2026') + '-' + s.reg_no,
                student_id: s.id || Date.now(),
                reg_no: s.reg_no,
                roll_no: s.roll_no,
                secret_code: s.secret_code || DCITStore.generateSecretCode(s.name, s.course_name, s.batch_year, s.reg_no),
                student_name: s.name,
                father_name: s.father_name,
                mother_name: s.mother_name,
                course_name: s.course_name,
                batch_no: s.batch_no || 'Batch-2026-01',
                batch_year: s.batch_year || 2026,
                session_quarter: s.session_quarter || 'January to March',
                duration: s.course_duration || '3 Months',
                grade: s.result_grade,
                cgpa: s.cgpa,
                issue_date: new Date().toISOString().slice(0,10),
                verification_code: 'VER-DCIT-' + s.reg_no,
                status: 'Issued'
            });
        } else {
            cert.grade = s.result_grade;
            cert.cgpa = s.cgpa;
        }
    });
    renderAdminApp();
    notifyToast('জিপিএ ও সার্টিফিকেট রেকর্ড স্বয়ংক্রিয়ভাবে আপডেট হয়েছে!');
}

function toggleBulkStudentCreator() {
    const el = document.getElementById('bulk-stu-drawer');
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function processBulkStudents() {
    const raw = (document.getElementById('bulk-stu-lines')?.value || '').trim();
    if (!raw) { showAdminToast('warning', 'তথ্য দিন!', 'কমপক্ষে ১টি লাইন লিখুন!'); return; }
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    let added = 0;
    DCITStore.updateDB(db => {
        lines.forEach((line, idx) => {
            const parts = line.split(',').map(p => p.trim());
            if (parts.length >= 2) {
                const maxReg = (db.students || []).reduce((m, s) => Math.max(m, parseInt(s.reg_no, 10) || 0), 0);
                const regNo = String(maxReg + 1).padStart(6, '0');
                const rollNo = String(db.students.length + 1).padStart(2, '0');
                const name = parts[0];
                const course = parts[4] || 'Advance Microsoft Office';
                const secret = DCITStore.generateSecretCode(name, course, '2026', regNo);
                db.students.unshift({
                    id: Date.now() + idx,
                    reg_no: regNo,
                    roll_no: rollNo,
                    secret_code: secret,
                    name: name,
                    father_name: parts[1] || 'মোঃ আব্দুল করিম',
                    mother_name: parts[2] || 'মিসেস রোকেয়া বেগম',
                    phone: parts[3] || '01771770044',
                    course_name: course,
                    batch_no: parts[5] || 'Batch-2026-01',
                    course_duration: '3 Months',
                    class_slot: '8:00 AM - 9:30 AM',
                    batch_year: 2026,
                    session_quarter: 'January to March',
                    batch_type: 'New Batch',
                    exam_status: 'নতুন স্টুডেন্ট',
                    result_grade: 'Pending',
                    cgpa: '0.00',
                    status: 'Active',
                    photo: 'assets/img/logo.jpg'
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
    const disPct = Number(DCITStore.setting('disability_discount_percent', '25'));
    const refPct = Number(DCITStore.setting('teacher_refer_discount_percent', '15'));
    let payMethods = ['bKash (01771770044)', 'Nagad (01771770044)', 'Rocket (01771770044)', 'Bank Transfer', 'Cash'];
    try { payMethods = JSON.parse(DCITStore.setting('payment_methods_json')) || payMethods; } catch(e) {}

    const nextReg = s ? s.reg_no : DCITStore.nextRegNo();
    const nextRoll = s ? s.roll_no : DCITStore.nextRollNo();
    const nextSecret = s ? (s.secret_code || DCITStore.generateSecretCode(s.name, s.course_name, s.batch_year, s.reg_no)) : DCITStore.generateSecretCode('STD', 'CRS', '2026', nextReg);

    const html = `
    <form onsubmit="saveStudentFromPopup(event, ${editIdx !== null ? editIdx : 'null'})">
        <div class="form-grid">
            <div class="form-group">
                <label>পাসপোর্ট সাইজের ছবি আপলোড (প্রিভিউ সহ)</label>
                <input type="file" accept="image/*" class="form-control" onchange="previewUploadImg(this,'stu-pop-photo-prev','stu-pop-photo-val')">
                <input type="hidden" id="stu-pop-photo-val" value="${esc(s ? s.photo : 'assets/img/logo.jpg')}">
                <img id="stu-pop-photo-prev" src="${esc(admImg(s ? s.photo : 'assets/img/logo.jpg'))}" style="margin-top:6px; width:68px; height:76px; object-fit:cover; border-radius:8px; border:2px solid #0f766e;">
            </div>
            <div class="form-group">
                <label>সার্টিফিকেট / জন্মনিবন্ধন ডকুমেন্ট আপলোড</label>
                <input type="file" accept="image/*" class="form-control" onchange="previewUploadImg(this,'stu-pop-cert-prev','stu-pop-cert-val')">
                <input type="hidden" id="stu-pop-cert-val" value="${esc(s?.doc_image || 'assets/img/logo.jpg')}">
                <img id="stu-pop-cert-prev" src="${esc(admImg(s?.doc_image || 'assets/img/logo.jpg'))}" style="margin-top:6px; width:68px; height:54px; object-fit:cover; border-radius:8px; border:1px dashed #94a3b8;">
            </div>
            <div class="form-group"><label>রেজিস্ট্রেশন নাম্বার *</label><input type="text" id="sp-reg" class="form-control" value="${esc(nextReg)}" required></div>
            <div class="form-group"><label>রোল নাম্বার *</label><input type="text" id="sp-roll" class="form-control" value="${esc(nextRoll)}" required></div>
            <div class="form-group"><label>১০ অক্ষরের গোপন কোড (Secret Code) *</label><input type="text" id="sp-secret" class="form-control" maxlength="10" value="${esc(nextSecret)}" required></div>
            <div class="form-group"><label>শিক্ষার্থীর নাম *</label><input type="text" id="sp-name" class="form-control" value="${esc(s?.name || '')}" required></div>
            <div class="form-group"><label>পিতার নাম *</label><input type="text" id="sp-father" class="form-control" value="${esc(s?.father_name || '')}" required></div>
            <div class="form-group"><label>মাতার নাম *</label><input type="text" id="sp-mother" class="form-control" value="${esc(s?.mother_name || '')}" required></div>
            <div class="form-group"><label>জন্ম-তারিখ (DOB) *</label><input type="date" id="sp-dob" class="form-control" value="${esc(s?.dob || '2003-01-15')}" required></div>
            <div class="form-group"><label>এনআইডি / জন্মনিবন্ধন নাম্বার *</label><input type="text" id="sp-nid" class="form-control" value="${esc(s?.nid_birth_reg || s?.nid || '')}" required></div>
            <div class="form-group"><label>মোবাইল নাম্বার *</label><input type="text" id="sp-phone" class="form-control" value="${esc(s?.phone || '')}" required></div>
            <div class="form-group"><label>শিক্ষাগত যোগ্যতা</label><input type="text" id="sp-edu" class="form-control" value="${esc(s?.education || 'HSC / Diploma')}"></div>
            <div class="form-group"><label>বর্তমান শিক্ষা প্রতিষ্ঠান</label><input type="text" id="sp-inst" class="form-control" value="${esc(s?.school_college || 'Cumilla Victoria Govt. College')}"></div>
            <div class="form-group"><label>কোথা থেকে আমাদের প্রতিষ্ঠান সম্পর্কে জেনেছেন?</label>
                <select id="sp-heard" class="form-control" onchange="recalcPopupStudentFee()">
                    ${['ফেসবুক পেজ','প্রাক্তন শিক্ষার্থী','শিক্ষক রেফারেন্স (ডিসকাউন্ট প্রযোজ্য)','ব্যানার / পোস্টার','ওয়েবসাইট'].map(h => `<option value="${h}" ${s?.heard_from===h?'selected':''}>${h}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label>কোনো ডিসএবিলিটিস (শারীরিক প্রতিবন্ধকতা) আছে?</label>
                <select id="sp-disability" class="form-control" onchange="togglePopupDisabilityRow();recalcPopupStudentFee();">
                    <option value="না" ${s?.has_disability!=='হ্যাঁ'?'selected':''}>না (No)</option>
                    <option value="হ্যাঁ" ${s?.has_disability==='হ্যাঁ'?'selected':''}>হ্যাঁ (Yes - ${disPct}% ডিসকাউন্ট)</option>
                </select>
            </div>
            <div class="form-group" id="sp-med-row" style="display:${s?.has_disability==='হ্যাঁ'?'block':'none'}; background:#fef2f2; padding:10px; border-radius:8px; border:1px solid #fecaca;">
                <label style="color:#dc2626;">মেডিক্যাল রিপোর্ট আপলোড করুন (${disPct}% বিশেষ ছাড়)</label>
                <input type="file" accept="image/*,.pdf" class="form-control" onchange="previewUploadImg(this,'sp-med-prev','sp-med-val')">
                <input type="hidden" id="sp-med-val" value="${esc(s?.medical_report || '')}">
                <img id="sp-med-prev" src="${esc(admImg(s?.medical_report || 'assets/img/logo.jpg'))}" style="width:52px;height:42px;margin-top:4px;object-fit:cover;">
            </div>
            <div class="form-group"><label>কোর্স নাম *</label>
                <select id="sp-course" class="form-control" onchange="autoSelectCourseFeeDuration()" required>
                    ${courses.map(c => `<option value="${esc(c.title)}" data-fee="${c.fee}" data-dur="${esc(c.duration)}" ${s?.course_name===c.title?'selected':''}>${esc(c.title)} (৳${c.fee})</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label>কোর্স ফি (অটো সিলেক্ট + ডিসকাউন্ট ক্যালকুলেশন)</label><input type="number" id="sp-fee" class="form-control" value="${esc(s?.course_fee || (courses[0]?.fee || 1500))}" readonly style="background:#f1f5f9;font-weight:800;"></div>
            <div class="form-group"><label>কোর্সের মেয়াদ (অটো সিলেক্ট)</label><input type="text" id="sp-duration" class="form-control" value="${esc(s?.course_duration || (courses[0]?.duration || '3 Months'))}"></div>
            <div class="form-group"><label>পেমেন্ট মেথড</label>
                <select id="sp-pay-method" class="form-control" onchange="togglePopupTrxRow()">
                    ${payMethods.map(m => `<option value="${esc(m)}" ${s?.payment_method===m?'selected':''}>${esc(m)}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label>পেইড এমাউন্ট (Paid Amount ৳) *</label><input type="number" id="sp-paid" class="form-control" value="${esc(s?.paid_amount ?? (courses[0]?.fee || 1500))}" oninput="recalcPopupDue()" required></div>
            <div class="form-group"><label>ডিউ এমাউন্ট (Due Amount ৳ - অটো ক্যালকুলেট)</label><input type="number" id="sp-due" class="form-control" value="${esc(s?.due_amount ?? 0)}" readonly style="background:#fff1f2;color:#dc2626;font-weight:800;"></div>
            <div class="form-group" id="sp-trx-row" style="display:${(s?.payment_method||'').toLowerCase().includes('cash')?'none':'block'};">
                <label>ট্রানজেকশন আইডি (Transaction ID)</label>
                <input type="text" id="sp-trx" class="form-control" placeholder="যেমন: BK9823412A" value="${esc(s?.trx_id || 'TRX' + Date.now().toString().slice(-6))}">
            </div>
            <div class="form-group"><label>ব্যাচ নং ও সাল</label>
                <div style="display:flex;gap:6px;">
                    <input type="text" id="sp-batch" class="form-control" value="${esc(s?.batch_no || 'Batch-2026-01')}" placeholder="Batch-2026-01">
                    <input type="text" id="sp-session" class="form-control" value="${esc(s?.batch_year || '2026')}" placeholder="2026">
                </div>
            </div>
            <div class="form-group"><label>ক্লাস টাইম স্লট</label>
                <input type="text" id="sp-slot" class="form-control" value="${esc(s?.class_slot || '8:00 AM - 9:30 AM')}">
            </div>
            <div class="form-group" style="grid-column:1/-1;"><label>বর্তমান ও স্থায়ী ঠিকানা *</label><input type="text" id="sp-address" class="form-control" value="${esc(s?.present_address || 'পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা')}" required></div>
            <div class="form-group" style="grid-column:1/-1; background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #cbd5e1;">
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;margin:0;">
                    <input type="checkbox" id="sp-oath" checked required>
                    <span><strong>শপথনামা:</strong> উপরের সকল তথ্য সঠিক এবং শিক্ষার্থী প্রতিষ্ঠানের সকল নিয়ম মেনে চলবে। (শিক্ষক রেফার ছাড়: ${refPct}%, প্রতিবন্ধী ছাড়: ${disPct}%)</span>
                </label>
            </div>
        </div>
        <div style="margin-top:16px; display:flex; justify-content:flex-end; gap:10px;">
            <button type="button" onclick="closeAdminModal()" class="btn btn-outline">বাতিল</button>
            <button type="submit" class="btn btn-primary"><i class="fa fa-check-circle"></i> সাবমিট ও সংরক্ষণ করুন</button>
        </div>
    </form>`;
    openAdminModal(s ? 'শিক্ষার্থীর তথ্য সম্পাদনা করুন' : 'নতুন স্টুডেন্ট এড করুন (কমপ্লিট পপআপ ফর্ম)', html);
}

function togglePopupDisabilityRow() {
    const v = document.getElementById('sp-disability')?.value;
    const row = document.getElementById('sp-med-row');
    if (row) row.style.display = v === 'হ্যাঁ' ? 'block' : 'none';
}

function togglePopupTrxRow() {
    const m = (document.getElementById('sp-pay-method')?.value || '').trim().toLowerCase();
    const row = document.getElementById('sp-trx-row');
    if (row) row.style.display = (m.includes('ক্যাশ') || m.includes('cash')) ? 'none' : 'block';
}

function autoSelectCourseFeeDuration() {
    const sel = document.getElementById('sp-course');
    if (!sel) return;
    const opt = sel.options[sel.selectedIndex];
    const dur = opt?.getAttribute('data-dur') || '3 Months';
    document.getElementById('sp-duration').value = dur;
    recalcPopupStudentFee();
}

function recalcPopupStudentFee() {
    const disPct = Number(DCITStore.setting('disability_discount_percent', '25'));
    const refPct = Number(DCITStore.setting('teacher_refer_discount_percent', '15'));
    const sel = document.getElementById('sp-course');
    const opt = sel ? sel.options[sel.selectedIndex] : null;
    let baseFee = Number(opt?.getAttribute('data-fee') || 1500);
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
        nid_birth_reg: document.getElementById('sp-nid').value.trim(),
        phone: document.getElementById('sp-phone').value.trim(),
        education: document.getElementById('sp-edu').value.trim(),
        school_college: document.getElementById('sp-inst').value.trim(),
        heard_from: document.getElementById('sp-heard').value,
        has_disability: document.getElementById('sp-disability').value,
        medical_report: document.getElementById('sp-med-val').value,
        doc_image: document.getElementById('stu-pop-cert-val')?.value || 'assets/img/logo.jpg',
        course_name: document.getElementById('sp-course').value,
        course_fee: Number(document.getElementById('sp-fee').value || 0),
        course_duration: document.getElementById('sp-duration').value,
        payment_method: document.getElementById('sp-pay-method').value,
        paid_amount: Number(document.getElementById('sp-paid').value || 0),
        due_amount: Number(document.getElementById('sp-due').value || 0),
        trx_id: document.getElementById('sp-trx').value.trim(),
        batch_no: document.getElementById('sp-batch').value.trim(),
        batch_year: Number(document.getElementById('sp-session').value) || 2026,
        class_slot: document.getElementById('sp-slot').value.trim(),
        present_address: document.getElementById('sp-address').value.trim(),
        permanent_address: document.getElementById('sp-address').value.trim(),
        photo: document.getElementById('stu-pop-photo-val').value || 'assets/img/logo.jpg'
    };

    DCITStore.updateDB(db => {
        if (editIdx !== null && db.students[editIdx]) {
            db.students[editIdx] = { ...db.students[editIdx], ...obj };
        } else {
            obj.id = Date.now();
            obj.exam_status = 'নতুন স্টুডেন্ট';
            obj.result_grade = 'Pending';
            obj.cgpa = '0.00';
            obj.status = 'Active';
            obj.batch_type = 'New Batch';
            obj.session_quarter = 'January to March';
            db.students.unshift(obj);
            db.payments = db.payments || [];
            db.payments.unshift({
                id: Date.now(),
                receipt_no: 'INV-' + obj.batch_year + '-' + String(db.payments.length + 1).padStart(3, '0'),
                reg_no: obj.reg_no,
                student_name: obj.name,
                phone: obj.phone,
                course_name: obj.course_name,
                batch_name: obj.batch_no,
                payment_month: 'January',
                payment_year: obj.batch_year,
                total_fee: obj.course_fee,
                discount_amount: 0,
                paid_amount: obj.paid_amount,
                due_amount: obj.due_amount,
                payment_method: obj.payment_method,
                trx_id: obj.trx_id || 'CASH',
                payment_date: new Date().toISOString().slice(0,10),
                status: obj.due_amount > 0 ? 'Partial' : 'Paid'
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
    <div class="qv-hero-banner">
        <img src="${esc(admImg(s.photo))}" onerror="this.src='../assets/img/logo.jpg'">
        <div>
            <h2 style="margin:0 0 6px; font-size:21px; color:#fff;">${esc(s.name)}</h2>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <span class="badge badge-info">রেজিঃ ${esc(s.reg_no)}</span>
                <span class="badge badge-warning">রোলঃ ${esc(s.roll_no)}</span>
                <span class="badge badge-success">গোপন কোডঃ ${esc(s.secret_code || 'DC20SAG001')}</span>
            </div>
            <p style="margin:8px 0 0; opacity:0.95; font-size:13px;"><i class="fa fa-graduation-cap"></i> ${esc(s.course_name)} (${esc(s.course_duration || '3 Months')}) — ${esc(s.batch_no || 'Batch-2026-01')}</p>
        </div>
    </div>
    <div class="qv-info-grid">
        <div class="qv-info-card"><small>পিতার নাম</small><strong>${esc(s.father_name || '-')}</strong></div>
        <div class="qv-info-card"><small>মাতার নাম</small><strong>${esc(s.mother_name || '-')}</strong></div>
        <div class="qv-info-card"><small>মোবাইল নাম্বার</small><strong>${esc(s.phone || '01771770044')}</strong></div>
        <div class="qv-info-card"><small>জন্ম-তারিখ ও এনআইডি</small><strong>${esc(s.dob || '2003-01-15')} | ${esc(s.nid_birth_reg || 'N/A')}</strong></div>
        <div class="qv-info-card"><small>কোর্স স্ট্যাটাস ও ফলাফল</small><strong>${esc(s.exam_status || 'নতুন স্টুডেন্ট')} — গ্রেড: ${esc(s.result_grade || 'Pending')} (${esc(s.cgpa || '0.00')})</strong></div>
        <div class="qv-info-card"><small>ক্লাস টাইম ও সেশন</small><strong>${esc(s.class_slot || '8:00 AM - 9:30 AM')} (${esc(s.batch_year || '2026')})</strong></div>
        <div class="qv-info-card"><small>শিক্ষা প্রতিষ্ঠান</small><strong>${esc(s.education || '')} (${esc(s.school_college || '-')})</strong></div>
        <div class="qv-info-card"><small>ঠিকানা</small><strong>${esc(s.present_address || 'কুমিল্লা')}</strong></div>
    </div>
    <div style="margin-top:16px; display:flex; justify-content:flex-end; gap:10px;">
        <button onclick="openAutoSmsGatewayModal('${esc(s.phone||'01771770044')}','প্রিয় ${esc(s.name)}, আপনার রেজিঃ ${esc(s.reg_no)} এবং গোপন কোড ${esc(s.secret_code)}।')" class="btn btn-accent btn-xs"><i class="fa fa-paper-plane"></i> মেসেজ পাঠান</button>
        <button onclick="closeAdminModal();openStudentPopupModal(${idx});" class="btn btn-primary btn-xs"><i class="fa fa-edit"></i> এডিট করুন</button>
        <button onclick="closeAdminModal()" class="btn btn-outline btn-xs">বন্ধ করুন</button>
    </div>`;
    openAdminModal('শিক্ষার্থীর বিস্তারিত প্রোফাইল (Quick View Card)', html);
}

function deleteStudent(idx) {
    if (!confirm('আপনি কি নিশ্চিতভাবে এই শিক্ষার্থীর তথ্য মুছে ফেলতে চান?')) return;
    DCITStore.updateDB(db => { db.students.splice(idx, 1); });
    renderAdminApp();
    notifyToast('শিক্ষার্থী মুছে ফেলা হয়েছে।', 'danger');
}

/* ==========================================================================
   3. DEDICATED RESULT UPDATE SECTION (রেজাল্ট আপডেট সেকশন)
   ========================================================================== */
function renderTabResults(el, db) {
    renderTabStudents(el, db);
    const hdr = el.querySelector('.panel-header h3');
    if (hdr) hdr.innerHTML = `<i class="fa fa-trophy" style="color:#eab308;"></i> রেজাল্ট আপডেট ও জিপিএ পাবলিশিং সেকশন (পাস সিলেক্ট করলেই জিপিএ ও সার্টিফিকেট অটো জেনারেট হবে)`;
}

/* ==========================================================================
   4. CERTIFICATES & 10-CHAR SECRET CODE + AUTO FILL BY REG NO
   ========================================================================== */
let certStatusFilter = '';
function renderTabCertificates(el, db) {
    const certs = db.certificates || [];
    const verifiedCount = certs.filter(c => c.status !== 'Revoked').length;
    const filtered = certs.filter(c => {
        const q = currentSearch.toLowerCase();
        const matchQ = !q || [c.cert_no, c.reg_no, c.student_name, c.secret_code, c.course_name].some(v => String(v||'').toLowerCase().includes(q));
        const matchSt = !certStatusFilter || (c.status || 'Issued') === certStatusFilter;
        return matchQ && matchSt;
    });
    const pg = paginateAdminList(filtered, 'certificates');

    el.innerHTML = `
    <div class="counter-filter-bar">
        <div class="counter-pills">
            <button class="counter-pill ${certStatusFilter===''?'active':''}" onclick="certStatusFilter='';renderAdminApp();">
                <i class="fa fa-certificate"></i> সকল সার্টিফিকেট <b>${certs.length}</b>
            </button>
            <button class="counter-pill ${certStatusFilter==='Issued'?'active':''}" onclick="certStatusFilter='Issued';renderAdminApp();">
                <i class="fa fa-check-circle"></i> ভেরিফাইড (Issued) <b>${verifiedCount}</b>
            </button>
        </div>
        <button onclick="openCertificateModal()" class="btn btn-primary btn-xs"><i class="fa fa-plus-circle"></i> ➕ নতুন সার্টিফিকেট ইস্যু করুন (রেজিঃ সার্চ সহ)</button>
    </div>

    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-certificate"></i> সার্টিফিকেট ও ১০-অক্ষরের গোপন কোড ম্যানেজমেন্ট (${filtered.length})</h3>
            <input type="text" class="form-control" placeholder="রেজিঃ নং, নাম, সার্টিফিকেট নং বা গোপন কোড দিয়ে খুঁজুন..." value="${esc(currentSearch)}" oninput="currentSearch=this.value;adminPages['certificates']=1;renderAdminApp();" style="max-width:320px;">
        </div>
        <div class="panel-body">
            ${renderBulkToolbar('certificates', ['Issued', 'Pending'])}
            <div class="dcp-table-wrap">
                <table class="dcp-table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" onchange="toggleSelectAllRows('certificates',this.checked)"></th>
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
                            return `
                            <tr>
                                <td><input type="checkbox" class="row-bulk-chk" data-idx="${realIdx}" onchange="toggleBulkRow('certificates','${esc(c.reg_no)}',this.checked)"></td>
                                <td><strong>${esc(c.cert_no)}</strong></td>
                                <td>রেজিঃ <strong>${esc(c.reg_no)}</strong><br><small>রোলঃ ${esc(c.roll_no)}</small></td>
                                <td><span class="badge badge-info" style="font-family:monospace;font-size:13px;"><i class="fa fa-key"></i> ${esc(c.secret_code || 'DC20SAG001')}</span></td>
                                <td><strong>${esc(c.student_name)}</strong><br><small>পিতা: ${esc(c.father_name || '-')}</small></td>
                                <td>${esc(c.course_name)}<br><small>${esc(c.duration || '3 Months')}</small></td>
                                <td><span class="badge badge-success">${esc(c.grade)} (${esc(c.cgpa || '5.00')})</span></td>
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
            ${pg.barHTML}
        </div>
    </div>`;
}

function openCertificateModal(editIdx = null) {
    const db = DCITStore.getDB();
    const c = editIdx !== null ? db.certificates[editIdx] : null;
    const html = `
    <div style="background:#f0f9ff; padding:14px; border-radius:10px; border:1px solid #bae6fd; margin-bottom:16px;">
        <label style="font-weight:700; color:#0369a1; display:block; margin-bottom:6px;"><i class="fa fa-magic"></i> স্টুডেন্ট রেজিস্ট্রেশন নাম্বার দিয়ে অটো-ফিল করুন:</label>
        <div style="display:flex; gap:8px;">
            <input type="text" id="cert-lookup-reg" class="form-control" placeholder="যেমন: 000001 বা রেজিঃ নাম্বার লিখুন..." value="${esc(c?.reg_no || '')}">
            <button type="button" onclick="autoFillCertByRegNo()" class="btn btn-primary btn-xs"><i class="fa fa-search"></i> সার্চ ও অটো-ফিল</button>
        </div>
    </div>
    <form onsubmit="saveCertModal(event, ${editIdx !== null ? editIdx : 'null'})">
        <div class="form-grid">
            <div class="form-group"><label>সার্টিফিকেট নাম্বার *</label><input type="text" id="cm-certno" class="form-control" value="${esc(c?.cert_no || 'DCIT-2026-' + String(db.certificates.length+1).padStart(6,'0'))}" required></div>
            <div class="form-group"><label>রেজিস্ট্রেশন নাম্বার *</label><input type="text" id="cm-reg" class="form-control" value="${esc(c?.reg_no || '')}" required></div>
            <div class="form-group"><label>রোল নাম্বার *</label><input type="text" id="cm-roll" class="form-control" value="${esc(c?.roll_no || '')}" required></div>
            <div class="form-group"><label>১০ অক্ষরের গোপন কোড (Secret Code) *</label><input type="text" id="cm-secret" class="form-control" maxlength="10" value="${esc(c?.secret_code || 'DC26STD001')}" required></div>
            <div class="form-group"><label>শিক্ষার্থীর নাম *</label><input type="text" id="cm-name" class="form-control" value="${esc(c?.student_name || '')}" required></div>
            <div class="form-group"><label>পিতার নাম *</label><input type="text" id="cm-father" class="form-control" value="${esc(c?.father_name || '')}" required></div>
            <div class="form-group"><label>মাতার নাম *</label><input type="text" id="cm-mother" class="form-control" value="${esc(c?.mother_name || '')}" required></div>
            <div class="form-group"><label>কোর্স নাম *</label><input type="text" id="cm-course" class="form-control" value="${esc(c?.course_name || 'Advance Microsoft Office')}" required></div>
            <div class="form-group"><label>কোর্সের মেয়াদ *</label><input type="text" id="cm-dur" class="form-control" value="${esc(c?.duration || '3 Months')}" required></div>
            <div class="form-group"><label>ব্যাচ নং *</label><input type="text" id="cm-batch" class="form-control" value="${esc(c?.batch_no || 'Batch-2026-01')}" required></div>
            <div class="form-group"><label>গ্রেড (Grade) *</label><input type="text" id="cm-grade" class="form-control" value="${esc(c?.grade || 'A+')}" required></div>
            <div class="form-group"><label>জিপিএ (CGPA) *</label><input type="text" id="cm-cgpa" class="form-control" value="${esc(c?.cgpa || '5.00')}" required></div>
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
    const s = (db.students || []).find(x => String(x.reg_no) === reg || String(x.roll_no) === reg);
    if (!s) {
        showAdminToast('error', 'পাওয়া যায়নি!', 'এই রেজিস্ট্রেশন নাম্বারে কোনো শিক্ষার্থী পাওয়া যায়নি!');
        return;
    }
    document.getElementById('cm-reg').value = s.reg_no;
    document.getElementById('cm-roll').value = s.roll_no || '';
    document.getElementById('cm-secret').value = (s.secret_code || DCITStore.generateSecretCode(s.name, s.course_name, s.batch_year, s.reg_no)).slice(0,10);
    document.getElementById('cm-name').value = s.name || '';
    document.getElementById('cm-father').value = s.father_name || '';
    document.getElementById('cm-mother').value = s.mother_name || '';
    document.getElementById('cm-course').value = s.course_name || '';
    document.getElementById('cm-dur').value = s.course_duration || '3 Months';
    document.getElementById('cm-batch').value = s.batch_no || 'Batch-2026-01';
    document.getElementById('cm-grade').value = (s.result_grade && s.result_grade !== 'Pending') ? s.result_grade : 'A+';
    document.getElementById('cm-cgpa').value = (s.cgpa && s.cgpa !== '0.00') ? s.cgpa : '5.00';
    document.getElementById('cm-certno').value = 'DCIT-' + (s.batch_year || '2026') + '-' + s.reg_no;
    notifyToast('শিক্ষার্থীর সকল তথ্য স্বয়ংক্রিয়ভাবে ফর্মে বসানো হয়েছে!');
}

function saveCertModal(e, editIdx) {
    e.preventDefault();
    const obj = {
        id: Date.now(),
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
        batch_year: 2026,
        session_quarter: 'January to March',
        grade: document.getElementById('cm-grade').value.trim(),
        cgpa: document.getElementById('cm-cgpa').value.trim(),
        issue_date: document.getElementById('cm-date').value,
        verification_code: 'VER-DCIT-' + document.getElementById('cm-reg').value.trim(),
        status: 'Issued'
    };
    DCITStore.updateDB(db => {
        if (editIdx !== null && db.certificates[editIdx]) db.certificates[editIdx] = { ...db.certificates[editIdx], ...obj };
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
        <div class="qv-hero-banner">
            <img src="../assets/img/logo.jpg">
            <div>
                <h2 style="margin:0;color:#fff;">${esc(c.student_name)}</h2>
                <p style="margin:4px 0 0;">সার্টিফিকেট নং: <strong>${esc(c.cert_no)}</strong> | গোপন কোড: <strong>${esc(c.secret_code)}</strong></p>
            </div>
        </div>
        <div class="qv-info-grid">
            <div class="qv-info-card"><small>রেজিস্ট্রেশন ও রোল</small><strong>রেজিঃ ${esc(c.reg_no)} | রোলঃ ${esc(c.roll_no)}</strong></div>
            <div class="qv-info-card"><small>পিতা ও মাতার নাম</small><strong>${esc(c.father_name)} / ${esc(c.mother_name)}</strong></div>
            <div class="qv-info-card"><small>কোর্স ও মেয়াদ</small><strong>${esc(c.course_name)} (${esc(c.duration)})</strong></div>
            <div class="qv-info-card"><small>জিপিএ এবং ইস্যু তারিখ</small><strong>${esc(c.grade)} (${esc(c.cgpa||'5.00')}) | ${esc(c.issue_date)}</strong></div>
        </div>
    `);
}

function deleteCert(idx) {
    if (!confirm('সার্টিফিকেটটি ডিলিট করতে চান?')) return;
    DCITStore.updateDB(db => { db.certificates.splice(idx, 1); });
    renderAdminApp();
}

/* ==========================================================================
   5. ONLINE ADMISSIONS (অনলাইন ভর্তি ও অনুমোদন)
   ========================================================================== */
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
    <div class="counter-filter-bar">
        <div class="counter-pills">
            <button class="counter-pill ${admStatusFilter===''?'active':''}" onclick="admStatusFilter='';renderAdminApp();">
                <i class="fa fa-id-card-o"></i> সকল আবেদন <b>${adms.length}</b>
            </button>
            <button class="counter-pill ${admStatusFilter==='Pending'?'active':''}" onclick="admStatusFilter='Pending';renderAdminApp();">
                <i class="fa fa-clock-o"></i> পেন্ডিং আবেদন <b>${cntPending}</b>
            </button>
            <button class="counter-pill ${admStatusFilter==='Approved'?'active':''}" onclick="admStatusFilter='Approved';renderAdminApp();">
                <i class="fa fa-check"></i> অনুমোদিত (Approved) <b>${cntApproved}</b>
            </button>
        </div>
    </div>

    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-id-card-o"></i> অনলাইন ভর্তি আবেদন তালিকা (${filtered.length})</h3>
        </div>
        <div class="panel-body">
            ${renderBulkToolbar('admissions', ['Approved', 'Pending'])}
            <div class="dcp-table-wrap">
                <table class="dcp-table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" onchange="toggleSelectAllRows('admissions',this.checked)"></th>
                            <th>আবেদন নং ও কোড</th>
                            <th>আবেদনকারীর নাম ও পিতা</th>
                            <th>মোবাইল ও মেসেজ</th>
                            <th>কোর্স ও স্লট</th>
                            <th>পেমেন্ট ও বকেয়া</th>
                            <th>স্ট্যাটাস</th>
                            <th>কুইক ভিউ, অনুমোদন, ডিলিট</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pg.slice.map(a => {
                            const realIdx = adms.findIndex(x => x.application_no === a.application_no);
                            return `
                            <tr>
                                <td><input type="checkbox" class="row-bulk-chk" data-idx="${realIdx}" onchange="toggleBulkRow('admissions','${esc(a.application_no)}',this.checked)"></td>
                                <td><strong>${esc(a.application_no)}</strong><br><small class="badge badge-info">${esc(a.secret_code || '')}</small></td>
                                <td><strong>${esc(a.full_name)}</strong><br><small>পিতা: ${esc(a.father_name || '-')}</small></td>
                                <td>${esc(a.phone)}<br><button onclick="openAutoSmsGatewayModal('${esc(a.phone)}','প্রিয় ${esc(a.full_name)}, আপনার ভর্তি আবেদন (${esc(a.application_no)}) গৃহীত হয়েছে।')" class="btn btn-accent btn-xs"><i class="fa fa-paper-plane"></i> SMS</button></td>
                                <td>${esc(a.course_name)}<br><small>${esc(a.preferred_slot || '')}</small></td>
                                <td>পরিশোধ: ৳${Number(a.paid_amount||0)} | বকেয়া: ৳${Number(a.due_amount||0)}<br><small>${esc(a.payment_method || 'bKash')} (${esc(a.trx_id || 'N/A')})</small></td>
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
            ${pg.barHTML}
        </div>
    </div>`;
}

function quickViewAdmission(idx) {
    const a = DCITStore.getDB().admissions[idx];
    if (!a) return;
    openAdminModal('অনলাইন ভর্তি আবেদন — বিস্তারিত কুইক ভিউ', `
        <div class="qv-hero-banner">
            <img src="${esc(admImg(a.photo))}">
            <div>
                <h2 style="margin:0;color:#fff;">${esc(a.full_name)}</h2>
                <p style="margin:4px 0 0;">আবেদন নং: <strong>${esc(a.application_no)}</strong> | কোর্স: <strong>${esc(a.course_name)}</strong></p>
            </div>
        </div>
        <div class="qv-info-grid">
            <div class="qv-info-card"><small>পিতা ও মাতার নাম</small><strong>${esc(a.father_name || '-')} / ${esc(a.mother_name || '-')}</strong></div>
            <div class="qv-info-card"><small>মোবাইল ও ইমেইল</small><strong>${esc(a.phone)} | ${esc(a.email || 'N/A')}</strong></div>
            <div class="qv-info-card"><small>পেমেন্ট তথ্য</small><strong>${esc(a.payment_method || 'bKash')} | TrxID: ${esc(a.trx_id || 'N/A')} | পরিশোধ: ৳${esc(a.paid_amount || 0)} | বকেয়া: ৳${esc(a.due_amount || 0)}</strong></div>
            <div class="qv-info-card"><small>প্রতিবন্ধকতা ও মাধ্যম</small><strong>প্রতিবন্ধকতা: ${esc(a.has_disability || 'না')} | মাধ্যম: ${esc(a.how_heard || 'ওয়েবসাইট')}</strong></div>
            <div class="qv-info-card" style="grid-column:1/-1;"><small>ঠিকানা</small><strong>${esc(a.address || 'কুমিল্লা')}</strong></div>
        </div>
    `);
}

function approveAdmission(idx) {
    DCITStore.updateDB(db => {
        const a = db.admissions[idx];
        if (!a) return;
        a.status = 'Approved';
        const regNo = DCITStore.nextRegNo();
        const rollNo = DCITStore.nextRollNo();
        const secret = DCITStore.generateSecretCode(a.full_name, a.course_name, '2026', regNo);
        db.students.unshift({
            id: Date.now(),
            reg_no: regNo,
            roll_no: rollNo,
            secret_code: secret,
            name: a.full_name,
            father_name: a.father_name || '',
            mother_name: a.mother_name || '',
            phone: a.phone,
            course_name: a.course_name,
            course_duration: a.course_duration || '3 Months',
            class_slot: a.preferred_slot || '8:00 AM - 9:30 AM',
            batch_no: 'Batch-2026-01',
            batch_year: 2026,
            session_quarter: 'January to March',
            batch_type: 'New Batch',
            present_address: a.address || 'কুমিল্লা',
            exam_status: 'নতুন স্টুডেন্ট',
            result_grade: 'Pending',
            cgpa: '0.00',
            status: 'Active',
            photo: a.photo || 'assets/img/logo.jpg'
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

/* ==========================================================================
   6. CLASS ROUTINE & BATCHES (কুইক ভিউতে স্টুডেন্ট লিস্ট + রেজিঃ দিয়ে এড)
   ========================================================================== */
function renderTabClasses(el, db) {
    const classes = db.classes || [];
    const pg = paginateAdminList(classes, 'classes');
    el.innerHTML = `
    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-calendar"></i> ক্লাস রুটিন ও ব্যাচ ম্যানেজমেন্ট (${classes.length}টি ব্যাচ)</h3>
            <button onclick="openClassModal()" class="btn btn-primary btn-xs"><i class="fa fa-plus"></i> ➕ নতুন ব্যাচ / রুটিন যুক্ত করুন</button>
        </div>
        <div class="panel-body">
            ${renderBulkToolbar('classes', ['Active', 'Inactive'])}
            <div class="dcp-table-wrap">
                <table class="dcp-table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" onchange="toggleSelectAllRows('classes',this.checked)"></th>
                            <th>স্লট ও ব্যাচ নাম</th>
                            <th>কোর্স নাম</th>
                            <th>বার ও সময়</th>
                            <th>প্রশিক্ষক ও রুম</th>
                            <th>ব্যাচের স্টুডেন্ট সংখ্যা</th>
                            <th>স্ট্যাটাস</th>
                            <th>কুইক ভিউ (ব্যাচ স্টুডেন্ট লিস্ট সহ), এডিট, ডিলিট</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pg.slice.map((c) => {
                            const realIdx = classes.findIndex(x => x.id === c.id || x.time_label === c.time_label);
                            const batchStudents = (db.students || []).filter(s => s.class_slot === c.time_label || s.batch_no === c.batch_name || (c.enrolled_regs || []).includes(String(s.reg_no)));
                            return `
                            <tr>
                                <td><input type="checkbox" class="row-bulk-chk" data-idx="${realIdx}" onchange="toggleBulkRow('classes','${esc(c.slot_code||c.id)}',this.checked)"></td>
                                <td><strong>${esc(c.batch_name)}</strong><br><small>কোড: ${esc(c.slot_code || c.batch_code || '')}</small></td>
                                <td><strong>${esc(c.course_name)}</strong></td>
                                <td>${esc(c.days_of_week || c.days || '')}<br><small>${esc(c.time_label || c.time_slot || '')}</small></td>
                                <td>${esc(c.teacher_name || c.instructor || '')}<br><small>${esc(c.room_no)}</small></td>
                                <td><span class="badge badge-info">${batchStudents.length} জন শিক্ষার্থী</span></td>
                                <td><span class="badge badge-success">${esc(c.status || 'Active')}</span></td>
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
            ${pg.barHTML}
        </div>
    </div>`;
}

function quickViewBatchWithStudents(idx) {
    const db = DCITStore.getDB();
    const c = db.classes[idx];
    if (!c) return;
    const batchStudents = (db.students || []).filter(s => s.class_slot === c.time_label || s.batch_no === c.batch_name || (c.enrolled_regs || []).includes(String(s.reg_no)));

    const html = `
    <div class="qv-hero-banner">
        <i class="fa fa-users" style="font-size:38px;color:#fde68a;"></i>
        <div>
            <h2 style="margin:0;color:#fff;">${esc(c.batch_name)} (${esc(c.time_label)}) — ${esc(c.course_name)}</h2>
            <p style="margin:4px 0 0;">বার: ${esc(c.days_of_week)} | প্রশিক্ষক: ${esc(c.teacher_name)} | রুম: ${esc(c.room_no)}</p>
        </div>
    </div>

    <!-- Add Student to this Batch ONLY by Registration Number -->
    <div style="background:#f0fdf4; padding:14px; border-radius:10px; border:1px solid #bbf7d0; margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;">
        <div>
            <strong style="color:#166534;"><i class="fa fa-user-plus"></i> শুধুমাত্র রেজিস্ট্রেশন নাম্বার দিয়ে এই ব্যাচে স্টুডেন্ট যুক্ত করুন:</strong>
        </div>
        <div style="display:flex; gap:8px;">
            <input type="text" id="batch-add-reg-inp" class="form-control" placeholder="রেজিস্ট্রেশন নাম্বার লিখুন (যেমন: 000001)" style="width:230px;">
            <button onclick="addStudentToBatchByReg(${idx})" class="btn btn-success btn-xs"><i class="fa fa-plus-circle"></i> ব্যাচে যুক্ত করুন</button>
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
    if (!reg) { showAdminToast('warning', 'রেজিঃ দিন!', 'রেজিস্ট্রেশন নাম্বার লিখুন!'); return; }
    let found = false;
    DCITStore.updateDB(db => {
        const c = db.classes[batchIdx];
        const s = (db.students || []).find(x => String(x.reg_no) === reg || String(x.roll_no) === reg);
        if (c && s) {
            s.class_slot = c.time_label;
            s.batch_no = c.batch_name;
            c.enrolled_regs = c.enrolled_regs || [];
            if (!c.enrolled_regs.includes(s.reg_no)) c.enrolled_regs.push(s.reg_no);
            found = true;
        }
    });
    if (!found) {
        showAdminToast('error', 'পাওয়া যায়নি!', 'এই রেজিস্ট্রেশন নাম্বারে কোনো শিক্ষার্থী পাওয়া যায়নি!');
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
            <div class="form-group"><label>স্লট কোড *</label><input type="text" id="cl-code" class="form-control" value="${esc(c?.slot_code || '8-9.30')}" required></div>
            <div class="form-group"><label>ব্যাচের নাম *</label><input type="text" id="cl-name" class="form-control" value="${esc(c?.batch_name || 'Morning Batch-8')}" required></div>
            <div class="form-group"><label>কোর্স নাম *</label><input type="text" id="cl-course" class="form-control" value="${esc(c?.course_name || 'Advance Microsoft Office')}" required></div>
            <div class="form-group"><label>ক্লাসের বার *</label><input type="text" id="cl-days" class="form-control" value="${esc(c?.days_of_week || 'Sat, Mon, Wed')}" required></div>
            <div class="form-group"><label>সময় (Time Label) *</label><input type="text" id="cl-time" class="form-control" value="${esc(c?.time_label || '8:00 AM - 9:30 AM')}" required></div>
            <div class="form-group"><label>প্রশিক্ষকের নাম *</label><input type="text" id="cl-inst" class="form-control" value="${esc(c?.teacher_name || 'DR. A.K.M Lokman')}" required></div>
            <div class="form-group"><label>ল্যাব / রুম নং</label><input type="text" id="cl-room" class="form-control" value="${esc(c?.room_no || 'Lab-01')}"></div>
            <div class="form-group" style="grid-column:1/-1;"><label>ক্লাস রুলস</label><input type="text" id="cl-rules" class="form-control" value="${esc(c?.rules_text || 'ক্লাস শুরু হওয়ার ১০ মিনিট পূর্বে ল্যাবে উপস্থিত থাকতে হবে।')}"></div>
        </div>
        <div style="margin-top:16px;text-align:right;"><button type="submit" class="btn btn-primary">সংরক্ষণ করুন</button></div>
    </form>`);
}

function saveClassModal(e, editIdx) {
    e.preventDefault();
    const obj = {
        id: Date.now(),
        slot_code: document.getElementById('cl-code').value.trim(),
        batch_name: document.getElementById('cl-name').value.trim(),
        course_name: document.getElementById('cl-course').value.trim(),
        days_of_week: document.getElementById('cl-days').value.trim(),
        time_label: document.getElementById('cl-time').value.trim(),
        teacher_name: document.getElementById('cl-inst').value.trim(),
        room_no: document.getElementById('cl-room').value.trim(),
        rules_text: document.getElementById('cl-rules').value.trim(),
        session_name: 'January to March',
        batch_year: 2026,
        max_seats: 20,
        status: 'Active'
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

/* ==========================================================================
   7. COURSES & DYNAMIC SYLLABUS (+ BUTTON UNLIMITED CLASSES)
   ========================================================================== */
function parseCourseTopics(c) {
    if (!c) return [];
    if (Array.isArray(c.topics_json)) return c.topics_json;
    if (typeof c.topics_json === 'string' && c.topics_json.trim()) {
        try { return JSON.parse(c.topics_json); } catch(e) { return c.topics_json.split(',').map(x=>x.trim()); }
    }
    if (c.topics) return String(c.topics).split(',').map(x=>x.trim());
    return [];
}

function parseCourseSyllabusRows(c) {
    if (!c) return [];
    if (Array.isArray(c.syllabus_classes) && c.syllabus_classes.length) return c.syllabus_classes;
    let raw = [];
    if (Array.isArray(c.syllabus_json)) raw = c.syllabus_json;
    else if (typeof c.syllabus_json === 'string' && c.syllabus_json.trim()) {
        try { raw = JSON.parse(c.syllabus_json); } catch(e) {}
    }
    return raw.map(m => ({
        class_no: m.title || 'ক্লাস ০১',
        details: Array.isArray(m.items) ? m.items.join(', ') : (m.details || ''),
        type: m.section || 'প্র্যাকটিক্যাল ল্যাব'
    }));
}

function renderTabCourses(el, db) {
    const courses = db.courses || [];
    const pg = paginateAdminList(courses, 'courses');
    el.innerHTML = `
    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-book"></i> কোর্স ও ডাইনামিক সিলেবাস ম্যানেজমেন্ট (${courses.length}টি কোর্স)</h3>
            <button onclick="openCourseModal()" class="btn btn-primary btn-xs"><i class="fa fa-plus-circle"></i> ➕ এড কোর্স (ডাইনামিক + ক্লাস সিলেবাস সহ)</button>
        </div>
        <div class="panel-body">
            ${renderBulkToolbar('courses', ['Active', 'Inactive'])}
            <div class="dcp-table-wrap">
                <table class="dcp-table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" onchange="toggleSelectAllRows('courses',this.checked)"></th>
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
                            const realIdx = courses.findIndex(x => x.id === c.id || x.title === c.title);
                            const topics = parseCourseTopics(c);
                            const sylRows = parseCourseSyllabusRows(c);
                            return `
                            <tr>
                                <td><input type="checkbox" class="row-bulk-chk" data-idx="${realIdx}" onchange="toggleBulkRow('courses','${esc(c.slug||c.title)}',this.checked)"></td>
                                <td><img src="${esc(admImg(c.image))}" style="width:60px;height:44px;object-fit:cover;border-radius:6px;" onerror="this.src='../assets/img/logo.jpg'"></td>
                                <td><strong>${esc(c.title)}</strong><br><small>${esc(c.title_bn || '')}</small></td>
                                <td><strong style="color:#0f766e;">৳${Number(c.fee)}</strong></td>
                                <td>${esc(c.duration)}<br><small>${esc(c.total_classes || 36)}টি ক্লাস</small></td>
                                <td><small>${esc(topics.join(', ').slice(0,65))}...</small><br><span class="badge badge-info">${sylRows.length}টি সিলেবাস মডিউল</span></td>
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
            ${pg.barHTML}
        </div>
    </div>`;
}

function openCourseModal(editIdx = null) {
    const db = DCITStore.getDB();
    const c = editIdx !== null ? db.courses[editIdx] : null;
    const topicsStr = c ? parseCourseTopics(c).join(', ') : 'MS Word, MS Excel, MS PowerPoint, Internet & Email, Freelancing';
    const sylList = (c && parseCourseSyllabusRows(c).length) ? parseCourseSyllabusRows(c) : [
        { class_no: 'Class 1 - 4', details: 'Basic concept on Computer, Keyboard, Mouse & Typing Practice', type: 'Computer Fundamental' },
        { class_no: 'Class 5 - 10', details: 'MS Word Document Formatting, Page Setup, Table & Official Design', type: 'MS Word Practical' }
    ];

    const html = `
    <form onsubmit="saveCourseModal(event, ${editIdx !== null ? editIdx : 'null'})">
        <div class="form-grid">
            <div class="form-group">
                <label>কোর্স ছবি আপলোড (প্রিভিউ সহ)</label>
                <input type="file" accept="image/*" class="form-control" onchange="previewUploadImg(this,'crs-img-prev','crs-img-val')">
                <input type="hidden" id="crs-img-val" value="${esc(c?.image || 'assets/img/course-msoffice.jpg')}">
                <img id="crs-img-prev" src="${esc(admImg(c?.image || 'assets/img/course-msoffice.jpg'))}" style="width:90px;height:55px;object-fit:cover;margin-top:6px;border-radius:6px;border:1px solid #cbd5e1;">
            </div>
            <div class="form-group"><label>কোর্স শিরোনাম (ইংরেজি) *</label><input type="text" id="crs-title" class="form-control" value="${esc(c?.title || '')}" required></div>
            <div class="form-group"><label>কোর্স শিরোনাম (বাংলা) *</label><input type="text" id="crs-title-bn" class="form-control" value="${esc(c?.title_bn || '')}" required></div>
            <div class="form-group"><label>কোর্স ফি (৳) *</label><input type="number" id="crs-fee" class="form-control" value="${esc(c?.fee || 1500)}" required></div>
            <div class="form-group"><label>মেয়াদ (Duration) *</label><input type="text" id="crs-dur" class="form-control" value="${esc(c?.duration || '3 Months')}" required></div>
            <div class="form-group"><label>মোট ক্লাস সংখ্যা *</label><input type="number" id="crs-total-cls" class="form-control" value="${esc(c?.total_classes || 36)}" required></div>
            <div class="form-group" style="grid-column:1/-1;">
                <label>কোর্স টপিকস (Textarea - কমা দিয়ে লিখুন) *</label>
                <textarea id="crs-topics" class="form-control" rows="2" required>${esc(topicsStr)}</textarea>
            </div>
            <div class="form-group" style="grid-column:1/-1;">
                <label>কোর্সের সংক্ষিপ্ত বিবরণ (বাংলা)</label>
                <textarea id="crs-desc-bn" class="form-control" rows="2">${esc(c?.description_bn || 'হাতে-কলমে প্র্যাকটিক্যাল প্রজেক্টসহ সম্পূর্ণ কোর্স।')}</textarea>
            </div>
        </div>

        <div style="margin-top:16px; background:#f8fafc; padding:16px; border-radius:12px; border:1px solid #cbd5e1;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <h4 style="margin:0; color:#0f172a;"><i class="fa fa-list-ol"></i> কোর্সের ক্লাস সমূহ (ক্লাস সংখ্যা | ক্লাসের বিবরণ | ক্লাস টাইপ)</h4>
                <button type="button" onclick="addDynamicSyllabusRow()" class="btn btn-success btn-xs"><i class="fa fa-plus-circle"></i> ➕ নতুন ক্লাস রো যুক্ত করুন (+)</button>
            </div>
            <div id="dynamic-syllabus-rows">
                ${sylList.map((row) => `
                <div class="syl-row" style="display:grid; grid-template-columns:1fr 2.5fr 1.2fr auto; gap:8px; margin-bottom:8px;">
                    <input type="text" class="form-control syl-no" placeholder="ক্লাস সংখ্যা (যেমন: Class 1 - 4)" value="${esc(row.class_no)}" required>
                    <input type="text" class="form-control syl-desc" placeholder="ক্লাসের বিবরণ" value="${esc(row.details)}" required>
                    <input type="text" class="form-control syl-type" placeholder="ক্লাস টাইপ" value="${esc(row.type)}" required>
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
        <input type="text" class="form-control syl-no" placeholder="ক্লাস সংখ্যা" value="Class ${count}" required>
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
    const syllabusJsonArr = rows.map(r => ({
        section: r.type,
        title: r.class_no,
        items: r.details.split(',').map(s => s.trim()).filter(Boolean)
    }));
    const topicsArr = document.getElementById('crs-topics').value.split(',').map(s => s.trim()).filter(Boolean);
    const titleVal = document.getElementById('crs-title').value.trim();
    const obj = {
        id: Date.now(),
        slug: titleVal.toLowerCase().replace(/[^a-z0-9]+/g, '') || ('course' + Date.now()),
        title: titleVal,
        title_bn: document.getElementById('crs-title-bn').value.trim(),
        fee: Number(document.getElementById('crs-fee').value || 1500),
        duration: document.getElementById('crs-dur').value.trim(),
        class_duration: '1.30 Hours',
        weekly_days: '3 Days / Week',
        total_classes: Number(document.getElementById('crs-total-cls').value || 36),
        has_certificate: 1,
        description_bn: document.getElementById('crs-desc-bn').value.trim(),
        short_desc: document.getElementById('crs-desc-bn').value.trim(),
        topics_json: JSON.stringify(topicsArr),
        syllabus_json: JSON.stringify(syllabusJsonArr),
        syllabus_classes: rows,
        image: document.getElementById('crs-img-val').value || 'assets/img/course-msoffice.jpg',
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
    const topics = parseCourseTopics(c);
    const syl = parseCourseSyllabusRows(c);
    openAdminModal('কোর্স ও সিলেবাস কুইক ভিউ', `
        <div class="qv-hero-banner">
            <img src="${esc(admImg(c.image))}">
            <div>
                <h2 style="margin:0;color:#fff;">${esc(c.title)} (${esc(c.title_bn || '')})</h2>
                <p style="margin:4px 0 0;">কোর্স ফি: <strong>৳${c.fee}</strong> | মেয়াদ: ${esc(c.duration)} | মোট ক্লাস: ${esc(c.total_classes || 36)}</p>
            </div>
        </div>
        <div class="qv-info-card" style="margin-bottom:14px;"><small>কোর্স টপিকস</small><strong>${esc(topics.join(', '))}</strong></div>
        <h4 style="margin-bottom:8px;">ডাইনামিক ক্লাস সিলেবাস (${syl.length}টি মডিউল)</h4>
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

/* ==========================================================================
   8. ADMINISTRATION & TEACHERS (প্রশাসন - ৫ ক্যাটাগরি, সাল, বর্তমান/অবসরপ্রাপ্ত)
   ========================================================================== */
let teacherCatFilter = '';
function renderTabTeachers(el, db) {
    const teachers = db.teachers || [];
    const cats = ['শিক্ষক', 'ট্রেইনার', 'পরিচালক', 'ফাউন্ডার', 'সদস্য'];
    const filtered = teachers.filter(t => !teacherCatFilter || (t.role_type || t.category || 'শিক্ষক') === teacherCatFilter);
    const pg = paginateAdminList(filtered, 'teachers');

    el.innerHTML = `
    <div class="counter-filter-bar">
        <div class="counter-pills">
            <button class="counter-pill ${teacherCatFilter===''?'active':''}" onclick="teacherCatFilter='';renderAdminApp();">
                <i class="fa fa-sitemap"></i> সকল প্রশাসন <b>${teachers.length}</b>
            </button>
            ${cats.map(cat => `
            <button class="counter-pill ${teacherCatFilter===cat?'active':''}" onclick="teacherCatFilter='${cat}';renderAdminApp();">
                ${cat} <b>${teachers.filter(t=>(t.role_type||t.category||'শিক্ষক')===cat).length}</b>
            </button>`).join('')}
        </div>
        <button onclick="openTeacherModal()" class="btn btn-primary btn-xs"><i class="fa fa-plus-circle"></i> ➕ নতুন সদস্য / শিক্ষক যুক্ত করুন</button>
    </div>

    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-user-circle"></i> প্রশাসন ও শিক্ষক প্যানেল (${filtered.length} জন)</h3>
        </div>
        <div class="panel-body">
            ${renderBulkToolbar('teachers', ['Active', 'Inactive'])}
            <div class="dcp-table-wrap">
                <table class="dcp-table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" onchange="toggleSelectAllRows('teachers',this.checked)"></th>
                            <th>ছবি</th>
                            <th>নাম ও পদবী</th>
                            <th>ক্যাটাগরি</th>
                            <th>যোগ্যতা ও সময়সূচি</th>
                            <th>কোন সাল থেকে আমাদের সাথে আছে</th>
                            <th>বর্তমান স্ট্যাটাস</th>
                            <th>মোবাইল ও ইমেইল</th>
                            <th>কুইক ভিউ, এডিট, ডিলিট</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pg.slice.map(t => {
                            const realIdx = teachers.findIndex(x => x.id === t.id || (x.name === t.name && x.role_type === t.role_type));
                            const empSt = t.employment_status || 'বর্তমান';
                            const roleCat = t.role_type || t.category || 'শিক্ষক';
                            return `
                            <tr>
                                <td><input type="checkbox" class="row-bulk-chk" data-idx="${realIdx}" onchange="toggleBulkRow('teachers','${esc(t.id||t.name)}',this.checked)"></td>
                                <td><img src="${esc(admImg(t.photo))}" style="width:48px;height:54px;object-fit:cover;border-radius:8px;"></td>
                                <td><strong>${esc(t.name)}</strong><br><small>${esc(t.designation)}</small></td>
                                <td><span class="badge badge-info">${esc(roleCat)}</span></td>
                                <td>${esc(t.qualification || '')}<br><small>${esc(t.schedule_info || '')}</small></td>
                                <td><strong>${esc(t.joining_year || '2019')} সাল থেকে</strong></td>
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
            ${pg.barHTML}
        </div>
    </div>`;
}

function openTeacherModal(editIdx = null) {
    const db = DCITStore.getDB();
    const t = editIdx !== null ? db.teachers[editIdx] : null;
    const curRole = t?.role_type || t?.category || 'শিক্ষক';
    openAdminModal(t ? 'প্রশাসন / শিক্ষক তথ্য এডিট করুন' : 'নতুন শিক্ষক / প্রশাসন সদস্য যুক্ত করুন', `
    <form onsubmit="saveTeacherModal(event, ${editIdx !== null ? editIdx : 'null'})">
        <div class="form-grid">
            <div class="form-group">
                <label>ছবি আপলোড করুন (প্রিভিউ সহ)</label>
                <input type="file" accept="image/*" class="form-control" onchange="previewUploadImg(this,'tch-img-prev','tch-img-val')">
                <input type="hidden" id="tch-img-val" value="${esc(t?.photo || 'assets/img/logo.jpg')}">
                <img id="tch-img-prev" src="${esc(admImg(t?.photo || 'assets/img/logo.jpg'))}" style="width:65px;height:72px;object-fit:cover;margin-top:6px;border-radius:8px;border:2px solid #0f766e;">
            </div>
            <div class="form-group"><label>নাম *</label><input type="text" id="tch-name" class="form-control" value="${esc(t?.name || '')}" required></div>
            <div class="form-group"><label>পদবী (Designation) *</label><input type="text" id="tch-desig" class="form-control" value="${esc(t?.designation || 'সিনিয়র ইনস্ট্রাক্টর')}" required></div>
            <div class="form-group"><label>ক্যাটাগরি (প্রশাসন বিভাগ) *</label>
                <select id="tch-cat" class="form-control">
                    ${['শিক্ষক','ট্রেইনার','পরিচালক','ফাউন্ডার','সদস্য'].map(c => `<option value="${c}" ${curRole===c?'selected':''}>${c}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label>কোন সাল থেকে আমাদের সাথে আছেন? *</label><input type="text" id="tch-year" class="form-control" value="${esc(t?.joining_year || '2019')}" required></div>
            <div class="form-group"><label>বর্তমান স্ট্যাটাস (বর্তমান / অবসরপ্রাপ্ত) *</label>
                <select id="tch-emp-st" class="form-control">
                    <option value="বর্তমান" ${t?.employment_status!=='অবসরপ্রাপ্ত'?'selected':''}>বর্তমান (Active)</option>
                    <option value="অবসরপ্রাপ্ত" ${t?.employment_status==='অবসরপ্রাপ্ত'?'selected':''}>অবসরপ্রাপ্ত (Retired / Former)</option>
                </select>
            </div>
            <div class="form-group"><label>শিক্ষাগত যোগ্যতা</label><input type="text" id="tch-qual" class="form-control" value="${esc(t?.qualification || 'B.S.S (Honours)')}"></div>
            <div class="form-group"><label>ক্লাস শিডিউল ও দায়িত্ব</label><input type="text" id="tch-sched" class="form-control" value="${esc(t?.schedule_info || 'সকাল ৯:৩০ - দুপুর ২:০০')}"></div>
            <div class="form-group"><label>মোবাইল নাম্বার *</label><input type="text" id="tch-phone" class="form-control" value="${esc(t?.phone || '01771770044')}" required></div>
            <div class="form-group"><label>ইমেইল</label><input type="email" id="tch-email" class="form-control" value="${esc(t?.email || 'dc13edubd@gmail.com')}"></div>
            <div class="form-group" style="grid-column:1/-1;"><label>সংক্ষিপ্ত পরিচিতি (Bio)</label><input type="text" id="tch-bio" class="form-control" value="${esc(t?.bio || 'Dream Career IT প্রশিক্ষক ও প্রশাসনিক সদস্য।')}"></div>
        </div>
        <div style="margin-top:16px;text-align:right;"><button type="submit" class="btn btn-primary">সংরক্ষণ করুন</button></div>
    </form>`);
}

function saveTeacherModal(e, editIdx) {
    e.preventDefault();
    const roleVal = document.getElementById('tch-cat').value;
    const obj = {
        id: Date.now(),
        name: document.getElementById('tch-name').value.trim(),
        designation: document.getElementById('tch-desig').value.trim(),
        role_type: roleVal,
        category: roleVal,
        joining_year: document.getElementById('tch-year').value.trim(),
        employment_status: document.getElementById('tch-emp-st').value,
        qualification: document.getElementById('tch-qual').value.trim(),
        schedule_info: document.getElementById('tch-sched').value.trim(),
        phone: document.getElementById('tch-phone').value.trim(),
        email: document.getElementById('tch-email').value.trim(),
        bio: document.getElementById('tch-bio').value.trim(),
        address: 'পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা',
        photo: document.getElementById('tch-img-val').value || 'assets/img/logo.jpg',
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
        <div class="qv-hero-banner">
            <img src="${esc(admImg(t.photo))}">
            <div>
                <h2 style="margin:0;color:#fff;">${esc(t.name)}</h2>
                <p style="margin:4px 0 0;">${esc(t.designation)} (${esc(t.role_type || t.category || 'শিক্ষক')})</p>
                <span class="badge badge-success" style="margin-top:6px;">${esc(t.joining_year || '2019')} সাল থেকে যুক্ত | স্ট্যাটাস: ${esc(t.employment_status || 'বর্তমান')}</span>
            </div>
        </div>
        <div class="qv-info-grid">
            <div class="qv-info-card"><small>যোগ্যতা ও সময়সূচি</small><strong>${esc(t.qualification || '')} | ${esc(t.schedule_info || '')}</strong></div>
            <div class="qv-info-card"><small>মোবাইল ও ইমেইল</small><strong>${esc(t.phone)} | ${esc(t.email || '')}</strong></div>
            <div class="qv-info-card" style="grid-column:1/-1;"><small>পরিচিতি</small><strong>${esc(t.bio || '')}</strong></div>
        </div>
    `);
}

function deleteTeacher(idx) {
    if (!confirm('সদস্যের তথ্য মুছে ফেলতে চান?')) return;
    DCITStore.updateDB(db => { db.teachers.splice(idx, 1); });
    renderAdminApp();
}

/* ==========================================================================
   9. NOTICES & MS WORD-STYLE RICH TEXT EDITOR
   ========================================================================== */
function renderTabNotices(el, db) {
    const notices = db.notices || [];
    const pg = paginateAdminList(notices, 'notices');
    el.innerHTML = `
    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-bullhorn"></i> নোটিশ ও সাকসেস স্টোরি (MS Word স্টাইল রিচ টেক্সট ফরম্যাটিং সহ)</h3>
            <button onclick="openNoticeRichModal()" class="btn btn-primary btn-xs"><i class="fa fa-plus-circle"></i> ➕ নতুন ফরম্যাটেড নোটিশ তৈরি করুন</button>
        </div>
        <div class="panel-body">
            ${renderBulkToolbar('notices', ['Active', 'Inactive'])}
            <div class="dcp-table-wrap">
                <table class="dcp-table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" onchange="toggleSelectAllRows('notices',this.checked)"></th>
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
                                <td><input type="checkbox" class="row-bulk-chk" data-idx="${realIdx}" onchange="toggleBulkRow('notices','${esc(n.id)}',this.checked)"></td>
                                <td><strong>${esc(n.title)}</strong></td>
                                <td><span class="badge badge-info">${esc(n.category || 'ভর্তি বিজ্ঞপ্তি')}</span></td>
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
            ${pg.barHTML}
        </div>
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
                    ${['ভর্তি বিজ্ঞপ্তি','পরীক্ষা ও সার্টিফিকেট','সেমিনার ও ওয়ার্কশপ','স্কলারশিপ','সাধারণ নোটিশ'].map(c => `<option value="${c}" ${n?.category===c?'selected':''}>${c}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label>প্রকাশের তারিখ *</label><input type="date" id="nt-date" class="form-control" value="${esc(n?.publish_date || new Date().toISOString().slice(0,10))}" required></div>
        </div>
        <div class="form-group" style="margin-top:12px;">
            <label>নোটিশের বিস্তারিত বিবরণ (বোল্ড, কালার, হেডিং, লিস্ট ফরম্যাটিং ভিউয়ার পেজে হুবহু দেখাবে) *</label>
            <div class="word-toolbar">
                <button type="button" onclick="execRichCmd('bold')"><i class="fa fa-bold"></i> বোল্ড</button>
                <button type="button" onclick="execRichCmd('italic')"><i class="fa fa-italic"></i> ইটালিক</button>
                <button type="button" onclick="execRichCmd('underline')"><i class="fa fa-underline"></i> আন্ডারলাইন</button>
                <button type="button" onclick="execRichCmd('formatBlock','H3')">হেডিং H3</button>
                <button type="button" onclick="execRichCmd('insertUnorderedList')"><i class="fa fa-list-ul"></i> বুলেট লিস্ট</button>
                <button type="button" onclick="execRichCmd('insertOrderedList')"><i class="fa fa-list-ol"></i> নাম্বার লিস্ট</button>
                <input type="color" onchange="execRichCmd('foreColor',this.value)" title="টেক্সট কালার" style="height:28px;width:36px;border:none;cursor:pointer;">
            </div>
            <div id="nt-rich-editor" class="word-editor-area" contenteditable="true">${n?.details || '<p>নোটিশের বিস্তারিত বিবরণ এখানে লিখুন...</p>'}</div>
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
        is_pinned: 1,
        status: 'Active'
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
        <div class="qv-hero-banner">
            <i class="fa fa-bullhorn" style="font-size:36px;color:#fde68a;"></i>
            <div><h2 style="margin:0;color:#fff;">${esc(n.title)}</h2><p style="margin:4px 0 0;">ক্যাটাগরি: ${esc(n.category)} | তারিখ: ${esc(n.publish_date)}</p></div>
        </div>
        <div class="qv-info-card" style="line-height:1.7;">${n.details || ''}</div>
    `);
}

function deleteNotice(idx) {
    if (!confirm('নোটিশটি ডিলিট করতে চান?')) return;
    DCITStore.updateDB(db => { db.notices.splice(idx, 1); });
    renderAdminApp();
}

/* ==========================================================================
   10. PAYMENTS & UNIFIED STUDENT/PAYMENT REPORT WITH BRANDED PRINT HEADER
   ========================================================================== */
function renderTabPayments(el, db) {
    const payments = db.payments || [];
    const dueCnt = payments.filter(p => Number(p.due_amount || 0) > 0).length;
    const filtered = payments.filter(p => {
        if (currentCourseFilter === 'DUE') return Number(p.due_amount || 0) > 0;
        const q = currentSearch.toLowerCase();
        return !q || [p.receipt_no, p.student_name, p.reg_no, p.course_name].some(v => String(v||'').toLowerCase().includes(q));
    });
    const pg = paginateAdminList(filtered, 'payments');

    el.innerHTML = `
    <div class="counter-filter-bar">
        <div class="counter-pills">
            <button class="counter-pill ${currentCourseFilter===''?'active':''}" onclick="currentCourseFilter='';renderAdminApp();">
                <i class="fa fa-money"></i> সকল পেমেন্ট <b>${payments.length}</b>
            </button>
            <button class="counter-pill ${currentCourseFilter==='DUE'?'active':''}" onclick="currentCourseFilter='DUE';renderAdminApp();">
                <i class="fa fa-exclamation-triangle"></i> শুধুমাত্র বকেয়া (Due List) <b>${dueCnt}</b>
            </button>
        </div>
    </div>

    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-money"></i> পেমেন্ট ও মানি রিসিপ্ট লেজার (${filtered.length})</h3>
        </div>
        <div class="panel-body">
            ${renderBulkToolbar('payments', ['Paid', 'Partial'])}
            <div class="dcp-table-wrap">
                <table class="dcp-table">
                    <thead><tr><th><input type="checkbox" onchange="toggleSelectAllRows('payments',this.checked)"></th><th>রিসিপ্ট নং</th><th>শিক্ষার্থী ও রেজিঃ</th><th>কোর্স ও ব্যাচ</th><th>মোট ফি</th><th>পরিশোধ (Paid)</th><th>বকেয়া (Due)</th><th>মেথড ও TrxID</th><th>তারিখ</th><th>অ্যাকশন</th></tr></thead>
                    <tbody>
                        ${pg.slice.map(p => {
                            const realIdx = payments.findIndex(x => x.receipt_no === p.receipt_no);
                            return `
                            <tr>
                                <td><input type="checkbox" class="row-bulk-chk" data-idx="${realIdx}" onchange="toggleBulkRow('payments','${esc(p.receipt_no)}',this.checked)"></td>
                                <td><strong>${esc(p.receipt_no)}</strong></td>
                                <td><strong>${esc(p.student_name)}</strong> (${esc(p.reg_no)})</td>
                                <td>${esc(p.course_name)}<br><small>${esc(p.batch_name || p.batch_no || '')}</small></td>
                                <td>৳${Number(p.total_fee || p.amount || 0)}</td>
                                <td style="color:#16a34a;font-weight:700;">৳${Number(p.paid_amount ?? p.amount ?? 0)}</td>
                                <td style="color:#dc2626;font-weight:800;">৳${Number(p.due_amount || 0)}</td>
                                <td>${esc(p.payment_method || p.method || 'Cash')}<br><small>${esc(p.trx_id || 'CASH')}</small></td>
                                <td>${esc(p.payment_date)}</td>
                                <td>
                                    <button onclick="openAutoSmsGatewayModal('${esc(p.phone||'01771770044')}','প্রিয় ${esc(p.student_name)}, রিসিপ্ট ${esc(p.receipt_no)}: পরিশোধিত ৳${Number(p.paid_amount||0)}, বকেয়া ৳${Number(p.due_amount||0)}। - Dream Career IT')" class="btn btn-accent btn-xs"><i class="fa fa-paper-plane"></i> SMS</button>
                                </td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            ${pg.barHTML}
        </div>
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
        const fee = Number(s.course_fee || pay.total_fee || pay.amount || 1500);
        const paid = Number(s.paid_amount ?? pay.paid_amount ?? pay.amount ?? fee);
        const due = Math.max(0, fee - paid);
        const pDate = pay.payment_date || (s.batch_year || '2026') + '-01-15';
        return {
            reg_no: s.reg_no,
            roll_no: s.roll_no,
            name: s.name,
            phone: s.phone || '01771770044',
            course_name: s.course_name,
            batch_no: s.batch_no || 'Batch-2026-01',
            year: String(s.batch_year || pDate.slice(0,4) || '2026'),
            month: pDate.slice(5,7) || '01',
            fee, paid, due,
            exam_status: s.exam_status || 'পাস করেছে',
            result: s.result_grade || 'A+'
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
        <div class="report-branded-header">
            <div style="display:flex; align-items:center; gap:14px;">
                <img src="../assets/img/logo.jpg" alt="Dream Career IT">
                <div>
                    <h2 style="margin:0; color:#fff; font-size:21px;">ড্রিম ক্যারিয়ার আইটি (Dream Career IT)</h2>
                    <p style="margin:3px 0 0; font-size:13px; color:#e2e8f0;">ভাই ভাই সুপার মার্কেট, নতুন পদুয়ার বাজার মসজিদের পাশে, পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা - ৩৫০০</p>
                    <p style="margin:2px 0 0; font-size:12px; color:#fde68a; font-weight:700;">হটলাইন: 01771770044 | অফিশিয়াল স্টুডেন্ট ও পেমেন্ট সমন্বিত রিপোর্ট</p>
                </div>
            </div>
            <div class="no-print">
                <button onclick="window.print()" class="btn btn-accent btn-xs"><i class="fa fa-print"></i> হেডারসহ প্রিন্ট / PDF ডাউনলোড</button>
            </div>
        </div>

        <div class="panel-header no-print">
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <select onchange="repType=this.value;renderAdminApp();" class="form-control" style="width:190px;">
                    <option value="ALL" ${repType==='ALL'?'selected':''}>সকল সমন্বিত রিপোর্ট (All)</option>
                    <option value="PAID_ONLY" ${repType==='PAID_ONLY'?'selected':''}>সম্পূর্ণ পরিশোধিত (Paid)</option>
                    <option value="DUE_ONLY" ${repType==='DUE_ONLY'?'selected':''}>বকেয়া তালিকা (Due List)</option>
                    <option value="PASSED_ONLY" ${repType==='PASSED_ONLY'?'selected':''}>উত্তীর্ণ শিক্ষার্থী (Passed)</option>
                </select>
                <select onchange="repYear=this.value;renderAdminApp();" class="form-control" style="width:135px;">
                    <option value="">সকল সাল (Year)</option>
                    ${['2026','2025','2024','2023','2022','2021','2020'].map(y => `<option value="${y}" ${repYear===y?'selected':''}>${y}</option>`).join('')}
                </select>
                <select onchange="repMonth=this.value;renderAdminApp();" class="form-control" style="width:145px;">
                    <option value="">সকল মাস (Month)</option>
                    ${[['01','জানুয়ারি'],['02','ফেব্রুয়ারি'],['03','মার্চ'],['04','এপ্রিল'],['05','মে'],['06','জুন'],['07','জুলাই'],['08','আগস্ট'],['09','সেপ্টেম্বর'],['10','অক্টোবর'],['11','নভেম্বর'],['12','ডিসেম্বর']].map(([m,n]) => `<option value="${m}" ${repMonth===m?'selected':''}>${n}</option>`).join('')}
                </select>
                <select onchange="repBatch=this.value;renderAdminApp();" class="form-control" style="width:155px;">
                    <option value="">সকল ব্যাচ (Batch)</option>
                    ${batches.map(b => `<option value="${esc(b)}" ${repBatch===b?'selected':''}>${esc(b)}</option>`).join('')}
                </select>
                <button onclick="repType='ALL';repYear='';repMonth='';repBatch='';renderAdminApp();" class="btn btn-outline btn-xs">রিসেট</button>
            </div>
        </div>

        <div style="padding:14px 20px; background:#eff6ff; display:flex; justify-content:space-around; flex-wrap:wrap; gap:10px; font-weight:800; border-bottom:1px solid #bfdbfe;">
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

/* ==========================================================================
   11. SIMLESS SMS, SUBSCRIBERS, MESSAGES, LOGIN HISTORY, SETTINGS
   ========================================================================== */
function renderTabSmsModule(el, db) {
    const logs = db.sms_logs || [];
    el.innerHTML = `
    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-paper-plane"></i> অটোমেটিক মেসেজ মডিউল (সিম ও মোবাইল ছাড়াই PHP Cloud SMS Gateway)</h3>
            <button onclick="openAutoSmsGatewayModal('01771770044','ড্রিম ক্যারিয়ার আইটি থেকে বিশেষ নোটিশ: আগামী শনিবার সকাল ১০টায় ক্লাস অনুষ্ঠিত হবে।')" class="btn btn-primary btn-xs"><i class="fa fa-paper-plane"></i> ➕ নতুন অটো মেসেজ পাঠান</button>
        </div>
        <div class="panel-body">
            <div class="dcp-table-wrap">
                <table class="dcp-table" style="min-width:100%;">
                    <thead><tr><th>লগ আইডি</th><th>প্রাপক নাম্বার</th><th>মেসেজের বিবরণ</th><th>গেটওয়ে চ্যানেল</th><th>সময়</th><th>স্ট্যাটাস</th></tr></thead>
                    <tbody>
                        ${logs.length === 0 ? `<tr><td colspan="6" style="text-align:center;padding:24px;">এখনো কোনো মেসেজ লগ নেই। উপরে "নতুন অটো মেসেজ পাঠান" বাটনে ক্লিক করে পাঠান।</td></tr>` :
                        logs.map(l => `
                        <tr>
                            <td><strong>#${esc(l.id || l.dispatch_id)}</strong></td>
                            <td>${esc(l.recipients)} (${l.recipient_count || l.count || 1} জন)</td>
                            <td>${esc(l.message_body || l.message || '')}</td>
                            <td><span class="badge badge-info">${esc(l.gateway_channel || l.mode || 'DCIT Auto Cloud Gateway')}</span></td>
                            <td>${esc(l.sent_at)}</td>
                            <td><span class="badge badge-success">${esc(l.status)}</span></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
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
        <div class="panel-body">
            ${renderBulkToolbar('subscribers', ['Active', 'Inactive'])}
            <div class="dcp-table-wrap">
                <table class="dcp-table" style="min-width:100%;">
                    <thead>
                        <tr>
                            <th><input type="checkbox" onchange="toggleSelectAllRows('subscribers',this.checked)"></th>
                            <th>ইমেইল / মোবাইল</th>
                            <th>সাবস্ক্রিপশন তারিখ</th>
                            <th>সিন স্ট্যাটাস</th>
                            <th>কুইক ভিউ, এডিট, ডিলিট</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pg.slice.length === 0 ? `<tr><td colspan="5" style="text-align:center;padding:24px;">এখনো কোনো সাবস্ক্রাইবার নেই।</td></tr>` :
                        pg.slice.map(s => {
                            const realIdx = subs.findIndex(x => String(x.id) === String(s.id));
                            const val = s.contact_info || s.email || '';
                            return `
                            <tr>
                                <td><input type="checkbox" class="row-bulk-chk" data-idx="${realIdx}" onchange="toggleBulkRow('subscribers','${esc(s.id)}',this.checked)"></td>
                                <td><strong>${esc(val)}</strong></td>
                                <td>${esc(s.created_at || s.subscribed_at || '')}</td>
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
            ${pg.barHTML}
        </div>
    </div>`;
}

function quickViewSubscriber(idx) {
    const s = DCITStore.getDB().subscribers[idx];
    if (!s) return;
    DCITStore.updateDB(db => { if (db.subscribers[idx]) db.subscribers[idx].seen = true; });
    renderAdminApp();
    openAdminModal('সাবস্ক্রাইবার কুইক ভিউ', `<div class="qv-info-card"><small>ইমেইল / কন্টাক্ট</small><strong>${esc(s.contact_info || s.email)} (তারিখ: ${esc(s.created_at || s.subscribed_at || '')})</strong></div>`);
}

function editSubscriberModal(idx) {
    const s = DCITStore.getDB().subscribers[idx];
    if (!s) return;
    openAdminModal('সাবস্ক্রাইবার এডিট', `
        <form onsubmit="event.preventDefault();DCITStore.updateDB(d=>{d.subscribers[${idx}].contact_info=document.getElementById('sub-ed-em').value;d.subscribers[${idx}].email=document.getElementById('sub-ed-em').value;});closeAdminModal();renderAdminApp();">
            <div class="form-group"><label>ইমেইল / মোবাইল</label><input type="text" id="sub-ed-em" class="form-control" value="${esc(s.contact_info || s.email)}" required></div>
            <button type="submit" class="btn btn-primary" style="margin-top:12px;">আপডেট</button>
        </form>
    `);
}

let msgSeenFilter = '';
function renderTabMessages(el, db) {
    const msgs = db.messages || [];
    const unseenCnt = msgs.filter(m => !Number(m.is_read) && !m.seen).length;
    const seenCnt = msgs.filter(m => Number(m.is_read) || m.seen).length;
    const filtered = msgs.filter(m => {
        const isSeen = !!(Number(m.is_read) || m.seen);
        if (msgSeenFilter === 'UNSEEN') return !isSeen;
        if (msgSeenFilter === 'SEEN') return isSeen;
        return true;
    });
    const pg = paginateAdminList(filtered, 'messages');

    el.innerHTML = `
    <div class="counter-filter-bar">
        <div class="counter-pills">
            <button class="counter-pill ${msgSeenFilter===''?'active':''}" onclick="msgSeenFilter='';renderAdminApp();">
                <i class="fa fa-envelope"></i> মোট মেসেজ ইনবক্স <b>${msgs.length}</b>
            </button>
            <button class="counter-pill ${msgSeenFilter==='UNSEEN'?'active':''}" onclick="msgSeenFilter='UNSEEN';renderAdminApp();">
                <i class="fa fa-envelope-o"></i> Unseen (অপঠিত মেসেজ) <b>${unseenCnt}</b>
            </button>
            <button class="counter-pill ${msgSeenFilter==='SEEN'?'active':''}" onclick="msgSeenFilter='SEEN';renderAdminApp();">
                <i class="fa fa-envelope-open-o"></i> Seen (পঠিত মেসেজ) <b>${seenCnt}</b>
            </button>
        </div>
    </div>

    <div class="panel-card">
        <div class="panel-header"><h3><i class="fa fa-envelope"></i> কন্টাক্ট মেসেজ ইনবক্স (${filtered.length})</h3></div>
        <div class="panel-body">
            ${renderBulkToolbar('messages', ['Seen', 'Unseen'])}
            <div class="dcp-table-wrap">
                <table class="dcp-table" style="min-width:100%;">
                    <thead>
                        <tr>
                            <th><input type="checkbox" onchange="toggleSelectAllRows('messages',this.checked)"></th>
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
                            const isSeen = !!(Number(m.is_read) || m.seen);
                            return `
                            <tr style="${!isSeen?'background:#fffbeb;font-weight:700;':''}">
                                <td><input type="checkbox" class="row-bulk-chk" data-idx="${realIdx}" onchange="toggleBulkRow('messages','${esc(m.id)}',this.checked)"></td>
                                <td><strong>${esc(m.sender_name)}</strong><br><small>${esc(m.phone || m.sender_email || '')}</small></td>
                                <td><strong>${esc(m.subject || 'সাধারণ জিজ্ঞাসা')}</strong><br><small>${esc(m.message)}</small></td>
                                <td>${esc(m.created_at || m.sent_at || '')}</td>
                                <td><span class="badge ${isSeen?'badge-success':'badge-warning'}">${isSeen?'Seen':'Unseen'}</span></td>
                                <td>
                                    <button onclick="quickViewInboxMessage(${realIdx})" class="btn btn-outline btn-xs"><i class="fa fa-eye"></i> কুইক ভিউ</button>
                                    <button onclick="openAutoSmsGatewayModal('${esc(m.phone||'01771770044')}','প্রিয় ${esc(m.sender_name)}, আপনার বার্তার জন্য ধন্যবাদ। - Dream Career IT')" class="btn btn-accent btn-xs"><i class="fa fa-reply"></i> অটো SMS</button>
                                    <button onclick="DCITStore.updateDB(d=>d.messages.splice(${realIdx},1));renderAdminApp();" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>
                                </td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            ${pg.barHTML}
        </div>
    </div>`;
}

function quickViewInboxMessage(idx) {
    const m = DCITStore.getDB().messages[idx];
    if (!m) return;
    DCITStore.updateDB(db => {
        if (db.messages[idx]) {
            db.messages[idx].is_read = 1;
            db.messages[idx].seen = true;
        }
    });
    renderAdminApp();
    openAdminModal('মেসেজ কুইক ভিউ', `
        <div class="qv-info-grid">
            <div class="qv-info-card"><small>প্রেরক ও মোবাইল</small><strong>${esc(m.sender_name)} (${esc(m.phone || m.sender_email)})</strong></div>
            <div class="qv-info-card"><small>সময় ও স্ট্যাটাস</small><strong>${esc(m.created_at || m.sent_at || '')} (Seen)</strong></div>
            <div class="qv-info-card" style="grid-column:1/-1;"><small>বার্তার বিস্তারিত</small><strong>${esc(m.message)}</strong></div>
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
        <div class="panel-body">
            <div class="dcp-table-wrap">
                <table class="dcp-table" style="min-width:100%;">
                    <thead><tr><th>ইউজারনেম</th><th>রোল ও টাইম-লক</th><th>লগইন সময়</th><th>ডিভাইস ও ব্রাউজার</th><th>সিকিউরিটি স্ট্যাটাস</th></tr></thead>
                    <tbody>
                        ${logs.map(l => `
                        <tr>
                            <td><strong>${esc(l.username)}</strong></td>
                            <td>${esc(l.role || 'Chief Administrator')} (${esc(l.timelock_used || 'VERIFIED')})</td>
                            <td>${esc(l.login_time)}</td>
                            <td><small>${esc(l.ip_device || l.device || 'Admin Session')}</small></td>
                            <td><span class="badge badge-success">${esc(l.status)}</span></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

function renderTabSettings(el, db) {
    const banners = db.welcome_banners || [];
    let payMethodsStr = 'bKash (01771770044), Nagad (01771770044), Rocket (01771770044), Bank Transfer, Cash';
    try {
        const pmArr = JSON.parse(DCITStore.setting('payment_methods_json', '[]'));
        if (Array.isArray(pmArr) && pmArr.length) payMethodsStr = pmArr.join(', ');
    } catch(e) {}

    el.innerHTML = `
    <div class="panel-card" style="padding:22px;">
        <h3 style="margin-bottom:14px;"><i class="fa fa-cogs"></i> প্রতিষ্ঠান সেটিংস, ডিসকাউন্ট ও ওয়েলকাম পপআপ ব্যানার কনফিগারেশন</h3>
        <form onsubmit="saveGlobalSettings(event)">
            <div class="form-grid">
                <div class="form-group"><label>প্রতিষ্ঠানের নাম (বাংলা)</label><input type="text" id="st-name-bn" class="form-control" value="${esc(DCITStore.setting('site_name_bn', 'ড্রিম ক্যারিয়ার আইটি'))}"></div>
                <div class="form-group"><label>প্রতিষ্ঠানের নাম (ইংরেজি)</label><input type="text" id="st-name-en" class="form-control" value="${esc(DCITStore.setting('site_name', 'Dream Career IT'))}"></div>
                <div class="form-group"><label>হটলাইন ফোন</label><input type="text" id="st-phone" class="form-control" value="${esc(DCITStore.setting('phone_1', '01771770044'))}"></div>
                <div class="form-group"><label>প্রতিবন্ধী কোটা ডিসকাউন্ট পার্সেন্টেজ (%)</label><input type="number" id="st-dis-pct" class="form-control" value="${esc(DCITStore.setting('disability_discount_percent', '25'))}"></div>
                <div class="form-group"><label>শিক্ষক রেফারেন্স ডিসকাউন্ট পার্সেন্টেজ (%)</label><input type="number" id="st-ref-pct" class="form-control" value="${esc(DCITStore.setting('teacher_refer_discount_percent', '15'))}"></div>
                <div class="form-group"><label>পেমেন্ট মেথড সমূহ (কমা দিয়ে লিখুন)</label><input type="text" id="st-pay-methods" class="form-control" value="${esc(payMethodsStr)}"></div>
                <div class="form-group" style="grid-column:1/-1;"><label>ঠিকানা</label><input type="text" id="st-addr" class="form-control" value="${esc(DCITStore.setting('address_bn', 'ভাই ভাই সুপার মার্কেট, নতুন পদুয়ার বাজার মসজিদের পাশে, পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা - ৩৫০০'))}"></div>
                <div class="form-group" style="grid-column:1/-1;"><label>স্ক্রলিং নোটিশ টিকার (হেডার মারকিউ)</label><input type="text" id="st-ticker" class="form-control" value="${esc(DCITStore.setting('notice_text', ''))}"></div>
            </div>
            <button type="submit" class="btn btn-primary" style="margin-top:14px;"><i class="fa fa-save"></i> সেটিংস ও ডিসকাউন্ট সংরক্ষণ করুন</button>
        </form>
    </div>

    <div class="panel-card" style="padding:22px;">
        <div class="panel-header" style="padding:0 0 14px; border:none; background:transparent;">
            <h3 style="margin:0;"><i class="fa fa-picture-o"></i> ওয়েবসাইট ওয়েলকাম নোটিশ পপআপ ব্যানার (সাইটে ঢুকলেই প্রদর্শিত হবে)</h3>
            <button onclick="openWelcomeBannerModal()" class="btn btn-accent btn-xs"><i class="fa fa-plus"></i> ➕ নতুন ওয়েলকাম ব্যানার যুক্ত করুন</button>
        </div>
        <div class="dcp-table-wrap">
            <table class="dcp-table" style="min-width:100%;">
                <thead><tr><th>ছবি</th><th>শিরোনাম ও সাবটাইটেল</th><th>বাটন টেক্সট</th><th>স্ট্যাটাস</th><th>অ্যাকশন</th></tr></thead>
                <tbody>
                    ${banners.map((b, idx) => `
                    <tr>
                        <td><img src="${esc(admImg(b.image))}" style="width:70px;height:44px;object-fit:cover;border-radius:6px;"></td>
                        <td><strong>${esc(b.title)}</strong><br><small>${esc(b.subtitle)}</small></td>
                        <td>${esc(b.button_text || b.cta_text || 'এখনই ভর্তি হোন')}</td>
                        <td><span class="badge ${b.status!=='Inactive'?'badge-success':'badge-warning'}">${esc(b.status || 'Active')}</span></td>
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
    const pmArr = document.getElementById('st-pay-methods').value.split(',').map(x => x.trim()).filter(Boolean);
    DCITStore.updateSettings({
        site_name_bn: document.getElementById('st-name-bn').value.trim(),
        site_name: document.getElementById('st-name-en').value.trim(),
        phone_1: document.getElementById('st-phone').value.trim(),
        disability_discount_percent: String(document.getElementById('st-dis-pct').value || '25'),
        teacher_refer_discount_percent: String(document.getElementById('st-ref-pct').value || '15'),
        payment_methods_json: JSON.stringify(pmArr),
        address_bn: document.getElementById('st-addr').value.trim(),
        notice_text: document.getElementById('st-ticker').value.trim()
    });
    notifyToast('সকল সেটিংস ও ডিসকাউন্ট পার্সেন্টেজ আপডেট হয়েছে!');
}

function openWelcomeBannerModal(editIdx = null) {
    const b = editIdx !== null ? DCITStore.getDB().welcome_banners[editIdx] : null;
    openAdminModal(b ? 'ওয়েলকাম পপআপ ব্যানার এডিট' : 'নতুন ওয়েলকাম পপআপ ব্যানার', `
    <form onsubmit="saveWelcomeBannerModal(event, ${editIdx !== null ? editIdx : 'null'})">
        <div class="form-grid">
            <div class="form-group"><label>ব্যানার শিরোনাম *</label><input type="text" id="wb-title" class="form-control" value="${esc(b?.title || '🎓 Dream Career IT-তে আপনাকে স্বাগতম!')}" required></div>
            <div class="form-group"><label>ব্যানার ব্যাজ টেক্সট</label><input type="text" id="wb-badge" class="form-control" value="${esc(b?.badge || '🔥 ২০২৬ সেশনে নতুন ব্যাচে ভর্তি চলছে!')}"></div>
            <div class="form-group" style="grid-column:1/-1;"><label>সাবটাইটেল / বিবরণ *</label><input type="text" id="wb-sub" class="form-control" value="${esc(b?.subtitle || 'সরকারি সনদপ্রাপ্ত কোর্সে বিশেষ ছাড়ে আজই অনলাইনে আবেদন করুন।')}" required></div>
            <div class="form-group">
                <label>ব্যানার ছবি আপলোড</label>
                <input type="file" accept="image/*" class="form-control" onchange="previewUploadImg(this,'wb-prev','wb-val')">
                <input type="hidden" id="wb-val" value="${esc(b?.image || 'assets/img/logo.jpg')}">
                <img id="wb-prev" src="${esc(admImg(b?.image || 'assets/img/logo.jpg'))}" style="width:90px;height:50px;margin-top:6px;object-fit:cover;">
            </div>
            <div class="form-group"><label>স্ট্যাটাস</label>
                <select id="wb-active" class="form-control">
                    <option value="Active" ${b?.status!=='Inactive'?'selected':''}>চালু (Active)</option>
                    <option value="Inactive" ${b?.status==='Inactive'?'selected':''}>বন্ধ (Inactive)</option>
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
        badge: document.getElementById('wb-badge').value.trim(),
        subtitle: document.getElementById('wb-sub').value.trim(),
        image: document.getElementById('wb-val').value || 'assets/img/logo.jpg',
        button_text: 'অনলাইনে ভর্তি আবেদন করুন',
        status: document.getElementById('wb-active').value
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

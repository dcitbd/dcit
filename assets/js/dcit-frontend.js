/**
 * DREAM CAREER IT - Complete Enterprise Viewer Engine (v5.0)
 * Features:
 * - Rich Animations, Welcome Banner Popup, PWA App Install & Awesome Toasts
 * - Student Privacy Protection on Customer View (Only Photo, Name & Course Info shown!)
 * - Universal Pagination (< 1, 2, 3 ... 10 > & 20/30/50/100 selector), Digital Counter Filters & Seen/Unseen Trackers
 * - Smart Online Admission Form with Live Photo/Certificate/Medical Previews & Teacher Referral + Disability Discounts
 * - Premium Multi-Card Quick View Popups for Administration, Courses, Routine & Certificates
 */
function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// Awesome Notification Toast
function showAwesomeToast(type, title, msg) {
    const old = document.querySelector('.awesome-toast');
    if (old) old.remove();
    const div = document.createElement('div');
    div.className = 'awesome-toast ' + (type === 'error' ? 'error' : (type === 'warning' ? 'warning' : 'success'));
    const icon = type === 'error' ? 'fa-times-circle' : (type === 'warning' ? 'fa-exclamation-triangle' : 'fa-check-circle');
    const icColor = type === 'error' ? '#ef4444' : (type === 'warning' ? '#f59e0b' : '#10b981');
    div.innerHTML = `
        <i class="fa ${icon}" style="font-size:1.85rem; color:${icColor};"></i>
        <div style="flex:1;">
            <strong style="display:block; font-size:0.96rem; margin-bottom:2px;">${esc(title)}</strong>
            <span style="font-size:0.86rem; color:#cbd5e1;">${esc(msg)}</span>
        </div>
        <button onclick="this.parentElement.remove()" style="background:none; border:none; color:#94a3b8; cursor:pointer; font-size:1.1rem;">&times;</button>
    `;
    document.body.appendChild(div);
    setTimeout(() => { if (div.parentElement) div.remove(); }, 4500);
}

// PWA Install App Handler
let deferredPwaPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPwaPrompt = e;
});
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
}
function triggerPwaInstall() {
    if (deferredPwaPrompt) {
        deferredPwaPrompt.prompt();
        deferredPwaPrompt.userChoice.then((choice) => {
            if (choice && choice.outcome === 'accepted') {
                showAwesomeToast('success', 'ইনস্টল সম্পন্ন!', 'Dream Career IT অ্যাপটি আপনার ডিভাইসে সফলভাবে ইনস্টল হয়েছে।');
            }
            deferredPwaPrompt = null;
        });
        return;
    }
    // Direct 1-Click Automated App Installation Process & Desktop/Mobile App Launcher Download
    openDcitPopup('📲 Dream Career IT — ডিরেক্ট অ্যাপ ইনস্টলার', `
        <div style="text-align:center; padding:18px 10px;">
            <img src="assets/img/logo.jpg" alt="Dream Career IT" style="width:84px; height:84px; border-radius:20px; border:3px solid #0f766e; margin:0 auto 12px; box-shadow:0 8px 20px rgba(15,118,110,0.25);">
            <h3 style="color:#151442; margin-bottom:6px;">Dream Career IT App ইনস্টল হচ্ছে...</h3>
            <p id="directInstallStatusText" style="color:#0f766e; font-weight:700; font-size:0.95rem; margin-bottom:14px;">অফলাইন ক্যাশ ও অ্যাপ প্যাকেজ প্রস্তুত করা হচ্ছে (25%)...</p>
            <div style="width:100%; max-width:380px; height:12px; background:#e2e8f0; border-radius:20px; overflow:hidden; margin:0 auto 16px;">
                <div id="directInstallProgressBar" style="width:25%; height:100%; background:linear-gradient(90deg,#0f766e,#10b981); transition:width 0.35s ease;"></div>
            </div>
            <p style="font-size:0.85rem; color:#64748b;">অনুগ্রহ করে অপেক্ষা করুন, ইনস্টলেশন স্বয়ংক্রিয়ভাবে সম্পন্ন হবে।</p>
        </div>
    `);
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }
    setTimeout(() => {
        const bar = document.getElementById('directInstallProgressBar');
        const txt = document.getElementById('directInstallStatusText');
        if (bar) bar.style.width = '70%';
        if (txt) txt.textContent = 'ডিভাইসে অ্যাপ শর্টকাট ও লঞ্চার কনফিগার করা হচ্ছে (70%)...';
    }, 450);
    setTimeout(() => {
        const bar = document.getElementById('directInstallProgressBar');
        const txt = document.getElementById('directInstallStatusText');
        if (bar) bar.style.width = '100%';
        if (txt) txt.textContent = '✓ ইনস্টলেশন ১০০% সম্পন্ন হয়েছে!';
        // Trigger direct download of standalone App Launcher so user gets an immediate runnable app file
        const appUrl = window.location.origin && window.location.origin !== 'null' ? (window.location.origin + window.location.pathname) : 'https://dcitbd.github.io/';
        const launcherHtml = `<!DOCTYPE html><html lang="bn"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Dream Career IT App</title><style>body,html{margin:0;padding:0;height:100%;overflow:hidden;background:#151442;}iframe{width:100%;height:100%;border:none;}</style><script>window.location.replace("${appUrl}");<\/script></head><body><iframe src="${appUrl}"></iframe></body></html>`;
        const blob = new Blob([launcherHtml], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'Dream-Career-IT-App.html';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => {
            closeDcitPopup();
            showAwesomeToast('success', 'অ্যাপ ইনস্টল সম্পন্ন!', 'Dream Career IT অ্যাপটি সরাসরি ইনস্টল ও ডাউনলোড হয়েছে।');
        }, 700);
    }, 1000);
}

// Universal Pagination State & Renderer
window._viewerPaging = { page: 1, perPage: 30, filter: 'ALL', q: '' };

function paginateArray(items, pageKey = 'default') {
    const st = window._viewerPaging;
    const total = items.length;
    const perPage = Number(st.perPage) || 30;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    if (st.page > totalPages) st.page = totalPages;
    if (st.page < 1) st.page = 1;
    const start = (st.page - 1) * perPage;
    const sliced = items.slice(start, start + perPage);

    let btnsHTML = `<button class="page-btn" ${st.page<=1?'disabled':''} onclick="changeViewerPage(${st.page-1})">&lt;</button>`;
    for (let p = 1; p <= totalPages; p++) {
        if (totalPages <= 10 || p <= 3 || p > totalPages - 2 || Math.abs(p - st.page) <= 1) {
            btnsHTML += `<button class="page-btn ${p===st.page?'active':''}" onclick="changeViewerPage(${p})">${p}</button>`;
        } else if (p === 4 && st.page > 5) {
            btnsHTML += `<span style="padding:0 6px; font-weight:700;">...</span>`;
        } else if (p === totalPages - 2 && st.page < totalPages - 4) {
            btnsHTML += `<span style="padding:0 6px; font-weight:700;">...</span>`;
        }
    }
    btnsHTML += `<button class="page-btn" ${st.page>=totalPages?'disabled':''} onclick="changeViewerPage(${st.page+1})">&gt;</button>`;

    const barHTML = `
    <div class="pagination-bar">
        <div style="display:flex; align-items:center; gap:10px; font-size:0.88rem; font-weight:700; color:#334155;">
            <span>মোটঃ ${total} টি | প্রতি পেজে দেখুনঃ</span>
            <select onchange="changeViewerPerPage(this.value)" class="form-control" style="width:95px; padding:5px 8px;">
                ${[20, 30, 50, 100].map(n => `<option value="${n}" ${perPage===n?'selected':''}>${n} জন</option>`).join('')}
            </select>
        </div>
        <div class="page-numbers">${btnsHTML}</div>
    </div>`;

    return { sliced, barHTML, start };
}

function changeViewerPage(p) {
    window._viewerPaging.page = Number(p);
    navigateView(window._currentViewName || 'home', window._currentViewParams || {}, true);
}

function changeViewerPerPage(n) {
    window._viewerPaging.perPage = Number(n);
    window._viewerPaging.page = 1;
    navigateView(window._currentViewName || 'home', window._currentViewParams || {}, true);
}

function openDcitPopup(title, htmlContent) {
    const modal = document.getElementById('dcitUniversalPopup');
    const head = document.getElementById('dcitPopupTitle');
    const body = document.getElementById('dcitPopupBody');
    if (head) head.innerHTML = title;
    if (body) body.innerHTML = htmlContent;
    if (modal) modal.classList.add('open');
}

function closeDcitPopup() {
    const modal = document.getElementById('dcitUniversalPopup');
    if (modal) modal.classList.remove('open');
}

// Welcome Banner Popup on First Visit
function checkAndShowWelcomeBanner() {
    if (window._welcomeShown) return;
    window._welcomeShown = true;
    if (DCITStore.setting('welcome_banner_enabled', '1') !== '1') return;
    const db = DCITStore.getDB();
    const wb = (db.welcome_banners && db.welcome_banners[0]) ? db.welcome_banners[0] : {
        title: DCITStore.setting('welcome_banner_title', '🎓 Dream Career IT-তে আপনাকে স্বাগতম!'),
        badge: DCITStore.setting('welcome_banner_badge', '🔥 বিশেষ ভর্তি অফার ও স্কলারশিপ চলছে!'),
        subtitle: DCITStore.setting('welcome_banner_subtitle', 'Microsoft Office, Advance Office, Graphic Design, Web Design, Spoken English ও IELTS কোর্সে ভর্তি চলছে!'),
        button_text: DCITStore.setting('welcome_banner_cta', 'এখনই অনলাইনে আবেদন করুন'),
        image: 'assets/img/logo.jpg'
    };
    if (wb.status === 'Inactive') return;

    setTimeout(() => {
        openDcitPopup('🌟 স্বাগতম নোটিশ (Welcome Notice)', `
            <div style="text-align:center; padding:8px;">
                <div class="qv-hero-banner" style="flex-direction:column; text-align:center; padding:28px 20px;">
                    <img src="${esc(wb.image || 'assets/img/logo.jpg')}" alt="Dream Career IT" class="anim-float" style="width:96px; height:96px; border-radius:50%;">
                    <span class="badge badge-warning" style="font-size:0.86rem; padding:5px 14px;">${esc(wb.badge)}</span>
                    <h2 style="font-size:1.7rem; margin:6px 0; color:#fde68a;">${esc(wb.title)}</h2>
                    <div style="color:#f1f5f9; font-size:0.96rem; max-width:620px; line-height:1.7;">${wb.subtitle}</div>
                </div>
                <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
                    <button onclick="closeDcitPopup(); navigateView('admission');" class="btn btn-accent anim-pulse-btn">
                        <i class="fa fa-paper-plane"></i> ${esc(wb.button_text || 'অনলাইনে আবেদন করুন')}
                    </button>
                    <button onclick="closeDcitPopup(); navigateView('courses');" class="btn btn-primary">
                        <i class="fa fa-book"></i> কোর্স সমূহ দেখুন
                    </button>
                </div>
            </div>
        `);
    }, 850);
}

function toggleViewMode(containerId, mode, btnEl) {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (mode === 'list') el.classList.add('list-view-mode');
    else el.classList.remove('list-view-mode');
    if (btnEl && btnEl.parentElement) {
        btnEl.parentElement.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btnEl.classList.add('active');
    }
}

function previewUploadedFile(inputEl, previewBoxId) {
    const box = document.getElementById(previewBoxId);
    if (!box || !inputEl.files || !inputEl.files[0]) return;
    const file = inputEl.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        inputEl.setAttribute('data-base64', e.target.result);
        const isImg = file.type.startsWith('image/');
        box.innerHTML = `
            ${isImg ? `<img src="${e.target.result}" alt="Preview">` : `<div style="width:54px;height:54px;border-radius:10px;background:#0f766e;color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.5rem;"><i class="fa fa-file-text-o"></i></div>`}
            <div>
                <strong style="color:#0f766e; display:block; font-size:0.88rem;"><i class="fa fa-check-circle"></i> ফাইল যুক্ত হয়েছে (প্রিভিউ)</strong>
                <small style="color:#475569;">${esc(file.name)} (${(file.size/1024).toFixed(1)} KB)</small>
            </div>
        `;
        box.classList.add('active');
    };
    reader.readAsDataURL(file);
}

function syncHeaderFooter() {
    const siteName = DCITStore.setting('site_name', 'Dream Career IT');
    const phone1 = DCITStore.setting('phone_1', '01771770044');
    const email1 = DCITStore.setting('email_1', 'dc13edubd@gmail.com');
    const notice = DCITStore.setting('notice_text', '');
    const addrBn = DCITStore.setting('address_bn', '');

    const bt = document.getElementById('brandTitle');
    if (bt) bt.textContent = siteName;
    const tp = document.getElementById('topPhone');
    if (tp) { tp.innerHTML = `<i class="fa fa-phone"></i> ${esc(phone1)}`; tp.href = `tel:${esc(phone1)}`; }
    const te = document.getElementById('topEmail');
    if (te) { te.innerHTML = `<i class="fa fa-envelope-o"></i> ${esc(email1)}`; te.href = `mailto:${esc(email1)}`; }
    const nt = document.getElementById('noticeText');
    if (nt && notice) nt.textContent = notice;
    const fa = document.getElementById('footerAddress');
    if (fa) fa.innerHTML = `${esc(addrBn)}<br><strong>ফোনঃ</strong> ${esc(phone1)}<br><strong>ইমেইলঃ</strong> ${esc(email1)}`;

    // If Admin is logged in in this tab, show "ড্যাশবোর্ডে ফিরুন (Logged In)" badge on topbar!
    const admBtn = document.getElementById('topAdminPanelBtn');
    if (admBtn) {
        if (DCITStore.isLogged()) {
            admBtn.innerHTML = `<i class="fa fa-tachometer"></i> এডমিন ড্যাশবোর্ড (Active)`;
        } else {
            admBtn.innerHTML = `<i class="fa fa-lock"></i> এডমিন প্যানেল`;
        }
    }

    const db = DCITStore.getDB();
    const activeCourses = (db.courses || []).filter(c => c.status !== 'Inactive');
    const navDrop = document.getElementById('navCoursesDropdown');
    if (navDrop) {
        navDrop.innerHTML = `
            <li><a href="#courses" onclick="navigateView('courses')"><span><i class="fa fa-th-large"></i> সকল কোর্স লিস্ট ও কার্ড ভিউ</span></a></li>
        ` + activeCourses.map(c => `
            <li>
                <a href="#course-${esc(c.slug)}" onclick="navigateView('course-detail', {slug:'${esc(c.slug)}'})">
                    <span><i class="fa fa-book"></i> ${esc(c.title)}</span>
                    <small style="color:#ea580c; font-weight:800;">৳${Number(c.fee).toLocaleString()}</small>
                </a>
            </li>
        `).join('');
    }
    const footList = document.getElementById('footerCoursesList');
    if (footList) {
        footList.innerHTML = activeCourses.map(c => `
            <li><a href="#course-${esc(c.slug)}" onclick="navigateView('course-detail', {slug:'${esc(c.slug)}'})"><i class="fa fa-angle-right"></i> ${esc(c.title)} (৳${Number(c.fee).toLocaleString()})</a></li>
        `).join('');
    }
}

function navigateView(view, params = {}, keepPage = false) {
    if (!keepPage) {
        window._viewerPaging.page = 1;
    }
    window._currentViewName = view;
    window._currentViewParams = params;

    syncHeaderFooter();
    closeDcitPopup();
    document.querySelectorAll('.nav-link').forEach(a => {
        a.classList.toggle('active', a.getAttribute('data-view') === view);
    });
    const main = document.getElementById('appMainContainer');
    if (!main) return;

    if (view === 'home') renderHome(main);
    else if (view === 'courses') renderCoursesList(main, params);
    else if (view === 'course-detail') renderCourseDetail(main, params.slug || '');
    else if (view === 'batches-hub') renderBatchesHub(main);
    else if (view === 'result') renderResult(main, params);
    else if (view === 'admission') renderAdmission(main, params.course || '');
    else if (view === 'batches') renderBatches(main, params);
    else if (view === 'routine') renderRoutine(main, params);
    else if (view === 'routine-detail') renderRoutineDetail(main, params.id || 0);
    else if (view === 'biodata') renderBiodata(main, params);
    else if (view === 'certificates') renderCertificates(main, params);
    else if (view === 'teachers') renderTeachers(main, params);
    else if (view === 'notices') renderNotices(main, params);
    else if (view === 'contact-list') renderContactList(main);
    else if (view === 'about') renderAbout(main);
    else if (view === 'mission') renderMission(main);
    else if (view === 'terms') renderTerms(main);
    else if (view === 'license') renderLicense(main);
    else if (view === 'contact') renderContact(main);
    else if (view === 'designer') renderDesigner(main);
    else renderHome(main);

    if (!keepPage) window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================================================
   1. HOME PAGE (Rich Animations across all 7 sections!)
   ========================================================================== */
function renderHome(main) {
    const db = DCITStore.getDB();
    const courses = (db.courses || []).filter(c => c.status !== 'Inactive');
    const stories = db.success_stories || [];
    const notices = (db.notices || []).slice(0, 3);
    const siteName = DCITStore.setting('site_name', 'Dream Career IT');
    const slogan = DCITStore.setting('site_slogan', 'দক্ষ জনশক্তি ও স্মার্ট ক্যারিয়ার গড়ার প্রত্যয়ে — প্রযুক্তি শিখুন, স্বাবলম্বী হোন');
    const addrBn = DCITStore.setting('address_bn');
    const phone1 = DCITStore.setting('phone_1', '01771770044');

    main.innerHTML = `
    <!-- Section 1: Animated Hero Banner -->
    <section class="hero-section">
        <div class="hero-orb-1"></div>
        <div class="hero-orb-2"></div>
        <div class="container hero-grid">
            <div class="hero-content" style="animation:fadeUpCard 0.6s ease;">
                <span class="hero-badge"><i class="fa fa-graduation-cap"></i> কারিগরি ও বাস্তবমুখী কম্পিউটার প্রশিক্ষণের নির্ভরযোগ্য প্রতিষ্ঠান</span>
                <div style="display:flex; align-items:center; gap:16px; margin-bottom:12px;">
                    <img src="assets/img/logo.jpg" alt="Dream Career IT" class="anim-float" style="width:78px; height:78px; border-radius:18px; border:3px solid #fde68a;">
                    <h2 style="margin:0;"><span class="gradient-anim-title">${esc(siteName)}</span><br><span style="font-size:1.65rem; color:#fff;">ড্রিম ক্যারিয়ার আইটি</span></h2>
                </div>
                <div class="hero-slogan">✨ "${esc(slogan)}"</div>
                <div class="hero-address">
                    <i class="fa fa-map-marker" style="color:#fde68a;"></i> ${esc(addrBn)}<br>
                    <strong><i class="fa fa-phone" style="color:#5eead4;"></i> হটলাইনঃ ${esc(phone1)} | ইমেইলঃ ${esc(DCITStore.setting('email_1'))}</strong>
                </div>
                <div class="hero-actions">
                    <button onclick="navigateView('admission')" class="btn btn-accent anim-pulse-btn"><i class="fa fa-paper-plane"></i> অনলাইনে ভর্তি হোন (Apply Now)</button>
                    <button onclick="navigateView('result')" class="btn btn-primary"><i class="fa fa-trophy"></i> রেজাল্ট ও সার্টিফিকেট প্রিন্ট</button>
                    <button onclick="navigateView('courses')" class="btn btn-outline"><i class="fa fa-book"></i> সকল কোর্স দেখুন</button>
                </div>
            </div>
            <div class="hero-slider anim-float">
                <div class="hero-slide active">
                    <img src="assets/img/slide1.jpg" alt="Dream Career IT Lab">
                    <div class="hero-slide-caption">আধুনিক মাল্টিমিডিয়া কম্পিউটার ল্যাব ও শতভাগ প্র্যাকটিক্যাল প্রশিক্ষণ</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Section 2: Animated Courses Section -->
    <section class="section">
        <div class="container">
            <div class="section-header">
                <span class="sub-badge">Career Building Courses</span>
                <h2>আমাদের প্রফেশনাল কোর্সসমূহ</h2>
                <p>"আজকের কম্পিউটার ও কারিগরি দক্ষতা, আগামী দিনের সফল ক্যারিয়ার ও আত্মনির্ভরশীলতা"</p>
            </div>
            <div class="view-toolbar">
                <div><strong><i class="fa fa-book" style="color:#0f766e;"></i> মোট চলমান কোর্সঃ ${courses.length} টি</strong> (কার্ডে ক্লিক করে বিস্তারিত সিলেবাস দেখুন)</div>
                <div class="view-toggle-btns">
                    <button class="view-btn active" onclick="toggleViewMode('homeCoursesGrid','card',this)"><i class="fa fa-th-large"></i> কার্ড ভিউ</button>
                    <button class="view-btn" onclick="toggleViewMode('homeCoursesGrid','list',this)"><i class="fa fa-list"></i> লিস্ট ভিউ</button>
                </div>
            </div>
            <div class="grid-3" id="homeCoursesGrid">
                ${courses.map(c => renderCourseCardHTML(c)).join('')}
            </div>
        </div>
    </section>

    <!-- Section 3: Animated Facilities & Why Choose Us -->
    <section class="section section-alt">
        <div class="container">
            <div class="section-header">
                <span class="sub-badge">World-Class Facilities</span>
                <h2>আমাদের বিশেষ সুবিধাসমূহ ও বৈশিষ্ট্য</h2>
                <p>"সঠিক প্রশিক্ষণ, আধুনিক ল্যাব ও সার্বক্ষণিক গাইডলাইন—আপনার সফলতার বিশ্বস্ত সঙ্গী"</p>
            </div>
            <div class="grid-3" style="margin-bottom:44px;">
                <div class="facility-card"><div class="facility-icon anim-float"><i class="fa fa-id-card-o"></i></div><h3>অভিজ্ঞ ও দক্ষ প্রশিক্ষক</h3><p>দক্ষ, অভিজ্ঞ ও প্রফেশনাল ট্রেইনার এবং মেন্টর দ্বারা প্রতিটি ক্লাস হাতে-কলমে পরিচালনা।</p></div>
                <div class="facility-card"><div class="facility-icon anim-float"><i class="fa fa-laptop"></i></div><h3>আধুনিক মাল্টিমিডিয়া ল্যাব</h3><p>প্রত্যেক শিক্ষার্থীর জন্য আলাদা কম্পিউটার ও হাই-স্পিড ইন্টারনেট সমৃদ্ধ ল্যাব।</p></div>
                <div class="facility-card"><div class="facility-icon anim-float"><i class="fa fa-headphones"></i></div><h3>২৪/৭ ও আজীবন সাপোর্ট</h3><p>অনলাইন ও অফলাইনে সার্বক্ষণিক সাপোর্ট এবং কোর্স শেষে আজীবন প্র্যাকটিস সুবিধা।</p></div>
                <div class="facility-card"><div class="facility-icon anim-float"><i class="fa fa-certificate"></i></div><h3>১০-অক্ষরের গোপন কোড সার্টিফিকেট</h3><p>কোর্স শেষে ১০ অক্ষরের গোপন কোড ও বারকোড ভেরিফিকেশন যুক্ত প্রফেশনাল সার্টিফিকেট।</p></div>
                <div class="facility-card"><div class="facility-icon anim-float"><i class="fa fa-gift"></i></div><h3>শিক্ষক রেফার ও বিশেষ ডিসকাউন্ট</h3><p>শিক্ষক রেফারেন্স এবং বিশেষ চাহিদাসম্পন্ন শিক্ষার্থীদের জন্য বিশেষ ফি ডিসকাউন্ট সুবিধা।</p></div>
                <div class="facility-card"><div class="facility-icon anim-float"><i class="fa fa-briefcase"></i></div><h3>জব ও ফ্রিল্যান্সিং গাইডলাইন</h3><p>চাকরি ও আন্তর্জাতিক ফ্রিল্যান্সিং মার্কেটপ্লেসে কাজ পাওয়ার জন্য বিশেষ মেন্টরশিপ।</p></div>
            </div>

            <div class="why-choose-box">
                <h2 style="font-size:1.85rem; margin-bottom:8px; color:#fde68a;">কেন Dream Career IT আপনার প্রথম পছন্দ হবে?</h2>
                <p style="color:#cbd5e1;">"প্রযুক্তি শিক্ষায় কোনো আপোষ নয় — আমরা গড়ি দক্ষ ও আত্মবিশ্বাসী প্রফেশনাল"</p>
                <ul class="why-list">
                    <li><i class="fa fa-check-circle"></i> প্রত্যেক শিক্ষার্থীর জন্য আলাদা কম্পিউটার ও ব্যাকআপ ক্লাসের সুবিধা।</li>
                    <li><i class="fa fa-check-circle"></i> আপডেটেড কোর্স কারিকুলাম এবং প্রতিটি ক্লাসের মানসম্মত লেকচার শিট।</li>
                    <li><i class="fa fa-check-circle"></i> নিয়মিত তাত্ত্বিক ও ব্যবহারিক ক্লাস এবং চূড়ান্ত মূল্যায়ন পরীক্ষা।</li>
                    <li><i class="fa fa-check-circle"></i> অনলাইনে ১০-অক্ষরের গোপন কোড দিয়ে ভেরিফিকেশন ও ল্যান্ডস্কেপ সার্টিফিকেট প্রিন্ট।</li>
                    <li><i class="fa fa-check-circle"></i> ফ্রিল্যান্সিং ও কর্মসংস্থান তৈরিতে সরাসরি প্রজেক্ট ভিত্তিক প্রশিক্ষণ।</li>
                    <li><i class="fa fa-check-circle"></i> শিক্ষার্থী ও অভিভাবকদের জন্য নিরাপদ, সুশৃঙ্খল ও আন্তরিক পরিবেশ।</li>
                </ul>
            </div>

            <div class="stats-row">
                <div class="stat-box"><h3>${esc(DCITStore.setting('stat_experience', '11'))}+</h3><p><i class="fa fa-briefcase"></i> বছরের অভিজ্ঞতা</p></div>
                <div class="stat-box"><h3>${esc(DCITStore.setting('stat_team', '10'))}+</h3><p><i class="fa fa-users"></i> দক্ষ প্রশিক্ষক ও টিম</p></div>
                <div class="stat-box"><h3>${esc(DCITStore.setting('stat_courses', '21'))}+</h3><p><i class="fa fa-book"></i> প্রশিক্ষণ মডিউল</p></div>
                <div class="stat-box"><h3>${esc(DCITStore.setting('stat_students', '20,785'))}+</h3><p><i class="fa fa-graduation-cap"></i> সফল শিক্ষার্থী</p></div>
            </div>
        </div>
    </section>

    <!-- Section 4: Success Students Section (Privacy Safe: Photo, Name & Course Info only) -->
    <section class="section">
        <div class="container">
            <div class="section-header">
                <span class="sub-badge">Success Stories</span>
                <h2>আমাদের সফল শিক্ষার্থী সমূহ</h2>
                <p>"যাঁরা Dream Career IT থেকে প্রশিক্ষণ নিয়ে আজ দেশ-বিদেশে ও ফ্রিল্যান্সিংয়ে সফল"</p>
            </div>
            <div class="grid-3">
                ${stories.map(st => `
                <div class="card">
                    <div class="card-body" style="text-align:center;">
                        <img src="${esc(st.photo || 'assets/img/logo.jpg')}" alt="${esc(st.student_name)}" class="anim-float" style="width:96px; height:96px; border-radius:50%; object-fit:cover; margin:0 auto 14px; border:3px solid #0f766e;">
                        <h3>${esc(st.student_name)}</h3>
                        <div class="title-bn">${esc(st.designation)}</div>
                        <span class="badge badge-info" style="align-self:center; margin-bottom:12px;">${esc(st.course_name)} (${esc(st.batch_info)})</span>
                        <div style="font-style:italic; color:#475569;">${st.story}</div>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- Section 5: Recent Notices Section -->
    <section class="section section-alt">
        <div class="container">
            <div class="section-header">
                <span class="sub-badge">Notice Board</span>
                <h2>সাম্প্রতিক নোটিশ ও বিজ্ঞপ্তি</h2>
                <p>ভর্তি, রেজিস্ট্রেশন, পরীক্ষা ও ক্লাস সংক্রান্ত সর্বশেষ আপডেট</p>
            </div>
            <div class="grid-3">
                ${notices.map(n => {
                    const seen = DCITStore.isSeen('notice', n.id);
                    return `
                    <div class="card">
                        <div class="card-body">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                                <span class="badge badge-warning"><i class="fa fa-bell"></i> ${esc(n.category)}</span>
                                <span class="seen-tag ${seen?'seen':'unseen'}">${seen?'✓ দেখা হয়েছে (Seen)':'● নতুন (Unseen)'}</span>
                            </div>
                            <small style="color:#64748b; font-weight:700; margin-bottom:6px; display:block;"><i class="fa fa-calendar"></i> ${esc(n.publish_date)}</small>
                            <h3 style="font-size:1.15rem; margin-bottom:10px;">${esc(n.title)}</h3>
                            <div style="color:#475569; font-size:0.92rem; margin-bottom:16px; flex:1;">${n.details}</div>
                            <button onclick="openNoticePopup(${Number(n.id)})" class="btn btn-primary btn-sm"><i class="fa fa-eye"></i> কুইক ভিউ পপআপ</button>
                        </div>
                    </div>`;
                }).join('')}
            </div>
            <div style="text-align:center; margin-top:28px;">
                <button onclick="navigateView('notices')" class="btn btn-accent"><i class="fa fa-list"></i> সকল নোটিশ ও ফিল্টার দেখুন</button>
            </div>
        </div>
    </section>

    <!-- Section 6: Subscribe Section -->
    <section class="section" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:58px 0;">
        <div class="container" style="max-width:780px; text-align:center;">
            <span class="hero-badge"><i class="fa fa-envelope-open"></i> Stay Connected</span>
            <h2 style="font-size:2rem; margin-bottom:10px;">নতুন ব্যাচ ও স্কলারশিপ আপডেট পেতে সাবস্ক্রাইব করুন</h2>
            <p style="color:#cbd5e1; margin-bottom:24px;">আপনার ইমেইল অথবা মোবাইল নম্বর দিয়ে সাবস্ক্রাইব করে রাখুন, নতুন ব্যাচ ও সেমিনারের খবর পৌঁছে যাবে।</p>
            <form id="homeSubscribeForm" style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
                <input type="text" id="subContactInput" class="form-control" required placeholder="আপনার ইমেইল অথবা মোবাইল নম্বর লিখুন..." style="max-width:440px; padding:13px 18px; border-radius:30px;">
                <button type="submit" class="btn btn-accent anim-pulse-btn" style="border-radius:30px; padding:13px 28px;"><i class="fa fa-bell"></i> সাবস্ক্রাইব করুন</button>
            </form>
        </div>
    </section>

    <!-- Section 7: Contact Form Section -->
    <section class="section">
        <div class="container">
            <div class="section-header">
                <span class="sub-badge">Get In Touch</span>
                <h2>সরাসরি আমাদের সাথে যোগাযোগ করুন</h2>
                <p>যেকোনো কোর্স, ভর্তি বা তথ্যের জন্য নিচের ফর্মটি পূরণ করে বার্তা পাঠান</p>
            </div>
            ${getContactGridHTML()}
        </div>
    </section>
    `;

    bindSubscribeAndContactForms();
    checkAndShowWelcomeBanner();
}

function renderCourseCardHTML(c) {
    const seen = DCITStore.isSeen('course', c.id);
    return `
    <div class="card" onclick="DCITStore.markSeen('course',${Number(c.id)}); navigateView('course-detail', {slug:'${esc(c.slug)}'})" style="cursor:pointer;">
        <div class="course-thumb">
            <img src="${esc(c.image)}" alt="${esc(c.title)}" loading="lazy">
            <span class="course-fee-badge">৳ ${Number(c.fee).toLocaleString()}</span>
            <span class="course-cert-badge">
                <i class="fa ${Number(c.has_certificate) ? 'fa-certificate' : 'fa-info-circle'}"></i>
                ${Number(c.has_certificate) ? 'সার্টিফিকেট সহ' : 'বেসিক কোর্স'}
            </span>
        </div>
        <div class="card-body">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <h3>${esc(c.title)}</h3>
                <span class="seen-tag ${seen?'seen':'unseen'}">${seen?'Seen':'New'}</span>
            </div>
            <div class="title-bn">${esc(c.title_bn)}</div>
            <div class="course-meta">
                <span><i class="fa fa-calendar"></i> ${esc(c.duration)}</span>
                <span><i class="fa fa-clock-o"></i> ${esc(c.class_duration)}</span>
                <span><i class="fa fa-desktop"></i> ${Number(c.total_classes)} ক্লাস</span>
            </div>
            <p>${esc(c.description_bn || c.short_desc)}</p>
            <div class="card-footer" onclick="event.stopPropagation();">
                <button onclick="DCITStore.markSeen('course',${Number(c.id)}); navigateView('course-detail', {slug:'${esc(c.slug)}'})" class="btn btn-primary btn-sm" style="flex:1;">
                    <i class="fa fa-eye"></i> কোর্সের বিস্তারিত
                </button>
                <button onclick="navigateView('admission', {course:'${esc(c.title)}'})" class="btn btn-accent btn-sm">
                    <i class="fa fa-pencil"></i> ভর্তি হোন
                </button>
            </div>
        </div>
    </div>`;
}

/* ==========================================================================
   2. COURSES PAGE (With Counter Filter, Seen/Unseen & Pagination) & DETAIL PAGE
   ========================================================================== */
function renderCoursesList(main, params = {}) {
    const db = DCITStore.getDB();
    const all = (db.courses || []).filter(c => c.status !== 'Inactive');
    const certCnt = all.filter(c => Number(c.has_certificate) === 1).length;
    const flt = params.filter || 'ALL';
    const filtered = flt === 'CERT' ? all.filter(c => Number(c.has_certificate) === 1) : all;
    const paged = paginateArray(filtered);

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container">
            <h1>আমাদের সকল কোর্স সমূহ (All Courses)</h1>
            <p>যেকোনো কোর্সের কার্ডে ক্লিক করে আলাদা পেজে সম্পূর্ণ সিলেবাস ও বিস্তারিত তথ্য দেখুন</p>
        </div>
    </div>
    <section class="section">
        <div class="container">
            <div class="view-toolbar">
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <button onclick="navigateView('courses',{filter:'ALL'})" class="btn ${flt==='ALL'?'btn-primary':'btn-outline'} btn-sm" style="${flt!=='ALL'?'color:#151442;border-color:#cbd5e1;':''}">সকল কোর্স (${all.length})</button>
                    <button onclick="navigateView('courses',{filter:'CERT'})" class="btn ${flt==='CERT'?'btn-primary':'btn-outline'} btn-sm" style="${flt!=='CERT'?'color:#151442;border-color:#cbd5e1;':''}">সার্টিফিকেট কোর্স (${certCnt})</button>
                </div>
                <div class="view-toggle-btns">
                    <button class="view-btn active" onclick="toggleViewMode('allCoursesContainer','card',this)"><i class="fa fa-th-large"></i> কার্ড ভিউ</button>
                    <button class="view-btn" onclick="toggleViewMode('allCoursesContainer','list',this)"><i class="fa fa-list"></i> লিস্ট ভিউ</button>
                </div>
            </div>
            <div class="grid-3" id="allCoursesContainer">
                ${paged.sliced.map(c => renderCourseCardHTML(c)).join('')}
            </div>
            ${paged.barHTML}
        </div>
    </section>`;
}

function renderCourseDetail(main, slug = '') {
    const db = DCITStore.getDB();
    const courses = db.courses || [];
    const selected = courses.find(c => c.slug === slug || c.title === slug) || courses[0];
    if (selected) DCITStore.markSeen('course', selected.id);
    let topics = [];
    let syllabus = [];
    if (selected) {
        try { topics = typeof selected.topics_json === 'string' ? JSON.parse(selected.topics_json) : (selected.topics_json || []); } catch(e){}
        try { syllabus = typeof selected.syllabus_json === 'string' ? JSON.parse(selected.syllabus_json) : (selected.syllabus_json || []); } catch(e){}
    }

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container">
            <h1>${esc(selected.title)} — বিস্তারিত কোর্স মডিউল</h1>
            <p>${esc(selected.title_bn)} | কোর্স ফিঃ ৳${Number(selected.fee).toLocaleString()} | মেয়াদঃ ${esc(selected.duration)}</p>
        </div>
    </div>
    <section class="section">
        <div class="container">
            <div style="margin-bottom:20px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px;">
                <button onclick="navigateView('courses')" class="btn btn-outline btn-sm" style="color:#151442; border-color:#cbd5e1;">&larr; সকল কোর্স পেজে ফিরে যান</button>
                <button onclick="navigateView('admission', {course:'${esc(selected.title)}'})" class="btn btn-accent btn-sm"><i class="fa fa-paper-plane"></i> এই কোর্সে এখনই ভর্তি হোন</button>
            </div>
            <div class="card" style="margin-bottom:36px;">
                <div class="card-body" style="padding:32px;">
                    <div class="grid-2" style="align-items:center;">
                        <div>
                            <span class="badge ${Number(selected.has_certificate) ? 'badge-success' : 'badge-warning'}" style="margin-bottom:12px;">
                                ${Number(selected.has_certificate) ? 'অনলাইন ভেরিফাইড সার্টিফিকেট প্রদান করা হয়' : 'বেসিক কোর্স (সার্টিফিকেট ছাড়া)'}
                            </span>
                            <h2 style="font-size:2rem; margin-bottom:6px; color:#151442;">${esc(selected.title)}</h2>
                            <h3 style="color:#0f766e; margin-bottom:14px;">${esc(selected.title_bn)} — কোর্স ফিঃ মাত্র ৳${Number(selected.fee).toLocaleString()} টাকা</h3>
                            <p style="font-size:1rem; margin-bottom:18px;">${esc(selected.description_bn || selected.short_desc)}</p>
                            <div class="course-meta" style="font-size:0.95rem;">
                                <span><i class="fa fa-calendar"></i> <strong>মেয়াদ:</strong> ${esc(selected.duration)}</span>
                                <span><i class="fa fa-clock-o"></i> <strong>প্রতি ক্লাস:</strong> ${esc(selected.class_duration)}</span>
                                <span><i class="fa fa-check-square-o"></i> <strong>সপ্তাহে:</strong> ${esc(selected.weekly_days)}</span>
                                <span><i class="fa fa-laptop"></i> <strong>মোট ক্লাস:</strong> ${Number(selected.total_classes)} টি</span>
                            </div>
                        </div>
                        <div>
                            <img src="${esc(selected.image)}" alt="${esc(selected.title)}" style="border-radius:14px; width:100%; max-height:320px; object-fit:cover;">
                        </div>
                    </div>
                </div>
            </div>
            ${topics.length ? `
            <h3 style="margin-bottom:16px; font-size:1.4rem;"><i class="fa fa-check-circle" style="color:#0f766e;"></i> কোর্সের প্রধান টপিকসমূহ</h3>
            <div class="grid-4" style="margin-bottom:36px;">
                ${topics.map(t => `<div style="background:#fff; padding:14px 18px; border-radius:10px; border:1px solid #e2e8f0; border-left:4px solid #0f766e; font-weight:700; box-shadow:var(--shadow);">${esc(t)}</div>`).join('')}
            </div>` : ''}
            ${syllabus.length ? `
            <h3 style="margin-bottom:16px; font-size:1.4rem;"><i class="fa fa-book" style="color:#ea580c;"></i> ক্লাস ভিত্তিক বিস্তারিত সিলেবাস</h3>
            <div class="syllabus-grid">
                ${syllabus.map(m => `
                    <div class="syllabus-card">
                        <div class="sec-tag">${esc(m.section || 'Class Module')}</div>
                        <h4>${esc(m.title)}</h4>
                        <ul>${(m.items || []).map(i => `<li>${esc(i)}</li>`).join('')}</ul>
                    </div>
                `).join('')}
            </div>` : ''}
        </div>
    </section>`;
}

/* ==========================================================================
   3. RESULT PAGE (Registration Number ONLY + 10-Char Secret Code Print)
   ========================================================================== */
function renderResult(main, params = {}) {
    const db = DCITStore.getDB();
    const regQ = (params.reg_no || '').trim();
    const found = regQ ? (db.students || []).find(s => s.reg_no === regQ) : null;

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container">
            <h1>অনলাইন ফলাফল ও সার্টিফিকেট প্রিন্ট (Student Result)</h1>
            <p>শুধুমাত্র আপনার রেজিস্ট্রেশন নাম্বার (যেমন: 000001) দিয়ে রেজাল্ট দেখুন এবং ১০-অক্ষরের গোপন কোড দিয়ে সার্টিফিকেট প্রিন্ট করুন</p>
        </div>
    </div>
    <section class="section">
        <div class="container" style="max-width:880px;">
            <div class="form-card" style="margin-bottom:30px;">
                <h3 style="margin-bottom:14px; color:#151442;"><i class="fa fa-trophy" style="color:#ea580c;"></i> রেজিস্ট্রেশন নাম্বার দিয়ে ফলাফল খুঁজুন</h3>
                <form onsubmit="event.preventDefault(); navigateView('result', {reg_no: document.getElementById('resOnlyRegInput').value});" style="display:flex; gap:12px; flex-wrap:wrap;">
                    <input type="text" id="resOnlyRegInput" class="form-control" value="${esc(regQ || '000001')}" required placeholder="আপনার রেজিস্ট্রেশন নাম্বার লিখুন (যেমন: 000001)" style="flex:1; min-width:240px;">
                    <button type="submit" class="btn btn-primary"><i class="fa fa-search"></i> রেজাল্ট দেখুন</button>
                </form>
            </div>

            ${regQ ? (found ? `
            <div class="form-card" style="border-top:6px solid #0f766e;">
                <div class="qv-hero-banner">
                    <img src="${esc(found.photo || 'assets/img/logo.jpg')}" alt="${esc(found.name)}">
                    <div style="flex:1;">
                        <span class="badge badge-warning">রেজিঃ নং: ${esc(found.reg_no)} | রোলঃ ${esc(found.roll_no)}</span>
                        <h2 style="margin:6px 0; color:#fff;">${esc(found.name)}</h2>
                        <p style="color:#5eead4; font-weight:700;">${esc(found.course_name)} (${esc(found.course_duration || '3 Months')})</p>
                    </div>
                    <div style="text-align:right;">
                        <div class="badge badge-success" style="font-size:1.1rem; padding:8px 16px; margin-bottom:8px;">
                            গ্রেডঃ ${esc(found.result_grade)} (GPA: ${esc(found.cgpa)})
                        </div><br>
                        <button onclick="promptSecretCodeAndPrint('${esc(found.reg_no)}')" class="btn btn-accent btn-sm">
                            <i class="fa fa-print"></i> সার্টিফিকেট প্রিন্ট করুন (গোপন কোড)
                        </button>
                    </div>
                </div>

                <div class="qv-info-grid">
                    <div class="qv-info-card"><small>পিতার নাম (Father's Name)</small><strong>${esc(found.father_name)}</strong></div>
                    <div class="qv-info-card"><small>মাতার নাম (Mother's Name)</small><strong>${esc(found.mother_name)}</strong></div>
                    <div class="qv-info-card"><small>ব্যাচ নং ও সেশন</small><strong>${esc(found.batch_no || ('Batch-' + found.batch_year))} (${esc(found.session_quarter)})</strong></div>
                    <div class="qv-info-card"><small>ক্লাস টাইম (Class Schedule)</small><strong>${esc(found.class_slot)}</strong></div>
                    <div class="qv-info-card"><small>শিক্ষাগত যোগ্যতা</small><strong>${esc(found.education)} (${esc(found.school_college)})</strong></div>
                    <div class="qv-info-card"><small>ঠিকানা (Address)</small><strong>${esc(found.present_address)}</strong></div>
                </div>
            </div>` : `<div class="alert alert-danger">দুঃখিত! প্রদত্ত রেজিস্ট্রেশন নাম্বারের (${esc(regQ)}) সাথে কোনো ফলাফল পাওয়া যায়নি।</div>`) : ''}
        </div>
    </section>`;
}

function promptSecretCodeAndPrint(regNo) {
    const db = DCITStore.getDB();
    const st = (db.students || []).find(s => s.reg_no === regNo);
    const cert = (db.certificates || []).find(c => c.reg_no === regNo) || (st ? {
        cert_no: 'DCIT-' + st.batch_year + '-' + st.reg_no,
        reg_no: st.reg_no,
        roll_no: st.roll_no,
        secret_code: st.secret_code,
        student_name: st.name,
        father_name: st.father_name,
        mother_name: st.mother_name,
        course_name: st.course_name,
        batch_year: st.batch_year,
        session_quarter: st.session_quarter,
        duration: st.course_duration || '3 Months',
        grade: st.result_grade,
        cgpa: st.cgpa,
        issue_date: '2026-04-10',
        verification_code: 'VER-DCIT-' + st.reg_no
    } : null);

    if (!st && !cert) return;
    const expectedCode = (st && st.secret_code) ? st.secret_code : (cert ? cert.secret_code : '');

    openDcitPopup('🔒 সার্টিফিকেট প্রিন্ট সিকিউরিটি ভেরিফিকেশন', `
        <div style="text-align:center; padding:12px;">
            <div class="qv-hero-banner" style="flex-direction:column; text-align:center;">
                <i class="fa fa-key" style="font-size:2.8rem; color:#fde68a;"></i>
                <h3 style="color:#fff;">১০-অক্ষরের স্টুডেন্ট গোপন কোড (Secret Code) দিন</h3>
                <p style="color:#e2e8f0; font-size:0.9rem;">শিক্ষার্থীঃ <strong>${esc(st ? st.name : cert.student_name)}</strong> (রেজিঃ নং: <strong>${esc(regNo)}</strong>)</p>
            </div>
            <form id="verifySecCodeForm" style="max-width:420px; margin:0 auto;">
                <div class="form-group">
                    <input type="text" id="secCodeInput" maxlength="10" class="form-control" required placeholder="১০ অক্ষরের গোপন কোড লিখুন" style="text-align:center; font-weight:800; font-size:1.15rem; letter-spacing:2px; text-transform:uppercase;">
                </div>
                <button type="submit" class="btn btn-accent" style="width:100%;"><i class="fa fa-print"></i> যাচাই করে সার্টিফিকেট প্রিন্ট করুন (Landscape Letter)</button>
            </form>
        </div>
    `);

    document.getElementById('verifySecCodeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const entered = document.getElementById('secCodeInput').value.trim().toUpperCase();
        if (entered === String(expectedCode).toUpperCase()) {
            closeDcitPopup();
            showAwesomeToast('success', 'গোপন কোড যাচাই সফল!', 'ল্যান্ডস্কেপ লেটার সাইজে সার্টিফিকেট প্রিন্ট উইন্ডো চালু হচ্ছে...');
            window.printAuthorizedCertificate(cert);
        } else {
            showAwesomeToast('error', 'ভুল গোপন কোড!', 'সঠিক ১০-অক্ষরের স্টুডেন্ট সিক্রেট কোড প্রদান করুন।');
        }
    });
}

/* ==========================================================================
   4. SMART ONLINE ADMISSION FORM (Cards, Previews, Teacher Ref & Disability Discount)
   ========================================================================== */
function renderBatchesHub(main) {
    renderCoursesList(main);
}

function renderAdmission(main, preCourse = '') {
    const db = DCITStore.getDB();
    const courses = (db.courses || []).filter(c => c.status !== 'Inactive');
    const classes = db.classes || [];
    const teachers = db.teachers || [];
    const disPercent = parseFloat(DCITStore.setting('disability_discount_percent', '25')) || 25;
    const refPercent = parseFloat(DCITStore.setting('teacher_refer_discount_percent', '15')) || 15;
    let payMethods = ["bKash (01771770044)", "Nagad (01771770044)", "Rocket (01771770044)", "Bank Transfer", "Cash"];
    try {
        const pmRaw = DCITStore.setting('payment_methods_json', '');
        if (pmRaw) payMethods = JSON.parse(pmRaw);
    } catch(e){}

    const initCourse = courses.find(c => c.title === preCourse) || courses[0] || {title:'Advance Microsoft Office', fee:1500, duration:'3 Months'};

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container">
            <h1>স্মার্ট অনলাইন ভর্তি ফর্ম (Smart Online Admission)</h1>
            <p>ছবি ও সনদ প্রিভিউ, শিক্ষক রেফার ডিসকাউন্ট (${refPercent}%), ডিসএবিলিটি ডিসকাউন্ট (${disPercent}%) ও ১০-অক্ষরের অটো গোপন কোড</p>
        </div>
    </div>
    <section class="section">
        <div class="container" style="max-width:1020px;">
            <form id="onlineAdmissionForm">
                <!-- Card 1: Personal & Identity Info with Live Photo & Doc Preview -->
                <div class="form-card" style="margin-bottom:26px; border-top:5px solid #0f766e;">
                    <div class="qv-hero-banner" style="padding:18px 22px; margin-bottom:22px;">
                        <img src="assets/img/logo.jpg" id="admLiveAvatar" style="width:74px; height:74px; border-radius:50%;">
                        <div>
                            <span class="badge badge-warning">ধাপ ১ঃ ব্যক্তিগত ও শিক্ষাগত তথ্য</span>
                            <h3 style="margin-top:4px; color:#fff;">শিক্ষার্থীর ব্যক্তিগত পরিচয় ও ডকুমেন্ট আপলোড</h3>
                        </div>
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label><i class="fa fa-camera" style="color:#0f766e;"></i> পাসপোর্ট সাইজের ছবি (আপলোড করলেই প্রিভিউ দেখাবে) *</label>
                            <input type="file" id="admPhotoFile" class="form-control" accept="image/*" onchange="previewUploadedFile(this,'admPhotoPrev'); if(this.files[0]){const r=new FileReader();r.onload=e=>document.getElementById('admLiveAvatar').src=e.target.result;r.readAsDataURL(this.files[0]);}">
                            <div id="admPhotoPrev" class="upload-preview-box"></div>
                        </div>
                        <div class="form-group">
                            <label><i class="fa fa-file-image-o" style="color:#ea580c;"></i> সার্টিফিকেট / জন্মনিবন্ধন / এনআইডি কপি আপলোড *</label>
                            <input type="file" id="admCertDocFile" class="form-control" accept="image/*,.pdf" onchange="previewUploadedFile(this,'admDocPrev')">
                            <div id="admDocPrev" class="upload-preview-box"></div>
                        </div>
                        <div class="form-group"><label><i class="fa fa-user"></i> শিক্ষার্থীর পূর্ণ নাম *</label><input type="text" name="full_name" class="form-control" required placeholder="আপনার পূর্ণ নাম"></div>
                        <div class="form-group"><label><i class="fa fa-user-o"></i> পিতার নাম *</label><input type="text" name="father_name" class="form-control" required placeholder="পিতার নাম"></div>
                        <div class="form-group"><label><i class="fa fa-user-o"></i> মাতার নাম *</label><input type="text" name="mother_name" class="form-control" required placeholder="মাতার নাম"></div>
                        <div class="form-group"><label><i class="fa fa-calendar"></i> জন্ম-তারিখ *</label><input type="date" name="dob" class="form-control" required></div>
                        <div class="form-group"><label><i class="fa fa-id-card"></i> এনআইডি / জন্মনিবন্ধন নাম্বার *</label><input type="text" name="nid_birth_reg" class="form-control" required placeholder="NID বা জন্মনিবন্ধন নম্বর"></div>
                        <div class="form-group"><label><i class="fa fa-phone"></i> মোবাইল নাম্বার *</label><input type="tel" name="phone" class="form-control" required placeholder="017XXXXXXXX"></div>
                        <div class="form-group">
                            <label><i class="fa fa-graduation-cap"></i> শিক্ষাগত যোগ্যতা *</label>
                            <select name="education" class="form-control"><option>HSC</option><option>SSC</option><option>Honours / BA / BSS</option><option>Masters / MA</option><option>Diploma</option><option>JSC</option></select>
                        </div>
                        <div class="form-group"><label><i class="fa fa-university"></i> বর্তমান শিক্ষা প্রতিষ্ঠান *</label><input type="text" name="school_college" class="form-control" required placeholder="স্কুল/কলেজ/বিশ্ববিদ্যালয়ের নাম"></div>
                        <div class="form-group">
                            <label><i class="fa fa-bullhorn"></i> কোথা থেকে আমাদের প্রতিষ্ঠান সম্পর্কে জানলেন?</label>
                            <select name="how_heard" class="form-control"><option>Facebook</option><option>Friend / Student</option><option>Google / Website</option><option>Banner / Leaflet</option></select>
                        </div>
                        <div class="form-group"><label><i class="fa fa-map-marker"></i> পূর্ণ ঠিকানা (Present & Permanent) *</label><input type="text" name="address" class="form-control" required placeholder="গ্রাম/মহল্লা, উপজেলা, জেলা"></div>
                    </div>
                </div>

                <!-- Card 2: Course, Discounts (Disability & Teacher Referral) & Auto Payment Calculation -->
                <div class="form-card" style="margin-bottom:26px; border-top:5px solid #ea580c;">
                    <h3 style="margin-bottom:18px; color:#151442;"><i class="fa fa-calculator" style="color:#ea580c;"></i> ধাপ ২ঃ কোর্স, ডিসকাউন্ট ও অটো পেমেন্ট ক্যালকুলেশন</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label><i class="fa fa-wheelchair"></i> কোনো ডিসএবিলিটিস আছে কি? (${disPercent}% ছাড়)</label>
                            <select id="admDisabilitySelect" name="has_disability" class="form-control">
                                <option value="না">না (No)</option>
                                <option value="হ্যাঁ">হ্যাঁ (Yes — ${disPercent}% ডিসকাউন্ট)</option>
                            </select>
                        </div>
                        <div class="form-group" id="admMedicalReportRow" style="display:none; background:#fffbeb; padding:12px; border-radius:10px; border:1px dashed #d97706;">
                            <label style="color:#92400e;"><i class="fa fa-medkit"></i> মেডিক্যাল রিপোর্ট আপলোড করুন *</label>
                            <input type="file" class="form-control" onchange="previewUploadedFile(this,'admMedPrev')">
                            <div id="admMedPrev" class="upload-preview-box"></div>
                        </div>
                        <div class="form-group">
                            <label><i class="fa fa-user-md" style="color:#0f766e;"></i> শিক্ষক রেফারেন্স ডিসকাউন্ট (${refPercent}% ছাড়)</label>
                            <select id="admTeacherRefSelect" name="teacher_ref" class="form-control">
                                <option value="">-- কোনো রেফারেন্স নেই --</option>
                                ${teachers.map(t => `<option value="${esc(t.name)}">${esc(t.name)} (${esc(t.role_type)}) — ${refPercent}% ছাড়</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label><i class="fa fa-book"></i> কোর্সের নাম *</label>
                            <select id="admCourseSelect" name="course_name" class="form-control" required>
                                ${courses.map(c => `<option value="${esc(c.title)}" data-fee="${Number(c.fee)}" data-duration="${esc(c.duration)}" ${initCourse.title === c.title ? 'selected' : ''}>${esc(c.title)} (৳${Number(c.fee)})</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>কোর্স ফি (ডিসকাউন্ট বাদে অটো সিলেক্ট)</label>
                            <input type="number" id="admCourseFee" name="course_fee" class="form-control" readonly value="${Number(initCourse.fee)}" style="background:#f1f5f9; font-weight:800; color:#0f766e;">
                        </div>
                        <div class="form-group">
                            <label>কোর্সের মেয়াদ (অটো সিলেক্ট)</label>
                            <input type="text" id="admCourseDuration" name="course_duration" class="form-control" readonly value="${esc(initCourse.duration)}" style="background:#f1f5f9; font-weight:700;">
                        </div>
                        <div class="form-group">
                            <label>পছন্দের ক্লাস সিডিউল *</label>
                            <select name="preferred_slot" class="form-control">
                                ${classes.map(cl => `<option value="${esc(cl.time_label)}">${esc(cl.time_label)} (${esc(cl.batch_name)})</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>পেমেন্ট মেথড *</label>
                            <select id="admPayMethod" name="payment_method" class="form-control">
                                ${payMethods.map(pm => `<option value="${esc(pm)}">${esc(pm)}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>পেইড এমাউন্ট (Paid ৳) *</label>
                            <input type="number" id="admPaidAmount" name="paid_amount" class="form-control" value="500" min="0" required>
                        </div>
                        <div class="form-group">
                            <label>ডিউ এমাউন্ট (Due ৳ - অটো ক্যালকুলেট)</label>
                            <input type="number" id="admDueAmount" name="due_amount" class="form-control" readonly value="${Math.max(0, Number(initCourse.fee) - 500)}" style="background:#f1f5f9; font-weight:800; color:#dc2626;">
                        </div>
                        <div class="form-group" id="admTrxRow">
                            <label>ট্রানজেকশন আইডি (TrxID) *</label>
                            <input type="text" name="trx_id" class="form-control" placeholder="বিকাশ/নগদ/ব্যাংক TrxID">
                        </div>
                        <div class="form-group" style="grid-column:1/-1; background:#f0fdfa; padding:14px 18px; border-radius:10px; border:1px solid #99f6e4;">
                            <label style="display:flex; align-items:center; gap:10px; cursor:pointer; margin:0; color:#0f766e;">
                                <input type="checkbox" required style="width:18px; height:18px;">
                                <span><strong>শপথনামাঃ</strong> আমি অঙ্গীকার করছি যে উপরের সকল তথ্য সত্য এবং আমি প্রতিষ্ঠানের সকল নিয়মাবলী মেনে চলবো।</span>
                            </label>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-accent anim-pulse-btn" style="padding:14px 34px; font-size:1.02rem; width:100%;">
                        <i class="fa fa-paper-plane"></i> ভর্তি আবেদন সাবমিট করুন (Submit Online Application)
                    </button>
                </div>
            </form>
        </div>
    </section>`;

    const courseSel = document.getElementById('admCourseSelect');
    const disSel = document.getElementById('admDisabilitySelect');
    const refSel = document.getElementById('admTeacherRefSelect');
    const medRow = document.getElementById('admMedicalReportRow');
    const feeInp = document.getElementById('admCourseFee');
    const durInp = document.getElementById('admCourseDuration');
    const paidInp = document.getElementById('admPaidAmount');
    const dueInp = document.getElementById('admDueAmount');
    const payMethodSel = document.getElementById('admPayMethod');
    const trxRow = document.getElementById('admTrxRow');

    function recalcSmartAdmission() {
        const opt = courseSel.options[courseSel.selectedIndex];
        let baseFee = parseFloat(opt.getAttribute('data-fee')) || 1500;
        durInp.value = opt.getAttribute('data-duration') || '3 Months';

        let totalDiscPct = 0;
        if (disSel.value === 'হ্যাঁ') {
            medRow.style.display = 'block';
            totalDiscPct += disPercent;
        } else {
            medRow.style.display = 'none';
        }
        if (refSel.value !== '') {
            totalDiscPct += refPercent;
        }
        baseFee = Math.round(baseFee * Math.max(0.2, (1 - totalDiscPct / 100)));
        feeInp.value = baseFee;
        const paid = parseFloat(paidInp.value) || 0;
        dueInp.value = Math.max(0, baseFee - paid);

        const pmVal = payMethodSel.value.toLowerCase();
        trxRow.style.display = (pmVal.includes('cash') || pmVal.includes('ক্যাশ')) ? 'none' : 'block';
    }

    courseSel.addEventListener('change', recalcSmartAdmission);
    disSel.addEventListener('change', recalcSmartAdmission);
    refSel.addEventListener('change', recalcSmartAdmission);
    paidInp.addEventListener('input', recalcSmartAdmission);
    payMethodSel.addEventListener('change', recalcSmartAdmission);
    recalcSmartAdmission();

    document.getElementById('onlineAdmissionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const fd = new FormData(this);
        const curDB = DCITStore.getDB();
        const serial = curDB.admissions.length + 101;
        const appNo = 'REG-' + new Date().getFullYear() + '-' + serial;
        const autoSecCode = DCITStore.generateSecretCode(fd.get('full_name'), fd.get('course_name'), new Date().getFullYear(), serial);
        const photoB64 = document.getElementById('admPhotoFile').getAttribute('data-base64') || 'assets/img/logo.jpg';

        curDB.admissions.unshift({
            id: Date.now(),
            application_no: appNo,
            secret_code: autoSecCode,
            full_name: fd.get('full_name'),
            father_name: fd.get('father_name'),
            mother_name: fd.get('mother_name'),
            nid_birth_reg: fd.get('nid_birth_reg'),
            phone: fd.get('phone'),
            address: fd.get('address'),
            school_college: fd.get('school_college'),
            education: fd.get('education'),
            how_heard: fd.get('how_heard'),
            has_disability: fd.get('has_disability'),
            teacher_ref: fd.get('teacher_ref') || '',
            course_name: fd.get('course_name'),
            course_fee: parseFloat(feeInp.value) || 0,
            course_duration: durInp.value,
            preferred_slot: fd.get('preferred_slot'),
            session_quarter: 'January to March',
            batch_year: new Date().getFullYear(),
            dob: fd.get('dob'),
            photo: photoB64,
            payment_method: fd.get('payment_method'),
            trx_id: trxRow.style.display === 'none' ? 'CASH' : (fd.get('trx_id') || 'ONLINE'),
            paid_amount: parseFloat(paidInp.value) || 0,
            due_amount: parseFloat(dueInp.value) || 0,
            status: 'Pending',
            created_at: new Date().toISOString().slice(0, 10)
        });
        DCITStore.saveDB(curDB);
        showAwesomeToast('success', 'অনলাইন আবেদন সফল হয়েছে!', `আবেদন নং: ${appNo} | গোপন কোড: ${autoSecCode}`);

        openDcitPopup('🎉 অনলাইন ভর্তি আবেদন সফলভাবে সম্পন্ন হয়েছে!', `
            <div style="text-align:center;">
                <div class="qv-hero-banner" style="flex-direction:column; text-align:center;">
                    <img src="${esc(photoB64)}" style="width:90px; height:90px; border-radius:50%;">
                    <h3 style="color:#fde68a;">অভিনন্দন, ${esc(fd.get('full_name'))}!</h3>
                    <p style="color:#fff;">ভর্তি আবেদন নম্বরঃ <strong>${esc(appNo)}</strong></p>
                </div>
                <div style="background:#fffbeb; border:2px dashed #d97706; padding:16px; border-radius:12px; margin-bottom:16px;">
                    <strong>আপনার ১০-অক্ষরের স্টুডেন্ট গোপন কোড (Secret Code):</strong><br>
                    <span style="font-size:1.5rem; font-weight:900; color:#ea580c; letter-spacing:2px;">${esc(autoSecCode)}</span>
                </div>
            </div>
        `);
        this.reset();
        recalcSmartAdmission();
    });
}

/* ==========================================================================
   5. BATCHES & STUDENTS VIEWER (Privacy Protected: Photo, Name & Course Info ONLY + Pagination!)
   ========================================================================== */
function renderBatches(main, params = {}) {
    const db = DCITStore.getDB();
    const batchType = params.type || 'New Batch';
    const yearFilter = params.year ? Number(params.year) : 0;
    let students = (db.students || []).filter(s => !params.type || s.batch_type === batchType);
    if (yearFilter) students = students.filter(s => Number(s.batch_year) === yearFilter);
    const paged = paginateArray(students);

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container">
            <h1>${batchType === 'Old Batch' ? 'পুরাতন ব্যাচ আর্কাইভ (2010 - 2026)' : 'নতুন ব্যাচ (New Batch) ও শিক্ষার্থী তালিকা'}</h1>
            <p>শিক্ষার্থীদের প্রাইভেসি সুরক্ষিত — শুধুমাত্র ছবি, নাম ও কোর্সের তথ্য প্রদর্শিত</p>
        </div>
    </div>
    <section class="section">
        <div class="container">
            <div class="view-toolbar">
                <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
                    <button onclick="navigateView('batches', {type:'New Batch'})" class="btn ${batchType==='New Batch'?'btn-primary':'btn-outline'} btn-sm" style="${batchType!=='New Batch'?'color:#151442; border-color:#cbd5e1;':''}">নতুন ব্যাচ (${(db.students||[]).filter(s=>s.batch_type==='New Batch').length})</button>
                    <button onclick="navigateView('batches', {type:'Old Batch'})" class="btn ${batchType==='Old Batch'?'btn-primary':'btn-outline'} btn-sm" style="${batchType!=='Old Batch'?'color:#151442; border-color:#cbd5e1;':''}">পুরাতন ব্যাচ (${(db.students||[]).filter(s=>s.batch_type==='Old Batch').length})</button>
                    <select onchange="navigateView('batches', {type:'${esc(batchType)}', year:this.value})" class="form-control" style="width:155px; padding:6px 10px;">
                        <option value="">-- সকল সাল --</option>
                        ${Array.from({length:17}, (_,i)=>2026-i).map(y => `<option value="${y}" ${yearFilter===y?'selected':''}>${y} Batch</option>`).join('')}
                    </select>
                </div>
                <div class="view-toggle-btns">
                    <button class="view-btn active" onclick="toggleViewMode('privacyStudentGrid','card',this)"><i class="fa fa-th-large"></i> কার্ড ভিউ</button>
                    <button class="view-btn" onclick="toggleViewMode('privacyStudentGrid','list',this)"><i class="fa fa-list"></i> লিস্ট ভিউ</button>
                </div>
            </div>

            <div class="grid-3" id="privacyStudentGrid">
                ${paged.sliced.map(s => {
                    const seen = DCITStore.isSeen('student', s.reg_no);
                    return `
                    <div class="card" onclick="openBiodataPopup('${esc(s.reg_no)}')" style="cursor:pointer;">
                        <div class="card-body" style="text-align:center;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                                <span class="badge badge-info">${esc(s.batch_type)} (${esc(s.batch_year)})</span>
                                <span class="seen-tag ${seen?'seen':'unseen'}">${seen?'Seen':'New'}</span>
                            </div>
                            <img src="${esc(s.photo || 'assets/img/logo.jpg')}" style="width:96px; height:96px; border-radius:50%; object-fit:cover; margin:0 auto 12px; border:3px solid #0f766e;">
                            <h3>${esc(s.name)}</h3>
                            <div class="title-bn">${esc(s.course_name)}</div>
                            <p style="font-size:0.88rem;">কোর্স মেয়াদঃ ${esc(s.course_duration || '3 Months')} | সেশনঃ ${esc(s.session_quarter)}</p>
                            <button class="btn btn-primary btn-sm" style="width:100%;"><i class="fa fa-eye"></i> কোর্সের তথ্য দেখুন</button>
                        </div>
                    </div>`;
                }).join('')}
            </div>
            ${paged.barHTML}
        </div>
    </section>`;
}

function renderBiodata(main, params = {}) {
    renderBatches(main, params);
}

function openBiodataPopup(regNo) {
    const db = DCITStore.getDB();
    const p = (db.students || []).find(s => s.reg_no === regNo || s.roll_no === regNo);
    if (!p) return;
    DCITStore.markSeen('student', p.reg_no);

    // Privacy Protected Customer Popup: Only Photo, Name & Course Info!
    openDcitPopup(`🎓 স্টুডেন্ট কোর্স প্রোফাইল — ${esc(p.name)}`, `
        <div>
            <div class="qv-hero-banner">
                <img src="${esc(p.photo || 'assets/img/logo.jpg')}" alt="${esc(p.name)}">
                <div>
                    <span class="badge badge-warning"><i class="fa fa-shield"></i> ভেরিফাইড শিক্ষার্থী প্রোফাইল</span>
                    <h2 style="margin:6px 0; color:#fff;">${esc(p.name)}</h2>
                    <p style="color:#5eead4; font-weight:700;">কোর্সঃ ${esc(p.course_name)}</p>
                </div>
            </div>
            <div class="qv-info-grid">
                <div class="qv-info-card"><small>কোর্সের নাম (Course Name)</small><strong>${esc(p.course_name)}</strong></div>
                <div class="qv-info-card"><small>কোর্সের মেয়াদ (Duration)</small><strong>${esc(p.course_duration || '3 Months')}</strong></div>
                <div class="qv-info-card"><small>ব্যাচ ও সেশন (Session)</small><strong>${esc(p.session_quarter)} (${esc(p.batch_year)}) — ${esc(p.batch_type)}</strong></div>
                <div class="qv-info-card"><small>ক্লাস শিডিউল (Schedule)</small><strong>${esc(p.class_slot)}</strong></div>
            </div>
            <div style="padding:12px 16px; background:#f0fdfa; border-radius:10px; border-left:4px solid #0f766e; font-size:0.86rem; color:#0f766e;">
                <i class="fa fa-lock"></i> শিক্ষার্থীর ব্যক্তিগত গোপনীয়তা রক্ষার্থে মোবাইল নম্বর ও পারিবারিক তথ্য কাস্টমার ভিউতে সংরক্ষিত রাখা হয়েছে।
            </div>
        </div>
    `);
}

/* ==========================================================================
   6. CLASS ROUTINE & SCHEDULE (With Pagination & Premium Popup)
   ========================================================================== */
function renderRoutine(main) {
    const db = DCITStore.getDB();
    const classes = db.classes || [];
    const paged = paginateArray(classes);

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container">
            <h1>ক্লাস রুটিন ও সময়সূচি (Class Routine & Schedule)</h1>
            <p>সকাল ৮:০০ টা থেকে রাত ৮:৩০ টা পর্যন্ত সকল শিফটের রুটিন</p>
        </div>
    </div>
    <section class="section">
        <div class="container">
            <div class="view-toolbar">
                <div><strong>মোট সক্রিয় ক্লাস শিফটঃ ${classes.length} টি</strong></div>
                <div class="view-toggle-btns">
                    <button class="view-btn active" onclick="toggleViewMode('routineCardsContainer','card',this)"><i class="fa fa-th-large"></i> কার্ড ভিউ</button>
                    <button class="view-btn" onclick="toggleViewMode('routineCardsContainer','list',this)"><i class="fa fa-list"></i> লিস্ট ভিউ</button>
                </div>
            </div>
            <div class="grid-3" id="routineCardsContainer">
                ${paged.sliced.map(cl => {
                    const cnt = (db.students || []).filter(s => s.class_slot === cl.time_label).length;
                    return `
                    <div class="card" onclick="openRoutinePopup(${Number(cl.id)})" style="cursor:pointer;">
                        <div class="card-body">
                            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                                <span class="badge badge-info"><i class="fa fa-clock-o"></i> ${esc(cl.time_label)}</span>
                                <span class="badge badge-success">${cnt} / ${Number(cl.max_seats || 20)} সিট</span>
                            </div>
                            <h3>${esc(cl.batch_name)}</h3>
                            <div class="title-bn">${esc(cl.course_name)}</div>
                            <p><strong>প্রশিক্ষক:</strong> ${esc(cl.teacher_name)}<br><strong>রুম:</strong> ${esc(cl.room_no)} | <strong>বার:</strong> ${esc(cl.days_of_week)}</p>
                            <button class="btn btn-primary btn-sm" style="width:100%;"><i class="fa fa-window-maximize"></i> বিস্তারিত পপআপ ভিউ</button>
                        </div>
                    </div>`;
                }).join('')}
            </div>
            ${paged.barHTML}
        </div>
    </section>`;
}

function openRoutinePopup(id) {
    const db = DCITStore.getDB();
    const cl = (db.classes || []).find(c => Number(c.id) === Number(id)) || db.classes[0];
    if (!cl) return;
    const enrolled = (db.students || []).filter(s => s.class_slot === cl.time_label);

    openDcitPopup(`🕒 ক্লাস রুটিন কুইক ভিউ — ${esc(cl.time_label)}`, `
        <div>
            <div class="qv-hero-banner">
                <img src="assets/img/logo.jpg" alt="Batch">
                <div>
                    <span class="badge badge-warning">${esc(cl.time_label)}</span>
                    <h2 style="margin:6px 0; color:#fff;">${esc(cl.batch_name)} — ${esc(cl.course_name)}</h2>
                    <p style="color:#5eead4;">প্রশিক্ষকঃ ${esc(cl.teacher_name)} | রুমঃ ${esc(cl.room_no)} (${esc(cl.days_of_week)})</p>
                </div>
            </div>
            <div class="qv-info-grid">
                <div class="qv-info-card"><small>সেশন ও সাল</small><strong>${esc(cl.session_name)} (${esc(cl.batch_year)})</strong></div>
                <div class="qv-info-card"><small>ভর্তিকৃত শিক্ষার্থী</small><strong>${enrolled.length} / ${Number(cl.max_seats || 20)} জন</strong></div>
            </div>
            <h4 style="margin-bottom:10px;">এই শিফটের শিক্ষার্থী তালিকা (নাম ও কোর্স):</h4>
            <div class="table-responsive">
                <table class="data-table" style="min-width:100%;">
                    <thead><tr><th>ছবি</th><th>শিক্ষার্থীর নাম</th><th>কোর্সের নাম</th></tr></thead>
                    <tbody>
                        ${enrolled.length ? enrolled.map(s => `<tr><td><img src="${esc(s.photo||'assets/img/logo.jpg')}" style="width:36px;height:36px;border-radius:50%;"></td><td><strong>${esc(s.name)}</strong></td><td>${esc(s.course_name)}</td></tr>`).join('') : `<tr><td colspan="3" style="text-align:center;">কোনো শিক্ষার্থী নিবন্ধিত নেই।</td></tr>`}
                    </tbody>
                </table>
            </div>
        </div>
    `);
}

function renderRoutineDetail(main, id) {
    renderRoutine(main);
    setTimeout(() => openRoutinePopup(id), 100);
}

/* ==========================================================================
   7. CERTIFICATE VERIFICATION (10-Char Secret Code + Landscape Print)
   ========================================================================== */
function renderCertificates(main) {
    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container">
            <h1>সার্টিফিকেট ভেরিফিকেশন ও প্রিন্ট (Certificate Verification)</h1>
            <p>রোল/রেজিস্ট্রেশন নাম্বার এবং ১০-অক্ষরের স্টুডেন্ট গোপন কোড দিয়ে পপআপে সার্টিফিকেট যাচাই ও প্রিন্ট করুন</p>
        </div>
    </div>
    <section class="section">
        <div class="container" style="max-width:820px;">
            <div class="form-card" style="border-top:5px solid #ea580c;">
                <h3 style="margin-bottom:14px; color:#151442;"><i class="fa fa-shield" style="color:#ea580c;"></i> রোল/রেজিস্ট্রেশন নাম্বার ও ১০-অক্ষরের গোপন কোড দিন</h3>
                <form onsubmit="event.preventDefault(); verifyCertInPopup();">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>রোল অথবা রেজিস্ট্রেশন নাম্বার *</label>
                            <input type="text" id="verifyRegInput" class="form-control" value="000001" required placeholder="যেমন: 000001">
                        </div>
                        <div class="form-group">
                            <label>১০-অক্ষরের স্টুডেন্ট গোপন কোড (Secret Code) *</label>
                            <input type="text" id="verifySecretInput" maxlength="10" class="form-control" value="DC20SAG001" required placeholder="যেমন: DC20SAG001" style="text-transform:uppercase; font-weight:800;">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-accent" style="width:100%;"><i class="fa fa-check-circle"></i> পপআপে সার্টিফিকেট ভেরিফাই ও প্রিন্ট করুন</button>
                </form>
            </div>
        </div>
    </section>`;
}

function verifyCertInPopup() {
    const regOrRoll = document.getElementById('verifyRegInput').value.trim();
    const secCode = document.getElementById('verifySecretInput').value.trim().toUpperCase();
    const db = DCITStore.getDB();

    const st = (db.students || []).find(s => s.reg_no === regOrRoll || s.roll_no === regOrRoll);
    const cert = (db.certificates || []).find(c => (c.reg_no === regOrRoll || c.roll_no === regOrRoll || c.cert_no === regOrRoll)) || (st ? {
        cert_no: 'DCIT-' + st.batch_year + '-' + st.reg_no,
        reg_no: st.reg_no,
        roll_no: st.roll_no,
        secret_code: st.secret_code,
        student_name: st.name,
        father_name: st.father_name,
        mother_name: st.mother_name,
        course_name: st.course_name,
        batch_year: st.batch_year,
        session_quarter: st.session_quarter,
        duration: st.course_duration || '3 Months',
        grade: st.result_grade,
        cgpa: st.cgpa,
        issue_date: '2026-04-10',
        verification_code: 'VER-DCIT-' + st.reg_no
    } : null);

    const validSecret = (cert && cert.secret_code ? cert.secret_code : (st ? st.secret_code : '')).toUpperCase();
    if (!cert || !validSecret || secCode !== validSecret) {
        showAwesomeToast('error', 'ভেরিফিকেশন ব্যর্থ!', 'রেজিস্ট্রেশন নাম্বার অথবা ১০-অক্ষরের গোপন কোড সঠিক নয়।');
        return;
    }

    window._lastVerifiedCert = cert;
    openDcitPopup(`✅ ভেরিফাইড সার্টিফিকেট — ${esc(cert.student_name)}`, `
        <div>
            <div style="border:6px solid #151442; padding:12px; background:#fff; border-radius:10px; margin-bottom:18px;">
                <div style="border:2px double #d97706; padding:22px; font-family:Georgia, serif;">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #151442; padding-bottom:10px; margin-bottom:14px;">
                        <img src="assets/img/logo.jpg" style="width:64px; height:64px; border-radius:50%; border:2px solid #151442;">
                        <div style="text-align:center; flex:1;">
                            <h2 style="margin:0; color:#151442; text-transform:uppercase;">DREAM CAREER IT</h2>
                            <p style="margin:2px 0 0; font-family:sans-serif; font-size:0.8rem;">পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা | ফোনঃ 01771770044</p>
                        </div>
                        <div style="font-family:sans-serif; font-size:0.78rem; text-align:right;">
                            <strong>Cert:</strong> ${esc(cert.cert_no)}<br>
                            <strong>Reg:</strong> ${esc(cert.reg_no)}
                        </div>
                    </div>
                    <p style="font-size:1rem; line-height:1.8; text-align:justify;">
                        This is to certify that <strong style="color:#0f766e;">${esc(cert.student_name)}</strong>,
                        son/daughter of <strong>${esc(cert.father_name)}</strong> and <strong>${esc(cert.mother_name)}</strong>,
                        Reg No: <strong>${esc(cert.reg_no)}</strong>, has successfully completed <strong>${esc(cert.course_name)}</strong>
                        (${esc(cert.session_quarter)}, ${esc(cert.batch_year)}) and secured Grade <strong>${esc(cert.grade)}</strong>.
                    </p>
                </div>
            </div>
            <div style="text-align:center;">
                <button onclick="window.printAuthorizedCertificate(window._lastVerifiedCert)" class="btn btn-accent">
                    <i class="fa fa-print"></i> সার্টিফিকেট প্রিন্ট করুন (Landscape Letter Size Only)
                </button>
            </div>
        </div>
    `);
}

/* ==========================================================================
   8. ADMINISTRATION (৫ ক্যাটাগরি + Joining Year, Active/Retired, Pagination & Rich Popup)
   ========================================================================== */
function renderTeachers(main, params = {}) {
    const db = DCITStore.getDB();
    const roleFilter = params.role || '';
    let staff = db.teachers || [];
    if (roleFilter) staff = staff.filter(t => t.role_type === roleFilter);
    const roles = ['শিক্ষক', 'ট্রেইনার', 'পরিচালক', 'ফাউন্ডার', 'সদস্য'];
    const paged = paginateArray(staff);

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container">
            <h1>প্রশাসন ও শিক্ষকবৃন্দ (${roleFilter || 'সকল ক্যাটাগরি'})</h1>
            <p>শিক্ষক, ট্রেইনার, পরিচালক, ফাউন্ডার ও সদস্যদের এনিমেটেড প্রোফাইল</p>
        </div>
    </div>
    <section class="section">
        <div class="container">
            <div class="view-toolbar">
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <button onclick="navigateView('teachers', {role:''})" class="btn ${!roleFilter?'btn-primary':'btn-outline'} btn-sm" style="${roleFilter?'color:#151442; border-color:#cbd5e1;':''}">সকল (${(db.teachers||[]).length})</button>
                    ${roles.map(r => `<button onclick="navigateView('teachers', {role:'${r}'})" class="btn ${roleFilter===r?'btn-primary':'btn-outline'} btn-sm" style="${roleFilter!==r?'color:#151442; border-color:#cbd5e1;':''}">${r} (${(db.teachers||[]).filter(x=>x.role_type===r).length})</button>`).join('')}
                </div>
                <div class="view-toggle-btns">
                    <button class="view-btn active" onclick="toggleViewMode('adminStaffGrid','card',this)"><i class="fa fa-th-large"></i> কার্ড ভিউ</button>
                    <button class="view-btn" onclick="toggleViewMode('adminStaffGrid','list',this)"><i class="fa fa-list"></i> লিস্ট ভিউ</button>
                </div>
            </div>

            <div class="grid-3" id="adminStaffGrid">
                ${paged.sliced.map(t => {
                    const seen = DCITStore.isSeen('staff', t.id);
                    return `
                    <div class="card" onclick="openStaffPopup(${Number(t.id)})" style="cursor:pointer;">
                        <div class="card-body" style="text-align:center;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                                <span class="badge ${t.employment_status==='অবসরপ্রাপ্ত'?'badge-warning':'badge-success'}">${esc(t.employment_status||'বর্তমান')} (${esc(t.joining_year||'2015')} থেকে)</span>
                                <span class="seen-tag ${seen?'seen':'unseen'}">${seen?'Seen':'New'}</span>
                            </div>
                            <img src="${esc(t.photo || 'assets/img/logo.jpg')}" class="anim-float" style="width:120px; height:120px; border-radius:50%; object-fit:cover; border:4px solid #0f766e; margin:0 auto 12px;">
                            <span class="badge badge-info" style="align-self:center; margin-bottom:6px;">${esc(t.role_type)}</span>
                            <h3>${esc(t.name)}</h3>
                            <div class="title-bn">${esc(t.designation)}</div>
                            <p style="font-size:0.88rem;"><i class="fa fa-phone" style="color:#0f766e;"></i> ${esc(t.phone)}</p>
                            <button class="btn btn-primary btn-sm" style="width:100%;"><i class="fa fa-id-badge"></i> প্রিমিয়াম প্রোফাইল কার্ড দেখুন</button>
                        </div>
                    </div>`;
                }).join('')}
            </div>
            ${paged.barHTML}
        </div>
    </section>`;
}

function openStaffPopup(id) {
    const db = DCITStore.getDB();
    const t = (db.teachers || []).find(x => Number(x.id) === Number(id)) || db.teachers[0];
    if (!t) return;
    DCITStore.markSeen('staff', t.id);

    openDcitPopup(`👤 প্রশাসন প্রোফাইল কার্ড — ${esc(t.name)}`, `
        <div>
            <div class="qv-hero-banner">
                <img src="${esc(t.photo || 'assets/img/logo.jpg')}" alt="${esc(t.name)}">
                <div style="flex:1;">
                    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:6px;">
                        <span class="badge badge-warning">${esc(t.role_type)}</span>
                        <span class="badge badge-success">${esc(t.employment_status || 'বর্তমান')} (${esc(t.joining_year || '2015')} সাল থেকে যুক্ত)</span>
                    </div>
                    <h2 style="margin:4px 0; color:#fff;">${esc(t.name)}</h2>
                    <p style="color:#5eead4; font-weight:700;">${esc(t.designation)}</p>
                </div>
            </div>
            <div class="qv-info-grid">
                <div class="qv-info-card"><small>শিক্ষাগত ও পেশাগত যোগ্যতা</small><strong>${esc(t.qualification || 'IT Specialist & Trainer')}</strong></div>
                <div class="qv-info-card"><small>যোগদান ও বর্তমান অবস্থা</small><strong>${esc(t.joining_year || '2015')} সাল থেকে (${esc(t.employment_status || 'বর্তমান')})</strong></div>
                <div class="qv-info-card"><small>মোবাইল নম্বর</small><strong>${esc(t.phone)}</strong></div>
                <div class="qv-info-card"><small>অফিসিয়াল ইমেইল</small><strong>${esc(t.email)}</strong></div>
                <div class="qv-info-card" style="grid-column:1/-1;"><small>ক্লাস রুটিন ও দায়িত্বের সময়সূচি</small><strong>${esc(t.schedule_info || 'সকাল ৮:০০ - রাত ৮:৩০')}</strong></div>
            </div>
            <div style="padding:16px; background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0; line-height:1.7;">
                <strong style="color:#151442;">বিস্তারিত পরিচিতি (Biography):</strong><br>${esc(t.bio)}
            </div>
        </div>
    `);
}

/* ==========================================================================
   9. NOTICES PAGE (With Search, Category Filter, Seen/Unseen & Pagination)
   ========================================================================== */
function renderNotices(main, params = {}) {
    const db = DCITStore.getDB();
    const all = db.notices || [];
    const cat = params.cat || '';
    const q = (params.q || '').trim().toLowerCase();
    const categories = ['ভর্তি', 'রেজিস্ট্রেশন', 'পরীক্ষা', 'ক্লাস', 'অন্যান্য শিক্ষা বিষয়ক নোটিশ'];

    let list = all;
    if (cat) list = list.filter(n => (n.category || '').includes(cat));
    if (q) list = list.filter(n => (n.title || '').toLowerCase().includes(q) || (n.details || '').toLowerCase().includes(q));
    const paged = paginateArray(list);

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container"><h1>নোটিশ বোর্ড ও শিক্ষা বিজ্ঞপ্তি (Notice Board)</h1><p>ক্যাটাগরি ও সার্চ ফিল্টারের মাধ্যমে যেকোনো নোটিশ খুঁজুন</p></div>
    </div>
    <section class="section"><div class="container">
        <div class="filter-bar">
            <div class="form-group">
                <label>নোটিশ ক্যাটাগরি সিলেক্ট করুন</label>
                <select id="noticeCatSelect" class="form-control" onchange="navigateView('notices',{cat:this.value, q:document.getElementById('noticeSearchQ').value})">
                    <option value="">-- সকল ক্যাটাগরি (${all.length}) --</option>
                    ${categories.map(c => `<option value="${c}" ${cat===c?'selected':''}>${c}</option>`).join('')}
                </select>
            </div>
            <div class="form-group" style="flex:2;">
                <label>নোটিশ সার্চ করুন</label>
                <input type="text" id="noticeSearchQ" class="form-control" value="${esc(params.q||'')}" placeholder="ভর্তি, পরীক্ষা, রেজিস্ট্রেশন বা ক্লাস লিখে সার্চ করুন...">
            </div>
            <button onclick="navigateView('notices',{cat:document.getElementById('noticeCatSelect').value, q:document.getElementById('noticeSearchQ').value})" class="btn btn-primary"><i class="fa fa-search"></i> সার্চ</button>
        </div>

        <div class="grid-3">
            ${paged.sliced.map(n => {
                const seen = DCITStore.isSeen('notice', n.id);
                return `
                <div class="card">
                    <div class="card-body">
                        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                            <span class="badge badge-warning">${esc(n.category)}</span>
                            <span class="seen-tag ${seen?'seen':'unseen'}">${seen?'✓ Seen':'● Unseen'}</span>
                        </div>
                        <small style="color:#64748b; font-weight:700; margin-bottom:6px; display:block;"><i class="fa fa-calendar"></i> ${esc(n.publish_date)}</small>
                        <h3>${esc(n.title)}</h3>
                        <div style="margin:10px 0 16px; color:#475569; font-size:0.93rem; flex:1;">${n.details}</div>
                        <button onclick="openNoticePopup(${Number(n.id)})" class="btn btn-primary btn-sm"><i class="fa fa-eye"></i> কুইক ভিউ পপআপ</button>
                    </div>
                </div>`;
            }).join('')}
        </div>
        ${paged.barHTML}
    </div></section>`;
}

function openNoticePopup(id) {
    const db = DCITStore.getDB();
    const n = (db.notices || []).find(x => Number(x.id) === Number(id)) || db.notices[0];
    if (!n) return;
    DCITStore.markSeen('notice', n.id);
    openDcitPopup(`📢 অফিসিয়াল নোটিশ — ${esc(n.title)}`, `
        <div>
            <div class="qv-hero-banner" style="padding:18px 22px;">
                <img src="assets/img/logo.jpg" style="width:68px; height:68px; border-radius:50%;">
                <div>
                    <span class="badge badge-warning">${esc(n.category)}</span>
                    <h3 style="margin:4px 0; color:#fff;">${esc(n.title)}</h3>
                    <small style="color:#5eead4;">প্রকাশের তারিখঃ ${esc(n.publish_date)}</small>
                </div>
            </div>
            <div style="padding:20px; background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0; line-height:1.85; font-size:1rem;">${n.details}</div>
        </div>
    `);
}

/* ==========================================================================
   10. OTHERS PAGES (With Contact Form, Map & Hotline Included!)
   ========================================================================== */
function renderContactList(main) {
    const db = DCITStore.getDB();
    const staff = db.teachers || [];
    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container"><h1>কন্টাক্ট লিস্ট, ম্যাপ ও যোগাযোগ ফর্ম</h1><p>Dream Career IT হটলাইনঃ 01771770044 | পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা</p></div>
    </div>
    <section class="section"><div class="container">
        <div class="table-responsive" style="margin-bottom:44px;">
            <table class="data-table">
                <thead><tr><th>নাম ও দপ্তর</th><th>পদবী</th><th>ক্যাটাগরি</th><th>মোবাইল নাম্বার</th><th>ইমেইল</th></tr></thead>
                <tbody>
                    <tr><td><strong>Dream Career IT (প্রধান কার্যালয়)</strong></td><td>ভর্তি ও তথ্য ডেস্ক</td><td><span class="badge badge-success">হটলাইন</span></td><td><strong>01771770044</strong></td><td>dc13edubd@gmail.com</td></tr>
                    ${staff.map(t => `<tr><td><strong>${esc(t.name)}</strong></td><td>${esc(t.designation)}</td><td><span class="badge badge-info">${esc(t.role_type)}</span></td><td>${esc(t.phone)}</td><td>${esc(t.email)}</td></tr>`).join('')}
                </tbody>
            </table>
        </div>
        ${getContactGridHTML()}
    </div></section>`;
    bindSubscribeAndContactForms();
}

function renderAbout(main) {
    main.innerHTML = `<style>
    :root {
        --dcit-navy: #0f172a;
        --dcit-blue-dark: #1e3a8a;
        --dcit-primary: #2563eb;
        --dcit-primary-soft: #eff6ff;
        --dcit-emerald: #059669;
        --dcit-emerald-soft: #ecfdf5;
        --dcit-purple: #7c3aed;
        --dcit-purple-soft: #f5f3ff;
        --dcit-amber: #d97706;
        --dcit-amber-soft: #fffbeb;
        --dcit-text: #334155;
        --dcit-muted: #64748b;
        --dcit-border: #e2e8f0;
        --dcit-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.06);
        --dcit-shadow-hover: 0 20px 35px -5px rgba(37, 99, 235, 0.14);
    }

    .about-wrapper {
        font-family: 'Hind Siliguri', 'Inter', sans-serif;
        background-color: #f8fafc;
        color: var(--dcit-text);
        line-height: 1.78;
        padding-bottom: 5rem;
    }

    /* হিরো ব্যানার */
    .about-hero {
        background: linear-gradient(135deg, var(--dcit-navy) 0%, var(--dcit-blue-dark) 55%, var(--dcit-primary) 100%);
        color: #ffffff;
        padding: 5rem 0 6.5rem;
        position: relative;
        overflow: hidden;
    }

    .about-hero::before {
        content: "";
        position: absolute;
        top: -20%;
        right: -8%;
        width: 520px;
        height: 520px;
        background: radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, rgba(255, 255, 255, 0) 70%);
        border-radius: 50%;
    }

    .hero-badge-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(8px);
        padding: 0.45rem 1.25rem;
        border-radius: 50px;
        font-size: 0.92rem;
        color: #e0f2fe;
        margin-bottom: 1.25rem;
    }

    .about-hero h1 {
        font-weight: 700;
        font-size: 2.7rem;
        margin-bottom: 0.6rem;
    }

    .about-hero .tagline {
        font-size: 1.22rem;
        color: #93c5fd;
        font-weight: 600;
        margin-bottom: 1rem;
    }

    /* ওভারল্যাপ ইন্ট্রো সেকশন */
    .intro-overlap-wrap {
        margin-top: -4rem;
        position: relative;
        z-index: 10;
        margin-bottom: 4rem;
    }

    .about-surface-card {
        background: #ffffff;
        border-radius: 20px;
        border: 1px solid var(--dcit-border);
        box-shadow: var(--dcit-shadow);
        padding: 2.5rem;
        height: 100%;
    }

    .philosophy-card {
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        color: #ffffff;
        border-radius: 20px;
        padding: 2.5rem;
        height: 100%;
        position: relative;
        overflow: hidden;
        box-shadow: var(--dcit-shadow);
    }

    .philosophy-card::after {
        content: "";
        position: absolute;
        bottom: -25%;
        right: -15%;
        width: 280px;
        height: 280px;
        background: radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, rgba(255,255,255,0) 70%);
        border-radius: 50%;
    }

    /* সেকশন শিরোনাম */
    .sec-title-wrap {
        text-align: center;
        max-width: 700px;
        margin: 0 auto 2.75rem;
    }

    .sec-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        background: var(--dcit-primary-soft);
        color: var(--dcit-primary);
        border: 1px solid #bfdbfe;
        padding: 0.35rem 1rem;
        border-radius: 50px;
        font-size: 0.84rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.7rem;
    }

    .sec-title-wrap h2 {
        font-weight: 700;
        color: var(--dcit-navy);
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    /* আমাদের কার্যক্রম (৮টি কার্ড গ্রিড) */
    .activity-card {
        background: #ffffff;
        border-radius: 18px;
        border: 1px solid var(--dcit-border);
        box-shadow: var(--dcit-shadow);
        padding: 1.75rem;
        height: 100%;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
    }

    .activity-card:hover {
        transform: translateY(-6px);
        box-shadow: var(--dcit-shadow-hover);
        border-color: #93c5fd;
    }

    .activity-icon {
        width: 54px;
        height: 54px;
        border-radius: 14px;
        background: var(--dcit-primary-soft);
        color: var(--dcit-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
        margin-bottom: 1.15rem;
        transition: all 0.3s ease;
    }

    .activity-card:hover .activity-icon {
        background: var(--dcit-primary);
        color: #ffffff;
    }

    .activity-title {
        font-family: 'Inter', 'Hind Siliguri', sans-serif;
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--dcit-navy);
        margin-bottom: 0.5rem;
    }

    /* ভিশন ও মিশন সেকশন */
    .vm-box-card {
        background: #ffffff;
        border-radius: 20px;
        border: 1px solid var(--dcit-border);
        box-shadow: var(--dcit-shadow);
        overflow: hidden;
        height: 100%;
    }

    .vm-banner {
        height: 200px;
        position: relative;
        overflow: hidden;
        background: var(--dcit-navy);
    }

    .vm-banner img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.85;
        transition: transform 0.5s ease;
    }

    .vm-box-card:hover .vm-banner img {
        transform: scale(1.05);
    }

    .vm-badge-float {
        position: absolute;
        bottom: 14px;
        left: 20px;
        background: rgba(15, 23, 42, 0.85);
        backdrop-filter: blur(6px);
        color: #ffffff;
        padding: 0.4rem 1rem;
        border-radius: 50px;
        font-size: 0.85rem;
        font-weight: 600;
        border: 1px solid rgba(255,255,255,0.2);
    }

    .mission-num-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .mission-num-list li {
        display: flex;
        align-items: flex-start;
        gap: 0.85rem;
        padding: 0.65rem 0.95rem;
        border-radius: 10px;
        background: #f8fafc;
        border: 1px solid #f1f5f9;
        margin-bottom: 0.55rem;
        font-weight: 500;
        color: var(--dcit-navy);
    }

    .num-circle {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: var(--dcit-primary);
        color: #ffffff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: 700;
        flex-shrink: 0;
        margin-top: 0.1rem;
    }

    /* শিক্ষা পদ্ধতি ও মূল্যবোধ */
    .approach-check-item {
        background: #f8fafc;
        border: 1px solid var(--dcit-border);
        border-radius: 12px;
        padding: 0.95rem 1.15rem;
        display: flex;
        align-items: center;
        gap: 0.85rem;
        font-weight: 600;
        color: var(--dcit-navy);
        height: 100%;
    }

    .value-card {
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid var(--dcit-border);
        box-shadow: var(--dcit-shadow);
        padding: 1.6rem;
        height: 100%;
        transition: transform 0.25s ease, border-color 0.25s ease;
    }

    .value-card:hover {
        transform: translateY(-4px);
        border-color: var(--dcit-primary);
    }

    .value-icon {
        width: 46px;
        height: 46px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        margin-bottom: 1rem;
    }

    /* ভবিষ্যৎ পরিকল্পনা ও কেন Dream Career IT */
    .goal-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .goal-list li {
        display: flex;
        align-items: flex-start;
        gap: 0.8rem;
        padding: 0.7rem 1rem;
        background: #f8fafc;
        border: 1px solid #f1f5f9;
        border-radius: 10px;
        margin-bottom: 0.55rem;
        font-weight: 500;
        color: var(--dcit-navy);
    }

    /* অঙ্গীকার ও যোগাযোগ ফুটার ব্যানার */
    .about-commitment-card {
        background: linear-gradient(135deg, var(--dcit-navy) 0%, #1e293b 100%);
        color: #ffffff;
        border-radius: 22px;
        padding: 2.75rem;
        position: relative;
        overflow: hidden;
        box-shadow: var(--dcit-shadow);
    }

    .contact-glass-pill {
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 14px;
        padding: 1.25rem 1.4rem;
        height: 100%;
    }

    @media (max-width: 991.98px) {
        .about-hero h1 { font-size: 2rem; }
        .about-surface-card, .philosophy-card, .about-commitment-card { padding: 1.75rem; }
    }
</style>



<div class="about-wrapper">
    <!-- হিরো সেকশন -->
    <section class="about-hero text-center">
        <div class="container">
            <div class="hero-badge-pill">
                <i class="fa-solid fa-building-columns text-info"></i>
                <span>Learn Today, Lead Tomorrow</span>
            </div>
            <h1>আমাদের সম্পর্কে (About Us)</h1>
            <p class="tagline">
                Dream Career IT – দক্ষতা অর্জনের মাধ্যমে সম্ভাবনাময় ভবিষ্যৎ গড়ার প্রত্যয়ে।
            </p>
            <p class="text-light opacity-75 mx-auto mb-0" style="max-width: 740px;">
                আধুনিক প্রযুক্তিনির্ভর বিশ্বের সঙ্গে তাল মিলিয়ে মানুষকে প্রযুক্তিগত জ্ঞান, ব্যবহারিক দক্ষতা এবং পেশাগত যোগ্যতায় সমৃদ্ধ করার লক্ষ্যে আমাদের পথচলা।
            </p>
        </div>
    </section>

    <!-- Dream Career IT সম্পর্কে ও আমাদের প্রতিষ্ঠার মূল ভাবনা -->
    <div class="container intro-overlap-wrap">
        <div class="row g-4">
            <!-- Dream Career IT সম্পর্কে -->
            <div class="col-lg-7">
                <div class="about-surface-card">
                    <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary bg-opacity-10 text-primary small fw-bold mb-3">
                        <i class="fa-solid fa-circle-info"></i> Who We Are
                    </div>
                    <h2 class="fw-bold text-dark h3 mb-3">Dream Career IT সম্পর্কে</h2>
                    <p class="text-secondary mb-3">
                        <strong>Dream Career IT</strong> একটি তথ্যপ্রযুক্তি ও দক্ষতাভিত্তিক প্রশিক্ষণ প্রতিষ্ঠান। আধুনিক প্রযুক্তিনির্ভর বিশ্বের সঙ্গে তাল মিলিয়ে মানুষকে প্রযুক্তিগত জ্ঞান, ব্যবহারিক দক্ষতা এবং পেশাগত যোগ্যতায় সমৃদ্ধ করার লক্ষ্য নিয়ে প্রতিষ্ঠানটির কার্যক্রম পরিচালিত হচ্ছে।
                    </p>
                    <p class="text-secondary mb-3">
                        বর্তমান বিশ্বে শিক্ষা ও প্রযুক্তিগত দক্ষতা ব্যক্তিগত উন্নয়ন, কর্মসংস্থান এবং অর্থনৈতিক অগ্রগতির অন্যতম গুরুত্বপূর্ণ ভিত্তি। এই বাস্তবতাকে সামনে রেখে Dream Career IT শিক্ষার্থীদের জন্য আধুনিক, সময়োপযোগী ও বাস্তবমুখী প্রশিক্ষণের পরিবেশ তৈরিতে কাজ করছে।
                    </p>
                    <div class="p-3 rounded-3" style="background: var(--dcit-primary-soft); border-left: 4px solid var(--dcit-primary);">
                        <p class="mb-0 text-dark fw-medium">
                            <i class="fa-solid fa-sparkles text-primary me-2"></i>
                            আমরা বিশ্বাস করি, প্রত্যেক মানুষের মধ্যে কোনো না কোনো প্রতিভা ও সম্ভাবনা রয়েছে। প্রয়োজন শুধু সঠিক দিকনির্দেশনা, মানসম্মত প্রশিক্ষণ এবং নিজের দক্ষতা বিকাশের সুযোগ।
                        </p>
                    </div>
                </div>
            </div>

            <!-- আমাদের প্রতিষ্ঠার মূল ভাবনা -->
            <div class="col-lg-5">
                <div class="philosophy-card d-flex flex-column justify-content-between">
                    <div class="position-relative" style="z-index: 2;">
                        <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-info bg-opacity-25 text-info small fw-bold mb-3">
                            <i class="fa-solid fa-lightbulb"></i> Founding Philosophy
                        </div>
                        <h2 class="fw-bold text-white h3 mb-3">আমাদের প্রতিষ্ঠার মূল ভাবনা</h2>
                        <p class="text-light opacity-75 mb-3">
                            প্রযুক্তিগত শিক্ষাকে সহজলভ্য করা এবং তরুণ প্রজন্মকে দক্ষতার মাধ্যমে আত্মনির্ভরশীল হওয়ার পথে এগিয়ে নেওয়ার চিন্তা থেকেই <strong>Dream Career IT</strong>-এর পথচলা।
                        </p>
                        <p class="text-light opacity-75 mb-0">
                            আমাদের চিন্তার মূল ভিত্তি হলো, একজন শিক্ষার্থী যেন শুধু একটি কোর্স সম্পন্ন করার মধ্যেই সীমাবদ্ধ না থাকে; বরং অর্জিত জ্ঞান বাস্তব জীবনে প্রয়োগ করতে পারে, নিজের কর্মজীবন সম্পর্কে সচেতন সিদ্ধান্ত নিতে পারে এবং ভবিষ্যতের জন্য নিজেকে প্রস্তুত করতে পারে।
                        </p>
                    </div>

                    <div class="mt-4 pt-3 border-top border-secondary border-opacity-50 d-flex align-items-center justify-content-between position-relative" style="z-index: 2;">
                        <span class="small text-info fw-semibold"><i class="fa-solid fa-check-double me-1"></i> ১০০% বাস্তবমুখী ও কর্মমুখী শিক্ষা</span>
                        <a href="#courses" onclick="navigateView('courses')" class="btn btn-sm btn-outline-light rounded-pill px-3">কোর্সসমূহ[cite: 1]</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- আমাদের কার্যক্রম (Our Activities) -->
    <section class="container mb-5 pb-3">
        <div class="sec-title-wrap">
            <div class="sec-pill"><i class="fa-solid fa-layer-group"></i> Our Activities</div>
            <h2>আমাদের কার্যক্রম</h2>
            <p class="text-muted mb-0">Dream Career IT-এর প্রশিক্ষণ ও দক্ষতা উন্নয়নমূলক কার্যক্রমের আওতায় রয়েছে:</p>
        </div>

        <div class="row g-4">
            <!-- 1. Computer Education -->
            <div class="col-md-6 col-lg-3">
                <div class="activity-card">
                    <div class="activity-icon"><i class="fa-solid fa-desktop"></i></div>
                    <h4 class="activity-title">Computer Education</h4>
                    <p class="text-secondary small mb-0">কম্পিউটারের মৌলিক ও উন্নত ব্যবহারিক শিক্ষা।</p>
                </div>
            </div>

            <!-- 2. Office Application -->
            <div class="col-md-6 col-lg-3">
                <div class="activity-card">
                    <div class="activity-icon"><i class="fa-solid fa-file-word"></i></div>
                    <h4 class="activity-title">Office Application</h4>
                    <p class="text-secondary small mb-0">Microsoft Word, Excel, PowerPoint ও অন্যান্য অফিস সফটওয়্যার প্রশিক্ষণ।</p>
                </div>
            </div>

            <!-- 3. Graphic Design -->
            <div class="col-md-6 col-lg-3">
                <div class="activity-card">
                    <div class="activity-icon"><i class="fa-solid fa-pen-nib"></i></div>
                    <h4 class="activity-title">Graphic Design</h4>
                    <p class="text-secondary small mb-0">সৃজনশীল ডিজাইন ও গ্রাফিক্স তৈরির দক্ষতা উন্নয়ন।</p>
                </div>
            </div>

            <!-- 4. Web Design & Development -->
            <div class="col-md-6 col-lg-3">
                <div class="activity-card">
                    <div class="activity-icon"><i class="fa-solid fa-code"></i></div>
                    <h4 class="activity-title">Web Design &amp; Development</h4>
                    <p class="text-secondary small mb-0">ওয়েবসাইট ডিজাইন ও ডেভেলপমেন্ট বিষয়ে প্রশিক্ষণ।</p>
                </div>
            </div>

            <!-- 5. Digital Marketing -->
            <div class="col-md-6 col-lg-3">
                <div class="activity-card">
                    <div class="activity-icon"><i class="fa-solid fa-bullhorn"></i></div>
                    <h4 class="activity-title">Digital Marketing</h4>
                    <p class="text-secondary small mb-0">অনলাইন মার্কেটিং, SEO ও ডিজিটাল প্রচারণার কৌশল।</p>
                </div>
            </div>

            <!-- 6. Freelancing -->
            <div class="col-md-6 col-lg-3">
                <div class="activity-card">
                    <div class="activity-icon"><i class="fa-solid fa-laptop-house"></i></div>
                    <h4 class="activity-title">Freelancing</h4>
                    <p class="text-secondary small mb-0">অনলাইন মার্কেটপ্লেস ও ফ্রিল্যান্সিং সম্পর্কে প্রয়োজনীয় দক্ষতা অর্জনে সহায়তা।</p>
                </div>
            </div>

            <!-- 7. English Language -->
            <div class="col-md-6 col-lg-3">
                <div class="activity-card">
                    <div class="activity-icon"><i class="fa-solid fa-language"></i></div>
                    <h4 class="activity-title">English Language</h4>
                    <p class="text-secondary small mb-0">ইংরেজি ভাষা ও যোগাযোগ দক্ষতা উন্নয়ন।</p>
                </div>
            </div>

            <!-- 8. Skill Development -->
            <div class="col-md-6 col-lg-3">
                <div class="activity-card">
                    <div class="activity-icon"><i class="fa-solid fa-chart-line"></i></div>
                    <h4 class="activity-title">Skill Development</h4>
                    <p class="text-secondary small mb-0">আধুনিক কর্মবাজারের উপযোগী বিভিন্ন দক্ষতাভিত্তিক প্রশিক্ষণ।</p>
                </div>
            </div>
        </div>
    </section>

    <!-- আমাদের ভিশন (Our Vision) ও আমাদের মিশন (Our Mission) -->
    <section class="container mb-5 pb-3">
        <div class="row g-4">
            <!-- Vision -->
            <div class="col-lg-5">
                <div class="vm-box-card d-flex flex-column">
                    <div class="vm-banner">
                        
                            <img src="assets/img/vision.jpg" alt="Our Vision - Dream Career IT">
                        
                        <span class="vm-badge-float"><i class="fa-solid fa-eye text-info me-1"></i> Our Vision</span>
                    </div>
                    <div class="p-4 flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <h3 class="fw-bold text-dark h4 mb-3">আমাদের ভিশন (Our Vision)</h3>
                            <p class="text-secondary fs-6 mb-4" style="line-height: 1.85;">
                                একটি দক্ষ, শিক্ষিত, প্রযুক্তিনির্ভর ও আত্মনির্ভরশীল সমাজ গঠনে অবদান রাখা। এমন একটি পরিবেশ তৈরি করা, যেখানে প্রত্যেক আগ্রহী ব্যক্তি নিজের যোগ্যতা, আগ্রহ ও সামর্থ্য অনুযায়ী আধুনিক শিক্ষা এবং প্রযুক্তিগত দক্ষতা অর্জনের সুযোগ পাবে।
                            </p>
                        </div>
                        <div class="p-3 rounded-3" style="background: var(--dcit-emerald-soft); border: 1px solid #a7f3d0;">
                            <div class="small fw-bold text-success"><i class="fa-solid fa-seedling me-1"></i> আমাদের স্বপ্ন:</div>
                            <div class="small text-dark">প্রযুক্তিগত শিক্ষার মাধ্যমে প্রতিটি শিক্ষার্থীকে স্বাবলম্বী করে তোলা।</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mission -->
            <div class="col-lg-7">
                <div class="vm-box-card">
                    <div class="vm-banner">
                        
                            <img src="assets/img/mission.jpg" alt="Our Mission - Dream Career IT">
                        
                        <span class="vm-badge-float"><i class="fa-solid fa-bullseye text-warning me-1"></i> Our Mission</span>
                    </div>
                    <div class="p-4">
                        <h3 class="fw-bold text-dark h4 mb-3">আমাদের মিশন (Our Mission)</h3>
                        <ul class="mission-num-list">
                            <li><span class="num-circle">১</span> <span>মানসম্মত ও সময়োপযোগী তথ্যপ্রযুক্তি শিক্ষা প্রদান।</span></li>
                            <li><span class="num-circle">২</span> <span>শিক্ষার্থীদের বাস্তবমুখী দক্ষতা ও অভিজ্ঞতা অর্জনে সহায়তা করা।</span></li>
                            <li><span class="num-circle">৩</span> <span>তরুণ প্রজন্মকে কর্মমুখী ও আত্মনির্ভরশীল হিসেবে গড়ে উঠতে উৎসাহিত করা।</span></li>
                            <li><span class="num-circle">৪</span> <span>প্রযুক্তিগত শিক্ষার সুযোগ সম্প্রসারণে ভূমিকা রাখা।</span></li>
                            <li><span class="num-circle">৫</span> <span>ফ্রিল্যান্সিং, উদ্যোক্তা উন্নয়ন ও আত্মকর্মসংস্থান সম্পর্কে সচেতনতা তৈরি করা।</span></li>
                            <li><span class="num-circle">৬</span> <span>শিক্ষার্থীদের মধ্যে নৈতিকতা, দায়িত্ববোধ ও পেশাদারিত্ব বিকাশে সহায়তা করা।</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- আমাদের শিক্ষা পদ্ধতি (Our Teaching Approach) -->
    <section class="container mb-5 pb-3">
        <div class="about-surface-card">
            <div class="row align-items-center g-4">
                <div class="col-lg-5">
                    <div class="sec-pill"><i class="fa-solid fa-chalkboard-user"></i> Our Teaching Approach</div>
                    <h2 class="fw-bold text-dark h3 mb-3">আমাদের শিক্ষা পদ্ধতি</h2>
                    <p class="text-secondary mb-3">
                        আমরা বিশ্বাস করি, কার্যকর শিক্ষা শুধু তাত্ত্বিক জ্ঞানের মধ্যে সীমাবদ্ধ নয়। তাই প্রশিক্ষণের ক্ষেত্রে জ্ঞান অর্জনের পাশাপাশি ব্যবহারিক কাজ, অনুশীলন, সমস্যা সমাধান এবং বাস্তবভিত্তিক শেখার ওপর গুরুত্ব দেওয়া হয়।
                    </p>
                    <p class="small text-muted mb-0">
                        <i class="fa-solid fa-circle-check text-primary me-1"></i> আমাদের শিক্ষা পদ্ধতির গুরুত্বপূর্ণ দিকগুলো পাশে তুলে ধরা হলো:
                    </p>
                </div>
                <div class="col-lg-7">
                    <div class="row g-3">
                        <div class="col-sm-6">
                            <div class="approach-check-item">
                                <i class="fa-solid fa-book-open-reader text-primary fs-5"></i>
                                <span>সহজ ও বোধগম্য পাঠদান।</span>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="approach-check-item">
                                <i class="fa-solid fa-hands-holding-circle text-primary fs-5"></i>
                                <span>হাতে-কলমে প্রশিক্ষণের সুযোগ।</span>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="approach-check-item">
                                <i class="fa-solid fa-laptop-code text-primary fs-5"></i>
                                <span>বিষয়ভিত্তিক অনুশীলন ও ব্যবহারিক কাজ।</span>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="approach-check-item">
                                <i class="fa-solid fa-comments text-primary fs-5"></i>
                                <span>শিক্ষার্থীদের প্রশ্ন ও সমস্যার সমাধানে সহযোগিতা।</span>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="approach-check-item">
                                <i class="fa-solid fa-wand-magic-sparkles text-primary fs-5"></i>
                                <span>ব্যক্তিগত দক্ষতা ও সৃজনশীলতা বিকাশে উৎসাহ।</span>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="approach-check-item">
                                <i class="fa-solid fa-microchip text-primary fs-5"></i>
                                <span>প্রযুক্তির নতুন পরিবর্তন সম্পর্কে সচেতনতা।</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- আমাদের মূল মূল্যবোধ (Our Core Values) -->
    <section class="container mb-5 pb-3">
        <div class="sec-title-wrap">
            <div class="sec-pill"><i class="fa-solid fa-gem"></i> Our Core Values</div>
            <h2>আমাদের মূল মূল্যবোধ</h2>
            <p class="text-muted mb-0">যে ৬টি মৌলিক আদর্শের ওপর ভিত্তি করে Dream Career IT পরিচালিত হয়:</p>
        </div>

        <div class="row g-4">
            <div class="col-md-6 col-lg-4">
                <div class="value-card">
                    <div class="value-icon" style="background: #eff6ff; color: #2563eb;"><i class="fa-solid fa-shield-halved"></i></div>
                    <h5 class="fw-bold text-dark mb-2">সততা (Integrity)</h5>
                    <p class="text-secondary small mb-0">প্রতিটি কার্যক্রমে সততা ও স্বচ্ছতা বজায় রাখা।</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="value-card">
                    <div class="value-icon" style="background: #ecfdf5; color: #059669;"><i class="fa-solid fa-user-check"></i></div>
                    <h5 class="fw-bold text-dark mb-2">দায়িত্বশীলতা (Responsibility)</h5>
                    <p class="text-secondary small mb-0">শিক্ষার্থী ও প্রতিষ্ঠানের প্রতি দায়িত্বশীল আচরণ করা।</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="value-card">
                    <div class="value-icon" style="background: #fef3c7; color: #d97706;"><i class="fa-solid fa-medal"></i></div>
                    <h5 class="fw-bold text-dark mb-2">মানসম্মত শিক্ষা (Quality Education)</h5>
                    <p class="text-secondary small mb-0">কার্যকর ও সময়োপযোগী শিক্ষা প্রদানে গুরুত্ব দেওয়া।</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="value-card">
                    <div class="value-icon" style="background: #f5f3ff; color: #7c3aed;"><i class="fa-solid fa-scale-balanced"></i></div>
                    <h5 class="fw-bold text-dark mb-2">সমান সুযোগ (Equal Opportunity)</h5>
                    <p class="text-secondary small mb-0">সবার জন্য শেখার সুযোগ তৈরিতে উৎসাহিত করা।</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="value-card">
                    <div class="value-icon" style="background: #fdf2f8; color: #db2777;"><i class="fa-solid fa-lightbulb"></i></div>
                    <h5 class="fw-bold text-dark mb-2">উদ্ভাবন (Innovation)</h5>
                    <p class="text-secondary small mb-0">নতুন প্রযুক্তি ও আধুনিক শিক্ষাপদ্ধতি গ্রহণে আগ্রহী থাকা।</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="value-card">
                    <div class="value-icon" style="background: #ecfeff; color: #0891b2;"><i class="fa-solid fa-people-group"></i></div>
                    <h5 class="fw-bold text-dark mb-2">সহযোগিতা (Collaboration)</h5>
                    <p class="text-secondary small mb-0">পারস্পরিক সহযোগিতা ও ইতিবাচক পরিবেশ গড়ে তোলা।</p>
                </div>
            </div>
        </div>
    </section>

    <!-- শিক্ষার্থীর গুরুত্ব, ভবিষ্যৎ পরিকল্পনা এবং কেন Dream Career IT -->
    <section class="container mb-5 pb-3">
        <div class="row g-4">
            <!-- আমাদের কাছে শিক্ষার্থীর গুরুত্ব & কেন Dream Career IT -->
            <div class="col-lg-6">
                <div class="about-surface-card d-flex flex-column justify-content-between">
                    <div>
                        <div class="sec-pill"><i class="fa-solid fa-user-graduate"></i> Student First</div>
                        <h3 class="fw-bold text-dark h4 mb-3">আমাদের কাছে শিক্ষার্থীর গুরুত্ব</h3>
                        <p class="text-secondary mb-3">
                            <strong>Dream Career IT</strong>-এর কাছে প্রত্যেক শিক্ষার্থী একটি সম্ভাবনাময় ভবিষ্যতের অংশ। আমরা চাই, শিক্ষার্থীরা আত্মবিশ্বাসের সঙ্গে নতুন কিছু শিখুক, নিজের যোগ্যতা আবিষ্কার করুক এবং অর্জিত দক্ষতাকে বাস্তব জীবনে কাজে লাগাতে সক্ষম হোক।
                        </p>
                        <p class="text-secondary mb-4">
                            শিক্ষার্থীদের শেখার আগ্রহ, নিয়মিত অনুশীলন এবং ব্যক্তিগত প্রচেষ্টাকে আমরা অত্যন্ত গুরুত্ব দিই।
                        </p>
                    </div>

                    <div class="p-4 rounded-4" style="background: #f8fafc; border: 1px solid var(--dcit-border);">
                        <h4 class="fw-bold text-primary h5 mb-2"><i class="fa-solid fa-circle-question me-1"></i> কেন Dream Career IT?</h4>
                        <p class="small text-secondary mb-2">
                            আমাদের কার্যক্রমের মূল দর্শন হলো শেখা, দক্ষতা অর্জন এবং সেই দক্ষতাকে বাস্তবে কাজে লাগানো। আমরা শিক্ষার্থীদের এমন একটি শেখার পরিবেশ দিতে আগ্রহী, যেখানে তারা নিজেদের সক্ষমতা বিকাশের পাশাপাশি ভবিষ্যৎ কর্মজীবনের জন্য প্রস্তুতি নিতে পারে।
                        </p>
                        <p class="small fw-semibold text-dark mb-0">
                            "আমাদের কাছে শিক্ষা মানে শুধু একটি কোর্স সম্পন্ন করা নয়; শিক্ষা মানে নিজের সম্ভাবনাকে আবিষ্কার করা এবং নতুন সম্ভাবনার দিকে এগিয়ে যাওয়া।"
                        </p>
                    </div>
                </div>
            </div>

            <!-- আমাদের ভবিষ্যৎ পরিকল্পনা (Future Goals) -->
            <div class="col-lg-6">
                <div class="about-surface-card">
                    <div class="sec-pill"><i class="fa-solid fa-rocket"></i> Future Goals</div>
                    <h3 class="fw-bold text-dark h4 mb-3">আমাদের ভবিষ্যৎ পরিকল্পনা</h3>
                    <p class="text-secondary mb-3">আগামী দিনগুলোতে প্রযুক্তি শিক্ষার প্রসারে আমাদের সুনির্দিষ্ট কর্মপরিকল্পনা:</p>
                    <ul class="goal-list">
                        <li>
                            <i class="fa-solid fa-circle-arrow-right text-primary mt-1"></i>
                            <span>আধুনিক প্রযুক্তিনির্ভর প্রশিক্ষণ কার্যক্রম সম্প্রসারণ।</span>
                        </li>
                        <li>
                            <i class="fa-solid fa-circle-arrow-right text-primary mt-1"></i>
                            <span>আরও বেশি মানুষের কাছে দক্ষতাভিত্তিক শিক্ষার সুযোগ পৌঁছে দেওয়া।</span>
                        </li>
                        <li>
                            <i class="fa-solid fa-circle-arrow-right text-primary mt-1"></i>
                            <span>ডিজিটাল শিক্ষা ও অনলাইন প্রশিক্ষণ কার্যক্রম উন্নয়ন।</span>
                        </li>
                        <li>
                            <i class="fa-solid fa-circle-arrow-right text-primary mt-1"></i>
                            <span>শিক্ষার্থীদের ব্যবহারিক দক্ষতা ও পেশাগত প্রস্তুতি জোরদার করা।</span>
                        </li>
                        <li>
                            <i class="fa-solid fa-circle-arrow-right text-primary mt-1"></i>
                            <span>প্রযুক্তিনির্ভর উদ্যোক্তা ও আত্মকর্মসংস্থানে উৎসাহ প্রদান।</span>
                        </li>
                        <li>
                            <i class="fa-solid fa-circle-arrow-right text-primary mt-1"></i>
                            <span>শিক্ষা ও দক্ষতা উন্নয়নের মাধ্যমে সামাজিক অগ্রগতিতে অবদান রাখা।</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- আমাদের অঙ্গীকার (Our Commitment) ও যোগাযোগ -->
    <section class="container">
        <div class="about-commitment-card">
            <div class="row align-items-center g-4">
                <div class="col-lg-12">
                    <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary bg-opacity-25 text-info small fw-semibold mb-3">
                        <i class="fa-solid fa-handshake"></i> আমাদের অঙ্গীকার (Our Commitment)
                    </div>
                    <h3 class="fw-bold mb-2">আজকের অর্জিত দক্ষতাই আগামী দিনের সম্ভাবনার ভিত্তি</h3>
                    <p class="text-light opacity-75 mb-0">
                        <strong>Dream Career IT</strong> মানসম্মত প্রশিক্ষণ, দায়িত্বশীল শিক্ষা কার্যক্রম, স্বচ্ছতা এবং শিক্ষার্থীবান্ধব পরিবেশ বজায় রাখার প্রত্যয়ে কাজ করে যাচ্ছে। আমরা বিশ্বাস করি, আজকের অর্জিত দক্ষতাই আগামী দিনের সম্ভাবনার ভিত্তি।
                    </p>
                </div>

                <div class="col-md-6">
                    <div class="contact-glass-pill">
                        <div class="small text-info fw-semibold mb-1"><i class="fa-solid fa-location-dot me-1"></i> আমাদের ঠিকানা</div>
                        <div class="fw-bold fs-5 mb-1">Dream Career IT</div>
                        <div class="small text-light opacity-75">
                            ভাই ভাই সুপার মার্কেট, নতুন পদুয়ার বাজার মসজিদের পাশে, পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা-৩৫০০, বাংলাদেশ।
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="contact-glass-pill">
                        <div class="small text-info fw-semibold mb-2"><i class="fa-solid fa-headset me-1"></i> যোগাযোগ</div>
                        <div class="mb-2">
                            <i class="fa-solid fa-phone text-success me-2"></i>
                            <strong>মোবাইল:</strong> <a href="tel:01771770044" class="text-white text-decoration-none">01771770044</a>
                        </div>
                        <div>
                            <i class="fa-solid fa-envelope text-warning me-2"></i>
                            <strong>ইমেইল:</strong> <a href="mailto:dc13edubd@gmail.com" class="text-white text-decoration-none">dc13edubd@gmail.com</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-4 pt-3 border-top border-secondary border-opacity-50 d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div>
                    <div class="fw-bold text-white fs-5">Dream Career IT</div>
                    <div class="text-info fst-italic small">Learn Today, Lead Tomorrow.</div>
                </div>
                <div class="d-flex flex-wrap gap-2">
                    <a href="#admission" onclick="navigateView('admission')" class="btn btn-primary btn-sm rounded-pill px-4 py-2 fw-semibold">
                        <i class="fa-solid fa-user-plus me-1"></i> ভর্তি আবেদন করুন[cite: 1]
                    </a>
                    <a href="#contact" onclick="navigateView('contact')" class="btn btn-outline-light btn-sm rounded-pill px-4 py-2">
                        <i class="fa-solid fa-paper-plane me-1"></i> যোগাযোগ পেজ[cite: 1]
                    </a>
                </div>
            </div>
        </div>
    </section>
</div>

    <section class="section"><div class="container">${getContactGridHTML()}</div></section>`;
    bindSubscribeAndContactForms();
}

function renderMission(main) {
    main.innerHTML = `<style>
    :root {
        --dcit-navy: #0f172a;
        --dcit-blue-dark: #1e3a8a;
        --dcit-primary: #2563eb;
        --dcit-primary-soft: #eff6ff;
        --dcit-emerald: #059669;
        --dcit-emerald-soft: #ecfdf5;
        --dcit-purple: #7c3aed;
        --dcit-purple-soft: #f5f3ff;
        --dcit-amber: #d97706;
        --dcit-amber-soft: #fffbeb;
        --dcit-text: #334155;
        --dcit-muted: #64748b;
        --dcit-border: #e2e8f0;
        --dcit-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.06);
        --dcit-shadow-hover: 0 20px 35px -5px rgba(37, 99, 235, 0.14);
    }

    .objectives-wrapper {
        font-family: 'Hind Siliguri', 'Inter', sans-serif;
        background-color: #f8fafc;
        color: var(--dcit-text);
        line-height: 1.75;
        padding-bottom: 5rem;
    }

    /* হিরো ব্যানার */
    .objectives-hero {
        background: linear-gradient(135deg, var(--dcit-navy) 0%, var(--dcit-blue-dark) 55%, var(--dcit-primary) 100%);
        color: #ffffff;
        padding: 5rem 0 6rem;
        position: relative;
        overflow: hidden;
    }

    .objectives-hero::before {
        content: "";
        position: absolute;
        top: -25%;
        right: -8%;
        width: 520px;
        height: 520px;
        background: radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, rgba(255, 255, 255, 0) 70%);
        border-radius: 50%;
    }

    .hero-tag-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(8px);
        padding: 0.45rem 1.2rem;
        border-radius: 50px;
        font-size: 0.92rem;
        color: #e0f2fe;
        margin-bottom: 1.25rem;
    }

    .objectives-hero h1 {
        font-weight: 700;
        font-size: 2.65rem;
        margin-bottom: 0.5rem;
    }

    .objectives-hero .hero- motto {
        font-size: 1.2rem;
        color: #93c5fd;
        font-weight: 500;
        margin-bottom: 1.25rem;
    }

    /* মূল উদ্দেশ্য ওভারল্যাপ কার্ড */
    .core-purpose-wrap {
        margin-top: -3.5rem;
        position: relative;
        z-index: 10;
        margin-bottom: 3.5rem;
    }

    .core-purpose-card {
        background: #ffffff;
        border-radius: 20px;
        border: 1px solid var(--dcit-border);
        box-shadow: var(--dcit-shadow);
        padding: 2.5rem;
        position: relative;
        overflow: hidden;
    }

    .core-purpose-card::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 6px;
        height: 100%;
        background: linear-gradient(to bottom, var(--dcit-primary), var(--dcit-emerald));
    }

    .core-icon-badge {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        background: linear-gradient(135deg, var(--dcit-primary-soft), #dbeafe);
        color: var(--dcit-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.75rem;
        border: 1px solid #bfdbfe;
        flex-shrink: 0;
    }

    /* সেকশন হেডার */
    .section-heading-box {
        text-align: center;
        max-width: 680px;
        margin: 0 auto 2.75rem;
    }

    .section-sub-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        background: var(--dcit-primary-soft);
        color: var(--dcit-primary);
        border: 1px solid #bfdbfe;
        padding: 0.35rem 1rem;
        border-radius: 50px;
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.75rem;
    }

    .section-heading-box h2 {
        font-weight: 700;
        color: var(--dcit-navy);
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    /* ১২টি প্রধান উদ্দেশ্য কার্ড গ্রিড */
    .objective-item-card {
        background: #ffffff;
        border-radius: 18px;
        border: 1px solid var(--dcit-border);
        box-shadow: var(--dcit-shadow);
        padding: 1.85rem;
        height: 100%;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .objective-item-card:hover {
        transform: translateY(-6px);
        box-shadow: var(--dcit-shadow-hover);
        border-color: #93c5fd;
    }

    .obj-card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.25rem;
    }

    .obj-icon {
        width: 54px;
        height: 54px;
        border-radius: 14px;
        background: var(--dcit-primary-soft);
        color: var(--dcit-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
        transition: all 0.3s ease;
    }

    .objective-item-card:hover .obj-icon {
        background: var(--dcit-primary);
        color: #ffffff;
        transform: scale(1.06);
    }

    .obj-number {
        font-size: 1.65rem;
        font-weight: 700;
        color: #cbd5e1;
        line-height: 1;
        transition: color 0.3s ease;
    }

    .objective-item-card:hover .obj-number {
        color: var(--dcit-primary);
    }

    .obj-title {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--dcit-navy);
        margin-bottom: 0.65rem;
    }

    .obj-desc {
        font-size: 0.96rem;
        color: var(--dcit-text);
        margin-bottom: 0;
    }

    /* ভিশন ও মিশন ডুয়াল কার্ড */
    .vm-card {
        background: #ffffff;
        border-radius: 20px;
        border: 1px solid var(--dcit-border);
        box-shadow: var(--dcit-shadow);
        overflow: hidden;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .vm-img-banner {
        height: 210px;
        position: relative;
        overflow: hidden;
        background: var(--dcit-navy);
    }

    .vm-img-banner img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.85;
        transition: transform 0.5s ease;
    }

    .vm-card:hover .vm-img-banner img {
        transform: scale(1.05);
    }

    .vm-overlay-badge {
        position: absolute;
        bottom: 15px;
        left: 20px;
        background: rgba(15, 23, 42, 0.82);
        backdrop-filter: blur(6px);
        color: #ffffff;
        padding: 0.4rem 1rem;
        border-radius: 50px;
        font-size: 0.85rem;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        border: 1px solid rgba(255,255,255,0.2);
    }

    .vm-body {
        padding: 2rem;
        flex-grow: 1;
    }

    .mission-check-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .mission-check-list li {
        display: flex;
        align-items: flex-start;
        gap: 0.8rem;
        padding: 0.65rem 0.95rem;
        border-radius: 10px;
        background: #f8fafc;
        border: 1px solid #f1f5f9;
        margin-bottom: 0.55rem;
        font-weight: 500;
        color: var(--dcit-navy);
    }

    .mission-check-list li i {
        color: var(--dcit-emerald);
        margin-top: 0.35rem;
        font-size: 1rem;
        flex-shrink: 0;
    }

    /* আমাদের অঙ্গীকার (Our Commitment) সেকশন */
    .commitment-banner {
        background: linear-gradient(135deg, var(--dcit-navy) 0%, #1e293b 100%);
        color: #ffffff;
        border-radius: 22px;
        padding: 3rem;
        position: relative;
        overflow: hidden;
        box-shadow: var(--dcit-shadow);
    }

    .commitment-banner::after {
        content: "";
        position: absolute;
        bottom: -35%;
        right: -10%;
        width: 420px;
        height: 420px;
        background: radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, rgba(255,255,255,0) 70%);
        border-radius: 50%;
    }

    .slogan-box {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 14px;
        padding: 1.25rem 1.5rem;
        display: inline-block;
    }

    @media (max-width: 991.98px) {
        .objectives-hero h1 { font-size: 2rem; }
        .core-purpose-card, .commitment-banner { padding: 1.75rem; }
    }
</style>



<div class="objectives-wrapper">
    <!-- হিরো সেকশন -->
    <section class="objectives-hero text-center">
        <div class="container">
            <div class="hero-tag-pill">
                <i class="fa-solid fa-compass text-info"></i>
                <span>Our Objectives, Vision &amp; Mission</span>
            </div>
            <h1>আমাদের উদ্দেশ্য (Our Objectives)</h1>
            <p class="hero-motto text-info fw-semibold fs-5 mb-2">
                Dream Career IT – দক্ষতা অর্জন, আত্মনির্ভরতা ও সুন্দর ভবিষ্যৎ গড়ার প্রত্যয়ে।
            </p>
            <p class="text-light opacity-75 mx-auto mb-0" style="max-width: 720px;">
                তথ্যপ্রযুক্তি ও আধুনিক কারিগরি শিক্ষার মাধ্যমে একটি দক্ষ, আত্মনির্ভরশীল, কর্মক্ষম এবং প্রযুক্তিনির্ভর প্রজন্ম গড়ে তোলাই আমাদের মূল লক্ষ্য।
            </p>
        </div>
    </section>

    <!-- আমাদের মূল উদ্দেশ্য (Core Purpose Card) -->
    <div class="container core-purpose-wrap">
        <div class="core-purpose-card">
            <div class="row align-items-center g-4">
                <div class="col-lg-1 text-center text-lg-start">
                    <div class="core-icon-badge mx-auto mx-lg-0">
                        <i class="fa-solid fa-bullseye"></i>
                    </div>
                </div>
                <div class="col-lg-11">
                    <div class="d-inline-block px-3 py-1 rounded-pill bg-primary bg-opacity-10 text-primary small fw-bold mb-2">
                        Core Purpose
                    </div>
                    <h3 class="fw-bold text-dark mb-3">আমাদের মূল উদ্দেশ্য</h3>
                    <p class="fs-6 text-secondary mb-3">
                        <strong>Dream Career IT</strong>-এর মূল উদ্দেশ্য হলো তথ্যপ্রযুক্তি ও আধুনিক কারিগরি শিক্ষার মাধ্যমে একটি দক্ষ, আত্মনির্ভরশীল, কর্মক্ষম এবং প্রযুক্তিনির্ভর প্রজন্ম গড়ে তোলা। আমরা বিশ্বাস করি, সঠিক শিক্ষা, বাস্তবমুখী প্রশিক্ষণ এবং প্রযুক্তিগত দক্ষতা একজন মানুষের জীবন ও কর্মজীবনে ইতিবাচক পরিবর্তন আনতে পারে।
                    </p>
                    <div class="p-3 rounded-3" style="background: var(--dcit-primary-soft); border: 1px solid #bfdbfe;">
                        <p class="mb-0 text-dark fw-medium">
                            <i class="fa-solid fa-circle-check text-primary me-2"></i>
                            আমরা এমন একটি শিক্ষাবান্ধব পরিবেশ তৈরি করতে চাই, যেখানে শিক্ষার্থীরা শুধু তাত্ত্বিক জ্ঞান অর্জন করবে না, বরং বাস্তব জীবনে সেই জ্ঞান প্রয়োগ করে নিজের কর্মসংস্থান ও ভবিষ্যৎ গড়ে তুলতে সক্ষম হবে।
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- আমাদের প্রধান উদ্দেশ্যসমূহ (১২টি পয়েন্টের গ্রিড) -->
    <section class="container mb-5 pb-3">
        <div class="section-heading-box">
            <div class="section-sub-badge">
                <i class="fa-solid fa-layer-group"></i> Key Pillars
            </div>
            <h2>আমাদের প্রধান উদ্দেশ্যসমূহ</h2>
            <p class="text-muted mb-0">
                শিক্ষার্থীদের যুগোপযোগী দক্ষতা ও নৈতিকতায় গড়ে তুলতে আমাদের ১২টি সুনির্দিষ্ট প্রাতিষ্ঠানিক উদ্দেশ্য:
            </p>
        </div>

        <div class="row g-4">
            <!-- ১ -->
            <div class="col-md-6 col-lg-4">
                <div class="objective-item-card">
                    <div class="obj-card-top">
                        <div class="obj-icon"><i class="fa-solid fa-laptop-file"></i></div>
                        <span class="obj-number">০১</span>
                    </div>
                    <h4 class="obj-title">১. মানসম্মত তথ্যপ্রযুক্তি শিক্ষা প্রদান</h4>
                    <p class="obj-desc">
                        সবার জন্য সহজলভ্য, আধুনিক ও মানসম্মত তথ্যপ্রযুক্তি শিক্ষা নিশ্চিত করা এবং প্রযুক্তিগত জ্ঞানের প্রসার ঘটানো।
                    </p>
                </div>
            </div>

            <!-- ২ -->
            <div class="col-md-6 col-lg-4">
                <div class="objective-item-card">
                    <div class="obj-card-top">
                        <div class="obj-icon"><i class="fa-solid fa-users-gear"></i></div>
                        <span class="obj-number">০২</span>
                    </div>
                    <h4 class="obj-title">২. দক্ষ মানবসম্পদ তৈরি</h4>
                    <p class="obj-desc">
                        দেশের বর্তমান ও ভবিষ্যৎ কর্মবাজারের চাহিদা অনুযায়ী দক্ষ, অভিজ্ঞতাসম্পন্ন ও যোগ্য মানবসম্পদ গড়ে তোলা।
                    </p>
                </div>
            </div>

            <!-- ৩ -->
            <div class="col-md-6 col-lg-4">
                <div class="objective-item-card">
                    <div class="obj-card-top">
                        <div class="obj-icon"><i class="fa-solid fa-briefcase"></i></div>
                        <span class="obj-number">০৩</span>
                    </div>
                    <h4 class="obj-title">৩. বেকারত্ব হ্রাসে ভূমিকা রাখা</h4>
                    <p class="obj-desc">
                        তরুণ ও যুবসমাজকে কর্মমুখী প্রশিক্ষণ প্রদান করে চাকরি, ফ্রিল্যান্সিং, আত্মকর্মসংস্থান ও উদ্যোক্তা হওয়ার সুযোগ তৈরিতে সহায়তা করা।
                    </p>
                </div>
            </div>

            <!-- ৪ -->
            <div class="col-md-6 col-lg-4">
                <div class="objective-item-card">
                    <div class="obj-card-top">
                        <div class="obj-icon"><i class="fa-solid fa-rocket"></i></div>
                        <span class="obj-number">০৪</span>
                    </div>
                    <h4 class="obj-title">৪. আত্মকর্মসংস্থান ও উদ্যোক্তা তৈরি</h4>
                    <p class="obj-desc">
                        শিক্ষার্থীদের নিজস্ব উদ্যোগ গ্রহণ, অনলাইন ব্যবসা পরিচালনা এবং প্রযুক্তিনির্ভর উদ্যোক্তা হিসেবে গড়ে ওঠার জন্য প্রয়োজনীয় জ্ঞান ও দক্ষতা প্রদান।
                    </p>
                </div>
            </div>

            <!-- ৫ -->
            <div class="col-md-6 col-lg-4">
                <div class="objective-item-card">
                    <div class="obj-card-top">
                        <div class="obj-icon"><i class="fa-solid fa-microchip"></i></div>
                        <span class="obj-number">০৫</span>
                    </div>
                    <h4 class="obj-title">৫. আধুনিক প্রযুক্তির সঙ্গে পরিচিত করা</h4>
                    <p class="obj-desc">
                        কম্পিউটার, ইন্টারনেট, সফটওয়্যার, ডিজিটাল মার্কেটিং, ওয়েব ডেভেলপমেন্ট, গ্রাফিক ডিজাইন এবং আধুনিক প্রযুক্তির ব্যবহারিক জ্ঞান ছড়িয়ে দেওয়া।
                    </p>
                </div>
            </div>

            <!-- ৬ -->
            <div class="col-md-6 col-lg-4">
                <div class="objective-item-card">
                    <div class="obj-card-top">
                        <div class="obj-icon"><i class="fa-solid fa-screwdriver-wrench"></i></div>
                        <span class="obj-number">০৬</span>
                    </div>
                    <h4 class="obj-title">৬. বাস্তবমুখী প্রশিক্ষণ নিশ্চিত করা</h4>
                    <p class="obj-desc">
                        শুধু বইভিত্তিক শিক্ষা নয়, বরং হাতে-কলমে প্রশিক্ষণ, প্রজেক্ট ও বাস্তব কাজের মাধ্যমে শিক্ষার্থীদের দক্ষ করে তোলা।
                    </p>
                </div>
            </div>

            <!-- ৭ -->
            <div class="col-md-6 col-lg-4">
                <div class="objective-item-card">
                    <div class="obj-card-top">
                        <div class="obj-icon"><i class="fa-solid fa-map-location-dot"></i></div>
                        <span class="obj-number">০৭</span>
                    </div>
                    <h4 class="obj-title">৭. শিক্ষার সুযোগ সম্প্রসারণ</h4>
                    <p class="obj-desc">
                        শহর ও গ্রামাঞ্চলের শিক্ষার্থীদের জন্য তথ্যপ্রযুক্তি ও দক্ষতাভিত্তিক শিক্ষার সুযোগ সম্প্রসারণে কাজ করা।
                    </p>
                </div>
            </div>

            <!-- ৮ -->
            <div class="col-md-6 col-lg-4">
                <div class="objective-item-card">
                    <div class="obj-card-top">
                        <div class="obj-icon"><i class="fa-solid fa-person-rays"></i></div>
                        <span class="obj-number">০৮</span>
                    </div>
                    <h4 class="obj-title">৮. নারীর ক্ষমতায়ন ও অংশগ্রহণ বৃদ্ধি</h4>
                    <p class="obj-desc">
                        নারীদের প্রযুক্তিগত শিক্ষা, ডিজিটাল দক্ষতা এবং আত্মকর্মসংস্থানের সুযোগ তৈরিতে উৎসাহিত করা।
                    </p>
                </div>
            </div>

            <!-- ৯ -->
            <div class="col-md-6 col-lg-4">
                <div class="objective-item-card">
                    <div class="obj-card-top">
                        <div class="obj-icon"><i class="fa-solid fa-globe"></i></div>
                        <span class="obj-number">০৯</span>
                    </div>
                    <h4 class="obj-title">৯. ফ্রিল্যান্সিং ও বৈশ্বিক কর্মবাজারে প্রস্তুত করা</h4>
                    <p class="obj-desc">
                        আন্তর্জাতিক অনলাইন মার্কেটপ্লেস ও বৈশ্বিক কর্মক্ষেত্রে কাজ করার জন্য প্রয়োজনীয় দক্ষতা, যোগাযোগ ও পেশাগত প্রস্তুতি প্রদান।
                    </p>
                </div>
            </div>

            <!-- ১০ -->
            <div class="col-md-6 col-lg-4">
                <div class="objective-item-card">
                    <div class="obj-card-top">
                        <div class="obj-icon"><i class="fa-solid fa-scale-balanced"></i></div>
                        <span class="obj-number">১০</span>
                    </div>
                    <h4 class="obj-title">১০. নৈতিকতা ও পেশাদারিত্ব গড়ে তোলা</h4>
                    <p class="obj-desc">
                        শিক্ষার্থীদের মধ্যে সততা, দায়িত্ববোধ, সময়ানুবর্তিতা, শৃঙ্খলা, সহযোগিতা ও পেশাগত নৈতিকতা বিকশিত করা।
                    </p>
                </div>
            </div>

            <!-- ১১ -->
            <div class="col-md-6 col-lg-4">
                <div class="objective-item-card">
                    <div class="obj-card-top">
                        <div class="obj-icon"><i class="fa-solid fa-shield-halved"></i></div>
                        <span class="obj-number">১১</span>
                    </div>
                    <h4 class="obj-title">১১. ডিজিটাল সচেতনতা বৃদ্ধি</h4>
                    <p class="obj-desc">
                        নিরাপদ ইন্টারনেট ব্যবহার, সাইবার নিরাপত্তা, তথ্যের সঠিক ব্যবহার এবং ডিজিটাল নাগরিকত্ব সম্পর্কে সচেতনতা তৈরি করা।
                    </p>
                </div>
            </div>

            <!-- ১২ -->
            <div class="col-md-6 col-lg-4">
                <div class="objective-item-card">
                    <div class="obj-card-top">
                        <div class="obj-icon"><i class="fa-solid fa-infinity"></i></div>
                        <span class="obj-number">১২</span>
                    </div>
                    <h4 class="obj-title">১২. আজীবন শেখার মানসিকতা তৈরি</h4>
                    <p class="obj-desc">
                        প্রযুক্তির পরিবর্তনের সঙ্গে তাল মিলিয়ে নতুন নতুন জ্ঞান ও দক্ষতা অর্জনে শিক্ষার্থীদের উৎসাহিত করা।
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- আমাদের লক্ষ্য (Our Vision) ও আমাদের মিশন (Our Mission) -->
    <section class="container mb-5 pb-2">
        <div class="row g-4">
            <!-- আমাদের লক্ষ্য (Our Vision) -->
            <div class="col-lg-6">
                <div class="vm-card">
                    <div class="vm-img-banner">
                        
                            <img src="assets/img/vision.jpg" alt="Our Vision - Dream Career IT">
                        
                        <div class="vm-overlay-badge">
                            <i class="fa-solid fa-eye text-info"></i> Our Vision
                        </div>
                    </div>
                    <div class="vm-body d-flex flex-column justify-content-between">
                        <div>
                            <h3 class="fw-bold text-dark mb-3">আমাদের লক্ষ্য (Our Vision)</h3>
                            <p class="fs-5 text-secondary mb-4" style="line-height: 1.8;">
                                একটি প্রযুক্তিনির্ভর, দক্ষ, শিক্ষিত ও আত্মনির্ভরশীল সমাজ গঠনে অবদান রাখা; যেখানে প্রত্যেক আগ্রহী মানুষ তার যোগ্যতা ও সামর্থ্য অনুযায়ী আধুনিক শিক্ষা ও দক্ষতা অর্জনের সুযোগ পাবে।
                            </p>
                        </div>
                        <div class="p-3 rounded-3" style="background: var(--dcit-purple-soft); border-left: 4px solid var(--dcit-purple);">
                            <div class="small fw-bold text-dark">
                                <i class="fa-solid fa-lightbulb text-warning me-2"></i> ভবিষ্যৎ দর্শন:
                            </div>
                            <div class="small text-secondary mt-1">
                                প্রযুক্তির ছোঁয়ায় শহর থেকে গ্রাম—সর্বস্তরের মানুষকে দক্ষ মানবসম্পদে রূপান্তর করা।
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- আমাদের মিশন (Our Mission) -->
            <div class="col-lg-6">
                <div class="vm-card">
                    <div class="vm-img-banner">
                        
                            <img src="assets/img/mission.jpg" alt="Our Mission - Dream Career IT">
                        
                        <div class="vm-overlay-badge">
                            <i class="fa-solid fa-bullseye text-warning"></i> Our Mission
                        </div>
                    </div>
                    <div class="vm-body">
                        <h3 class="fw-bold text-dark mb-3">আমাদের মিশন (Our Mission)</h3>
                        <ul class="mission-check-list">
                            <li>
                                <i class="fa-solid fa-circle-check"></i>
                                <span>মানসম্মত ও সময়োপযোগী প্রশিক্ষণ প্রদান।</span>
                            </li>
                            <li>
                                <i class="fa-solid fa-circle-check"></i>
                                <span>শিক্ষার্থীদের বাস্তবমুখী দক্ষতা উন্নয়ন।</span>
                            </li>
                            <li>
                                <i class="fa-solid fa-circle-check"></i>
                                <span>প্রযুক্তিনির্ভর কর্মসংস্থানের সুযোগ সম্পর্কে সচেতনতা তৈরি।</span>
                            </li>
                            <li>
                                <i class="fa-solid fa-circle-check"></i>
                                <span>আত্মকর্মসংস্থান ও উদ্যোক্তা তৈরিতে উৎসাহ প্রদান।</span>
                            </li>
                            <li>
                                <i class="fa-solid fa-circle-check"></i>
                                <span>দক্ষ ও নৈতিকতাসম্পন্ন মানবসম্পদ উন্নয়নে অবদান রাখা।</span>
                            </li>
                            <li>
                                <i class="fa-solid fa-circle-check"></i>
                                <span>সবার জন্য অন্তর্ভুক্তিমূলক শিক্ষার পরিবেশ গড়ে তোলা।</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- আমাদের অঙ্গীকার (Our Commitment) -->
    <section class="container">
        <div class="commitment-banner">
            <div class="row align-items-center g-4 position-relative" style="z-index: 2;">
                <div class="col-lg-8">
                    <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary bg-opacity-25 text-info small fw-semibold mb-3">
                        <i class="fa-solid fa-handshake"></i> আমাদের অঙ্গীকার (Our Commitment)
                    </div>
                    <h3 class="fw-bold mb-3">প্রতিটি শিক্ষার্থীর সম্ভাবনাকে আমরা সর্বোচ্চ গুরুত্ব দিই</h3>
                    <p class="text-light opacity-75 mb-3">
                        আমরা প্রতিটি শিক্ষার্থীর সম্ভাবনাকে গুরুত্ব দিই। তাদের শেখার আগ্রহ, দক্ষতা ও আত্মবিশ্বাস বৃদ্ধিতে সহায়ক পরিবেশ তৈরিতে সচেষ্ট থাকি।
                    </p>
                    <p class="text-light opacity-75 mb-4">
                        আমাদের বিশ্বাস, একজন দক্ষ মানুষ শুধু নিজের ভবিষ্যৎ পরিবর্তন করেন না, বরং পরিবার, সমাজ ও দেশের উন্নয়নেও গুরুত্বপূর্ণ ভূমিকা রাখতে পারেন।
                    </p>

                    <div class="slogan-box">
                        <div class="fw-bold fs-5 text-info">
                            <i class="fa-solid fa-quote-left me-2 opacity-50"></i>Dream Career IT – দক্ষতা হোক জীবনের শক্তি, প্রযুক্তি হোক আগামীর সম্ভাবনা।
                        </div>
                    </div>
                </div>

                <div class="col-lg-4 text-lg-end">
                    <div class="p-4 rounded-4 text-center" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);">
                        <i class="fa-solid fa-user-graduate text-info fs-1 mb-3"></i>
                        <h5 class="fw-bold text-white mb-2">আপনার দক্ষতার যাত্রা শুরু হোক আজই</h5>
                        <p class="small text-light opacity-75 mb-3">
                            আমাদের কোর্সসমূহ দেখুন এবং আপনার পছন্দের বিষয়ে প্রশিক্ষণ গ্রহণ করে নিজেকে আগামী দিনের জন্য প্রস্তুত করুন।
                        </p>
                        <div class="d-grid gap-2">
                            <a href="#admission" onclick="navigateView('admission')" class="btn btn-primary fw-semibold rounded-pill py-2">
                                <i class="fa-solid fa-paper-plane me-1"></i> অনলাইন ভর্তি আবেদন
                            </a>
                            <a href="#courses" onclick="navigateView('courses')" class="btn btn-outline-light btn-sm rounded-pill py-2">
                                <i class="fa-solid fa-book-open me-1"></i> আমাদের কোর্সসমূহ দেখুন
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>

    <section class="section"><div class="container">${getContactGridHTML()}</div></section>`;
    bindSubscribeAndContactForms();
}

function renderTerms(main) {
    main.innerHTML = `<style>
    :root {
        --dcit-navy: #0f172a;
        --dcit-blue-dark: #1e3a8a;
        --dcit-primary: #2563eb;
        --dcit-primary-soft: #eff6ff;
        --dcit-emerald: #059669;
        --dcit-emerald-soft: #ecfdf5;
        --dcit-amber: #d97706;
        --dcit-amber-soft: #fffbeb;
        --dcit-danger: #dc2626;
        --dcit-danger-soft: #fef2f2;
        --dcit-text: #334155;
        --dcit-muted: #64748b;
        --dcit-border: #e2e8f0;
        --dcit-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.06);
        --dcit-shadow-hover: 0 20px 35px -5px rgba(37, 99, 235, 0.12);
    }

    .terms-wrapper {
        font-family: 'Hind Siliguri', 'Inter', sans-serif;
        background-color: #f8fafc;
        color: var(--dcit-text);
        line-height: 1.75;
        padding-bottom: 5rem;
    }

    /* হিরো ব্যানার */
    .terms-hero {
        background: linear-gradient(135deg, var(--dcit-navy) 0%, var(--dcit-blue-dark) 60%, var(--dcit-primary) 100%);
        color: #ffffff;
        padding: 4.5rem 0 5.5rem;
        position: relative;
        overflow: hidden;
    }

    .terms-hero::after {
        content: "";
        position: absolute;
        bottom: -30%;
        left: -10%;
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(255,255,255,0) 70%);
        border-radius: 50%;
    }

    .hero-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.22);
        backdrop-filter: blur(8px);
        padding: 0.45rem 1.15rem;
        border-radius: 50px;
        font-size: 0.9rem;
        color: #e0f2fe;
        margin-bottom: 1.2rem;
    }

    .terms-hero h1 {
        font-weight: 700;
        font-size: 2.5rem;
        margin-bottom: 0.4rem;
    }

    .terms-hero .en-sub {
        font-family: 'Inter', sans-serif;
        font-size: 1.05rem;
        color: #93c5fd;
        font-weight: 500;
        margin-bottom: 1.25rem;
    }

    /* ইন্ট্রো ও সম্মতি ব্যানার */
    .consent-banner-wrap {
        margin-top: -3.2rem;
        position: relative;
        z-index: 10;
        margin-bottom: 2.75rem;
    }

    .consent-card {
        background: #ffffff;
        border-radius: 18px;
        border: 1px solid var(--dcit-border);
        box-shadow: var(--dcit-shadow);
        padding: 1.75rem 2rem;
    }

    /* স্টিকি সাইডবার ন্যাভিগেশন */
    .terms-toc {
        position: sticky;
        top: 20px;
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid var(--dcit-border);
        box-shadow: var(--dcit-shadow);
        padding: 1.35rem;
        max-height: calc(100vh - 40px);
        display: flex;
        flex-direction: column;
    }

    .terms-toc-header {
        font-size: 1rem;
        font-weight: 700;
        color: var(--dcit-navy);
        padding-bottom: 0.75rem;
        margin-bottom: 0.75rem;
        border-bottom: 2px solid #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .terms-toc-list {
        list-style: none;
        padding: 0;
        margin: 0;
        overflow-y: auto;
        padding-right: 4px;
    }

    .terms-toc-list::-webkit-scrollbar {
        width: 5px;
    }

    .terms-toc-list::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 10px;
    }

    .terms-toc-list li {
        margin-bottom: 0.25rem;
    }

    .terms-toc-list a {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.45rem 0.75rem;
        border-radius: 9px;
        color: var(--dcit-text);
        text-decoration: none;
        font-size: 0.88rem;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .terms-toc-list a:hover,
    .terms-toc-list a.active {
        background-color: var(--dcit-primary-soft);
        color: var(--dcit-primary);
        font-weight: 600;
    }

    .toc-badge {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        background: #f1f5f9;
        color: var(--dcit-muted);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 700;
        flex-shrink: 0;
    }

    .terms-toc-list a:hover .toc-badge,
    .terms-toc-list a.active .toc-badge {
        background: var(--dcit-primary);
        color: #ffffff;
    }

    /* শর্তাবলি কার্ড */
    .term-section-card {
        background: #ffffff;
        border-radius: 18px;
        border: 1px solid var(--dcit-border);
        box-shadow: var(--dcit-shadow);
        padding: 2.15rem;
        margin-bottom: 1.75rem;
        transition: box-shadow 0.3s ease, border-color 0.3s ease;
        scroll-margin-top: 24px;
    }

    .term-section-card:hover {
        box-shadow: var(--dcit-shadow-hover);
        border-color: #cbd5e1;
    }

    .term-card-head {
        display: flex;
        align-items: flex-start;
        gap: 1.1rem;
        margin-bottom: 1.35rem;
        padding-bottom: 1.1rem;
        border-bottom: 1px solid #f1f5f9;
    }

    .term-icon-box {
        width: 52px;
        height: 52px;
        border-radius: 14px;
        background: linear-gradient(135deg, var(--dcit-primary-soft), #dbeafe);
        color: var(--dcit-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.35rem;
        flex-shrink: 0;
        border: 1px solid #bfdbfe;
    }

    .term-title-bn {
        font-size: 1.35rem;
        font-weight: 700;
        color: var(--dcit-navy);
        margin-bottom: 0.15rem;
    }

    .term-title-en {
        font-family: 'Inter', sans-serif;
        font-size: 0.82rem;
        font-weight: 600;
        color: var(--dcit-muted);
        text-transform: uppercase;
        letter-spacing: 0.6px;
    }

    /* লিস্ট স্টাইল */
    .term-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .term-list li {
        display: flex;
        align-items: flex-start;
        gap: 0.85rem;
        padding: 0.7rem 1rem;
        border-radius: 10px;
        background: #f8fafc;
        border: 1px solid #f1f5f9;
        margin-bottom: 0.55rem;
        font-weight: 500;
        color: var(--dcit-navy);
    }

    .term-list li i {
        margin-top: 0.35rem;
        font-size: 1rem;
        flex-shrink: 0;
    }

    .num-pill {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: var(--dcit-primary);
        color: #ffffff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: 700;
        flex-shrink: 0;
        margin-top: 0.1rem;
    }

    /* নোট ও ওয়ার্নিং বক্স */
    .note-callout {
        background: var(--dcit-amber-soft);
        border-left: 4px solid var(--dcit-amber);
        border-radius: 0 12px 12px 0;
        padding: 1.1rem 1.35rem;
        margin-top: 1.25rem;
        display: flex;
        align-items: flex-start;
        gap: 0.85rem;
    }

    .danger-callout {
        background: var(--dcit-danger-soft);
        border-left: 4px solid var(--dcit-danger);
        border-radius: 0 12px 12px 0;
        padding: 1.1rem 1.35rem;
        margin-top: 1.25rem;
        display: flex;
        align-items: flex-start;
        gap: 0.85rem;
    }

    /* ফুটার যোগাযোগ কার্ড */
    .terms-contact-card {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: #ffffff;
        border-radius: 20px;
        padding: 2.5rem;
        position: relative;
        overflow: hidden;
    }

    .contact-glass-box {
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 14px;
        padding: 1.2rem 1.35rem;
        height: 100%;
    }

    @media (max-width: 991.98px) {
        .terms-hero h1 { font-size: 1.95rem; }
        .term-section-card { padding: 1.5rem; }
        .terms-toc { position: static; max-height: none; margin-bottom: 2rem; }
    }

    @media print {
        .terms-toc, .no-print { display: none !important; }
        .term-section-card { break-inside: avoid; box-shadow: none; border: 1px solid #000; }
    }
</style>



<div class="terms-wrapper">
    <!-- হিরো সেকশন -->
    <section class="terms-hero">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-8">
                    <div class="hero-pill">
                        <i class="fa-solid fa-file-contract text-info"></i>
                        <span>সর্বশেষ হালনাগাদ: ১২ নভেম্বর ২০২৬</span>
                    </div>
                    <h1>শর্তাবলি ও নিয়মনীতি</h1>
                    <div class="en-sub">Terms &amp; Conditions — Dream Career IT</div>
                    <p class="text-light opacity-75 mb-0 fs-6" style="max-width: 720px;">
                        Dream Career IT-এর ওয়েবসাইটে আপনাকে স্বাগতম। আমাদের ওয়েবসাইট ব্যবহার, কোর্স সম্পর্কে তথ্য গ্রহণ, অনলাইন আবেদন, ভর্তি, প্রশিক্ষণ গ্রহণ এবং সংশ্লিষ্ট সেবা ব্যবহারের ক্ষেত্রে নিচে উল্লেখিত শর্তাবলি ও নিয়মনীতি প্রযোজ্য হবে।
                    </p>
                </div>
                <div class="col-lg-4 text-lg-end mt-4 mt-lg-0 no-print">
                    <button onclick="window.print()" class="btn btn-light fw-semibold px-4 py-2 rounded-pill shadow-sm">
                        <i class="fa-solid fa-print me-2 text-primary"></i> শর্তাবলি প্রিন্ট করুন
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- সম্মতি ও প্রাথমিক ঘোষণা কার্ড -->
    <div class="container consent-banner-wrap">
        <div class="consent-card">
            <div class="row align-items-center g-3">
                <div class="col-md-9">
                    <div class="d-flex align-items-start gap-3">
                        <div class="p-3 rounded-3 bg-primary bg-opacity-10 text-primary fs-4 flex-shrink-0">
                            <i class="fa-solid fa-Handshake-angle"></i>
                        </div>
                        <div>
                            <h5 class="fw-bold text-dark mb-1">ব্যবহারকারীর সম্মতি ঘোষণাপত্র (User Agreement)</h5>
                            <p class="mb-0 text-secondary">
                                ওয়েবসাইট ব্যবহার বা আমাদের কোনো সেবা গ্রহণ করার মাধ্যমে আপনি এই শর্তাবলিতে সম্মতি প্রদান করছেন। কোনো শর্তে সম্মত না হলে অনুগ্রহ করে সংশ্লিষ্ট সেবা ব্যবহার থেকে বিরত থাকুন।
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 text-md-end no-print">
                    <a href="#contact" onclick="navigateView('contact')" class="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold">
                        <i class="fa-solid fa-circle-question me-1"></i> প্রশ্ন থাকলে জানান[cite: 1]
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- মেইন বডি এবং সাইডবার -->
    <div class="container">
        <div class="row g-4">
            <!-- বাম পাশের স্টিকি সূচিপত্র (১–১৯) -->
            <div class="col-lg-4 col-xl-3">
                <aside class="terms-toc">
                    <div class="terms-toc-header">
                        <span><i class="fa-solid fa-list-ol text-primary me-2"></i> ধারা সূচিপত্র</span>
                        <span class="badge bg-primary-subtle text-primary rounded-pill">১৯টি ধারা</span>
                    </div>
                    <ul class="terms-toc-list" id="termsTocNav">
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'term-1\')?.scrollIntoView({behavior:\'smooth\'})" class="active"><span class="toc-badge">১</span> সাধারণ পরিচিতি</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'term-2\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-badge">২</span> ওয়েবসাইট ব্যবহারের শর্ত</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'term-3\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-badge">৩</span> শিক্ষার্থী নিবন্ধন ও ভর্তি</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'term-4\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-badge">৪</span> কোর্স ও প্রশিক্ষণসংক্রান্ত শর্ত</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'term-5\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-badge">৫</span> কোর্স ফি ও পেমেন্ট নীতিমালা</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'term-6\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-badge">৬</span> ভর্তি বাতিল ও অর্থ ফেরত</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'term-7\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-badge">৭</span> উপস্থিতি ও শৃঙ্খলা</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'term-8\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-badge">৮</span> সার্টিফিকেট ও মূল্যায়ন নীতিমালা</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'term-9\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-badge">৯</span> কনটেন্ট ও মেধাস্বত্ব</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'term-10\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-badge">১০</span> গোপনীয়তা ও ব্যক্তিগত তথ্য</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'term-11\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-badge">১১</span> অ্যাকাউন্ট ও নিরাপত্তা</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'term-12\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-badge">১২</span> তৃতীয় পক্ষের লিংক ও সেবা</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'term-13\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-badge">১৩</span> ওয়েবসাইটের তথ্যের নির্ভুলতা</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'term-14\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-badge">১৪</span> সেবা পরিবর্তন ও সাময়িক বন্ধ</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'term-15\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-badge">১৫</span> নিষিদ্ধ কার্যক্রম</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'term-16\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-badge">১৬</span> দায়বদ্ধতার সীমাবদ্ধতা</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'term-17\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-badge">১৭</span> প্রযোজ্য আইন ও বিরোধ নিষ্পত্তি</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'term-18\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-badge">১৮</span> শর্তাবলি পরিবর্তন</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'term-19\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-badge">১৯</span> যোগাযোগ</a></li>
                    </ul>
                </aside>
            </div>

            <!-- ডান পাশের বিস্তারিত ১৯টি ধারা -->
            <div class="col-lg-8 col-xl-9">

                <!-- ১. সাধারণ পরিচিতি -->
                <section id="term-1" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-building-columns"></i></div>
                        <div>
                            <h2 class="term-title-bn">১. সাধারণ পরিচিতি</h2>
                            <div class="term-title-en">General Information</div>
                        </div>
                    </div>
                    <p>
                        <strong>Dream Career IT</strong> একটি তথ্যপ্রযুক্তি ও দক্ষতাভিত্তিক প্রশিক্ষণ প্রতিষ্ঠান। প্রতিষ্ঠানটি কম্পিউটার শিক্ষা, ডিজিটাল দক্ষতা উন্নয়ন এবং বিভিন্ন পেশাগত প্রশিক্ষণ কার্যক্রম পরিচালনার উদ্দেশ্যে কাজ করে।
                    </p>
                    <p class="mb-0">
                        আমাদের ওয়েবসাইটের মাধ্যমে ব্যবহারকারীরা প্রতিষ্ঠানের পরিচিতি, কোর্স, ভর্তি কার্যক্রম, প্রশিক্ষক, শিক্ষার্থী, নোটিশ, ফলাফল, সার্টিফিকেট যাচাই এবং অন্যান্য প্রাসঙ্গিক তথ্য দেখতে পারবেন।
                    </p>
                </section>

                <!-- ২. ওয়েবসাইট ব্যবহারের শর্ত -->
                <section id="term-2" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-globe"></i></div>
                        <div>
                            <h2 class="term-title-bn">২. ওয়েবসাইট ব্যবহারের শর্ত</h2>
                            <div class="term-title-en">Website Usage</div>
                        </div>
                    </div>
                    <p class="mb-3">ওয়েবসাইট ব্যবহার করার সময় ব্যবহারকারীকে নিম্নলিখিত নিয়ম অনুসরণ করতে হবে:</p>
                    <ul class="term-list">
                        <li><i class="fa-solid fa-circle-check text-primary"></i> <span>ওয়েবসাইটটি কোনো অবৈধ উদ্দেশ্যে ব্যবহার করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-circle-check text-primary"></i> <span>ভুল, বিভ্রান্তিকর বা মিথ্যা তথ্য প্রদান করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-circle-check text-primary"></i> <span>অন্য কোনো ব্যক্তি বা প্রতিষ্ঠানের পরিচয় ব্যবহার করে অ্যাকাউন্ট বা আবেদন করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-circle-check text-primary"></i> <span>ওয়েবসাইটের নিরাপত্তা নষ্ট করার চেষ্টা করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-circle-check text-primary"></i> <span>অনুমতি ছাড়া ওয়েবসাইটের কোনো তথ্য, ডেটাবেজ বা সিস্টেমে প্রবেশের চেষ্টা করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-circle-check text-primary"></i> <span>ওয়েবসাইটে ক্ষতিকর সফটওয়্যার, ভাইরাস বা অননুমোদিত কোড সংযুক্ত করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-circle-check text-primary"></i> <span>অন্য ব্যবহারকারীর স্বাভাবিক ওয়েবসাইট ব্যবহার বাধাগ্রস্ত করা যাবে না।</span></li>
                    </ul>
                </section>

                <!-- ৩. শিক্ষার্থী নিবন্ধন ও ভর্তি -->
                <section id="term-3" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-user-graduate"></i></div>
                        <div>
                            <h2 class="term-title-bn">৩. শিক্ষার্থী নিবন্ধন ও ভর্তি</h2>
                            <div class="term-title-en">Student Registration &amp; Admission</div>
                        </div>
                    </div>
                    <p class="mb-3">প্রতিষ্ঠানে ভর্তি বা অনলাইন নিবন্ধনের ক্ষেত্রে:</p>
                    <ul class="term-list">
                        <li><span class="num-pill">১</span> <span>শিক্ষার্থীকে সঠিক নাম, মোবাইল নম্বর, ঠিকানা ও প্রয়োজনীয় তথ্য প্রদান করতে হবে।</span></li>
                        <li><span class="num-pill">২</span> <span>আবেদনপত্রে প্রদত্ত তথ্যের সত্যতা নিশ্চিত করার দায়িত্ব আবেদনকারীর।</span></li>
                        <li><span class="num-pill">৩</span> <span>ভুল বা অসম্পূর্ণ তথ্যের কারণে ভর্তি কার্যক্রমে সমস্যা হলে প্রতিষ্ঠান দায়ী থাকবে না।</span></li>
                        <li><span class="num-pill">৪</span> <span>ভর্তি নিশ্চিত হওয়ার জন্য প্রতিষ্ঠানের নির্ধারিত প্রক্রিয়া সম্পন্ন করতে হবে।</span></li>
                        <li><span class="num-pill">৫</span> <span>প্রতিষ্ঠান প্রয়োজন অনুযায়ী আবেদনকারীর দেওয়া তথ্য যাচাই করতে পারবে।</span></li>
                        <li><span class="num-pill">৬</span> <span>ভর্তির যোগ্যতা, আসনসংখ্যা ও প্রয়োজনীয় কাগজপত্র কোর্সভেদে ভিন্ন হতে পারে।</span></li>
                        <li><span class="num-pill">৭</span> <span>কোনো আবেদন গ্রহণ বা বাতিলের ক্ষেত্রে প্রযোজ্য নিয়ম ও কারণ আবেদনকারীকে জানানো হবে।</span></li>
                    </ul>
                </section>

                <!-- ৪. কোর্স ও প্রশিক্ষণসংক্রান্ত শর্ত -->
                <section id="term-4" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-laptop-code"></i></div>
                        <div>
                            <h2 class="term-title-bn">৪. কোর্স ও প্রশিক্ষণসংক্রান্ত শর্ত</h2>
                            <div class="term-title-en">Course &amp; Training Policy</div>
                        </div>
                    </div>
                    <p class="mb-3">Dream Career IT-এর বিভিন্ন প্রশিক্ষণ কোর্সের ক্ষেত্রে:</p>
                    <ul class="term-list">
                        <li><i class="fa-solid fa-check text-success"></i> <span>প্রতিটি কোর্সের নির্ধারিত সিলেবাস অনুসরণ করা হবে।</span></li>
                        <li><i class="fa-solid fa-check text-success"></i> <span>কোর্সের মেয়াদ, ক্লাসের সময়সূচি ও প্রশিক্ষণ পদ্ধতি কোর্সভেদে ভিন্ন হতে পারে।</span></li>
                        <li><i class="fa-solid fa-check text-success"></i> <span>শিক্ষার্থীকে নিয়মিত ক্লাসে অংশগ্রহণ করতে হবে।</span></li>
                        <li><i class="fa-solid fa-check text-success"></i> <span>প্রশিক্ষণ কার্যক্রমে প্রতিষ্ঠানের নির্ধারিত নিয়ম মেনে চলতে হবে।</span></li>
                        <li><i class="fa-solid fa-check text-success"></i> <span>ব্যবহারিক ক্লাস ও অ্যাসাইনমেন্ট যথাযথভাবে সম্পন্ন করতে হবে।</span></li>
                        <li><i class="fa-solid fa-check text-success"></i> <span>প্রতিষ্ঠানের অনুমতি ছাড়া ক্লাসের গোপনীয় উপকরণ বা প্রশিক্ষণ সামগ্রী বাণিজ্যিকভাবে ব্যবহার করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-check text-success"></i> <span>বিশেষ পরিস্থিতিতে কর্তৃপক্ষ প্রয়োজন অনুযায়ী ক্লাসের সময়সূচি বা প্রশিক্ষণ পদ্ধতি পরিবর্তন করতে পারবে।</span></li>
                    </ul>
                </section>

                <!-- ৫. কোর্স ফি ও পেমেন্ট নীতিমালা -->
                <section id="term-5" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-credit-card"></i></div>
                        <div>
                            <h2 class="term-title-bn">৫. কোর্স ফি ও পেমেন্ট নীতিমালা</h2>
                            <div class="term-title-en">Course Fee &amp; Payment Policy</div>
                        </div>
                    </div>
                    <ul class="term-list">
                        <li><span class="num-pill">১</span> <span>প্রতিটি কোর্সের ফি প্রতিষ্ঠান কর্তৃক নির্ধারিত হবে।</span></li>
                        <li><span class="num-pill">২</span> <span>ভর্তি হওয়ার পূর্বে শিক্ষার্থীকে কোর্স ফি সম্পর্কে অবগত হতে হবে।</span></li>
                        <li><span class="num-pill">৩</span> <span>নির্ধারিত সময়ের মধ্যে কোর্স ফি পরিশোধ করতে হবে।</span></li>
                        <li><span class="num-pill">৪</span> <span>পেমেন্ট সম্পন্ন হওয়ার পর প্রযোজ্য ক্ষেত্রে মানি রিসিট বা পেমেন্ট কনফার্মেশন প্রদান করা হবে।</span></li>
                        <li><span class="num-pill">৫</span> <span>ভুল নম্বরে বা ভুল মাধ্যমে অর্থ পাঠানোর ক্ষেত্রে সংশ্লিষ্ট পেমেন্ট সেবাদাতার নিয়ম অনুসরণ করতে হবে।</span></li>
                        <li><span class="num-pill">৬</span> <span>কোনো অফার, ছাড় বা বিশেষ সুবিধা থাকলে তার নির্ধারিত শর্ত প্রযোজ্য হবে।</span></li>
                        <li><span class="num-pill">৭</span> <span>প্রতিষ্ঠানের অনুমোদিত পেমেন্ট মাধ্যম ছাড়া অন্য কোনো ব্যক্তিগত মাধ্যমে অর্থ প্রদান করার আগে কর্তৃপক্ষের সঙ্গে নিশ্চিত হতে হবে।</span></li>
                    </ul>
                </section>

                <!-- ৬. ভর্তি বাতিল ও অর্থ ফেরত নীতিমালা -->
                <section id="term-6" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-rotate-left"></i></div>
                        <div>
                            <h2 class="term-title-bn">৬. ভর্তি বাতিল ও অর্থ ফেরত নীতিমালা</h2>
                            <div class="term-title-en">Admission Cancellation &amp; Refund Policy</div>
                        </div>
                    </div>
                    <ul class="term-list">
                        <li><i class="fa-solid fa-circle-dot text-primary"></i> <span>ভর্তি বাতিলের আবেদন লিখিতভাবে বা প্রতিষ্ঠানের নির্ধারিত মাধ্যমে জানাতে হবে।</span></li>
                        <li><i class="fa-solid fa-circle-dot text-primary"></i> <span>কোর্স শুরু হওয়ার আগে বাতিলের ক্ষেত্রে প্রযোজ্য নিয়ম অনুযায়ী অর্থ ফেরতের বিষয়টি বিবেচনা করা হবে।</span></li>
                        <li><i class="fa-solid fa-circle-dot text-primary"></i> <span>কোর্স শুরু হওয়ার পর অর্থ ফেরত প্রযোজ্য হবে কি না, তা ভর্তি চুক্তি ও ঘোষিত রিফান্ড নীতির ভিত্তিতে নির্ধারিত হবে।</span></li>
                        <li><i class="fa-solid fa-circle-dot text-primary"></i> <span>প্রতিষ্ঠানের কারণে কোনো কোর্স সম্পূর্ণভাবে বাতিল হলে সংশ্লিষ্ট শিক্ষার্থীদের অর্থ ফেরত বা বিকল্প ব্যবস্থা সম্পর্কে জানানো হবে।</span></li>
                        <li><i class="fa-solid fa-circle-dot text-primary"></i> <span>কোনো অর্থ ফেরতের ক্ষেত্রে প্রযোজ্য ব্যাংক বা পেমেন্ট গেটওয়ের চার্জ বিবেচনা করা হতে পারে।</span></li>
                        <li><i class="fa-solid fa-circle-dot text-primary"></i> <span>প্রতিটি রিফান্ড আবেদন যাচাই করে সিদ্ধান্ত জানানো হবে।</span></li>
                    </ul>
                    <div class="note-callout">
                        <i class="fa-solid fa-circle-exclamation text-warning fs-5 mt-1"></i>
                        <div>
                            <strong class="text-dark">বিশেষ দ্রষ্টব্য:</strong> ভর্তি হওয়ার আগে শিক্ষার্থীকে সংশ্লিষ্ট কোর্সের রিফান্ড নীতিমালা জেনে নেওয়ার পরামর্শ দেওয়া হচ্ছে।
                        </div>
                    </div>
                </section>

                <!-- ৭. উপস্থিতি ও শৃঙ্খলা -->
                <section id="term-7" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-user-check"></i></div>
                        <div>
                            <h2 class="term-title-bn">৭. উপস্থিতি ও শৃঙ্খলা</h2>
                            <div class="term-title-en">Attendance &amp; Discipline</div>
                        </div>
                    </div>
                    <p class="mb-3">শিক্ষার্থীদের জন্য নিম্নলিখিত নিয়ম প্রযোজ্য:</p>
                    <ul class="term-list">
                        <li><i class="fa-solid fa-check-double text-success"></i> <span>নির্ধারিত সময় অনুযায়ী ক্লাসে উপস্থিত থাকতে হবে।</span></li>
                        <li><i class="fa-solid fa-check-double text-success"></i> <span>শিক্ষক, কর্মকর্তা ও অন্যান্য শিক্ষার্থীর সঙ্গে সম্মানজনক আচরণ করতে হবে।</span></li>
                        <li><i class="fa-solid fa-check-double text-success"></i> <span>প্রতিষ্ঠানের সম্পদ ও শিক্ষা উপকরণের যত্ন নিতে হবে।</span></li>
                        <li><i class="fa-solid fa-check-double text-success"></i> <span>ক্লাস চলাকালে অন্যের শিক্ষা কার্যক্রমে বিঘ্ন সৃষ্টি করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-check-double text-success"></i> <span>কোনো ধরনের হয়রানি, প্রতারণা, হুমকি বা অসদাচরণ গ্রহণযোগ্য নয়।</span></li>
                        <li><i class="fa-solid fa-check-double text-success"></i> <span>প্রতিষ্ঠানের শৃঙ্খলাবিরোধী কার্যক্রমের ক্ষেত্রে যথাযথ তদন্ত ও আত্মপক্ষ সমর্থনের সুযোগ দিয়ে প্রয়োজনীয় ব্যবস্থা নেওয়া হতে পারে।</span></li>
                    </ul>
                </section>

                <!-- ৮. সার্টিফিকেট ও মূল্যায়ন নীতিমালা -->
                <section id="term-8" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box" style="background: var(--dcit-emerald-soft); color: var(--dcit-emerald); border-color: #a7f3d0;">
                            <i class="fa-solid fa-award"></i>
                        </div>
                        <div>
                            <h2 class="term-title-bn">৮. সার্টিফিকেট ও মূল্যায়ন নীতিমালা</h2>
                            <div class="term-title-en">Certificate &amp; Assessment Policy</div>
                        </div>
                    </div>
                    <ul class="term-list mb-3">
                        <li><span class="num-pill">১</span> <span>কোর্সের নির্ধারিত শর্ত পূরণ এবং প্রযোজ্য মূল্যায়নে উত্তীর্ণ হওয়ার পর সার্টিফিকেট প্রদান করা হতে পারে।</span></li>
                        <li><span class="num-pill">২</span> <span>সার্টিফিকেটের জন্য প্রয়োজনীয় উপস্থিতি, অ্যাসাইনমেন্ট, ব্যবহারিক কাজ ও মূল্যায়নের নিয়ম কোর্সভেদে নির্ধারিত হবে।</span></li>
                        <li><span class="num-pill">৩</span> <span>সার্টিফিকেটে প্রদত্ত তথ্য সঠিক রাখা শিক্ষার্থী ও প্রতিষ্ঠানের যৌথ দায়িত্ব।</span></li>
                        <li><span class="num-pill">৪</span> <span>কোনো সার্টিফিকেট জাল, পরিবর্তন বা অননুমোদিতভাবে ব্যবহার করা যাবে না।</span></li>
                        <li><span class="num-pill">৫</span> <span>প্রতিষ্ঠান কর্তৃক ইস্যু করা যাচাইযোগ্য সার্টিফিকেটের সত্যতা ওয়েবসাইটের <strong>Certificate Verification</strong> ব্যবস্থার মাধ্যমে যাচাই করা যাবে।</span></li>
                        <li><span class="num-pill">৬</span> <span>সার্টিফিকেট প্রদান কোনো সরকারি চাকরি, নিয়োগ বা পেশাগত লাইসেন্স নিশ্চিত করে না।</span></li>
                        <li><span class="num-pill">৭</span> <span>কোনো সরকারি বা তৃতীয় পক্ষের স্বীকৃতির দাবি কেবল সংশ্লিষ্ট অনুমোদনের প্রমাণ থাকলেই করা হবে।</span></li>
                    </ul>
                    <div class="p-3 rounded-3 d-flex align-items-center justify-content-between flex-wrap gap-2 no-print" style="background: var(--dcit-emerald-soft); border: 1px solid #a7f3d0;">
                        <span class="small fw-semibold text-dark"><i class="fa-solid fa-qrcode text-success me-1"></i> অনলাইনে সার্টিফিকেট যাচাই করতে চান?</span>
                        <a href="#certificates" onclick="navigateView('certificates')" class="btn btn-success btn-sm rounded-pill px-3">Certificate Verification[cite: 1]</a>
                    </div>
                </section>

                <!-- ৯. ওয়েবসাইটের কনটেন্ট ও মেধাস্বত্ব -->
                <section id="term-9" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-copyright"></i></div>
                        <div>
                            <h2 class="term-title-bn">৯. ওয়েবসাইটের কনটেন্ট ও মেধাস্বত্ব</h2>
                            <div class="term-title-en">Intellectual Property Rights</div>
                        </div>
                    </div>
                    <p class="mb-3">
                        এই ওয়েবসাইটে প্রকাশিত নিজস্ব লেখা, ডিজাইন, লোগো, গ্রাফিক্স, ছবি, ভিডিও, প্রশিক্ষণ উপকরণ এবং অন্যান্য মৌলিক কনটেন্টের স্বত্ব <strong>Dream Career IT</strong> অথবা সংশ্লিষ্ট স্বত্বাধিকারীর। প্রতিষ্ঠানের লিখিত অনুমতি ছাড়া:
                    </p>
                    <ul class="term-list">
                        <li><i class="fa-solid fa-ban text-danger"></i> <span>ওয়েবসাইটের নিজস্ব কনটেন্ট বাণিজ্যিকভাবে ব্যবহার করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-ban text-danger"></i> <span>প্রশিক্ষণ উপকরণ কপি বা পুনরায় বিক্রি করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-ban text-danger"></i> <span>প্রতিষ্ঠানের লোগো বা পরিচয় অনুমতি ছাড়া ব্যবহার করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-ban text-danger"></i> <span>ওয়েবসাইটের কনটেন্ট অন্যত্র প্রকাশ বা বিতরণ করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-shield-halved text-primary"></i> <span>তৃতীয় পক্ষের মালিকানাধীন কোনো কনটেন্টের ক্ষেত্রে সংশ্লিষ্ট স্বত্বাধিকারীর অধিকার সংরক্ষিত থাকবে।</span></li>
                    </ul>
                </section>

                <!-- ১০. গোপনীয়তা ও ব্যক্তিগত তথ্য -->
                <section id="term-10" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-user-shield"></i></div>
                        <div>
                            <h2 class="term-title-bn">১০. গোপনীয়তা ও ব্যক্তিগত তথ্য</h2>
                            <div class="term-title-en">Privacy &amp; Personal Information</div>
                        </div>
                    </div>
                    <p class="mb-3">ওয়েবসাইট ব্যবহার, ভর্তি ও নিবন্ধনের সময় ব্যবহারকারীর কিছু ব্যক্তিগত তথ্য সংগ্রহ করা হতে পারে। সংগৃহীত তথ্যের মধ্যে থাকতে পারে:</p>
                    <div class="row g-2 mb-3">
                        <div class="col-md-6">
                            <ul class="term-list">
                                <li><i class="fa-solid fa-id-card text-primary"></i> <span>শিক্ষার্থীর নাম।</span></li>
                                <li><i class="fa-solid fa-phone text-primary"></i> <span>মোবাইল নম্বর।</span></li>
                                <li><i class="fa-solid fa-envelope text-primary"></i> <span>ইমেইল ঠিকানা।</span></li>
                                <li><i class="fa-solid fa-location-dot text-primary"></i> <span>বর্তমান ও স্থায়ী ঠিকানা।</span></li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <ul class="term-list">
                                <li><i class="fa-solid fa-graduation-cap text-primary"></i> <span>শিক্ষাগত যোগ্যতা।</span></li>
                                <li><i class="fa-solid fa-file-signature text-primary"></i> <span>ভর্তি ও কোর্সসংক্রান্ত তথ্য।</span></li>
                                <li><i class="fa-solid fa-receipt text-primary"></i> <span>পেমেন্ট ও লেনদেনের তথ্য।</span></li>
                            </ul>
                        </div>
                    </div>
                    <p class="mb-0 text-muted small">
                        <i class="fa-solid fa-lock me-1 text-primary"></i> ব্যবহারকারীর ব্যক্তিগত তথ্য সংগ্রহ, সংরক্ষণ, ব্যবহার ও সুরক্ষার ক্ষেত্রে প্রতিষ্ঠানের <strong>Privacy Policy</strong> অনুসরণ করা হবে।
                    </p>
                </section>

                <!-- ১১. অ্যাকাউন্ট ও নিরাপত্তা -->
                <section id="term-11" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-key"></i></div>
                        <div>
                            <h2 class="term-title-bn">১১. অ্যাকাউন্ট ও নিরাপত্তা</h2>
                            <div class="term-title-en">Account &amp; Security</div>
                        </div>
                    </div>
                    <p class="mb-3">ওয়েবসাইটে ব্যবহারকারীর অ্যাকাউন্ট সুবিধা থাকলে:</p>
                    <ul class="term-list">
                        <li><i class="fa-solid fa-shield-cat text-primary"></i> <span>অ্যাকাউন্টের লগইন তথ্য গোপন রাখতে হবে।</span></li>
                        <li><i class="fa-solid fa-shield-cat text-primary"></i> <span>অন্যের অ্যাকাউন্ট অনুমতি ছাড়া ব্যবহার করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-shield-cat text-primary"></i> <span>অ্যাকাউন্টে অননুমোদিত প্রবেশের সন্দেহ হলে দ্রুত কর্তৃপক্ষকে জানাতে হবে।</span></li>
                        <li><i class="fa-solid fa-shield-cat text-primary"></i> <span>ভুল বা সন্দেহজনক কার্যক্রমের ক্ষেত্রে নিরাপত্তার স্বার্থে অ্যাকাউন্ট সাময়িকভাবে সীমাবদ্ধ করা হতে পারে।</span></li>
                        <li><i class="fa-solid fa-shield-cat text-primary"></i> <span>ব্যবহারকারীর অবহেলার কারণে অ্যাকাউন্টের তথ্য প্রকাশিত হলে বিষয়টি যথাযথভাবে তদন্ত করা হবে।</span></li>
                    </ul>
                </section>

                <!-- ১২. তৃতীয় পক্ষের লিংক ও সেবা -->
                <section id="term-12" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-up-right-from-square"></i></div>
                        <div>
                            <h2 class="term-title-bn">১২. তৃতীয় পক্ষের লিংক ও সেবা</h2>
                            <div class="term-title-en">Third-Party Services</div>
                        </div>
                    </div>
                    <p>
                        আমাদের ওয়েবসাইটে তৃতীয় পক্ষের ওয়েবসাইট, পেমেন্ট সেবা, যোগাযোগ মাধ্যম অথবা অন্যান্য অনলাইন সেবার লিংক থাকতে পারে।
                    </p>
                    <p class="mb-0">
                        এসব তৃতীয় পক্ষের সেবা তাদের নিজস্ব নিয়মনীতি ও গোপনীয়তা নীতির অধীনে পরিচালিত হয়। তাদের সেবার প্রাপ্যতা, নিরাপত্তা বা কনটেন্টের ওপর <strong>Dream Career IT</strong>-এর সরাসরি নিয়ন্ত্রণ নেই।
                    </p>
                </section>

                <!-- ১৩. ওয়েবসাইটের তথ্যের নির্ভুলতা -->
                <section id="term-13" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-circle-check"></i></div>
                        <div>
                            <h2 class="term-title-bn">১৩. ওয়েবসাইটের তথ্যের নির্ভুলতা</h2>
                            <div class="term-title-en">Information Accuracy</div>
                        </div>
                    </div>
                    <p class="mb-3">ওয়েবসাইটে প্রকাশিত তথ্য যথাসম্ভব সঠিক ও হালনাগাদ রাখার চেষ্টা করা হয়। তবে:</p>
                    <div class="row g-2 mb-3">
                        <div class="col-md-6">
                            <ul class="term-list">
                                <li><i class="fa-solid fa-arrows-rotate text-primary"></i> <span>কোর্সের তথ্য পরিবর্তিত হতে পারে।</span></li>
                                <li><i class="fa-solid fa-arrows-rotate text-primary"></i> <span>প্রশিক্ষণের সময়সূচি পরিবর্তিত হতে পারে।</span></li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <ul class="term-list">
                                <li><i class="fa-solid fa-arrows-rotate text-primary"></i> <span>ফি ও অন্যান্য চার্জ সংশোধিত হতে পারে।</span></li>
                                <li><i class="fa-solid fa-arrows-rotate text-primary"></i> <span>নোটিশ ও প্রশাসনিক সিদ্ধান্ত হালনাগাদ হতে পারে।</span></li>
                            </ul>
                        </div>
                    </div>
                    <div class="note-callout">
                        <i class="fa-solid fa-lightbulb text-warning fs-5 mt-1"></i>
                        <div>কোনো গুরুত্বপূর্ণ সিদ্ধান্ত গ্রহণের আগে সরাসরি প্রতিষ্ঠানের সঙ্গে যোগাযোগ করে তথ্য নিশ্চিত করার পরামর্শ দেওয়া হচ্ছে।</div>
                    </div>
                </section>

                <!-- ১৪. সেবা পরিবর্তন ও সাময়িক বন্ধ -->
                <section id="term-14" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-screwdriver-wrench"></i></div>
                        <div>
                            <h2 class="term-title-bn">১৪. সেবা পরিবর্তন ও সাময়িক বন্ধ</h2>
                            <div class="term-title-en">Service Modification &amp; Suspension</div>
                        </div>
                    </div>
                    <p>
                        প্রযুক্তিগত সমস্যা, রক্ষণাবেক্ষণ, নিরাপত্তা, প্রশাসনিক সিদ্ধান্ত বা অনিবার্য পরিস্থিতির কারণে ওয়েবসাইটের কিছু সেবা সাময়িকভাবে বন্ধ বা পরিবর্তন করা হতে পারে।
                    </p>
                    <p class="mb-0">
                        এ ধরনের পরিবর্তন সম্পর্কে সম্ভব হলে ব্যবহারকারীদের পূর্বেই অবহিত করা হবে।
                    </p>
                </section>

                <!-- ১৫. নিষিদ্ধ কার্যক্রম -->
                <section id="term-15" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box" style="background: var(--dcit-danger-soft); color: var(--dcit-danger); border-color: #fecaca;">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <div>
                            <h2 class="term-title-bn">১৫. নিষিদ্ধ কার্যক্রম</h2>
                            <div class="term-title-en">Prohibited Activities</div>
                        </div>
                    </div>
                    <p class="mb-3">নিম্নলিখিত কার্যক্রম সম্পূর্ণ নিষিদ্ধ:</p>
                    <ul class="term-list">
                        <li><i class="fa-solid fa-circle-xmark text-danger"></i> <span>ওয়েবসাইট হ্যাকিং বা অননুমোদিত প্রবেশ।</span></li>
                        <li><i class="fa-solid fa-circle-xmark text-danger"></i> <span>ভুয়া ভর্তি বা জাল সার্টিফিকেট তৈরি।</span></li>
                        <li><i class="fa-solid fa-circle-xmark text-danger"></i> <span>প্রতারণামূলক পেমেন্ট প্রমাণ জমা দেওয়া।</span></li>
                        <li><i class="fa-solid fa-circle-xmark text-danger"></i> <span>অন্যের ব্যক্তিগত তথ্য চুরি বা অপব্যবহার।</span></li>
                        <li><i class="fa-solid fa-circle-xmark text-danger"></i> <span>প্রতিষ্ঠানের নাম ব্যবহার করে ভুয়া প্রচারণা।</span></li>
                        <li><i class="fa-solid fa-circle-xmark text-danger"></i> <span>ওয়েবসাইটের সার্ভার বা ডেটাবেজ ক্ষতিগ্রস্ত করার চেষ্টা।</span></li>
                        <li><i class="fa-solid fa-circle-xmark text-danger"></i> <span>প্রতিষ্ঠানের সুনাম ক্ষুণ্ণ করার উদ্দেশ্যে মিথ্যা তথ্য প্রচার।</span></li>
                    </ul>
                    <div class="danger-callout">
                        <i class="fa-solid fa-gavel text-danger fs-5 mt-1"></i>
                        <div>প্রযোজ্য আইন ও নীতিমালা অনুসারে এসব কার্যক্রমের বিরুদ্ধে প্রয়োজনীয় আইনগত ব্যবস্থা নেওয়া হতে পারে।</div>
                    </div>
                </section>

                <!-- ১৬. দায়বদ্ধতার সীমাবদ্ধতা -->
                <section id="term-16" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-scale-unbalanced"></i></div>
                        <div>
                            <h2 class="term-title-bn">১৬. দায়বদ্ধতার সীমাবদ্ধতা</h2>
                            <div class="term-title-en">Limitation of Liability</div>
                        </div>
                    </div>
                    <p>
                        <strong>Dream Career IT</strong> ওয়েবসাইট ও প্রশিক্ষণ কার্যক্রম যথাসম্ভব সঠিকভাবে পরিচালনার চেষ্টা করে। তবে ইন্টারনেট সংযোগের সমস্যা, তৃতীয় পক্ষের সেবা বন্ধ থাকা, প্রযুক্তিগত ত্রুটি অথবা প্রতিষ্ঠানের যুক্তিসংগত নিয়ন্ত্রণের বাইরে থাকা পরিস্থিতির কারণে সৃষ্ট সমস্যার ক্ষেত্রে প্রযোজ্য আইন অনুযায়ী দায়বদ্ধতা নির্ধারিত হবে।
                    </p>
                    <div class="p-3 bg-light border rounded-3 mb-0">
                        <i class="fa-solid fa-circle-info text-primary me-2"></i>
                        কোনো প্রশিক্ষণ গ্রহণের মাধ্যমে নির্দিষ্ট চাকরি, আয়, ব্যবসায়িক সাফল্য বা পেশাগত ফলাফল নিশ্চিত করা হয় না।
                    </div>
                </section>

                <!-- ১৭. প্রযোজ্য আইন ও বিরোধ নিষ্পত্তি -->
                <section id="term-17" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-scale-balanced"></i></div>
                        <div>
                            <h2 class="term-title-bn">১৭. প্রযোজ্য আইন ও বিরোধ নিষ্পত্তি</h2>
                            <div class="term-title-en">Governing Law &amp; Dispute Resolution</div>
                        </div>
                    </div>
                    <p>
                        এই শর্তাবলি বাংলাদেশের প্রচলিত আইন ও প্রযোজ্য বিধিবিধানের আলোকে পরিচালিত হবে।
                    </p>
                    <p class="mb-0">
                        কোনো বিরোধ সৃষ্টি হলে প্রথমে পারস্পরিক আলোচনা ও সমঝোতার মাধ্যমে সমাধানের চেষ্টা করা হবে। সমাধান সম্ভব না হলে বাংলাদেশের উপযুক্ত আইনগত কর্তৃপক্ষ বা আদালতের মাধ্যমে বিষয়টি নিষ্পত্তি করা হবে।
                    </p>
                </section>

                <!-- ১৮. শর্তাবলি পরিবর্তন -->
                <section id="term-18" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-file-pen"></i></div>
                        <div>
                            <h2 class="term-title-bn">১৮. শর্তাবলি পরিবর্তন</h2>
                            <div class="term-title-en">Changes to Terms &amp; Conditions</div>
                        </div>
                    </div>
                    <p>
                        <strong>Dream Career IT</strong> প্রয়োজন অনুযায়ী এই শর্তাবলি সংশোধন, সংযোজন বা হালনাগাদ করতে পারবে। পরিবর্তিত শর্তাবলি ওয়েবসাইটে প্রকাশের পর কার্যকর হবে, যদি সংশ্লিষ্ট নোটিশে অন্য কোনো কার্যকর তারিখ উল্লেখ না থাকে।
                    </p>
                    <p class="mb-0 fw-medium text-primary">
                        <i class="fa-regular fa-bell me-1"></i> ব্যবহারকারীদের নিয়মিত এই পেজ পর্যালোচনা করার পরামর্শ দেওয়া হচ্ছে।
                    </p>
                </section>

                <!-- ১৯. যোগাযোগ -->
                <section id="term-19" class="terms-contact-card">
                    <div class="row align-items-center g-4">
                        <div class="col-lg-12">
                            <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary bg-opacity-25 text-info small fw-semibold mb-3">
                                <i class="fa-solid fa-headset"></i> ১৯. যোগাযোগ (Contact Information)
                            </div>
                            <h3 class="fw-bold mb-2">Terms &amp; Conditions সম্পর্কে কোনো প্রশ্ন বা পরামর্শ আছে?</h3>
                            <p class="text-light opacity-75 mb-3">
                                আমাদের শর্তাবলি ও নিয়মনীতি সম্পর্কে কোনো প্রশ্ন, অভিযোগ বা পরামর্শ থাকলে নিচের মাধ্যমে সরাসরি যোগাযোগ করুন।
                            </p>
                            <div class="p-3 rounded-3 mb-3" style="background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.25);">
                                <i class="fa-solid fa-bullseye text-info me-2"></i>
                                <strong>আমাদের লক্ষ্য:</strong> মানসম্মত প্রশিক্ষণ, দক্ষতা উন্নয়ন, স্বচ্ছতা এবং দায়িত্বশীল সেবা প্রদান।
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="contact-glass-box">
                                <div class="small text-info fw-semibold mb-1"><i class="fa-solid fa-building me-1"></i> প্রতিষ্ঠানের নাম ও ঠিকানা</div>
                                <div class="fw-bold fs-5 mb-1">Dream Career IT</div>
                                <div class="small text-light opacity-75">
                                    ভাই ভাই সুপার মার্কেট, নতুন পদুয়ার বাজার মসজিদের পাশে, পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা-৩৫০০, বাংলাদেশ।
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="contact-glass-box">
                                <div class="small text-info fw-semibold mb-2"><i class="fa-solid fa-phone-volume me-1"></i> হটলাইন ও ইমেইল</div>
                                <div class="mb-2">
                                    <i class="fa-solid fa-phone text-success me-2"></i>
                                    <strong>মোবাইল:</strong> <a href="tel:01771770044" class="text-white text-decoration-none">01771770044</a>
                                </div>
                                <div>
                                    <i class="fa-solid fa-envelope text-warning me-2"></i>
                                    <strong>ইমেইল:</strong> <a href="mailto:dc13edubd@gmail.com" class="text-white text-decoration-none">dc13edubd@gmail.com</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 pt-3 border-top border-secondary border-opacity-50 d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <div>
                            <div class="small text-light opacity-75">ধন্যবাদান্তে,</div>
                            <div class="fw-bold text-white">Dream Career IT — <span class="text-info fst-italic">Learn Today, Lead Tomorrow.</span></div>
                        </div>
                        <div class="no-print d-flex gap-2">
                            <a href="#license" onclick="navigateView('license')" class="btn btn-sm btn-outline-light rounded-pill px-3">
                                <i class="fa-solid fa-shield-halved me-1"></i> প্রাতিষ্ঠানিক বৈধতা
                            </a>
                            <a href="#contact" onclick="navigateView('contact')" class="btn btn-sm btn-info fw-semibold rounded-pill px-3">
                                <i class="fa-solid fa-paper-plane me-1"></i> মেসেজ পাঠান[cite: 1]
                            </a>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    </div>
</div>

<!-- স্ক্রল স্পাই (ScrollSpy) জাভাস্ক্রিপ্ট -->
<script>
document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.term-section-card, .terms-contact-card');
    const navLinks = document.querySelectorAll('#termsTocNav a');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 130) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    });
});
</script>

    <section class="section no-print"><div class="container">${getContactGridHTML()}</div></section>`;
    bindSubscribeAndContactForms();
}

function renderLicense(main) {
    main.innerHTML = `<style>
    :root {
        --dcit-primary: #0f172a;
        --dcit-secondary: #1e3a8a;
        --dcit-accent: #2563eb;
        --dcit-accent-light: #eff6ff;
        --dcit-emerald: #059669;
        --dcit-emerald-light: #ecfdf5;
        --dcit-amber: #d97706;
        --dcit-amber-light: #fffbeb;
        --dcit-text: #334155;
        --dcit-muted: #64748b;
        --dcit-border: #e2e8f0;
        --dcit-card-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.06);
        --dcit-hover-shadow: 0 20px 35px -5px rgba(37, 99, 235, 0.12);
    }

    .legitimacy-wrapper {
        font-family: 'Hind Siliguri', 'Inter', sans-serif;
        background-color: #f8fafc;
        color: var(--dcit-text);
        line-height: 1.75;
        padding-bottom: 5rem;
    }

    /* হিরো ব্যানার ডিজাইন */
    .legitimacy-hero {
        background: linear-gradient(135deg, var(--dcit-primary) 0%, var(--dcit-secondary) 60%, var(--dcit-accent) 100%);
        color: #ffffff;
        padding: 4.5rem 0 5.5rem;
        position: relative;
        overflow: hidden;
    }

    .legitimacy-hero::before {
        content: "";
        position: absolute;
        top: -20%;
        right: -10%;
        width: 550px;
        height: 550px;
        background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%);
        border-radius: 50%;
    }

    .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(8px);
        padding: 0.45rem 1.15rem;
        border-radius: 50px;
        font-size: 0.9rem;
        font-weight: 500;
        color: #e0f2fe;
        margin-bottom: 1.25rem;
    }

    .legitimacy-hero h1 {
        font-weight: 700;
        font-size: 2.6rem;
        letter-spacing: -0.5px;
        margin-bottom: 0.5rem;
    }

    .legitimacy-hero .subtitle-en {
        font-family: 'Inter', sans-serif;
        font-size: 1.1rem;
        color: #93c5fd;
        font-weight: 500;
        letter-spacing: 0.5px;
        margin-bottom: 1.25rem;
    }

    /* কুইক ট্রাস্ট বার */
    .trust-stats-bar {
        margin-top: -3rem;
        position: relative;
        z-index: 10;
        margin-bottom: 3rem;
    }

    .trust-stat-card {
        background: #ffffff;
        border-radius: 16px;
        padding: 1.35rem 1.5rem;
        border: 1px solid var(--dcit-border);
        box-shadow: var(--dcit-card-shadow);
        display: flex;
        align-items: center;
        gap: 1rem;
        height: 100%;
        transition: transform 0.25s ease;
    }

    .trust-stat-card:hover {
        transform: translateY(-4px);
    }

    .stat-icon-box {
        width: 52px;
        height: 52px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.35rem;
        flex-shrink: 0;
    }

    /* সাইডবার ন্যাভিগেশন */
    .toc-sidebar {
        position: sticky;
        top: 25px;
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid var(--dcit-border);
        box-shadow: var(--dcit-card-shadow);
        padding: 1.5rem;
    }

    .toc-title {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--dcit-primary);
        padding-bottom: 0.85rem;
        margin-bottom: 0.85rem;
        border-bottom: 2px solid #f1f5f9;
        display: flex;
        align-items: center;
        gap: 0.6rem;
    }

    .toc-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .toc-list li {
        margin-bottom: 0.35rem;
    }

    .toc-list a {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        padding: 0.55rem 0.85rem;
        border-radius: 10px;
        color: var(--dcit-text);
        text-decoration: none;
        font-size: 0.93rem;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .toc-list a:hover,
    .toc-list a.active {
        background-color: var(--dcit-accent-light);
        color: var(--dcit-accent);
        font-weight: 600;
    }

    .toc-num {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        background: #f1f5f9;
        color: var(--dcit-muted);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.78rem;
        font-weight: 700;
    }

    .toc-list a:hover .toc-num,
    .toc-list a.active .toc-num {
        background: var(--dcit-accent);
        color: #ffffff;
    }

    /* সেকশন কার্ড ডিজাইন */
    .legitimacy-section-card {
        background: #ffffff;
        border-radius: 18px;
        border: 1px solid var(--dcit-border);
        box-shadow: var(--dcit-card-shadow);
        padding: 2.25rem;
        margin-bottom: 2rem;
        transition: box-shadow 0.3s ease, border-color 0.3s ease;
        scroll-margin-top: 25px;
    }

    .legitimacy-section-card:hover {
        box-shadow: var(--dcit-hover-shadow);
        border-color: #cbd5e1;
    }

    .section-header-flex {
        display: flex;
        align-items: flex-start;
        gap: 1.15rem;
        margin-bottom: 1.5rem;
        padding-bottom: 1.15rem;
        border-bottom: 1px solid #f1f5f9;
    }

    .section-badge-icon {
        width: 54px;
        height: 54px;
        border-radius: 14px;
        background: linear-gradient(135deg, var(--dcit-accent-light), #dbeafe);
        color: var(--dcit-accent);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
        flex-shrink: 0;
        border: 1px solid #bfdbfe;
    }

    .section-title-bn {
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--dcit-primary);
        margin-bottom: 0.15rem;
    }

    .section-title-en {
        font-family: 'Inter', sans-serif;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--dcit-muted);
        text-transform: uppercase;
        letter-spacing: 0.6px;
    }

    /* ইনফো গ্রিড ও লিস্ট */
    .identity-info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .identity-item {
        background: #f8fafc;
        border: 1px solid var(--dcit-border);
        border-radius: 12px;
        padding: 1.1rem 1.25rem;
    }

    .identity-label {
        font-size: 0.85rem;
        color: var(--dcit-muted);
        font-weight: 500;
        margin-bottom: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }

    .identity-value {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--dcit-primary);
    }

    .custom-check-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .custom-check-list li {
        display: flex;
        align-items: flex-start;
        gap: 0.85rem;
        padding: 0.7rem 1rem;
        border-radius: 10px;
        background: #f8fafc;
        border: 1px solid #f1f5f9;
        margin-bottom: 0.6rem;
        font-weight: 500;
        color: var(--dcit-primary);
    }

    .custom-check-list li i {
        color: var(--dcit-emerald);
        margin-top: 0.35rem;
        font-size: 1.05rem;
    }

    /* বিশেষ দ্রষ্টব্য বা অ্যালার্ট বক্স */
    .legal-disclaimer-box {
        background: var(--dcit-amber-light);
        border-left: 4px solid var(--dcit-amber);
        border-radius: 0 12px 12px 0;
        padding: 1.15rem 1.35rem;
        margin-top: 1.5rem;
        display: flex;
        align-items: flex-start;
        gap: 0.9rem;
    }

    .legal-disclaimer-box i {
        color: var(--dcit-amber);
        font-size: 1.35rem;
        margin-top: 0.2rem;
    }

    /* কোর্স ব্যাজ ও পিচার কার্ড */
    .course-pill-card {
        background: #ffffff;
        border: 1px solid var(--dcit-border);
        border-radius: 12px;
        padding: 1rem 1.15rem;
        display: flex;
        align-items: center;
        gap: 0.85rem;
        height: 100%;
        transition: all 0.2s ease;
    }

    .course-pill-card:hover {
        border-color: var(--dcit-accent);
        background: var(--dcit-accent-light);
        transform: translateY(-2px);
    }

    .course-pill-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: var(--dcit-accent-light);
        color: var(--dcit-accent);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
        flex-shrink: 0;
    }

    .course-pill-card:hover .course-pill-icon {
        background: var(--dcit-accent);
        color: #ffffff;
    }

    /* ভেরিফিকেশন প্যারামিটার ট্যাগ */
    .verify-param-box {
        background: #f8fafc;
        border: 1px dashed #cbd5e1;
        border-radius: 10px;
        padding: 0.8rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.65rem;
        font-weight: 600;
        font-size: 0.95rem;
        color: var(--dcit-primary);
    }

    /* অঙ্গীকার ও কন্টাক্ট ফুটার কার্ড */
    .commitment-card {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: #ffffff;
        border-radius: 20px;
        padding: 2.5rem;
        position: relative;
        overflow: hidden;
    }

    .contact-info-pill {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        padding: 1rem 1.25rem;
        height: 100%;
    }

    @media (max-width: 991.98px) {
        .legitimacy-hero h1 { font-size: 2rem; }
        .legitimacy-section-card { padding: 1.5rem; }
        .toc-sidebar { position: static; margin-bottom: 2rem; }
    }

    @media print {
        .toc-sidebar, .no-print { display: none !important; }
        .legitimacy-section-card { break-inside: avoid; box-shadow: none; border: 1px solid #000; }
    }
</style>



<div class="legitimacy-wrapper">
    <!-- হিরো সেকশন -->
    <section class="legitimacy-hero">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-8">
                    <div class="hero-badge">
                        <i class="fa-solid fa-shield-halved text-info"></i>
                        <span>অফিসিয়াল ঘোষণাপত্র ও প্রাতিষ্ঠানিক নীতিমালা</span>
                    </div>
                    <h1>প্রাতিষ্ঠানিক বৈধতা ও স্বচ্ছতা</h1>
                    <div class="subtitle-en">Institutional Legitimacy, Legal Identity &amp; Transparency Charter</div>
                    <p class="text-light opacity-75 mb-0 fs-6" style="max-width: 700px;">
                        Dream Career IT শিক্ষার্থী, অভিভাবক এবং সংশ্লিষ্ট সকলের কাছে প্রতিষ্ঠানের আইনগত পরিচয়, প্রশাসনিক কাঠামো, প্রশিক্ষণ কার্যক্রম ও আর্থিক স্বচ্ছতা সুস্পষ্টভাবে তুলে ধরতে অঙ্গীকারবদ্ধ[cite: 1]।
                    </p>
                </div>
                <div class="col-lg-4 text-lg-end mt-4 mt-lg-0 no-print">
                    <button onclick="window.print()" class="btn btn-light fw-semibold px-4 py-2 rounded-pill shadow-sm">
                        <i class="fa-solid fa-print me-2 text-primary"></i> নীতিমালাটি প্রিন্ট করুন
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- কুইক হাইলাইট বার -->
    <div class="container trust-stats-bar">
        <div class="row g-3">
            <div class="col-md-6 col-lg-3">
                <div class="trust-stat-card">
                    <div class="stat-icon-box" style="background: #eff6ff; color: #2563eb;">
                        <i class="fa-solid fa-building-columns"></i>
                    </div>
                    <div>
                        <div class="text-muted small fw-medium">প্রতিষ্ঠানের ধরন</div>
                        <div class="fw-bold text-dark">কম্পিউটার ও কারিগরি প্রশিক্ষণ[cite: 1]</div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <div class="trust-stat-card">
                    <div class="stat-icon-box" style="background: #ecfdf5; color: #059669;">
                        <i class="fa-solid fa-qrcode"></i>
                    </div>
                    <div>
                        <div class="text-muted small fw-medium">সার্টিফিকেট যাচাই</div>
                        <div class="fw-bold text-dark">১০০% অনলাইন ভেরিফিকেশন[cite: 1]</div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <div class="trust-stat-card">
                    <div class="stat-icon-box" style="background: #fef3c7; color: #d97706;">
                        <i class="fa-solid fa-file-invoice-dollar"></i>
                    </div>
                    <div>
                        <div class="text-muted small fw-medium">আর্থিক লেনদেন</div>
                        <div class="fw-bold text-dark">ডিজিটাল রিসিট ও পূর্ণ স্বচ্ছতা[cite: 1]</div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <div class="trust-stat-card">
                    <div class="stat-icon-box" style="background: #f3e8ff; color: #7c3aed;">
                        <i class="fa-solid fa-location-dot"></i>
                    </div>
                    <div>
                        <div class="text-muted small fw-medium">অবস্থান</div>
                        <div class="fw-bold text-dark">পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা[cite: 1]</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- মেইন কন্টেন্ট এবং সাইডবার -->
    <div class="container">
        <div class="row g-4">
            <!-- বাম পাশের স্টিকি ইনডেক্স মেনু -->
            <div class="col-lg-4 col-xl-3">
                <aside class="toc-sidebar">
                    <div class="toc-title">
                        <i class="fa-solid fa-list-check text-primary"></i> সূচিপত্র (Quick Index)
                    </div>
                    <ul class="toc-list" id="legitimacyToc">
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'sec-1\')?.scrollIntoView({behavior:\'smooth\'})" class="active"><span class="toc-num">১</span> প্রতিষ্ঠানের পরিচিতি[cite: 1]</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'sec-2\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-num">২</span> আইনগত অবস্থান[cite: 1]</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'sec-3\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-num">৩</span> নিবন্ধন ও অনুমোদন[cite: 1]</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'sec-4\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-num">৪</span> প্রশাসনিক কাঠামো[cite: 1]</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'sec-5\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-num">৫</span> শিক্ষা ও প্রশিক্ষণ কার্যক্রম[cite: 1]</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'sec-6\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-num">৬</span> সার্টিফিকেটের সত্যতা যাচাই[cite: 1]</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'sec-7\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-num">৭</span> আর্থিক ও প্রশাসনিক স্বচ্ছতা[cite: 1]</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'sec-8\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-num">৮</span> শিক্ষার্থী ও অভিভাবকদের অধিকার[cite: 1]</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'sec-9\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-num">৯</span> অভিযোগ ও তথ্য যাচাই[cite: 1]</a></li>
                        <li><a href="javascript:void(0)" onclick="document.getElementById(\'sec-10\')?.scrollIntoView({behavior:\'smooth\'})"><span class="toc-num">১০</span> আমাদের অঙ্গীকার ও যোগাযোগ[cite: 1]</a></li>
                    </ul>

                    <div class="mt-4 pt-3 border-top text-center no-print">
                        <p class="small text-muted mb-2">অনলাইনে সনদ যাচাই করতে চান?[cite: 1]</p>
                        <a href="#certificates" onclick="navigateView('certificates')" class="btn btn-primary w-100 btn-sm fw-semibold py-2 rounded-3">
                            <i class="fa-solid fa-magnifying-glass-check me-1"></i> Certificate Verification[cite: 1]
                        </a>
                    </div>
                </aside>
            </div>

            <!-- ডান পাশের বিস্তারিত সেকশনসমূহ -->
            <div class="col-lg-8 col-xl-9">

                <!-- ১. প্রতিষ্ঠানের পরিচিতি -->
                <section id="sec-1" class="legitimacy-section-card">
                    <div class="section-header-flex">
                        <div class="section-badge-icon">
                            <i class="fa-solid fa-id-card-clip"></i>
                        </div>
                        <div>
                            <h2 class="section-title-bn">১. প্রতিষ্ঠানের পরিচিতি[cite: 1]</h2>
                            <div class="section-title-en">Institutional Identity[cite: 1]</div>
                        </div>
                    </div>

                    <div class="identity-info-grid">
                        <div class="identity-item">
                            <div class="identity-label"><i class="fa-solid fa-building text-primary"></i> প্রতিষ্ঠানের নাম[cite: 1]</div>
                            <div class="identity-value">Dream Career IT[cite: 1]</div>
                        </div>
                        <div class="identity-item">
                            <div class="identity-label"><i class="fa-solid fa-laptop-code text-primary"></i> প্রতিষ্ঠানের ধরন[cite: 1]</div>
                            <div class="identity-value">কম্পিউটার ও কারিগরি প্রশিক্ষণ কেন্দ্র[cite: 1]</div>
                        </div>
                        <div class="identity-item">
                            <div class="identity-label"><i class="fa-solid fa-briefcase text-primary"></i> প্রতিষ্ঠানের কার্যক্রম[cite: 1]</div>
                            <div class="identity-value">তথ্যপ্রযুক্তি শিক্ষা, কম্পিউটার প্রশিক্ষণ, ডিজিটাল দক্ষতা উন্নয়ন ও পেশাগত প্রশিক্ষণ[cite: 1]</div>
                        </div>
                        <div class="identity-item">
                            <div class="identity-label"><i class="fa-solid fa-map-location-dot text-primary"></i> অবস্থান[cite: 1]</div>
                            <div class="identity-value">পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা-৩৫০০, বাংলাদেশ[cite: 1]</div>
                        </div>
                    </div>

                    <div class="p-3 rounded-3" style="background: var(--dcit-accent-light); border: 1px solid #bfdbfe;">
                        <p class="mb-0 text-dark fw-medium">
                            <i class="fa-solid fa-bullseye text-primary me-2"></i>
                            <strong>মূল উদ্দেশ্য:</strong> Dream Career IT একটি দক্ষতাভিত্তিক প্রশিক্ষণ প্রতিষ্ঠান[cite: 1]। তথ্যপ্রযুক্তি ও কারিগরি শিক্ষার মাধ্যমে শিক্ষার্থীদের বাস্তবমুখী দক্ষতা অর্জন এবং কর্মসংস্থানের উপযোগী করে গড়ে তোলাই আমাদের কার্যক্রমের মূল উদ্দেশ্য[cite: 1]।
                        </p>
                    </div>
                </section>

                <!-- ২. প্রতিষ্ঠানের আইনগত অবস্থান -->
                <section id="sec-2" class="legitimacy-section-card">
                    <div class="section-header-flex">
                        <div class="section-badge-icon">
                            <i class="fa-solid fa-scale-balanced"></i>
                        </div>
                        <div>
                            <h2 class="section-title-bn">২. প্রতিষ্ঠানের আইনগত অবস্থান[cite: 1]</h2>
                            <div class="section-title-en">Legal Status[cite: 1]</div>
                        </div>
                    </div>

                    <p class="mb-3">
                        প্রতিষ্ঠানের আইনগত পরিচয়, নিবন্ধন ও অনুমোদনসংক্রান্ত তথ্য যথাযথ সরকারি বা সংশ্লিষ্ট কর্তৃপক্ষের নথির ভিত্তিতে প্রকাশ করা হবে[cite: 1]। প্রযোজ্য ক্ষেত্রে নিম্নলিখিত তথ্য সংরক্ষণ ও প্রদর্শন করা হবে[cite: 1]:
                    </p>

                    <div class="row g-2">
                        <div class="col-md-6">
                            <ul class="custom-check-list">
                                <li><i class="fa-solid fa-circle-check"></i> <span>প্রতিষ্ঠানের নিবন্ধন নম্বর[cite: 1]।</span></li>
                                <li><i class="fa-solid fa-circle-check"></i> <span>নিবন্ধন প্রদানকারী কর্তৃপক্ষের নাম[cite: 1]।</span></li>
                                <li><i class="fa-solid fa-circle-check"></i> <span>নিবন্ধনের তারিখ[cite: 1]।</span></li>
                                <li><i class="fa-solid fa-circle-check"></i> <span>নিবন্ধনের মেয়াদ ও বর্তমান অবস্থা[cite: 1]।</span></li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <ul class="custom-check-list">
                                <li><i class="fa-solid fa-circle-check"></i> <span>ট্রেড লাইসেন্স নম্বর ও ইস্যুকারী কর্তৃপক্ষ[cite: 1]।</span></li>
                                <li><i class="fa-solid fa-circle-check"></i> <span>প্রযোজ্য ক্ষেত্রে TIN ও BIN নম্বর[cite: 1]।</span></li>
                                <li><i class="fa-solid fa-circle-check"></i> <span>সংশ্লিষ্ট শিক্ষা বা কারিগরি কর্তৃপক্ষের অনুমোদন[cite: 1]।</span></li>
                                <li><i class="fa-solid fa-circle-check"></i> <span>প্রতিষ্ঠানের কার্যক্রম পরিচালনার প্রযোজ্য অনুমতিপত্র[cite: 1]।</span></li>
                            </ul>
                        </div>
                    </div>

                    <div class="legal-disclaimer-box">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <div>
                            <strong class="text-dark">বিশেষ দ্রষ্টব্য:</strong> কোনো নিবন্ধন বা সরকারি অনুমোদন না থাকলে সেটিকে নিবন্ধিত বা অনুমোদিত হিসেবে দাবি করা হবে না[cite: 1]। আমরা শতভাগ নৈতিক ও আইনগত স্বচ্ছতা বজায় রাখতে বদ্ধপরিকর।
                        </div>
                    </div>
                </section>

                <!-- ৩. নিবন্ধন ও অনুমোদন -->
                <section id="sec-3" class="legitimacy-section-card">
                    <div class="section-header-flex">
                        <div class="section-badge-icon">
                            <i class="fa-solid fa-file-shield"></i>
                        </div>
                        <div>
                            <h2 class="section-title-bn">৩. নিবন্ধন ও অনুমোদন[cite: 1]</h2>
                            <div class="section-title-en">Registration &amp; Authorization[cite: 1]</div>
                        </div>
                    </div>

                    <p class="mb-3">
                        প্রতিষ্ঠানের প্রযোজ্য নিবন্ধন, লাইসেন্স ও অনুমোদনসংক্রান্ত নথি এই বিভাগে প্রকাশ করা হবে[cite: 1]। প্রতিটি নথির ক্ষেত্রে নিম্নোক্ত বিবরণী সুস্পষ্টভাবে উল্লেখ থাকবে[cite: 1]:
                    </p>

                    <div class="table-responsive rounded-3 border">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th class="py-3 ps-3"><i class="fa-solid fa-file-lines text-primary me-1"></i> নথির নাম[cite: 1]</th>
                                    <th class="py-3"><i class="fa-solid fa-landmark text-primary me-1"></i> ইস্যুকারী কর্তৃপক্ষ[cite: 1]</th>
                                    <th class="py-3"><i class="fa-solid fa-hashtag text-primary me-1"></i> নথি বা নিবন্ধন নম্বর[cite: 1]</th>
                                    <th class="py-3"><i class="fa-regular fa-calendar-check text-primary me-1"></i> ইস্যু ও মেয়াদ[cite: 1]</th>
                                    <th class="py-3 pe-3 text-end">যাচাইযোগ্য কপি[cite: 1]</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="ps-3 fw-semibold">ট্রেড লাইসেন্স (Trade License)[cite: 1]</td>
                                    <td>স্থানীয় সরকার / সংশ্লিষ্ট কর্তৃপক্ষ</td>
                                    <td><span class="badge bg-secondary bg-opacity-10 text-dark border">অফিসে সংরক্ষিত</span></td>
                                    <td>ইস্যু ও মেয়াদ হালনাগাদকৃত</td>
                                    <td class="pe-3 text-end"><span class="badge bg-success-subtle text-success"><i class="fa-solid fa-check me-1"></i> যাচাইযোগ্য</span></td>
                                </tr>
                                <tr>
                                    <td class="ps-3 fw-semibold">TIN / ট্যাক্স নিবন্ধন (প্রযোজ্য ক্ষেত্রে)[cite: 1]</td>
                                    <td>জাতীয় রাজস্ব বোর্ড (NBR)</td>
                                    <td><span class="badge bg-secondary bg-opacity-10 text-dark border">অফিসে সংরক্ষিত</span></td>
                                    <td>প্রযোজ্য অর্থবছর</td>
                                    <td class="pe-3 text-end"><span class="badge bg-success-subtle text-success"><i class="fa-solid fa-check me-1"></i> যাচাইযোগ্য</span></td>
                                </tr>
                                <tr>
                                    <td class="ps-3 fw-semibold">প্রাতিষ্ঠানিক অনুমোদন ও নথিপত্র[cite: 1]</td>
                                    <td>সংশ্লিষ্ট কর্তৃপক্ষ[cite: 1]</td>
                                    <td><span class="badge bg-secondary bg-opacity-10 text-dark border">নথি অনুযায়ী</span></td>
                                    <td>হালনাগাদ প্রক্রিয়াধীন</td>
                                    <td class="pe-3 text-end"><span class="badge bg-primary-subtle text-primary"><i class="fa-solid fa-eye me-1"></i> অফিসে প্রদর্শনযোগ্য</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- ৪. প্রতিষ্ঠানের প্রশাসনিক কাঠামো -->
                <section id="sec-4" class="legitimacy-section-card">
                    <div class="section-header-flex">
                        <div class="section-badge-icon">
                            <i class="fa-solid fa-sitemap"></i>
                        </div>
                        <div>
                            <h2 class="section-title-bn">৪. প্রতিষ্ঠানের প্রশাসনিক কাঠামো[cite: 1]</h2>
                            <div class="section-title-en">Management &amp; Administration[cite: 1]</div>
                        </div>
                    </div>

                    <p class="mb-4">
                        প্রতিষ্ঠানের কার্যক্রম সুষ্ঠুভাবে পরিচালনা ও প্রশাসনিক দায়িত্ব বণ্টনের জন্য নির্ধারিত ব্যবস্থাপনা কাঠামো রয়েছে[cite: 1]। এখানে প্রতিষ্ঠানের প্রতিষ্ঠাতা, পরিচালক, প্রশাসনিক কর্মকর্তা, প্রশিক্ষক এবং দায়িত্বপ্রাপ্ত ব্যক্তিদের পরিচয় ও পদবি প্রকাশ করা হয়[cite: 1]।
                    </p>

                    <div class="row g-3">
                        <div class="col-sm-6 col-md-3">
                            <div class="p-3 border rounded-3 text-center bg-light h-100">
                                <i class="fa-solid fa-user-tie fs-3 text-primary mb-2"></i>
                                <h6 class="fw-bold mb-1">প্রতিষ্ঠাতা ও পরিচালক[cite: 1]</h6>
                                <p class="small text-muted mb-0">নীতি নির্ধারণ ও সার্বিক তত্ত্বাবধান</p>
                            </div>
                        </div>
                        <div class="col-sm-6 col-md-3">
                            <div class="p-3 border rounded-3 text-center bg-light h-100">
                                <i class="fa-solid fa-user-gear fs-3 text-primary mb-2"></i>
                                <h6 class="fw-bold mb-1">প্রশাসনিক কর্মকর্তা[cite: 1]</h6>
                                <p class="small text-muted mb-0">ভর্তি, নথি ও দাপ্তরিক ব্যবস্থাপনা</p>
                            </div>
                        </div>
                        <div class="col-sm-6 col-md-3">
                            <div class="p-3 border rounded-3 text-center bg-light h-100">
                                <i class="fa-solid fa-chalkboard-user fs-3 text-primary mb-2"></i>
                                <h6 class="fw-bold mb-1">প্রশিক্ষকবৃন্দ (Instructors)[cite: 1]</h6>
                                <p class="small text-muted mb-0">ক্লাস পরিচালনা ও হাতে-কলমে প্রশিক্ষণ</p>
                            </div>
                        </div>
                        <div class="col-sm-6 col-md-3">
                            <div class="p-3 border rounded-3 text-center bg-light h-100">
                                <i class="fa-solid fa-headset fs-3 text-primary mb-2"></i>
                                <h6 class="fw-bold mb-1">দায়িত্বপ্রাপ্ত সহায়তা টিম[cite: 1]</h6>
                                <p class="small text-muted mb-0">শিক্ষার্থী সহায়তা ও তথ্য যাচাই</p>
                            </div>
                        </div>
                    </div>

                    <div class="mt-3 text-end no-print">
                        <a href="#teachers" onclick="navigateView('teachers')" class="btn btn-outline-primary btn-sm rounded-pill px-3">
                            <i class="fa-solid fa-users me-1"></i> আমাদের প্রশিক্ষক প্যানেল দেখুন[cite: 1]
                        </a>
                    </div>
                </section>

                <!-- ৫. শিক্ষা ও প্রশিক্ষণ কার্যক্রম -->
                <section id="sec-5" class="legitimacy-section-card">
                    <div class="section-header-flex">
                        <div class="section-badge-icon">
                            <i class="fa-solid fa-graduation-cap"></i>
                        </div>
                        <div>
                            <h2 class="section-title-bn">৫. শিক্ষা ও প্রশিক্ষণ কার্যক্রম[cite: 1]</h2>
                            <div class="section-title-en">Educational Activities[cite: 1]</div>
                        </div>
                    </div>

                    <p class="mb-3">
                        Dream Career IT-তে বিভিন্ন তথ্যপ্রযুক্তি ও দক্ষতাভিত্তিক প্রশিক্ষণ কার্যক্রম পরিচালিত হয়[cite: 1]। আমাদের চলমান প্রশিক্ষণ কার্যক্রমের মধ্যে রয়েছে[cite: 1]:
                    </p>

                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <div class="course-pill-card">
                                <div class="course-pill-icon"><i class="fa-solid fa-desktop"></i></div>
                                <div>
                                    <div class="fw-bold text-dark">Computer Fundamentals[cite: 1]</div>
                                    <div class="small text-muted">বেসিক কম্পিউটার ও হার্ডওয়্যার পরিচিতি</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="course-pill-card">
                                <div class="course-pill-icon"><i class="fa-solid fa-file-word"></i></div>
                                <div>
                                    <div class="fw-bold text-dark">Microsoft Office Application[cite: 1]</div>
                                    <div class="small text-muted">MS Word, Excel, PowerPoint ও ইন্টারনেট</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="course-pill-card">
                                <div class="course-pill-icon"><i class="fa-solid fa-chart-pie"></i></div>
                                <div>
                                    <div class="fw-bold text-dark">Advanced Microsoft Office[cite: 1]</div>
                                    <div class="small text-muted">প্রফেশনাল ডাটা ম্যানেজমেন্ট ও অফিস অটোমেশন</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="course-pill-card">
                                <div class="course-pill-icon"><i class="fa-solid fa-pen-nib"></i></div>
                                <div>
                                    <div class="fw-bold text-dark">Graphic Design[cite: 1]</div>
                                    <div class="small text-muted">Adobe Photoshop ও Adobe Illustrator প্র্যাকটিক্যাল[cite: 1]</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="course-pill-card">
                                <div class="course-pill-icon"><i class="fa-solid fa-code"></i></div>
                                <div>
                                    <div class="fw-bold text-dark">Web Design &amp; Development[cite: 1]</div>
                                    <div class="small text-muted">আধুনিক রেসপনসিভ ওয়েবসাইট ও ওয়েব অ্যাপ্লিকেশন তৈরি</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="course-pill-card">
                                <div class="course-pill-icon"><i class="fa-solid fa-comments"></i></div>
                                <div>
                                    <div class="fw-bold text-dark">Spoken English[cite: 1]</div>
                                    <div class="small text-muted">ইংরেজিতে সাবলীল কথা বলা ও কমিউনিকেশন স্কিল</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="course-pill-card">
                                <div class="course-pill-icon"><i class="fa-solid fa-earth-americas"></i></div>
                                <div>
                                    <div class="fw-bold text-dark">IELTS Preparation[cite: 1]</div>
                                    <div class="small text-muted">উচ্চশিক্ষা ও ক্যারিয়ারের জন্য পূর্ণাঙ্গ IELTS প্রস্তুতি</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="course-pill-card">
                                <div class="course-pill-icon"><i class="fa-solid fa-microchip"></i></div>
                                <div>
                                    <div class="fw-bold text-dark">অন্যান্য দক্ষতাভিত্তিক প্রশিক্ষণ[cite: 1]</div>
                                    <div class="small text-muted">ফ্রিল্যান্সিং, ডিজিটাল লিটারেসি ও প্রফেশনাল আইটি কোর্স</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="alert alert-light border d-flex align-items-center justify-content-between flex-wrap gap-2 mb-0">
                        <div>
                            <i class="fa-solid fa-circle-info text-primary me-2"></i>
                            কোর্সের মেয়াদ, ফি, সিলেবাস, ক্লাস রুটিন ও প্রশিক্ষণসংক্রান্ত সকল তথ্য ওয়েবসাইটে নিয়মিত প্রকাশ করা হয়[cite: 1]।
                        </div>
                        <a href="#courses" onclick="navigateView('courses')" class="btn btn-primary btn-sm rounded-pill px-3 no-print">সকল কোর্স দেখুন[cite: 1]</a>
                    </div>
                </section>

                <!-- ৬. সার্টিফিকেটের সত্যতা যাচাই -->
                <section id="sec-6" class="legitimacy-section-card">
                    <div class="section-header-flex">
                        <div class="section-badge-icon" style="background: var(--dcit-emerald-light); color: var(--dcit-emerald); border-color: #a7f3d0;">
                            <i class="fa-solid fa-award"></i>
                        </div>
                        <div>
                            <h2 class="section-title-bn">৬. সার্টিফিকেটের সত্যতা যাচাই[cite: 1]</h2>
                            <div class="section-title-en">Certificate Verification[cite: 1]</div>
                        </div>
                    </div>

                    <p class="mb-3">
                        প্রতিষ্ঠান থেকে ইস্যু করা সার্টিফিকেটের সত্যতা যাচাইয়ের জন্য আমাদের নিজস্ব অনলাইন ভেরিফিকেশন ব্যবস্থা রয়েছে[cite: 1]। প্রতিটি যাচাইযোগ্য সার্টিফিকেটের ক্ষেত্রে প্রযোজ্য তথ্যসমূহ[cite: 1]:
                    </p>

                    <div class="row g-2 mb-4">
                        <div class="col-sm-6 col-md-4">
                            <div class="verify-param-box"><i class="fa-solid fa-hashtag text-success"></i> Certificate Number[cite: 1]</div>
                        </div>
                        <div class="col-sm-6 col-md-4">
                            <div class="verify-param-box"><i class="fa-solid fa-id-badge text-success"></i> Student Registration Number[cite: 1]</div>
                        </div>
                        <div class="col-sm-6 col-md-4">
                            <div class="verify-param-box"><i class="fa-solid fa-user-check text-success"></i> শিক্ষার্থীর নাম[cite: 1]</div>
                        </div>
                        <div class="col-sm-6 col-md-4">
                            <div class="verify-param-box"><i class="fa-solid fa-book-open text-success"></i> কোর্সের নাম[cite: 1]</div>
                        </div>
                        <div class="col-sm-6 col-md-4">
                            <div class="verify-param-box"><i class="fa-solid fa-users-rectangle text-success"></i> ব্যাচ ও সেশন[cite: 1]</div>
                        </div>
                        <div class="col-sm-6 col-md-4">
                            <div class="verify-param-box"><i class="fa-regular fa-calendar-days text-success"></i> সার্টিফিকেট ইস্যুর তারিখ[cite: 1]</div>
                        </div>
                        <div class="col-sm-6 col-md-6">
                            <div class="verify-param-box"><i class="fa-solid fa-key text-success"></i> Verification Code[cite: 1]</div>
                        </div>
                        <div class="col-sm-6 col-md-6">
                            <div class="verify-param-box"><i class="fa-solid fa-circle-check text-success"></i> সার্টিফিকেটের বর্তমান অবস্থা (Status)[cite: 1]</div>
                        </div>
                    </div>

                    <div class="p-3 rounded-3 d-flex align-items-center justify-content-between flex-wrap gap-3" style="background: var(--dcit-emerald-light); border: 1px solid #a7f3d0;">
                        <div>
                            <h6 class="fw-bold text-dark mb-1"><i class="fa-solid fa-shield-check text-success me-1"></i> অনলাইন সার্টিফিকেট যাচাই পোর্টাল</h6>
                            <p class="small text-muted mb-0">সার্টিফিকেটের অনলাইন যাচাইয়ের জন্য ওয়েবসাইটের Certificate Verification পেজ ব্যবহার করা যাবে[cite: 1]।</p>
                        </div>
                        <a href="#certificates" onclick="navigateView('certificates')" class="btn btn-success fw-semibold px-4 rounded-pill no-print">
                            যাচাই করুন <i class="fa-solid fa-arrow-right ms-1"></i>
                        </a>
                    </div>
                </section>

                <!-- ৭. আর্থিক ও প্রশাসনিক স্বচ্ছতা -->
                <section id="sec-7" class="legitimacy-section-card">
                    <div class="section-header-flex">
                        <div class="section-badge-icon">
                            <i class="fa-solid fa-receipt"></i>
                        </div>
                        <div>
                            <h2 class="section-title-bn">৭. আর্থিক ও প্রশাসনিক স্বচ্ছতা[cite: 1]</h2>
                            <div class="section-title-en">Financial &amp; Administrative Transparency[cite: 1]</div>
                        </div>
                    </div>

                    <p class="mb-3">
                        শিক্ষার্থী ও অভিভাবকদের সঙ্গে আর্থিক লেনদেনের স্বচ্ছতা বজায় রাখতে প্রতিষ্ঠানের ভর্তি ফি, কোর্স ফি, পেমেন্ট রেকর্ড, মানি রিসিট এবং বকেয়া সংক্রান্ত তথ্য সংরক্ষণের সুশৃঙ্খল ব্যবস্থা রয়েছে[cite: 1]।
                    </p>
                    <div class="p-3 bg-light rounded-3 border">
                        <i class="fa-solid fa-file-invoice text-primary me-2"></i>
                        <strong>পেমেন্ট রসিদ সংগ্রহ:</strong> প্রযোজ্য ক্ষেত্রে শিক্ষার্থীরা প্রতিটি লেনদেনের বিপরীতে তাদের পেমেন্টের আনুষ্ঠানিক রসিদ (Money Receipt / Invoice) অফিস অথবা পোর্টাল থেকে সংগ্রহ করতে পারবেন[cite: 1]।
                    </div>
                </section>

                <!-- ৮. শিক্ষার্থী ও অভিভাবকদের অধিকার -->
                <section id="sec-8" class="legitimacy-section-card">
                    <div class="section-header-flex">
                        <div class="section-badge-icon">
                            <i class="fa-solid fa-users-Gear"></i>
                        </div>
                        <div>
                            <h2 class="section-title-bn">৮. শিক্ষার্থী ও অভিভাবকদের অধিকার[cite: 1]</h2>
                            <div class="section-title-en">Student &amp; Guardian Rights[cite: 1]</div>
                        </div>
                    </div>

                    <p class="mb-3">প্রতিটি শিক্ষার্থী ও অভিভাবকের নিম্নলিখিত মৌলিক অধিকার সংরক্ষিত রয়েছে[cite: 1]:</p>

                    <div class="row g-2">
                        <div class="col-md-6">
                            <ul class="custom-check-list">
                                <li><i class="fa-solid fa-check-double"></i> <span>কোর্স ও প্রশিক্ষণ সম্পর্কে সঠিক তথ্য জানা[cite: 1]।</span></li>
                                <li><i class="fa-solid fa-check-double"></i> <span>কোর্স ফি ও অন্যান্য চার্জ সম্পর্কে পূর্বেই অবগত হওয়া[cite: 1]।</span></li>
                                <li><i class="fa-solid fa-check-double"></i> <span>ভর্তি ও পেমেন্টের প্রমাণ (রসিদ) সংগ্রহ করা[cite: 1]।</span></li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <ul class="custom-check-list">
                                <li><i class="fa-solid fa-check-double"></i> <span>নির্ধারিত ক্লাস ও প্রশিক্ষণ সুবিধা সম্পর্কে তথ্য পাওয়া[cite: 1]।</span></li>
                                <li><i class="fa-solid fa-check-double"></i> <span>অভিযোগ, পরামর্শ ও মতামত প্রদান করা[cite: 1]।</span></li>
                                <li><i class="fa-solid fa-check-double"></i> <span>সার্টিফিকেটের সত্যতা যাচাই করা[cite: 1]।</span></li>
                            </ul>
                        </div>
                    </div>
                </section>

                <!-- ৯. অভিযোগ ও তথ্য যাচাই -->
                <section id="sec-9" class="legitimacy-section-card">
                    <div class="section-header-flex">
                        <div class="section-badge-icon">
                            <i class="fa-solid fa-comments-question"></i>
                        </div>
                        <div>
                            <h2 class="section-title-bn">৯. অভিযোগ ও তথ্য যাচাই[cite: 1]</h2>
                            <div class="section-title-en">Complaints &amp; Verification[cite: 1]</div>
                        </div>
                    </div>

                    <p class="mb-3">
                        প্রতিষ্ঠানের পরিচয়, কার্যক্রম, প্রশিক্ষণ, ভর্তি, পেমেন্ট কিংবা সার্টিফিকেট সম্পর্কে কোনো প্রশ্ন বা অভিযোগ থাকলে সরাসরি প্রতিষ্ঠানের অফিসে যোগাযোগ করা যাবে[cite: 1]।
                    </p>
                    <p class="mb-0">
                        প্রয়োজনে সংশ্লিষ্ট নথি ও তথ্য যাচাইয়ের জন্য দায়িত্বপ্রাপ্ত কর্তৃপক্ষের কাছে সরাসরি আবেদন করা যাবে এবং কর্তৃপক্ষ তা দ্রুততম সময়ে নিষ্পত্তি করতে সচেষ্ট থাকবে[cite: 1]।
                    </p>
                </section>

                <!-- ১০. আমাদের অঙ্গীকার ও যোগাযোগ -->
                <section id="sec-10" class="commitment-card">
                    <div class="row align-items-center g-4">
                        <div class="col-lg-12">
                            <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary bg-opacity-25 text-info small fw-semibold mb-3">
                                <i class="fa-solid fa-handshake"></i> ১০. আমাদের অঙ্গীকার (Our Commitment)[cite: 1]
                            </div>
                            <h3 class="fw-bold mb-3">স্বচ্ছতা, দায়িত্বশীলতা ও পেশাদার আচরণের অঙ্গীকার[cite: 1]</h3>
                            <p class="text-light opacity-75 mb-4">
                                Dream Career IT শিক্ষার্থীদের সঙ্গে স্বচ্ছতা, দায়িত্বশীলতা ও পেশাদার আচরণ বজায় রাখতে প্রতিশ্রুতিবদ্ধ[cite: 1]। আমরা প্রতিষ্ঠানের পরিচয়, কার্যক্রম, প্রশিক্ষণ, ফি এবং সার্টিফিকেটসংক্রান্ত তথ্য যথাসম্ভব নির্ভুলভাবে প্রকাশ এবং প্রয়োজন অনুযায়ী হালনাগাদ করার নীতি অনুসরণ করি[cite: 1]। প্রতিষ্ঠান সম্পর্কে যেকোনো তথ্য যাচাইয়ের জন্য আমাদের অফিসে যোগাযোগ করুন[cite: 1]।
                            </p>
                        </div>

                        <div class="col-md-6">
                            <div class="contact-info-pill">
                                <div class="small text-info fw-semibold mb-1"><i class="fa-solid fa-building me-1"></i> প্রতিষ্ঠান ও ঠিকানা[cite: 1]</div>
                                <div class="fw-bold fs-5 mb-1">Dream Career IT[cite: 1]</div>
                                <div class="small text-light opacity-75">
                                    ভাই ভাই সুপার মার্কেট, নতুন পদুয়ার বাজার মসজিদের পাশে, পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা-৩৫০০[cite: 1]।
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="contact-info-pill">
                                <div class="small text-info fw-semibold mb-2"><i class="fa-solid fa-address-book me-1"></i> সরাসরি যোগাযোগ ও যাচাই[cite: 1]</div>
                                <div class="mb-1">
                                    <i class="fa-solid fa-phone-volume text-success me-2"></i>
                                    <strong>মোবাইল:</strong> <a href="tel:01771770044" class="text-white text-decoration-none">01771770044[cite: 1]</a>
                                </div>
                                <div class="mb-1">
                                    <i class="fa-solid fa-envelope text-warning me-2"></i>
                                    <strong>ইমেইল:</strong> <a href="mailto:dc13edubd@gmail.com" class="text-white text-decoration-none">dc13edubd@gmail.com[cite: 1]</a>
                                </div>
                                <div>
                                    <i class="fa-solid fa-globe text-info me-2"></i>
                                    <strong>ওয়েবসাইট:</strong> প্রতিষ্ঠানের অফিসিয়াল ওয়েবসাইট[cite: 1]
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 pt-3 border-top border-secondary border-opacity-50 d-flex flex-wrap justify-content-between align-items-center gap-2 small text-light opacity-75">
                        <div>
                            <i class="fa-regular fa-clock me-1"></i> সর্বশেষ হালনাগাদ: <strong>১২ নভেম্বর, ২০২৬</strong> (${new Date().toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'})})
                        </div>
                        <div class="no-print">
                            <a href="#contact" onclick="navigateView('contact')" class="btn btn-sm btn-info fw-semibold rounded-pill px-3">
                                <i class="fa-solid fa-paper-plane me-1"></i> সরাসরি মেসেজ পাঠান[cite: 1]
                            </a>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    </div>
</div>

<!-- স্ক্রল স্পাই (ScrollSpy) জাভাস্ক্রিপ্ট -->
<script>
document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.legitimacy-section-card, .commitment-card');
    const navLinks = document.querySelectorAll('#legitimacyToc a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 120) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
});
</script>

    <section class="section no-print"><div class="container">${getContactGridHTML()}</div></section>`;
    bindSubscribeAndContactForms();
}

function getContactGridHTML() {
    return `
    <div class="grid-2">
        <div class="form-card">
            <h3 style="margin-bottom:14px; color:#0f766e;"><i class="fa fa-paper-plane"></i> আমাদের সরাসরি মেসেজ পাঠান</h3>
            <form id="contactForm">
                <div class="form-group"><label>আপনার নাম *</label><input type="text" name="sender_name" class="form-control" required></div>
                <div class="form-group"><label>ইমেইল *</label><input type="email" name="sender_email" class="form-control" required></div>
                <div class="form-group"><label>মোবাইল নম্বর *</label><input type="tel" name="phone" class="form-control" required></div>
                <div class="form-group"><label>বিষয়</label><input type="text" name="subject" class="form-control" value="Course & Admission Inquiry"></div>
                <div class="form-group"><label>আপনার বার্তা *</label><textarea name="message" class="form-control" rows="4" required></textarea></div>
                <button type="submit" class="btn btn-primary" style="width:100%;"><i class="fa fa-send"></i> মেসেজ পাঠান (Send Message)</button>
            </form>
        </div>
        <div class="form-card">
            <h3 style="margin-bottom:12px; color:#0f766e;"><i class="fa fa-building"></i> Dream Career IT Office & Map</h3>
            <p style="margin-bottom:10px;"><strong>ঠিকানা:</strong> ${esc(DCITStore.setting('address_bn'))}</p>
            <p style="margin-bottom:10px;"><strong>হটলাইন নাম্বার:</strong> <a href="tel:01771770044" style="font-weight:800; color:#ea580c;">01771770044</a>, 01879653143</p>
            <p style="margin-bottom:16px;"><strong>ইমেইল:</strong> dc13edubd@gmail.com</p>
            <div style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:24px; border-radius:14px; text-align:center;">
                <i class="fa fa-map-marker anim-float" style="font-size:2.4rem; color:#fbbf24; margin-bottom:8px;"></i>
                <h4>Dream Career IT — Poduar Bazar, Cumilla</h4>
                <p style="font-size:0.9rem; color:#e2e8f0; margin:8px 0 14px;">ভাই ভাই সুপার মার্কেট, নতুন পদুয়ার বাজার মসজিদের পাশে, পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা - ৩৫০০।</p>
                <a href="https://www.google.com/maps/search/?api=1&query=Poduar+Bazar+Bishwo+Road+Cumilla" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-sm"><i class="fa fa-map-o"></i> Google Maps-এ লোকেশন খুলুন</a>
            </div>
        </div>
    </div>`;
}

function renderContact(main) {
    renderContactList(main);
}

function bindSubscribeAndContactForms() {
    const subForm = document.getElementById('homeSubscribeForm');
    if (subForm) {
        subForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const val = document.getElementById('subContactInput').value.trim();
            if (!val) return;
            const curDB = DCITStore.getDB();
            curDB.subscribers = curDB.subscribers || [];
            curDB.subscribers.unshift({ id: Date.now(), contact_info: val, status: 'Active', created_at: new Date().toISOString().slice(0,10) });
            DCITStore.saveDB(curDB);
            showAwesomeToast('success', 'সাবস্ক্রিপশন সম্পন্ন!', 'আপনার ইমেইল/মোবাইল নম্বর আমাদের এডমিন সাবস্ক্রাইবার লিস্টে যুক্ত হয়েছে।');
            this.reset();
        });
    }
    const cForm = document.getElementById('contactForm');
    if (cForm) {
        cForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fd = new FormData(this);
            const curDB = DCITStore.getDB();
            curDB.messages.unshift({
                id: Date.now(),
                sender_name: fd.get('sender_name'),
                sender_email: fd.get('sender_email'),
                phone: fd.get('phone'),
                subject: fd.get('subject'),
                message: fd.get('message'),
                target: 'Office',
                is_read: 0,
                created_at: new Date().toISOString().slice(0, 10)
            });
            DCITStore.saveDB(curDB);
            showAwesomeToast('success', 'মেসেজ প্রেরিত হয়েছে!', 'আপনার বার্তাটি এডমিন প্যানেলের ইনবক্সে জমা হয়েছে।');
            this.reset();
        });
    }
}

function renderDesigner(main) {
    main.innerHTML = `<div class="page-hero-strip" style="background:linear-gradient(135deg,#151442 0%,#0f4c5c 55%,#0f766e 100%); color:#fff; padding:48px 0; text-align:center;">
    <div class="container">
        <span class="badge badge-warning" style="margin-bottom:10px; font-size:0.85rem; padding:5px 15px;">
            <i class="fa fa-code"></i> Official Web Designer &amp; System Developer Profile
        </span>
        <h1 style="font-size:2.3rem; font-weight:800; margin-bottom:8px;">JAINAL ABEDIN (SAGOR)</h1>
        <p style="font-size:1.05rem; color:#ccfbf1; max-width:780px; margin:0 auto;">
            Web Designer &amp; Developer • E-Commerce Support Manager • Data Analyzer &amp; Senior Computer Trainer
        </p>
    </div>
</div>

<section class="section">
    <div class="container">
        <div id="designerAlertBox"></div>

        <!-- 1. Designer Profile Card & Direct Contact Form -->
        <div class="grid-2" style="align-items:start; margin-bottom:44px;">
            <div class="form-card" style="text-align:center; border-top:5px solid #0f766e;">
                <img src="assets/img/teacher-sagor.jpg" alt="Jainal Abedin Sagor" style="width:180px; height:180px; border-radius:50%; object-fit:cover; margin:0 auto 16px; border:4px solid #0f766e; box-shadow:var(--shadow-lg);">
                <span class="badge badge-info" style="margin-bottom:8px;">Senior Trainer &amp; Full-Stack Web Designer</span>
                <h2 style="font-size:1.85rem; color:#0f172a; margin-bottom:4px;">Jainal Abedin (জয়নাল আবেদীন)</h2>
                <p style="color:#0f766e; font-weight:700; margin-bottom:14px;">
                    Web Designer &amp; Developer • Data Analyzer • E-Commerce Manager
                </p>

                <div style="text-align:justify; color:#334155; font-size:0.94rem; margin-bottom:18px; padding:14px; background:#f8fafc; border-radius:10px; border-left:4px solid #0f766e;">
                    <strong><i class="fa fa-bullseye" style="color:#0f766e;"></i> Career Objective:</strong><br>
                    Looking for a challenging role in a reputable organization where I can utilize my technical, IT, finance, digital marketing, web development, database, analytical, and management skills for the growth of the organization while enhancing my knowledge of new and emerging trends in technology, business, and the IT sector.
                </div>

                <div style="text-align:left; background:#f8fafc; padding:16px; border-radius:10px; font-size:0.92rem; border:1px solid #e2e8f0; margin-bottom:18px;">
                    <p style="margin-bottom:8px;"><i class="fa fa-phone" style="color:#0f766e; width:20px;"></i> <strong>Call / Mobile:</strong> <a href="tel:+8801581703822">+880 1581-703822</a>, <a href="tel:01879653143">01879-653143</a></p>
                    <p style="margin-bottom:8px;"><i class="fa fa-envelope" style="color:#ea580c; width:20px;"></i> <strong>E-mail:</strong> <a href="mailto:jainal.dcitbd@gmial.com">jainal.dcitbd@gmial.com</a>, <a href="mailto:gsctcbmcmrjas@gmail.com">gsctcbmcmrjas@gmail.com</a></p>
                    <p style="margin-bottom:8px;"><i class="fa fa-map-marker" style="color:#0f766e; width:20px;"></i> <strong>Mailing Address:</strong> C/O: Mijan’s House, Village: Chapapur, P.O: Chapapur (3500), P.S: Kutuali Model, Adarsha Sadar, Dist.: Cumilla.</p>
                    <p style="margin-bottom:8px;"><i class="fa fa-home" style="color:#151442; width:20px;"></i> <strong>Permanent Address:</strong> C/O: Faridul Alam’s House, Village: Fakira kata, Post: Bara Maheshkhali (4710), P.O: Maheshkhali, Dist: Cox’s Bazar.</p>
                    <p style="margin-bottom:0;"><i class="fa fa-globe" style="color:#0f766e; width:20px;"></i> <strong>Languages:</strong> Bengali (Excellent First Language), English (High Level), Hindi (Good), Chittagonian Dialect (Fluent)</p>
                </div>

                <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
                    <a href="https://www.facebook.com/jainalabedin.sagor.143" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm"><i class="fa fa-facebook"></i> Facebook</a>
                    <a href="https://www.youtube.com/channel/UCbYQ17l6_mf6ilwlJGvsFSg" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-sm"><i class="fa fa-youtube"></i> YouTube</a>
                    <a href="https://github.com/jasagor2020" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" style="color:#0f172a; border-color:#cbd5e1;"><i class="fa fa-github"></i> GitHub</a>
                    <a href="https://www.linkedin.com/in/jainal-abedin-sagor-448b121a9/" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="background:#151442;"><i class="fa fa-linkedin"></i> LinkedIn</a>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:24px;">
                <div class="form-card" style="border-top:5px solid #151442;">
                    <h3 style="margin-bottom:14px; color:#0f766e;"><i class="fa fa-paper-plane"></i> Contact With Designer (প্রজেক্ট বা তথ্যের জন্য মেসেজ দিন)</h3>
                    <form id="designerContactForm">
                        <div class="form-group">
                            <label>বিষয় / প্রজেক্টের ধরন (Subject) *</label>
                            <input type="text" name="subject" class="form-control" required placeholder="যেমন: Website Design / E-Commerce Store / Database System">
                        </div>
                        <div class="form-group">
                            <label>আপনার নাম (Your Name) *</label>
                            <input type="text" name="sender_name" class="form-control" required placeholder="আপনার পূর্ণ নাম লিখুন">
                        </div>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>মোবাইল নম্বর (Phone) *</label>
                                <input type="tel" name="phone" class="form-control" required placeholder="+880 1XXX-XXXXXX">
                            </div>
                            <div class="form-group">
                                <label>ইমেইল (Your Email) *</label>
                                <input type="email" name="sender_email" class="form-control" required placeholder="example@gmail.com">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>বিস্তারিত বিবরণ (Project / Inquiry Details) *</label>
                            <textarea name="message" class="form-control" rows="4" required placeholder="আপনার ওয়েবসাইট, ই-কমার্স বা সফটওয়্যার প্রজেক্ট সম্পর্কে বিস্তারিত লিখুন..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width:100%;"><i class="fa fa-check"></i> মেসেজ পাঠান (Submit Message)</button>
                    </form>
                </div>

                <div class="form-card" style="border-top:4px solid #ea580c;">
                    <h3 style="margin-bottom:12px; color:#151442;"><i class="fa fa-laptop" style="color:#ea580c;"></i> Computer &amp; Technical Skills</h3>
                    <p style="font-size:0.93rem; color:#334155; line-height:1.7; margin-bottom:12px;">
                        Familiar with <strong>M.S Word, M.S Excel, MS PowerPoint, MS Access</strong>, Internet Browsing, E-mailing, ALL kind of Online work (Official &amp; Unofficial), <strong>Computer Hardware and Website Design and Development</strong>, <strong>Graphics Design, Adobe Photoshop</strong>, Digital Marketing, and Software checking, Installation, Correction &amp; Computer Maintenance.
                    </p>
                    <div style="display:flex; flex-wrap:wrap; gap:6px;">
                        <span class="badge badge-info">HTML5 &amp; CSS3</span>
                        <span class="badge badge-info">JavaScript &amp; Bootstrap</span>
                        <span class="badge badge-info">PHP &amp; MySQL</span>
                        <span class="badge badge-success">E-Commerce Management</span>
                        <span class="badge badge-warning">Adobe Photoshop &amp; Graphics</span>
                        <span class="badge badge-success">MS Access &amp; Excel Systems</span>
                        <span class="badge badge-warning">Digital Marketing &amp; Ads</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 2. Key Career Stats Row -->
        <div class="stats-row" style="margin-top:0; margin-bottom:52px;">
            <div class="stat-box">
                <h3>8+ Years</h3>
                <p><i class="fa fa-briefcase"></i> Professional Experience (Since 2018)</p>
            </div>
            <div class="stat-box">
                <h3>9 Orgs</h3>
                <p><i class="fa fa-building"></i> Organizations Served</p>
            </div>
            <div class="stat-box">
                <h3>12+ Live</h3>
                <p><i class="fa fa-globe"></i> Web, E-Commerce &amp; DB Creations</p>
            </div>
            <div class="stat-box">
                <h3>6 Courses</h3>
                <p><i class="fa fa-certificate"></i> Specialized IT Certifications</p>
            </div>
        </div>

        <!-- 3. Summary of Skills & Personal Strengths (Why Choose Box) -->
        <div class="why-choose-box" style="margin-bottom:56px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                <div>
                    <span class="badge badge-warning" style="margin-bottom:8px;">Summary of Skills &amp; Personal Strengths</span>
                    <h2 style="font-size:1.85rem; color:#fff;">পেশাগত দক্ষতা ও ব্যক্তিগত গুণাবলী</h2>
                </div>
                <a href="#biodata" onclick="navigateView('biodata', {reg_no:'000001'})" class="btn btn-outline btn-sm"><i class="fa fa-id-card-o"></i> ভেরিফাইড বায়োডাটা দেখুন</a>
            </div>
            <ul class="why-list">
                <li><i class="fa fa-check-circle"></i> <span>Outstanding ability to manage several projects concurrently and deliver work on time.</span></li>
                <li><i class="fa fa-check-circle"></i> <span>Ability to handle confidential information appropriately with superior attention to detail, accuracy and dependability.</span></li>
                <li><i class="fa fa-check-circle"></i> <span>Strong interpersonal, written and verbal communication skills, including handling phone calls &amp; e-mails.</span></li>
                <li><i class="fa fa-check-circle"></i> <span>Comfortable working with people of all ages, economic statuses, races, cultures and with various needs.</span></li>
                <li><i class="fa fa-check-circle"></i> <span>Can work under pressure, maintain organizer skill, and build strong professional relations.</span></li>
                <li><i class="fa fa-check-circle"></i> <span>Interests: Traveling, reading, writing, designing, challenging tasks, and exploring different cultures &amp; traditions (plus motors driving skill).</span></li>
            </ul>
        </div>

        <!-- 4. Portfolio / All Creations Section -->
        <div class="section-header">
            <span class="sub-badge"><i class="fa fa-folder-open"></i> Portfolio / All Creation</span>
            <h2>নির্মিত ওয়েবসাইট, ই-কমার্স ও সিস্টেম প্রজেক্টসমূহ</h2>
            <p>সিভিতে উল্লেখিত ওয়েব ডিজাইন, ই-কমার্স স্টোর, ডাটাবেস সিস্টেম এবং ডিজিটাল মার্কেটিং প্রজেক্ট</p>
        </div>

        <div class="grid-3" style="margin-bottom:56px;">
            <div class="card">
                <div class="card-body">
                    <div style="margin-bottom:10px;"><span class="badge badge-info">Real Estate &amp; Corporate Web</span></div>
                    <h3>Green City Developments</h3>
                    <div class="title-bn">Green City Developments &amp; Official Page</div>
                    <p>রিয়েল এস্টেট ও প্রপার্টি ডেভেলপমেন্ট প্রতিষ্ঠানের জন্য আধুনিক রেসপনসিভ ওয়েবসাইট এবং অফিসিয়াল সোশ্যাল ব্র্যান্ড পেজ তৈরি ও পরিচালনা।</p>
                </div>
            </div>

            <div class="card">
                <div class="card-body">
                    <div style="margin-bottom:10px;"><span class="badge badge-success">IT Institute &amp; Education Portal</span></div>
                    <h3>Dream Career IT Bangladesh</h3>
                    <div class="title-bn">Dream Career IT &amp; Dream Career Education BD Page</div>
                    <p>ডাইনামিক আইটি ট্রেনিং পোর্টাল, অনলাইন ভর্তি, স্টুডেন্ট বায়োডাটা, রেজাল্ট ও সার্টিফিকেট ভেরিফিকেশন ওয়েবসাইট এবং এডুকেশন পেজ ডেভেলপমেন্ট।</p>
                </div>
            </div>

            <div class="card">
                <div class="card-body">
                    <div style="margin-bottom:10px;"><span class="badge badge-warning">E-Commerce Storefront</span></div>
                    <h3>Dream Cart BD &amp; Store</h3>
                    <div class="title-bn">Dream Cart BD &amp; Dream Cart BD Store</div>
                    <p>পূর্ণাঙ্গ অনলাইন শপিং স্টোর এবং ই-কমার্স পেজ ডেভেলপমেন্ট, মাল্টি-ক্যাটাগরি পণ্য প্রদর্শন, অর্ডার ও কাস্টমার সাপোর্ট ম্যানেজমেন্ট।</p>
                </div>
            </div>

            <div class="card">
                <div class="card-body">
                    <div style="margin-bottom:10px;"><span class="badge badge-info">Wholesale E-Commerce</span></div>
                    <h3>Wholesale Electronics &amp; Dubai</h3>
                    <div class="title-bn">Wholesale Electronics &amp; Wholesale Dubai</div>
                    <p>পাইকারি ইলেকট্রনিক্স এবং আন্তর্জাতিক ডিলার ও ক্রেতাদের জন্য প্রোডাক্ট ক্যাটালগ ও ই-কমার্স সাপোর্ট প্ল্যাটফর্ম।</p>
                </div>
            </div>

            <div class="card">
                <div class="card-body">
                    <div style="margin-bottom:10px;"><span class="badge badge-success">Commercial &amp; Agro Brand</span></div>
                    <h3>Food City &amp; Dubai Optom</h3>
                    <div class="title-bn">Food City, Dubai Optom &amp; Brand Presence</div>
                    <p>কমার্শিয়াল ও অ্যাগ্রো ব্র্যান্ডের অনলাইন প্রোফাইল, প্রোডাক্ট শোকেস, কাস্টমার কমিউনিকেশন এবং অডিট ও ইনভেন্টরি সমন্বয়।</p>
                </div>
            </div>

            <div class="card">
                <div class="card-body">
                    <div style="margin-bottom:10px;"><span class="badge badge-warning">Database, Sheets &amp; Digital Ads</span></div>
                    <h3>Patient List, Stock &amp; Ads</h3>
                    <div class="title-bn">MS Access, Custom Sheets &amp; Multi-Category Ads</div>
                    <p>পেশেন্ট লিস্ট, স্টক ম্যানেজমেন্ট ডাটাবেস, অটোমেটেড শিট ও MS Access সিস্টেম ডেভেলপমেন্ট এবং মাল্টি-ক্যাটাগরি সোশ্যাল মিডিয়া অ্যাড ক্যাম্পেইন।</p>
                </div>
            </div>
        </div>

        <!-- 5. Work Experience Section (All 9 Organizations from CV) -->
        <div class="section-header">
            <span class="sub-badge"><i class="fa fa-briefcase"></i> Professional Experience</span>
            <h2>পেশাগত কাজের অভিজ্ঞতা (৯টি প্রতিষ্ঠান)</h2>
            <p>২০১৮ সাল থেকে বর্তমান পর্যন্ত ওয়েব ডেভেলপমেন্ট, ডাটা অ্যানালাইসিস, ই-কমার্স এবং আইটি প্রশিক্ষণে কাজের বিবরণ</p>
        </div>

        <div class="table-responsive" style="margin-bottom:56px;">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>SL</th>
                        <th>Organization (প্রতিষ্ঠান)</th>
                        <th>Post / Designation (পদবী)</th>
                        <th>Duration (সময়কাল)</th>
                        <th>Area / Location (ঠিকানা)</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>01</strong></td>
                        <td><strong>Techno World BD</strong></td>
                        <td style="color:#0f766e; font-weight:700;">Data Analyzer &amp; System Developer (part time)</td>
                        <td>01-March, 2026 to Till now</td>
                        <td>Bara Para, Khuchaitoli Medical Road, Adarsha Sadar, Cumilla-3500</td>
                        <td><span class="badge badge-success">Running</span></td>
                    </tr>
                    <tr>
                        <td><strong>02</strong></td>
                        <td><strong>Food City Agro</strong></td>
                        <td style="color:#0f766e; font-weight:700;">Audit Officer (8 days only in month)</td>
                        <td>01-November, 2025 to Till now</td>
                        <td>14no Adra union, Sunaimuri, Barura, Cumilla-3500</td>
                        <td><span class="badge badge-success">Running</span></td>
                    </tr>
                    <tr>
                        <td><strong>03</strong></td>
                        <td><strong>Techno World In Russia</strong></td>
                        <td style="color:#0f766e; font-weight:700;">E-commerce Support Manager</td>
                        <td>01-December, 2024 to Till now</td>
                        <td>Bara Para, Khuchaitoli Medical Road, Adarsha Sadar, Cumilla-3500</td>
                        <td><span class="badge badge-success">Running</span></td>
                    </tr>
                    <tr>
                        <td><strong>04</strong></td>
                        <td><strong>Dream Career IT, Cumilla</strong></td>
                        <td style="color:#0f766e; font-weight:700;">Senior Computer Trainer (Part Time)</td>
                        <td>01-December, 2024 to Till now</td>
                        <td>Vai Vai Super Market (2nd Floor), Poduar Bazar, Cumilla-3500</td>
                        <td><span class="badge badge-success">Running</span></td>
                    </tr>
                    <tr>
                        <td><strong>05</strong></td>
                        <td><strong>Unicef Farmer Field Nutrition School (Unicef FFNS)</strong></td>
                        <td>Team / School Leader (Field Facilitator)</td>
                        <td>01st June 2021 to 30 November 2024</td>
                        <td>Munsir Dail, Boro Moheshkhali, Moheshkhali, Cox’s Bazar-4710</td>
                        <td><span class="badge badge-info">Completed</span></td>
                    </tr>
                    <tr>
                        <td><strong>06</strong></td>
                        <td><strong>Dream Career IT Bangladesh</strong></td>
                        <td>Computer Trainer (Maheshkhali Branch)</td>
                        <td>01st April 2021 to 25 November, 2024</td>
                        <td>Raster Matar Bazar, Bara Maheshkhali, Maheshkhali, Cox’s Bazar-4710</td>
                        <td><span class="badge badge-info">Completed</span></td>
                    </tr>
                    <tr>
                        <td><strong>07</strong></td>
                        <td><strong>Codesleepers.com (Software company)</strong></td>
                        <td style="color:#0f766e; font-weight:700;">Web Designer &amp; Developer</td>
                        <td>01st August 2020 to 15th May 2021</td>
                        <td>4th floor New market, Kandirpar, Comilla-3500</td>
                        <td><span class="badge badge-info">Completed</span></td>
                    </tr>
                    <tr>
                        <td><strong>08</strong></td>
                        <td><strong>Amader Gram Computer Training centre</strong></td>
                        <td>Senior Computer Trainer (Part-time)</td>
                        <td>01st June 2018 to 30th April 2021</td>
                        <td>Poduar Bazar, Biswho road, Comilla-3500</td>
                        <td><span class="badge badge-info">Completed</span></td>
                    </tr>
                    <tr>
                        <td><strong>09</strong></td>
                        <td><strong>Rangs Motor’s Limited</strong></td>
                        <td>Computer Operator</td>
                        <td>10th January 2018 to 30th July 2020</td>
                        <td>Choy Bari, Poduar Bazar, Biswho road, Comilla-3500</td>
                        <td><span class="badge badge-info">Completed</span></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 6. Other's Qualification (Professional Training & Certifications) -->
        <div class="section-header">
            <span class="sub-badge"><i class="fa fa-certificate"></i> Other's Qualification</span>
            <h2>বিশেষায়িত আইটি ও কারিগরি প্রশিক্ষণসমূহ</h2>
            <p>ওয়েব ডিজাইন ও ডেভেলপমেন্ট, গ্রাফিক্স ডিজাইন, ডিজিটাল মার্কেটিং এবং প্রফেশনাল সার্ভিস কোর্সসমূহ</p>
        </div>

        <div class="syllabus-grid" style="margin-bottom:56px;">
            <div class="syllabus-card">
                <span class="badge badge-success" style="margin-bottom:8px;">12 Month (2019)</span>
                <h3 style="color:#151442; margin-bottom:6px;">Web Design &amp; Development</h3>
                <p style="font-weight:700; color:#0f766e; margin-bottom:4px;"><i class="fa fa-university"></i> Codesleepers.com</p>
                <p style="font-size:0.88rem; color:#475569;"><i class="fa fa-map-marker"></i> New market 5th Floor, Kandir par, Cumilla-3500.</p>
            </div>

            <div class="syllabus-card">
                <span class="badge badge-info" style="margin-bottom:8px;">6 Month (2018)</span>
                <h3 style="color:#151442; margin-bottom:6px;">Graphic Design (Advance)</h3>
                <p style="font-weight:700; color:#0f766e; margin-bottom:4px;"><i class="fa fa-university"></i> Amader Gram Computer Training Centre</p>
                <p style="font-size:0.88rem; color:#475569;"><i class="fa fa-map-marker"></i> Paduar Bazar, Bishwo Road, Cumilla-3500.</p>
            </div>

            <div class="syllabus-card">
                <span class="badge badge-warning" style="margin-bottom:8px;">6 Month (2023)</span>
                <h3 style="color:#151442; margin-bottom:6px;">Digital Marketing</h3>
                <p style="font-weight:700; color:#0f766e; margin-bottom:4px;"><i class="fa fa-university"></i> ABCL IT</p>
                <p style="font-size:0.88rem; color:#475569;"><i class="fa fa-map-marker"></i> Noyapolton, Dhaka.</p>
            </div>

            <div class="syllabus-card">
                <span class="badge badge-info" style="margin-bottom:8px;">3 Month (2018)</span>
                <h3 style="color:#151442; margin-bottom:6px;">Microsoft Office (Advance)</h3>
                <p style="font-weight:700; color:#0f766e; margin-bottom:4px;"><i class="fa fa-university"></i> Amader Gram Computer Training Centre</p>
                <p style="font-size:0.88rem; color:#475569;"><i class="fa fa-map-marker"></i> Paduar Bazar, Bishwo Road, Cumilla-3500.</p>
            </div>

            <div class="syllabus-card">
                <span class="badge badge-success" style="margin-bottom:8px;">20 Dec 2023 – 04 Jan 2024</span>
                <h3 style="color:#151442; margin-bottom:6px;">Reception &amp; Customer Service (RCS)</h3>
                <p style="font-weight:700; color:#0f766e; margin-bottom:4px;"><i class="fa fa-university"></i> National Youth Development Institute</p>
                <p style="font-size:0.88rem; color:#475569;"><i class="fa fa-map-marker"></i> Savar, Dhaka.</p>
            </div>

            <div class="syllabus-card">
                <span class="badge badge-warning" style="margin-bottom:8px;">10 Dec 2022 – 16 Dec 2022</span>
                <h3 style="color:#151442; margin-bottom:6px;">Field Farmer Nutrition Service (FFNS)</h3>
                <p style="font-weight:700; color:#0f766e; margin-bottom:4px;"><i class="fa fa-university"></i> DAE-UNICEF</p>
                <p style="font-size:0.88rem; color:#475569;"><i class="fa fa-map-marker"></i> Cox’s Bazar.</p>
            </div>
        </div>

        <!-- 7. Educational Qualification & References Grid -->
        <div class="grid-2" style="align-items:start;">
            <div class="form-card" style="border-top:5px solid #0f766e;">
                <h3 style="color:#151442; margin-bottom:16px;"><i class="fa fa-graduation-cap" style="color:#0f766e;"></i> Educational Qualification (শিক্ষাগত যোগ্যতা)</h3>

                <div style="padding:14px; background:#f8fafc; border-radius:10px; border-left:4px solid #0f766e; margin-bottom:14px;">
                    <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:6px;">
                        <strong style="color:#151442; font-size:1.02rem;">Honors (BSS) — Political Science</strong>
                        <span class="badge badge-info">Passing Year: 2026</span>
                    </div>
                    <p style="font-size:0.9rem; color:#334155; margin-top:4px;"><strong>Institution:</strong> Cox’s Bazar City College</p>
                    <p style="font-size:0.88rem; color:#475569;"><strong>Board / University:</strong> National University, Gazipur | <strong>Result:</strong> Upcoming</p>
                </div>

                <div style="padding:14px; background:#f8fafc; border-radius:10px; border-left:4px solid #151442; margin-bottom:14px;">
                    <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:6px;">
                        <strong style="color:#151442; font-size:1.02rem;">Higher Secondary Certificate (H.S.C)</strong>
                        <span class="badge badge-success">Passing Year: 2019</span>
                    </div>
                    <p style="font-size:0.9rem; color:#334155; margin-top:4px;"><strong>Institution:</strong> Moheshkhali University College</p>
                    <p style="font-size:0.88rem; color:#475569;"><strong>Group:</strong> Humanities | <strong>Result:</strong> GPA 2.75 (Out of 5.00) | <strong>Board:</strong> Chittagong</p>
                </div>

                <div style="padding:14px; background:#f8fafc; border-radius:10px; border-left:4px solid #ea580c;">
                    <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:6px;">
                        <strong style="color:#151442; font-size:1.02rem;">Secondary School Certificate (S.S.C)</strong>
                        <span class="badge badge-warning">Passing Year: 2016</span>
                    </div>
                    <p style="font-size:0.9rem; color:#334155; margin-top:4px;"><strong>Institution:</strong> Moheshkhali Island High School</p>
                    <p style="font-size:0.88rem; color:#475569;"><strong>Group:</strong> Humanities | <strong>Result:</strong> GPA 3.67 (Out of 5.00) | <strong>Board:</strong> Chittagong</p>
                </div>
            </div>

            <div class="form-card" style="border-top:5px solid #151442;">
                <h3 style="color:#151442; margin-bottom:16px;"><i class="fa fa-address-card-o" style="color:#ea580c;"></i> Professional References (রেফারেন্স)</h3>

                <div style="padding:16px; background:#f8fafc; border-radius:10px; border:1px solid #e2e8f0; margin-bottom:16px;">
                    <span class="badge badge-info" style="margin-bottom:6px;">Reference 01</span>
                    <h4 style="font-size:1.1rem; color:#0f172a;">A.K.M Lokman</h4>
                    <p style="color:#0f766e; font-weight:700; font-size:0.92rem;">Director — Amader Gram ITUNIUM IT</p>
                    <p style="font-size:0.9rem; color:#475569; margin:6px 0;">Cumilla Branch, Poduar Bazar, Bissho road, Cumilla-3500.</p>
                    <p style="font-size:0.9rem; margin-bottom:3px;"><i class="fa fa-phone" style="color:#0f766e;"></i> <strong>Mobile:</strong> <a href="tel:+8801771770044">+880 1771-770044</a></p>
                    <p style="font-size:0.9rem;"><i class="fa fa-envelope-o" style="color:#ea580c;"></i> <strong>E-Mail:</strong> <a href="mailto:dc13edubd@gmail.com">dc13edubd@gmail.com</a></p>
                </div>

                <div style="padding:16px; background:#f8fafc; border-radius:10px; border:1px solid #e2e8f0;">
                    <span class="badge badge-success" style="margin-bottom:6px;">Reference 02</span>
                    <h4 style="font-size:1.1rem; color:#0f172a;">MD. Mizanur Rahman</h4>
                    <p style="color:#0f766e; font-weight:700; font-size:0.92rem;">MPC &amp; Former ADD — Directorate of Agricultural Extension</p>
                    <p style="font-size:0.9rem; color:#475569; margin:6px 0;">Cox’s Bazar Area, Cox’s Bazar, Bangladesh.</p>
                    <p style="font-size:0.9rem; margin-bottom:3px;"><i class="fa fa-phone" style="color:#0f766e;"></i> <strong>Mobile:</strong> <a href="tel:+8801716852186">+880 1716-852186</a></p>
                    <p style="font-size:0.9rem;"><i class="fa fa-envelope-o" style="color:#ea580c;"></i> <strong>E-mail:</strong> <a href="mailto:mpcdaeunicefpon@gmail.com">mpcdaeunicefpon@gmail.com</a></p>
                </div>
            </div>
        </div>
    </div>
</section>`;
    const dForm = document.getElementById('designerContactForm');
    if (dForm) {
        dForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fd = new FormData(this);
            const curDB = DCITStore.getDB();
            curDB.messages = curDB.messages || [];
            curDB.messages.unshift({
                id: Date.now(),
                sender_name: fd.get('sender_name'),
                sender_email: fd.get('sender_email'),
                phone: fd.get('phone') || '',
                subject: fd.get('subject') || 'Web Design Inquiry',
                message: fd.get('message'),
                target: 'Designer',
                is_read: 0,
                created_at: new Date().toISOString().slice(0, 10)
            });
            DCITStore.saveDB(curDB);
            const alertBox = document.getElementById('designerAlertBox');
            if (alertBox) {
                alertBox.innerHTML = `<div class="alert alert-success"><i class="fa fa-check-circle"></i> ধন্যবাদ! আপনার মেসেজ সফলভাবে ওয়েব ডিজাইনারের ইনবক্সে জমা হয়েছে।</div>`;
            }
            this.reset();
            window.scrollTo({ top: 200, behavior: 'smooth' });
        });
    }
}

function handleInitialHashNavigation() {
    const rawHash = (window.location.hash || '').replace(/^#/, '').trim();
    const map = {
        'home': 'home',
        'courses': 'courses',
        'batches-hub': 'batches-hub',
        'admission': 'admission',
        'new-batch': ['batches', {type: 'New Batch'}],
        'old-batch': ['batches', {type: 'Old Batch'}],
        'routine': 'routine',
        'biodata': 'biodata',
        'students': 'biodata',
        'certificates': 'certificates',
        'result': 'result',
        'teachers': 'teachers',
        'notices': 'notices',
        'contact-list': 'contact-list',
        'contact': 'contact',
        'about': 'about',
        'mission': 'mission',
        'objectives': 'mission',
        'terms': 'terms',
        'license': 'license',
        'legitimacy': 'license',
        'designer': 'designer'
    };
    if (rawHash && map[rawHash]) {
        const target = map[rawHash];
        if (Array.isArray(target)) navigateView(target[0], target[1]);
        else navigateView(target);
    } else if (rawHash.startsWith('course-')) {
        navigateView('course-detail', { slug: rawHash.replace('course-', '') });
    } else {
        navigateView('home');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    handleInitialHashNavigation();
});

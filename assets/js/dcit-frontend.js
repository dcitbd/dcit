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
        deferredPwaPrompt.userChoice.then(() => { deferredPwaPrompt = null; });
    } else {
        openDcitPopup('📲 মোবাইল ও কম্পিউটারে অ্যাপ হিসেবে ইনস্টল করুন', `
            <div class="qv-hero-banner">
                <img src="assets/img/logo.jpg" alt="Dream Career IT">
                <div>
                    <span class="badge badge-warning">Dream Career IT Mobile App (PWA)</span>
                    <h2 style="margin-top:6px;">অ্যাপ আকারে ইনস্টল করার পদ্ধতি</h2>
                    <p style="color:#e2e8f0; font-size:0.9rem;">এক ক্লিকে আপনার মোবাইল বা কম্পিউটারের হোমস্ক্রিনে অ্যাপ হিসেবে যুক্ত করুন</p>
                </div>
            </div>
            <div class="qv-info-grid">
                <div class="qv-info-card">
                    <small>Android / Chrome Browser</small>
                    <strong>ব্রাউজারের উপরের ডান কোণায় (⋮) মেন্যুতে ক্লিক করে "Add to Home screen" বা "Install App" সিলেক্ট করুন।</strong>
                </div>
                <div class="qv-info-card">
                    <small>iPhone / Safari Browser</small>
                    <strong>নিচের Share বাটনে ক্লিক করে "Add to Home Screen"-এ ট্যাপ করুন।</strong>
                </div>
            </div>
        `);
    }
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
    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container"><h1>আমাদের সম্পর্কে ও যোগাযোগ (About Dream Career IT)</h1><p>${esc(DCITStore.setting('site_slogan'))}</p></div>
    </div>
    <section class="section"><div class="container">
        <div class="grid-2" style="align-items:center; margin-bottom:48px;">
            <div class="form-card">
                <h2 style="color:#151442; margin-bottom:12px;">Dream Career IT (ড্রিম ক্যারিয়ার আইটি)</h2>
                <p style="margin-bottom:14px;">${esc(DCITStore.setting('about_intro'))}</p>
                <p><strong>ঠিকানাঃ</strong> ${esc(DCITStore.setting('address_bn'))}</p>
                <p><strong>হটলাইনঃ</strong> 01771770044, 01879653143</p>
            </div>
            <div style="text-align:center;"><img src="assets/img/logo.jpg" class="anim-float" style="width:240px; height:240px; border-radius:24px; margin:0 auto; box-shadow:var(--shadow-lg);"></div>
        </div>
        ${getContactGridHTML()}
    </div></section>`;
    bindSubscribeAndContactForms();
}

function renderMission(main) {
    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container"><h1>আমাদের উদ্দেশ্য ও লক্ষ্য (Our Mission & Vision)</h1><p>দক্ষ মানবসম্পদ তৈরি ও বেকারত্ব দূরীকরণে আমাদের অঙ্গীকার</p></div>
    </div>
    <section class="section"><div class="container">
        <div class="grid-2" style="margin-bottom:44px;">
            <div class="card"><img src="assets/img/mission.jpg" style="height:220px; object-fit:cover;"><div class="card-body"><h3>আমাদের লক্ষ্য (Our Mission)</h3><p>${esc(DCITStore.setting('mission_text'))}</p></div></div>
            <div class="card"><img src="assets/img/vision.jpg" style="height:220px; object-fit:cover;"><div class="card-body"><h3>আমাদের ভিশন (Our Vision)</h3><p>${esc(DCITStore.setting('vision_text'))}</p></div></div>
        </div>
        ${getContactGridHTML()}
    </div></section>`;
    bindSubscribeAndContactForms();
}

function renderTerms(main) {
    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container"><h1>টার্মস এবং কন্ডিশন (Terms & Conditions)</h1><p>শিক্ষার্থী ও ভিজিটরদের জন্য অনুসরণীয় নীতিমালা</p></div>
    </div>
    <section class="section"><div class="container">
        <div class="form-card" style="margin-bottom:44px;">
            <h3 style="color:#151442; margin-bottom:14px;"><i class="fa fa-gavel" style="color:#0f766e;"></i> প্রাতিষ্ঠানিক নিয়মাবলী ও শর্তসমূহ</h3>
            <p style="white-space:pre-line; line-height:1.9;">${esc(DCITStore.setting('terms_text'))}</p>
        </div>
        ${getContactGridHTML()}
    </div></section>`;
    bindSubscribeAndContactForms();
}

function renderLicense(main) {
    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container"><h1>লাইসেন্স ও অনুমোদন (License & Accreditation)</h1><p>Dream Career IT-এর প্রাতিষ্ঠানিক বৈধতা ও ভেরিফিকেশন সনদ</p></div>
    </div>
    <section class="section"><div class="container">
        <div class="form-card" style="border-top:5px solid #0f766e; margin-bottom:44px;">
            <h3 style="color:#151442; margin-bottom:14px;"><i class="fa fa-shield" style="color:#0f766e;"></i> লাইসেন্স ও ভেরিফিকেশন তথ্য</h3>
            <p style="white-space:pre-line; line-height:1.9;">${esc(DCITStore.setting('license_text'))}</p>
        </div>
        ${getContactGridHTML()}
    </div></section>`;
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
    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container"><h1>Web Designer & Developer</h1><p>Jainal Abedin (Sagor)</p></div>
    </div>
    <section class="section"><div class="container" style="max-width:760px;">
        <div class="form-card" style="text-align:center;">
            <img src="assets/img/teacher-sagor.jpg" class="anim-float" style="width:160px; height:160px; border-radius:50%; object-fit:cover; margin:0 auto 14px; border:4px solid #0f766e;">
            <h2>Jainal Abedin (Sagor)</h2>
            <p style="color:#0f766e; font-weight:700; margin-bottom:12px;">Senior Trainer & Full-Stack Web Designer at Dream Career IT</p>
            <p style="margin-bottom:14px;">Experienced in HTML5, CSS3, JavaScript, Bootstrap, PHP, and MySQL. Phone: 01879653143 | Email: gsctcbmcmrjas@gmail.com</p>
        </div>
    </div></section>`;
}

document.addEventListener('DOMContentLoaded', function() {
    navigateView('home');
});

/**
 * DREAM CAREER IT - Complete Dynamic Frontend Engine (v3.0)
 * Card View & List View Toggles, Popup Modals, Secret-Code Landscape Letter Print,
 * Disability Discount Auto-Calc, Administration Categories, Notices & Success Stories
 */
function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
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

function navigateView(view, params = {}) {
    syncHeaderFooter();
    closeDcitPopup();
    document.querySelectorAll('.nav-link').forEach(a => {
        a.classList.toggle('active', a.getAttribute('data-view') === view);
    });
    const main = document.getElementById('appMainContainer');
    if (!main) return;

    if (view === 'home') renderHome(main);
    else if (view === 'courses') renderCoursesList(main);
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
    else if (view === 'notices') renderNotices(main);
    else if (view === 'contact-list') renderContactList(main);
    else if (view === 'about') renderAbout(main);
    else if (view === 'mission') renderMission(main);
    else if (view === 'terms') renderTerms(main);
    else if (view === 'license') renderLicense(main);
    else if (view === 'contact') renderContact(main);
    else if (view === 'designer') renderDesigner(main);
    else renderHome(main);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================================================
   1. HOME PAGE (All 7 Enhanced Sections with Slogans, Animations & Spacing)
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
    <!-- Section 1: Hero Banner -->
    <section class="hero-section">
        <div class="container hero-grid">
            <div class="hero-content">
                <span class="hero-badge"><i class="fa fa-graduation-cap"></i> গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত কারিগরি মানের আইটি প্রশিক্ষণ</span>
                <div style="display:flex; align-items:center; gap:16px; margin-bottom:10px;">
                    <img src="assets/img/logo.jpg" alt="Dream Career IT" style="width:74px; height:74px; border-radius:16px; border:3px solid #fde68a;">
                    <h2 style="margin:0;">${esc(siteName)}<br><span>ড্রিম ক্যারিয়ার আইটি</span></h2>
                </div>
                <div class="hero-slogan">✨ "${esc(slogan)}"</div>
                <div class="hero-address">
                    <i class="fa fa-map-marker" style="color:#fde68a;"></i> ${esc(addrBn)}<br>
                    <strong><i class="fa fa-phone" style="color:#5eead4;"></i> হটলাইনঃ ${esc(phone1)} | ইমেইলঃ ${esc(DCITStore.setting('email_1'))}</strong>
                </div>
                <div class="hero-actions">
                    <button onclick="navigateView('admission')" class="btn btn-accent"><i class="fa fa-paper-plane"></i> অনলাইনে ভর্তি হোন (Apply Now)</button>
                    <button onclick="navigateView('result')" class="btn btn-primary"><i class="fa fa-trophy"></i> রেজাল্ট ও সার্টিফিকেট প্রিন্ট</button>
                    <button onclick="navigateView('courses')" class="btn btn-outline"><i class="fa fa-book"></i> সকল কোর্স দেখুন</button>
                </div>
            </div>
            <div class="hero-slider">
                <div class="hero-slide active">
                    <img src="assets/img/slide1.jpg" alt="Dream Career IT Lab">
                    <div class="hero-slide-caption">আধুনিক মাল্টিমিডিয়া কম্পিউটার ল্যাব ও শতভাগ প্র্যাকটিক্যাল প্রশিক্ষণ</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Section 2: Courses Section -->
    <section class="section">
        <div class="container">
            <div class="section-header">
                <span class="sub-badge">Career Building Courses</span>
                <h2>আমাদের প্রফেশনাল কোর্সসমূহ</h2>
                <p>"আজকের কম্পিউটার ও কারিগরি দক্ষতা, আগামী দিনের সফল ক্যারিয়ার ও আত্মনির্ভরশীলতা"</p>
            </div>
            <div class="view-toolbar">
                <div><strong><i class="fa fa-book" style="color:#0f766e;"></i> মোট চলমান কোর্সঃ ${courses.length} টি</strong> (যেকোনো কার্ডে ক্লিক করে বিস্তারিত সিলেবাস দেখুন)</div>
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

    <!-- Section 3: Our Facilities & Why Choose Us -->
    <section class="section section-alt">
        <div class="container">
            <div class="section-header">
                <span class="sub-badge">World-Class Facilities</span>
                <h2>আমাদের বিশেষ সুবিধাসমূহ ও বৈশিষ্ট্য</h2>
                <p>"সঠিক প্রশিক্ষণ, আধুনিক ল্যাব ও সার্বক্ষণিক গাইডলাইন—আপনার সফলতার বিশ্বস্ত সঙ্গী"</p>
            </div>
            <div class="grid-3" style="margin-bottom:44px;">
                <div class="facility-card"><div class="facility-icon"><i class="fa fa-id-card-o"></i></div><h3>অভিজ্ঞ ও দক্ষ প্রশিক্ষক</h3><p>দক্ষ, অভিজ্ঞ ও প্রফেশনাল ট্রেইনার এবং মেন্টর দ্বারা প্রতিটি ক্লাস হাতে-কলমে পরিচালনা।</p></div>
                <div class="facility-card"><div class="facility-icon"><i class="fa fa-laptop"></i></div><h3>আধুনিক মাল্টিমিডিয়া ল্যাব</h3><p>প্রত্যেক শিক্ষার্থীর জন্য আলাদা কম্পিউটার ও হাই-স্পিড ইন্টারনেট সমৃদ্ধ ল্যাব।</p></div>
                <div class="facility-card"><div class="facility-icon"><i class="fa fa-headphones"></i></div><h3>২৪/৭ ও আজীবন সাপোর্ট</h3><p>অনলাইন ও অফলাইনে সার্বক্ষণিক সাপোর্ট এবং কোর্স শেষে আজীবন প্র্যাকটিস সুবিধা।</p></div>
                <div class="facility-card"><div class="facility-icon"><i class="fa fa-certificate"></i></div><h3>গোপন কোড ভেরিফাইড সার্টিফিকেট</h3><p>কোর্স শেষে স্টুডেন্ট সিক্রেট কোড ও বারকোড ভেরিফিকেশন যুক্ত প্রফেশনাল সার্টিফিকেট।</p></div>
                <div class="facility-card"><div class="facility-icon"><i class="fa fa-wheelchair"></i></div><h3>বিশেষ স্কলারশিপ ডিসকাউন্ট</h3><p>বিশেষ চাহিদাসম্পন্ন (Disabilities) ও মেধাবী শিক্ষার্থীদের জন্য বিশেষ ফি ডিসকাউন্ট সুবিধা।</p></div>
                <div class="facility-card"><div class="facility-icon"><i class="fa fa-briefcase"></i></div><h3>জব ও ফ্রিল্যান্সিং গাইডলাইন</h3><p>চাকরি ও আন্তর্জাতিক ফ্রিল্যান্সিং মার্কেটপ্লেসে কাজ পাওয়ার জন্য বিশেষ মেন্টরশিপ।</p></div>
            </div>

            <div class="why-choose-box">
                <h2 style="font-size:1.85rem; margin-bottom:8px; color:#fde68a;">কেন Dream Career IT আপনার প্রথম পছন্দ হবে?</h2>
                <p style="color:#cbd5e1;">"প্রযুক্তি শিক্ষায় কোনো আপোষ নয় — আমরা গড়ি দক্ষ ও আত্মবিশ্বাসী প্রফেশনাল"</p>
                <ul class="why-list">
                    <li><i class="fa fa-check-circle"></i> প্রত্যেক শিক্ষার্থীর জন্য আলাদা কম্পিউটার ও ব্যাকআপ ক্লাসের সুবিধা।</li>
                    <li><i class="fa fa-check-circle"></i> আপডেটেড কোর্স কারিকুলাম এবং প্রতিটি ক্লাসের মানসম্মত লেকচার শিট।</li>
                    <li><i class="fa fa-check-circle"></i> নিয়মিত তাত্ত্বিক ও ব্যবহারিক ক্লাস এবং চূড়ান্ত মূল্যায়ন পরীক্ষা।</li>
                    <li><i class="fa fa-check-circle"></i> অনলাইনে গোপন কোড দিয়ে ভেরিফিকেশন ও ল্যান্ডস্কেপ সার্টিফিকেট প্রিন্ট।</li>
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

    <!-- Section 4: Success Students Section (সাকসেস শিক্ষার্থী সমূহ) -->
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
                        <img src="${esc(st.photo || 'assets/img/logo.jpg')}" alt="${esc(st.student_name)}" style="width:96px; height:96px; border-radius:50%; object-fit:cover; margin:0 auto 14px; border:3px solid #0f766e;">
                        <h3>${esc(st.student_name)}</h3>
                        <div class="title-bn">${esc(st.designation)}</div>
                        <span class="badge badge-info" style="align-self:center; margin-bottom:12px;">${esc(st.course_name)} (${esc(st.batch_info)})</span>
                        <p style="font-style:italic;">"${esc(st.story)}"</p>
                        <button onclick="openBiodataPopup('${esc(st.reg_no || '000001')}')" class="btn btn-outline btn-sm" style="color:#151442; border-color:#cbd5e1;">프로ফাইল দেখুন</button>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- Section 5: Recent Notices Section (রিসেন্ট নোটিশ সেকশন) -->
    <section class="section section-alt">
        <div class="container">
            <div class="section-header">
                <span class="sub-badge">Notice Board</span>
                <h2>সাম্প্রতিক নোটিশ ও বিজ্ঞপ্তি</h2>
                <p>ভর্তি, ক্লাস রুটিন, পরীক্ষা ও সার্টিফিকেট সংক্রান্ত সর্বশেষ আপডেট</p>
            </div>
            <div class="grid-3">
                ${notices.map(n => `
                <div class="card">
                    <div class="card-body">
                        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                            <span class="badge badge-warning"><i class="fa fa-bell"></i> ${esc(n.category)}</span>
                            <small style="color:#64748b; font-weight:700;"><i class="fa fa-calendar"></i> ${esc(n.publish_date)}</small>
                        </div>
                        <h3 style="font-size:1.15rem; margin-bottom:10px;">${esc(n.title)}</h3>
                        <p>${esc(n.details)}</p>
                        <button onclick="openNoticePopup(${Number(n.id)})" class="btn btn-primary btn-sm"><i class="fa fa-eye"></i> বিস্তারিত পড়ুন</button>
                    </div>
                </div>`).join('')}
            </div>
            <div style="text-align:center; margin-top:26px;">
                <button onclick="navigateView('notices')" class="btn btn-accent"><i class="fa fa-list"></i> সকল নোটিশ দেখুন</button>
            </div>
        </div>
    </section>

    <!-- Section 6: Subscribe Section (সাবস্ক্রাইব অপশন) -->
    <section class="section" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:56px 0;">
        <div class="container" style="max-width:780px; text-align:center;">
            <span class="hero-badge"><i class="fa fa-envelope-open"></i> Stay Updated</span>
            <h2 style="font-size:2rem; margin-bottom:10px;">নতুন ব্যাচ ও স্কলারশিপ আপডেট পেতে সাবস্ক্রাইব করুন</h2>
            <p style="color:#cbd5e1; margin-bottom:24px;">আপনার মোবাইল নম্বর অথবা ইমেইল দিয়ে সাবস্ক্রাইব করে রাখুন, নতুন ব্যাচ ও ফ্রি সেমিনারের খবর সবার আগে পৌঁছে যাবে।</p>
            <div id="subAlertBox"></div>
            <form id="homeSubscribeForm" style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
                <input type="text" id="subContactInput" class="form-control" required placeholder="আপনার মোবাইল নম্বর অথবা ইমেইল লিখুন..." style="max-width:440px; padding:13px 18px; border-radius:30px;">
                <button type="submit" class="btn btn-accent" style="border-radius:30px; padding:13px 28px;"><i class="fa fa-bell"></i> সাবস্ক্রাইব করুন</button>
            </form>
        </div>
    </section>

    <!-- Section 7: Direct Contact Form Section (কন্টাক্ট ফর্ম সেকশন) -->
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
}

function renderCourseCardHTML(c) {
    return `
    <div class="card" onclick="navigateView('course-detail', {slug:'${esc(c.slug)}'})" style="cursor:pointer;">
        <div class="course-thumb">
            <img src="${esc(c.image)}" alt="${esc(c.title)}" loading="lazy">
            <span class="course-fee-badge">৳ ${Number(c.fee).toLocaleString()}</span>
            <span class="course-cert-badge">
                <i class="fa ${Number(c.has_certificate) ? 'fa-certificate' : 'fa-info-circle'}"></i>
                ${Number(c.has_certificate) ? 'সার্টিফিকেট সহ' : 'বেসিক কোর্স'}
            </span>
        </div>
        <div class="card-body">
            <h3>${esc(c.title)}</h3>
            <div class="title-bn">${esc(c.title_bn)}</div>
            <div class="course-meta">
                <span><i class="fa fa-calendar"></i> ${esc(c.duration)}</span>
                <span><i class="fa fa-clock-o"></i> ${esc(c.class_duration)}</span>
                <span><i class="fa fa-desktop"></i> ${Number(c.total_classes)} ক্লাস</span>
            </div>
            <p>${esc(c.description_bn || c.short_desc)}</p>
            <div class="card-footer" onclick="event.stopPropagation();">
                <button onclick="navigateView('course-detail', {slug:'${esc(c.slug)}'})" class="btn btn-primary btn-sm" style="flex:1;">
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
   2. COURSES LIST PAGE (Card & List View) & SEPARATE COURSE DETAIL PAGE
   ========================================================================== */
function renderCoursesList(main) {
    const db = DCITStore.getDB();
    const courses = (db.courses || []).filter(c => c.status !== 'Inactive');

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
                <div><strong><i class="fa fa-graduation-cap" style="color:#0f766e;"></i> মোট কোর্সঃ ${courses.length} টি</strong></div>
                <div class="view-toggle-btns">
                    <button class="view-btn active" onclick="toggleViewMode('allCoursesContainer','card',this)"><i class="fa fa-th-large"></i> কার্ড ভিউ</button>
                    <button class="view-btn" onclick="toggleViewMode('allCoursesContainer','list',this)"><i class="fa fa-list"></i> লিস্ট ভিউ</button>
                </div>
            </div>
            <div class="grid-3" id="allCoursesContainer">
                ${courses.map(c => renderCourseCardHTML(c)).join('')}
            </div>
        </div>
    </section>`;
}

function renderCourseDetail(main, slug = '') {
    const db = DCITStore.getDB();
    const courses = db.courses || [];
    const selected = courses.find(c => c.slug === slug || c.title === slug) || courses[0];
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
                            <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:18px;">
                                <button onclick="navigateView('admission', {course:'${esc(selected.title)}'})" class="btn btn-accent"><i class="fa fa-user-plus"></i> অনলাইনে আবেদন করুন</button>
                                <button onclick="navigateView('routine')" class="btn btn-primary"><i class="fa fa-clock-o"></i> ক্লাস রুটিন দেখুন</button>
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
                        <div class="sec-tag">${esc(m.section)}</div>
                        <h4>${esc(m.title)}</h4>
                        <ul>${(m.items || []).map(i => `<li>${esc(i)}</li>`).join('')}</ul>
                    </div>
                `).join('')}
            </div>` : ''}
        </div>
    </section>`;
}

/* ==========================================================================
   3. RESULT PAGE (Registration Number ONLY + Secret Code Landscape Print!)
   ========================================================================== */
function renderResult(main, params = {}) {
    const db = DCITStore.getDB();
    const regQ = (params.reg_no || '').trim();
    const found = regQ ? (db.students || []).find(s => s.reg_no === regQ) : null;
    const cert = found ? ((db.certificates || []).find(c => c.reg_no === found.reg_no) || {
        cert_no: 'DCIT-' + found.batch_year + '-' + found.reg_no,
        reg_no: found.reg_no,
        roll_no: found.roll_no,
        secret_code: found.secret_code,
        student_name: found.name,
        father_name: found.father_name,
        mother_name: found.mother_name,
        course_name: found.course_name,
        batch_year: found.batch_year,
        session_quarter: found.session_quarter,
        duration: found.course_duration || '3 Months',
        grade: found.result_grade,
        cgpa: found.cgpa,
        issue_date: '2026-04-10',
        verification_code: 'VER-DCIT-' + found.reg_no
    }) : null;

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container">
            <h1>অনলাইন ফলাফল ও সার্টিফিকেট প্রিন্ট (Student Result)</h1>
            <p>শুধুমাত্র আপনার ৬ সংখ্যার রেজিস্ট্রেশন নাম্বার (যেমন: 000001) দিয়ে রেজাল্ট দেখুন এবং গোপন কোড দিয়ে সার্টিফিকেট প্রিন্ট করুন</p>
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
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; border-bottom:2px dashed #cbd5e1; padding-bottom:18px; margin-bottom:22px;">
                    <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                        <img src="${esc(found.photo || 'assets/img/logo.jpg')}" style="width:92px; height:92px; border-radius:14px; object-fit:cover; border:3px solid #0f766e;">
                        <div>
                            <span class="badge badge-info">রেজিঃ নং: ${esc(found.reg_no)} | রোলঃ ${esc(found.roll_no)}</span>
                            <h2 style="color:#151442; margin-top:6px;">${esc(found.name)}</h2>
                            <p style="color:#0f766e; font-weight:700;">${esc(found.course_name)}</p>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div class="badge badge-success" style="font-size:1.15rem; padding:9px 18px; margin-bottom:8px;">
                            গ্রেডঃ ${esc(found.result_grade)} (GPA: ${esc(found.cgpa)})
                        </div><br>
                        <button onclick="promptSecretCodeAndPrint('${esc(found.reg_no)}')" class="btn btn-accent btn-sm">
                            <i class="fa fa-print"></i> সার্টিফিকেট প্রিন্ট করুন (গোপন কোড)
                        </button>
                    </div>
                </div>

                <div class="table-responsive" style="box-shadow:none;">
                    <table class="data-table" style="min-width:100%;">
                        <tbody>
                            <tr><th style="width:32%;">শিক্ষার্থীর নাম (Name)</th><td><strong>${esc(found.name)}</strong></td></tr>
                            <tr><th>রোল ও রেজিস্ট্রেশন নং</th><td>রোলঃ <strong>${esc(found.roll_no)}</strong> | রেজিঃ নংঃ <strong>${esc(found.reg_no)}</strong></td></tr>
                            <tr><th>অর্জিত গ্রেড ও পয়েন্ট (Grade)</th><td><span class="badge badge-success">${esc(found.result_grade)} (GPA: ${esc(found.cgpa)})</span></td></tr>
                            <tr><th>পিতার নাম (Father's Name)</th><td>${esc(found.father_name)}</td></tr>
                            <tr><th>মাতার নাম (Mother's Name)</th><td>${esc(found.mother_name)}</td></tr>
                            <tr><th>বর্তমান ও স্থায়ী ঠিকানা (Address)</th><td>${esc(found.present_address)}</td></tr>
                            <tr><th>ব্যাচ নং ও সেশন (Batch & Session)</th><td>${esc(found.batch_no || ('Batch-' + found.batch_year))} | ${esc(found.session_quarter)} (${esc(found.batch_year)}) — ${esc(found.batch_type)}</td></tr>
                            <tr><th>ক্লাস টাইম (Class Schedule)</th><td><span class="badge badge-info">${esc(found.class_slot)}</span></td></tr>
                            <tr><th>শিক্ষাগত যোগ্যতা (Education)</th><td>${esc(found.education)} (${esc(found.school_college)})</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>` : `<div class="alert alert-danger">দুঃখিত! প্রদত্ত রেজিস্ট্রেশন নাম্বারের (${esc(regQ)}) সাথে কোনো ফলাফল পাওয়া যায়নি। (উদাহরণস্বরূপ 000001 থেকে 000006 দিয়ে চেষ্টা করুন)।</div>`) : ''}
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
        <div style="text-align:center; padding:10px;">
            <i class="fa fa-key" style="font-size:2.6rem; color:#ea580c; margin-bottom:10px;"></i>
            <h3 style="color:#151442; margin-bottom:6px;">স্টুডেন্ট গোপন কোড (Secret Code) প্রদান করুন</h3>
            <p style="color:#475569; font-size:0.92rem; margin-bottom:16px;">
                শিক্ষার্থীঃ <strong>${esc(st ? st.name : cert.student_name)}</strong> (রেজিঃ নং: <strong>${esc(regNo)}</strong>)<br>
                সার্টিফিকেটটি ল্যান্ডস্কেপ লেটার সাইজে প্রিন্ট করার জন্য আপনার গোপন কোডটি নিচে লিখুন।
            </p>
            <div id="secCodeErr"></div>
            <form id="verifySecCodeForm" style="max-width:420px; margin:0 auto;">
                <div class="form-group">
                    <input type="text" id="secCodeInput" class="form-control" required placeholder="আপনার গোপন কোড লিখুন (যেমন: ${esc(expectedCode)})" style="text-align:center; font-weight:800; letter-spacing:1px;">
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
            window.printAuthorizedCertificate(cert);
        } else {
            document.getElementById('secCodeErr').innerHTML = `<div class="alert alert-danger">ভুল গোপন কোড! সঠিক স্টুডেন্ট সিক্রেট কোড দিন।</div>`;
        }
    });
}

/* ==========================================================================
   4. ADMISSION & BATCHES HUB + ONLINE ADMISSION FORM (Disability Discount, Auto-Fee, Conditional TrxID)
   ========================================================================== */
function renderBatchesHub(main) {
    const db = DCITStore.getDB();
    const courses = (db.courses || []).filter(c => c.status !== 'Inactive');

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container">
            <h1>ভর্তি ও ব্যাচ ইনফরমেশন হাব (Admission & Batches)</h1>
            <p>অনলাইন ভর্তি ফর্ম, নতুন ব্যাচ, পুরাতন ব্যাচ (২০১০-২০২৬), ক্লাস রুটিন, বায়োডাটা ও সার্টিফিকেট ভেরিফিকেশন</p>
        </div>
    </div>
    <section class="section">
        <div class="container">
            <div class="grid-3" style="margin-bottom:44px;">
                <div class="facility-card" onclick="navigateView('admission')" style="cursor:pointer;"><div class="facility-icon"><i class="fa fa-pencil-square-o"></i></div><h3>অনলাইন ভর্তি ফর্ম</h3><p>অটো কোর্স ফি, ডিসএবিলিটি ডিসকাউন্ট ও গোপন কোডসহ ভর্তি আবেদন।</p></div>
                <div class="facility-card" onclick="navigateView('batches', {type:'New Batch'})" style="cursor:pointer;"><div class="facility-icon"><i class="fa fa-users"></i></div><h3>নতুন ব্যাচ (New Batch)</h3><p>চলমান নতুন ব্যাচের কোর্স ও শিক্ষার্থীদের বিস্তারিত তালিকা।</p></div>
                <div class="facility-card" onclick="navigateView('batches', {type:'Old Batch'})" style="cursor:pointer;"><div class="facility-icon"><i class="fa fa-history"></i></div><h3>পুরাতন ব্যাচ (2010 - 2026)</h3><p>২০১০ থেকে ২০২৬ পর্যন্ত সকল প্রাক্তন ব্যাচের রেকর্ড।</p></div>
                <div class="facility-card" onclick="navigateView('routine')" style="cursor:pointer;"><div class="facility-icon"><i class="fa fa-clock-o"></i></div><h3>ক্লাস রুটিন ও সময়সূচি</h3><p>সকাল ৮টা থেকে রাত ৮:৩০ পর্যন্ত ৭টি শিফটের বিস্তারিত রুটিন।</p></div>
                <div class="facility-card" onclick="navigateView('biodata')" style="cursor:pointer;"><div class="facility-icon"><i class="fa fa-id-card-o"></i></div><h3>স্টুডেন্ট বায়োডাটা</h3><p>রোল বা রেজিস্ট্রেশন নাম্বার দিয়ে পপআপে বায়োডাটা অনুসন্ধান।</p></div>
                <div class="facility-card" onclick="navigateView('certificates')" style="cursor:pointer;"><div class="facility-icon"><i class="fa fa-certificate"></i></div><h3>সার্টিফিকেট ভেরিফিকেশন</h3><p>রেজিস্ট্রেশন ও গোপন কোড দিয়ে সার্টিফিকেট যাচাই ও প্রিন্ট।</p></div>
            </div>

            <div class="view-toolbar">
                <div><strong>ভর্তির জন্য উপলব্ধ কোর্সসমূহ (${courses.length} টি)</strong></div>
                <div class="view-toggle-btns">
                    <button class="view-btn active" onclick="toggleViewMode('hubCoursesGrid','card',this)"><i class="fa fa-th-large"></i> কার্ড ভিউ</button>
                    <button class="view-btn" onclick="toggleViewMode('hubCoursesGrid','list',this)"><i class="fa fa-list"></i> লিস্ট ভিউ</button>
                </div>
            </div>
            <div class="grid-3" id="hubCoursesGrid">
                ${courses.map(c => renderCourseCardHTML(c)).join('')}
            </div>
        </div>
    </section>`;
}

function renderAdmission(main, preCourse = '') {
    const db = DCITStore.getDB();
    const courses = (db.courses || []).filter(c => c.status !== 'Inactive');
    const classes = db.classes || [];
    const disPercent = parseFloat(DCITStore.setting('disability_discount_percent', '25')) || 25;
    let payMethods = ["bKash (01771770044)", "Nagad (01771770044)", "Rocket (01771770044)", "Bank Transfer", "Cash"];
    try {
        const pmRaw = DCITStore.setting('payment_methods_json', '');
        if (pmRaw) payMethods = JSON.parse(pmRaw);
    } catch(e){}

    const initCourse = courses.find(c => c.title === preCourse) || courses[0] || {title:'Advance Microsoft Office', fee:1500, duration:'3 Months'};

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container">
            <h1>অনলাইন ভর্তি ফর্ম (Online Admission Form)</h1>
            <p>সকল তথ্য সঠিকভাবে পূরণ করে সাবমিট করলে অটোমেটিক আপনার স্টুডেন্ট গোপন কোড (Secret Code) তৈরি হবে</p>
        </div>
    </div>
    <section class="section">
        <div class="container" style="max-width:960px;">
            <div id="admSuccessAlert"></div>
            <div class="form-card">
                <h2 style="margin-bottom:20px; color:#151442; border-bottom:2px solid #e2e8f0; padding-bottom:12px;">
                    <i class="fa fa-graduation-cap" style="color:#0f766e;"></i> শিক্ষার্থী ভর্তি আবেদন ফর্ম — Dream Career IT
                </h2>
                <form id="onlineAdmissionForm">
                    <div class="form-grid">
                        <div class="form-group">
                            <label><i class="fa fa-camera"></i> ১. পাসপোর্ট সাইজের ছবি (Passport Photo) *</label>
                            <input type="file" id="admPhotoFile" class="form-control" accept="image/*">
                        </div>
                        <div class="form-group">
                            <label><i class="fa fa-user"></i> ২. শিক্ষার্থীর নাম (Full Name) *</label>
                            <input type="text" id="admFullName" name="full_name" class="form-control" required placeholder="আপনার পূর্ণ নাম লিখুন">
                        </div>
                        <div class="form-group">
                            <label><i class="fa fa-user-o"></i> ৩. পিতার নাম (Father's Name) *</label>
                            <input type="text" name="father_name" class="form-control" required placeholder="পিতার নাম লিখুন">
                        </div>
                        <div class="form-group">
                            <label><i class="fa fa-user-o"></i> ৪. মাতার নাম (Mother's Name) *</label>
                            <input type="text" name="mother_name" class="form-control" required placeholder="মাতার নাম লিখুন">
                        </div>
                        <div class="form-group">
                            <label><i class="fa fa-calendar"></i> ৫. জন্ম-তারিখ (Date of Birth) *</label>
                            <input type="date" name="dob" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fa fa-id-card"></i> ৬. এনআইডি / জন্মনিবন্ধন নাম্বার *</label>
                            <input type="text" name="nid_birth_reg" class="form-control" required placeholder="NID বা জন্মনিবন্ধন নম্বর">
                        </div>
                        <div class="form-group">
                            <label><i class="fa fa-phone"></i> ৭. মোবাইল নাম্বার (Mobile) *</label>
                            <input type="tel" name="phone" class="form-control" required placeholder="017XXXXXXXX">
                        </div>
                        <div class="form-group">
                            <label><i class="fa fa-graduation-cap"></i> ৮. শিক্ষাগত যোগ্যতা (Education) *</label>
                            <select name="education" class="form-control">
                                <option>HSC</option><option>SSC</option><option>Honours / BA / BSS</option><option>Masters / MA</option><option>Diploma</option><option>JSC</option><option>Others</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label><i class="fa fa-university"></i> ৯. বর্তমান শিক্ষা প্রতিষ্ঠান *</label>
                            <input type="text" name="school_college" class="form-control" required placeholder="স্কুল/কলেজ/বিশ্ববিদ্যালয়ের নাম">
                        </div>
                        <div class="form-group">
                            <label><i class="fa fa-bullhorn"></i> ১০. কোথা থেকে আমাদের প্রতিষ্ঠান সম্পর্কে জানলেন?</label>
                            <select name="how_heard" class="form-control">
                                <option value="Facebook">ফেসবুক (Facebook)</option>
                                <option value="Friend / Student">বন্ধু বা প্রাক্তন শিক্ষার্থী</option>
                                <option value="Google / Website">গুগল বা ওয়েবসাইট</option>
                                <option value="Leaflet / Banner">ব্যানার বা লিফলেট</option>
                                <option value="Other">অন্যান্য</option>
                            </select>
                        </div>
                        <div class="form-group" style="grid-column:1/-1;">
                            <label><i class="fa fa-map-marker"></i> ১১. পূর্ণ ঠিকানা (Present & Permanent Address) *</label>
                            <input type="text" name="address" class="form-control" required placeholder="গ্রাম/মহল্লা, ডাকঘর, উপজেলা, জেলা">
                        </div>

                        <!-- Disability Question & Conditional Medical Report Row -->
                        <div class="form-group">
                            <label><i class="fa fa-wheelchair"></i> ১২. কোনো ডিসএবিলিটিস (শারীরিক প্রতিবন্ধকতা) আছে কি?</label>
                            <select id="admDisabilitySelect" name="has_disability" class="form-control">
                                <option value="না">না (No)</option>
                                <option value="হ্যাঁ">হ্যাঁ (Yes — ${disPercent}% বিশেষ ডিসকাউন্ট প্রযোজ্য)</option>
                            </select>
                        </div>
                        <div class="form-group" id="admMedicalReportRow" style="display:none; background:#fffbeb; padding:12px; border-radius:10px; border:1px dashed #d97706;">
                            <label style="color:#92400e;"><i class="fa fa-file-pdf-o"></i> মেডিক্যাল রিপোর্ট / প্রতিবন্ধী সনদ আপলোড করুন (${disPercent}% ছাড়) *</label>
                            <input type="file" id="admMedicalFile" name="medical_report" class="form-control">
                        </div>

                        <!-- Course Selection -> Auto Course Fee & Auto Duration -->
                        <div class="form-group">
                            <label><i class="fa fa-book"></i> ১৩. কোর্সের নাম (Select Course) *</label>
                            <select id="admCourseSelect" name="course_name" class="form-control" required>
                                ${courses.map(c => `<option value="${esc(c.title)}" data-fee="${Number(c.fee)}" data-duration="${esc(c.duration)}" ${initCourse.title === c.title ? 'selected' : ''}>${esc(c.title)} (${esc(c.title_bn)})</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label><i class="fa fa-money"></i> ১৪. কোর্স ফি (অটো সিলেক্ট ও ডিসকাউন্ট হিসাব)</label>
                            <input type="number" id="admCourseFee" name="course_fee" class="form-control" readonly value="${Number(initCourse.fee)}" style="background:#f1f5f9; font-weight:800; color:#0f766e;">
                        </div>
                        <div class="form-group">
                            <label><i class="fa fa-clock-o"></i> ১৫. কোর্সের মেয়াদ (অটো সিলেক্ট)</label>
                            <input type="text" id="admCourseDuration" name="course_duration" class="form-control" readonly value="${esc(initCourse.duration)}" style="background:#f1f5f9; font-weight:700;">
                        </div>
                        <div class="form-group">
                            <label><i class="fa fa-calendar-check-o"></i> ১৬. পছন্দের ক্লাস টাইম *</label>
                            <select name="preferred_slot" class="form-control">
                                ${classes.map(cl => `<option value="${esc(cl.time_label)}">${esc(cl.time_label)} (${esc(cl.batch_name)})</option>`).join('')}
                            </select>
                        </div>

                        <!-- Payment Method -> Paid, Auto Due & Conditional TrxID -->
                        <div class="form-group">
                            <label><i class="fa fa-credit-card"></i> ১৭. পেমেন্ট মেথড (Payment Method) *</label>
                            <select id="admPayMethod" name="payment_method" class="form-control">
                                ${payMethods.map(pm => `<option value="${esc(pm)}">${esc(pm)}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label><i class="fa fa-check-circle"></i> ১৮. পেইড এমাউন্ট (Paid Amount ৳) *</label>
                            <input type="number" id="admPaidAmount" name="paid_amount" class="form-control" value="500" min="0" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fa fa-calculator"></i> ১৯. ডিউ এমাউন্ট (Due Amount ৳ - অটো ক্যালকুলেট)</label>
                            <input type="number" id="admDueAmount" name="due_amount" class="form-control" readonly value="${Math.max(0, Number(initCourse.fee) - 500)}" style="background:#f1f5f9; font-weight:800; color:#dc2626;">
                        </div>
                        <div class="form-group" id="admTrxRow">
                            <label><i class="fa fa-hashtag"></i> ২০. ট্রানজেকশন আইডি (Transaction ID) *</label>
                            <input type="text" id="admTrxInput" name="trx_id" class="form-control" placeholder="বিকাশ/নগদ/ব্যাংক TrxID লিখুন">
                        </div>

                        <!-- Oath Checkbox -->
                        <div class="form-group" style="grid-column:1/-1; background:#f0fdfa; padding:14px 18px; border-radius:10px; border:1px solid #99f6e4;">
                            <label style="display:flex; align-items:center; gap:10px; cursor:pointer; margin:0; color:#0f766e;">
                                <input type="checkbox" id="admOathCheck" required style="width:18px; height:18px;">
                                <span><strong>শপথনামাঃ</strong> আমি অঙ্গীকার করছি যে ফর্মে প্রদত্ত সকল তথ্য সম্পূর্ণ সত্য এবং আমি <strong>Dream Career IT</strong>-এর সকল ক্লাস রুলস ও শৃঙ্খলা মেনে চলবো।</span>
                            </label>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary" style="padding:14px 32px; font-size:1rem;">
                        <i class="fa fa-paper-plane"></i> ভর্তি আবেদন সাবমিট করুন (Submit Application)
                    </button>
                </form>
            </div>
        </div>
    </section>`;

    const courseSel = document.getElementById('admCourseSelect');
    const disSel = document.getElementById('admDisabilitySelect');
    const medRow = document.getElementById('admMedicalReportRow');
    const feeInp = document.getElementById('admCourseFee');
    const durInp = document.getElementById('admCourseDuration');
    const paidInp = document.getElementById('admPaidAmount');
    const dueInp = document.getElementById('admDueAmount');
    const payMethodSel = document.getElementById('admPayMethod');
    const trxRow = document.getElementById('admTrxRow');

    function recalcAdmission() {
        const opt = courseSel.options[courseSel.selectedIndex];
        let baseFee = parseFloat(opt.getAttribute('data-fee')) || 1500;
        const dur = opt.getAttribute('data-duration') || '3 Months';
        durInp.value = dur;

        if (disSel.value === 'হ্যাঁ') {
            medRow.style.display = 'block';
            baseFee = Math.round(baseFee * (1 - disPercent / 100));
        } else {
            medRow.style.display = 'none';
        }
        feeInp.value = baseFee;
        const paid = parseFloat(paidInp.value) || 0;
        dueInp.value = Math.max(0, baseFee - paid);

        const pmVal = payMethodSel.value.toLowerCase();
        if (pmVal.includes('cash') || pmVal.includes('ক্যাশ')) {
            trxRow.style.display = 'none';
        } else {
            trxRow.style.display = 'block';
        }
    }

    courseSel.addEventListener('change', recalcAdmission);
    disSel.addEventListener('change', recalcAdmission);
    paidInp.addEventListener('input', recalcAdmission);
    payMethodSel.addEventListener('change', recalcAdmission);
    recalcAdmission();

    document.getElementById('onlineAdmissionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const fd = new FormData(this);
        const curDB = DCITStore.getDB();
        const serial = curDB.admissions.length + 101;
        const appNo = 'REG-' + new Date().getFullYear() + '-' + serial;
        const autoSecCode = DCITStore.generateSecretCode(fd.get('full_name'), fd.get('course_name'), new Date().getFullYear(), serial);

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
            discount_percent: fd.get('has_disability') === 'হ্যাঁ' ? disPercent : 0,
            course_name: fd.get('course_name'),
            course_fee: parseFloat(feeInp.value) || 0,
            course_duration: durInp.value,
            preferred_slot: fd.get('preferred_slot'),
            session_quarter: 'January to March',
            batch_year: new Date().getFullYear(),
            dob: fd.get('dob'),
            payment_method: fd.get('payment_method'),
            trx_id: trxRow.style.display === 'none' ? 'CASH' : (fd.get('trx_id') || 'ONLINE'),
            paid_amount: parseFloat(paidInp.value) || 0,
            due_amount: parseFloat(dueInp.value) || 0,
            status: 'Pending',
            created_at: new Date().toISOString().slice(0, 10)
        });
        DCITStore.saveDB(curDB);

        openDcitPopup('🎉 অনলাইন ভর্তি আবেদন সফলভাবে সম্পন্ন হয়েছে!', `
            <div style="text-align:center; padding:12px;">
                <i class="fa fa-check-circle" style="font-size:3rem; color:#16a34a; margin-bottom:10px;"></i>
                <h3 style="color:#151442;">অভিনন্দন, ${esc(fd.get('full_name'))}!</h3>
                <p style="margin:8px 0;">আপনার ভর্তি আবেদন নম্বরঃ <strong style="color:#0f766e;">${esc(appNo)}</strong></p>
                <div style="background:#fffbeb; border:2px dashed #d97706; padding:14px; border-radius:10px; margin:14px 0;">
                    <strong>আপনার অটো-জেনারেটেড স্টুডেন্ট গোপন কোড (Secret Code):</strong><br>
                    <span style="font-size:1.35rem; font-weight:800; color:#ea580c; letter-spacing:1px;">${esc(autoSecCode)}</span><br>
                    <small style="color:#78350f;">(ভবিষ্যতে সার্টিফিকেট ভেরিফিকেশন ও প্রিন্ট করার জন্য এই গোপন কোডটি সংরক্ষণ করুন)</small>
                </div>
                <p style="font-size:0.9rem; color:#475569;">কোর্স ফিঃ ৳${feeInp.value} | পরিশোধিতঃ ৳${paidInp.value} | বকেয়াঃ ৳${dueInp.value}</p>
            </div>
        `);
        this.reset();
        recalcAdmission();
    });
}

/* ==========================================================================
   5. NEW BATCH, OLD BATCH (2010-2026) & CLASS ROUTINE (Card/List + Popup)
   ========================================================================== */
function renderBatches(main, params = {}) {
    const db = DCITStore.getDB();
    const batchType = params.type || 'New Batch';
    const yearFilter = params.year ? Number(params.year) : 0;
    let students = (db.students || []).filter(s => !params.type || s.batch_type === batchType);
    if (yearFilter) students = students.filter(s => Number(s.batch_year) === yearFilter);
    const courses = (db.courses || []).filter(c => c.status !== 'Inactive');

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container">
            <h1>${batchType === 'Old Batch' ? 'পুরাতন ব্যাচ আর্কাইভ (2010 - 2026)' : 'নতুন ব্যাচ (New Batch) ও কোর্স তালিকা'}</h1>
            <p>কার্ড ভিউ ও লিস্ট ভিউ সিস্টেমে ব্যাচ ও কোর্সের বিস্তারিত এবং ভর্তিকৃত শিক্ষার্থীদের তালিকা</p>
        </div>
    </div>
    <section class="section">
        <div class="container">
            <div class="view-toolbar">
                <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
                    <button onclick="navigateView('batches', {type:'New Batch'})" class="btn ${batchType==='New Batch'?'btn-primary':'btn-outline'} btn-sm" style="${batchType!=='New Batch'?'color:#151442; border-color:#cbd5e1;':''}">নতুন ব্যাচ (New Batch)</button>
                    <button onclick="navigateView('batches', {type:'Old Batch'})" class="btn ${batchType==='Old Batch'?'btn-primary':'btn-outline'} btn-sm" style="${batchType!=='Old Batch'?'color:#151442; border-color:#cbd5e1;':''}">পুরাতন ব্যাচ (2010 - 2026)</button>
                    <select onchange="navigateView('batches', {type:'${esc(batchType)}', year:this.value})" class="form-control" style="width:155px; padding:6px 10px;">
                        <option value="">-- সকল সাল (2010-2026) --</option>
                        ${Array.from({length:17}, (_,i)=>2026-i).map(y => `<option value="${y}" ${yearFilter===y?'selected':''}>${y} Batch</option>`).join('')}
                    </select>
                </div>
                <div class="view-toggle-btns">
                    <button class="view-btn active" onclick="toggleViewMode('batchCoursesGrid','card',this)"><i class="fa fa-th-large"></i> কার্ড ভিউ</button>
                    <button class="view-btn" onclick="toggleViewMode('batchCoursesGrid','list',this)"><i class="fa fa-list"></i> লিস্ট ভিউ</button>
                </div>
            </div>

            <div class="grid-3" id="batchCoursesGrid" style="margin-bottom:42px;">
                ${courses.map(c => renderCourseCardHTML(c)).join('')}
            </div>

            <h3 style="margin-bottom:16px; color:#151442;"><i class="fa fa-users" style="color:#0f766e;"></i> ${esc(batchType)} শিক্ষার্থী তালিকা (${students.length} জন)</h3>
            <div class="table-responsive">
                <table class="data-table">
                    <thead><tr><th>SL</th><th>ছবি</th><th>শিক্ষার্থীর নাম</th><th>রেজিঃ নং</th><th>রোল</th><th>কোর্স</th><th>ব্যাচ ও সেশন</th><th>ক্লাস টাইম</th><th>রেজাল্ট</th></tr></thead>
                    <tbody>
                        ${students.length ? students.map((s, idx) => `
                        <tr>
                            <td>${String(idx+1).padStart(2,'0')}</td>
                            <td><img src="${esc(s.photo || 'assets/img/logo.jpg')}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;"></td>
                            <td><a href="#biodata" onclick="openBiodataPopup('${esc(s.reg_no)}')" style="font-weight:700;">${esc(s.name)}</a></td>
                            <td><strong>${esc(s.reg_no)}</strong></td>
                            <td>${esc(s.roll_no)}</td>
                            <td><a href="#course" onclick="navigateView('course-detail', {slug:'${esc(s.course_name)}'})">${esc(s.course_name)}</a></td>
                            <td>${esc(s.session_quarter)} (${esc(s.batch_year)})</td>
                            <td><span class="badge badge-info">${esc(s.class_slot)}</span></td>
                            <td><span class="badge badge-success">${esc(s.result_grade)}</span></td>
                        </tr>`).join('') : `<tr><td colspan="9" style="text-align:center; padding:24px;">এই ফিল্টারে কোনো শিক্ষার্থী নেই।</td></tr>`}
                    </tbody>
                </table>
            </div>
        </div>
    </section>`;
}

function renderRoutine(main) {
    const db = DCITStore.getDB();
    const classes = db.classes || [];

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container">
            <h1>ক্লাস রুটিন ও সময়সূচি (Class Routine & Schedule)</h1>
            <p>সকাল ৮:০০ টা থেকে রাত ৮:৩০ টা পর্যন্ত সকল শিফটের রুটিন — কার্ডে ক্লিক করলে বিস্তারিত পপআপ ও আলাদা পেজ দেখা যাবে</p>
        </div>
    </div>
    <section class="section">
        <div class="container">
            <div class="view-toolbar">
                <div><strong><i class="fa fa-clock-o" style="color:#0f766e;"></i> মোট সক্রিয় ক্লাস শিফটঃ ${classes.length} টি</strong></div>
                <div class="view-toggle-btns">
                    <button class="view-btn active" onclick="toggleViewMode('routineCardsContainer','card',this)"><i class="fa fa-th-large"></i> কার্ড ভিউ</button>
                    <button class="view-btn" onclick="toggleViewMode('routineCardsContainer','list',this)"><i class="fa fa-list"></i> লিস্ট ভিউ</button>
                </div>
            </div>
            <div class="grid-3" id="routineCardsContainer">
                ${classes.map(cl => {
                    const cnt = (db.students || []).filter(s => s.class_slot === cl.time_label).length;
                    return `
                    <div class="card" onclick="openRoutinePopup(${Number(cl.id)})" style="cursor:pointer;">
                        <div class="card-body">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                                <span class="badge badge-info"><i class="fa fa-clock-o"></i> ${esc(cl.time_label)}</span>
                                <span class="badge badge-success">${cnt} / ${Number(cl.max_seats || 20)} সিট</span>
                            </div>
                            <h3>${esc(cl.batch_name)}</h3>
                            <div class="title-bn">${esc(cl.course_name)}</div>
                            <p>
                                <strong>প্রশিক্ষক:</strong> ${esc(cl.teacher_name)}<br>
                                <strong>ল্যাব/রুম:</strong> ${esc(cl.room_no)} | <strong>বার:</strong> ${esc(cl.days_of_week)}<br>
                                <strong>নিয়মাবলী:</strong> ${esc(cl.rules_text)}
                            </p>
                            <div class="card-footer" onclick="event.stopPropagation();">
                                <button onclick="openRoutinePopup(${Number(cl.id)})" class="btn btn-primary btn-sm" style="flex:1;"><i class="fa fa-window-maximize"></i> পপআপ ভিউ</button>
                                <button onclick="navigateView('routine-detail', {id:${Number(cl.id)}})" class="btn btn-accent btn-sm"><i class="fa fa-external-link"></i> আলাদা পেজ</button>
                            </div>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>
    </section>`;
}

function openRoutinePopup(id) {
    const db = DCITStore.getDB();
    const cl = (db.classes || []).find(c => Number(c.id) === Number(id)) || db.classes[0];
    if (!cl) return;
    const enrolled = (db.students || []).filter(s => s.class_slot === cl.time_label);

    openDcitPopup(`🕒 ক্লাস রুটিন ও সময়সূচি — ${esc(cl.time_label)}`, `
        <div>
            <div style="background:#f0fdfa; padding:16px; border-radius:12px; border-left:4px solid #0f766e; margin-bottom:18px;">
                <h3 style="color:#151442; margin-bottom:4px;">${esc(cl.batch_name)} — ${esc(cl.course_name)}</h3>
                <p style="color:#0f766e; font-weight:700;">সময়ঃ ${esc(cl.time_label)} | বারঃ ${esc(cl.days_of_week)} | রুমঃ ${esc(cl.room_no)}</p>
                <p style="margin-top:6px;"><strong>প্রশিক্ষকঃ</strong> ${esc(cl.teacher_name)} | <strong>সেশনঃ</strong> ${esc(cl.session_name)} (${esc(cl.batch_year)})</p>
                <p style="margin-top:6px;"><strong>ক্লাস রুলসঃ</strong> ${esc(cl.rules_text)}</p>
            </div>
            <h4 style="margin-bottom:10px;">এই শিফটের ভর্তিকৃত শিক্ষার্থী তালিকা (${enrolled.length} জন):</h4>
            <div class="table-responsive">
                <table class="data-table" style="min-width:100%;">
                    <thead><tr><th>রোল</th><th>রেজিঃ নং</th><th>শিক্ষার্থীর নাম</th><th>কোর্স</th></tr></thead>
                    <tbody>
                        ${enrolled.length ? enrolled.map(s => `<tr><td>${esc(s.roll_no)}</td><td>${esc(s.reg_no)}</td><td><strong>${esc(s.name)}</strong></td><td>${esc(s.course_name)}</td></tr>`).join('') : `<tr><td colspan="4" style="text-align:center;">কোনো শিক্ষার্থী নিবন্ধিত নেই।</td></tr>`}
                    </tbody>
                </table>
            </div>
            <div style="margin-top:16px; text-align:right;">
                <button onclick="closeDcitPopup(); navigateView('routine-detail', {id:${Number(cl.id)}})" class="btn btn-primary btn-sm">আলাদা পেজে সম্পূর্ণ ভিউ দেখুন &rarr;</button>
            </div>
        </div>
    `);
}

function renderRoutineDetail(main, id) {
    const db = DCITStore.getDB();
    const cl = (db.classes || []).find(c => Number(c.id) === Number(id)) || db.classes[0];
    const enrolled = cl ? (db.students || []).filter(s => s.class_slot === cl.time_label) : [];

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container">
            <h1>ক্লাস রুটিনঃ ${esc(cl.time_label)} (${esc(cl.batch_name)})</h1>
            <p>কোর্সঃ ${esc(cl.course_name)} | প্রশিক্ষকঃ ${esc(cl.teacher_name)} | রুমঃ ${esc(cl.room_no)}</p>
        </div>
    </div>
    <section class="section">
        <div class="container">
            <button onclick="navigateView('routine')" class="btn btn-outline btn-sm" style="color:#151442; border-color:#cbd5e1; margin-bottom:20px;">&larr; সকল ক্লাস রুটিনে ফিরে যান</button>
            <div class="form-card" style="margin-bottom:28px;">
                <h3>ক্লাসের নিয়মাবলী ও সময়সূচি বিবরণ</h3>
                <p style="margin-top:8px;"><strong>সময়:</strong> ${esc(cl.time_label)} | <strong>সাপ্তাহিক বার:</strong> ${esc(cl.days_of_week)} | <strong>আসন সংখ্যা:</strong> ${enrolled.length}/${Number(cl.max_seats)}</p>
                <p style="margin-top:6px;"><strong>নিয়মাবলী:</strong> ${esc(cl.rules_text)}</p>
            </div>
            <div class="table-responsive">
                <table class="data-table">
                    <thead><tr><th>SL</th><th>শিক্ষার্থীর নাম</th><th>রেজিঃ নং</th><th>রোল</th><th>কোর্স</th><th>স্ট্যাটাস</th></tr></thead>
                    <tbody>
                        ${enrolled.map((s,i) => `<tr><td>${i+1}</td><td><strong>${esc(s.name)}</strong></td><td>${esc(s.reg_no)}</td><td>${esc(s.roll_no)}</td><td>${esc(s.course_name)}</td><td><span class="badge badge-success">${esc(s.status)}</span></td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </section>`;
}

/* ==========================================================================
   6. STUDENT BIO-DATA (Search by Roll / Registration No -> Popup View!)
   ========================================================================== */
function renderBiodata(main, params = {}) {
    const db = DCITStore.getDB();
    const students = db.students || [];

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container">
            <h1>স্টুডেন্ট বায়োডাটা ও শিক্ষার্থী ডিরেক্টরি (Student Bio-Data)</h1>
            <p>রোল বা রেজিস্ট্রেশন নাম্বার দিয়ে সার্চ করলে পপআপ ভিউতে সম্পূর্ণ বায়োডাটা দেখা যাবে</p>
        </div>
    </div>
    <section class="section">
        <div class="container">
            <div class="form-card" style="margin-bottom:30px;">
                <h3 style="margin-bottom:12px; color:#151442;"><i class="fa fa-id-card-o" style="color:#0f766e;"></i> রোল বা রেজিস্ট্রেশন নাম্বার দিয়ে বায়োডাটা সার্চ করুন</h3>
                <form onsubmit="event.preventDefault(); searchBiodataPopup(document.getElementById('bioRollRegInput').value);" style="display:flex; gap:12px; flex-wrap:wrap;">
                    <input type="text" id="bioRollRegInput" class="form-control" value="${esc(params.q || '000001')}" required placeholder="রোল বা রেজিস্ট্রেশন নাম্বার লিখুন (যেমন: 000001 বা 01)" style="flex:1;">
                    <button type="submit" class="btn btn-primary"><i class="fa fa-window-maximize"></i> পপআপে বায়োডাটা দেখুন</button>
                </form>
            </div>

            <div class="table-responsive">
                <table class="data-table">
                    <thead><tr><th>SL</th><th>ছবি</th><th>শিক্ষার্থীর নাম</th><th>Registration No</th><th>Roll No</th><th>কোর্স</th><th>ব্যাচ ও সেশন</th><th>অ্যাকশন</th></tr></thead>
                    <tbody>
                        ${students.map((s, idx) => `
                        <tr>
                            <td>${String(idx+1).padStart(2,'0')}</td>
                            <td><img src="${esc(s.photo || 'assets/img/logo.jpg')}" style="width:42px; height:42px; border-radius:50%; object-fit:cover;"></td>
                            <td><a href="#bio" onclick="openBiodataPopup('${esc(s.reg_no)}')" style="font-weight:700;">${esc(s.name)}</a></td>
                            <td><strong>${esc(s.reg_no)}</strong></td>
                            <td>${esc(s.roll_no)}</td>
                            <td>${esc(s.course_name)}</td>
                            <td>${esc(s.session_quarter)} (${esc(s.batch_year)})</td>
                            <td><button onclick="openBiodataPopup('${esc(s.reg_no)}')" class="btn btn-primary btn-sm"><i class="fa fa-id-card-o"></i> পপআপ বায়োডাটা</button></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </section>`;

    if (params.reg_no) {
        setTimeout(() => openBiodataPopup(params.reg_no), 100);
    }
}

function searchBiodataPopup(query) {
    const q = String(query || '').trim().toLowerCase();
    const db = DCITStore.getDB();
    const found = (db.students || []).find(s => s.reg_no.toLowerCase() === q || s.roll_no.toLowerCase() === q || s.name.toLowerCase().includes(q));
    if (found) {
        openBiodataPopup(found.reg_no);
    } else {
        openDcitPopup('⚠️ স্টুডেন্ট বায়োডাটা পাওয়া যায়নি', `<div class="alert alert-danger">প্রদত্ত রোল বা রেজিস্ট্রেশন নাম্বার (${esc(query)}) দিয়ে কোনো শিক্ষার্থী পাওয়া যায়নি! (000001 থেকে 000006 দিয়ে চেষ্টা করুন)।</div>`);
    }
}

function openBiodataPopup(regNo) {
    const db = DCITStore.getDB();
    const p = (db.students || []).find(s => s.reg_no === regNo || s.roll_no === regNo);
    if (!p) return;

    openDcitPopup(`🎓 স্টুডেন্ট বায়োডাটা — ${esc(p.name)} (Reg: ${esc(p.reg_no)})`, `
        <div>
            <div style="display:flex; align-items:center; gap:18px; flex-wrap:wrap; border-bottom:2px dashed #e2e8f0; padding-bottom:16px; margin-bottom:18px;">
                <img src="${esc(p.photo || 'assets/img/logo.jpg')}" style="width:105px; height:105px; border-radius:14px; object-fit:cover; border:3px solid #0f766e;">
                <div>
                    <span class="badge badge-info">Reg No: ${esc(p.reg_no)} | Roll No: ${esc(p.roll_no)}</span>
                    <h2 style="color:#151442; margin-top:6px;">${esc(p.name)}</h2>
                    <p style="color:#0f766e; font-weight:700;">${esc(p.course_name)} (${esc(p.session_quarter)} - ${esc(p.batch_year)})</p>
                </div>
            </div>
            <div class="grid-2" style="gap:14px; font-size:0.94rem;">
                <div>
                    <p><strong>পিতার নাম:</strong> ${esc(p.father_name)}</p>
                    <p><strong>মাতার নাম:</strong> ${esc(p.mother_name)}</p>
                    <p><strong>বর্তমান ঠিকানা:</strong> ${esc(p.present_address)}</p>
                    <p><strong>স্থায়ী ঠিকানা:</strong> ${esc(p.permanent_address)}</p>
                    <p><strong>মোবাইল:</strong> ${esc(p.phone)}</p>
                    <p><strong>ইমেইল:</strong> ${esc(p.email)}</p>
                </div>
                <div>
                    <p><strong>জন্ম তারিখ:</strong> ${esc(p.dob)}</p>
                    <p><strong>ধর্ম ও বৈবাহিক অবস্থা:</strong> ${esc(p.religion)} | ${esc(p.marital_status)}</p>
                    <p><strong>উচ্চতা ও ওজন:</strong> ${esc(p.height)} | ${esc(p.weight)}</p>
                    <p><strong>শিক্ষাগত যোগ্যতা:</strong> ${esc(p.education)} (${esc(p.school_college)})</p>
                    <p><strong>ক্লাস টাইম:</strong> ${esc(p.class_slot)}</p>
                    <p><strong>রেজাল্ট / গ্রেড:</strong> <span class="badge badge-success">${esc(p.result_grade)} (GPA: ${esc(p.cgpa)})</span></p>
                </div>
            </div>
            <div style="margin-top:14px; padding:12px; background:#f8fafc; border-radius:8px; border-left:4px solid #0f766e;">
                <strong>অভিজ্ঞতা ও দক্ষতা (Experience):</strong><br>${esc(p.experience)}
            </div>
        </div>
    `);
}

/* ==========================================================================
   7. CERTIFICATE VERIFICATION (Search by Roll/Reg + Secret Code -> Popup + Landscape Print)
   ========================================================================== */
function renderCertificates(main) {
    const db = DCITStore.getDB();
    const certs = (db.certificates || []).filter(c => c.status === 'Issued');

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container">
            <h1>সার্টিফিকেট ভেরিফিকেশন ও প্রিন্ট (Certificate Verification)</h1>
            <p>রোল/রেজিস্ট্রেশন নাম্বার এবং স্টুডেন্ট গোপন কোড (Secret Code) দিয়ে পপআপে সার্টিফিকেট যাচাই ও ল্যান্ডস্কেপ লেটার সাইজে প্রিন্ট করুন</p>
        </div>
    </div>
    <section class="section">
        <div class="container" style="max-width:900px;">
            <div class="form-card" style="margin-bottom:32px; border-top:5px solid #ea580c;">
                <h3 style="margin-bottom:14px; color:#151442;"><i class="fa fa-shield" style="color:#ea580c;"></i> রোল/রেজিস্ট্রেশন নাম্বার ও গোপন কোড দিয়ে সার্টিফিকেট যাচাই করুন</h3>
                <form onsubmit="event.preventDefault(); verifyCertInPopup();">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>রোল অথবা রেজিস্ট্রেশন নাম্বার *</label>
                            <input type="text" id="verifyRegInput" class="form-control" value="000001" required placeholder="যেমন: 000001 অথবা 01">
                        </div>
                        <div class="form-group">
                            <label>স্টুডেন্ট গোপন কোড (Secret Code) *</label>
                            <input type="text" id="verifySecretInput" class="form-control" value="DCIT-SAGOR-ADV20-001" required placeholder="যেমন: DCIT-SAGOR-ADV20-001">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-accent"><i class="fa fa-check-circle"></i> পপআপে সার্টিফিকেট ভেরিফাই ও প্রিন্ট করুন</button>
                </form>
            </div>

            <div class="table-responsive">
                <table class="data-table">
                    <thead><tr><th>SL</th><th>শিক্ষার্থীর নাম</th><th>রেজিঃ নং</th><th>সার্টিফিকেট নং</th><th>কোর্স</th><th>গ্রেড</th><th>অ্যাকশন</th></tr></thead>
                    <tbody>
                        ${certs.map((c, i) => `
                        <tr>
                            <td>${String(i+1).padStart(2,'0')}</td>
                            <td><strong>${esc(c.student_name)}</strong></td>
                            <td><strong>${esc(c.reg_no)}</strong></td>
                            <td>${esc(c.cert_no)}</td>
                            <td>${esc(c.course_name)}</td>
                            <td><span class="badge badge-success">${esc(c.grade)}</span></td>
                            <td><button onclick="promptSecretCodeAndPrint('${esc(c.reg_no)}')" class="btn btn-primary btn-sm"><i class="fa fa-lock"></i> গোপন কোডে প্রিন্ট</button></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
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
        openDcitPopup('❌ সার্টিফিকেট ভেরিফিকেশন ব্যর্থ হয়েছে', `
            <div class="alert alert-danger">দুঃখিত! প্রদত্ত রোল/রেজিস্ট্রেশন নাম্বার অথবা স্টুডেন্ট গোপন কোডটি সঠিক নয়। সঠিক গোপন কোড দিয়ে আবার চেষ্টা করুন।</div>
        `);
        return;
    }

    window._lastVerifiedCert = cert;
    openDcitPopup(`✅ ভেরিফাইড সার্টিফিকেট — ${esc(cert.student_name)}`, `
        <div>
            <div style="border:6px solid #151442; padding:12px; background:#fff; border-radius:8px; margin-bottom:18px;">
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
   8. ADMINISTRATION (প্রশাসন - শিক্ষক, ট্রেইনার, পরিচালক, ফাউন্ডার, সদস্য)
   ========================================================================== */
function renderTeachers(main, params = {}) {
    const db = DCITStore.getDB();
    const roleFilter = params.role || '';
    let staff = db.teachers || [];
    if (roleFilter) staff = staff.filter(t => t.role_type === roleFilter);
    const roles = ['শিক্ষক', 'ট্রেইনার', 'পরিচালক', 'ফাউন্ডার', 'সদস্য'];

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container">
            <h1>প্রশাসন ও শিক্ষকবৃন্দ (${roleFilter || 'সকল ক্যাটাগরি'})</h1>
            <p>শিক্ষক, ট্রেইনার, পরিচালক, ফাউন্ডার ও সদস্যদের এনিমেটেড প্রোফাইল — কার্ডে ক্লিক করলে পপআপে বিস্তারিত ও ক্লাস রুটিন দেখা যাবে</p>
        </div>
    </div>
    <section class="section">
        <div class="container">
            <div class="view-toolbar">
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <button onclick="navigateView('teachers', {role:''})" class="btn ${!roleFilter?'btn-primary':'btn-outline'} btn-sm" style="${roleFilter?'color:#151442; border-color:#cbd5e1;':''}">সকল (${(db.teachers||[]).length})</button>
                    ${roles.map(r => `<button onclick="navigateView('teachers', {role:'${r}'})" class="btn ${roleFilter===r?'btn-primary':'btn-outline'} btn-sm" style="${roleFilter!==r?'color:#151442; border-color:#cbd5e1;':''}">${r}</button>`).join('')}
                </div>
                <div class="view-toggle-btns">
                    <button class="view-btn active" onclick="toggleViewMode('adminStaffGrid','card',this)"><i class="fa fa-th-large"></i> কার্ড ভিউ</button>
                    <button class="view-btn" onclick="toggleViewMode('adminStaffGrid','list',this)"><i class="fa fa-list"></i> লিস্ট ভিউ</button>
                </div>
            </div>

            <div class="grid-3" id="adminStaffGrid">
                ${staff.map(t => `
                <div class="card" onclick="openStaffPopup(${Number(t.id)})" style="cursor:pointer;">
                    <div class="card-body" style="text-align:center;">
                        <img src="${esc(t.photo || 'assets/img/logo.jpg')}" style="width:125px; height:125px; border-radius:50%; object-fit:cover; border:4px solid #0f766e; margin:0 auto 14px;">
                        <span class="badge badge-info" style="align-self:center; margin-bottom:6px;">${esc(t.role_type)}</span>
                        <h3>${esc(t.name)}</h3>
                        <div class="title-bn">${esc(t.designation)}</div>
                        <p style="font-size:0.88rem;">
                            <i class="fa fa-phone" style="color:#0f766e;"></i> ${esc(t.phone)}<br>
                            <i class="fa fa-envelope-o" style="color:#ea580c;"></i> ${esc(t.email)}
                        </p>
                        <div class="card-footer" onclick="event.stopPropagation();">
                            <button onclick="openStaffPopup(${Number(t.id)})" class="btn btn-primary btn-sm" style="flex:1;"><i class="fa fa-id-badge"></i> বিস্তারিত প্রোফাইল ও রুটিন (পপআপ)</button>
                        </div>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </section>`;
}

function openStaffPopup(id) {
    const db = DCITStore.getDB();
    const t = (db.teachers || []).find(x => Number(x.id) === Number(id)) || db.teachers[0];
    if (!t) return;
    const assignedClasses = (db.classes || []).filter(c => c.teacher_name.toLowerCase().includes(t.name.split(' ')[0].toLowerCase()));

    openDcitPopup(`👤 প্রোফাইল ও ক্লাস সময়সূচি — ${esc(t.name)}`, `
        <div>
            <div style="display:flex; align-items:center; gap:20px; flex-wrap:wrap; border-bottom:2px dashed #e2e8f0; padding-bottom:16px; margin-bottom:16px;">
                <img src="${esc(t.photo || 'assets/img/logo.jpg')}" style="width:115px; height:115px; border-radius:50%; object-fit:cover; border:4px solid #0f766e;">
                <div>
                    <span class="badge badge-info">${esc(t.role_type)}</span>
                    <h2 style="color:#151442; margin-top:4px;">${esc(t.name)}</h2>
                    <p style="color:#0f766e; font-weight:700;">${esc(t.designation)}</p>
                    <p style="font-size:0.88rem; color:#475569;">${esc(t.qualification || '')}</p>
                </div>
            </div>
            <p style="margin-bottom:8px;"><strong>পরিচিতি (Bio):</strong> ${esc(t.bio)}</p>
            <p style="margin-bottom:8px;"><strong>মোবাইল:</strong> ${esc(t.phone)} | <strong>ইমেইল:</strong> ${esc(t.email)}</p>
            <p style="margin-bottom:14px;"><strong>ঠিকানা:</strong> ${esc(t.address)}</p>
            <div style="background:#f0fdfa; padding:14px; border-radius:10px; border-left:4px solid #0f766e;">
                <strong><i class="fa fa-clock-o"></i> নির্ধারিত ক্লাস রুটিন ও সময়সূচিঃ</strong><br>
                <span>${esc(t.schedule_info || 'সকাল ৮:০০ - রাত ৮:৩০')}</span>
                ${assignedClasses.length ? `<ul style="margin-top:8px; padding-left:18px;">${assignedClasses.map(c => `<li><strong>${esc(c.time_label)}</strong> — ${esc(c.course_name)} (${esc(c.batch_name)}, ${esc(c.room_no)})</li>`).join('')}</ul>` : ''}
            </div>
        </div>
    `);
}

/* ==========================================================================
   9. NOTICES & OTHER PAGES (Contact List, About, Mission, Terms, License, Designer)
   ========================================================================== */
function renderNotices(main) {
    const db = DCITStore.getDB();
    const notices = db.notices || [];
    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container"><h1>নোটিশ বোর্ড (Official Notice Board)</h1><p>Dream Career IT-এর সকল অফিসিয়াল বিজ্ঞপ্তি ও আপডেট</p></div>
    </div>
    <section class="section"><div class="container"><div class="grid-3">
        ${notices.map(n => `
        <div class="card">
            <div class="card-body">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span class="badge badge-warning">${esc(n.category)}</span>
                    <small>${esc(n.publish_date)}</small>
                </div>
                <h3>${esc(n.title)}</h3>
                <p>${esc(n.details)}</p>
                <button onclick="openNoticePopup(${Number(n.id)})" class="btn btn-primary btn-sm">পপআপে বিস্তারিত দেখুন</button>
            </div>
        </div>`).join('')}
    </div></div></section>`;
}

function openNoticePopup(id) {
    const db = DCITStore.getDB();
    const n = (db.notices || []).find(x => Number(x.id) === Number(id)) || db.notices[0];
    if (!n) return;
    openDcitPopup(`📢 নোটিশঃ ${esc(n.title)}`, `
        <div>
            <p style="margin-bottom:12px;"><span class="badge badge-warning">${esc(n.category)}</span> | <strong>প্রকাশের তারিখঃ</strong> ${esc(n.publish_date)}</p>
            <div style="padding:16px; background:#f8fafc; border-radius:10px; line-height:1.8; font-size:1rem;">${esc(n.details)}</div>
        </div>
    `);
}

function renderContactList(main) {
    const db = DCITStore.getDB();
    const staff = db.teachers || [];
    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container"><h1>অফিসিয়াল কন্টাক্ট লিস্ট (Contact Directory)</h1><p>Dream Career IT-এর জরুরি হটলাইন, দপ্তর ও কর্মকর্তাদের যোগাযোগ তালিকা</p></div>
    </div>
    <section class="section"><div class="container">
        <div class="table-responsive">
            <table class="data-table">
                <thead><tr><th>নাম ও দপ্তর</th><th>পদবী</th><th>ক্যাটাগরি</th><th>মোবাইল নাম্বার</th><th>ইমেইল</th></tr></thead>
                <tbody>
                    <tr><td><strong>Dream Career IT (প্রধান কার্যালয়)</strong></td><td>ভর্তি ও তথ্য ডেস্ক</td><td><span class="badge badge-success">হটলাইন</span></td><td><strong>01771770044</strong></td><td>dc13edubd@gmail.com</td></tr>
                    ${staff.map(t => `<tr><td><strong>${esc(t.name)}</strong></td><td>${esc(t.designation)}</td><td><span class="badge badge-info">${esc(t.role_type)}</span></td><td>${esc(t.phone)}</td><td>${esc(t.email)}</td></tr>`).join('')}
                </tbody>
            </table>
        </div>
    </div></section>`;
}

function renderAbout(main) {
    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container"><h1>আমাদের সম্পর্কে (About Dream Career IT)</h1><p>${esc(DCITStore.setting('site_slogan'))}</p></div>
    </div>
    <section class="section"><div class="container">
        <div class="grid-2" style="align-items:center;">
            <div class="form-card">
                <h2 style="color:#151442; margin-bottom:12px;">Dream Career IT (ড্রিম ক্যারিয়ার আইটি)</h2>
                <p style="margin-bottom:14px;">${esc(DCITStore.setting('about_intro'))}</p>
                <p><strong>ঠিকানাঃ</strong> ${esc(DCITStore.setting('address_bn'))}</p>
                <p><strong>হটলাইনঃ</strong> 01771770044, 01879653143</p>
            </div>
            <div style="text-align:center;"><img src="assets/img/logo.jpg" style="width:240px; height:240px; border-radius:24px; margin:0 auto; box-shadow:var(--shadow-lg);"></div>
        </div>
    </div></section>`;
}

function renderMission(main) {
    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container"><h1>আমাদের উদ্দেশ্য ও লক্ষ্য (Our Mission & Vision)</h1><p>দক্ষ মানবসম্পদ তৈরি ও বেকারত্ব দূরীকরণে আমাদের অঙ্গীকার</p></div>
    </div>
    <section class="section"><div class="container"><div class="grid-2">
        <div class="card"><img src="assets/img/mission.jpg" style="height:220px; object-fit:cover;"><div class="card-body"><h3>আমাদের লক্ষ্য (Our Mission)</h3><p>${esc(DCITStore.setting('mission_text'))}</p></div></div>
        <div class="card"><img src="assets/img/vision.jpg" style="height:220px; object-fit:cover;"><div class="card-body"><h3>আমাদের ভিশন (Our Vision)</h3><p>${esc(DCITStore.setting('vision_text'))}</p></div></div>
    </div></div></section>`;
}

function renderTerms(main) {
    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container"><h1>টার্মস এবং কন্ডিশন (Terms & Conditions)</h1><p>শিক্ষার্থী ও ভিজিটরদের জন্য অনুসরণীয় নীতিমালা</p></div>
    </div>
    <section class="section"><div class="container" style="max-width:840px;">
        <div class="form-card">
            <h3 style="color:#151442; margin-bottom:14px;"><i class="fa fa-gavel" style="color:#0f766e;"></i> প্রাতিষ্ঠানিক নিয়মাবলী ও শর্তসমূহ</h3>
            <p style="white-space:pre-line; line-height:1.9;">${esc(DCITStore.setting('terms_text'))}</p>
        </div>
    </div></section>`;
}

function renderLicense(main) {
    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container"><h1>লাইসেন্স ও অনুমোদন (License & Accreditation)</h1><p>Dream Career IT-এর প্রাতিষ্ঠানিক বৈধতা ও ভেরিফিকেশন সনদ</p></div>
    </div>
    <section class="section"><div class="container" style="max-width:840px;">
        <div class="form-card" style="border-top:5px solid #0f766e;">
            <h3 style="color:#151442; margin-bottom:14px;"><i class="fa fa-shield" style="color:#0f766e;"></i> লাইসেন্স ও ভেরিফিকেশন তথ্য</h3>
            <p style="white-space:pre-line; line-height:1.9;">${esc(DCITStore.setting('license_text'))}</p>
        </div>
    </div></section>`;
}

function getContactGridHTML() {
    return `
    <div class="grid-2">
        <div class="form-card">
            <div id="contactAlert"></div>
            <h3 style="margin-bottom:14px; color:#0f766e;"><i class="fa fa-paper-plane"></i> আমাদের মেসেজ পাঠান</h3>
            <form id="contactForm">
                <div class="form-group"><label>আপনার নাম *</label><input type="text" name="sender_name" class="form-control" required></div>
                <div class="form-group"><label>ইমেইল *</label><input type="email" name="sender_email" class="form-control" required></div>
                <div class="form-group"><label>মোবাইল নম্বর *</label><input type="tel" name="phone" class="form-control" required></div>
                <div class="form-group"><label>বিষয়</label><input type="text" name="subject" class="form-control" value="Course & Admission Inquiry"></div>
                <div class="form-group"><label>আপনার বার্তা *</label><textarea name="message" class="form-control" rows="4" required></textarea></div>
                <button type="submit" class="btn btn-primary"><i class="fa fa-send"></i> বার্তা পাঠান</button>
            </form>
        </div>
        <div class="form-card">
            <h3 style="margin-bottom:12px; color:#0f766e;"><i class="fa fa-building"></i> Dream Career IT Office</h3>
            <p style="margin-bottom:12px;"><strong>ঠিকানা:</strong> ${esc(DCITStore.setting('address_bn'))}</p>
            <p style="margin-bottom:12px;"><strong>হটলাইন:</strong> <a href="tel:01771770044">01771770044</a>, 01879653143</p>
            <p style="margin-bottom:18px;"><strong>ইমেইল:</strong> dc13edubd@gmail.com</p>
            <div style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:24px; border-radius:12px; text-align:center;">
                <i class="fa fa-map-marker" style="font-size:2.2rem; color:#fbbf24; margin-bottom:8px;"></i>
                <h4>Dream Career IT — Poduar Bazar, Cumilla</h4>
                <p style="font-size:0.9rem; color:#e2e8f0; margin:8px 0 14px;">ভাই ভাই সুপার মার্কেট, নতুন পদুয়ার বাজার মসজিদের পাশে, পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা।</p>
                <a href="https://www.google.com/maps/search/?api=1&query=Poduar+Bazar+Bishwo+Road+Cumilla" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-sm">Google Maps-এ লোকেশন দেখুন</a>
            </div>
        </div>
    </div>`;
}

function renderContact(main) {
    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:42px 0; text-align:center;">
        <div class="container"><h1>যোগাযোগ করুন (Contact Us)</h1><p>ফোনঃ 01771770044 | পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা</p></div>
    </div>
    <section class="section"><div class="container">${getContactGridHTML()}</div></section>`;
    bindSubscribeAndContactForms();
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
            curDB.subscribers.unshift({ id: Date.now(), contact_info: val, created_at: new Date().toISOString().slice(0,10) });
            DCITStore.saveDB(curDB);
            document.getElementById('subAlertBox').innerHTML = `<div class="alert alert-success" style="max-width:500px; margin:0 auto 14px;">ধন্যবাদ! আপনার সাবস্ক্রিপশন সফলভাবে যুক্ত হয়েছে।</div>`;
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
            document.getElementById('contactAlert').innerHTML = `<div class="alert alert-success">ধন্যবাদ! আপনার বার্তাটি এডমিন ইনবক্সে জমা হয়েছে।</div>`;
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
            <img src="assets/img/teacher-sagor.jpg" style="width:160px; height:160px; border-radius:50%; object-fit:cover; margin:0 auto 14px; border:4px solid #0f766e;">
            <h2>Jainal Abedin (Sagor)</h2>
            <p style="color:#0f766e; font-weight:700; margin-bottom:12px;">Senior Trainer & Full-Stack Web Designer at Dream Career IT</p>
            <p style="margin-bottom:14px;">Experienced in HTML5, CSS3, JavaScript, Bootstrap, PHP, and MySQL. Phone: 01879653143 | Email: gsctcbmcmrjas@gmail.com</p>
        </div>
    </div></section>`;
}

document.addEventListener('DOMContentLoaded', function() {
    navigateView('home');
});

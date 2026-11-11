/**
 * DREAM CAREER IT - Complete Dynamic Frontend Renderer (index.html)
 * Works seamlessly on GitHub Pages (dcitbd.github.io) and any Web Server!
 */
function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
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
        navDrop.innerHTML = activeCourses.map(c => `
            <li>
                <a href="#course-${esc(c.slug)}" onclick="navigateView('courses', {slug:'${esc(c.slug)}'})">
                    <span>${esc(c.title)}</span>
                    <small style="color:#ea580c; font-weight:700;">৳${Number(c.fee).toLocaleString()}</small>
                </a>
            </li>
        `).join('');
    }
    const footList = document.getElementById('footerCoursesList');
    if (footList) {
        footList.innerHTML = activeCourses.map(c => `
            <li><a href="#course-${esc(c.slug)}" onclick="navigateView('courses', {slug:'${esc(c.slug)}'})"><i class="fa fa-angle-right"></i> ${esc(c.title)} (৳${Number(c.fee).toLocaleString()})</a></li>
        `).join('');
    }
}

function navigateView(view, params = {}) {
    syncHeaderFooter();
    document.querySelectorAll('.nav-link').forEach(a => {
        a.classList.toggle('active', a.getAttribute('data-view') === view);
    });
    const main = document.getElementById('appMainContainer');
    if (!main) return;

    if (view === 'home') renderHome(main);
    else if (view === 'courses') renderCourses(main, params.slug || '');
    else if (view === 'result') renderResult(main, params);
    else if (view === 'admission') renderAdmission(main, params.course || '');
    else if (view === 'batches') renderBatches(main, params);
    else if (view === 'biodata') renderBiodata(main, params);
    else if (view === 'certificates') renderCertificates(main, params.q || '');
    else if (view === 'teachers') renderTeachers(main);
    else if (view === 'about') renderAbout(main);
    else if (view === 'contact') renderContact(main);
    else if (view === 'designer') renderDesigner(main);
    else renderHome(main);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderHome(main) {
    const db = DCITStore.getDB();
    const courses = (db.courses || []).filter(c => c.status !== 'Inactive');
    const siteName = DCITStore.setting('site_name', 'Dream Career IT');
    const addrBn = DCITStore.setting('address_bn');
    const phone1 = DCITStore.setting('phone_1', '01771770044');

    main.innerHTML = `
    <section class="hero-section">
        <div class="container hero-grid">
            <div class="hero-content">
                <span class="hero-badge"><i class="fa fa-star"></i> কুমিল্লার অন্যতম সেরা কারিগরি ও কম্পিউটার প্রশিক্ষণ কেন্দ্র</span>
                <div style="display:flex; align-items:center; gap:14px; margin-bottom:12px;">
                    <img src="assets/img/logo.jpg" alt="Dream Career IT" style="width:68px; height:68px; border-radius:14px; border:2px solid #5eead4;">
                    <h2 style="margin:0;">${esc(siteName)} <span>TRAINING CENTER</span></h2>
                </div>
                <div class="hero-address">
                    <i class="fa fa-map-marker" style="color:#fde68a;"></i> ${esc(addrBn)}<br>
                    <strong><i class="fa fa-phone" style="color:#5eead4;"></i> হটলাইনঃ ${esc(phone1)}</strong>
                </div>
                <div class="hero-actions">
                    <a href="#admission" onclick="navigateView('admission')" class="btn btn-accent"><i class="fa fa-user-plus"></i> অনলাইনে ভর্তি হোন</a>
                    <a href="#certificates" onclick="navigateView('certificates')" class="btn btn-primary"><i class="fa fa-certificate"></i> সার্টিফিকেট যাচাই</a>
                    <a href="#result" onclick="navigateView('result')" class="btn btn-outline"><i class="fa fa-trophy"></i> রেজাল্ট দেখুন</a>
                </div>
            </div>
            <div class="hero-slider">
                <div class="hero-slide active">
                    <img src="assets/img/slide1.jpg" alt="Dream Career IT Lab">
                    <div class="hero-slide-caption">Dream Career IT — আধুনিক মাল্টিমিডিয়া কম্পিউটার ল্যাব ও হাতে-কলমে প্রশিক্ষণ</div>
                </div>
                <div class="hero-slide">
                    <img src="assets/img/slide2.jpg" alt="Training">
                    <div class="hero-slide-caption">দক্ষ ও অভিজ্ঞ প্রশিক্ষকের তত্ত্বাবধানে শতভাগ প্র্যাকটিক্যাল ক্লাস</div>
                </div>
                <div class="hero-slide">
                    <img src="assets/img/slide3.jpg" alt="Students">
                    <div class="hero-slide-caption">কোর্স শেষে অনলাইন ভেরিফাইড সার্টিফিকেট ও ফ্রিল্যান্সিং গাইডলাইন</div>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="section-header">
                <span class="sub-badge">Our Courses</span>
                <h2>Dream Career IT-এর চলমান কোর্সসমূহ</h2>
                <p>আপনার পছন্দের কোর্সটি বেছে নিন এবং দক্ষতা অর্জন করে স্বাবলম্বী হোন</p>
            </div>
            <div class="grid-3">
                ${courses.map(c => `
                <div class="card">
                    <div class="course-thumb">
                        <img src="${esc(c.image)}" alt="${esc(c.title)}" loading="lazy">
                        <span class="course-fee-badge">৳ ${Number(c.fee).toLocaleString()}</span>
                        <span class="course-cert-badge">
                            <i class="fa ${Number(c.has_certificate) ? 'fa-certificate' : 'fa-info-circle'}"></i>
                            ${Number(c.has_certificate) ? 'সার্টিফিকেট প্রদান করা হয়' : 'বেসিক কোর্স (সার্টিফিকেট ছাড়া)'}
                        </span>
                    </div>
                    <div class="card-body">
                        <h3>${esc(c.title)}</h3>
                        <div class="title-bn">${esc(c.title_bn)}</div>
                        <div class="course-meta">
                            <span><i class="fa fa-calendar"></i> ${esc(c.duration)}</span>
                            <span><i class="fa fa-clock-o"></i> ${esc(c.class_duration)}</span>
                            <span><i class="fa fa-desktop"></i> ${Number(c.total_classes)} টি ক্লাস</span>
                        </div>
                        <p>${esc(c.description_bn || c.short_desc)}</p>
                        <div class="card-footer">
                            <button onclick="navigateView('courses', {slug:'${esc(c.slug)}'})" class="btn btn-primary btn-sm" style="flex:1;">
                                <i class="fa fa-list-ul"></i> সিলেবাস দেখুন
                            </button>
                            <button onclick="navigateView('admission', {course:'${esc(c.title)}'})" class="btn btn-accent btn-sm">
                                <i class="fa fa-pencil"></i> ভর্তি হোন
                            </button>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <section class="section section-alt">
        <div class="container">
            <div class="section-header">
                <span class="sub-badge">Our Facilities</span>
                <h2>আমাদের বিশেষ সুবিধাসমূহ</h2>
                <p>শিক্ষার্থীদের সর্বোচ্চ মানের প্রশিক্ষণ নিশ্চিত করতে আমাদের রয়েছে আধুনিক সকল সুবিধা</p>
            </div>
            <div class="grid-3">
                <div class="facility-card"><div class="facility-icon"><i class="fa fa-id-card-o"></i></div><h3>Professional Trainer</h3><p>দক্ষ, অভিজ্ঞ ও প্রফেশনাল ট্রেইনার এবং মেন্টর দ্বারা প্রতিটি ক্লাস পরিচালনা।</p></div>
                <div class="facility-card"><div class="facility-icon"><i class="fa fa-laptop"></i></div><h3>Modern Multimedia Lab</h3><p>প্রত্যেক শিক্ষার্থীর জন্য আলাদা কম্পিউটার ও মাল্টিমিডিয়া ল্যাব সুবিধা।</p></div>
                <div class="facility-card"><div class="facility-icon"><i class="fa fa-headphones"></i></div><h3>24/7 & Lifetime Support</h3><p>অনলাইন ও অফলাইনে সার্বক্ষণিক সাপোর্ট এবং আজীবন প্র্যাকটিস সুবিধা।</p></div>
                <div class="facility-card"><div class="facility-icon"><i class="fa fa-graduation-cap"></i></div><h3>Verified Certificate</h3><p>কোর্স শেষে বারকোড ও অনলাইন ভেরিফিকেশন যুক্ত প্রফেশনাল সার্টিফিকেট।</p></div>
                <div class="facility-card"><div class="facility-icon"><i class="fa fa-eye"></i></div><h3>Course Review & Backup</h3><p>আপডেটেড কারিকুলাম, লেকচার শিট এবং মিস হওয়া ক্লাসের জন্য ব্যাকআপ ক্লাস।</p></div>
                <div class="facility-card"><div class="facility-icon"><i class="fa fa-briefcase"></i></div><h3>Job & Freelancing Support</h3><p>চাকরি ও ফ্রিল্যান্সিং মার্কেটপ্লেসে কাজ পাওয়ার জন্য বিশেষ গাইডলাইন।</p></div>
            </div>
        </div>
    </section>
    `;
}

function renderCourses(main, slug = '') {
    const db = DCITStore.getDB();
    const courses = (db.courses || []).filter(c => c.status !== 'Inactive');
    const selected = slug ? courses.find(c => c.slug === slug) : courses[0];
    let topics = [];
    let syllabus = [];
    if (selected) {
        try { topics = typeof selected.topics_json === 'string' ? JSON.parse(selected.topics_json) : (selected.topics_json || []); } catch(e){}
        try { syllabus = typeof selected.syllabus_json === 'string' ? JSON.parse(selected.syllabus_json) : (selected.syllabus_json || []); } catch(e){}
    }

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:34px 0; text-align:center;">
        <div class="container">
            <h1>${selected ? esc(selected.title) : 'আমাদের সকল কোর্স ও সিলেবাস'}</h1>
            <p>${selected ? esc(selected.title_bn) : 'Dream Career IT - দক্ষ ট্রেইনারদের তত্ত্বাবধানে হাতে-কলমে প্রশিক্ষণ'}</p>
        </div>
    </div>
    <section class="section">
        <div class="container">
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:28px; justify-content:center;">
                ${courses.map(c => `
                    <button onclick="navigateView('courses', {slug:'${esc(c.slug)}'})" class="btn ${selected && selected.slug === c.slug ? 'btn-primary' : 'btn-outline'} btn-sm" style="${(!selected || selected.slug !== c.slug) ? 'color:#151442; border-color:#cbd5e1; background:#fff;' : ''}">
                        <i class="fa fa-book"></i> ${esc(c.title)} (৳${Number(c.fee)})
                    </button>
                `).join('')}
            </div>
            ${selected ? `
            <div class="card" style="margin-bottom:32px;">
                <div class="card-body" style="padding:28px;">
                    <div class="grid-2" style="align-items:center;">
                        <div>
                            <span class="badge ${Number(selected.has_certificate) ? 'badge-success' : 'badge-warning'}" style="margin-bottom:10px;">
                                ${Number(selected.has_certificate) ? 'সার্টিফিকেট প্রদান করা হয়' : 'বেসিক কোর্স (সার্টিফিকেট ছাড়া)'}
                            </span>
                            <h2 style="font-size:1.9rem; margin-bottom:6px;">${esc(selected.title)}</h2>
                            <h3 style="color:#0f766e; margin-bottom:12px;">${esc(selected.title_bn)} — কোর্স ফিঃ মাত্র ৳${Number(selected.fee).toLocaleString()} টাকা</h3>
                            <p style="margin-bottom:16px;">${esc(selected.description_bn || selected.short_desc)}</p>
                            <div class="course-meta">
                                <span><i class="fa fa-calendar"></i> <strong>মেয়াদ:</strong> ${esc(selected.duration)}</span>
                                <span><i class="fa fa-clock-o"></i> <strong>প্রতি ক্লাস:</strong> ${esc(selected.class_duration)}</span>
                                <span><i class="fa fa-laptop"></i> <strong>মোট ক্লাস:</strong> ${Number(selected.total_classes)} টি</span>
                            </div>
                            <div style="display:flex; gap:10px; margin-top:14px;">
                                <button onclick="navigateView('admission', {course:'${esc(selected.title)}'})" class="btn btn-accent"><i class="fa fa-user-plus"></i> এই কোর্সে ভর্তি হোন</button>
                                <button onclick="navigateView('batches')" class="btn btn-primary"><i class="fa fa-clock-o"></i> ক্লাস রুটিন দেখুন</button>
                            </div>
                        </div>
                        <div><img src="${esc(selected.image)}" alt="${esc(selected.title)}" style="border-radius:12px; width:100%; max-height:300px; object-fit:cover;"></div>
                    </div>
                </div>
            </div>
            ${topics.length ? `
            <h3 style="margin-bottom:14px;"><i class="fa fa-check-circle" style="color:#0f766e;"></i> কোর্সের প্রধান টপিকসমূহ</h3>
            <div class="grid-4" style="margin-bottom:32px;">
                ${topics.map(t => `<div style="background:#fff; padding:12px 16px; border-radius:10px; border:1px solid #e2e8f0; border-left:4px solid #0f766e; font-weight:600;">${esc(t)}</div>`).join('')}
            </div>` : ''}
            ${syllabus.length ? `
            <h3 style="margin-bottom:14px;"><i class="fa fa-book" style="color:#ea580c;"></i> বিস্তারিত ক্লাস সিলেবাস</h3>
            <div class="syllabus-grid">
                ${syllabus.map(m => `
                    <div class="syllabus-card">
                        <div class="sec-tag">${esc(m.section)}</div>
                        <h4>${esc(m.title)}</h4>
                        <ul>${(m.items || []).map(i => `<li>${esc(i)}</li>`).join('')}</ul>
                    </div>
                `).join('')}
            </div>` : ''}
            ` : ''}
        </div>
    </section>`;
}

function renderResult(main, params = {}) {
    const db = DCITStore.getDB();
    const regQ = (params.reg_no || '000001').trim();
    const found = (db.students || []).find(s => s.reg_no === regQ || s.roll_no === regQ || s.name.toLowerCase().includes(regQ.toLowerCase()));
    const cert = found ? (db.certificates || []).find(c => c.reg_no === found.reg_no) : null;

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:34px 0; text-align:center;">
        <div class="container">
            <h1>অনলাইন রেজাল্ট ও মার্কশিট</h1>
            <p>রেজিস্ট্রেশন নম্বর (যেমন: 000001) অথবা নাম দিয়ে ফলাফল যাচাই করুন</p>
        </div>
    </div>
    <section class="section">
        <div class="container" style="max-width:820px;">
            <div class="form-card" style="margin-bottom:24px;">
                <form onsubmit="event.preventDefault(); navigateView('result', {reg_no: document.getElementById('resRegInput').value});">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>রেজিস্ট্রেশন বা রোল নম্বর / নাম *</label>
                            <input type="text" id="resRegInput" class="form-control" value="${esc(regQ)}" required placeholder="যেমন: 000001">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary"><i class="fa fa-search"></i> ফলাফল দেখুন</button>
                </form>
            </div>
            ${found ? `
            <div class="form-card" style="border:2px solid #0f766e;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; border-bottom:1px dashed #cbd5e1; padding-bottom:14px; margin-bottom:16px;">
                    <div style="display:flex; align-items:center; gap:14px;">
                        <img src="${esc(found.photo || 'assets/img/logo.jpg')}" style="width:70px; height:70px; border-radius:50%; object-fit:cover; border:2px solid #0f766e;">
                        <div>
                            <h2>${esc(found.name)}</h2>
                            <p>Reg No: <strong>${esc(found.reg_no)}</strong> | Roll: <strong>${esc(found.roll_no)}</strong></p>
                        </div>
                    </div>
                    <span class="badge badge-success" style="font-size:1.1rem; padding:8px 16px;">Grade: ${esc(found.result_grade)} (GPA: ${esc(found.cgpa)})</span>
                </div>
                <table class="data-table" style="min-width:100%; margin-bottom:16px;">
                    <tbody>
                        <tr><th>পিতার নাম</th><td>${esc(found.father_name)}</td></tr>
                        <tr><th>মাতার নাম</th><td>${esc(found.mother_name)}</td></tr>
                        <tr><th>কোর্সের নাম</th><td><strong>${esc(found.course_name)}</strong></td></tr>
                        <tr><th>ব্যাচ ও সেশন</th><td>${esc(found.session_quarter)} - ${esc(found.batch_year)}</td></tr>
                        <tr><th>ক্লাস টাইম</th><td>${esc(found.class_slot)}</td></tr>
                    </tbody>
                </table>
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                    <button onclick="navigateView('biodata', {reg_no:'${esc(found.reg_no)}'})" class="btn btn-primary btn-sm"><i class="fa fa-id-card-o"></i> বায়োডাটা দেখুন</button>
                    ${cert ? `<button onclick="openCertificateModal('${esc(cert.cert_no)}')" class="btn btn-accent btn-sm"><i class="fa fa-certificate"></i> সার্টিফিকেট প্রিন্ট করুন</button>` : ''}
                </div>
            </div>` : `<div class="alert alert-danger">কোনো ফলাফল পাওয়া যায়নি! সঠিক রেজিস্ট্রেশন নম্বর (যেমন: 000001 থেকে 000006) দিন।</div>`}
        </div>
    </section>`;
}

function renderAdmission(main, preCourse = '') {
    const db = DCITStore.getDB();
    const courses = db.courses || [];
    const classes = db.classes || [];

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:34px 0; text-align:center;">
        <div class="container">
            <h1>অনলাইন ভর্তি ফর্ম (Online Admission)</h1>
            <p>Dream Career IT — ঘরে বসেই আপনার পছন্দের কোর্সে ভর্তি আবেদন সম্পন্ন করুন</p>
        </div>
    </div>
    <section class="section">
        <div class="container" style="max-width:880px;">
            <div id="admSuccessAlert"></div>
            <div class="form-card">
                <h3 style="margin-bottom:16px; color:#0f766e;"><i class="fa fa-graduation-cap"></i> শিক্ষার্থী ভর্তি আবেদন ফর্ম</h3>
                <form id="onlineAdmissionForm">
                    <div class="form-grid">
                        <div class="form-group"><label>শিক্ষার্থীর পূর্ণ নাম *</label><input type="text" name="full_name" class="form-control" required></div>
                        <div class="form-group"><label>পিতার নাম *</label><input type="text" name="father_name" class="form-control" required></div>
                        <div class="form-group"><label>মোবাইল নম্বর *</label><input type="tel" name="phone" class="form-control" required placeholder="017XXXXXXXX"></div>
                        <div class="form-group"><label>ইমেইল (ঐচ্ছিক)</label><input type="email" name="email" class="form-control"></div>
                        <div class="form-group">
                            <label>পছন্দের কোর্স *</label>
                            <select name="course_name" class="form-control">
                                ${courses.map(c => `<option value="${esc(c.title)}" ${preCourse === c.title ? 'selected' : ''}>${esc(c.title)} (৳${Number(c.fee)})</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>পছন্দের ক্লাস টাইম *</label>
                            <select name="preferred_slot" class="form-control">
                                ${classes.map(cl => `<option value="${esc(cl.time_label)}">${esc(cl.time_label)} (${esc(cl.batch_name)})</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group"><label>স্কুল / কলেজ / প্রতিষ্ঠান *</label><input type="text" name="school_college" class="form-control" required></div>
                        <div class="form-group">
                            <label>শিক্ষাগত যোগ্যতা</label>
                            <select name="education" class="form-control"><option>HSC</option><option>SSC</option><option>Honours / BA</option><option>Masters</option><option>JSC</option></select>
                        </div>
                        <div class="form-group"><label>জন্ম তারিখ *</label><input type="date" name="dob" class="form-control" required></div>
                        <div class="form-group"><label>পেমেন্ট মাধ্যম</label><select name="payment_method" class="form-control"><option>bKash (01771770044)</option><option>Nagad (01771770044)</option><option>Cash at Office</option></select></div>
                        <div class="form-group"><label>প্রদত্ত ভর্তি ফি (৳)</label><input type="number" name="paid_amount" class="form-control" value="500"></div>
                        <div class="form-group"><label>TrxID / রেফারেন্স</label><input type="text" name="trx_id" class="form-control" placeholder="TrxID"></div>
                        <div class="form-group" style="grid-column:1/-1;"><label>বর্তমান ঠিকানা *</label><input type="text" name="address" class="form-control" required></div>
                    </div>
                    <button type="submit" class="btn btn-primary"><i class="fa fa-paper-plane"></i> ভর্তি আবেদন জমা দিন</button>
                </form>
            </div>
        </div>
    </section>`;

    document.getElementById('onlineAdmissionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const fd = new FormData(this);
        const curDB = DCITStore.getDB();
        const appNo = 'REG-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
        curDB.admissions.unshift({
            id: Date.now(),
            application_no: appNo,
            full_name: fd.get('full_name'),
            father_name: fd.get('father_name'),
            email: fd.get('email'),
            phone: fd.get('phone'),
            address: fd.get('address'),
            school_college: fd.get('school_college'),
            religion: 'Muslim',
            education: fd.get('education'),
            course_name: fd.get('course_name'),
            preferred_slot: fd.get('preferred_slot'),
            session_quarter: 'January to March',
            batch_year: new Date().getFullYear(),
            dob: fd.get('dob'),
            payment_method: fd.get('payment_method'),
            trx_id: fd.get('trx_id') || 'ONLINE',
            paid_amount: parseFloat(fd.get('paid_amount')) || 0,
            status: 'Pending',
            created_at: new Date().toISOString().slice(0, 10)
        });
        DCITStore.saveDB(curDB);
        document.getElementById('admSuccessAlert').innerHTML = `
            <div class="alert alert-success">অভিনন্দন! আপনার ভর্তি আবেদন সফলভাবে জমা হয়েছে। আবেদন নম্বরঃ <strong>${appNo}</strong>। এডমিন প্যানেল থেকে এটি অনুমোদন করা যাবে।</div>
        `;
        this.reset();
    });
}

function renderBatches(main, params = {}) {
    const db = DCITStore.getDB();
    let list = db.students || [];
    if (params.type) list = list.filter(s => s.batch_type === params.type);
    if (params.slot) list = list.filter(s => s.class_slot === params.slot);
    const classes = db.classes || [];

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:34px 0; text-align:center;">
        <div class="container">
            <h1>সকল ব্যাচ ও ক্লাস রুটিন (Batches & Class Schedule)</h1>
            <p>সকাল ৮:০০ টা থেকে রাত ৮:৩০ টা পর্যন্ত ৭টি শিফটের রুটিন ও শিক্ষার্থী তালিকা</p>
        </div>
    </div>
    <section class="section">
        <div class="container">
            <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
                <button onclick="navigateView('batches')" class="btn btn-primary btn-sm">সকল ব্যাচ</button>
                <button onclick="navigateView('batches', {type:'New Batch'})" class="btn btn-outline btn-sm" style="color:#151442; border-color:#cbd5e1;">New Batch</button>
                <button onclick="navigateView('batches', {type:'Old Batch'})" class="btn btn-outline btn-sm" style="color:#151442; border-color:#cbd5e1;">Old Batch</button>
                ${classes.map(cl => `<button onclick="navigateView('batches', {slot:'${esc(cl.time_label)}'})" class="btn btn-outline btn-sm" style="color:#151442; border-color:#cbd5e1;">${esc(cl.time_label)}</button>`).join('')}
            </div>
            <div class="table-responsive" style="margin-bottom:40px;">
                <table class="data-table">
                    <thead><tr><th>SL</th><th>শিক্ষার্থীর নাম</th><th>রেজিঃ নং</th><th>রোল</th><th>কোর্স</th><th>সেশন ও সাল</th><th>ক্লাস টাইম</th><th>রেজাল্ট</th></tr></thead>
                    <tbody>
                        ${list.map((s, idx) => `
                        <tr>
                            <td>${String(idx+1).padStart(2,'0')}</td>
                            <td><a href="#biodata" onclick="navigateView('biodata', {reg_no:'${esc(s.reg_no)}'})" style="font-weight:700;">${esc(s.name)}</a></td>
                            <td>${esc(s.reg_no)}</td>
                            <td>${esc(s.roll_no)}</td>
                            <td>${esc(s.course_name)}</td>
                            <td>${esc(s.session_quarter)} (${esc(s.batch_year)})</td>
                            <td><span class="badge badge-info">${esc(s.class_slot)}</span></td>
                            <td><span class="badge badge-success">${esc(s.result_grade)}</span></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
            <div class="section-header"><h2>ক্লাস রুটিন ও নিয়মাবলী (Class Schedule)</h2></div>
            <div class="grid-3">
                ${classes.map(cl => `
                <div class="card"><div class="card-body">
                    <span class="badge badge-info" style="align-self:flex-start; margin-bottom:8px;">${esc(cl.time_label)}</span>
                    <h3>${esc(cl.batch_name)}</h3>
                    <div class="title-bn">${esc(cl.course_name)}</div>
                    <p><strong>শিক্ষক:</strong> ${esc(cl.teacher_name)}<br><strong>রুম:</strong> ${esc(cl.room_no)} | <strong>বার:</strong> ${esc(cl.days_of_week)}<br>${esc(cl.rules_text)}</p>
                </div></div>`).join('')}
            </div>
        </div>
    </section>`;
}

function renderBiodata(main, params = {}) {
    const db = DCITStore.getDB();
    let students = db.students || [];
    if (params.q) {
        const q = params.q.toLowerCase();
        students = students.filter(s => s.name.toLowerCase().includes(q) || s.reg_no.includes(q) || s.course_name.toLowerCase().includes(q));
    }
    const profile = params.reg_no ? (db.students || []).find(s => s.reg_no === params.reg_no) : null;

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:34px 0; text-align:center;">
        <div class="container">
            <h1>স্টুডেন্ট বায়োডাটা ডিরেক্টরি (Students Bio-Data)</h1>
            <p>শিক্ষার্থীদের বিস্তারিত পরিচয় ও বায়োডাটা দেখতে নামের ওপর ক্লিক করুন</p>
        </div>
    </div>
    <section class="section">
        <div class="container">
            ${profile ? `
            <div class="form-card" style="max-width:840px; margin:0 auto 32px; border-top:5px solid #0f766e;">
                <div style="display:flex; align-items:center; gap:18px; flex-wrap:wrap; margin-bottom:18px; border-bottom:1px solid #e2e8f0; padding-bottom:16px;">
                    <img src="${esc(profile.photo || 'assets/img/logo.jpg')}" style="width:110px; height:110px; border-radius:14px; object-fit:cover; border:3px solid #0f766e;">
                    <div>
                        <span class="badge badge-info">Reg No: ${esc(profile.reg_no)} | Roll: ${esc(profile.roll_no)}</span>
                        <h2 style="margin-top:6px;">${esc(profile.name)}</h2>
                        <p style="color:#0f766e; font-weight:700;">${esc(profile.course_name)} (${esc(profile.session_quarter)} - ${esc(profile.batch_year)})</p>
                    </div>
                </div>
                <div class="grid-2">
                    <div>
                        <p><strong>Father's Name:</strong> ${esc(profile.father_name)}</p>
                        <p><strong>Mother's Name:</strong> ${esc(profile.mother_name)}</p>
                        <p><strong>Present Address:</strong> ${esc(profile.present_address)}</p>
                        <p><strong>Phone:</strong> ${esc(profile.phone)}</p>
                        <p><strong>Email:</strong> ${esc(profile.email)}</p>
                    </div>
                    <div>
                        <p><strong>Date of Birth:</strong> ${esc(profile.dob)}</p>
                        <p><strong>Religion:</strong> ${esc(profile.religion)}</p>
                        <p><strong>Education:</strong> ${esc(profile.education)} (${esc(profile.school_college)})</p>
                        <p><strong>Class Slot:</strong> ${esc(profile.class_slot)}</p>
                        <p><strong>Result:</strong> <span class="badge badge-success">${esc(profile.result_grade)} (${esc(profile.cgpa)})</span></p>
                    </div>
                </div>
                <div style="margin-top:14px; padding:12px; background:#f8fafc; border-radius:8px;"><strong>Experience:</strong> ${esc(profile.experience)}</div>
            </div>` : ''}
            <div class="table-responsive">
                <table class="data-table">
                    <thead><tr><th>SL</th><th>ছবি</th><th>শিক্ষার্থীর নাম</th><th>Registration No</th><th>কোর্স</th><th>সেশন</th><th>অ্যাকশন</th></tr></thead>
                    <tbody>
                        ${students.map((s, idx) => `
                        <tr>
                            <td>${String(idx+1).padStart(2,'0')}</td>
                            <td><img src="${esc(s.photo || 'assets/img/logo.jpg')}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;"></td>
                            <td><a href="#biodata" onclick="navigateView('biodata', {reg_no:'${esc(s.reg_no)}'})" style="font-weight:700;">${esc(s.name)}</a></td>
                            <td><strong>${esc(s.reg_no)}</strong></td>
                            <td>${esc(s.course_name)}</td>
                            <td>${esc(s.session_quarter)} (${esc(s.batch_year)})</td>
                            <td><button onclick="navigateView('biodata', {reg_no:'${esc(s.reg_no)}'})" class="btn btn-primary btn-sm">বায়োডাটা দেখুন</button></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </section>`;
}

function renderCertificates(main, q = '') {
    const db = DCITStore.getDB();
    let certs = (db.certificates || []).filter(c => c.status === 'Issued');
    if (q) {
        const ql = q.toLowerCase();
        certs = certs.filter(c => c.reg_no.toLowerCase().includes(ql) || c.cert_no.toLowerCase().includes(ql) || c.student_name.toLowerCase().includes(ql));
    }

    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:34px 0; text-align:center;">
        <div class="container">
            <h1>সার্টিফিকেট ভেরিফিকেশন ও প্রিন্ট (Certificates)</h1>
            <p>রেজিস্ট্রেশন নম্বর বা সার্টিফিকেট নম্বর দিয়ে অনলাইনে সার্টিফিকেট যাচাই ও প্রিন্ট করুন</p>
        </div>
    </div>
    <section class="section">
        <div class="container">
            <div class="filter-bar">
                <div class="form-group" style="flex:1;">
                    <label>রেজিস্ট্রেশন নং / সার্টিফিকেট নং / নাম দিয়ে খুঁজুন</label>
                    <input type="text" id="certSearchBox" class="form-control" value="${esc(q)}" placeholder="যেমন: 000001 অথবা DCIT-2020-000001">
                </div>
                <button onclick="navigateView('certificates', {q: document.getElementById('certSearchBox').value})" class="btn btn-primary"><i class="fa fa-search"></i> যাচাই করুন</button>
            </div>
            <div class="table-responsive">
                <table class="data-table">
                    <thead><tr><th>SL</th><th>শিক্ষার্থীর নাম</th><th>Registration No</th><th>Certificate No</th><th>Course Name</th><th>Grade</th><th>অ্যাকশন</th></tr></thead>
                    <tbody>
                        ${certs.map((c, idx) => `
                        <tr>
                            <td>${String(idx+1).padStart(2,'0')}</td>
                            <td><strong>${esc(c.student_name)}</strong></td>
                            <td><strong>${esc(c.reg_no)}</strong></td>
                            <td>${esc(c.cert_no)}</td>
                            <td>${esc(c.course_name)}</td>
                            <td><span class="badge badge-success">${esc(c.grade)}</span></td>
                            <td><button onclick="openCertificateModal('${esc(c.cert_no)}')" class="btn btn-accent btn-sm"><i class="fa fa-print"></i> সার্টিফিকেট ভিউ / প্রিন্ট</button></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </section>`;
}

function openCertificateModal(certNo) {
    const db = DCITStore.getDB();
    const cert = (db.certificates || []).find(c => c.cert_no === certNo || c.reg_no === certNo);
    if (!cert) return;
    const main = document.getElementById('appMainContainer');
    main.innerHTML = `
    <section class="section">
        <div class="container" style="max-width:940px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:16px;">
                <button onclick="navigateView('certificates')" class="btn btn-outline btn-sm" style="color:#151442; border-color:#cbd5e1;">&larr; সার্টিফিকেট তালিকায় ফিরে যান</button>
                <button onclick="window.print()" class="btn btn-accent btn-sm"><i class="fa fa-print"></i> সার্টিফিকেট প্রিন্ট / PDF সেভ করুন</button>
            </div>
            <div style="border:8px solid #151442; padding:14px; background:#fff; border-radius:8px; box-shadow:var(--shadow-lg);">
                <div style="border:3px double #f59e0b; padding:32px; font-family:Georgia, serif;">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #151442; padding-bottom:14px; margin-bottom:20px;">
                        <img src="assets/img/logo.jpg" style="width:80px; height:80px; border-radius:50%; border:2px solid #151442;">
                        <div style="text-align:center; flex:1;">
                            <h1 style="margin:0; color:#151442; font-size:2rem; text-transform:uppercase;">DREAM CAREER IT</h1>
                            <p style="margin:4px 0 0; font-family:sans-serif; font-size:0.88rem;">Near New Poduar Bazar Mosque, Vai Vai Super Market, Poduar Bazar, Cumilla | Phone: 01771770044</p>
                        </div>
                        <div style="font-family:sans-serif; font-size:0.82rem; text-align:right;">
                            <strong>Cert No:</strong> ${esc(cert.cert_no)}<br>
                            <strong>Reg No:</strong> ${esc(cert.reg_no)}<br>
                            <strong>Date:</strong> ${esc(cert.issue_date)}
                        </div>
                    </div>
                    <div style="text-align:center; margin:16px 0 22px;">
                        <span style="background:#151442; color:#fde68a; padding:7px 26px; border-radius:30px; font-size:1.2rem; font-weight:bold; text-transform:uppercase;">Certificate of Completion</span>
                    </div>
                    <p style="font-size:1.12rem; line-height:1.95; text-align:justify;">
                        This is to certify that <strong style="color:#0f766e; font-size:1.25rem; border-bottom:1px dashed #0f766e;">${esc(cert.student_name)}</strong>,
                        son/daughter of <strong>${esc(cert.father_name || 'N/A')}</strong> and <strong>${esc(cert.mother_name || 'N/A')}</strong>,
                        bearing Registration No. <strong>${esc(cert.reg_no)}</strong>, has successfully completed the
                        <strong>${esc(cert.duration)}</strong> course on <strong style="color:#0f766e;">${esc(cert.course_name)}</strong>
                        held during <strong>${esc(cert.session_quarter)}, ${esc(cert.batch_year)}</strong> at <strong>Dream Career IT</strong> and secured Grade <strong>${esc(cert.grade)}</strong>.
                    </p>
                    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:42px; font-family:sans-serif; font-size:0.85rem;">
                        <div style="border-top:2px solid #151442; width:200px; text-align:center; padding-top:6px;"><strong>Jainal Abedin (Sagor)</strong><br>Course Instructor</div>
                        <div style="border:1px solid #cbd5e1; padding:6px 12px; border-radius:6px; text-align:center;">
                            <div style="background:repeating-linear-gradient(90deg,#000,#000 2px,#fff 2px,#fff 5px); height:26px; width:140px; margin:0 auto 4px;"></div>
                            <strong>VERIFIED: ${esc(cert.verification_code)}</strong>
                        </div>
                        <div style="border-top:2px solid #151442; width:200px; text-align:center; padding-top:6px;"><strong>DR. A.K.M Lokman</strong><br>Chief Administrator</div>
                    </div>
                </div>
            </div>
        </div>
    </section>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderTeachers(main) {
    const db = DCITStore.getDB();
    const teachers = db.teachers || [];
    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:34px 0; text-align:center;">
        <div class="container"><h1>শিক্ষক ও প্রশাসন (Teachers & Administration)</h1><p>Dream Career IT-এর অভিজ্ঞ প্রশিক্ষক এবং পরিচালনা পর্ষদ</p></div>
    </div>
    <section class="section"><div class="container"><div class="grid-2">
        ${teachers.map(t => `
        <div class="card" style="flex-direction:row; flex-wrap:wrap; align-items:center; padding:24px; gap:20px;">
            <img src="${esc(t.photo)}" style="width:150px; height:150px; border-radius:50%; object-fit:cover; border:4px solid #0f766e; margin:0 auto;">
            <div style="flex:1; min-width:240px;">
                <span class="badge badge-info">${esc(t.designation)}</span>
                <h2 style="margin:6px 0;">${esc(t.name)}</h2>
                <p style="color:#0f766e; font-weight:600; font-size:0.9rem; margin-bottom:8px;">${esc(t.qualification || '')}</p>
                <p style="font-size:0.9rem; margin-bottom:8px;">${esc(t.bio || '')}</p>
                <p style="font-size:0.88rem;"><strong>ফোন:</strong> ${esc(t.phone)} | <strong>ইমেইল:</strong> ${esc(t.email)}</p>
            </div>
        </div>`).join('')}
    </div></div></section>`;
}

function renderAbout(main) {
    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:34px 0; text-align:center;">
        <div class="container"><h1>আমাদের সম্পর্কে (About Dream Career IT)</h1><p>দক্ষ জনশক্তি ও ক্যারিয়ার গঠনের বিশ্বস্ত আইটি প্রশিক্ষণ কেন্দ্র</p></div>
    </div>
    <section class="section"><div class="container">
        <div class="grid-2" style="align-items:center; margin-bottom:36px;">
            <div>
                <h2>Dream Career IT</h2>
                <p style="margin:12px 0;">${esc(DCITStore.setting('about_intro'))}</p>
                <p><strong>ঠিকানা:</strong> ${esc(DCITStore.setting('address_bn'))}</p>
            </div>
            <div style="text-align:center;"><img src="assets/img/logo.jpg" style="width:220px; height:220px; border-radius:24px; margin:0 auto; box-shadow:var(--shadow-lg);"></div>
        </div>
        <div class="grid-2">
            <div class="card"><img src="assets/img/mission.jpg" style="height:200px; object-fit:cover;"><div class="card-body"><h3>Our Mission</h3><p>${esc(DCITStore.setting('mission_text'))}</p></div></div>
            <div class="card"><img src="assets/img/vision.jpg" style="height:200px; object-fit:cover;"><div class="card-body"><h3>Our Vision</h3><p>${esc(DCITStore.setting('vision_text'))}</p></div></div>
        </div>
    </div></section>`;
}

function renderContact(main) {
    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:34px 0; text-align:center;">
        <div class="container"><h1>যোগাযোগ করুন (Contact Us)</h1><p>ফোনঃ ${esc(DCITStore.setting('phone_1', '01771770044'))}</p></div>
    </div>
    <section class="section"><div class="container"><div class="grid-2">
        <div class="form-card">
            <div id="contactAlert"></div>
            <h3 style="margin-bottom:14px; color:#0f766e;">আমাদের মেসেজ পাঠান</h3>
            <form id="contactForm">
                <div class="form-group"><label>আপনার নাম *</label><input type="text" name="sender_name" class="form-control" required></div>
                <div class="form-group"><label>ইমেইল *</label><input type="email" name="sender_email" class="form-control" required></div>
                <div class="form-group"><label>মোবাইল নম্বর *</label><input type="tel" name="phone" class="form-control" required></div>
                <div class="form-group"><label>বিষয়</label><input type="text" name="subject" class="form-control" value="Course & Admission Inquiry"></div>
                <div class="form-group"><label>আপনার বার্তা *</label><textarea name="message" class="form-control" rows="4" required></textarea></div>
                <button type="submit" class="btn btn-primary"><i class="fa fa-paper-plane"></i> মেসেজ পাঠান</button>
            </form>
        </div>
        <div class="form-card">
            <h3 style="margin-bottom:12px; color:#0f766e;">Dream Career IT Office</h3>
            <p style="margin-bottom:12px;"><strong>ঠিকানা:</strong> ${esc(DCITStore.setting('address_bn'))}</p>
            <p style="margin-bottom:12px;"><strong>মোবাইল:</strong> <a href="tel:01771770044">01771770044</a>, 01879653143</p>
            <p style="margin-bottom:18px;"><strong>ইমেইল:</strong> dc13edubd@gmail.com</p>
            <div style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:24px; border-radius:12px; text-align:center;">
                <i class="fa fa-map-marker" style="font-size:2rem; color:#fbbf24; margin-bottom:8px;"></i>
                <h4>Dream Career IT — Poduar Bazar, Cumilla</h4>
                <p style="font-size:0.9rem; color:#e2e8f0; margin:8px 0 14px;">ভাই ভাই সুপার মার্কেট, নতুন পদুয়ার বাজার মসজিদের পাশে, পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা।</p>
                <a href="https://www.google.com/maps/search/?api=1&query=Poduar+Bazar+Bishwo+Road+Cumilla" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-sm">Google Maps-এ দেখুন</a>
            </div>
        </div>
    </div></div></section>`;

    document.getElementById('contactForm').addEventListener('submit', function(e) {
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
        document.getElementById('contactAlert').innerHTML = `<div class="alert alert-success">ধন্যবাদ! আপনার মেসেজটি এডমিন ইনবক্সে জমা হয়েছে।</div>`;
        this.reset();
    });
}

function renderDesigner(main) {
    main.innerHTML = `
    <div class="page-hero-strip" style="background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:34px 0; text-align:center;">
        <div class="container"><h1>Web Designer & Developer</h1><p>Jainal Abedin (Sagor)</p></div>
    </div>
    <section class="section"><div class="container" style="max-width:760px;">
        <div class="form-card" style="text-align:center;">
            <img src="assets/img/teacher-sagor.jpg" style="width:160px; height:160px; border-radius:50%; object-fit:cover; margin:0 auto 14px; border:4px solid #0f766e;">
            <h2>Jainal Abedin (Sagor)</h2>
            <p style="color:#0f766e; font-weight:700; margin-bottom:12px;">Junior Teacher & Full-Stack Web Designer at Dream Career IT</p>
            <p style="margin-bottom:14px;">Experienced in HTML5, CSS3, JavaScript, Bootstrap, PHP, and MySQL. Phone: 01879653143 | Email: gsctcbmcmrjas@gmail.com</p>
        </div>
    </div></section>`;
}

document.addEventListener('DOMContentLoaded', function() {
    navigateView('home');
});

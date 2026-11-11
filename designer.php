<?php
require_once __DIR__ . '/config/db.php';
$pdo = get_db();
$msg_sent = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['sender_name'] ?? '');
    $email = trim($_POST['sender_email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $subject = trim($_POST['subject'] ?? 'Web Design & Development Inquiry');
    $message = trim($_POST['message'] ?? '');
    if ($name !== '' && $message !== '') {
        $stmt = $pdo->prepare("INSERT INTO messages (sender_name, sender_email, phone, subject, message, target) VALUES (?, ?, ?, ?, ?, 'Designer')");
        $stmt->execute([$name, $email, $phone, $subject, $message]);
        $msg_sent = true;
    }
}

$page_title = 'ওয়েব ডিজাইনার ও ডেভেলপার প্রোফাইল (Web Designer Profile — Jainal Abedin)';
require_once __DIR__ . '/includes/header.php';
?>
<div class="page-hero-strip" style="background:linear-gradient(135deg,#151442 0%,#0f4c5c 55%,#0f766e 100%); color:#fff; padding:48px 0; text-align:center;">
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
        <?php if ($msg_sent): ?>
            <div class="alert alert-success">
                <i class="fa fa-check-circle"></i> ধন্যবাদ! আপনার মেসেজ সফলভাবে ওয়েব ডিজাইনারের কাছে প্রেরণ করা হয়েছে।
            </div>
        <?php endif; ?>

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
                    <a href="<?= h(setting('designer_fb', 'https://www.facebook.com/jainalabedin.sagor.143')) ?>" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm"><i class="fa fa-facebook"></i> Facebook</a>
                    <a href="<?= h(setting('designer_yt', 'https://www.youtube.com/channel/UCbYQ17l6_mf6ilwlJGvsFSg')) ?>" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-sm"><i class="fa fa-youtube"></i> YouTube</a>
                    <a href="<?= h(setting('designer_gh', 'https://github.com/jasagor2020')) ?>" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" style="color:#0f172a; border-color:#cbd5e1;"><i class="fa fa-github"></i> GitHub</a>
                    <a href="<?= h(setting('designer_li', 'https://www.linkedin.com/in/jainal-abedin-sagor-448b121a9/')) ?>" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="background:#151442;"><i class="fa fa-linkedin"></i> LinkedIn</a>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:24px;">
                <div class="form-card" style="border-top:5px solid #151442;">
                    <h3 style="margin-bottom:14px; color:#0f766e;"><i class="fa fa-paper-plane"></i> Contact With Designer (প্রজেক্ট বা তথ্যের জন্য মেসেজ দিন)</h3>
                    <form method="post">
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
                <a href="biodata.php?reg_no=000001" class="btn btn-outline btn-sm"><i class="fa fa-id-card-o"></i> ভেরিফাইড বায়োডাটা দেখুন</a>
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
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
<?php
$page_title = 'হোম (Home)';
require_once __DIR__ . '/includes/header.php';

$courses = $pdo->query("SELECT * FROM courses WHERE status='Active' ORDER BY sort_order ASC, id ASC")->fetchAll();
$classes = $pdo->query("SELECT * FROM classes WHERE status='Active' ORDER BY sort_order ASC, id ASC")->fetchAll();
$teachers = $pdo->query("SELECT * FROM teachers WHERE status='Active' ORDER BY sort_order ASC LIMIT 4")->fetchAll();
?>
<!-- Hero Section -->
<section class="hero-section">
    <div class="container hero-grid">
        <div class="hero-content">
            <span class="hero-badge"><i class="fa fa-star"></i> কুমিল্লার অন্যতম সেরা কারিগরি ও কম্পিউটার প্রশিক্ষণ কেন্দ্র</span>
            <h2><?= h(setting('site_name', 'AMADER GRAM')) ?> <span>IT CENTER</span></h2>
            <div class="hero-address">
                <i class="fa fa-map-marker" style="color:#fde68a;"></i>
                <?= h(setting('address_bn')) ?><br>
                <strong><i class="fa fa-phone" style="color:#5eead4;"></i> ফোনঃ <?= h(setting('phone_1')) ?>, <?= h(setting('phone_2')) ?></strong>
            </div>
            <div class="hero-actions">
                <a href="admission.php" class="btn btn-accent"><i class="fa fa-user-plus"></i> অনলাইনে ভর্তি হোন</a>
                <a href="certificates.php" class="btn btn-primary"><i class="fa fa-certificate"></i> সার্টিফিকেট যাচাই</a>
                <a href="result.php" class="btn btn-outline"><i class="fa fa-trophy"></i> রেজাল্ট দেখুন</a>
            </div>
        </div>

        <div class="hero-slider">
            <div class="hero-slide active">
                <img src="assets/img/slide1.jpg" alt="Amader Gram Computer Lab">
                <div class="hero-slide-caption">আধুনিক মাল্টিমিডিয়া কম্পিউটার ল্যাব ও হাতে-কলমে প্রশিক্ষণ</div>
            </div>
            <div class="hero-slide">
                <img src="assets/img/slide2.jpg" alt="Amader Gram Training">
                <div class="hero-slide-caption">দক্ষ ও অভিজ্ঞ প্রশিক্ষকের তত্ত্বাবধানে শতভাগ প্র্যাকটিক্যাল ক্লাস</div>
            </div>
            <div class="hero-slide">
                <img src="assets/img/slide3.jpg" alt="Amader Gram Students">
                <div class="hero-slide-caption">কোর্স শেষে অনলাইন ভেরিফাইড সার্টিফিকেট ও ফ্রিল্যান্সিং গাইডলাইন</div>
            </div>
            <div class="hero-slide">
                <img src="assets/img/slide4.jpg" alt="Amader Gram Success">
                <div class="hero-slide-caption">ডিজিটাল বাংলাদেশ গড়ার লক্ষ্যে দক্ষ জনশক্তি তৈরি</div>
            </div>
        </div>
    </div>
</section>

<!-- Dynamic Courses Section -->
<section class="section" id="courses">
    <div class="container">
        <div class="section-header">
            <span class="sub-badge">Our Courses</span>
            <h2>আমাদের চলমান কোর্সসমূহ</h2>
            <p>আপনার পছন্দের কোর্সটি বেছে নিন এবং দক্ষতা অর্জন করে স্বাবলম্বী হোন</p>
        </div>

        <div class="grid-3">
            <?php foreach ($courses as $c): ?>
            <div class="card">
                <div class="course-thumb">
                    <img src="<?= h($c['image']) ?>" alt="<?= h($c['title']) ?>" loading="lazy">
                    <span class="course-fee-badge">৳ <?= number_format((float)$c['fee'], 0) ?></span>
                    <span class="course-cert-badge">
                        <i class="fa <?= $c['has_certificate'] ? 'fa-certificate' : 'fa-info-circle' ?>"></i>
                        <?= $c['has_certificate'] ? 'সার্টিফিকেট প্রদান করা হয়' : 'বেসিক কোর্স (সার্টিফিকেট ছাড়া)' ?>
                    </span>
                </div>
                <div class="card-body">
                    <h3><?= h($c['title']) ?></h3>
                    <div class="title-bn"><?= h($c['title_bn']) ?></div>
                    <div class="course-meta">
                        <span><i class="fa fa-calendar"></i> <?= h($c['duration']) ?></span>
                        <span><i class="fa fa-clock-o"></i> <?= h($c['class_duration']) ?></span>
                        <span><i class="fa fa-desktop"></i> <?= (int)$c['total_classes'] ?> টি ক্লাস</span>
                    </div>
                    <p><?= h($c['description_bn'] ?: $c['short_desc']) ?></p>
                    <div class="card-footer">
                        <a href="course.php?slug=<?= urlencode($c['slug']) ?>" class="btn btn-primary btn-sm" style="flex:1;">
                            <i class="fa fa-list-ul"></i> সিলেবাস দেখুন
                        </a>
                        <a href="admission.php?course=<?= urlencode($c['title']) ?>" class="btn btn-accent btn-sm">
                            <i class="fa fa-pencil"></i> ভর্তি হোন
                        </a>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Our Facilities Section -->
<section class="section section-alt">
    <div class="container">
        <div class="section-header">
            <span class="sub-badge">Our Facilities</span>
            <h2>আমাদের বিশেষ সুবিধাসমূহ</h2>
            <p>শিক্ষার্থীদের সর্বোচ্চ মানের প্রশিক্ষণ নিশ্চিত করতে আমাদের রয়েছে আধুনিক সকল সুবিধা</p>
        </div>

        <div class="grid-3">
            <div class="facility-card">
                <div class="facility-icon"><i class="fa fa-id-card-o"></i></div>
                <h3>Professional Trainer</h3>
                <p>দক্ষ, অভিজ্ঞ ও প্রফেশনাল ট্রেইনার এবং মেন্টর দ্বারা প্রতিটি ক্লাস পরিচালনা।</p>
            </div>
            <div class="facility-card">
                <div class="facility-icon"><i class="fa fa-laptop"></i></div>
                <h3>Friendly Environment & Lab</h3>
                <p>প্রত্যেক শিক্ষার্থীর জন্য আলাদা কম্পিউটার ও মাল্টিমিডিয়া ল্যাব সুবিধা।</p>
            </div>
            <div class="facility-card">
                <div class="facility-icon"><i class="fa fa-headphones"></i></div>
                <h3>24/7 & Lifetime Support</h3>
                <p>অনলাইন ও অফলাইনে সার্বক্ষণিক সাপোর্ট এবং আজীবন প্র্যাকটিস সুবিধা।</p>
            </div>
            <div class="facility-card">
                <div class="facility-icon"><i class="fa fa-graduation-cap"></i></div>
                <h3>Verified Certificate</h3>
                <p>কোর্স শেষে বারকোড ও অনলাইন ভেরিফিকেশন যুক্ত প্রফেশনাল সার্টিফিকেট।</p>
            </div>
            <div class="facility-card">
                <div class="facility-icon"><i class="fa fa-eye"></i></div>
                <h3>Course Review & Backup Class</h3>
                <p>আপডেটেড কারিকুলাম, লেকচার শিট এবং মিস হওয়া ক্লাসের জন্য ব্যাকআপ ক্লাস।</p>
            </div>
            <div class="facility-card">
                <div class="facility-icon"><i class="fa fa-briefcase"></i></div>
                <h3>Job & Freelancing Support</h3>
                <p>চাকরি ও ফ্রিল্যান্সিং মার্কেটপ্লেসে কাজ পাওয়ার জন্য বিশেষ গাইডলাইন।</p>
            </div>
        </div>
    </div>
</section>

<!-- Class Schedule & Why Choose Us -->
<section class="section">
    <div class="container">
        <div class="why-choose-box">
            <h2 style="font-size:1.85rem; margin-bottom:8px; color:#5eead4;">Why did you choose us? (কেন আমাদের গ্রাম আইটি সেন্টার বেছে নিবেন?)</h2>
            <p style="color:#cbd5e1;">We are committed to serving our students to build their dreams. Taught in a very simple and practical way:</p>
            <ul class="why-list">
                <li><i class="fa fa-check-circle"></i> Multimedia computer lab with separate computer/laptop for each student.</li>
                <li><i class="fa fa-check-circle"></i> Skilled, experienced and professional trainers and mentors.</li>
                <li><i class="fa fa-check-circle"></i> Playing a helpful role in building a Digital Bangladesh.</li>
                <li><i class="fa fa-check-circle"></i> Standard and updated course curriculum and lecture sheets for each class.</li>
                <li><i class="fa fa-check-circle"></i> Regular theory, practical classes, and final evaluation exams.</li>
                <li><i class="fa fa-check-circle"></i> Official online-verifiable certificates with barcode/QR verification.</li>
                <li><i class="fa fa-check-circle"></i> Creating employment opportunities through job and freelancing support.</li>
                <li><i class="fa fa-check-circle"></i> 24/7 online & offline support and lifetime practice support.</li>
                <li><i class="fa fa-check-circle"></i> Safe, disciplined, and cordial environment for all students.</li>
            </ul>
        </div>

        <div class="stats-row">
            <div class="stat-box">
                <h3><?= h(setting('stat_experience', '11')) ?>+</h3>
                <p><i class="fa fa-briefcase"></i> Years Experience</p>
            </div>
            <div class="stat-box">
                <h3><?= h(setting('stat_team', '10')) ?>+</h3>
                <p><i class="fa fa-users"></i> Expert Team</p>
            </div>
            <div class="stat-box">
                <h3><?= h(setting('stat_courses', '21')) ?>+</h3>
                <p><i class="fa fa-book"></i> Training Modules</p>
            </div>
            <div class="stat-box">
                <h3><?= h(setting('stat_students', '20,785')) ?>+</h3>
                <p><i class="fa fa-graduation-cap"></i> Trained Students</p>
            </div>
        </div>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>

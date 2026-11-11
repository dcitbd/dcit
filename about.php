<?php
require_once __DIR__ . '/config/db.php';
$page_title = 'আমাদের সম্পর্কে (About Us)';
require_once __DIR__ . '/includes/header.php';
?>
<div class="page-hero-strip">
    <div class="container">
        <h1>ABOUT US (ড্রিম ক্যারিয়ার আইটি (Dream Career IT))</h1>
        <p>প্রযুক্তি ও কারিগরি শিক্ষায় দক্ষ মানবসম্পদ গড়ার বিশ্বস্ত প্রতিষ্ঠান</p>
    </div>
</div>

<section class="section">
    <div class="container">
        <div class="grid-2" style="align-items:center; margin-bottom:48px;">
            <div>
                <span class="badge badge-info" style="margin-bottom:8px;"><i class="fa fa-university"></i> Who We Are</span>
                <h2 style="font-size:2rem; color:#0f172a; margin-bottom:14px;"><?= h(setting('site_name', 'Dream Career IT')) ?> IT CENTER</h2>
                <p style="font-size:1.02rem; color:#334155; margin-bottom:16px;"><?= nl2br(h(setting('about_intro'))) ?></p>
                <p style="font-weight:600; color:#0f766e;"><i class="fa fa-map-marker"></i> <?= h(setting('address_bn')) ?></p>
            </div>
            <div style="text-align:center;">
                <img src="assets/img/logo.jpg" alt="Dream Career IT" style="width:240px; height:240px; margin:0 auto; border-radius:50%; border:6px solid #0f766e; box-shadow:var(--shadow-lg);">
            </div>
        </div>

        <div class="grid-2" style="margin-bottom:48px;">
            <div class="card">
                <img src="assets/img/mission.jpg" alt="Our Mission" style="height:220px; width:100%; object-fit:cover;">
                <div class="card-body">
                    <h3><i class="fa fa-telegram" style="color:#0f766e;"></i> Our Mission (আমাদের লক্ষ্য)</h3>
                    <p><?= h(setting('mission_text')) ?></p>
                </div>
            </div>
            <div class="card">
                <img src="assets/img/vision.jpg" alt="Our Vision" style="height:220px; width:100%; object-fit:cover;">
                <div class="card-body">
                    <h3><i class="fa fa-diamond" style="color:#ea580c;"></i> Our Vision (আমাদের ভিশন)</h3>
                    <p><?= h(setting('vision_text')) ?></p>
                </div>
            </div>
        </div>

        <div class="stats-row">
            <div class="stat-box">
                <h3><?= h(setting('stat_experience', '11')) ?></h3>
                <p><i class="fa fa-briefcase"></i> Years Experience</p>
            </div>
            <div class="stat-box">
                <h3><?= h(setting('stat_team', '10')) ?></h3>
                <p><i class="fa fa-users"></i> Team Members</p>
            </div>
            <div class="stat-box">
                <h3><?= h(setting('stat_courses', '21')) ?></h3>
                <p><i class="fa fa-book"></i> Courses</p>
            </div>
            <div class="stat-box">
                <h3><?= h(setting('stat_students', '20,785')) ?></h3>
                <p><i class="fa fa-street-view"></i> Students</p>
            </div>
        </div>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>

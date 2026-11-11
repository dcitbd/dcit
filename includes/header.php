<?php
require_once __DIR__ . '/../config/db.php';
$pdo = get_db();
$nav_courses = $pdo->query("SELECT slug, title, title_bn, fee FROM courses WHERE status='Active' ORDER BY sort_order ASC, id ASC")->fetchAll();
$nav_slots   = $pdo->query("SELECT slot_code, time_label FROM classes WHERE status='Active' ORDER BY sort_order ASC, id ASC")->fetchAll();
$curr_script = basename($_SERVER['PHP_SELF']);
$flash = get_flash();
?>
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico">
    <link rel="icon" type="image/png" sizes="64x64" href="assets/img/favicon.png">
    <link rel="apple-touch-icon" sizes="180x180" href="assets/img/apple-touch-icon.png">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= h($page_title ?? setting('site_name', 'Dream Career IT')) ?> | <?= h(setting('site_subtitle')) ?></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Dream Career IT (ড্রিম ক্যারিয়ার আইটি)">
    <meta property="og:title" content="Dream Career IT | ড্রিম ক্যারিয়ার আইটি — কুমিল্লা">
    <meta property="og:description" content="Microsoft Office, Advance Office, Graphic Design, Web Design, Spoken English ও IELTS প্রশিক্ষণ কেন্দ্র। ফোনঃ 01771770044।">
    <meta property="og:image" content="assets/img/logo.jpg">
</head>
<body>
<div id="dcitPreloader">
    <div class="loader-ring-wrap">
        <div class="loader-ring"></div>
        <div class="loader-ring-inner"></div>
        <img src="assets/img/logo.jpg" alt="Dream Career IT" class="loader-logo">
    </div>
    <div class="loader-title">DREAM CAREER IT</div>
    <div class="loader-sub">ড্রিম ক্যারিয়ার আইটি • লোড হচ্ছে...</div>
    <div class="loader-bar"><div class="loader-bar-fill"></div></div>
</div>
<!-- Top Contact & Social Bar -->
<div class="topbar">
    <div class="container topbar-inner">
        <div class="topbar-contact">
            <span><i class="fa fa-map-marker"></i> পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা</span>
            <a href="tel:<?= h(setting('phone_1')) ?>"><i class="fa fa-phone"></i> <?= h(setting('phone_1')) ?></a>
            <a href="mailto:<?= h(setting('email_1')) ?>"><i class="fa fa-envelope-o"></i> <?= h(setting('email_1')) ?></a>
        </div>
        <div class="topbar-social">
            <a href="<?= h(setting('facebook_url')) ?>" target="_blank" rel="noopener noreferrer" title="Facebook"><i class="fa fa-facebook"></i></a>
            <a href="<?= h(setting('designer_yt')) ?>" target="_blank" rel="noopener noreferrer" title="YouTube"><i class="fa fa-youtube"></i></a>
            <a href="<?= h(setting('designer_gh')) ?>" target="_blank" rel="noopener noreferrer" title="GitHub"><i class="fa fa-github"></i></a>
            <a href="<?= h(setting('designer_li')) ?>" target="_blank" rel="noopener noreferrer" title="LinkedIn"><i class="fa fa-linkedin"></i></a>
            <a href="auth.php" title="Student Sign In / Sign Up"><i class="fa fa-user"></i></a>
            <a href="admin/index.php" class="admin-btn" title="Admin Panel"><i class="fa fa-lock"></i> এডমিন প্যানেল</a>
        </div>
    </div>
</div>

<!-- Dynamic Notice Marquee -->
<div class="notice-bar">
    <div class="container notice-inner">
        <span class="notice-badge"><i class="fa fa-bullhorn"></i> নোটিশ</span>
        <div class="notice-marquee">
            <span><?= h(setting('notice_text')) ?></span>
        </div>
    </div>
</div>

<!-- Sticky Main Navigation -->
<header class="site-header">
    <div class="container nav-wrapper">
        <a href="index.php" class="brand">
            <img src="assets/img/logo.jpg" alt="Dream Career IT Logo">
            <div class="brand-text">
                <h1><?= h(setting('site_name', 'Dream Career IT')) ?></h1>
                <p>ড্রিম ক্যারিয়ার আইটি (Dream Career IT) • কুমিল্লা</p>
            </div>
        </a>

        <button class="menu-toggle" id="menuToggle" aria-label="Menu"><i class="fa fa-bars"></i></button>

        <nav class="main-nav" id="mainNav">
            <ul>
                <li><a href="index.php" class="<?= $curr_script === 'index.php' ? 'active' : '' ?>"><i class="fa fa-home"></i> হোম</a></li>
                <li>
                    <a href="course.php" class="<?= $curr_script === 'course.php' ? 'active' : '' ?>">
                        <i class="fa fa-book"></i> কোর্সসমূহ <i class="fa fa-angle-down"></i>
                    </a>
                    <ul class="dropdown-menu">
                        <?php foreach ($nav_courses as $nc): ?>
                            <li>
                                <a href="course.php?slug=<?= urlencode($nc['slug']) ?>">
                                    <span><?= h($nc['title']) ?></span>
                                    <small style="color:#ea580c; font-weight:700;">৳<?= (float)$nc['fee'] ?></small>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </li>
                <li><a href="result.php" class="<?= $curr_script === 'result.php' ? 'active' : '' ?>"><i class="fa fa-trophy"></i> রেজাল্ট</a></li>
                <li>
                    <a href="admission.php" class="<?= in_array($curr_script, ['admission.php', 'batches.php', 'biodata.php', 'certificates.php']) ? 'active' : '' ?>">
                        <i class="fa fa-graduation-cap"></i> ভর্তি ও ব্যাচ <i class="fa fa-angle-down"></i>
                    </a>
                    <ul class="dropdown-menu">
                        <li><a href="admission.php"><span><i class="fa fa-pencil-square-o"></i> অনলাইন ভর্তি (Online Admission)</span></a></li>
                        <li><a href="batches.php?type=New+Batch"><span><i class="fa fa-users"></i> নতুন ব্যাচ (New Batch)</span></a></li>
                        <li><a href="batches.php?type=Old+Batch"><span><i class="fa fa-history"></i> পুরাতন ব্যাচ (2010 - <?= date('Y') ?>)</span></a></li>
                        <li><a href="batches.php#class-rules"><span><i class="fa fa-clock-o"></i> ক্লাস রুটিন ও সময়সূচি</span></a></li>
                        <li><a href="biodata.php"><span><i class="fa fa-id-card-o"></i> স্টুডেন্ট বায়োডাটা (Bio-Data)</span></a></li>
                        <li><a href="certificates.php"><span><i class="fa fa-certificate"></i> সার্টিফিকেট ভেরিফিকেশন</span></a></li>
                    </ul>
                </li>
                <li><a href="certificates.php" class="<?= $curr_script === 'certificates.php' ? 'active' : '' ?>"><i class="fa fa-certificate"></i> সার্টিফিকেট</a></li>
                <li><a href="teachers.php" class="<?= $curr_script === 'teachers.php' ? 'active' : '' ?>"><i class="fa fa-user-md"></i> শিক্ষকবৃন্দ</a></li>
                <li><a href="about.php" class="<?= $curr_script === 'about.php' ? 'active' : '' ?>"><i class="fa fa-info-circle"></i> আমাদের সম্পর্কে</a></li>
                <li><a href="contact.php" class="<?= $curr_script === 'contact.php' ? 'active' : '' ?>"><i class="fa fa-phone"></i> যোগাযোগ</a></li>
            </ul>
        </nav>

        <form action="biodata.php" method="get" class="header-search">
            <input type="search" name="q" placeholder="স্টুডেন্ট / রেজিঃ নং..." required>
            <button type="submit" title="Search"><i class="fa fa-search"></i></button>
        </form>
    </div>
</header>

<?php if ($flash): ?>
<div class="container" style="margin-top:18px;">
    <div class="alert alert-<?= h($flash['type']) ?>"><?= h($flash['msg']) ?></div>
</div>
<?php endif; ?>

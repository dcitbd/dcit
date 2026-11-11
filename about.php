<?php
// পেজ টাইটেল ও অ্যাক্টিভ মেনু ভ্যারিয়েবল (প্রজেক্টের header.php এর সাথে সামঞ্জস্যপূর্ণ)
$pageTitle = "আমাদের সম্পর্কে (About Us) | Dream Career IT";
$currentPage = "about";

// প্রজেক্টে includes/header.php থাকলে লোড হবে, না থাকলে স্ট্যান্ডঅ্যালোন হেডার কাজ করবে
$hasHeader = file_exists(__DIR__ . '/includes/header.php');
if ($hasHeader) {
    include __DIR__ . '/includes/header.php';
} else {
?>
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle; ?></title>
    <!-- Google Fonts (Hind Siliguri & Inter) -->
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Bootstrap 5.3 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome 6 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- মেইন স্টাইলশিট থাকলে যুক্ত হবে -->
    <?php if (file_exists(__DIR__ . '/assets/css/style.css')): ?>
        <link rel="stylesheet" href="assets/css/style.css">
    <?php endif; ?>
<?php } ?>

<!-- আমাদের সম্পর্কে পেজের কাস্টম প্রিমিয়াম CSS -->
<style>
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
        font-family: 'SolaimanLipi', 'Hind Siliguri', 'Inter', sans-serif;
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

<?php if (!$hasHeader): ?>
</head>
<body>
<!-- স্ট্যান্ডঅ্যালোন ন্যাভবার -->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark py-3 border-bottom border-secondary border-opacity-25">
    <div class="container">
        <a class="navbar-brand fw-bold d-flex align-items-center gap-2" href="index.php">
            <i class="fa-solid fa-graduation-cap text-primary"></i> Dream Career IT
        </a>
        <div class="ms-auto d-flex gap-2">
            <a href="index.php" class="btn btn-outline-light btn-sm"><i class="fa-solid fa-house me-1"></i> হোমপেজ</a>
            <a href="course.php" class="btn btn-primary btn-sm"><i class="fa-solid fa-laptop-code me-1"></i> সকল কোর্স</a>
        </div>
    </div>
</nav>
<?php endif; ?>

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
                        <a href="course.php" class="btn btn-sm btn-outline-light rounded-pill px-3">কোর্সসমূহ[cite: 1]</a>
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
                        <?php if (file_exists(__DIR__ . '/assets/img/vision.jpg')): ?>
                            <img src="assets/img/vision.jpg" alt="Our Vision - Dream Career IT">
                        <?php else: ?>
                            <div class="w-100 h-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #1e3a8a, #2563eb);">
                                <i class="fa-solid fa-eye text-white opacity-25" style="font-size: 4.5rem;"></i>
                            </div>
                        <?php endif; ?>
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
                        <?php if (file_exists(__DIR__ . '/assets/img/mission.jpg')): ?>
                            <img src="assets/img/mission.jpg" alt="Our Mission - Dream Career IT">
                        <?php else: ?>
                            <div class="w-100 h-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #065f46, #059669);">
                                <i class="fa-solid fa-bullseye text-white opacity-25" style="font-size: 4.5rem;"></i>
                            </div>
                        <?php endif; ?>
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
                    <a href="admission.php" class="btn btn-primary btn-sm rounded-pill px-4 py-2 fw-semibold">
                        <i class="fa-solid fa-user-plus me-1"></i> ভর্তি আবেদন করুন[cite: 1]
                    </a>
                    <a href="contact.php" class="btn btn-outline-light btn-sm rounded-pill px-4 py-2">
                        <i class="fa-solid fa-paper-plane me-1"></i> যোগাযোগ পেজ[cite: 1]
                    </a>
                </div>
            </div>
        </div>
    </section>
</div>

<?php
// প্রজেক্টের ফুটার থাকলে লোড হবে, না থাকলে স্ট্যান্ডঅ্যালোন ফুটার দেখাবে
if (file_exists(__DIR__ . '/includes/footer.php')) {
    include __DIR__ . '/includes/footer.php';
} else {
?>
<footer class="bg-dark text-light py-4 text-center border-top border-secondary border-opacity-25">
    <div class="container small opacity-75">
        &copy; <?php echo date('Y'); ?> <strong>Dream Career IT</strong>. সর্বস্বত্ব সংরক্ষিত।
    </div>
</footer>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
<?php } ?>
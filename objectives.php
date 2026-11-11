<?php
// পেজ টাইটেল ও অ্যাক্টিভ মেনু ভ্যারিয়েবল (প্রজেক্টের header.php এর সাথে সামঞ্জস্যপূর্ণ)
$pageTitle = "আমাদের উদ্দেশ্য, লক্ষ্য ও মিশন (Our Objectives) | Dream Career IT";
$currentPage = "objectives";

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

<!-- আমাদের উদ্দেশ্য পেজের কাস্টম প্রিমিয়াম CSS -->
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

    .objectives-wrapper {
        font-family: 'SolaimanLipi', 'Hind Siliguri', 'Inter', sans-serif;
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
                        <?php if (file_exists(__DIR__ . '/assets/img/vision.jpg')): ?>
                            <img src="assets/img/vision.jpg" alt="Our Vision - Dream Career IT">
                        <?php else: ?>
                            <div class="w-100 h-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #1e3a8a, #3b82f6);">
                                <i class="fa-solid fa-eye text-white opacity-25" style="font-size: 5rem;"></i>
                            </div>
                        <?php endif; ?>
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
                        <?php if (file_exists(__DIR__ . '/assets/img/mission.jpg')): ?>
                            <img src="assets/img/mission.jpg" alt="Our Mission - Dream Career IT">
                        <?php else: ?>
                            <div class="w-100 h-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #065f46, #10b981);">
                                <i class="fa-solid fa-flag-checkered text-white opacity-25" style="font-size: 5rem;"></i>
                            </div>
                        <?php endif; ?>
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
                            <a href="admission.php" class="btn btn-primary fw-semibold rounded-pill py-2">
                                <i class="fa-solid fa-paper-plane me-1"></i> অনলাইন ভর্তি আবেদন
                            </a>
                            <a href="course.php" class="btn btn-outline-light btn-sm rounded-pill py-2">
                                <i class="fa-solid fa-book-open me-1"></i> আমাদের কোর্সসমূহ দেখুন
                            </a>
                        </div>
                    </div>
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
<?php
// পেজ টাইটেল ও মেটা ডাটা (প্রজেক্টের header.php এর সাথে সামঞ্জস্যপূর্ণ)
$pageTitle = "প্রাতিষ্ঠানিক বৈধতা ও স্বচ্ছতা | Dream Career IT";
$currentPage = "legitimacy";

// যদি আপনার প্রজেক্টে includes/header.php থাকে, তবে অটোমেটিক লোড হবে, না থাকলে নিচের স্ট্যান্ডার্ড হেডার কাজ করবে
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

<!-- প্রাতিষ্ঠানিক বৈধতা পেজের কাস্টম প্রিমিয়াম স্টাইল -->
<style>
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

<?php if (!$hasHeader): ?>
</head>
<body>
<!-- স্ট্যান্ডঅ্যালোন ভিউয়ের জন্য টপ ন্যাভবার -->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark py-3 no-print border-bottom border-secondary border-opacity-25">
    <div class="container">
        <a class="navbar-brand fw-bold d-flex align-items-center gap-2" href="index.php">
            <i class="fa-solid fa-graduation-cap text-primary"></i> Dream Career IT
        </a>
        <div class="ms-auto d-flex gap-2">
            <a href="index.php" class="btn btn-outline-light btn-sm"><i class="fa-solid fa-house me-1"></i> হোমপেজ</a>
            <a href="certificates.php" class="btn btn-primary btn-sm"><i class="fa-solid fa-certificate me-1"></i> সার্টিফিকেট যাচাই</a>
        </div>
    </div>
</nav>
<?php endif; ?>

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
                        <li><a href="#sec-1" class="active"><span class="toc-num">১</span> প্রতিষ্ঠানের পরিচিতি[cite: 1]</a></li>
                        <li><a href="#sec-2"><span class="toc-num">২</span> আইনগত অবস্থান[cite: 1]</a></li>
                        <li><a href="#sec-3"><span class="toc-num">৩</span> নিবন্ধন ও অনুমোদন[cite: 1]</a></li>
                        <li><a href="#sec-4"><span class="toc-num">৪</span> প্রশাসনিক কাঠামো[cite: 1]</a></li>
                        <li><a href="#sec-5"><span class="toc-num">৫</span> শিক্ষা ও প্রশিক্ষণ কার্যক্রম[cite: 1]</a></li>
                        <li><a href="#sec-6"><span class="toc-num">৬</span> সার্টিফিকেটের সত্যতা যাচাই[cite: 1]</a></li>
                        <li><a href="#sec-7"><span class="toc-num">৭</span> আর্থিক ও প্রশাসনিক স্বচ্ছতা[cite: 1]</a></li>
                        <li><a href="#sec-8"><span class="toc-num">৮</span> শিক্ষার্থী ও অভিভাবকদের অধিকার[cite: 1]</a></li>
                        <li><a href="#sec-9"><span class="toc-num">৯</span> অভিযোগ ও তথ্য যাচাই[cite: 1]</a></li>
                        <li><a href="#sec-10"><span class="toc-num">১০</span> আমাদের অঙ্গীকার ও যোগাযোগ[cite: 1]</a></li>
                    </ul>

                    <div class="mt-4 pt-3 border-top text-center no-print">
                        <p class="small text-muted mb-2">অনলাইনে সনদ যাচাই করতে চান?[cite: 1]</p>
                        <a href="certificates.php" class="btn btn-primary w-100 btn-sm fw-semibold py-2 rounded-3">
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
                        <a href="teachers.php" class="btn btn-outline-primary btn-sm rounded-pill px-3">
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
                        <a href="course.php" class="btn btn-primary btn-sm rounded-pill px-3 no-print">সকল কোর্স দেখুন[cite: 1]</a>
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
                        <a href="certificates.php" class="btn btn-success fw-semibold px-4 rounded-pill no-print">
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
                            <i class="fa-regular fa-clock me-1"></i> সর্বশেষ হালনাগাদ: <strong>১২ নভেম্বর, ২০২৬</strong> (<?php echo date('d M, Y'); ?>)
                        </div>
                        <div class="no-print">
                            <a href="contact.php" class="btn btn-sm btn-info fw-semibold rounded-pill px-3">
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

<?php
// প্রজেক্টের ফুটার থাকলে লোড হবে, না থাকলে ডিফল্ট ফুটার ব্যবহৃত হবে
if (file_exists(__DIR__ . '/includes/footer.php')) {
    include __DIR__ . '/includes/footer.php';
} else {
?>
<footer class="bg-dark text-light py-4 text-center border-top border-secondary border-opacity-25 no-print">
    <div class="container small opacity-75">
        &copy; <?php echo date('Y'); ?> <strong>Dream Career IT</strong>. সর্বস্বত্ব সংরক্ষিত।
    </div>
</footer>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
<?php } ?>
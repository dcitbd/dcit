<?php
// পেজ টাইটেল ও অ্যাক্টিভ মেনু ভ্যারিয়েবল (প্রজেক্টের header.php এর সাথে সামঞ্জস্যপূর্ণ)
$pageTitle = "শর্তাবলি ও নিয়মনীতি (Terms & Conditions) | Dream Career IT";
$currentPage = "terms";

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

<!-- শর্তাবলি ও নিয়মনীতি পেজের কাস্টম প্রিমিয়াম CSS -->
<style>
    :root {
        --dcit-navy: #0f172a;
        --dcit-blue-dark: #1e3a8a;
        --dcit-primary: #2563eb;
        --dcit-primary-soft: #eff6ff;
        --dcit-emerald: #059669;
        --dcit-emerald-soft: #ecfdf5;
        --dcit-amber: #d97706;
        --dcit-amber-soft: #fffbeb;
        --dcit-danger: #dc2626;
        --dcit-danger-soft: #fef2f2;
        --dcit-text: #334155;
        --dcit-muted: #64748b;
        --dcit-border: #e2e8f0;
        --dcit-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.06);
        --dcit-shadow-hover: 0 20px 35px -5px rgba(37, 99, 235, 0.12);
    }

    .terms-wrapper {
        font-family: 'SolaimanLipi', 'Hind Siliguri', 'Inter', sans-serif;
        background-color: #f8fafc;
        color: var(--dcit-text);
        line-height: 1.75;
        padding-bottom: 5rem;
    }

    /* হিরো ব্যানার */
    .terms-hero {
        background: linear-gradient(135deg, var(--dcit-navy) 0%, var(--dcit-blue-dark) 60%, var(--dcit-primary) 100%);
        color: #ffffff;
        padding: 4.5rem 0 5.5rem;
        position: relative;
        overflow: hidden;
    }

    .terms-hero::after {
        content: "";
        position: absolute;
        bottom: -30%;
        left: -10%;
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(255,255,255,0) 70%);
        border-radius: 50%;
    }

    .hero-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.22);
        backdrop-filter: blur(8px);
        padding: 0.45rem 1.15rem;
        border-radius: 50px;
        font-size: 0.9rem;
        color: #e0f2fe;
        margin-bottom: 1.2rem;
    }

    .terms-hero h1 {
        font-weight: 700;
        font-size: 2.5rem;
        margin-bottom: 0.4rem;
    }

    .terms-hero .en-sub {
        font-family: 'Inter', sans-serif;
        font-size: 1.05rem;
        color: #93c5fd;
        font-weight: 500;
        margin-bottom: 1.25rem;
    }

    /* ইন্ট্রো ও সম্মতি ব্যানার */
    .consent-banner-wrap {
        margin-top: -3.2rem;
        position: relative;
        z-index: 10;
        margin-bottom: 2.75rem;
    }

    .consent-card {
        background: #ffffff;
        border-radius: 18px;
        border: 1px solid var(--dcit-border);
        box-shadow: var(--dcit-shadow);
        padding: 1.75rem 2rem;
    }

    /* স্টিকি সাইডবার ন্যাভিগেশন */
    .terms-toc {
        position: sticky;
        top: 20px;
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid var(--dcit-border);
        box-shadow: var(--dcit-shadow);
        padding: 1.35rem;
        max-height: calc(100vh - 40px);
        display: flex;
        flex-direction: column;
    }

    .terms-toc-header {
        font-size: 1rem;
        font-weight: 700;
        color: var(--dcit-navy);
        padding-bottom: 0.75rem;
        margin-bottom: 0.75rem;
        border-bottom: 2px solid #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .terms-toc-list {
        list-style: none;
        padding: 0;
        margin: 0;
        overflow-y: auto;
        padding-right: 4px;
    }

    .terms-toc-list::-webkit-scrollbar {
        width: 5px;
    }

    .terms-toc-list::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 10px;
    }

    .terms-toc-list li {
        margin-bottom: 0.25rem;
    }

    .terms-toc-list a {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.45rem 0.75rem;
        border-radius: 9px;
        color: var(--dcit-text);
        text-decoration: none;
        font-size: 0.88rem;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .terms-toc-list a:hover,
    .terms-toc-list a.active {
        background-color: var(--dcit-primary-soft);
        color: var(--dcit-primary);
        font-weight: 600;
    }

    .toc-badge {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        background: #f1f5f9;
        color: var(--dcit-muted);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 700;
        flex-shrink: 0;
    }

    .terms-toc-list a:hover .toc-badge,
    .terms-toc-list a.active .toc-badge {
        background: var(--dcit-primary);
        color: #ffffff;
    }

    /* শর্তাবলি কার্ড */
    .term-section-card {
        background: #ffffff;
        border-radius: 18px;
        border: 1px solid var(--dcit-border);
        box-shadow: var(--dcit-shadow);
        padding: 2.15rem;
        margin-bottom: 1.75rem;
        transition: box-shadow 0.3s ease, border-color 0.3s ease;
        scroll-margin-top: 24px;
    }

    .term-section-card:hover {
        box-shadow: var(--dcit-shadow-hover);
        border-color: #cbd5e1;
    }

    .term-card-head {
        display: flex;
        align-items: flex-start;
        gap: 1.1rem;
        margin-bottom: 1.35rem;
        padding-bottom: 1.1rem;
        border-bottom: 1px solid #f1f5f9;
    }

    .term-icon-box {
        width: 52px;
        height: 52px;
        border-radius: 14px;
        background: linear-gradient(135deg, var(--dcit-primary-soft), #dbeafe);
        color: var(--dcit-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.35rem;
        flex-shrink: 0;
        border: 1px solid #bfdbfe;
    }

    .term-title-bn {
        font-size: 1.35rem;
        font-weight: 700;
        color: var(--dcit-navy);
        margin-bottom: 0.15rem;
    }

    .term-title-en {
        font-family: 'Inter', sans-serif;
        font-size: 0.82rem;
        font-weight: 600;
        color: var(--dcit-muted);
        text-transform: uppercase;
        letter-spacing: 0.6px;
    }

    /* লিস্ট স্টাইল */
    .term-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .term-list li {
        display: flex;
        align-items: flex-start;
        gap: 0.85rem;
        padding: 0.7rem 1rem;
        border-radius: 10px;
        background: #f8fafc;
        border: 1px solid #f1f5f9;
        margin-bottom: 0.55rem;
        font-weight: 500;
        color: var(--dcit-navy);
    }

    .term-list li i {
        margin-top: 0.35rem;
        font-size: 1rem;
        flex-shrink: 0;
    }

    .num-pill {
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

    /* নোট ও ওয়ার্নিং বক্স */
    .note-callout {
        background: var(--dcit-amber-soft);
        border-left: 4px solid var(--dcit-amber);
        border-radius: 0 12px 12px 0;
        padding: 1.1rem 1.35rem;
        margin-top: 1.25rem;
        display: flex;
        align-items: flex-start;
        gap: 0.85rem;
    }

    .danger-callout {
        background: var(--dcit-danger-soft);
        border-left: 4px solid var(--dcit-danger);
        border-radius: 0 12px 12px 0;
        padding: 1.1rem 1.35rem;
        margin-top: 1.25rem;
        display: flex;
        align-items: flex-start;
        gap: 0.85rem;
    }

    /* ফুটার যোগাযোগ কার্ড */
    .terms-contact-card {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: #ffffff;
        border-radius: 20px;
        padding: 2.5rem;
        position: relative;
        overflow: hidden;
    }

    .contact-glass-box {
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 14px;
        padding: 1.2rem 1.35rem;
        height: 100%;
    }

    @media (max-width: 991.98px) {
        .terms-hero h1 { font-size: 1.95rem; }
        .term-section-card { padding: 1.5rem; }
        .terms-toc { position: static; max-height: none; margin-bottom: 2rem; }
    }

    @media print {
        .terms-toc, .no-print { display: none !important; }
        .term-section-card { break-inside: avoid; box-shadow: none; border: 1px solid #000; }
    }
</style>

<?php if (!$hasHeader): ?>
</head>
<body>
<!-- স্ট্যান্ডঅ্যালোন ন্যাভবার -->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark py-3 no-print border-bottom border-secondary border-opacity-25">
    <div class="container">
        <a class="navbar-brand fw-bold d-flex align-items-center gap-2" href="index.php">
            <i class="fa-solid fa-graduation-cap text-primary"></i> Dream Career IT
        </a>
        <div class="ms-auto d-flex gap-2">
            <a href="index.php" class="btn btn-outline-light btn-sm"><i class="fa-solid fa-house me-1"></i> হোমপেজ</a>
            <a href="admission.php" class="btn btn-primary btn-sm"><i class="fa-solid fa-user-plus me-1"></i> অনলাইন ভর্তি</a>
        </div>
    </div>
</nav>
<?php endif; ?>

<div class="terms-wrapper">
    <!-- হিরো সেকশন -->
    <section class="terms-hero">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-8">
                    <div class="hero-pill">
                        <i class="fa-solid fa-file-contract text-info"></i>
                        <span>সর্বশেষ হালনাগাদ: ১২ নভেম্বর ২০২৬</span>
                    </div>
                    <h1>শর্তাবলি ও নিয়মনীতি</h1>
                    <div class="en-sub">Terms &amp; Conditions — Dream Career IT</div>
                    <p class="text-light opacity-75 mb-0 fs-6" style="max-width: 720px;">
                        Dream Career IT-এর ওয়েবসাইটে আপনাকে স্বাগতম। আমাদের ওয়েবসাইট ব্যবহার, কোর্স সম্পর্কে তথ্য গ্রহণ, অনলাইন আবেদন, ভর্তি, প্রশিক্ষণ গ্রহণ এবং সংশ্লিষ্ট সেবা ব্যবহারের ক্ষেত্রে নিচে উল্লেখিত শর্তাবলি ও নিয়মনীতি প্রযোজ্য হবে।
                    </p>
                </div>
                <div class="col-lg-4 text-lg-end mt-4 mt-lg-0 no-print">
                    <button onclick="window.print()" class="btn btn-light fw-semibold px-4 py-2 rounded-pill shadow-sm">
                        <i class="fa-solid fa-print me-2 text-primary"></i> শর্তাবলি প্রিন্ট করুন
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- সম্মতি ও প্রাথমিক ঘোষণা কার্ড -->
    <div class="container consent-banner-wrap">
        <div class="consent-card">
            <div class="row align-items-center g-3">
                <div class="col-md-9">
                    <div class="d-flex align-items-start gap-3">
                        <div class="p-3 rounded-3 bg-primary bg-opacity-10 text-primary fs-4 flex-shrink-0">
                            <i class="fa-solid fa-Handshake-angle"></i>
                        </div>
                        <div>
                            <h5 class="fw-bold text-dark mb-1">ব্যবহারকারীর সম্মতি ঘোষণাপত্র (User Agreement)</h5>
                            <p class="mb-0 text-secondary">
                                ওয়েবসাইট ব্যবহার বা আমাদের কোনো সেবা গ্রহণ করার মাধ্যমে আপনি এই শর্তাবলিতে সম্মতি প্রদান করছেন। কোনো শর্তে সম্মত না হলে অনুগ্রহ করে সংশ্লিষ্ট সেবা ব্যবহার থেকে বিরত থাকুন।
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 text-md-end no-print">
                    <a href="contact.php" class="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold">
                        <i class="fa-solid fa-circle-question me-1"></i> প্রশ্ন থাকলে জানান[cite: 1]
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- মেইন বডি এবং সাইডবার -->
    <div class="container">
        <div class="row g-4">
            <!-- বাম পাশের স্টিকি সূচিপত্র (১–১৯) -->
            <div class="col-lg-4 col-xl-3">
                <aside class="terms-toc">
                    <div class="terms-toc-header">
                        <span><i class="fa-solid fa-list-ol text-primary me-2"></i> ধারা সূচিপত্র</span>
                        <span class="badge bg-primary-subtle text-primary rounded-pill">১৯টি ধারা</span>
                    </div>
                    <ul class="terms-toc-list" id="termsTocNav">
                        <li><a href="#term-1" class="active"><span class="toc-badge">১</span> সাধারণ পরিচিতি</a></li>
                        <li><a href="#term-2"><span class="toc-badge">২</span> ওয়েবসাইট ব্যবহারের শর্ত</a></li>
                        <li><a href="#term-3"><span class="toc-badge">৩</span> শিক্ষার্থী নিবন্ধন ও ভর্তি</a></li>
                        <li><a href="#term-4"><span class="toc-badge">৪</span> কোর্স ও প্রশিক্ষণসংক্রান্ত শর্ত</a></li>
                        <li><a href="#term-5"><span class="toc-badge">৫</span> কোর্স ফি ও পেমেন্ট নীতিমালা</a></li>
                        <li><a href="#term-6"><span class="toc-badge">৬</span> ভর্তি বাতিল ও অর্থ ফেরত</a></li>
                        <li><a href="#term-7"><span class="toc-badge">৭</span> উপস্থিতি ও শৃঙ্খলা</a></li>
                        <li><a href="#term-8"><span class="toc-badge">৮</span> সার্টিফিকেট ও মূল্যায়ন নীতিমালা</a></li>
                        <li><a href="#term-9"><span class="toc-badge">৯</span> কনটেন্ট ও মেধাস্বত্ব</a></li>
                        <li><a href="#term-10"><span class="toc-badge">১০</span> গোপনীয়তা ও ব্যক্তিগত তথ্য</a></li>
                        <li><a href="#term-11"><span class="toc-badge">১১</span> অ্যাকাউন্ট ও নিরাপত্তা</a></li>
                        <li><a href="#term-12"><span class="toc-badge">১২</span> তৃতীয় পক্ষের লিংক ও সেবা</a></li>
                        <li><a href="#term-13"><span class="toc-badge">১৩</span> ওয়েবসাইটের তথ্যের নির্ভুলতা</a></li>
                        <li><a href="#term-14"><span class="toc-badge">১৪</span> সেবা পরিবর্তন ও সাময়িক বন্ধ</a></li>
                        <li><a href="#term-15"><span class="toc-badge">১৫</span> নিষিদ্ধ কার্যক্রম</a></li>
                        <li><a href="#term-16"><span class="toc-badge">১৬</span> দায়বদ্ধতার সীমাবদ্ধতা</a></li>
                        <li><a href="#term-17"><span class="toc-badge">১৭</span> প্রযোজ্য আইন ও বিরোধ নিষ্পত্তি</a></li>
                        <li><a href="#term-18"><span class="toc-badge">১৮</span> শর্তাবলি পরিবর্তন</a></li>
                        <li><a href="#term-19"><span class="toc-badge">১৯</span> যোগাযোগ</a></li>
                    </ul>
                </aside>
            </div>

            <!-- ডান পাশের বিস্তারিত ১৯টি ধারা -->
            <div class="col-lg-8 col-xl-9">

                <!-- ১. সাধারণ পরিচিতি -->
                <section id="term-1" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-building-columns"></i></div>
                        <div>
                            <h2 class="term-title-bn">১. সাধারণ পরিচিতি</h2>
                            <div class="term-title-en">General Information</div>
                        </div>
                    </div>
                    <p>
                        <strong>Dream Career IT</strong> একটি তথ্যপ্রযুক্তি ও দক্ষতাভিত্তিক প্রশিক্ষণ প্রতিষ্ঠান। প্রতিষ্ঠানটি কম্পিউটার শিক্ষা, ডিজিটাল দক্ষতা উন্নয়ন এবং বিভিন্ন পেশাগত প্রশিক্ষণ কার্যক্রম পরিচালনার উদ্দেশ্যে কাজ করে।
                    </p>
                    <p class="mb-0">
                        আমাদের ওয়েবসাইটের মাধ্যমে ব্যবহারকারীরা প্রতিষ্ঠানের পরিচিতি, কোর্স, ভর্তি কার্যক্রম, প্রশিক্ষক, শিক্ষার্থী, নোটিশ, ফলাফল, সার্টিফিকেট যাচাই এবং অন্যান্য প্রাসঙ্গিক তথ্য দেখতে পারবেন।
                    </p>
                </section>

                <!-- ২. ওয়েবসাইট ব্যবহারের শর্ত -->
                <section id="term-2" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-globe"></i></div>
                        <div>
                            <h2 class="term-title-bn">২. ওয়েবসাইট ব্যবহারের শর্ত</h2>
                            <div class="term-title-en">Website Usage</div>
                        </div>
                    </div>
                    <p class="mb-3">ওয়েবসাইট ব্যবহার করার সময় ব্যবহারকারীকে নিম্নলিখিত নিয়ম অনুসরণ করতে হবে:</p>
                    <ul class="term-list">
                        <li><i class="fa-solid fa-circle-check text-primary"></i> <span>ওয়েবসাইটটি কোনো অবৈধ উদ্দেশ্যে ব্যবহার করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-circle-check text-primary"></i> <span>ভুল, বিভ্রান্তিকর বা মিথ্যা তথ্য প্রদান করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-circle-check text-primary"></i> <span>অন্য কোনো ব্যক্তি বা প্রতিষ্ঠানের পরিচয় ব্যবহার করে অ্যাকাউন্ট বা আবেদন করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-circle-check text-primary"></i> <span>ওয়েবসাইটের নিরাপত্তা নষ্ট করার চেষ্টা করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-circle-check text-primary"></i> <span>অনুমতি ছাড়া ওয়েবসাইটের কোনো তথ্য, ডেটাবেজ বা সিস্টেমে প্রবেশের চেষ্টা করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-circle-check text-primary"></i> <span>ওয়েবসাইটে ক্ষতিকর সফটওয়্যার, ভাইরাস বা অননুমোদিত কোড সংযুক্ত করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-circle-check text-primary"></i> <span>অন্য ব্যবহারকারীর স্বাভাবিক ওয়েবসাইট ব্যবহার বাধাগ্রস্ত করা যাবে না।</span></li>
                    </ul>
                </section>

                <!-- ৩. শিক্ষার্থী নিবন্ধন ও ভর্তি -->
                <section id="term-3" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-user-graduate"></i></div>
                        <div>
                            <h2 class="term-title-bn">৩. শিক্ষার্থী নিবন্ধন ও ভর্তি</h2>
                            <div class="term-title-en">Student Registration &amp; Admission</div>
                        </div>
                    </div>
                    <p class="mb-3">প্রতিষ্ঠানে ভর্তি বা অনলাইন নিবন্ধনের ক্ষেত্রে:</p>
                    <ul class="term-list">
                        <li><span class="num-pill">১</span> <span>শিক্ষার্থীকে সঠিক নাম, মোবাইল নম্বর, ঠিকানা ও প্রয়োজনীয় তথ্য প্রদান করতে হবে।</span></li>
                        <li><span class="num-pill">২</span> <span>আবেদনপত্রে প্রদত্ত তথ্যের সত্যতা নিশ্চিত করার দায়িত্ব আবেদনকারীর।</span></li>
                        <li><span class="num-pill">৩</span> <span>ভুল বা অসম্পূর্ণ তথ্যের কারণে ভর্তি কার্যক্রমে সমস্যা হলে প্রতিষ্ঠান দায়ী থাকবে না।</span></li>
                        <li><span class="num-pill">৪</span> <span>ভর্তি নিশ্চিত হওয়ার জন্য প্রতিষ্ঠানের নির্ধারিত প্রক্রিয়া সম্পন্ন করতে হবে।</span></li>
                        <li><span class="num-pill">৫</span> <span>প্রতিষ্ঠান প্রয়োজন অনুযায়ী আবেদনকারীর দেওয়া তথ্য যাচাই করতে পারবে।</span></li>
                        <li><span class="num-pill">৬</span> <span>ভর্তির যোগ্যতা, আসনসংখ্যা ও প্রয়োজনীয় কাগজপত্র কোর্সভেদে ভিন্ন হতে পারে।</span></li>
                        <li><span class="num-pill">৭</span> <span>কোনো আবেদন গ্রহণ বা বাতিলের ক্ষেত্রে প্রযোজ্য নিয়ম ও কারণ আবেদনকারীকে জানানো হবে।</span></li>
                    </ul>
                </section>

                <!-- ৪. কোর্স ও প্রশিক্ষণসংক্রান্ত শর্ত -->
                <section id="term-4" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-laptop-code"></i></div>
                        <div>
                            <h2 class="term-title-bn">৪. কোর্স ও প্রশিক্ষণসংক্রান্ত শর্ত</h2>
                            <div class="term-title-en">Course &amp; Training Policy</div>
                        </div>
                    </div>
                    <p class="mb-3">Dream Career IT-এর বিভিন্ন প্রশিক্ষণ কোর্সের ক্ষেত্রে:</p>
                    <ul class="term-list">
                        <li><i class="fa-solid fa-check text-success"></i> <span>প্রতিটি কোর্সের নির্ধারিত সিলেবাস অনুসরণ করা হবে।</span></li>
                        <li><i class="fa-solid fa-check text-success"></i> <span>কোর্সের মেয়াদ, ক্লাসের সময়সূচি ও প্রশিক্ষণ পদ্ধতি কোর্সভেদে ভিন্ন হতে পারে।</span></li>
                        <li><i class="fa-solid fa-check text-success"></i> <span>শিক্ষার্থীকে নিয়মিত ক্লাসে অংশগ্রহণ করতে হবে।</span></li>
                        <li><i class="fa-solid fa-check text-success"></i> <span>প্রশিক্ষণ কার্যক্রমে প্রতিষ্ঠানের নির্ধারিত নিয়ম মেনে চলতে হবে।</span></li>
                        <li><i class="fa-solid fa-check text-success"></i> <span>ব্যবহারিক ক্লাস ও অ্যাসাইনমেন্ট যথাযথভাবে সম্পন্ন করতে হবে।</span></li>
                        <li><i class="fa-solid fa-check text-success"></i> <span>প্রতিষ্ঠানের অনুমতি ছাড়া ক্লাসের গোপনীয় উপকরণ বা প্রশিক্ষণ সামগ্রী বাণিজ্যিকভাবে ব্যবহার করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-check text-success"></i> <span>বিশেষ পরিস্থিতিতে কর্তৃপক্ষ প্রয়োজন অনুযায়ী ক্লাসের সময়সূচি বা প্রশিক্ষণ পদ্ধতি পরিবর্তন করতে পারবে।</span></li>
                    </ul>
                </section>

                <!-- ৫. কোর্স ফি ও পেমেন্ট নীতিমালা -->
                <section id="term-5" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-credit-card"></i></div>
                        <div>
                            <h2 class="term-title-bn">৫. কোর্স ফি ও পেমেন্ট নীতিমালা</h2>
                            <div class="term-title-en">Course Fee &amp; Payment Policy</div>
                        </div>
                    </div>
                    <ul class="term-list">
                        <li><span class="num-pill">১</span> <span>প্রতিটি কোর্সের ফি প্রতিষ্ঠান কর্তৃক নির্ধারিত হবে।</span></li>
                        <li><span class="num-pill">২</span> <span>ভর্তি হওয়ার পূর্বে শিক্ষার্থীকে কোর্স ফি সম্পর্কে অবগত হতে হবে।</span></li>
                        <li><span class="num-pill">৩</span> <span>নির্ধারিত সময়ের মধ্যে কোর্স ফি পরিশোধ করতে হবে।</span></li>
                        <li><span class="num-pill">৪</span> <span>পেমেন্ট সম্পন্ন হওয়ার পর প্রযোজ্য ক্ষেত্রে মানি রিসিট বা পেমেন্ট কনফার্মেশন প্রদান করা হবে।</span></li>
                        <li><span class="num-pill">৫</span> <span>ভুল নম্বরে বা ভুল মাধ্যমে অর্থ পাঠানোর ক্ষেত্রে সংশ্লিষ্ট পেমেন্ট সেবাদাতার নিয়ম অনুসরণ করতে হবে।</span></li>
                        <li><span class="num-pill">৬</span> <span>কোনো অফার, ছাড় বা বিশেষ সুবিধা থাকলে তার নির্ধারিত শর্ত প্রযোজ্য হবে।</span></li>
                        <li><span class="num-pill">৭</span> <span>প্রতিষ্ঠানের অনুমোদিত পেমেন্ট মাধ্যম ছাড়া অন্য কোনো ব্যক্তিগত মাধ্যমে অর্থ প্রদান করার আগে কর্তৃপক্ষের সঙ্গে নিশ্চিত হতে হবে।</span></li>
                    </ul>
                </section>

                <!-- ৬. ভর্তি বাতিল ও অর্থ ফেরত নীতিমালা -->
                <section id="term-6" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-rotate-left"></i></div>
                        <div>
                            <h2 class="term-title-bn">৬. ভর্তি বাতিল ও অর্থ ফেরত নীতিমালা</h2>
                            <div class="term-title-en">Admission Cancellation &amp; Refund Policy</div>
                        </div>
                    </div>
                    <ul class="term-list">
                        <li><i class="fa-solid fa-circle-dot text-primary"></i> <span>ভর্তি বাতিলের আবেদন লিখিতভাবে বা প্রতিষ্ঠানের নির্ধারিত মাধ্যমে জানাতে হবে।</span></li>
                        <li><i class="fa-solid fa-circle-dot text-primary"></i> <span>কোর্স শুরু হওয়ার আগে বাতিলের ক্ষেত্রে প্রযোজ্য নিয়ম অনুযায়ী অর্থ ফেরতের বিষয়টি বিবেচনা করা হবে।</span></li>
                        <li><i class="fa-solid fa-circle-dot text-primary"></i> <span>কোর্স শুরু হওয়ার পর অর্থ ফেরত প্রযোজ্য হবে কি না, তা ভর্তি চুক্তি ও ঘোষিত রিফান্ড নীতির ভিত্তিতে নির্ধারিত হবে।</span></li>
                        <li><i class="fa-solid fa-circle-dot text-primary"></i> <span>প্রতিষ্ঠানের কারণে কোনো কোর্স সম্পূর্ণভাবে বাতিল হলে সংশ্লিষ্ট শিক্ষার্থীদের অর্থ ফেরত বা বিকল্প ব্যবস্থা সম্পর্কে জানানো হবে।</span></li>
                        <li><i class="fa-solid fa-circle-dot text-primary"></i> <span>কোনো অর্থ ফেরতের ক্ষেত্রে প্রযোজ্য ব্যাংক বা পেমেন্ট গেটওয়ের চার্জ বিবেচনা করা হতে পারে।</span></li>
                        <li><i class="fa-solid fa-circle-dot text-primary"></i> <span>প্রতিটি রিফান্ড আবেদন যাচাই করে সিদ্ধান্ত জানানো হবে।</span></li>
                    </ul>
                    <div class="note-callout">
                        <i class="fa-solid fa-circle-exclamation text-warning fs-5 mt-1"></i>
                        <div>
                            <strong class="text-dark">বিশেষ দ্রষ্টব্য:</strong> ভর্তি হওয়ার আগে শিক্ষার্থীকে সংশ্লিষ্ট কোর্সের রিফান্ড নীতিমালা জেনে নেওয়ার পরামর্শ দেওয়া হচ্ছে।
                        </div>
                    </div>
                </section>

                <!-- ৭. উপস্থিতি ও শৃঙ্খলা -->
                <section id="term-7" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-user-check"></i></div>
                        <div>
                            <h2 class="term-title-bn">৭. উপস্থিতি ও শৃঙ্খলা</h2>
                            <div class="term-title-en">Attendance &amp; Discipline</div>
                        </div>
                    </div>
                    <p class="mb-3">শিক্ষার্থীদের জন্য নিম্নলিখিত নিয়ম প্রযোজ্য:</p>
                    <ul class="term-list">
                        <li><i class="fa-solid fa-check-double text-success"></i> <span>নির্ধারিত সময় অনুযায়ী ক্লাসে উপস্থিত থাকতে হবে।</span></li>
                        <li><i class="fa-solid fa-check-double text-success"></i> <span>শিক্ষক, কর্মকর্তা ও অন্যান্য শিক্ষার্থীর সঙ্গে সম্মানজনক আচরণ করতে হবে।</span></li>
                        <li><i class="fa-solid fa-check-double text-success"></i> <span>প্রতিষ্ঠানের সম্পদ ও শিক্ষা উপকরণের যত্ন নিতে হবে।</span></li>
                        <li><i class="fa-solid fa-check-double text-success"></i> <span>ক্লাস চলাকালে অন্যের শিক্ষা কার্যক্রমে বিঘ্ন সৃষ্টি করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-check-double text-success"></i> <span>কোনো ধরনের হয়রানি, প্রতারণা, হুমকি বা অসদাচরণ গ্রহণযোগ্য নয়।</span></li>
                        <li><i class="fa-solid fa-check-double text-success"></i> <span>প্রতিষ্ঠানের শৃঙ্খলাবিরোধী কার্যক্রমের ক্ষেত্রে যথাযথ তদন্ত ও আত্মপক্ষ সমর্থনের সুযোগ দিয়ে প্রয়োজনীয় ব্যবস্থা নেওয়া হতে পারে।</span></li>
                    </ul>
                </section>

                <!-- ৮. সার্টিফিকেট ও মূল্যায়ন নীতিমালা -->
                <section id="term-8" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box" style="background: var(--dcit-emerald-soft); color: var(--dcit-emerald); border-color: #a7f3d0;">
                            <i class="fa-solid fa-award"></i>
                        </div>
                        <div>
                            <h2 class="term-title-bn">৮. সার্টিফিকেট ও মূল্যায়ন নীতিমালা</h2>
                            <div class="term-title-en">Certificate &amp; Assessment Policy</div>
                        </div>
                    </div>
                    <ul class="term-list mb-3">
                        <li><span class="num-pill">১</span> <span>কোর্সের নির্ধারিত শর্ত পূরণ এবং প্রযোজ্য মূল্যায়নে উত্তীর্ণ হওয়ার পর সার্টিফিকেট প্রদান করা হতে পারে।</span></li>
                        <li><span class="num-pill">২</span> <span>সার্টিফিকেটের জন্য প্রয়োজনীয় উপস্থিতি, অ্যাসাইনমেন্ট, ব্যবহারিক কাজ ও মূল্যায়নের নিয়ম কোর্সভেদে নির্ধারিত হবে।</span></li>
                        <li><span class="num-pill">৩</span> <span>সার্টিফিকেটে প্রদত্ত তথ্য সঠিক রাখা শিক্ষার্থী ও প্রতিষ্ঠানের যৌথ দায়িত্ব।</span></li>
                        <li><span class="num-pill">৪</span> <span>কোনো সার্টিফিকেট জাল, পরিবর্তন বা অননুমোদিতভাবে ব্যবহার করা যাবে না।</span></li>
                        <li><span class="num-pill">৫</span> <span>প্রতিষ্ঠান কর্তৃক ইস্যু করা যাচাইযোগ্য সার্টিফিকেটের সত্যতা ওয়েবসাইটের <strong>Certificate Verification</strong> ব্যবস্থার মাধ্যমে যাচাই করা যাবে।</span></li>
                        <li><span class="num-pill">৬</span> <span>সার্টিফিকেট প্রদান কোনো সরকারি চাকরি, নিয়োগ বা পেশাগত লাইসেন্স নিশ্চিত করে না।</span></li>
                        <li><span class="num-pill">৭</span> <span>কোনো সরকারি বা তৃতীয় পক্ষের স্বীকৃতির দাবি কেবল সংশ্লিষ্ট অনুমোদনের প্রমাণ থাকলেই করা হবে।</span></li>
                    </ul>
                    <div class="p-3 rounded-3 d-flex align-items-center justify-content-between flex-wrap gap-2 no-print" style="background: var(--dcit-emerald-soft); border: 1px solid #a7f3d0;">
                        <span class="small fw-semibold text-dark"><i class="fa-solid fa-qrcode text-success me-1"></i> অনলাইনে সার্টিফিকেট যাচাই করতে চান?</span>
                        <a href="certificates.php" class="btn btn-success btn-sm rounded-pill px-3">Certificate Verification[cite: 1]</a>
                    </div>
                </section>

                <!-- ৯. ওয়েবসাইটের কনটেন্ট ও মেধাস্বত্ব -->
                <section id="term-9" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-copyright"></i></div>
                        <div>
                            <h2 class="term-title-bn">৯. ওয়েবসাইটের কনটেন্ট ও মেধাস্বত্ব</h2>
                            <div class="term-title-en">Intellectual Property Rights</div>
                        </div>
                    </div>
                    <p class="mb-3">
                        এই ওয়েবসাইটে প্রকাশিত নিজস্ব লেখা, ডিজাইন, লোগো, গ্রাফিক্স, ছবি, ভিডিও, প্রশিক্ষণ উপকরণ এবং অন্যান্য মৌলিক কনটেন্টের স্বত্ব <strong>Dream Career IT</strong> অথবা সংশ্লিষ্ট স্বত্বাধিকারীর। প্রতিষ্ঠানের লিখিত অনুমতি ছাড়া:
                    </p>
                    <ul class="term-list">
                        <li><i class="fa-solid fa-ban text-danger"></i> <span>ওয়েবসাইটের নিজস্ব কনটেন্ট বাণিজ্যিকভাবে ব্যবহার করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-ban text-danger"></i> <span>প্রশিক্ষণ উপকরণ কপি বা পুনরায় বিক্রি করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-ban text-danger"></i> <span>প্রতিষ্ঠানের লোগো বা পরিচয় অনুমতি ছাড়া ব্যবহার করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-ban text-danger"></i> <span>ওয়েবসাইটের কনটেন্ট অন্যত্র প্রকাশ বা বিতরণ করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-shield-halved text-primary"></i> <span>তৃতীয় পক্ষের মালিকানাধীন কোনো কনটেন্টের ক্ষেত্রে সংশ্লিষ্ট স্বত্বাধিকারীর অধিকার সংরক্ষিত থাকবে।</span></li>
                    </ul>
                </section>

                <!-- ১০. গোপনীয়তা ও ব্যক্তিগত তথ্য -->
                <section id="term-10" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-user-shield"></i></div>
                        <div>
                            <h2 class="term-title-bn">১০. গোপনীয়তা ও ব্যক্তিগত তথ্য</h2>
                            <div class="term-title-en">Privacy &amp; Personal Information</div>
                        </div>
                    </div>
                    <p class="mb-3">ওয়েবসাইট ব্যবহার, ভর্তি ও নিবন্ধনের সময় ব্যবহারকারীর কিছু ব্যক্তিগত তথ্য সংগ্রহ করা হতে পারে। সংগৃহীত তথ্যের মধ্যে থাকতে পারে:</p>
                    <div class="row g-2 mb-3">
                        <div class="col-md-6">
                            <ul class="term-list">
                                <li><i class="fa-solid fa-id-card text-primary"></i> <span>শিক্ষার্থীর নাম।</span></li>
                                <li><i class="fa-solid fa-phone text-primary"></i> <span>মোবাইল নম্বর।</span></li>
                                <li><i class="fa-solid fa-envelope text-primary"></i> <span>ইমেইল ঠিকানা।</span></li>
                                <li><i class="fa-solid fa-location-dot text-primary"></i> <span>বর্তমান ও স্থায়ী ঠিকানা।</span></li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <ul class="term-list">
                                <li><i class="fa-solid fa-graduation-cap text-primary"></i> <span>শিক্ষাগত যোগ্যতা।</span></li>
                                <li><i class="fa-solid fa-file-signature text-primary"></i> <span>ভর্তি ও কোর্সসংক্রান্ত তথ্য।</span></li>
                                <li><i class="fa-solid fa-receipt text-primary"></i> <span>পেমেন্ট ও লেনদেনের তথ্য।</span></li>
                            </ul>
                        </div>
                    </div>
                    <p class="mb-0 text-muted small">
                        <i class="fa-solid fa-lock me-1 text-primary"></i> ব্যবহারকারীর ব্যক্তিগত তথ্য সংগ্রহ, সংরক্ষণ, ব্যবহার ও সুরক্ষার ক্ষেত্রে প্রতিষ্ঠানের <strong>Privacy Policy</strong> অনুসরণ করা হবে।
                    </p>
                </section>

                <!-- ১১. অ্যাকাউন্ট ও নিরাপত্তা -->
                <section id="term-11" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-key"></i></div>
                        <div>
                            <h2 class="term-title-bn">১১. অ্যাকাউন্ট ও নিরাপত্তা</h2>
                            <div class="term-title-en">Account &amp; Security</div>
                        </div>
                    </div>
                    <p class="mb-3">ওয়েবসাইটে ব্যবহারকারীর অ্যাকাউন্ট সুবিধা থাকলে:</p>
                    <ul class="term-list">
                        <li><i class="fa-solid fa-shield-cat text-primary"></i> <span>অ্যাকাউন্টের লগইন তথ্য গোপন রাখতে হবে।</span></li>
                        <li><i class="fa-solid fa-shield-cat text-primary"></i> <span>অন্যের অ্যাকাউন্ট অনুমতি ছাড়া ব্যবহার করা যাবে না।</span></li>
                        <li><i class="fa-solid fa-shield-cat text-primary"></i> <span>অ্যাকাউন্টে অননুমোদিত প্রবেশের সন্দেহ হলে দ্রুত কর্তৃপক্ষকে জানাতে হবে।</span></li>
                        <li><i class="fa-solid fa-shield-cat text-primary"></i> <span>ভুল বা সন্দেহজনক কার্যক্রমের ক্ষেত্রে নিরাপত্তার স্বার্থে অ্যাকাউন্ট সাময়িকভাবে সীমাবদ্ধ করা হতে পারে।</span></li>
                        <li><i class="fa-solid fa-shield-cat text-primary"></i> <span>ব্যবহারকারীর অবহেলার কারণে অ্যাকাউন্টের তথ্য প্রকাশিত হলে বিষয়টি যথাযথভাবে তদন্ত করা হবে।</span></li>
                    </ul>
                </section>

                <!-- ১২. তৃতীয় পক্ষের লিংক ও সেবা -->
                <section id="term-12" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-up-right-from-square"></i></div>
                        <div>
                            <h2 class="term-title-bn">১২. তৃতীয় পক্ষের লিংক ও সেবা</h2>
                            <div class="term-title-en">Third-Party Services</div>
                        </div>
                    </div>
                    <p>
                        আমাদের ওয়েবসাইটে তৃতীয় পক্ষের ওয়েবসাইট, পেমেন্ট সেবা, যোগাযোগ মাধ্যম অথবা অন্যান্য অনলাইন সেবার লিংক থাকতে পারে।
                    </p>
                    <p class="mb-0">
                        এসব তৃতীয় পক্ষের সেবা তাদের নিজস্ব নিয়মনীতি ও গোপনীয়তা নীতির অধীনে পরিচালিত হয়। তাদের সেবার প্রাপ্যতা, নিরাপত্তা বা কনটেন্টের ওপর <strong>Dream Career IT</strong>-এর সরাসরি নিয়ন্ত্রণ নেই।
                    </p>
                </section>

                <!-- ১৩. ওয়েবসাইটের তথ্যের নির্ভুলতা -->
                <section id="term-13" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-circle-check"></i></div>
                        <div>
                            <h2 class="term-title-bn">১৩. ওয়েবসাইটের তথ্যের নির্ভুলতা</h2>
                            <div class="term-title-en">Information Accuracy</div>
                        </div>
                    </div>
                    <p class="mb-3">ওয়েবসাইটে প্রকাশিত তথ্য যথাসম্ভব সঠিক ও হালনাগাদ রাখার চেষ্টা করা হয়। তবে:</p>
                    <div class="row g-2 mb-3">
                        <div class="col-md-6">
                            <ul class="term-list">
                                <li><i class="fa-solid fa-arrows-rotate text-primary"></i> <span>কোর্সের তথ্য পরিবর্তিত হতে পারে।</span></li>
                                <li><i class="fa-solid fa-arrows-rotate text-primary"></i> <span>প্রশিক্ষণের সময়সূচি পরিবর্তিত হতে পারে।</span></li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <ul class="term-list">
                                <li><i class="fa-solid fa-arrows-rotate text-primary"></i> <span>ফি ও অন্যান্য চার্জ সংশোধিত হতে পারে।</span></li>
                                <li><i class="fa-solid fa-arrows-rotate text-primary"></i> <span>নোটিশ ও প্রশাসনিক সিদ্ধান্ত হালনাগাদ হতে পারে।</span></li>
                            </ul>
                        </div>
                    </div>
                    <div class="note-callout">
                        <i class="fa-solid fa-lightbulb text-warning fs-5 mt-1"></i>
                        <div>কোনো গুরুত্বপূর্ণ সিদ্ধান্ত গ্রহণের আগে সরাসরি প্রতিষ্ঠানের সঙ্গে যোগাযোগ করে তথ্য নিশ্চিত করার পরামর্শ দেওয়া হচ্ছে।</div>
                    </div>
                </section>

                <!-- ১৪. সেবা পরিবর্তন ও সাময়িক বন্ধ -->
                <section id="term-14" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-screwdriver-wrench"></i></div>
                        <div>
                            <h2 class="term-title-bn">১৪. সেবা পরিবর্তন ও সাময়িক বন্ধ</h2>
                            <div class="term-title-en">Service Modification &amp; Suspension</div>
                        </div>
                    </div>
                    <p>
                        প্রযুক্তিগত সমস্যা, রক্ষণাবেক্ষণ, নিরাপত্তা, প্রশাসনিক সিদ্ধান্ত বা অনিবার্য পরিস্থিতির কারণে ওয়েবসাইটের কিছু সেবা সাময়িকভাবে বন্ধ বা পরিবর্তন করা হতে পারে।
                    </p>
                    <p class="mb-0">
                        এ ধরনের পরিবর্তন সম্পর্কে সম্ভব হলে ব্যবহারকারীদের পূর্বেই অবহিত করা হবে।
                    </p>
                </section>

                <!-- ১৫. নিষিদ্ধ কার্যক্রম -->
                <section id="term-15" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box" style="background: var(--dcit-danger-soft); color: var(--dcit-danger); border-color: #fecaca;">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <div>
                            <h2 class="term-title-bn">১৫. নিষিদ্ধ কার্যক্রম</h2>
                            <div class="term-title-en">Prohibited Activities</div>
                        </div>
                    </div>
                    <p class="mb-3">নিম্নলিখিত কার্যক্রম সম্পূর্ণ নিষিদ্ধ:</p>
                    <ul class="term-list">
                        <li><i class="fa-solid fa-circle-xmark text-danger"></i> <span>ওয়েবসাইট হ্যাকিং বা অননুমোদিত প্রবেশ।</span></li>
                        <li><i class="fa-solid fa-circle-xmark text-danger"></i> <span>ভুয়া ভর্তি বা জাল সার্টিফিকেট তৈরি।</span></li>
                        <li><i class="fa-solid fa-circle-xmark text-danger"></i> <span>প্রতারণামূলক পেমেন্ট প্রমাণ জমা দেওয়া।</span></li>
                        <li><i class="fa-solid fa-circle-xmark text-danger"></i> <span>অন্যের ব্যক্তিগত তথ্য চুরি বা অপব্যবহার।</span></li>
                        <li><i class="fa-solid fa-circle-xmark text-danger"></i> <span>প্রতিষ্ঠানের নাম ব্যবহার করে ভুয়া প্রচারণা।</span></li>
                        <li><i class="fa-solid fa-circle-xmark text-danger"></i> <span>ওয়েবসাইটের সার্ভার বা ডেটাবেজ ক্ষতিগ্রস্ত করার চেষ্টা।</span></li>
                        <li><i class="fa-solid fa-circle-xmark text-danger"></i> <span>প্রতিষ্ঠানের সুনাম ক্ষুণ্ণ করার উদ্দেশ্যে মিথ্যা তথ্য প্রচার।</span></li>
                    </ul>
                    <div class="danger-callout">
                        <i class="fa-solid fa-gavel text-danger fs-5 mt-1"></i>
                        <div>প্রযোজ্য আইন ও নীতিমালা অনুসারে এসব কার্যক্রমের বিরুদ্ধে প্রয়োজনীয় আইনগত ব্যবস্থা নেওয়া হতে পারে।</div>
                    </div>
                </section>

                <!-- ১৬. দায়বদ্ধতার সীমাবদ্ধতা -->
                <section id="term-16" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-scale-unbalanced"></i></div>
                        <div>
                            <h2 class="term-title-bn">১৬. দায়বদ্ধতার সীমাবদ্ধতা</h2>
                            <div class="term-title-en">Limitation of Liability</div>
                        </div>
                    </div>
                    <p>
                        <strong>Dream Career IT</strong> ওয়েবসাইট ও প্রশিক্ষণ কার্যক্রম যথাসম্ভব সঠিকভাবে পরিচালনার চেষ্টা করে। তবে ইন্টারনেট সংযোগের সমস্যা, তৃতীয় পক্ষের সেবা বন্ধ থাকা, প্রযুক্তিগত ত্রুটি অথবা প্রতিষ্ঠানের যুক্তিসংগত নিয়ন্ত্রণের বাইরে থাকা পরিস্থিতির কারণে সৃষ্ট সমস্যার ক্ষেত্রে প্রযোজ্য আইন অনুযায়ী দায়বদ্ধতা নির্ধারিত হবে।
                    </p>
                    <div class="p-3 bg-light border rounded-3 mb-0">
                        <i class="fa-solid fa-circle-info text-primary me-2"></i>
                        কোনো প্রশিক্ষণ গ্রহণের মাধ্যমে নির্দিষ্ট চাকরি, আয়, ব্যবসায়িক সাফল্য বা পেশাগত ফলাফল নিশ্চিত করা হয় না।
                    </div>
                </section>

                <!-- ১৭. প্রযোজ্য আইন ও বিরোধ নিষ্পত্তি -->
                <section id="term-17" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-scale-balanced"></i></div>
                        <div>
                            <h2 class="term-title-bn">১৭. প্রযোজ্য আইন ও বিরোধ নিষ্পত্তি</h2>
                            <div class="term-title-en">Governing Law &amp; Dispute Resolution</div>
                        </div>
                    </div>
                    <p>
                        এই শর্তাবলি বাংলাদেশের প্রচলিত আইন ও প্রযোজ্য বিধিবিধানের আলোকে পরিচালিত হবে।
                    </p>
                    <p class="mb-0">
                        কোনো বিরোধ সৃষ্টি হলে প্রথমে পারস্পরিক আলোচনা ও সমঝোতার মাধ্যমে সমাধানের চেষ্টা করা হবে। সমাধান সম্ভব না হলে বাংলাদেশের উপযুক্ত আইনগত কর্তৃপক্ষ বা আদালতের মাধ্যমে বিষয়টি নিষ্পত্তি করা হবে।
                    </p>
                </section>

                <!-- ১৮. শর্তাবলি পরিবর্তন -->
                <section id="term-18" class="term-section-card">
                    <div class="term-card-head">
                        <div class="term-icon-box"><i class="fa-solid fa-file-pen"></i></div>
                        <div>
                            <h2 class="term-title-bn">১৮. শর্তাবলি পরিবর্তন</h2>
                            <div class="term-title-en">Changes to Terms &amp; Conditions</div>
                        </div>
                    </div>
                    <p>
                        <strong>Dream Career IT</strong> প্রয়োজন অনুযায়ী এই শর্তাবলি সংশোধন, সংযোজন বা হালনাগাদ করতে পারবে। পরিবর্তিত শর্তাবলি ওয়েবসাইটে প্রকাশের পর কার্যকর হবে, যদি সংশ্লিষ্ট নোটিশে অন্য কোনো কার্যকর তারিখ উল্লেখ না থাকে।
                    </p>
                    <p class="mb-0 fw-medium text-primary">
                        <i class="fa-regular fa-bell me-1"></i> ব্যবহারকারীদের নিয়মিত এই পেজ পর্যালোচনা করার পরামর্শ দেওয়া হচ্ছে।
                    </p>
                </section>

                <!-- ১৯. যোগাযোগ -->
                <section id="term-19" class="terms-contact-card">
                    <div class="row align-items-center g-4">
                        <div class="col-lg-12">
                            <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary bg-opacity-25 text-info small fw-semibold mb-3">
                                <i class="fa-solid fa-headset"></i> ১৯. যোগাযোগ (Contact Information)
                            </div>
                            <h3 class="fw-bold mb-2">Terms &amp; Conditions সম্পর্কে কোনো প্রশ্ন বা পরামর্শ আছে?</h3>
                            <p class="text-light opacity-75 mb-3">
                                আমাদের শর্তাবলি ও নিয়মনীতি সম্পর্কে কোনো প্রশ্ন, অভিযোগ বা পরামর্শ থাকলে নিচের মাধ্যমে সরাসরি যোগাযোগ করুন।
                            </p>
                            <div class="p-3 rounded-3 mb-3" style="background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.25);">
                                <i class="fa-solid fa-bullseye text-info me-2"></i>
                                <strong>আমাদের লক্ষ্য:</strong> মানসম্মত প্রশিক্ষণ, দক্ষতা উন্নয়ন, স্বচ্ছতা এবং দায়িত্বশীল সেবা প্রদান।
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="contact-glass-box">
                                <div class="small text-info fw-semibold mb-1"><i class="fa-solid fa-building me-1"></i> প্রতিষ্ঠানের নাম ও ঠিকানা</div>
                                <div class="fw-bold fs-5 mb-1">Dream Career IT</div>
                                <div class="small text-light opacity-75">
                                    ভাই ভাই সুপার মার্কেট, নতুন পদুয়ার বাজার মসজিদের পাশে, পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা-৩৫০০, বাংলাদেশ।
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="contact-glass-box">
                                <div class="small text-info fw-semibold mb-2"><i class="fa-solid fa-phone-volume me-1"></i> হটলাইন ও ইমেইল</div>
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
                            <div class="small text-light opacity-75">ধন্যবাদান্তে,</div>
                            <div class="fw-bold text-white">Dream Career IT — <span class="text-info fst-italic">Learn Today, Lead Tomorrow.</span></div>
                        </div>
                        <div class="no-print d-flex gap-2">
                            <a href="legitimacy.php" class="btn btn-sm btn-outline-light rounded-pill px-3">
                                <i class="fa-solid fa-shield-halved me-1"></i> প্রাতিষ্ঠানিক বৈধতা
                            </a>
                            <a href="contact.php" class="btn btn-sm btn-info fw-semibold rounded-pill px-3">
                                <i class="fa-solid fa-paper-plane me-1"></i> মেসেজ পাঠান[cite: 1]
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
    const sections = document.querySelectorAll('.term-section-card, .terms-contact-card');
    const navLinks = document.querySelectorAll('#termsTocNav a');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 130) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    });
});
</script>

<?php
// প্রজেক্টের ফুটার থাকলে লোড হবে, না থাকলে স্ট্যান্ডঅ্যালোন ফুটার দেখাবে
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
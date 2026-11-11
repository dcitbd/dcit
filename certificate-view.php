<?php
require_once __DIR__ . '/config/db.php';
$pdo = get_db();
$cert_no = trim($_GET['cert_no'] ?? '');
$reg_no  = trim($_GET['reg_no'] ?? '');

if ($cert_no !== '') {
    $stmt = $pdo->prepare("SELECT * FROM certificates WHERE cert_no=? LIMIT 1");
    $stmt->execute([$cert_no]);
} else {
    $stmt = $pdo->prepare("SELECT * FROM certificates WHERE reg_no=? LIMIT 1");
    $stmt->execute([$reg_no ?: '000001']);
}
$cert = $stmt->fetch();
if (!$cert) {
    die("Certificate not found.");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico">
    <link rel="icon" type="image/png" sizes="64x64" href="assets/img/favicon.png">
    <link rel="apple-touch-icon" sizes="180x180" href="assets/img/apple-touch-icon.png">
    <meta charset="UTF-8">
    <title>Certificate - <?= h($cert['student_name']) ?> (<?= h($cert['cert_no']) ?>)</title>
    <style>
        body { font-family: 'Georgia', 'Times New Roman', serif; background:#e2e8f0; padding:25px; margin:0; }
        .cert-actions { max-width:960px; margin:0 auto 16px; display:flex; justify-content:space-between; font-family:sans-serif; }
        .cert-frame {
            max-width:960px; margin:0 auto; background:#fff; padding:18px;
            border:10px solid #0f766e; border-radius:8px; box-shadow:0 15px 40px rgba(0,0,0,0.18);
        }
        .cert-inner {
            border:3px double #d97706; padding:38px 46px; position:relative;
            background: radial-gradient(circle at center, #ffffff 70%, #f0fdfa 100%);
        }
        .cert-top { display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0f766e; padding-bottom:16px; margin-bottom:24px; }
        .cert-top img { width:85px; height:85px; border-radius:50%; border:3px solid #0f766e; }
        .inst-title { text-align:center; flex:1; }
        .inst-title h1 { margin:0; font-size:2.2rem; color:#0f766e; letter-spacing:1.5px; text-transform:uppercase; }
        .inst-title p { margin:4px 0 0; font-family:sans-serif; font-size:0.9rem; color:#334155; font-weight:600; }
        .meta-box { font-family:sans-serif; font-size:0.84rem; text-align:right; color:#1e293b; line-height:1.6; }
        .cert-heading { text-align:center; margin:18px 0 24px; }
        .cert-heading span {
            background:#0f766e; color:#fde68a; padding:8px 30px; border-radius:30px;
            font-size:1.35rem; font-weight:bold; letter-spacing:2px; text-transform:uppercase;
        }
        .cert-body { font-size:1.18rem; line-height:2; color:#1e293b; text-align:justify; margin-bottom:32px; }
        .cert-body b.highlight {
            font-size:1.35rem; color:#0f766e; border-bottom:1px dashed #0f766e; padding:0 8px;
        }
        .cert-footer { display:flex; justify-content:space-between; align-items:flex-end; margin-top:45px; font-family:sans-serif; }
        .barcode-box { text-align:center; border:1px solid #cbd5e1; padding:8px 14px; border-radius:6px; background:#fff; }
        .barcode-bars {
            font-family:monospace; letter-spacing:3px; font-weight:900; font-size:1.2rem; color:#0f172a;
            background:repeating-linear-gradient(90deg,#000,#000 2px,#fff 2px,#fff 5px); height:32px; width:170px; margin:0 auto 4px;
        }
        .sign-box { text-align:center; width:220px; border-top:2px solid #0f172a; padding-top:6px; }
        .sign-box strong { display:block; font-size:0.95rem; color:#0f172a; }
        .sign-box span { font-size:0.8rem; color:#475569; }
        @page { size: letter landscape; margin: 0; }
        @media print {
            body { background:#fff; padding:0; }
            .cert-actions { display:none !important; }
            .cert-frame { box-shadow:none; width:100%; max-width:100%; }
        }
    </style>
</head>
<body>
<div class="cert-actions">
    <a href="certificates.php" style="text-decoration:none; background:#fff; padding:8px 16px; border-radius:6px; color:#0f766e; font-weight:700;">&larr; সার্টিফিকেট তালিকায় ফিরে যান</a>
    <button onclick="window.print()" style="background:#ea580c; color:#fff; border:none; padding:10px 22px; border-radius:6px; font-weight:700; cursor:pointer;">🖨️ সার্টিফিকেট প্রিন্ট / PDF সেভ করুন</button>
</div>

<div class="cert-frame">
    <div class="cert-inner">
        <div class="cert-top">
            <img src="assets/img/logo.jpg" alt="Logo">
            <div class="inst-title">
                <h1><?= h(setting('site_name', 'Dream Career IT')) ?> IT CENTER</h1>
                <p><?= h(setting('address_en')) ?></p>
                <p>Phone: <?= h(setting('phone_1')) ?> | Email: <?= h(setting('email_1')) ?></p>
            </div>
            <div class="meta-box">
                <strong>Cert No:</strong> <?= h($cert['cert_no']) ?><br>
                <strong>Reg No:</strong> <?= h($cert['reg_no']) ?><br>
                <strong>Issue Date:</strong> <?= h($cert['issue_date']) ?>
            </div>
        </div>

        <div class="cert-heading">
            <span>Certificate of Completion</span>
        </div>

        <div class="cert-body">
            This is to certify that <b class="highlight"><?= h($cert['student_name']) ?></b>,
            son/daughter of <strong><?= h($cert['father_name'] ?: 'N/A') ?></strong> and <strong><?= h($cert['mother_name'] ?: 'N/A') ?></strong>,
            bearing Registration No. <b class="highlight"><?= h($cert['reg_no']) ?></b>, has successfully completed the
            <strong><?= h($cert['duration']) ?></strong> professional training course on
            <b class="highlight"><?= h($cert['course_name']) ?></b> held during the session
            <strong><?= h($cert['session_quarter']) ?>, <?= (int)$cert['batch_year'] ?></strong>
            at <strong><?= h(setting('site_name', 'Dream Career IT')) ?> IT Center</strong> and secured Grade
            <b class="highlight"><?= h($cert['grade']) ?></b>.
        </div>

        <div class="cert-footer">
            <div class="sign-box">
                <strong>Jainal Abedin (Sagor)</strong>
                <span>Course Instructor & Trainer</span>
            </div>

            <div class="barcode-box">
                <div class="barcode-bars"></div>
                <small style="font-weight:700; color:#0f766e;">VERIFIED: <?= h($cert['verification_code']) ?></small>
            </div>

            <div class="sign-box">
                <strong>DR. A.K.M Lokman</strong>
                <span>Senior Teacher & Chief Administrator</span>
            </div>
        </div>
    </div>
</div>
</body>
</html>

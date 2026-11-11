<?php
require_once __DIR__ . '/../config/db.php';
$id = (int)($_GET['id'] ?? 0);
$stmt = get_db()->prepare("SELECT * FROM payments WHERE id=?");
$stmt->execute([$id]);
$inv = $stmt->fetch();
if (!$inv) {
    die("Invoice not found.");
}
?>
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <title>Money Receipt - <?= h($inv['receipt_no']) ?> | <?= h(setting('site_name')) ?></title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background:#f1f5f9; padding:30px; color:#0f172a; }
        .memo-box { max-width:750px; margin:0 auto; background:#fff; border:2px solid #0f766e; border-radius:12px; padding:32px; box-shadow:0 10px 30px rgba(0,0,0,0.08); }
        .memo-header { display:flex; justify-content:space-between; align-items:center; border-bottom:2px dashed #0f766e; padding-bottom:18px; margin-bottom:20px; }
        .memo-header img { width:70px; height:70px; border-radius:50%; border:2px solid #0f766e; }
        .memo-title { text-align:center; flex:1; }
        .memo-title h1 { margin:0; color:#0f766e; font-size:1.7rem; }
        .memo-title p { margin:3px 0; font-size:0.88rem; color:#475569; }
        .memo-badge { background:#0f766e; color:#fff; padding:6px 14px; border-radius:20px; font-weight:700; font-size:0.9rem; }
        .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px; font-size:0.95rem; }
        table { width:100%; border-collapse:collapse; margin-bottom:24px; }
        th, td { border:1px solid #cbd5e1; padding:12px; text-align:left; }
        th { background:#f8fafc; }
        .sign-row { display:flex; justify-content:space-between; margin-top:45px; padding-top:10px; }
        .sign-col { border-top:1px solid #334155; width:200px; text-align:center; font-size:0.88rem; padding-top:6px; }
        @media print {
            body { background:#fff; padding:0; }
            .no-print { display:none !important; }
            .memo-box { box-shadow:none; }
        }
    </style>
</head>
<body>
<div class="no-print" style="max-width:750px; margin:0 auto 15px; display:flex; justify-content:space-between;">
    <a href="payments.php" style="text-decoration:none; color:#0f766e; font-weight:700;">&larr; পেমেন্ট তালিকায় ফিরে যান</a>
    <button onclick="window.print()" style="background:#0f766e; color:#fff; border:none; padding:8px 18px; border-radius:6px; cursor:pointer; font-weight:700;">🖨️ মানি রিসিপ্ট প্রিন্ট করুন</button>
</div>
<div class="memo-box">
    <div class="memo-header">
        <img src="../assets/img/logo.png" alt="Logo">
        <div class="memo-title">
            <h1><?= h(setting('site_name', 'AMADER GRAM')) ?></h1>
            <p><?= h(setting('address_bn')) ?></p>
            <p>মোবাইলঃ <?= h(setting('phone_1')) ?>, <?= h(setting('phone_2')) ?> | ইমেইলঃ <?= h(setting('email_1')) ?></p>
        </div>
        <div class="memo-badge">CASH MEMO</div>
    </div>
    <div class="info-grid">
        <div><strong>রিসিপ্ট নং (Receipt No):</strong> <?= h($inv['receipt_no']) ?></div>
        <div style="text-align:right;"><strong>তারিখ (Date):</strong> <?= h($inv['payment_date']) ?></div>
        <div><strong>শিক্ষার্থীর নাম:</strong> <?= h($inv['student_name']) ?></div>
        <div style="text-align:right;"><strong>রেজিস্ট্রেশন নং:</strong> <?= h($inv['reg_no']) ?></div>
        <div><strong>পেমেন্ট মাধ্যম:</strong> <?= h($inv['payment_method']) ?> (<?= h($inv['trx_id']) ?>)</div>
        <div style="text-align:right;"><strong>স্ট্যাটাস:</strong> <?= h($inv['status']) ?></div>
    </div>
    <table>
        <thead>
            <tr>
                <th>বিবরণ (Description / Course)</th>
                <th>পেমেন্টের ধরন</th>
                <th>মোট কোর্স ফি</th>
                <th>জমা (Paid)</th>
                <th>বকেয়া (Due)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong><?= h($inv['course_name']) ?></strong><br><small><?= h($inv['remarks']) ?></small></td>
                <td><?= h($inv['payment_type']) ?></td>
                <td>৳ <?= number_format((float)$inv['total_fee'], 2) ?></td>
                <td style="color:#15803d; font-weight:700;">৳ <?= number_format((float)$inv['paid_amount'], 2) ?></td>
                <td style="color:#dc2626; font-weight:700;">৳ <?= number_format((float)$inv['due_amount'], 2) ?></td>
            </tr>
        </tbody>
    </table>
    <div class="sign-row">
        <div class="sign-col">শিক্ষার্থীর স্বাক্ষর (Student Signature)</div>
        <div class="sign-col">কর্তৃপক্ষের স্বাক্ষর (<?= h($inv['collected_by'] ?: 'Authorized Signature') ?>)</div>
    </div>
</div>
</body>
</html>

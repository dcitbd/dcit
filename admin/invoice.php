<?php
require_once __DIR__ . '/../config/db.php';
$id = (int)($_GET['id'] ?? 0);
$receipt_no = trim($_GET['receipt_no'] ?? '');
$auto_print = isset($_GET['auto_print']) && $_GET['auto_print'] == '1';

$pdo = get_db();
if ($id > 0) {
    $stmt = $pdo->prepare("SELECT p.*, s.roll_no, s.father_name, s.phone AS stu_phone, s.batch_no FROM payments p LEFT JOIN students s ON p.reg_no = s.reg_no WHERE p.id=?");
    $stmt->execute([$id]);
} else {
    $stmt = $pdo->prepare("SELECT p.*, s.roll_no, s.father_name, s.phone AS stu_phone, s.batch_no FROM payments p LEFT JOIN students s ON p.reg_no = s.reg_no WHERE p.receipt_no=?");
    $stmt->execute([$receipt_no]);
}
$inv = $stmt->fetch();
if (!$inv) {
    die("ভাউচার / মানি রিসিপ্ট পাওয়া যায়নি (Invoice not found).");
}

function bn_words_amount(float $amount): string {
    $n = (int)round($amount);
    if ($n <= 0) return 'শূন্য টাকা মাত্র';
    $ones = ['', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ',
        'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোল', 'সতেরো', 'আঠারো', 'উনিশ', 'বিশ',
        'একুশ', 'বাইশ', 'তেইশ', 'চব্বিশ', 'পঁচিশ', 'ছাব্বিশ', 'সাতাশ', 'আটাশ', 'ঊনত্রিশ', 'ত্রিশ',
        'একত্রিশ', 'বত্রিশ', 'তেত্রিশ', 'চৌত্রিশ', 'পঁয়ত্রিশ', 'ছত্রিশ', 'সাঁইত্রিশ', 'আটত্রিশ', 'ঊনচল্লিশ', 'চল্লিশ',
        'একচল্লিশ', 'বিয়াল্লিশ', 'তেতাল্লিশ', 'চুয়াল্লিশ', 'পঁয়তাল্লিশ', 'ছেচল্লিশ', 'সাতচল্লিশ', 'আটচল্লিশ', 'ঊনপঞ্চাশ', 'পঞ্চাশ',
        'একান্ন', 'বায়ান্ন', 'তিপ্পান্ন', 'চুয়ান্ন', 'পঞ্চান্ন', 'ছাপ্পান্ন', 'সাতান্ন', 'আটান্ন', 'ঊনষাট', 'ষাট',
        'একষট্টি', 'বাষট্টি', 'তেষট্টি', 'চৌষট্টি', 'পঁয়ষট্টি', 'ছেষট্টি', 'সাতষট্টি', 'আটষট্টি', 'ঊনসত্তর', 'সত্তর',
        'একাত্তর', 'বাহাত্তর', 'তিয়াত্তর', 'চুয়াত্তর', 'পঁচাত্তর', 'ছিয়াত্তর', 'সাতাত্তর', 'আটাত্তর', 'ঊনআশি', 'আশি',
        'একাশি', 'বিরাশি', 'তিরাশি', 'চুরাশি', 'পঁচাশি', 'ছিয়াশি', 'সাতাশি', 'আটাশি', 'ঊননব্বই', 'নব্বই',
        'একানব্বই', 'বিরানব্বই', 'তিরানব্বই', 'চুরানব্বই', 'পঁচানব্বই', 'ছিয়ানব্বই', 'সাতানব্বই', 'আটানব্বই', 'নিরানব্বই'];
    $parts = [];
    if ($n >= 100000) {
        $lakh = intdiv($n, 100000);
        $parts[] = ($ones[$lakh] ?? $lakh) . ' লক্ষ';
        $n %= 100000;
    }
    if ($n >= 1000) {
        $th = intdiv($n, 1000);
        $parts[] = ($ones[$th] ?? $th) . ' হাজার';
        $n %= 1000;
    }
    if ($n >= 100) {
        $hun = intdiv($n, 100);
        $parts[] = ($ones[$hun] ?? $hun) . 'শত';
        $n %= 100;
    }
    if ($n > 0) {
        $parts[] = $ones[$n] ?? (string)$n;
    }
    return implode(' ', $parts) . ' টাকা মাত্র';
}

function render_voucher_box(array $inv, string $copy_label): void {
    $is_paid = ((float)$inv['due_amount']) <= 0;
    $paid_words = bn_words_amount((float)$inv['paid_amount']);
    ?>
    <div class="memo-box">
        <div class="watermark <?= $is_paid ? 'paid' : 'due' ?>"><?= $is_paid ? 'PAID / পরিশোধিত' : 'DUE / বকেয়া' ?></div>
        <div class="memo-header">
            <img src="../assets/img/logo.jpg" alt="Logo">
            <div class="memo-title">
                <h1><?= h(setting('site_name_bn', 'ড্রিম ক্যারিয়ার আইটি')) ?> (<?= h(setting('site_name', 'Dream Career IT')) ?>)</h1>
                <p><?= h(setting('address_bn', 'ভাই ভাই সুপার মার্কেট, নতুন পদুয়ার বাজার মসজিদের পাশে, পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা - ৩৫০০')) ?></p>
                <p>মোবাইলঃ <?= h(setting('phone_1', '01771770044')) ?>, <?= h(setting('phone_2', '01879653143')) ?> | ইমেইলঃ <?= h(setting('email_1', 'dc13edubd@gmail.com')) ?></p>
            </div>
            <div style="text-align:right;">
                <div class="memo-badge">মানি রিসিপ্ট / ক্যাশ ভাউচার</div>
                <div class="copy-tag"><?= h($copy_label) ?></div>
            </div>
        </div>
        <div class="info-grid">
            <div><strong>ভাউচার / রিসিপ্ট নং:</strong> <?= h($inv['receipt_no']) ?></div>
            <div style="text-align:right;"><strong>তারিখ (Date):</strong> <?= h($inv['payment_date']) ?></div>
            <div><strong>শিক্ষার্থীর নাম:</strong> <?= h($inv['student_name']) ?></div>
            <div style="text-align:right;"><strong>রেজিঃ নং:</strong> <?= h($inv['reg_no']) ?> <?= !empty($inv['roll_no']) ? '| <strong>রোলঃ</strong> ' . h($inv['roll_no']) : '' ?></div>
            <div><strong>পিতার নাম:</strong> <?= h($inv['father_name'] ?? '-') ?></div>
            <div style="text-align:right;"><strong>মোবাইল:</strong> <?= h($inv['stu_phone'] ?? setting('phone_1', '01771770044')) ?></div>
            <div><strong>পেমেন্ট মাধ্যম:</strong> <?= h($inv['payment_method']) ?> (<?= h($inv['trx_id']) ?>)</div>
            <div style="text-align:right;"><strong>স্ট্যাটাস:</strong> <span style="color:<?= $is_paid ? '#15803d' : '#dc2626' ?>;font-weight:800;"><?= h($inv['status']) ?></span></div>
        </div>
        <table>
            <thead>
                <tr>
                    <th style="width:50px;">ক্রমিক</th>
                    <th>বিবরণ (Description / Course)</th>
                    <th>পেমেন্টের ধরন</th>
                    <th style="text-align:right;">মোট কোর্স ফি</th>
                    <th style="text-align:right;">জমা (Paid)</th>
                    <th style="text-align:right;">বকেয়া (Due)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>০১</td>
                    <td>
                        <strong><?= h($inv['course_name']) ?></strong> <?= !empty($inv['batch_no']) ? '(' . h($inv['batch_no']) . ')' : '' ?><br>
                        <small><?= h($inv['remarks'] ?: 'কোর্স ফি ও পেমেন্ট ভাউচার') ?></small>
                    </td>
                    <td><?= h($inv['payment_type']) ?></td>
                    <td style="text-align:right;">৳ <?= number_format((float)$inv['total_fee'], 2) ?></td>
                    <td style="text-align:right; color:#15803d; font-weight:800;">৳ <?= number_format((float)$inv['paid_amount'], 2) ?></td>
                    <td style="text-align:right; color:#dc2626; font-weight:800;">৳ <?= number_format((float)$inv['due_amount'], 2) ?></td>
                </tr>
            </tbody>
        </table>
        <div class="words-bar">
            <span><strong>কথায় (পরিশোধিত):</strong> <?= h($paid_words) ?></span>
            <span><strong>মোট পরিশোধঃ ৳ <?= number_format((float)$inv['paid_amount'], 2) ?></strong></span>
        </div>
        <div class="sign-row">
            <div class="sign-col">শিক্ষার্থী / অভিভাবকের স্বাক্ষর</div>
            <div class="sign-col">আদায়কারীর স্বাক্ষর (<?= h($inv['collected_by'] ?: 'Admin') ?>)</div>
            <div class="sign-col">কর্তৃপক্ষের স্বাক্ষর ও সিল</div>
        </div>
        <div class="footer-note">
            <span>কম্পিউটার জেনারেটেড অফিশিয়াল মানি রিসিপ্ট / ভাউচার — <?= h(setting('site_name', 'Dream Career IT')) ?></span>
            <span>ভেরিফিকেশন আইডি: <?= h($inv['receipt_no']) ?></span>
        </div>
    </div>
    <?php
}
?>
<!DOCTYPE html>
<html lang="bn">
<head>
    <link rel="stylesheet" href="https://fonts.maateen.me/solaiman-lipi/font.css">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <link rel="icon" type="image/x-icon" href="../favicon.ico">
    <link rel="shortcut icon" type="image/x-icon" href="../favicon.ico">
    <link rel="icon" type="image/png" sizes="64x64" href="../assets/img/favicon.png">
    <link rel="apple-touch-icon" sizes="180x180" href="../assets/img/apple-touch-icon.png">
    <meta charset="UTF-8">
    <title>ভাউচার / মানি রিসিপ্ট - <?= h($inv['receipt_no']) ?> | <?= h(setting('site_name', 'Dream Career IT')) ?></title>
    <style>
        body { font-family: 'SolaimanLipi', 'Segoe UI', sans-serif; background:#f1f5f9; padding:24px; color:#0f172a; }
        .top-toolbar { max-width:800px; margin:0 auto 16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; background:#fff; padding:12px 18px; border-radius:10px; border:1px solid #cbd5e1; }
        .btn-act { background:#0f766e; color:#fff; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:700; font-family:inherit; text-decoration:none; display:inline-flex; align-items:center; gap:6px; }
        .btn-act.secondary { background:#151442; }
        .btn-act.outline { background:#fff; color:#0f766e; border:1px solid #0f766e; }
        .memo-box { max-width:800px; margin:0 auto 18px; background:#fff; border:2px solid #0f766e; border-radius:12px; padding:26px 30px; box-shadow:0 10px 30px rgba(0,0,0,0.08); position:relative; overflow:hidden; }
        .watermark { position:absolute; top:54%; left:50%; transform:translate(-50%, -50%) rotate(-18deg); font-size:3.2rem; font-weight:900; opacity:0.07; pointer-events:none; white-space:nowrap; }
        .watermark.paid { color:#15803d; }
        .watermark.due { color:#dc2626; }
        .memo-header { display:flex; justify-content:space-between; align-items:center; border-bottom:2px dashed #0f766e; padding-bottom:14px; margin-bottom:16px; position:relative; z-index:1; }
        .memo-header img { width:68px; height:68px; border-radius:50%; border:2px solid #0f766e; object-fit:cover; }
        .memo-title { text-align:center; flex:1; padding:0 12px; }
        .memo-title h1 { margin:0; color:#0f766e; font-size:1.45rem; }
        .memo-title p { margin:3px 0; font-size:0.84rem; color:#475569; }
        .memo-badge { background:linear-gradient(135deg,#151442,#0f766e); color:#fff; padding:6px 14px; border-radius:20px; font-weight:700; font-size:0.84rem; display:inline-block; margin-bottom:6px; }
        .copy-tag { background:#f1f5f9; border:1px solid #cbd5e1; color:#0f172a; padding:3px 10px; border-radius:12px; font-size:0.75rem; font-weight:700; display:block; }
        .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px 16px; margin-bottom:16px; font-size:0.9rem; background:#f8fafc; padding:12px 16px; border-radius:8px; border:1px solid #e2e8f0; position:relative; z-index:1; }
        table { width:100%; border-collapse:collapse; margin-bottom:14px; position:relative; z-index:1; }
        th, td { border:1px solid #94a3b8; padding:10px 12px; text-align:left; font-size:0.88rem; }
        th { background:#151442; color:#fff; }
        .words-bar { background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:8px 14px; font-size:0.88rem; margin-bottom:16px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px; position:relative; z-index:1; }
        .sign-row { display:flex; justify-content:space-between; margin-top:38px; padding-top:8px; position:relative; z-index:1; }
        .sign-col { border-top:1.5px solid #334155; width:30%; text-align:center; font-size:0.82rem; font-weight:700; padding-top:5px; }
        .footer-note { margin-top:12px; padding-top:8px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; font-size:0.75rem; color:#64748b; }
        .cut-line { max-width:800px; margin:14px auto; border-top:2px dashed #64748b; text-align:center; }
        .cut-line span { background:#f1f5f9; padding:0 12px; position:relative; top:-10px; font-size:0.76rem; color:#475569; font-weight:700; }
        #dualCopySection { display:none; }
        @media print {
            @page { size: A4 portrait; margin: 10mm; }
            body { background:#fff; padding:0; }
            .no-print { display:none !important; }
            .memo-box { box-shadow:none; margin-bottom:10px; padding:20px 24px; page-break-inside:avoid; -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
            th { background:#151442 !important; color:#fff !important; -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
            .cut-line span { background:#fff; }
        }
    </style>
</head>
<body>
<div class="top-toolbar no-print">
    <a href="payments.php" class="btn-act outline">&larr; পেমেন্ট ও হিসাব তালিকায় ফিরে যান</a>
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button type="button" onclick="setDualCopy(false); window.print();" class="btn-act">🖨️ সিঙ্গেল কপি প্রিন্ট</button>
        <button type="button" onclick="setDualCopy(true); window.print();" class="btn-act secondary">🖨️ ডুয়াল কপি প্রিন্ট (অফিস + স্টুডেন্ট)</button>
    </div>
</div>

<?php render_voucher_box($inv, 'স্টুডেন্ট কপি (Student Copy)'); ?>

<div id="dualCopySection">
    <div class="cut-line"><span>✂️ এখান থেকে কাটুন (Cut Here) ✂️</span></div>
    <?php render_voucher_box($inv, 'অফিস কপি (Office Copy)'); ?>
</div>

<script src="../assets/js/panel.js"></script>
<script>
function setDualCopy(show) {
    var el = document.getElementById('dualCopySection');
    if (el) el.style.display = show ? 'block' : 'none';
}
<?php if ($auto_print): ?>
window.addEventListener('load', function () {
    setTimeout(function () { window.print(); }, 250);
});
<?php endif; ?>
</script>
</body>
</html>
<?php
require_once __DIR__ . '/config/db.php';
$pdo = get_db();

$reg_q = trim($_POST['reg_no'] ?? $_GET['reg_no'] ?? '');
$sec_q = strtoupper(trim($_POST['secret_code'] ?? $_GET['secret_code'] ?? ''));
$err_msg = '';
$verified_cert = null;

if ($reg_q !== '' || $sec_q !== '') {
    $stmt = $pdo->prepare("SELECT * FROM students WHERE reg_no = ? OR roll_no = ? LIMIT 1");
    $stmt->execute([$reg_q, $reg_q]);
    $st = $stmt->fetch();

    if (!$st) {
        $err_msg = 'প্রদত্ত রেজিস্ট্রেশন বা রোল নম্বরের সাথে কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি।';
    } elseif (!is_student_course_completed($st)) {
        $err_msg = 'দুঃখিত! এই শিক্ষার্থীর কোর্স এখনো সম্পন্ন হয়নি। শুধুমাত্র কোর্স সম্পন্নকারী ও উত্তীর্ণ শিক্ষার্থীরাই সার্টিফিকেট প্রিন্ট করতে পারবেন।';
    } elseif (is_student_failed($st)) {
        $err_msg = 'দুঃখিত! এই শিক্ষার্থী পরীক্ষায় অকৃতকার্য (ফেইল) হওয়ায় সার্টিফিকেট প্রিন্ট প্রযোজ্য নয়।';
    } else {
        $cstmt = $pdo->prepare("SELECT * FROM certificates WHERE reg_no = ? AND status = 'Issued' LIMIT 1");
        $cstmt->execute([$st['reg_no']]);
        $cert = $cstmt->fetch();
        $expected_code = strtoupper(trim((string)($st['secret_code'] ?: ($cert['secret_code'] ?? ''))));

        if ($sec_q === '' || $expected_code === '' || $sec_q !== $expected_code) {
            $err_msg = 'প্রদত্ত গোপন কোড (Secret Code) সঠিক নয়। অনুগ্রহ করে আপনার সঠিক গোপন কোড প্রদান করুন।';
        } else {
            $verified_cert = $cert ?: [
                'cert_no' => 'DCIT-' . ($st['batch_year'] ?: date('Y')) . '-' . $st['reg_no'],
                'reg_no' => $st['reg_no'],
                'roll_no' => $st['roll_no'],
                'secret_code' => $st['secret_code'],
                'student_name' => $st['name'],
                'father_name' => $st['father_name'],
                'mother_name' => $st['mother_name'],
                'course_name' => $st['course_name'],
                'batch_year' => $st['batch_year'],
                'session_quarter' => $st['session_quarter'],
                'duration' => $st['course_duration'] ?: '3 Months',
                'grade' => $st['result_grade'],
                'cgpa' => $st['cgpa'],
                'issue_date' => date('Y-m-d'),
                'verification_code' => 'VER-DCIT-' . $st['reg_no']
            ];
        }
    }
}

$page_title = 'সার্টিফিকেট ভেরিফিকেশন ও প্রিন্ট (Certificate Verification)';
require_once __DIR__ . '/includes/header.php';
?>
<div class="page-hero-strip">
    <div class="container">
        <h1>সার্টিফিকেট ভেরিফিকেশন ও প্রিন্ট</h1>
        <p>রেজিস্ট্রেশন বা রোল নম্বর এবং গোপন কোড দিয়ে অনলাইনে সার্টিফিকেট যাচাই ও প্রিন্ট করুন</p>
    </div>
</div>

<section class="section">
    <div class="container" style="max-width:820px;">
        <?php if ($err_msg !== ''): ?>
            <div class="alert alert-danger"><i class="fa fa-exclamation-triangle"></i> <?= h($err_msg) ?></div>
        <?php endif; ?>

        <div class="form-card" style="border-top:5px solid #ea580c; margin-bottom:28px;">
            <h3 style="margin-bottom:14px; color:#151442;"><i class="fa fa-shield" style="color:#ea580c;"></i> সার্টিফিকেট যাচাই ও প্রিন্ট ফর্ম</h3>
            <form method="post" action="certificates.php">
                <div class="form-grid">
                    <div class="form-group">
                        <label>রেজিস্ট্রেশন অথবা রোল নম্বর *</label>
                        <input type="text" name="reg_no" class="form-control" value="<?= h($reg_q) ?>" required placeholder="রেজিস্ট্রেশন বা রোল নম্বর লিখুন">
                    </div>
                    <div class="form-group">
                        <label>গোপন কোড (Secret Code) *</label>
                        <input type="text" name="secret_code" maxlength="20" class="form-control" value="<?= h($sec_q) ?>" required placeholder="আপনার গোপন কোড লিখুন" style="text-transform:uppercase; font-weight:800;">
                    </div>
                </div>
                <button type="submit" class="btn btn-accent" style="width:100%;"><i class="fa fa-check-circle"></i> সার্টিফিকেট যাচাই ও প্রিন্ট করুন</button>
            </form>
        </div>

        <?php if ($verified_cert): ?>
            <div class="form-card" style="border:2px solid #0f766e;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
                    <div>
                        <span class="badge badge-success"><i class="fa fa-check-circle"></i> ভেরিফিকেশন সফল</span>
                        <h3 style="color:#151442; margin-top:6px;"><?= h($verified_cert['student_name']) ?> — <?= h($verified_cert['course_name']) ?></h3>
                        <p style="color:#475569;">সার্টিফিকেট নং: <strong><?= h($verified_cert['cert_no']) ?></strong> | রেজিঃ নং: <strong><?= h($verified_cert['reg_no']) ?></strong> | গ্রেড: <strong><?= h($verified_cert['grade']) ?></strong></p>
                    </div>
                    <form method="post" action="certificate-view.php" target="_blank">
                        <input type="hidden" name="reg_no" value="<?= h($verified_cert['reg_no']) ?>">
                        <input type="hidden" name="secret_code" value="<?= h($sec_q) ?>">
                        <button type="submit" class="btn btn-accent"><i class="fa fa-print"></i> সার্টিফিকেট প্রিন্ট করুন</button>
                    </form>
                </div>
            </div>
        <?php endif; ?>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>

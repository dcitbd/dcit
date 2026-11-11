<?php
require_once __DIR__ . '/config/db.php';
$pdo = get_db();

$reg_q = trim($_GET['reg_no'] ?? '');
$name_q = trim($_GET['name'] ?? '');
$course_q = trim($_GET['course'] ?? '');
$session_q = trim($_GET['session'] ?? '');

$found_student = null;
$found_cert = null;
$searched = false;

if ($reg_q !== '' || $name_q !== '') {
    $searched = true;
    $sql = "SELECT * FROM students WHERE 1=1";
    $params = [];
    if ($reg_q !== '') {
        $sql .= " AND (reg_no = ? OR roll_no = ?)";
        $params[] = $reg_q;
        $params[] = $reg_q;
    }
    if ($name_q !== '') {
        $sql .= " AND name LIKE ?";
        $params[] = '%' . $name_q . '%';
    }
    if ($course_q !== '') {
        $sql .= " AND course_name LIKE ?";
        $params[] = '%' . $course_q . '%';
    }
    if ($session_q !== '') {
        $sql .= " AND session_quarter = ?";
        $params[] = $session_q;
    }
    $sql .= " LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $found_student = $stmt->fetch();

    if ($found_student) {
        $cstmt = $pdo->prepare("SELECT * FROM certificates WHERE reg_no = ? LIMIT 1");
        $cstmt->execute([$found_student['reg_no']]);
        $found_cert = $cstmt->fetch();
    }
}

$courses_list = $pdo->query("SELECT title FROM courses ORDER BY sort_order ASC")->fetchAll();
$page_title = 'অনলাইন রেজাল্ট (Student Result)';
require_once __DIR__ . '/includes/header.php';
?>
<div class="page-hero-strip">
    <div class="container">
        <h1>অনলাইন রেজাল্ট ও মার্কশিট</h1>
        <p>রেজিস্ট্রেশন নম্বর (যেমন: 000001) অথবা নাম দিয়ে আপনার কোর্সের ফলাফল দেখুন</p>
    </div>
</div>

<section class="section">
    <div class="container" style="max-width:850px;">
        <div class="form-card" style="margin-bottom:30px;">
            <h3 style="margin-bottom:16px; color:#0f766e;"><i class="fa fa-search"></i> আপনার ফলাফল খুঁজুন (Check Result)</h3>
            <form method="get" action="result.php">
                <div class="form-grid">
                    <div class="form-group">
                        <label>রেজিস্ট্রেশন বা রোল নম্বর (Registration No) *</label>
                        <input type="text" name="reg_no" class="form-control" value="<?= h($reg_q ?: '000001') ?>" placeholder="যেমন: 000001">
                    </div>
                    <div class="form-group">
                        <label>শিক্ষার্থীর নাম (ঐচ্ছিক)</label>
                        <input type="text" name="name" class="form-control" value="<?= h($name_q) ?>" placeholder="আপনার নাম লিখুন">
                    </div>
                    <div class="form-group">
                        <label>কোর্স / বিষয় (ঐচ্ছিক)</label>
                        <select name="course" class="form-control">
                            <option value="">-- সকল কোর্স --</option>
                            <?php foreach ($courses_list as $c): ?>
                                <option value="<?= h($c['title']) ?>" <?= $course_q === $c['title'] ? 'selected' : '' ?>><?= h($c['title']) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>সেশন (ঐচ্ছিক)</label>
                        <select name="session" class="form-control">
                            <option value="">-- সকল সেশন --</option>
                            <?php foreach (['January to March', 'April to June', 'July to September', 'October to December'] as $sq): ?>
                                <option value="<?= h($sq) ?>" <?= $session_q === $sq ? 'selected' : '' ?>><?= h($sq) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary"><i class="fa fa-check-circle"></i> ফলাফল দেখুন (Submit)</button>
            </form>
        </div>

        <?php if ($searched): ?>
            <?php if ($found_student): ?>
                <div class="form-card" style="border:2px solid #0f766e;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px; border-bottom:2px dashed #cbd5e1; padding-bottom:16px; margin-bottom:20px;">
                        <div style="display:flex; align-items:center; gap:14px;">
                            <img src="<?= h($found_student['photo'] ?: 'assets/img/home-icon.png') ?>" style="width:75px; height:75px; border-radius:50%; object-fit:cover; border:3px solid #0f766e;">
                            <div>
                                <h2 style="color:#0f172a;"><?= h($found_student['name']) ?></h2>
                                <p style="color:#475569;">রেজিস্ট্রেশন নং: <strong><?= h($found_student['reg_no']) ?></strong> | রোল নং: <strong><?= h($found_student['roll_no']) ?></strong></p>
                            </div>
                        </div>
                        <div style="text-align:right;">
                            <span class="badge badge-success" style="font-size:1.15rem; padding:8px 18px;">
                                ফলাফলঃ <?= h($found_student['result_grade']) ?> (GPA: <?= h($found_student['cgpa']) ?>)
                            </span>
                        </div>
                    </div>

                    <div class="table-responsive" style="box-shadow:none; margin-bottom:20px;">
                        <table class="data-table" style="min-width:100%;">
                            <tbody>
                                <tr><th style="width:35%;">পিতার নাম (Father's Name)</th><td><?= h($found_student['father_name']) ?></td></tr>
                                <tr><th>মাতার নাম (Mother's Name)</th><td><?= h($found_student['mother_name']) ?></td></tr>
                                <tr><th>কোর্সের নাম (Course Name)</th><td><strong><?= h($found_student['course_name']) ?></strong></td></tr>
                                <tr><th>ব্যাচ ও সেশন (Session)</th><td><?= h($found_student['session_quarter']) ?> - <?= (int)$found_student['batch_year'] ?> (<?= h($found_student['batch_type']) ?>)</td></tr>
                                <tr><th>ক্লাস টাইম (Schedule)</th><td><?= h($found_student['class_slot']) ?></td></tr>
                                <tr><th>অর্জিত গ্রেড (Grade / CGPA)</th><td><strong style="color:#15803d; font-size:1.1rem;"><?= h($found_student['result_grade']) ?> (<?= h($found_student['cgpa']) ?>)</strong></td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div style="display:flex; gap:12px; flex-wrap:wrap;">
                        <a href="biodata.php?reg_no=<?= urlencode($found_student['reg_no']) ?>" class="btn btn-outline" style="color:#0f172a; border-color:#cbd5e1;">
                            <i class="fa fa-id-card-o"></i> সম্পূর্ণ বায়োডাটা দেখুন
                        </a>
                        <?php if ($found_cert): ?>
                            <a href="certificate-view.php?cert_no=<?= urlencode($found_cert['cert_no']) ?>" target="_blank" rel="noopener noreferrer" class="btn btn-accent">
                                <i class="fa fa-certificate"></i> অফিসিয়াল সার্টিফিকেট ভিউ ও প্রিন্ট করুন
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
            <?php else: ?>
                <div class="alert alert-danger">দুঃখিত! প্রদত্ত তথ্যের সাথে কোনো শিক্ষার্থীর ফলাফল পাওয়া যায়নি। সঠিক রেজিস্ট্রেশন নম্বর (যেমন: 000001 থেকে 000006) দিয়ে আবার চেষ্টা করুন।</div>
            <?php endif; ?>
        <?php endif; ?>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>

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

    if ($found_student && is_student_passed($found_student)) {
        $cstmt = $pdo->prepare("SELECT * FROM certificates WHERE reg_no = ? AND status = 'Issued' LIMIT 1");
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
        <p>আপনার রেজিস্ট্রেশন নম্বর দিয়ে কোর্সের চূড়ান্ত ফলাফল দেখুন এবং উত্তীর্ণ শিক্ষার্থীরা গোপন কোড দিয়ে সার্টিফিকেট প্রিন্ট করুন</p>
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
                        <input type="text" name="reg_no" class="form-control" value="<?= h($reg_q) ?>" required placeholder="আপনার রেজিস্ট্রেশন নম্বর লিখুন">
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
                <?php if (!is_student_course_completed($found_student)): ?>
                    <div class="alert alert-danger" style="border-left:5px solid #dc2626;">
                        <i class="fa fa-exclamation-circle"></i> দুঃখিত! শিক্ষার্থী <strong><?= h($found_student['name']) ?></strong> (রেজিঃ নং: <strong><?= h($found_student['reg_no']) ?></strong>)-এর কোর্স এখনো সম্পন্ন হয়নি। শুধুমাত্র কোর্স সম্পন্নকারী শিক্ষার্থীরাই ফলাফল দেখতে পারবেন।
                    </div>
                <?php else:
                    $failed = is_student_failed($found_student);
                ?>
                    <div class="form-card" style="border:2px solid <?= $failed ? '#dc2626' : '#0f766e' ?>;">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px; border-bottom:2px dashed #cbd5e1; padding-bottom:16px; margin-bottom:20px;">
                            <div style="display:flex; align-items:center; gap:14px;">
                                <img src="<?= h($found_student['photo'] ?: 'assets/img/logo.jpg') ?>" style="width:75px; height:75px; border-radius:50%; object-fit:cover; border:3px solid <?= $failed ? '#dc2626' : '#0f766e' ?>;">
                                <div>
                                    <h2 style="color:#0f172a;"><?= h($found_student['name']) ?></h2>
                                    <p style="color:#475569;">রেজিস্ট্রেশন নং: <strong><?= h($found_student['reg_no']) ?></strong> | রোল নং: <strong><?= h($found_student['roll_no']) ?></strong></p>
                                </div>
                            </div>
                            <div style="text-align:right;">
                                <?php if ($failed): ?>
                                    <span class="badge badge-danger" style="font-size:1.15rem; padding:8px 18px;">
                                        ফলাফলঃ ফেইল (Fail) (GPA: 0.00)
                                    </span>
                                <?php else: ?>
                                    <span class="badge badge-success" style="font-size:1.15rem; padding:8px 18px;">
                                        ফলাফলঃ <?= h($found_student['result_grade']) ?> (GPA: <?= h($found_student['cgpa']) ?>)
                                    </span>
                                <?php endif; ?>
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
                                    <tr>
                                        <th>অর্জিত গ্রেড (Grade / CGPA)</th>
                                        <td>
                                            <?php if ($failed): ?>
                                                <strong style="color:#dc2626; font-size:1.1rem;">ফেইল (Fail — GPA: 0.00)</strong>
                                            <?php else: ?>
                                                <strong style="color:#15803d; font-size:1.1rem;"><?= h($found_student['result_grade']) ?> (<?= h($found_student['cgpa']) ?>)</strong>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <?php if ($failed): ?>
                            <div class="alert alert-danger" style="margin-bottom:0;">
                                <i class="fa fa-ban"></i> ফলাফল অকৃতকার্য (ফেইল) হওয়ায় সার্টিফিকেট প্রিন্ট প্রযোজ্য নয়। শুধুমাত্র উত্তীর্ণ শিক্ষার্থীরাই গোপন কোড দিয়ে সার্টিফিকেট প্রিন্ট করতে পারবেন।
                            </div>
                        <?php else: ?>
                            <div style="background:#f0fdfa; padding:18px; border-radius:10px; border:1px solid #99f6e4;">
                                <h4 style="color:#0f766e; margin-bottom:10px;"><i class="fa fa-key"></i> গোপন কোড দিয়ে অফিসিয়াল সার্টিফিকেট প্রিন্ট করুন</h4>
                                <form method="post" action="certificate-view.php" target="_blank" style="display:flex; gap:10px; flex-wrap:wrap;">
                                    <input type="hidden" name="reg_no" value="<?= h($found_student['reg_no']) ?>">
                                    <input type="text" name="secret_code" maxlength="20" class="form-control" required placeholder="আপনার গোপন কোড (Secret Code) লিখুন" style="flex:1; min-width:220px; text-transform:uppercase; font-weight:700;">
                                    <button type="submit" class="btn btn-accent"><i class="fa fa-print"></i> সার্টিফিকেট প্রিন্ট করুন</button>
                                </form>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            <?php else: ?>
                <div class="alert alert-danger">দুঃখিত! প্রদত্ত তথ্যের সাথে কোনো শিক্ষার্থীর ফলাফল পাওয়া যায়নি। সঠিক রেজিস্ট্রেশন নম্বর দিয়ে আবার চেষ্টা করুন।</div>
            <?php endif; ?>
        <?php endif; ?>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>

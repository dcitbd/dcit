<?php
require_once __DIR__ . '/../config/db.php';
require_admin();
$pdo = get_db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $act = $_POST['form_action'] ?? '';
    if ($act === 'save') {
        $id = (int)($_POST['id'] ?? 0);
        $cert_no = trim($_POST['cert_no'] ?? '');
        $reg_no = trim($_POST['reg_no'] ?? '');
        $student_name = trim($_POST['student_name'] ?? '');
        $father_name = trim($_POST['father_name'] ?? '');
        $mother_name = trim($_POST['mother_name'] ?? '');
        $course_name = trim($_POST['course_name'] ?? '');
        $batch_year = (int)($_POST['batch_year'] ?? date('Y'));
        $session_quarter = trim($_POST['session_quarter'] ?? 'January to March');
        $duration = trim($_POST['duration'] ?? '3 Months');
        $grade = trim($_POST['grade'] ?? 'A+');
        $issue_date = trim($_POST['issue_date'] ?? date('Y-m-d'));
        $verification_code = trim($_POST['verification_code'] ?? ('VER-DCIT-' . $reg_no));
        $status = trim($_POST['status'] ?? 'Issued');

        if ($id > 0) {
            $stmt = $pdo->prepare("UPDATE certificates SET cert_no=?, reg_no=?, student_name=?, father_name=?, mother_name=?, course_name=?, batch_year=?, session_quarter=?, duration=?, grade=?, issue_date=?, verification_code=?, status=? WHERE id=?");
            $stmt->execute([$cert_no, $reg_no, $student_name, $father_name, $mother_name, $course_name, $batch_year, $session_quarter, $duration, $grade, $issue_date, $verification_code, $status, $id]);
            set_flash('success', 'সার্টিফিকেট সফলভাবে আপডেট করা হয়েছে!');
        } else {
            $stmt = $pdo->prepare("INSERT INTO certificates (cert_no, reg_no, student_name, father_name, mother_name, course_name, batch_year, session_quarter, duration, grade, issue_date, verification_code, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$cert_no, $reg_no, $student_name, $father_name, $mother_name, $course_name, $batch_year, $session_quarter, $duration, $grade, $issue_date, $verification_code, $status]);
            set_flash('success', 'নতুন সার্টিফিকেট সফলভাবে ইস্যু করা হয়েছে!');
        }
        header("Location: certificates.php");
        exit;
    } elseif ($act === 'delete') {
        $id = (int)($_POST['id'] ?? 0);
        $pdo->prepare("DELETE FROM certificates WHERE id=?")->execute([$id]);
        set_flash('success', 'সার্টিফিকেট মুছে ফেলা হয়েছে।');
        header("Location: certificates.php");
        exit;
    }
}

$edit_item = null;
if (isset($_GET['edit'])) {
    $stmt = $pdo->prepare("SELECT * FROM certificates WHERE id=?");
    $stmt->execute([(int)$_GET['edit']]);
    $edit_item = $stmt->fetch();
}

$students_list = $pdo->query("SELECT * FROM students ORDER BY id DESC")->fetchAll();
$courses_list  = $pdo->query("SELECT title FROM courses ORDER BY sort_order ASC")->fetchAll();
$certs         = $pdo->query("SELECT * FROM certificates ORDER BY id DESC")->fetchAll();
$next_cert_id  = count($certs) + 1;
$default_cert_no = 'DCIT-' . date('Y') . '-' . str_pad((string)$next_cert_id, 6, '0', STR_PAD_LEFT);
$default_ver_code = 'VER-DCIT-' . str_pad((string)$next_cert_id, 6, '0', STR_PAD_LEFT);

$page_title = 'সার্টিফিকেট ম্যানেজমেন্ট (Certificates)';
require_once __DIR__ . '/header.php';
?>
<div class="panel-card">
    <div class="panel-header">
        <h3><i class="fa fa-certificate"></i> <?= $edit_item ? 'সার্টিফিকেট তথ্য সম্পাদনা করুন' : 'নতুন সার্টিফিকেট ইস্যু করুন' ?></h3>
        <?php if ($edit_item): ?>
            <a href="certificates.php" class="btn btn-outline btn-xs">নতুন ফর্ম</a>
        <?php endif; ?>
    </div>
    <div class="panel-body">
        <form method="post">
            <input type="hidden" name="form_action" value="save">
            <input type="hidden" name="id" value="<?= (int)($edit_item['id'] ?? 0) ?>">

            <?php if (!$edit_item): ?>
            <div class="form-group" style="background:#f0fdf4; padding:12px; border-radius:8px; border:1px dashed #16a34a;">
                <label><i class="fa fa-magic"></i> স্টুডেন্ট তালিকা থেকে অটো-ফিল করুন (ঐচ্ছিক):</label>
                <select id="student_preset" class="form-control">
                    <option value="">-- উত্তীর্ণ শিক্ষার্থী নির্বাচন করুন --</option>
                    <?php foreach ($students_list as $st): if (!is_student_passed($st)) continue; ?>
                        <option value="<?= (int)$st['id'] ?>"
                                data-reg="<?= h($st['reg_no']) ?>"
                                data-name="<?= h($st['name']) ?>"
                                data-father="<?= h($st['father_name']) ?>"
                                data-mother="<?= h($st['mother_name']) ?>"
                                data-course="<?= h($st['course_name']) ?>"
                                data-year="<?= (int)$st['batch_year'] ?>"
                                data-session="<?= h($st['session_quarter']) ?>"
                                data-grade="<?= h($st['result_grade']) ?>">
                            <?= h($st['reg_no']) ?> - <?= h($st['name']) ?> (<?= h($st['course_name']) ?>)
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
            <?php endif; ?>

            <div class="form-grid">
                <div class="form-group">
                    <label>সার্টিফিকেট নং *</label>
                    <input type="text" name="cert_no" class="form-control" required value="<?= h($edit_item['cert_no'] ?? $default_cert_no) ?>">
                </div>
                <div class="form-group">
                    <label>রেজিস্ট্রেশন নং (Registration No) *</label>
                    <input type="text" id="reg_no" name="reg_no" class="form-control" required value="<?= h($edit_item['reg_no'] ?? '') ?>" placeholder="রেজিস্ট্রেশন নম্বর লিখুন">
                </div>
                <div class="form-group">
                    <label>শিক্ষার্থীর নাম (Student Name) *</label>
                    <input type="text" id="student_name" name="student_name" class="form-control" required value="<?= h($edit_item['student_name'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>পিতার নাম (Father's Name)</label>
                    <input type="text" id="father_name" name="father_name" class="form-control" value="<?= h($edit_item['father_name'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>মাতার নাম (Mother's Name)</label>
                    <input type="text" id="mother_name" name="mother_name" class="form-control" value="<?= h($edit_item['mother_name'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>কোর্সের নাম (Course Name) *</label>
                    <input type="text" id="course_name" name="course_name" list="course_opts" class="form-control" required value="<?= h($edit_item['course_name'] ?? 'Advance Microsoft Office') ?>">
                    <datalist id="course_opts">
                        <?php foreach ($courses_list as $c): ?>
                            <option value="<?= h($c['title']) ?>">
                        <?php endforeach; ?>
                    </datalist>
                </div>
                <div class="form-group">
                    <label>ব্যাচ সাল (Batch Year)</label>
                    <input type="number" id="batch_year" name="batch_year" class="form-control" value="<?= (int)($edit_item['batch_year'] ?? date('Y')) ?>">
                </div>
                <div class="form-group">
                    <label>সেশন (Session)</label>
                    <select id="session_quarter" name="session_quarter" class="form-control">
                        <?php foreach (['January to March', 'April to June', 'July to September', 'October to December'] as $sq): ?>
                            <option value="<?= h($sq) ?>" <?= ($edit_item['session_quarter'] ?? '') === $sq ? 'selected' : '' ?>><?= h($sq) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label>কোর্স মেয়াদ (Duration)</label>
                    <input type="text" name="duration" class="form-control" value="<?= h($edit_item['duration'] ?? '3 Months') ?>">
                </div>
                <div class="form-group">
                    <label>রেজাল্ট / গ্রেড (Grade) *</label>
                    <input type="text" id="grade" name="grade" class="form-control" required value="<?= h($edit_item['grade'] ?? 'A+') ?>">
                </div>
                <div class="form-group">
                    <label>ইস্যু তারিখ (Issue Date) *</label>
                    <input type="date" name="issue_date" class="form-control" required value="<?= h($edit_item['issue_date'] ?? date('Y-m-d')) ?>">
                </div>
                <div class="form-group">
                    <label>বারকোড / ভেরিফিকেশন কোড *</label>
                    <input type="text" name="verification_code" class="form-control" required value="<?= h($edit_item['verification_code'] ?? $default_ver_code) ?>">
                </div>
                <div class="form-group">
                    <label>স্ট্যাটাস</label>
                    <select name="status" class="form-control">
                        <?php foreach (['Issued', 'Pending', 'Revoked'] as $st): ?>
                            <option value="<?= $st ?>" <?= ($edit_item['status'] ?? 'Issued') === $st ? 'selected' : '' ?>><?= $st ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>
            <button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> <?= $edit_item ? 'আপডেট সংরক্ষণ করুন' : 'সার্টিফিকেট ইস্যু করুন' ?></button>
        </form>
    </div>
</div>

<div class="panel-card">
    <div class="panel-header">
        <h3><i class="fa fa-list"></i> সকল সার্টিফিকেট তালিকা (<?= count($certs) ?> টি)</h3>
    </div>
    <div class="dcp-table-wrap">
        <table class="dcp-table">
            <thead>
                <tr>
                    <th>সার্টিফিকেট নং</th>
                    <th>রেজিঃ নং</th>
                    <th>শিক্ষার্থীর নাম</th>
                    <th>পিতা ও মাতা</th>
                    <th>কোর্স ও সেশন</th>
                    <th>গ্রেড</th>
                    <th>ইস্যু তারিখ</th>
                    <th>স্ট্যাটাস</th>
                    <th>অ্যাকশন</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($certs as $c): ?>
                <tr>
                    <td><strong><?= h($c['cert_no']) ?></strong><br><small style="color:#64748b;"><?= h($c['verification_code']) ?></small></td>
                    <td><strong><?= h($c['reg_no']) ?></strong></td>
                    <td><?= h($c['student_name']) ?></td>
                    <td><small>পিতা: <?= h($c['father_name']) ?><br>মাতা: <?= h($c['mother_name']) ?></small></td>
                    <td><?= h($c['course_name']) ?><br><small><?= h($c['session_quarter']) ?> (<?= (int)$c['batch_year'] ?>)</small></td>
                    <td><span class="badge badge-success"><?= h($c['grade']) ?></span></td>
                    <td><?= h($c['issue_date']) ?></td>
                    <td><span class="badge <?= $c['status'] === 'Issued' ? 'badge-success' : 'badge-warning' ?>"><?= h($c['status']) ?></span></td>
                    <td style="white-space:nowrap;">
                        <a href="../certificate-view.php?cert_no=<?= urlencode($c['cert_no']) ?>" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-xs"><i class="fa fa-print"></i> প্রিন্ট/ভিউ</a>
                        <a href="certificates.php?edit=<?= (int)$c['id'] ?>" class="btn btn-outline btn-xs"><i class="fa fa-edit"></i></a>
                        <form method="post" style="display:inline;" onsubmit="return confirm('আপনি কি নিশ্চিতভাবে এই সার্টিফিকেট মুছে ফেলতে চান?');">
                            <input type="hidden" name="form_action" value="delete">
                            <input type="hidden" name="id" value="<?= (int)$c['id'] ?>">
                            <button type="submit" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>
<?php require_once __DIR__ . '/footer.php'; ?>

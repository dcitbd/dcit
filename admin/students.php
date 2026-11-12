<?php
require_once __DIR__ . '/../config/db.php';
require_admin();
$pdo = get_db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $act = $_POST['form_action'] ?? '';
    if ($act === 'save') {
        $id = (int)($_POST['id'] ?? 0);
        $reg_no = trim($_POST['reg_no'] ?? next_reg_no());
        $roll_no = trim($_POST['roll_no'] ?? next_roll_no());
        $name = trim($_POST['name'] ?? '');
        $father_name = trim($_POST['father_name'] ?? '');
        $mother_name = trim($_POST['mother_name'] ?? '');
        $present_address = trim($_POST['present_address'] ?? '');
        $permanent_address = trim($_POST['permanent_address'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $dob = trim($_POST['dob'] ?? '');
        $religion = trim($_POST['religion'] ?? 'Muslim');
        $marital_status = trim($_POST['marital_status'] ?? 'Un-Married');
        $height = trim($_POST['height'] ?? '5.6"');
        $weight = trim($_POST['weight'] ?? '55 KG');
        $blood_group = trim($_POST['blood_group'] ?? 'O+');
        $education = trim($_POST['education'] ?? '');
        $school_college = trim($_POST['school_college'] ?? '');
        $experience = trim($_POST['experience'] ?? '');
        $course_name = trim($_POST['course_name'] ?? 'Advance Microsoft Office');
        $batch_year = (int)($_POST['batch_year'] ?? date('Y'));
        $session_quarter = trim($_POST['session_quarter'] ?? 'January to March');
        $batch_type = trim($_POST['batch_type'] ?? 'New Batch');
        $class_slot = trim($_POST['class_slot'] ?? '8:00 AM - 9:30 AM');
        $result_grade = trim($_POST['result_grade'] ?? 'A+');
        $cgpa = trim($_POST['cgpa'] ?? '5.00');
        $status = trim($_POST['status'] ?? 'Active');
        if (in_array(strtolower($result_grade), ['fail', 'f'], true)) {
            $exam_status = 'ফেইল করেছে';
            $cgpa = '0.00';
            $status = 'Completed';
        } elseif (in_array(strtolower($result_grade), ['pending', 'running'], true)) {
            $exam_status = 'নতুন স্টুডেন্ট';
            $cgpa = '0.00';
            $status = 'Active';
        } else {
            $exam_status = 'পাস করেছে';
            $status = 'Completed';
        }
        $existing_photo = trim($_POST['existing_photo'] ?? 'assets/img/logo.jpg');
        $photo = handle_image_upload('photo_file', $existing_photo);

        if ($id > 0) {
            $stmt = $pdo->prepare("UPDATE students SET reg_no=?, roll_no=?, name=?, father_name=?, mother_name=?, present_address=?, permanent_address=?, phone=?, email=?, dob=?, religion=?, marital_status=?, height=?, weight=?, blood_group=?, education=?, school_college=?, experience=?, course_name=?, batch_year=?, session_quarter=?, batch_type=?, class_slot=?, result_grade=?, cgpa=?, photo=?, status=?, exam_status=? WHERE id=?");
            $stmt->execute([$reg_no, $roll_no, $name, $father_name, $mother_name, $present_address, $permanent_address, $phone, $email, $dob, $religion, $marital_status, $height, $weight, $blood_group, $education, $school_college, $experience, $course_name, $batch_year, $session_quarter, $batch_type, $class_slot, $result_grade, $cgpa, $photo, $status, $exam_status, $id]);
            set_flash('success', 'স্টুডেন্ট ও বায়োডাটা সফলভাবে আপডেট হয়েছে!');
        } else {
            $pw = hash_password_custom('123456');
            $stmt = $pdo->prepare("INSERT INTO students (reg_no, roll_no, name, father_name, mother_name, present_address, permanent_address, phone, email, dob, religion, marital_status, height, weight, blood_group, education, school_college, experience, course_name, batch_year, session_quarter, batch_type, class_slot, result_grade, cgpa, photo, password_hash, status, exam_status, secret_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$reg_no, $roll_no, $name, $father_name, $mother_name, $present_address, $permanent_address, $phone, $email, $dob, $religion, $marital_status, $height, $weight, $blood_group, $education, $school_college, $experience, $course_name, $batch_year, $session_quarter, $batch_type, $class_slot, $result_grade, $cgpa, $photo, $pw, $status, $exam_status, 'DC' . substr((string)$batch_year, -2) . 'STD' . substr($reg_no, -3)]);
            set_flash('success', 'নতুন স্টুডেন্ট সফলভাবে যুক্ত করা হয়েছে!');
        }
        header("Location: students.php");
        exit;
    } elseif ($act === 'delete') {
        $id = (int)($_POST['id'] ?? 0);
        $pdo->prepare("DELETE FROM students WHERE id=?")->execute([$id]);
        set_flash('success', 'স্টুডেন্ট রেকর্ড মুছে ফেলা হয়েছে।');
        header("Location: students.php");
        exit;
    }
}

$edit_student = null;
if (isset($_GET['edit'])) {
    $stmt = $pdo->prepare("SELECT * FROM students WHERE id=?");
    $stmt->execute([(int)$_GET['edit']]);
    $edit_student = $stmt->fetch();
}

$courses_list = $pdo->query("SELECT title FROM courses ORDER BY sort_order ASC")->fetchAll();
$slots_list   = $pdo->query("SELECT time_label FROM classes ORDER BY sort_order ASC")->fetchAll();
$students     = $pdo->query("SELECT * FROM students ORDER BY id DESC")->fetchAll();

$page_title = 'স্টুডেন্ট, বায়োডাটা ও রেজাল্ট ম্যানেজমেন্ট';
require_once __DIR__ . '/header.php';
?>
<div class="panel-card">
    <div class="panel-header">
        <h3><i class="fa fa-graduation-cap"></i> <?= $edit_student ? 'স্টুডেন্ট তথ্য ও বায়োডাটা সম্পাদনা' : 'নতুন স্টুডেন্ট, বায়োডাটা ও রেজাল্ট যোগ করুন' ?></h3>
        <?php if ($edit_student): ?>
            <a href="students.php" class="btn btn-outline btn-xs">নতুন স্টুডেন্ট ফর্ম</a>
        <?php endif; ?>
    </div>
    <div class="panel-body">
        <form method="post" enctype="multipart/form-data">
            <input type="hidden" name="form_action" value="save">
            <input type="hidden" name="id" value="<?= (int)($edit_student['id'] ?? 0) ?>">
            <input type="hidden" name="existing_photo" value="<?= h($edit_student['photo'] ?? 'assets/img/logo.jpg') ?>">

            <div class="form-grid">
                <div class="form-group">
                    <label>রেজিস্ট্রেশন নং (Reg No) *</label>
                    <input type="text" name="reg_no" class="form-control" required value="<?= h($edit_student['reg_no'] ?? next_reg_no()) ?>">
                </div>
                <div class="form-group">
                    <label>রোল নং (Roll No) *</label>
                    <input type="text" name="roll_no" class="form-control" required value="<?= h($edit_student['roll_no'] ?? next_roll_no()) ?>">
                </div>
                <div class="form-group">
                    <label>শিক্ষার্থীর পূর্ণ নাম *</label>
                    <input type="text" name="name" class="form-control" required value="<?= h($edit_student['name'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>পিতার নাম (Father's Name)</label>
                    <input type="text" name="father_name" class="form-control" value="<?= h($edit_student['father_name'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>মাতার নাম (Mother's Name)</label>
                    <input type="text" name="mother_name" class="form-control" value="<?= h($edit_student['mother_name'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>মোবাইল নম্বর *</label>
                    <input type="text" name="phone" class="form-control" required value="<?= h($edit_student['phone'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>ইমেইল (Gmail)</label>
                    <input type="email" name="email" class="form-control" value="<?= h($edit_student['email'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>জন্ম তারিখ (Date of Birth)</label>
                    <input type="date" name="dob" class="form-control" value="<?= h($edit_student['dob'] ?? '2002-01-01') ?>">
                </div>
                <div class="form-group">
                    <label>কোর্সের নাম *</label>
                    <select name="course_name" class="form-control">
                        <?php foreach ($courses_list as $c): ?>
                            <option value="<?= h($c['title']) ?>" <?= ($edit_student['course_name'] ?? '') === $c['title'] ? 'selected' : '' ?>><?= h($c['title']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label>ক্লাস টাইম স্লট (Class Time)</label>
                    <select name="class_slot" class="form-control">
                        <?php foreach ($slots_list as $sl): ?>
                            <option value="<?= h($sl['time_label']) ?>" <?= ($edit_student['class_slot'] ?? '') === $sl['time_label'] ? 'selected' : '' ?>><?= h($sl['time_label']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label>ব্যাচের ধরন (Batch Type)</label>
                    <select name="batch_type" class="form-control">
                        <option value="New Batch" <?= ($edit_student['batch_type'] ?? '') === 'New Batch' ? 'selected' : '' ?>>New Batch (চলমান ব্যাচ)</option>
                        <option value="Old Batch" <?= ($edit_student['batch_type'] ?? '') === 'Old Batch' ? 'selected' : '' ?>>Old Batch (পুরাতন ব্যাচ)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>ব্যাচ সাল (Batch Year: 2010-2026+)</label>
                    <input type="number" name="batch_year" class="form-control" value="<?= (int)($edit_student['batch_year'] ?? date('Y')) ?>">
                </div>
                <div class="form-group">
                    <label>সেশন (Session Quarter)</label>
                    <select name="session_quarter" class="form-control">
                        <?php foreach (['January to March', 'April to June', 'July to September', 'October to December'] as $sq): ?>
                            <option value="<?= h($sq) ?>" <?= ($edit_student['session_quarter'] ?? '') === $sq ? 'selected' : '' ?>><?= h($sq) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label>রেজাল্ট / গ্রেড (Result Grade)</label>
                    <select name="result_grade" class="form-control">
                        <?php foreach (['A+', 'A', 'A-', 'B', 'C', 'Passed', 'Fail', 'Pending'] as $gr): ?>
                            <option value="<?= $gr ?>" <?= ($edit_student['result_grade'] ?? 'A+') === $gr ? 'selected' : '' ?>><?= $gr ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label>সিজিপিএ / পয়েন্ট (GPA)</label>
                    <input type="text" name="cgpa" class="form-control" value="<?= h($edit_student['cgpa'] ?? '5.00') ?>">
                </div>
                <div class="form-group">
                    <label>ধর্ম (Religion)</label>
                    <select name="religion" class="form-control">
                        <?php foreach (['Muslim', 'Hindu', 'Buddhist', 'Christian', 'Others'] as $rel): ?>
                            <option value="<?= $rel ?>" <?= ($edit_student['religion'] ?? 'Muslim') === $rel ? 'selected' : '' ?>><?= $rel ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label>বৈবাহিক অবস্থা (Marital Status)</label>
                    <select name="marital_status" class="form-control">
                        <option value="Un-Married" <?= ($edit_student['marital_status'] ?? '') === 'Un-Married' ? 'selected' : '' ?>>Un-Married</option>
                        <option value="Married" <?= ($edit_student['marital_status'] ?? '') === 'Married' ? 'selected' : '' ?>>Married</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>উচ্চতা ও ওজন (Height & Weight)</label>
                    <div style="display:flex; gap:6px;">
                        <input type="text" name="height" class="form-control" placeholder='5.8"' value="<?= h($edit_student['height'] ?? '5.7"') ?>">
                        <input type="text" name="weight" class="form-control" placeholder="58 KG" value="<?= h($edit_student['weight'] ?? '58 KG') ?>">
                    </div>
                </div>
                <div class="form-group">
                    <label>শিক্ষাগত যোগ্যতা (Education)</label>
                    <input type="text" name="education" class="form-control" value="<?= h($edit_student['education'] ?? 'HSC') ?>">
                </div>
                <div class="form-group">
                    <label>স্কুল / কলেজ / ইউনিভার্সিটি</label>
                    <input type="text" name="school_college" class="form-control" value="<?= h($edit_student['school_college'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>বর্তমান ঠিকানা (Present Address)</label>
                    <input type="text" name="present_address" class="form-control" value="<?= h($edit_student['present_address'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>স্থায়ী ঠিকানা (Permanent Address)</label>
                    <input type="text" name="permanent_address" class="form-control" value="<?= h($edit_student['permanent_address'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>অভিজ্ঞতা ও দক্ষতা (Experience for Bio-Data)</label>
                    <input type="text" name="experience" class="form-control" value="<?= h($edit_student['experience'] ?? 'MS Office, Internet, Email & Freelancing') ?>">
                </div>
                <div class="form-group">
                    <label>স্টুডেন্ট ছবি (Passport Photo)</label>
                    <input type="file" name="photo_file" class="form-control" accept="image/*">
                </div>
                <div class="form-group">
                    <label>স্ট্যাটাস</label>
                    <select name="status" class="form-control">
                        <?php foreach (['Active', 'Completed', 'Dropped'] as $st): ?>
                            <option value="<?= $st ?>" <?= ($edit_student['status'] ?? 'Active') === $st ? 'selected' : '' ?>><?= $st ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>
            <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> <?= $edit_student ? 'স্টুডেন্ট তথ্য আপডেট করুন' : 'নতুন স্টুডেন্ট সংরক্ষণ করুন' ?></button>
        </form>
    </div>
</div>

<div class="panel-card">
    <div class="panel-header">
        <h3><i class="fa fa-users"></i> সকল স্টুডেন্ট, বায়োডাটা ও রেজাল্ট তালিকা (<?= count($students) ?> জন)</h3>
    </div>
    <div class="dcp-table-wrap">
        <table class="dcp-table">
            <thead>
                <tr>
                    <th>ছবি</th>
                    <th>রেজিঃ ও রোল</th>
                    <th>শিক্ষার্থীর নাম ও পিতা</th>
                    <th>মোবাইল</th>
                    <th>কোর্স ও ক্লাস টাইম</th>
                    <th>ব্যাচ ও সেশন</th>
                    <th>রেজাল্ট</th>
                    <th>স্ট্যাটাস</th>
                    <th>অ্যাকশন</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($students as $s): ?>
                <tr>
                    <td><img src="../<?= h($s['photo'] ?: 'assets/img/logo.jpg') ?>" style="width:40px; height:40px; border-radius:50%; object-fit:cover;"></td>
                    <td><strong>Reg: <?= h($s['reg_no']) ?></strong><br><small>Roll: <?= h($s['roll_no']) ?></small></td>
                    <td><strong><?= h($s['name']) ?></strong><br><small>পিতা: <?= h($s['father_name']) ?></small></td>
                    <td><?= h($s['phone']) ?></td>
                    <td><?= h($s['course_name']) ?><br><small><i class="fa fa-clock-o"></i> <?= h($s['class_slot']) ?></small></td>
                    <td><?= h($s['batch_type']) ?> (<?= (int)$s['batch_year'] ?>)<br><small><?= h($s['session_quarter']) ?></small></td>
                    <td><span class="badge badge-success"><?= h($s['result_grade']) ?> (<?= h($s['cgpa']) ?>)</span></td>
                    <td><span class="badge <?= $s['status'] === 'Active' ? 'badge-info' : 'badge-success' ?>"><?= h($s['status']) ?></span></td>
                    <td style="white-space:nowrap;">
                        <a href="../biodata.php?reg_no=<?= urlencode($s['reg_no']) ?>" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-xs" title="বায়োডাটা দেখুন"><i class="fa fa-id-card-o"></i> বায়োডাটা</a>
                        <a href="students.php?edit=<?= (int)$s['id'] ?>" class="btn btn-primary btn-xs"><i class="fa fa-edit"></i></a>
                        <form method="post" style="display:inline;" onsubmit="return confirm('আপনি কি এই স্টুডেন্ট রেকর্ড মুছে ফেলতে চান?');">
                            <input type="hidden" name="form_action" value="delete">
                            <input type="hidden" name="id" value="<?= (int)$s['id'] ?>">
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

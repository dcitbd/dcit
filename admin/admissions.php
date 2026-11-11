<?php
require_once __DIR__ . '/../config/db.php';
require_admin();
$pdo = get_db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $act = $_POST['form_action'] ?? '';
    $id  = (int)($_POST['id'] ?? 0);

    if ($act === 'approve_enroll' && $id > 0) {
        $stmt = $pdo->prepare("SELECT * FROM admissions WHERE id=?");
        $stmt->execute([$id]);
        $adm = $stmt->fetch();
        if ($adm && $adm['status'] !== 'Approved') {
            $new_reg = next_reg_no();
            $new_roll = next_roll_no();
            $pw = hash_password_custom('123456');

            // Insert into students
            $ins = $pdo->prepare("INSERT INTO students (reg_no, roll_no, name, father_name, present_address, permanent_address, phone, email, dob, religion, education, school_college, course_name, batch_year, session_quarter, batch_type, class_slot, result_grade, cgpa, password_hash, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New Batch', ?, 'Running', '0.00', ?, 'Active')");
            $ins->execute([
                $new_reg, $new_roll, $adm['full_name'], $adm['father_name'], $adm['address'], $adm['address'],
                $adm['phone'], $adm['email'], $adm['dob'], $adm['religion'], $adm['education'], $adm['school_college'],
                $adm['course_name'], (int)$adm['batch_year'], $adm['session_quarter'], $adm['preferred_slot'], $pw
            ]);

            // Also log payment if paid_amount > 0
            $c_stmt = $pdo->prepare("SELECT fee FROM courses WHERE title=? LIMIT 1");
            $c_stmt->execute([$adm['course_name']]);
            $c_fee = (float)($c_stmt->fetchColumn() ?: 1500);
            $paid = (float)$adm['paid_amount'];
            $due = max(0, $c_fee - $paid);
            $inv_no = 'INV-' . date('Y') . '-' . mt_rand(100, 999);
            $p_status = $due <= 0 ? 'Paid' : ($paid > 0 ? 'Partial' : 'Due');

            $p_ins = $pdo->prepare("INSERT INTO payments (receipt_no, reg_no, student_name, course_name, total_fee, paid_amount, due_amount, payment_type, payment_method, trx_id, payment_date, remarks, collected_by, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'Admission Fee', ?, ?, ?, 'Online Admission Approved', ?, ?)");
            $p_ins->execute([$inv_no, $new_reg, $adm['full_name'], $adm['course_name'], $c_fee, $paid, $due, $adm['payment_method'], $adm['trx_id'], date('Y-m-d'), $_SESSION['admin_name'] ?? 'Admin', $p_status]);

            $pdo->prepare("UPDATE admissions SET status='Approved', enrolled_reg_no=? WHERE id=?")->execute([$new_reg, $id]);
            set_flash('success', "ভর্তি আবেদন অনুমোদিত হয়েছে! স্টুডেন্ট রেজিঃ নং: {$new_reg} এবং রোল: {$new_roll} তৈরি হয়েছে।");
        }
        header("Location: admissions.php");
        exit;
    } elseif ($act === 'reject' && $id > 0) {
        $pdo->prepare("UPDATE admissions SET status='Rejected' WHERE id=?")->execute([$id]);
        set_flash('success', 'আবেদনটি বাতিল (Rejected) হিসেবে চিহ্নিত করা হয়েছে।');
        header("Location: admissions.php");
        exit;
    } elseif ($act === 'delete' && $id > 0) {
        $pdo->prepare("DELETE FROM admissions WHERE id=?")->execute([$id]);
        set_flash('success', 'ভর্তি আবেদন মুছে ফেলা হয়েছে।');
        header("Location: admissions.php");
        exit;
    }
}

$admissions = $pdo->query("SELECT * FROM admissions ORDER BY id DESC")->fetchAll();
$page_title = 'অনলাইন ভর্তি ম্যানেজমেন্ট (Online Admissions)';
require_once __DIR__ . '/header.php';
?>
<div class="panel-card">
    <div class="panel-header">
        <h3><i class="fa fa-user-plus"></i> অনলাইন ভর্তি আবেদন তালিকা (<?= count($admissions) ?> টি)</h3>
        <a href="../admission.php" target="_blank" class="btn btn-outline btn-xs"><i class="fa fa-external-link"></i> ভর্তি ফর্ম পেজ দেখুন</a>
    </div>
    <div class="adm-table-wrap">
        <table class="adm-table">
            <thead>
                <tr>
                    <th>আবেদন নং ও তারিখ</th>
                    <th>আবেদনকারীর নাম ও পিতা</th>
                    <th>মোবাইল ও ঠিকানা</th>
                    <th>শিক্ষাগত যোগ্যতা ও প্রতিষ্ঠান</th>
                    <th>কোর্স ও পছন্দের টাইম স্লট</th>
                    <th>প্রাথমিক পেমেন্ট</th>
                    <th>স্ট্যাটাস</th>
                    <th>অ্যাকশন</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($admissions as $a): ?>
                <tr>
                    <td><strong><?= h($a['application_no']) ?></strong><br><small><?= h($a['created_at']) ?></small></td>
                    <td><strong><?= h($a['full_name']) ?></strong><br><small>পিতা: <?= h($a['father_name']) ?></small></td>
                    <td><?= h($a['phone']) ?><br><small><?= h($a['address']) ?></small></td>
                    <td><?= h($a['education']) ?> (<?= h($a['religion']) ?>)<br><small><?= h($a['school_college']) ?></small></td>
                    <td><strong><?= h($a['course_name']) ?></strong><br><small><i class="fa fa-clock-o"></i> <?= h($a['preferred_slot']) ?></small></td>
                    <td>৳ <?= number_format((float)$a['paid_amount'], 0) ?><br><small><?= h($a['payment_method']) ?> (<?= h($a['trx_id']) ?>)</small></td>
                    <td>
                        <span class="badge <?= $a['status'] === 'Approved' ? 'badge-success' : ($a['status'] === 'Rejected' ? 'badge-danger' : 'badge-warning') ?>">
                            <?= h($a['status']) ?>
                        </span>
                        <?php if (!empty($a['enrolled_reg_no'])): ?>
                            <br><small style="color:#0f766e; font-weight:700;">Reg: <?= h($a['enrolled_reg_no']) ?></small>
                        <?php endif; ?>
                    </td>
                    <td style="white-space:nowrap;">
                        <?php if ($a['status'] !== 'Approved'): ?>
                        <form method="post" style="display:inline;">
                            <input type="hidden" name="form_action" value="approve_enroll">
                            <input type="hidden" name="id" value="<?= (int)$a['id'] ?>">
                            <button type="submit" class="btn btn-success btn-xs" title="অনুমোদন করে অটোমেটিক স্টুডেন্ট ও পেমেন্ট তৈরি করুন">
                                <i class="fa fa-check"></i> অনুমোদন ও ভর্তি
                            </button>
                        </form>
                        <?php endif; ?>
                        <?php if ($a['status'] === 'Pending'): ?>
                        <form method="post" style="display:inline;">
                            <input type="hidden" name="form_action" value="reject">
                            <input type="hidden" name="id" value="<?= (int)$a['id'] ?>">
                            <button type="submit" class="btn btn-outline btn-xs"><i class="fa fa-times"></i></button>
                        </form>
                        <?php endif; ?>
                        <form method="post" style="display:inline;" onsubmit="return confirm('এই আবেদন মুছে ফেলতে চান?');">
                            <input type="hidden" name="form_action" value="delete">
                            <input type="hidden" name="id" value="<?= (int)$a['id'] ?>">
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

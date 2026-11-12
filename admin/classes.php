<?php
require_once __DIR__ . '/../config/db.php';
require_admin();
$pdo = get_db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $act = $_POST['form_action'] ?? '';
    if ($act === 'save') {
        $id = (int)($_POST['id'] ?? 0);
        $slot_code = trim($_POST['slot_code'] ?? '');
        $time_label = trim($_POST['time_label'] ?? '');
        $batch_name = trim($_POST['batch_name'] ?? '');
        $session_name = trim($_POST['session_name'] ?? 'January to March');
        $batch_year = (int)($_POST['batch_year'] ?? date('Y'));
        $course_name = trim($_POST['course_name'] ?? '');
        $teacher_name = trim($_POST['teacher_name'] ?? '');
        $room_no = trim($_POST['room_no'] ?? 'Lab-01');
        $days_of_week = trim($_POST['days_of_week'] ?? 'Sat, Mon, Wed');
        $rules_text = trim($_POST['rules_text'] ?? '');
        $max_seats = (int)($_POST['max_seats'] ?? 20);
        $status = trim($_POST['status'] ?? 'Active');
        $sort_order = (int)($_POST['sort_order'] ?? 1);

        if ($id > 0) {
            $stmt = $pdo->prepare("UPDATE classes SET slot_code=?, time_label=?, batch_name=?, session_name=?, batch_year=?, course_name=?, teacher_name=?, room_no=?, days_of_week=?, rules_text=?, max_seats=?, status=?, sort_order=? WHERE id=?");
            $stmt->execute([$slot_code, $time_label, $batch_name, $session_name, $batch_year, $course_name, $teacher_name, $room_no, $days_of_week, $rules_text, $max_seats, $status, $sort_order, $id]);
            set_flash('success', 'ক্লাস রুটিন ও ব্যাচ তথ্য আপডেট করা হয়েছে!');
        } else {
            $stmt = $pdo->prepare("INSERT INTO classes (slot_code, time_label, batch_name, session_name, batch_year, course_name, teacher_name, room_no, days_of_week, rules_text, max_seats, status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$slot_code, $time_label, $batch_name, $session_name, $batch_year, $course_name, $teacher_name, $room_no, $days_of_week, $rules_text, $max_seats, $status, $sort_order]);
            set_flash('success', 'নতুন ক্লাস স্লট ও ব্যাচ যুক্ত করা হয়েছে!');
        }
        header("Location: classes.php");
        exit;
    } elseif ($act === 'delete') {
        $id = (int)($_POST['id'] ?? 0);
        $pdo->prepare("DELETE FROM classes WHERE id=?")->execute([$id]);
        set_flash('success', 'ক্লাস স্লট মুছে ফেলা হয়েছে।');
        header("Location: classes.php");
        exit;
    }
}

$edit_cls = null;
if (isset($_GET['edit'])) {
    $stmt = $pdo->prepare("SELECT * FROM classes WHERE id=?");
    $stmt->execute([(int)$_GET['edit']]);
    $edit_cls = $stmt->fetch();
}

$classes_list  = $pdo->query("SELECT * FROM classes ORDER BY sort_order ASC, id ASC")->fetchAll();
$courses_list  = $pdo->query("SELECT title FROM courses ORDER BY sort_order ASC")->fetchAll();
$teachers_list = $pdo->query("SELECT name FROM teachers ORDER BY sort_order ASC")->fetchAll();

$page_title = 'ক্লাস, সময়সূচি ও ব্যাচ ম্যানেজমেন্ট';
require_once __DIR__ . '/header.php';
?>
<div class="panel-card">
    <div class="panel-header">
        <h3><i class="fa fa-clock-o"></i> <?= $edit_cls ? 'ক্লাস টাইম ও ব্যাচ সম্পাদনা' : 'নতুন ক্লাস টাইম স্লট / ব্যাচ যোগ করুন' ?></h3>
        <?php if ($edit_cls): ?>
            <a href="classes.php" class="btn btn-outline btn-xs">নতুন স্লট ফর্ম</a>
        <?php endif; ?>
    </div>
    <div class="panel-body">
        <form method="post">
            <input type="hidden" name="form_action" value="save">
            <input type="hidden" name="id" value="<?= (int)($edit_cls['id'] ?? 0) ?>">
            <div class="form-grid">
                <div class="form-group">
                    <label>স্লট কোড (Slot Code) *</label>
                    <input type="text" name="slot_code" class="form-control" required value="<?= h($edit_cls['slot_code'] ?? '') ?>" placeholder="স্লট কোড লিখুন">
                </div>
                <div class="form-group">
                    <label>ক্লাসের সময় (Time Label) *</label>
                    <input type="text" name="time_label" class="form-control" required value="<?= h($edit_cls['time_label'] ?? '') ?>" placeholder="ক্লাসের সময় লিখুন">
                </div>
                <div class="form-group">
                    <label>ব্যাচের নাম (Batch Name) *</label>
                    <input type="text" name="batch_name" class="form-control" required value="<?= h($edit_cls['batch_name'] ?? 'Morning Batch') ?>">
                </div>
                <div class="form-group">
                    <label>কোর্সের নাম</label>
                    <select name="course_name" class="form-control">
                        <option value="All Courses">All Courses</option>
                        <?php foreach ($courses_list as $c): ?>
                            <option value="<?= h($c['title']) ?>" <?= ($edit_cls['course_name'] ?? '') === $c['title'] ? 'selected' : '' ?>><?= h($c['title']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label>নির্ধারিত শিক্ষক (Teacher)</label>
                    <select name="teacher_name" class="form-control">
                        <?php foreach ($teachers_list as $t): ?>
                            <option value="<?= h($t['name']) ?>" <?= ($edit_cls['teacher_name'] ?? '') === $t['name'] ? 'selected' : '' ?>><?= h($t['name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label>ল্যাব / রুম নং</label>
                    <input type="text" name="room_no" class="form-control" value="<?= h($edit_cls['room_no'] ?? 'Lab-01 (2nd Floor)') ?>">
                </div>
                <div class="form-group">
                    <label>সাপ্তাহিক ক্লাসের দিন</label>
                    <input type="text" name="days_of_week" class="form-control" value="<?= h($edit_cls['days_of_week'] ?? 'Sat, Mon, Wed') ?>">
                </div>
                <div class="form-group">
                    <label>সেশন ও সাল</label>
                    <div style="display:flex; gap:6px;">
                        <input type="text" name="session_name" class="form-control" value="<?= h($edit_cls['session_name'] ?? 'January to March') ?>">
                        <input type="number" name="batch_year" class="form-control" style="width:95px;" value="<?= (int)($edit_cls['batch_year'] ?? date('Y')) ?>">
                    </div>
                </div>
                <div class="form-group">
                    <label>আসন সংখ্যা (Max Seats)</label>
                    <input type="number" name="max_seats" class="form-control" value="<?= (int)($edit_cls['max_seats'] ?? 20) ?>">
                </div>
                <div class="form-group">
                    <label>ক্রম (Sort Order)</label>
                    <input type="number" name="sort_order" class="form-control" value="<?= (int)($edit_cls['sort_order'] ?? 1) ?>">
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                    <label>ক্লাস রুলস / নিয়মাবলী (Class Rules)</label>
                    <input type="text" name="rules_text" class="form-control" value="<?= h($edit_cls['rules_text'] ?? 'ক্লাস শুরু হওয়ার ১০ মিনিট পূর্বে ল্যাবে উপস্থিত থাকতে হবে।') ?>">
                </div>
            </div>
            <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> সংরক্ষণ করুন</button>
        </form>
    </div>
</div>

<div class="panel-card">
    <div class="panel-header">
        <h3><i class="fa fa-calendar"></i> সকল ক্লাস টাইম স্লট ও রুটিন তালিকা</h3>
    </div>
    <div class="dcp-table-wrap">
        <table class="dcp-table">
            <thead>
                <tr>
                    <th>সময় (Time Slot)</th>
                    <th>ব্যাচ ও সেশন</th>
                    <th>কোর্স ও শিক্ষক</th>
                    <th>ল্যাব ও বার</th>
                    <th>ভর্তিকৃত স্টুডেন্ট</th>
                    <th>ক্লাস রুলস</th>
                    <th>অ্যাকশন</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($classes_list as $cl):
                    $cnt_st = $pdo->prepare("SELECT COUNT(*) FROM students WHERE class_slot=?");
                    $cnt_st->execute([$cl['time_label']]);
                    $enrolled_cnt = (int)$cnt_st->fetchColumn();
                ?>
                <tr>
                    <td><strong><?= h($cl['time_label']) ?></strong><br><small>Code: <?= h($cl['slot_code']) ?></small></td>
                    <td><?= h($cl['batch_name']) ?><br><small><?= h($cl['session_name']) ?> (<?= (int)$cl['batch_year'] ?>)</small></td>
                    <td><strong><?= h($cl['course_name']) ?></strong><br><small><i class="fa fa-user"></i> <?= h($cl['teacher_name']) ?></small></td>
                    <td><?= h($cl['room_no']) ?><br><small><?= h($cl['days_of_week']) ?></small></td>
                    <td><span class="badge badge-info"><?= $enrolled_cnt ?> / <?= (int)$cl['max_seats'] ?> জন</span></td>
                    <td><small><?= h($cl['rules_text']) ?></small></td>
                    <td style="white-space:nowrap;">
                        <a href="../batches.php?slot=<?= urlencode($cl['time_label']) ?>" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-xs"><i class="fa fa-eye"></i> ভিউ</a>
                        <a href="classes.php?edit=<?= (int)$cl['id'] ?>" class="btn btn-primary btn-xs"><i class="fa fa-edit"></i></a>
                        <form method="post" style="display:inline;" onsubmit="return confirm('এই ক্লাস স্লট মুছে ফেলতে চান?');">
                            <input type="hidden" name="form_action" value="delete">
                            <input type="hidden" name="id" value="<?= (int)$cl['id'] ?>">
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

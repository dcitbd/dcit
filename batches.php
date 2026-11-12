<?php
require_once __DIR__ . '/config/db.php';
$pdo = get_db();

$batch_type = trim($_GET['type'] ?? '');
$year_filter = isset($_GET['year']) && $_GET['year'] !== '' ? (int)$_GET['year'] : 0;
$session_filter = trim($_GET['session'] ?? '');
$slot_filter = trim($_GET['slot'] ?? '');

$sql = "SELECT * FROM students WHERE 1=1";
$params = [];
if ($batch_type !== '') {
    $sql .= " AND batch_type = ?";
    $params[] = $batch_type;
}
if ($year_filter > 0) {
    $sql .= " AND batch_year = ?";
    $params[] = $year_filter;
}
if ($session_filter !== '') {
    $sql .= " AND session_quarter = ?";
    $params[] = $session_filter;
}
if ($slot_filter !== '') {
    $sql .= " AND class_slot = ?";
    $params[] = $slot_filter;
}
$sql .= " ORDER BY batch_year DESC, roll_no ASC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$batch_students = $stmt->fetchAll();

$classes_list = $pdo->query("SELECT * FROM classes WHERE status='Active' ORDER BY sort_order ASC")->fetchAll();

$page_title = 'ব্যাচ তালিকা ও ক্লাস রুটিন (Batches & Class Rules)';
require_once __DIR__ . '/includes/header.php';
?>
<div class="page-hero-strip">
    <div class="container">
        <h1>সকল ব্যাচ (২০১০ - <?= date('Y') ?>) ও ক্লাস রুটিন</h1>
        <p>নতুন ব্যাচ, পুরাতন ব্যাচ এবং সকাল ৮টা থেকে রাত ৮:৩০ পর্যন্ত সকল ক্লাসের সময়সূচি ও শিক্ষার্থী তালিকা</p>
    </div>
</div>

<section class="section">
    <div class="container">
        <!-- Dynamic Batch & Year Filter (Replaces 45 static HTML files!) -->
        <form method="get" action="batches.php" class="filter-bar">
            <div class="form-group">
                <label>ব্যাচের ধরন (Batch Type)</label>
                <select name="type" class="form-control">
                    <option value="">-- সকল ব্যাচ (New & Old) --</option>
                    <option value="New Batch" <?= $batch_type === 'New Batch' ? 'selected' : '' ?>>New Batch (চলমান ব্যাচ)</option>
                    <option value="Old Batch" <?= $batch_type === 'Old Batch' ? 'selected' : '' ?>>Old Batch (পুরাতন ব্যাচ)</option>
                </select>
            </div>
            <div class="form-group">
                <label>সাল (Year: 2010 - <?= date('Y') ?>)</label>
                <select name="year" class="form-control">
                    <option value="">-- সকল সাল --</option>
                    <?php for ($y = (int)date('Y'); $y >= 2010; $y--): ?>
                        <option value="<?= $y ?>" <?= $year_filter === $y ? 'selected' : '' ?>><?= $y ?> Batch</option>
                    <?php endfor; ?>
                </select>
            </div>
            <div class="form-group">
                <label>সেশন (Session Quarter)</label>
                <select name="session" class="form-control">
                    <option value="">-- সকল সেশন --</option>
                    <?php foreach (['January to March', 'April to June', 'July to September', 'October to December'] as $sq): ?>
                        <option value="<?= h($sq) ?>" <?= $session_filter === $sq ? 'selected' : '' ?>><?= h($sq) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="form-group">
                <label>ক্লাস টাইম (Class Slot)</label>
                <select name="slot" class="form-control">
                    <option value="">-- সকল ক্লাস টাইম --</option>
                    <?php foreach ($classes_list as $cl): ?>
                        <option value="<?= h($cl['time_label']) ?>" <?= $slot_filter === $cl['time_label'] ? 'selected' : '' ?>><?= h($cl['time_label']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <button type="submit" class="btn btn-primary"><i class="fa fa-filter"></i> ফিল্টার করুন</button>
            <a href="batches.php" class="btn btn-outline" style="color:#334155; border-color:#cbd5e1;">রিসেট</a>
        </form>

        <!-- Filtered Students Table -->
        <div class="table-responsive" style="margin-bottom:48px;">
            <table class="data-table filterable-table">
                <thead>
                    <tr>
                        <th>ক্রমিক (SL)</th>
                        <th>শিক্ষার্থীর নাম (Student Name)</th>
                        <th>রেজিঃ নং</th>
                        <th>রোল (Roll)</th>
                        <th>কোর্স (Course Name)</th>
                        <th>ব্যাচ ও সেশন</th>
                        <th>ক্লাস টাইম</th>
                        <th>ফলাফল (Result)</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($batch_students)): ?>
                        <tr><td colspan="8" style="text-align:center; padding:24px; color:#64748b;">এই ফিল্টারে কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি। এডমিন প্যানেল থেকে নতুন শিক্ষার্থী যোগ করা যাবে।</td></tr>
                    <?php else: ?>
                        <?php foreach ($batch_students as $idx => $s): ?>
                        <tr>
                            <td><?= str_pad((string)($idx + 1), 2, '0', STR_PAD_LEFT) ?></td>
                            <td>
                                <a href="biodata.php?reg_no=<?= urlencode($s['reg_no']) ?>" style="font-weight:700; color:#0f766e;">
                                    <?= h($s['name']) ?>
                                </a>
                            </td>
                            <td><?= h($s['reg_no']) ?></td>
                            <td><?= h($s['roll_no']) ?></td>
                            <td><?= h($s['course_name']) ?></td>
                            <td><?= h($s['session_quarter']) ?> (<?= (int)$s['batch_year'] ?>)</td>
                            <td><span class="badge badge-info"><?= h($s['class_slot']) ?></span></td>
                            <td><?php if (!is_student_course_completed($s)): ?><span class="badge badge-warning">চলমান</span><?php elseif (is_student_failed($s)): ?><span class="badge badge-danger">ফেইল (Fail)</span><?php else: ?><span class="badge badge-success"><?= h($s['result_grade']) ?></span><?php endif; ?></td>
                        </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

        <!-- Class Rules & Time Slots Section -->
        <div id="class-rules">
            <div class="section-header">
                <span class="sub-badge">Class Schedule & Rules</span>
                <h2>ক্লাস রুটিন ও সময়সূচি (Class Rules)</h2>
                <p>প্রতিদিন সকাল ৮:০০ টা থেকে রাত ৮:৩০ টা পর্যন্ত ৭টি শিফটে আমাদের ক্লাস পরিচালিত হয়</p>
            </div>
            <div class="grid-3">
                <?php foreach ($classes_list as $cl): ?>
                <div class="card">
                    <div class="card-body">
                        <span class="badge badge-info" style="align-self:flex-start; margin-bottom:8px;"><i class="fa fa-clock-o"></i> <?= h($cl['time_label']) ?></span>
                        <h3><?= h($cl['batch_name']) ?></h3>
                        <div class="title-bn"><?= h($cl['course_name']) ?></div>
                        <p style="margin-bottom:10px;">
                            <strong>শিক্ষক:</strong> <?= h($cl['teacher_name']) ?><br>
                            <strong>রুম/ল্যাব:</strong> <?= h($cl['room_no']) ?> | <strong>বার:</strong> <?= h($cl['days_of_week']) ?><br>
                            <strong>নিয়মাবলী:</strong> <?= h($cl['rules_text']) ?>
                        </p>
                        <div class="card-footer">
                            <a href="batches.php?slot=<?= urlencode($cl['time_label']) ?>" class="btn btn-primary btn-sm" style="flex:1;">এই শিফটের স্টুডেন্ট দেখুন</a>
                            <a href="admission.php" class="btn btn-accent btn-sm">ভর্তি হোন</a>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>

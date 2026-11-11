<?php
require_once __DIR__ . '/../config/db.php';
require_admin();
$pdo = get_db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $act = $_POST['form_action'] ?? '';
    if ($act === 'save') {
        $id = (int)($_POST['id'] ?? 0);
        $slug = strtolower(trim($_POST['slug'] ?? 'course-' . time()));
        $title = trim($_POST['title'] ?? '');
        $title_bn = trim($_POST['title_bn'] ?? '');
        $fee = (float)($_POST['fee'] ?? 0);
        $duration = trim($_POST['duration'] ?? '3 Months');
        $class_duration = trim($_POST['class_duration'] ?? '1.30 Hours');
        $weekly_days = trim($_POST['weekly_days'] ?? '3 Days / Week');
        $total_classes = (int)($_POST['total_classes'] ?? 36);
        $has_certificate = (int)($_POST['has_certificate'] ?? 1);
        $short_desc = trim($_POST['short_desc'] ?? '');
        $description_bn = trim($_POST['description_bn'] ?? '');
        $topics_raw = trim($_POST['topics_text'] ?? '');
        $topics_arr = array_values(array_filter(array_map('trim', explode("\n", $topics_raw))));
        $topics_json = json_encode($topics_arr, JSON_UNESCAPED_UNICODE);
        $syllabus_json = trim($_POST['syllabus_json'] ?? '[]');
        $existing_img = trim($_POST['existing_image'] ?? 'assets/img/course-msoffice.jpg');
        $image = handle_image_upload('image_file', $existing_img);
        $status = trim($_POST['status'] ?? 'Active');
        $sort_order = (int)($_POST['sort_order'] ?? 1);

        if ($id > 0) {
            $stmt = $pdo->prepare("UPDATE courses SET slug=?, title=?, title_bn=?, fee=?, duration=?, class_duration=?, weekly_days=?, total_classes=?, has_certificate=?, short_desc=?, description_bn=?, topics_json=?, syllabus_json=?, image=?, status=?, sort_order=? WHERE id=?");
            $stmt->execute([$slug, $title, $title_bn, $fee, $duration, $class_duration, $weekly_days, $total_classes, $has_certificate, $short_desc, $description_bn, $topics_json, $syllabus_json, $image, $status, $sort_order, $id]);
            set_flash('success', 'কোর্স তথ্য সফলভাবে আপডেট করা হয়েছে!');
        } else {
            $stmt = $pdo->prepare("INSERT INTO courses (slug, title, title_bn, fee, duration, class_duration, weekly_days, total_classes, has_certificate, short_desc, description_bn, topics_json, syllabus_json, image, status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$slug, $title, $title_bn, $fee, $duration, $class_duration, $weekly_days, $total_classes, $has_certificate, $short_desc, $description_bn, $topics_json, $syllabus_json, $image, $status, $sort_order]);
            set_flash('success', 'নতুন কোর্স সফলভাবে যোগ করা হয়েছে!');
        }
        header("Location: courses.php");
        exit;
    } elseif ($act === 'delete') {
        $id = (int)($_POST['id'] ?? 0);
        $pdo->prepare("DELETE FROM courses WHERE id=?")->execute([$id]);
        set_flash('success', 'কোর্সটি মুছে ফেলা হয়েছে।');
        header("Location: courses.php");
        exit;
    }
}

$edit_course = null;
$edit_topics_text = '';
if (isset($_GET['edit'])) {
    $stmt = $pdo->prepare("SELECT * FROM courses WHERE id=?");
    $stmt->execute([(int)$_GET['edit']]);
    $edit_course = $stmt->fetch();
    if ($edit_course) {
        $t_arr = json_decode($edit_course['topics_json'] ?? '[]', true) ?: [];
        $edit_topics_text = implode("\n", $t_arr);
    }
}

$courses = $pdo->query("SELECT * FROM courses ORDER BY sort_order ASC, id ASC")->fetchAll();
$page_title = 'কোর্স ও সিলেবাস ম্যানেজমেন্ট (Courses)';
require_once __DIR__ . '/header.php';
?>
<div class="panel-card">
    <div class="panel-header">
        <h3><i class="fa fa-book"></i> <?= $edit_course ? 'কোর্স সম্পাদনা করুন' : 'নতুন কোর্স যোগ করুন' ?></h3>
        <?php if ($edit_course): ?>
            <a href="courses.php" class="btn btn-outline btn-xs">নতুন কোর্স ফর্ম</a>
        <?php endif; ?>
    </div>
    <div class="panel-body">
        <form method="post" enctype="multipart/form-data">
            <input type="hidden" name="form_action" value="save">
            <input type="hidden" name="id" value="<?= (int)($edit_course['id'] ?? 0) ?>">
            <input type="hidden" name="existing_image" value="<?= h($edit_course['image'] ?? 'assets/img/course-msoffice.jpg') ?>">
            <input type="hidden" name="syllabus_json" value="<?= h($edit_course['syllabus_json'] ?? '[]') ?>">

            <div class="form-grid">
                <div class="form-group">
                    <label>কোর্সের নাম (English Title) *</label>
                    <input type="text" name="title" class="form-control" required value="<?= h($edit_course['title'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>কোর্সের নাম (বাংলায়) *</label>
                    <input type="text" name="title_bn" class="form-control" required value="<?= h($edit_course['title_bn'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>ইউআরএল স্লাগ (Slug) *</label>
                    <input type="text" name="slug" class="form-control" required value="<?= h($edit_course['slug'] ?? '') ?>" placeholder="msoffice, graphic, webdesign...">
                </div>
                <div class="form-group">
                    <label>কোর্স ফি (Fee ৳) *</label>
                    <input type="number" step="0.01" name="fee" class="form-control" required value="<?= (float)($edit_course['fee'] ?? 1500) ?>">
                </div>
                <div class="form-group">
                    <label>কোর্স মেয়াদ (Duration)</label>
                    <input type="text" name="duration" class="form-control" value="<?= h($edit_course['duration'] ?? '3 Months') ?>">
                </div>
                <div class="form-group">
                    <label>প্রতি ক্লাসের সময়</label>
                    <input type="text" name="class_duration" class="form-control" value="<?= h($edit_course['class_duration'] ?? '1.30 Hours') ?>">
                </div>
                <div class="form-group">
                    <label>সপ্তাহে ক্লাস</label>
                    <input type="text" name="weekly_days" class="form-control" value="<?= h($edit_course['weekly_days'] ?? '3 Days / Week') ?>">
                </div>
                <div class="form-group">
                    <label>মোট ক্লাস সংখ্যা</label>
                    <input type="number" name="total_classes" class="form-control" value="<?= (int)($edit_course['total_classes'] ?? 36) ?>">
                </div>
                <div class="form-group">
                    <label>সার্টিফিকেট সুবিধা</label>
                    <select name="has_certificate" class="form-control">
                        <option value="1" <?= (int)($edit_course['has_certificate'] ?? 1) === 1 ? 'selected' : '' ?>>হ্যাঁ (সার্টিফিকেট প্রদান করা হয়)</option>
                        <option value="0" <?= (int)($edit_course['has_certificate'] ?? 1) === 0 ? 'selected' : '' ?>>না (সার্টিফিকেট ছাড়া)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>কোর্স ব্যানার ছবি</label>
                    <input type="file" name="image_file" class="form-control" accept="image/*">
                </div>
                <div class="form-group">
                    <label>স্ট্যাটাস</label>
                    <select name="status" class="form-control">
                        <option value="Active" <?= ($edit_course['status'] ?? 'Active') === 'Active' ? 'selected' : '' ?>>Active</option>
                        <option value="Inactive" <?= ($edit_course['status'] ?? '') === 'Inactive' ? 'selected' : '' ?>>Inactive</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>ক্রম (Sort Order)</label>
                    <input type="number" name="sort_order" class="form-control" value="<?= (int)($edit_course['sort_order'] ?? 1) ?>">
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                    <label>সংক্ষিপ্ত বিবরণ (English Summary)</label>
                    <input type="text" name="short_desc" class="form-control" value="<?= h($edit_course['short_desc'] ?? '') ?>">
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                    <label>বিস্তারিত বিবরণ (বাংলায়)</label>
                    <textarea name="description_bn" class="form-control" rows="2"><?= h($edit_course['description_bn'] ?? '') ?></textarea>
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                    <label>কোর্সের মূল টপিকসমূহ (প্রতি লাইনে একটি টপিক লিখুন)</label>
                    <textarea name="topics_text" class="form-control" rows="4" placeholder="MS Word&#10;MS Excel&#10;MS PowerPoint"><?= h($edit_topics_text) ?></textarea>
                </div>
            </div>
            <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> <?= $edit_course ? 'কোর্স আপডেট করুন' : 'নতুন কোর্স সংরক্ষণ করুন' ?></button>
        </form>
    </div>
</div>

<div class="panel-card">
    <div class="panel-header">
        <h3><i class="fa fa-th-list"></i> সকল কোর্স তালিকা (<?= count($courses) ?> টি)</h3>
    </div>
    <div class="adm-table-wrap">
        <table class="adm-table">
            <thead>
                <tr>
                    <th>ছবি</th>
                    <th>কোর্সের নাম</th>
                    <th>কোর্স ফি</th>
                    <th>মেয়াদ ও ক্লাস</th>
                    <th>সার্টিফিকেট</th>
                    <th>টপিক সংখ্যা</th>
                    <th>অ্যাকশন</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($courses as $c):
                    $t_count = count(json_decode($c['topics_json'] ?? '[]', true) ?: []);
                ?>
                <tr>
                    <td><img src="../<?= h($c['image']) ?>" style="width:60px; height:40px; object-fit:cover; border-radius:6px;"></td>
                    <td><strong><?= h($c['title']) ?></strong><br><small style="color:#0f766e;"><?= h($c['title_bn']) ?></small></td>
                    <td style="font-weight:800; color:#ea580c;">৳ <?= number_format((float)$c['fee'], 0) ?></td>
                    <td><?= h($c['duration']) ?> (<?= (int)$c['total_classes'] ?> Classes)<br><small><?= h($c['class_duration']) ?> | <?= h($c['weekly_days']) ?></small></td>
                    <td>
                        <span class="badge <?= $c['has_certificate'] ? 'badge-success' : 'badge-warning' ?>">
                            <?= $c['has_certificate'] ? 'Certificate Included' : 'No Certificate' ?>
                        </span>
                    </td>
                    <td><?= $t_count ?> টি টপিক</td>
                    <td style="white-space:nowrap;">
                        <a href="../course.php?slug=<?= urlencode($c['slug']) ?>" target="_blank" class="btn btn-outline btn-xs"><i class="fa fa-eye"></i> পেজ ভিউ</a>
                        <a href="courses.php?edit=<?= (int)$c['id'] ?>" class="btn btn-primary btn-xs"><i class="fa fa-edit"></i></a>
                        <form method="post" style="display:inline;" onsubmit="return confirm('এই কোর্সটি মুছে ফেলতে চান?');">
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

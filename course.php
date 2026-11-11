<?php
require_once __DIR__ . '/config/db.php';
$pdo = get_db();
$slug = trim($_GET['slug'] ?? '');
$course = null;
if ($slug !== '') {
    $stmt = $pdo->prepare("SELECT * FROM courses WHERE slug=? LIMIT 1");
    $stmt->execute([$slug]);
    $course = $stmt->fetch();
}
$all_courses = $pdo->query("SELECT * FROM courses WHERE status='Active' ORDER BY sort_order ASC")->fetchAll();
if (!$course && count($all_courses) > 0 && $slug !== '') {
    $course = $all_courses[0];
}
$page_title = $course ? $course['title'] . ' - Course Details' : 'সকল কোর্স ও সিলেবাস';
require_once __DIR__ . '/includes/header.php';
?>
<div class="page-hero-strip">
    <div class="container">
        <h1><?= h($course ? $course['title'] : 'আমাদের সকল কোর্স ও সিলেবাস') ?></h1>
        <p><?= h($course ? $course['title_bn'] : 'দক্ষ ট্রেইনারদের তত্ত্বাবধানে হাতে-কলমে কম্পিউটার ও কারিগরি প্রশিক্ষণ') ?></p>
    </div>
</div>

<section class="section">
    <div class="container">
        <!-- Course Selector Tabs -->
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:30px; justify-content:center;">
            <?php foreach ($all_courses as $c_tab): ?>
                <a href="course.php?slug=<?= urlencode($c_tab['slug']) ?>"
                   class="btn <?= ($course && $course['slug'] === $c_tab['slug']) ? 'btn-primary' : 'btn-outline' ?> btn-sm"
                   style="<?= (!$course || $course['slug'] !== $c_tab['slug']) ? 'color:#0f172a; border-color:#cbd5e1; background:#fff;' : '' ?>">
                    <i class="fa fa-book"></i> <?= h($c_tab['title']) ?> (৳<?= (float)$c_tab['fee'] ?>)
                </a>
            <?php endforeach; ?>
        </div>

        <?php if ($course):
            $topics   = json_decode($course['topics_json'] ?? '[]', true) ?: [];
            $syllabus = json_decode($course['syllabus_json'] ?? '[]', true) ?: [];
        ?>
            <div class="card" style="margin-bottom:34px;">
                <div class="card-body" style="padding:30px;">
                    <div class="grid-2" style="align-items:center;">
                        <div>
                            <span class="badge <?= $course['has_certificate'] ? 'badge-success' : 'badge-warning' ?>" style="margin-bottom:10px;">
                                <?= $course['has_certificate'] ? 'সার্টিফিকেট ফ্রিতে প্রদান করা হয়' : 'এই কোর্সে সার্টিফিকেট প্রদান করা হয় না' ?>
                            </span>
                            <h2 style="font-size:2rem; color:#0f172a; margin-bottom:6px;"><?= h($course['title']) ?></h2>
                            <h3 style="color:#0f766e; margin-bottom:14px;"><?= h($course['title_bn']) ?> — কোর্স ফিঃ মাত্র ৳<?= number_format((float)$course['fee'], 0) ?> টাকা</h3>
                            <p style="font-size:1rem; color:#334155; margin-bottom:18px;"><?= nl2br(h($course['description_bn'] ?: $course['short_desc'])) ?></p>

                            <div class="course-meta" style="font-size:0.95rem;">
                                <span><i class="fa fa-calendar"></i> <strong>মেয়াদ:</strong> <?= h($course['duration']) ?></span>
                                <span><i class="fa fa-clock-o"></i> <strong>প্রতি ক্লাস:</strong> <?= h($course['class_duration']) ?></span>
                                <span><i class="fa fa-check-square-o"></i> <strong>সপ্তাহে:</strong> <?= h($course['weekly_days']) ?></span>
                                <span><i class="fa fa-laptop"></i> <strong>মোট ক্লাস:</strong> <?= (int)$course['total_classes'] ?> টি</span>
                            </div>

                            <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:16px;">
                                <a href="admission.php?course=<?= urlencode($course['title']) ?>" class="btn btn-accent">
                                    <i class="fa fa-user-plus"></i> এই কোর্সে অনলাইনে ভর্তি হোন
                                </a>
                                <a href="batches.php" class="btn btn-primary">
                                    <i class="fa fa-clock-o"></i> ক্লাসের সময়সূচি দেখুন
                                </a>
                            </div>
                        </div>
                        <div>
                            <img src="<?= h($course['image']) ?>" alt="<?= h($course['title']) ?>" style="border-radius:12px; width:100%; max-height:320px; object-fit:cover; box-shadow:var(--shadow);">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Topics -->
            <?php if (!empty($topics)): ?>
            <div style="margin-bottom:36px;">
                <h3 style="font-size:1.45rem; margin-bottom:16px; color:#0f172a;"><i class="fa fa-check-circle" style="color:#0f766e;"></i> কোর্সের প্রধান টপিকসমূহ (Course Topics)</h3>
                <div class="grid-4">
                    <?php foreach ($topics as $tp): ?>
                        <div style="background:#fff; padding:14px 18px; border-radius:10px; border:1px solid #e2e8f0; border-left:4px solid #0f766e; font-weight:600; box-shadow:var(--shadow);">
                            <i class="fa fa-check" style="color:#0f766e; margin-right:6px;"></i> <?= h($tp) ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>

            <!-- Class-by-Class Syllabus -->
            <?php if (!empty($syllabus)): ?>
            <div>
                <h3 style="font-size:1.45rem; margin-bottom:16px; color:#0f172a;"><i class="fa fa-book" style="color:#ea580c;"></i> বিস্তারিত ক্লাস সিলেবাস (Class-by-Class Curriculum)</h3>
                <div class="syllabus-grid">
                    <?php foreach ($syllabus as $mod): ?>
                        <div class="syllabus-card">
                            <div class="sec-tag"><?= h($mod['section'] ?? '') ?></div>
                            <h4><?= h($mod['title'] ?? '') ?></h4>
                            <ul>
                                <?php foreach (($mod['items'] ?? []) as $it): ?>
                                    <li><?= h($it) ?></li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>

        <?php else: ?>
            <!-- All Courses Grid if no specific slug selected -->
            <div class="grid-3">
                <?php foreach ($all_courses as $c): ?>
                <div class="card">
                    <div class="course-thumb">
                        <img src="<?= h($c['image']) ?>" alt="<?= h($c['title']) ?>">
                        <span class="course-fee-badge">৳ <?= number_format((float)$c['fee'], 0) ?></span>
                    </div>
                    <div class="card-body">
                        <h3><?= h($c['title']) ?></h3>
                        <div class="title-bn"><?= h($c['title_bn']) ?></div>
                        <p><?= h($c['description_bn'] ?: $c['short_desc']) ?></p>
                        <div class="card-footer">
                            <a href="course.php?slug=<?= urlencode($c['slug']) ?>" class="btn btn-primary btn-sm" style="flex:1;">বিস্তারিত সিলেবাস</a>
                            <a href="admission.php?course=<?= urlencode($c['title']) ?>" class="btn btn-accent btn-sm">ভর্তি হোন</a>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>

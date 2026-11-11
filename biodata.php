<?php
require_once __DIR__ . '/config/db.php';
$pdo = get_db();

$reg_no = trim($_GET['reg_no'] ?? '');
$q = trim($_GET['q'] ?? '');

$profile = null;
if ($reg_no !== '') {
    $stmt = $pdo->prepare("SELECT * FROM students WHERE reg_no=? LIMIT 1");
    $stmt->execute([$reg_no]);
    $profile = $stmt->fetch();
}

$sql = "SELECT * FROM students WHERE 1=1";
$params = [];
if ($q !== '') {
    $sql .= " AND (name LIKE ? OR reg_no LIKE ? OR course_name LIKE ? OR phone LIKE ?)";
    $params = ["%$q%", "%$q%", "%$q%", "%$q%"];
}
$sql .= " ORDER BY reg_no ASC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$students = $stmt->fetchAll();

$page_title = $profile ? $profile['name'] . ' - Student Bio-Data' : 'সকল স্টুডেন্ট বায়োডাটা (Students Bio-Data)';
require_once __DIR__ . '/includes/header.php';
?>
<div class="page-hero-strip">
    <div class="container">
        <h1><?= h($profile ? 'শিক্ষার্থীর ব্যক্তিগত বায়োডাটা (Student Bio-Data)' : 'All Student Bio-Data Directory') ?></h1>
        <p>শিক্ষার্থীদের বিস্তারিত পরিচয় ও বায়োডাটা দেখতে নামের ওপর ক্লিক করুন</p>
    </div>
</div>

<section class="section">
    <div class="container">
        <?php if ($profile): ?>
            <div class="form-card" style="max-width:850px; margin:0 auto 40px; border-top:5px solid #0f766e;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px; border-bottom:1px solid #e2e8f0; padding-bottom:20px; margin-bottom:20px;">
                    <div style="display:flex; align-items:center; gap:18px; flex-wrap:wrap;">
                        <img src="<?= h($profile['photo'] ?: 'assets/img/teacher-sagor.jpg') ?>" alt="<?= h($profile['name']) ?>" style="width:120px; height:120px; border-radius:14px; object-fit:cover; border:3px solid #0f766e;">
                        <div>
                            <span class="badge badge-info">Registration No: <?= h($profile['reg_no']) ?> | Roll: <?= h($profile['roll_no']) ?></span>
                            <h2 style="font-size:1.8rem; color:#0f172a; margin-top:6px;"><?= h($profile['name']) ?></h2>
                            <p style="color:#0f766e; font-weight:700;"><?= h($profile['course_name']) ?> (<?= h($profile['session_quarter']) ?> - <?= (int)$profile['batch_year'] ?>)</p>
                        </div>
                    </div>
                    <button onclick="window.print()" class="btn btn-outline btn-sm" style="color:#0f172a; border-color:#cbd5e1;"><i class="fa fa-print"></i> বায়োডাটা প্রিন্ট করুন</button>
                </div>

                <div class="grid-2" style="gap:16px;">
                    <div>
                        <p style="margin-bottom:8px;"><strong>Name:</strong> <?= h($profile['name']) ?></p>
                        <p style="margin-bottom:8px;"><strong>Father's Name:</strong> <?= h($profile['father_name']) ?></p>
                        <p style="margin-bottom:8px;"><strong>Mother's Name:</strong> <?= h($profile['mother_name']) ?></p>
                        <p style="margin-bottom:8px;"><strong>Present Address:</strong> <?= h($profile['present_address']) ?></p>
                        <p style="margin-bottom:8px;"><strong>Permanent Address:</strong> <?= h($profile['permanent_address']) ?></p>
                        <p style="margin-bottom:8px;"><strong>Phone:</strong> <?= h($profile['phone']) ?></p>
                        <p style="margin-bottom:8px;"><strong>E-mail:</strong> <?= h($profile['email']) ?></p>
                    </div>
                    <div>
                        <p style="margin-bottom:8px;"><strong>Date of Birth:</strong> <?= h($profile['dob']) ?></p>
                        <p style="margin-bottom:8px;"><strong>Religion:</strong> <?= h($profile['religion']) ?></p>
                        <p style="margin-bottom:8px;"><strong>Marital Status:</strong> <?= h($profile['marital_status']) ?></p>
                        <p style="margin-bottom:8px;"><strong>Height & Weight:</strong> <?= h($profile['height']) ?> | <?= h($profile['weight']) ?></p>
                        <p style="margin-bottom:8px;"><strong>Education:</strong> <?= h($profile['education']) ?> (<?= h($profile['school_college']) ?>)</p>
                        <p style="margin-bottom:8px;"><strong>Class Schedule:</strong> <?= h($profile['class_slot']) ?></p>
                        <p style="margin-bottom:8px;"><strong>Result / Grade:</strong> <span class="badge badge-success"><?= h($profile['result_grade']) ?> (GPA: <?= h($profile['cgpa']) ?>)</span></p>
                    </div>
                </div>
                <div style="margin-top:16px; padding:14px; background:#f8fafc; border-radius:8px; border-left:4px solid #0f766e;">
                    <strong>Experience & Skills:</strong><br>
                    <?= nl2br(h($profile['experience'])) ?>
                </div>
                <div style="margin-top:18px; display:flex; gap:10px;">
                    <a href="biodata.php" class="btn btn-primary btn-sm"><i class="fa fa-arrow-left"></i> সকল স্টুডেন্ট তালিকায় ফিরে যান</a>
                    <a href="certificates.php?q=<?= urlencode($profile['reg_no']) ?>" class="btn btn-accent btn-sm"><i class="fa fa-certificate"></i> সার্টিফিকেট দেখুন</a>
                </div>
            </div>
        <?php endif; ?>

        <div class="filter-bar">
            <div class="form-group" style="flex:1;">
                <label><i class="fa fa-search"></i> স্টুডেন্ট বায়োডাটা খুঁজুন (নাম, রেজিস্ট্রেশন নম্বর বা কোর্স)</label>
                <input type="text" id="tableFilterInput" class="form-control" value="<?= h($q) ?>" placeholder="যেমন: Jainal Abedin, 000001, Graphic Design...">
            </div>
        </div>

        <div class="table-responsive">
            <table class="data-table filterable-table">
                <thead>
                    <tr>
                        <th>SL</th>
                        <th>ছবি</th>
                        <th>শিক্ষার্থীর নাম (Click for Bio-Data)</th>
                        <th>Registration No</th>
                        <th>কোর্স (Course)</th>
                        <th>ব্যাচ ও সেশন</th>
                        <th>অ্যাকশন</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($students as $i => $s): ?>
                    <tr>
                        <td><?= str_pad((string)($i + 1), 2, '0', STR_PAD_LEFT) ?></td>
                        <td><img src="<?= h($s['photo'] ?: 'assets/img/home-icon.png') ?>" style="width:42px; height:42px; border-radius:50%; object-fit:cover;"></td>
                        <td>
                            <a href="biodata.php?reg_no=<?= urlencode($s['reg_no']) ?>" style="font-weight:700; font-size:1rem; color:#0f766e;">
                                <?= h($s['name']) ?>
                            </a>
                        </td>
                        <td><strong><?= h($s['reg_no']) ?></strong></td>
                        <td><?= h($s['course_name']) ?></td>
                        <td><?= h($s['session_quarter']) ?> (<?= (int)$s['batch_year'] ?>)</td>
                        <td>
                            <a href="biodata.php?reg_no=<?= urlencode($s['reg_no']) ?>" class="btn btn-primary btn-sm"><i class="fa fa-eye"></i> বায়োডাটা দেখুন</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>

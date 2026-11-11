<?php
$page_title = 'এডমিন ড্যাশবোর্ড (Control Panel)';
require_once __DIR__ . '/header.php';

$total_students = (int)$pdo->query("SELECT COUNT(*) FROM students")->fetchColumn();
$total_courses  = (int)$pdo->query("SELECT COUNT(*) FROM courses")->fetchColumn();
$total_teachers = (int)$pdo->query("SELECT COUNT(*) FROM teachers")->fetchColumn();
$total_classes  = (int)$pdo->query("SELECT COUNT(*) FROM classes")->fetchColumn();
$total_certs    = (int)$pdo->query("SELECT COUNT(*) FROM certificates WHERE status='Issued'")->fetchColumn();
$total_paid     = (float)$pdo->query("SELECT COALESCE(SUM(paid_amount),0) FROM payments")->fetchColumn();
$total_due      = (float)$pdo->query("SELECT COALESCE(SUM(due_amount),0) FROM payments")->fetchColumn();

$recent_admissions = $pdo->query("SELECT * FROM admissions ORDER BY id DESC LIMIT 5")->fetchAll();
$recent_payments   = $pdo->query("SELECT * FROM payments ORDER BY id DESC LIMIT 5")->fetchAll();
$recent_certs      = $pdo->query("SELECT * FROM certificates ORDER BY id DESC LIMIT 5")->fetchAll();
?>
<div class="kpi-grid">
    <div class="kpi-card">
        <div class="kpi-info"><h4>মোট স্টুডেন্ট</h4><h2><?= $total_students ?></h2></div>
        <div class="kpi-icon" style="background:#ccfbf1; color:#0f766e;"><i class="fa fa-graduation-cap"></i></div>
    </div>
    <div class="kpi-card">
        <div class="kpi-info"><h4>ইস্যুকৃত সার্টিফিকেট</h4><h2><?= $total_certs ?></h2></div>
        <div class="kpi-icon" style="background:#fef3c7; color:#d97706;"><i class="fa fa-certificate"></i></div>
    </div>
    <div class="kpi-card">
        <div class="kpi-info"><h4>মোট পেমেন্ট কালেকশন</h4><h2>৳ <?= number_format($total_paid, 0) ?></h2></div>
        <div class="kpi-icon" style="background:#dcfce7; color:#15803d;"><i class="fa fa-money"></i></div>
    </div>
    <div class="kpi-card">
        <div class="kpi-info"><h4>মোট বকেয়া (Due)</h4><h2>৳ <?= number_format($total_due, 0) ?></h2></div>
        <div class="kpi-icon" style="background:#fee2e2; color:#b91c1c;"><i class="fa fa-exclamation-circle"></i></div>
    </div>
    <div class="kpi-card">
        <div class="kpi-info"><h4>পেন্ডিং অনলাইন ভর্তি</h4><h2><?= $pending_adm ?></h2></div>
        <div class="kpi-icon" style="background:#ffedd5; color:#ea580c;"><i class="fa fa-user-plus"></i></div>
    </div>
    <div class="kpi-card">
        <div class="kpi-info"><h4>মোট কোর্স</h4><h2><?= $total_courses ?></h2></div>
        <div class="kpi-icon" style="background:#e0e7ff; color:#4338ca;"><i class="fa fa-book"></i></div>
    </div>
    <div class="kpi-card">
        <div class="kpi-info"><h4>ক্লাস টাইম স্লট / ব্যাচ</h4><h2><?= $total_classes ?></h2></div>
        <div class="kpi-icon" style="background:#fae8ff; color:#a21caf;"><i class="fa fa-clock-o"></i></div>
    </div>
    <div class="kpi-card">
        <div class="kpi-info"><h4>শিক্ষক ও কর্মকর্তা</h4><h2><?= $total_teachers ?></h2></div>
        <div class="kpi-icon" style="background:#e0f2fe; color:#0369a1;"><i class="fa fa-users"></i></div>
    </div>
</div>

<div class="panel-card">
    <div class="panel-header">
        <h3><i class="fa fa-bolt"></i> কুইক ম্যানেজমেন্ট শর্টকাট (Quick Actions)</h3>
    </div>
    <div class="panel-body" style="display:flex; gap:10px; flex-wrap:wrap;">
        <a href="students.php?action=new" class="btn btn-primary"><i class="fa fa-plus-circle"></i> নতুন স্টুডেন্ট যোগ করুন</a>
        <a href="certificates.php?action=new" class="btn btn-accent"><i class="fa fa-certificate"></i> নতুন সার্টিফিকেট ইস্যু করুন</a>
        <a href="payments.php?action=new" class="btn btn-success"><i class="fa fa-money"></i> পেমেন্ট রিসিভ / মানি রিসিপ্ট</a>
        <a href="admissions.php" class="btn btn-outline"><i class="fa fa-check-square-o"></i> ভর্তি আবেদন অনুমোদন (<?= $pending_adm ?>)</a>
        <a href="courses.php?action=new" class="btn btn-outline"><i class="fa fa-book"></i> নতুন কোর্স যোগ করুন</a>
        <a href="classes.php" class="btn btn-outline"><i class="fa fa-calendar"></i> ক্লাস রুটিন ও ব্যাচ</a>
        <a href="teachers.php?action=new" class="btn btn-outline"><i class="fa fa-user-md"></i> নতুন শিক্ষক যোগ করুন</a>
        <a href="settings.php" class="btn btn-outline"><i class="fa fa-cog"></i> ওয়েবসাইট তথ্য পরিবর্তন</a>
    </div>
</div>

<div class="panel-card">
    <div class="panel-header">
        <h3><i class="fa fa-user-plus"></i> সাম্প্রতিক অনলাইন ভর্তি আবেদন (Recent Admissions)</h3>
        <a href="admissions.php" class="btn btn-primary btn-xs">সকল আবেদন দেখুন</a>
    </div>
    <div class="dcp-table-wrap">
        <table class="dcp-table">
            <thead>
                <tr>
                    <th>আবেদন নং</th>
                    <th>শিক্ষার্থীর নাম</th>
                    <th>মোবাইল</th>
                    <th>কোর্স</th>
                    <th>পছন্দের ক্লাস টাইম</th>
                    <th>পেমেন্ট</th>
                    <th>স্ট্যাটাস</th>
                    <th>অ্যাকশন</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($recent_admissions as $adm): ?>
                <tr>
                    <td><strong><?= h($adm['application_no']) ?></strong></td>
                    <td><?= h($adm['full_name']) ?></td>
                    <td><?= h($adm['phone']) ?></td>
                    <td><?= h($adm['course_name']) ?></td>
                    <td><?= h($adm['preferred_slot']) ?></td>
                    <td>৳ <?= number_format((float)$adm['paid_amount'], 0) ?> (<?= h($adm['payment_method']) ?>)</td>
                    <td>
                        <span class="badge <?= $adm['status'] === 'Approved' ? 'badge-success' : ($adm['status'] === 'Rejected' ? 'badge-danger' : 'badge-warning') ?>">
                            <?= h($adm['status']) ?>
                        </span>
                    </td>
                    <td>
                        <a href="admissions.php" class="btn btn-primary btn-xs"><i class="fa fa-eye"></i> বিস্তারিত / অনুমোদন</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(420px, 1fr)); gap:22px;">
    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-money"></i> সাম্প্রতিক পেমেন্ট ও ক্যাশ মেমো</h3>
            <a href="payments.php" class="btn btn-outline btn-xs">সকল পেমেন্ট</a>
        </div>
        <div class="dcp-table-wrap">
            <table class="dcp-table" style="min-width:100%;">
                <thead>
                    <tr>
                        <th>রিসিপ্ট নং</th>
                        <th>শিক্ষার্থী (রেজিঃ)</th>
                        <th>আদায়</th>
                        <th>বকেয়া</th>
                        <th>মেমো</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($recent_payments as $pm): ?>
                    <tr>
                        <td><strong><?= h($pm['receipt_no']) ?></strong></td>
                        <td><?= h($pm['student_name']) ?> <small>(<?= h($pm['reg_no']) ?>)</small></td>
                        <td style="color:#15803d; font-weight:700;">৳<?= number_format((float)$pm['paid_amount'], 0) ?></td>
                        <td style="color:<?= $pm['due_amount'] > 0 ? '#dc2626' : '#64748b' ?>;">৳<?= number_format((float)$pm['due_amount'], 0) ?></td>
                        <td><a href="invoice.php?id=<?= (int)$pm['id'] ?>" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-xs"><i class="fa fa-print"></i> প্রিন্ট</a></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <div class="panel-card">
        <div class="panel-header">
            <h3><i class="fa fa-certificate"></i> সাম্প্রতিক ইস্যুকৃত সার্টিফিকেট</h3>
            <a href="certificates.php" class="btn btn-outline btn-xs">সকল সার্টিফিকেট</a>
        </div>
        <div class="dcp-table-wrap">
            <table class="dcp-table" style="min-width:100%;">
                <thead>
                    <tr>
                        <th>সার্টিফিকেট নং</th>
                        <th>শিক্ষার্থী (রেজিঃ)</th>
                        <th>কোর্স</th>
                        <th>গ্রেড</th>
                        <th>প্রিন্ট</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($recent_certs as $ct): ?>
                    <tr>
                        <td><strong><?= h($ct['cert_no']) ?></strong></td>
                        <td><?= h($ct['student_name']) ?> <small>(<?= h($ct['reg_no']) ?>)</small></td>
                        <td><?= h($ct['course_name']) ?></td>
                        <td><span class="badge badge-success"><?= h($ct['grade']) ?></span></td>
                        <td><a href="../certificate-view.php?cert_no=<?= urlencode($ct['cert_no']) ?>" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-xs"><i class="fa fa-print"></i> ভিউ</a></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
<?php require_once __DIR__ . '/footer.php'; ?>

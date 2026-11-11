<?php
require_once __DIR__ . '/config/db.php';
$pdo = get_db();

$q = trim($_GET['q'] ?? '');
$sql = "SELECT * FROM certificates WHERE status='Issued'";
$params = [];
if ($q !== '') {
    $sql .= " AND (reg_no LIKE ? OR cert_no LIKE ? OR student_name LIKE ? OR verification_code LIKE ?)";
    $params = ["%$q%", "%$q%", "%$q%", "%$q%"];
}
$sql .= " ORDER BY id ASC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$certs = $stmt->fetchAll();

$page_title = 'সার্টিফিকেট ভেরিফিকেশন ও তালিকা (Certificates)';
require_once __DIR__ . '/includes/header.php';
?>
<div class="page-banner">
    <div class="container">
        <h1>All Student Certificates & Online Verification</h1>
        <p>রেজিস্ট্রেশন নম্বর, সার্টিফিকেট নম্বর অথবা নাম দিয়ে অনলাইনে সার্টিফিকেট যাচাই ও প্রিন্ট করুন</p>
    </div>
</div>

<section class="section">
    <div class="container">
        <form method="get" action="certificates.php" class="filter-bar">
            <div class="form-group" style="flex:1;">
                <label><i class="fa fa-certificate"></i> রেজিস্ট্রেশন নং / সার্টিফিকেট নং / ভেরিফিকেশন কোড দিয়ে খুঁজুন</label>
                <input type="text" name="q" id="tableFilterInput" class="form-control" value="<?= h($q) ?>" placeholder="যেমন: 000001 অথবা AGITC-2020-000001">
            </div>
            <button type="submit" class="btn btn-primary"><i class="fa fa-search"></i> যাচাই করুন (Verify)</button>
            <?php if ($q !== ''): ?>
                <a href="certificates.php" class="btn btn-outline" style="color:#334155; border-color:#cbd5e1;">সকল সার্টিফিকেট</a>
            <?php endif; ?>
        </form>

        <div class="table-responsive">
            <table class="data-table filterable-table">
                <thead>
                    <tr>
                        <th>SL</th>
                        <th>শিক্ষার্থীর নাম (Click for Certificate)</th>
                        <th>Registration No</th>
                        <th>Certificate No</th>
                        <th>Course Name</th>
                        <th>Session & Batch</th>
                        <th>Grade</th>
                        <th>Verification</th>
                        <th>অ্যাকশন</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($certs)): ?>
                        <tr><td colspan="9" style="text-align:center; padding:24px;">কোনো সার্টিফিকেট পাওয়া যায়নি।</td></tr>
                    <?php else: ?>
                        <?php foreach ($certs as $i => $c): ?>
                        <tr>
                            <td><?= str_pad((string)($i + 1), 2, '0', STR_PAD_LEFT) ?></td>
                            <td>
                                <a href="certificate-view.php?cert_no=<?= urlencode($c['cert_no']) ?>" target="_blank" style="font-weight:700; color:#0f766e;">
                                    <?= h($c['student_name']) ?>
                                </a>
                            </td>
                            <td><strong><?= h($c['reg_no']) ?></strong></td>
                            <td><?= h($c['cert_no']) ?></td>
                            <td><?= h($c['course_name']) ?></td>
                            <td><?= h($c['session_quarter']) ?> (<?= (int)$c['batch_year'] ?>)</td>
                            <td><span class="badge badge-success"><?= h($c['grade']) ?></span></td>
                            <td><span class="badge badge-info"><i class="fa fa-check-circle"></i> Verified</span></td>
                            <td>
                                <a href="certificate-view.php?cert_no=<?= urlencode($c['cert_no']) ?>" target="_blank" class="btn btn-accent btn-sm">
                                    <i class="fa fa-print"></i> সার্টিফিকেট দেখুন / প্রিন্ট
                                </a>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>

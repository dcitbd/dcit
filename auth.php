<?php
require_once __DIR__ . '/config/db.php';
$pdo = get_db();
$msg = '';
$err = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $mode = $_POST['auth_mode'] ?? 'signin';
    if ($mode === 'signin') {
        $id_or_email = trim($_POST['login_id'] ?? '');
        $stmt = $pdo->prepare("SELECT * FROM students WHERE reg_no=? OR email=? OR phone=? LIMIT 1");
        $stmt->execute([$id_or_email, $id_or_email, $id_or_email]);
        $st = $stmt->fetch();
        if ($st) {
            header("Location: biodata.php?reg_no=" . urlencode($st['reg_no']));
            exit;
        } else {
            $err = 'শিক্ষার্থী খুঁজে পাওয়া যায়নি! অনুগ্রহ করে সঠিক রেজিস্ট্রেশন নম্বর বা মোবাইল নম্বর প্রদান করুন।';
        }
    }
}
$page_title = 'স্টুডেন্ট সাইন ইন ও রেজিস্ট্রেশন (Sign In / Sign Up)';
require_once __DIR__ . '/includes/header.php';
?>
<div class="page-hero-strip">
    <div class="container">
        <h1>Student Sign In & Portal</h1>
        <p>আপনার রেজিস্ট্রেশন নম্বর বা মোবাইল নম্বর দিয়ে প্রোফাইল ও ফলাফল দেখুন</p>
    </div>
</div>

<section class="section">
    <div class="container" style="max-width:520px;">
        <?php if ($err): ?><div class="alert alert-danger"><?= h($err) ?></div><?php endif; ?>
        <div class="form-card">
            <h3 style="margin-bottom:14px; color:#0f766e;"><i class="fa fa-sign-in"></i> স্টুডেন্ট পোর্টাল লগইন</h3>
            <form method="post">
                <input type="hidden" name="auth_mode" value="signin">
                <div class="form-group">
                    <label>রেজিস্ট্রেশন নম্বর / মোবাইল / ইমেইল *</label>
                    <input type="text" name="login_id" class="form-control" required value="" placeholder="আপনার রেজিস্ট্রেশন নম্বর বা মোবাইল নম্বর লিখুন">
                </div>
                <div class="form-group">
                    <label>পাসওয়ার্ড *</label>
                    <input type="password" name="password" class="form-control" value="" required placeholder="আপনার পাসওয়ার্ড লিখুন">
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;"><i class="fa fa-unlock-alt"></i> প্রোফাইল ও রেজাল্ট দেখুন</button>
            </form>
            <div style="margin-top:18px; padding-top:14px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; font-size:0.9rem;">
                <a href="admission.php"><i class="fa fa-user-plus"></i> নতুন ভর্তি আবেদন (Sign Up)</a>
                <a href="admin/login.php" style="color:#ea580c; font-weight:700;"><i class="fa fa-lock"></i> এডমিন প্যানেল লগইন</a>
            </div>
        </div>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>

<?php
require_once __DIR__ . '/../config/db.php';
if (is_admin_logged_in()) {
    header("Location: index.php");
    exit;
}
$step = $_SESSION['admin_login_step'] ?? 1;
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['login_action'] ?? 'step1';
    if ($action === 'step1') {
        $user = trim($_POST['username'] ?? '');
        $pass = trim($_POST['password'] ?? '');
        $stmt = get_db()->prepare("SELECT * FROM admins WHERE username = ? OR email = ? LIMIT 1");
        $stmt->execute([$user, $user]);
        $admin = $stmt->fetch();
        if ($admin && verify_password_custom($pass, $admin['password_hash'])) {
            $_SESSION['pending_admin_id'] = $admin['id'];
            $_SESSION['pending_admin_name'] = $admin['full_name'];
            $_SESSION['pending_admin_role'] = $admin['role'];
            $_SESSION['admin_login_step'] = 2;
            $step = 2;
        } else {
            $error = 'ভুল ইউজারনেম বা পাসওয়ার্ড! (ডিফল্টঃ admin / admin123)';
        }
    } elseif ($action === 'step2') {
        $entered_code = strtoupper(preg_replace('/[\s:]/', '', $_POST['timelock_code'] ?? ''));
        $valid_codes = [
            strtoupper(date('hiA')),
            strtoupper(date('giA')),
            strtoupper(date('hiA', time() - 60)),
            strtoupper(date('hiA', time() + 60)),
            strtoupper($_POST['client_expected_code'] ?? '')
        ];
        if ($entered_code !== '' && in_array($entered_code, $valid_codes, true) && !empty($_SESSION['pending_admin_id'])) {
            $_SESSION['admin_id'] = $_SESSION['pending_admin_id'];
            $_SESSION['admin_name'] = $_SESSION['pending_admin_name'];
            $_SESSION['admin_role'] = $_SESSION['pending_admin_role'];
            unset($_SESSION['pending_admin_id'], $_SESSION['admin_login_step']);
            header("Location: index.php");
            exit;
        } else {
            $error = 'টাইম লক কোড সঠিক নয়! বর্তমান ঘড়ির সময় (যেমন: ' . strtoupper(date('hiA')) . ') লিখুন।';
        }
    } elseif ($action === 'reset') {
        unset($_SESSION['pending_admin_id'], $_SESSION['admin_login_step']);
        $step = 1;
    }
}
?>
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <title>এডমিন লগইন (Time Lock) | Dream Career IT</title>
    <link rel="icon" type="image/x-icon" href="../favicon.ico">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="../assets/css/panel.css">
</head>
<body>
<div class="login-stage-wrap">
    <div class="login-anim-card">
        <img src="../assets/img/logo.jpg" alt="Dream Career IT">
        <h2 style="color:#151442; margin-bottom:4px;">Dream Career IT</h2>
        <?php if ($error): ?>
            <div class="alert alert-danger"><?= h($error) ?></div>
        <?php endif; ?>

        <?php if ($step === 1): ?>
            <p style="color:#0f766e; font-weight:700; font-size:0.9rem; margin-bottom:18px;">ধাপ ১/২ঃ এডমিন ইউজার ও পাসওয়ার্ড লগইন</p>
            <form method="post" style="text-align:left;">
                <input type="hidden" name="login_action" value="step1">
                <div class="form-group">
                    <label><i class="fa fa-user"></i> ইউজারনেম অথবা ইমেইল</label>
                    <input type="text" name="username" class="form-control" value="admin" required>
                </div>
                <div class="form-group">
                    <label><i class="fa fa-lock"></i> পাসওয়ার্ড</label>
                    <input type="password" name="password" class="form-control" value="admin123" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; padding:12px;">
                    পরবর্তী ধাপ (Time Lock Verification) &rarr;
                </button>
            </form>
        <?php else: ?>
            <span class="badge badge-info" style="margin-bottom:6px;"><i class="fa fa-clock-o"></i> ধাপ ২/২ঃ টাইম-লক ভেরিফিকেশন</span>
            <p style="color:#475569; font-size:0.86rem;">বর্তমান ঘড়ির সময় অনুযায়ী কোড লিখুন (যেমন: <strong>01:25 AM</strong> হলে <strong id="phpHintCode"><?= strtoupper(date('hiA')) ?></strong>)</p>
            <div class="timelock-clock-badge" id="phpLiveClock"><?= date('h:i A') ?></div>
            <form method="post" style="text-align:left;">
                <input type="hidden" name="login_action" value="step2">
                <input type="hidden" name="client_expected_code" id="clientExpectedCode" value="<?= strtoupper(date('hiA')) ?>">
                <div class="form-group">
                    <label><i class="fa fa-key"></i> টাইম লক কোড (HHMMAM/PM) *</label>
                    <input type="text" name="timelock_code" id="phpTimeInput" class="form-control" required placeholder="যেমন: <?= strtoupper(date('hiA')) ?>" style="text-align:center; font-size:1.2rem; font-weight:800; text-transform:uppercase;">
                </div>
                <button type="submit" class="btn btn-accent" style="width:100%; justify-content:center; padding:12px;">
                    <i class="fa fa-unlock-alt"></i> টাইম লক খুলে ড্যাশবোর্ডে প্রবেশ করুন
                </button>
            </form>
            <script>
                function updatePhpClock() {
                    const d = new Date();
                    let h = d.getHours();
                    const m = String(d.getMinutes()).padStart(2, '0');
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    h = h % 12 || 12;
                    const hh = String(h).padStart(2, '0');
                    document.getElementById('phpLiveClock').textContent = hh + ':' + m + ' ' + ampm;
                    document.getElementById('phpHintCode').textContent = hh + m + ampm;
                    document.getElementById('clientExpectedCode').value = hh + m + ampm;
                }
                setInterval(updatePhpClock, 1000);
                updatePhpClock();
            </script>
        <?php endif; ?>
        <p style="margin-top:16px;"><a href="../index.html" style="color:#0f766e; font-weight:700; text-decoration:none;">&larr; মূল ওয়েবসাইটে ফিরে যান</a></p>
    </div>
</div>
</body>
</html>

<?php
require_once __DIR__ . '/../config/db.php';
if (is_admin_logged_in()) {
    header("Location: index.php");
    exit;
}
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = trim($_POST['username'] ?? '');
    $pass = trim($_POST['password'] ?? '');
    $stmt = get_db()->prepare("SELECT * FROM admins WHERE username = ? OR email = ? LIMIT 1");
    $stmt->execute([$user, $user]);
    $admin = $stmt->fetch();
    if ($admin && verify_password_custom($pass, $admin['password_hash'])) {
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_name'] = $admin['full_name'];
        $_SESSION['admin_role'] = $admin['role'];
        header("Location: index.php");
        exit;
    } else {
        $error = 'ভুল ইউজারনেম বা পাসওয়ার্ড! (ডিফল্টঃ admin / admin123)';
    }
}
?>
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>এডমিন লগইন | <?= h(setting('site_name', 'AMADER GRAM')) ?></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="../assets/css/admin.css">
    <style>
        body { display:flex; align-items:center; justify-content:center; min-height:100vh; background:linear-gradient(135deg,#0f172a,#0f766e); padding:16px; }
        .login-box { background:#fff; width:100%; max-width:420px; border-radius:16px; padding:32px; box-shadow:0 20px 45px rgba(0,0,0,0.35); text-align:center; }
        .login-box img { width:80px; height:80px; border-radius:50%; margin:0 auto 12px; border:3px solid #0f766e; object-fit:cover; }
        .login-box h2 { color:#0f172a; margin-bottom:4px; }
        .login-box p.sub { color:#64748b; font-size:0.88rem; margin-bottom:20px; }
        .demo-hint { background:#f0fdf4; border:1px dashed #16a34a; color:#166534; padding:10px; border-radius:8px; font-size:0.82rem; margin-top:16px; text-align:left; }
    </style>
</head>
<body>
<div class="login-box">
    <img src="../assets/img/logo.png" alt="Logo">
    <h2><?= h(setting('site_name', 'AMADER GRAM')) ?></h2>
    <p class="sub">ডাইনামিক এডমিন প্যানেল লগইন</p>
    <?php if ($error): ?>
        <div class="alert alert-danger"><?= h($error) ?></div>
    <?php endif; ?>
    <form method="post" style="text-align:left;">
        <div class="form-group">
            <label><i class="fa fa-user"></i> ইউজারনেম অথবা ইমেইল</label>
            <input type="text" name="username" class="form-control" value="admin" required placeholder="admin অথবা dc13edubd@gmail.com">
        </div>
        <div class="form-group">
            <label><i class="fa fa-lock"></i> পাসওয়ার্ড</label>
            <input type="password" name="password" class="form-control" value="admin123" required placeholder="পাসওয়ার্ড দিন">
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; padding:11px; font-size:0.98rem;">
            <i class="fa fa-sign-in"></i> এডমিন প্যানেলে প্রবেশ করুন
        </button>
    </form>
    <div class="demo-hint">
        <strong><i class="fa fa-key"></i> লগইন তথ্যঃ</strong><br>
        • ইউজারনেম: <code>admin</code> (অথবা <code>sagor</code>)<br>
        • পাসওয়ার্ড: <code>admin123</code>
    </div>
    <p style="margin-top:16px; font-size:0.86rem;">
        <a href="../index.php" style="color:#0f766e; font-weight:600; text-decoration:none;"><i class="fa fa-arrow-left"></i> মূল ওয়েবসাইটে ফিরে যান</a>
    </p>
</div>
</body>
</html>

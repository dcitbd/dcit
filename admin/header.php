<?php
require_once __DIR__ . '/../config/db.php';
require_admin();
$pdo = get_db();
$pending_adm = (int)$pdo->query("SELECT COUNT(*) FROM admissions WHERE status='Pending'")->fetchColumn();
$unread_msg  = (int)$pdo->query("SELECT COUNT(*) FROM messages WHERE is_read=0")->fetchColumn();
$curr_page   = basename($_SERVER['PHP_SELF']);
$flash       = get_flash();
?>
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= h($page_title ?? 'এডমিন প্যানেল') ?> | <?= h(setting('site_name', 'AMADER GRAM')) ?></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="../assets/css/admin.css">
</head>
<body>
<aside class="adm-sidebar">
    <div class="adm-brand">
        <img src="../assets/img/logo.png" alt="Logo">
        <div>
            <h2><?= h(setting('site_name', 'AMADER GRAM')) ?></h2>
            <span>Dynamic Admin Panel</span>
        </div>
    </div>
    <ul class="adm-nav">
        <li><a href="index.php" class="<?= $curr_page === 'index.php' ? 'active' : '' ?>">
            <span><i class="fa fa-tachometer"></i> ড্যাশবোর্ড (Dashboard)</span>
        </a></li>
        <li><a href="certificates.php" class="<?= $curr_page === 'certificates.php' ? 'active' : '' ?>">
            <span><i class="fa fa-certificate"></i> সার্টিফিকেট ম্যানেজমেন্ট</span>
        </a></li>
        <li><a href="students.php" class="<?= $curr_page === 'students.php' ? 'active' : '' ?>">
            <span><i class="fa fa-graduation-cap"></i> স্টুডেন্ট, বায়োডাটা ও রেজাল্ট</span>
        </a></li>
        <li><a href="payments.php" class="<?= $curr_page === 'payments.php' ? 'active' : '' ?>">
            <span><i class="fa fa-money"></i> পেমেন্ট ও ফি ম্যানেজমেন্ট</span>
        </a></li>
        <li><a href="admissions.php" class="<?= $curr_page === 'admissions.php' ? 'active' : '' ?>">
            <span><i class="fa fa-user-plus"></i> অনলাইন ভর্তি আবেদন</span>
            <?php if ($pending_adm > 0): ?><b class="adm-badge"><?= $pending_adm ?></b><?php endif; ?>
        </a></li>
        <li><a href="classes.php" class="<?= $curr_page === 'classes.php' ? 'active' : '' ?>">
            <span><i class="fa fa-clock-o"></i> ক্লাস, রুটিন ও ব্যাচ</span>
        </a></li>
        <li><a href="courses.php" class="<?= $curr_page === 'courses.php' ? 'active' : '' ?>">
            <span><i class="fa fa-book"></i> কোর্স ও সিলেবাস</span>
        </a></li>
        <li><a href="teachers.php" class="<?= $curr_page === 'teachers.php' ? 'active' : '' ?>">
            <span><i class="fa fa-users"></i> শিক্ষক ও প্রশাসন</span>
        </a></li>
        <li><a href="messages.php" class="<?= $curr_page === 'messages.php' ? 'active' : '' ?>">
            <span><i class="fa fa-envelope"></i> ইনবক্স মেসেজ</span>
            <?php if ($unread_msg > 0): ?><b class="adm-badge"><?= $unread_msg ?></b><?php endif; ?>
        </a></li>
        <li><a href="settings.php" class="<?= $curr_page === 'settings.php' ? 'active' : '' ?>">
            <span><i class="fa fa-cogs"></i> ওয়েবসাইট সেটিংস</span>
        </a></li>
        <li style="margin-top:14px; border-top:1px solid rgba(255,255,255,0.1); padding-top:10px;">
            <a href="../index.php" target="_blank"><span><i class="fa fa-external-link"></i> মূল ওয়েবসাইট দেখুন</span></a>
        </li>
        <li><a href="logout.php" style="color:#fca5a5;"><span><i class="fa fa-sign-out"></i> লগআউট</span></a></li>
    </ul>
</aside>
<div class="adm-main">
    <header class="adm-topbar">
        <h1><?= h($page_title ?? 'এডমিন ড্যাশবোর্ড') ?></h1>
        <div class="adm-user-bar">
            <input type="search" id="adminSearchBox" class="form-control" placeholder="দ্রুত খুঁজুন (নাম, রেজিঃ নং...)" style="width:220px;">
            <span class="badge badge-info"><i class="fa fa-user-circle"></i> <?= h($_SESSION['admin_name'] ?? 'Admin') ?></span>
            <a href="../index.php" class="btn btn-outline btn-xs" target="_blank"><i class="fa fa-globe"></i> Live Site</a>
            <a href="logout.php" class="btn btn-danger btn-xs"><i class="fa fa-power-off"></i></a>
        </div>
    </header>
    <main class="adm-content">
        <?php if ($flash): ?>
            <div class="alert alert-<?= h($flash['type']) ?>"><?= h($flash['msg']) ?></div>
        <?php endif; ?>

<?php
require_once __DIR__ . '/config/db.php';
$pdo = get_db();
$teachers = $pdo->query("SELECT * FROM teachers WHERE status='Active' ORDER BY sort_order ASC, id ASC")->fetchAll();
$page_title = 'শিক্ষক ও প্রশাসন (Teachers & Administration)';
require_once __DIR__ . '/includes/header.php';
?>
<div class="page-banner">
    <div class="container">
        <h1>আমাদের শিক্ষক ও প্রশাসন (Teachers & Administration)</h1>
        <p>আমাদের গ্রাম আইটি সেন্টারের দক্ষ ও অভিজ্ঞ প্রশিক্ষক এবং পরিচালনা পর্ষদ</p>
    </div>
</div>

<section class="section">
    <div class="container">
        <div class="grid-2">
            <?php foreach ($teachers as $t): ?>
            <div class="card" style="flex-direction:row; flex-wrap:wrap; align-items:center; padding:24px; gap:24px;">
                <img src="<?= h($t['photo']) ?>" alt="<?= h($t['name']) ?>" style="width:170px; height:170px; border-radius:50%; object-fit:cover; border:4px solid #0f766e; margin:0 auto;">
                <div style="flex:1; min-width:250px;">
                    <span class="badge badge-info" style="margin-bottom:6px;"><?= h($t['designation']) ?></span>
                    <h2 style="color:#0f172a; margin-bottom:4px;"><?= h($t['name']) ?></h2>
                    <?php if (!empty($t['qualification'])): ?>
                        <p style="color:#0f766e; font-weight:600; font-size:0.9rem; margin-bottom:8px;"><?= h($t['qualification']) ?></p>
                    <?php endif; ?>
                    <p style="font-size:0.92rem; color:#475569; margin-bottom:10px;"><?= h($t['bio']) ?></p>
                    <p style="font-size:0.9rem; margin-bottom:4px;"><i class="fa fa-map-marker" style="color:#ea580c;"></i> <strong>ঠিকানা:</strong> <?= h($t['address']) ?></p>
                    <p style="font-size:0.9rem; margin-bottom:4px;"><i class="fa fa-phone" style="color:#0f766e;"></i> <strong>ফোন:</strong> <?= h($t['phone']) ?></p>
                    <p style="font-size:0.9rem; margin-bottom:12px;"><i class="fa fa-envelope" style="color:#0f766e;"></i> <strong>ইমেইল:</strong> <?= h($t['email']) ?></p>

                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <?php if (!empty($t['facebook'])): ?>
                            <a href="<?= h($t['facebook']) ?>" target="_blank" class="btn btn-primary btn-sm"><i class="fa fa-facebook"></i> Facebook</a>
                        <?php endif; ?>
                        <?php if (!empty($t['youtube'])): ?>
                            <a href="<?= h($t['youtube']) ?>" target="_blank" class="btn btn-accent btn-sm"><i class="fa fa-youtube"></i> YouTube</a>
                        <?php endif; ?>
                        <?php if (!empty($t['github'])): ?>
                            <a href="<?= h($t['github']) ?>" target="_blank" class="btn btn-outline btn-sm" style="color:#0f172a; border-color:#cbd5e1;"><i class="fa fa-github"></i> GitHub</a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>

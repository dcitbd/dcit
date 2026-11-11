<?php
require_once __DIR__ . '/../config/db.php';
require_admin();
$pdo = get_db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $act = $_POST['form_action'] ?? '';
    $id  = (int)($_POST['id'] ?? 0);
    if ($act === 'mark_read' && $id > 0) {
        $pdo->prepare("UPDATE messages SET is_read=1 WHERE id=?")->execute([$id]);
        set_flash('success', 'মেসেজটি পঠিত হিসেবে চিহ্নিত হয়েছে।');
    } elseif ($act === 'delete' && $id > 0) {
        $pdo->prepare("DELETE FROM messages WHERE id=?")->execute([$id]);
        set_flash('success', 'মেসেজ মুছে ফেলা হয়েছে।');
    }
    header("Location: messages.php");
    exit;
}

$messages = $pdo->query("SELECT * FROM messages ORDER BY id DESC")->fetchAll();
$page_title = 'ভিজিটর মেসেজ ও ইনবক্স (Messages)';
require_once __DIR__ . '/header.php';
?>
<div class="panel-card">
    <div class="panel-header">
        <h3><i class="fa fa-envelope"></i> কন্টাক্ট আস এবং ডিজাইনার পেজের সকল মেসেজ (<?= count($messages) ?> টি)</h3>
    </div>
    <div class="dcp-table-wrap">
        <table class="dcp-table">
            <thead>
                <tr>
                    <th>তারিখ</th>
                    <th>প্রেরকের নাম ও ইমেইল</th>
                    <th>মোবাইল</th>
                    <th>বিষয় (Subject)</th>
                    <th>বার্তা (Message)</th>
                    <th>স্ট্যাটাস</th>
                    <th>অ্যাকশন</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($messages as $m): ?>
                <tr>
                    <td><small><?= h($m['created_at']) ?></small></td>
                    <td><strong><?= h($m['sender_name']) ?></strong><br><small><?= h($m['sender_email']) ?></small></td>
                    <td><?= h($m['phone']) ?></td>
                    <td><span class="badge badge-info"><?= h($m['subject']) ?></span> <small>(<?= h($m['target']) ?>)</small></td>
                    <td><?= nl2br(h($m['message'])) ?></td>
                    <td>
                        <span class="badge <?= $m['is_read'] ? 'badge-success' : 'badge-warning' ?>">
                            <?= $m['is_read'] ? 'Read' : 'New' ?>
                        </span>
                    </td>
                    <td style="white-space:nowrap;">
                        <?php if (!$m['is_read']): ?>
                        <form method="post" style="display:inline;">
                            <input type="hidden" name="form_action" value="mark_read">
                            <input type="hidden" name="id" value="<?= (int)$m['id'] ?>">
                            <button type="submit" class="btn btn-success btn-xs"><i class="fa fa-check"></i> Read</button>
                        </form>
                        <?php endif; ?>
                        <form method="post" style="display:inline;" onsubmit="return confirm('এই মেসেজ মুছে ফেলতে চান?');">
                            <input type="hidden" name="form_action" value="delete">
                            <input type="hidden" name="id" value="<?= (int)$m['id'] ?>">
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

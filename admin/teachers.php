<?php
require_once __DIR__ . '/../config/db.php';
require_admin();
$pdo = get_db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $act = $_POST['form_action'] ?? '';
    if ($act === 'save') {
        $id = (int)($_POST['id'] ?? 0);
        $name = trim($_POST['name'] ?? '');
        $designation = trim($_POST['designation'] ?? '');
        $role_type = trim($_POST['role_type'] ?? 'teacher');
        $qualification = trim($_POST['qualification'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $address = trim($_POST['address'] ?? '');
        $bio = trim($_POST['bio'] ?? '');
        $facebook = trim($_POST['facebook'] ?? '');
        $youtube = trim($_POST['youtube'] ?? '');
        $twitter = trim($_POST['twitter'] ?? '');
        $instagram = trim($_POST['instagram'] ?? '');
        $github = trim($_POST['github'] ?? '');
        $linkedin = trim($_POST['linkedin'] ?? '');
        $website = trim($_POST['website'] ?? '');
        $existing_photo = trim($_POST['existing_photo'] ?? 'assets/img/teacher-lokman.jpg');
        $photo = handle_image_upload('photo_file', $existing_photo);
        $sort_order = (int)($_POST['sort_order'] ?? 1);

        if ($id > 0) {
            $stmt = $pdo->prepare("UPDATE teachers SET name=?, designation=?, role_type=?, qualification=?, phone=?, email=?, address=?, bio=?, photo=?, facebook=?, youtube=?, twitter=?, instagram=?, github=?, linkedin=?, website=?, sort_order=? WHERE id=?");
            $stmt->execute([$name, $designation, $role_type, $qualification, $phone, $email, $address, $bio, $photo, $facebook, $youtube, $twitter, $instagram, $github, $linkedin, $website, $sort_order, $id]);
            set_flash('success', 'শিক্ষক / কর্মকর্তার তথ্য আপডেট করা হয়েছে!');
        } else {
            $stmt = $pdo->prepare("INSERT INTO teachers (name, designation, role_type, qualification, phone, email, address, bio, photo, facebook, youtube, twitter, instagram, github, linkedin, website, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$name, $designation, $role_type, $qualification, $phone, $email, $address, $bio, $photo, $facebook, $youtube, $twitter, $instagram, $github, $linkedin, $website, $sort_order]);
            set_flash('success', 'নতুন শিক্ষক সফলভাবে যুক্ত করা হয়েছে!');
        }
        header("Location: teachers.php");
        exit;
    } elseif ($act === 'delete') {
        $id = (int)($_POST['id'] ?? 0);
        $pdo->prepare("DELETE FROM teachers WHERE id=?")->execute([$id]);
        set_flash('success', 'রেকর্ড মুছে ফেলা হয়েছে।');
        header("Location: teachers.php");
        exit;
    }
}

$edit_t = null;
if (isset($_GET['edit'])) {
    $stmt = $pdo->prepare("SELECT * FROM teachers WHERE id=?");
    $stmt->execute([(int)$_GET['edit']]);
    $edit_t = $stmt->fetch();
}

$teachers = $pdo->query("SELECT * FROM teachers ORDER BY sort_order ASC, id ASC")->fetchAll();
$page_title = 'শিক্ষক ও প্রশাসন ম্যানেজমেন্ট (Teachers & Admin)';
require_once __DIR__ . '/header.php';
?>
<div class="panel-card">
    <div class="panel-header">
        <h3><i class="fa fa-users"></i> <?= $edit_t ? 'শিক্ষক / প্রশাসকের তথ্য সম্পাদনা' : 'নতুন শিক্ষক বা কর্মকর্তা যোগ করুন' ?></h3>
        <?php if ($edit_t): ?>
            <a href="teachers.php" class="btn btn-outline btn-xs">নতুন ফর্ম</a>
        <?php endif; ?>
    </div>
    <div class="panel-body">
        <form method="post" enctype="multipart/form-data">
            <input type="hidden" name="form_action" value="save">
            <input type="hidden" name="id" value="<?= (int)($edit_t['id'] ?? 0) ?>">
            <input type="hidden" name="existing_photo" value="<?= h($edit_t['photo'] ?? 'assets/img/teacher-lokman.jpg') ?>">

            <div class="form-grid">
                <div class="form-group">
                    <label>নাম (Name) *</label>
                    <input type="text" name="name" class="form-control" required value="<?= h($edit_t['name'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>পদবী (Designation) *</label>
                    <input type="text" name="designation" class="form-control" required value="<?= h($edit_t['designation'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>ভূমিকা (Role Category)</label>
                    <select name="role_type" class="form-control">
                        <option value="admin_teacher" <?= ($edit_t['role_type'] ?? '') === 'admin_teacher' ? 'selected' : '' ?>>Senior Teacher & Administrator</option>
                        <option value="teacher" <?= ($edit_t['role_type'] ?? '') === 'teacher' ? 'selected' : '' ?>>Teacher / Trainer</option>
                        <option value="designer" <?= ($edit_t['role_type'] ?? '') === 'designer' ? 'selected' : '' ?>>Teacher & Web Designer</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>শিক্ষাগত যোগ্যতা / বিশেষত্ব</label>
                    <input type="text" name="qualification" class="form-control" value="<?= h($edit_t['qualification'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>মোবাইল নম্বর *</label>
                    <input type="text" name="phone" class="form-control" required value="<?= h($edit_t['phone'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>ইমেইল</label>
                    <input type="email" name="email" class="form-control" value="<?= h($edit_t['email'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>ঠিকানা (Address)</label>
                    <input type="text" name="address" class="form-control" value="<?= h($edit_t['address'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>ছবি আপলোড</label>
                    <input type="file" name="photo_file" class="form-control" accept="image/*">
                </div>
                <div class="form-group">
                    <label>Facebook URL</label>
                    <input type="text" name="facebook" class="form-control" value="<?= h($edit_t['facebook'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>YouTube URL</label>
                    <input type="text" name="youtube" class="form-control" value="<?= h($edit_t['youtube'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>GitHub URL</label>
                    <input type="text" name="github" class="form-control" value="<?= h($edit_t['github'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>LinkedIn / Website</label>
                    <input type="text" name="linkedin" class="form-control" value="<?= h($edit_t['linkedin'] ?? '') ?>">
                </div>
                <div class="form-group" style="grid-column:1 / -1;">
                    <label>সংক্ষিপ্ত পরিচিতি (Bio)</label>
                    <textarea name="bio" class="form-control" rows="3"><?= h($edit_t['bio'] ?? '') ?></textarea>
                </div>
            </div>
            <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> সংরক্ষণ করুন</button>
        </form>
    </div>
</div>

<div class="panel-card">
    <div class="panel-header">
        <h3><i class="fa fa-list"></i> শিক্ষক ও কর্মকর্তা তালিকা (<?= count($teachers) ?> জন)</h3>
    </div>
    <div class="adm-table-wrap">
        <table class="adm-table">
            <thead>
                <tr>
                    <th>ছবি</th>
                    <th>নাম ও পদবী</th>
                    <th>যোগ্যতা</th>
                    <th>মোবাইল ও ইমেইল</th>
                    <th>ঠিকানা</th>
                    <th>অ্যাকশন</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($teachers as $t): ?>
                <tr>
                    <td><img src="../<?= h($t['photo']) ?>" style="width:50px; height:50px; border-radius:50%; object-fit:cover;"></td>
                    <td><strong><?= h($t['name']) ?></strong><br><span class="badge badge-info"><?= h($t['designation']) ?></span></td>
                    <td><small><?= h($t['qualification']) ?></small></td>
                    <td><?= h($t['phone']) ?><br><small><?= h($t['email']) ?></small></td>
                    <td><small><?= h($t['address']) ?></small></td>
                    <td style="white-space:nowrap;">
                        <a href="teachers.php?edit=<?= (int)$t['id'] ?>" class="btn btn-primary btn-xs"><i class="fa fa-edit"></i></a>
                        <form method="post" style="display:inline;" onsubmit="return confirm('মুছে ফেলতে চান?');">
                            <input type="hidden" name="form_action" value="delete">
                            <input type="hidden" name="id" value="<?= (int)$t['id'] ?>">
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

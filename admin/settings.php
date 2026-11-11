<?php
require_once __DIR__ . '/../config/db.php';
require_admin();
$pdo = get_db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $act = $_POST['form_action'] ?? '';
    if ($act === 'save_settings') {
        $keys = [
            'site_name', 'site_subtitle', 'address_bn', 'address_en',
            'phone_1', 'phone_2', 'email_1', 'email_2', 'facebook_url',
            'notice_text', 'stat_experience', 'stat_team', 'stat_courses', 'stat_students',
            'about_intro', 'mission_text', 'vision_text'
        ];
        $stmt = $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON CONFLICT(setting_key) DO UPDATE SET setting_value=excluded.setting_value");
        foreach ($keys as $k) {
            if (isset($_POST[$k])) {
                try {
                    $stmt->execute([$k, trim($_POST[$k])]);
                } catch (Exception $e) {
                    // Fallback for MySQL syntax if running on MySQL
                    $up = $pdo->prepare("REPLACE INTO settings (setting_key, setting_value) VALUES (?, ?)");
                    $up->execute([$k, trim($_POST[$k])]);
                }
            }
        }
        set_flash('success', 'ওয়েবসাইট সেটিংস সফলভাবে আপডেট করা হয়েছে!');
        header("Location: settings.php");
        exit;
    } elseif ($act === 'change_password') {
        $new_pass = trim($_POST['new_password'] ?? '');
        if (strlen($new_pass) >= 4) {
            $hash = hash_password_custom($new_pass);
            $pdo->prepare("UPDATE admins SET password_hash=? WHERE id=?")->execute([$hash, (int)$_SESSION['admin_id']]);
            set_flash('success', 'এডমিন পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
        } else {
            set_flash('danger', 'পাসওয়ার্ড অন্তত ৪ অক্ষরের হতে হবে।');
        }
        header("Location: settings.php");
        exit;
    }
}

$page_title = 'ওয়েবসাইট সেটিংস ও কনফিগারেশন';
require_once __DIR__ . '/header.php';
?>
<div class="panel-card">
    <div class="panel-header">
        <h3><i class="fa fa-cogs"></i> প্রতিষ্ঠানের সাধারণ তথ্য ও ওয়েবসাইট সেটিংস</h3>
    </div>
    <div class="panel-body">
        <form method="post">
            <input type="hidden" name="form_action" value="save_settings">
            <div class="form-grid">
                <div class="form-group">
                    <label>প্রতিষ্ঠানের নাম (Site Name)</label>
                    <input type="text" name="site_name" class="form-control" value="<?= h(setting('site_name')) ?>">
                </div>
                <div class="form-group">
                    <label>সাব-টাইটেল / ট্যাগলাইন</label>
                    <input type="text" name="site_subtitle" class="form-control" value="<?= h(setting('site_subtitle')) ?>">
                </div>
                <div class="form-group">
                    <label>প্রধান মোবাইল নম্বর</label>
                    <input type="text" name="phone_1" class="form-control" value="<?= h(setting('phone_1')) ?>">
                </div>
                <div class="form-group">
                    <label>দ্বিতীয় মোবাইল নম্বর</label>
                    <input type="text" name="phone_2" class="form-control" value="<?= h(setting('phone_2')) ?>">
                </div>
                <div class="form-group">
                    <label>প্রধান ইমেইল</label>
                    <input type="email" name="email_1" class="form-control" value="<?= h(setting('email_1')) ?>">
                </div>
                <div class="form-group">
                    <label>দ্বিতীয় ইমেইল</label>
                    <input type="email" name="email_2" class="form-control" value="<?= h(setting('email_2')) ?>">
                </div>
                <div class="form-group" style="grid-column:1 / -1;">
                    <label>ঠিকানা (বাংলায়)</label>
                    <input type="text" name="address_bn" class="form-control" value="<?= h(setting('address_bn')) ?>">
                </div>
                <div class="form-group" style="grid-column:1 / -1;">
                    <label>ঠিকানা (English)</label>
                    <input type="text" name="address_en" class="form-control" value="<?= h(setting('address_en')) ?>">
                </div>
                <div class="form-group" style="grid-column:1 / -1;">
                    <label>স্ক্রলিং নোটিশ বার্তা (Top Notice Marquee)</label>
                    <input type="text" name="notice_text" class="form-control" value="<?= h(setting('notice_text')) ?>">
                </div>
                <div class="form-group">
                    <label>অভিজ্ঞতা (Years of Experience)</label>
                    <input type="text" name="stat_experience" class="form-control" value="<?= h(setting('stat_experience')) ?>">
                </div>
                <div class="form-group">
                    <label>টিম মেম্বার সংখ্যা</label>
                    <input type="text" name="stat_team" class="form-control" value="<?= h(setting('stat_team')) ?>">
                </div>
                <div class="form-group">
                    <label>মোট কোর্স সংখ্যা (Stat)</label>
                    <input type="text" name="stat_courses" class="form-control" value="<?= h(setting('stat_courses')) ?>">
                </div>
                <div class="form-group">
                    <label>মোট শিক্ষার্থী সংখ্যা (Stat)</label>
                    <input type="text" name="stat_students" class="form-control" value="<?= h(setting('stat_students')) ?>">
                </div>
                <div class="form-group" style="grid-column:1 / -1;">
                    <label>ফেসবুক পেজ লিংক</label>
                    <input type="text" name="facebook_url" class="form-control" value="<?= h(setting('facebook_url')) ?>">
                </div>
                <div class="form-group" style="grid-column:1 / -1;">
                    <label>আমাদের সম্পর্কে (About Us Text)</label>
                    <textarea name="about_intro" class="form-control" rows="2"><?= h(setting('about_intro')) ?></textarea>
                </div>
                <div class="form-group">
                    <label>আমাদের লক্ষ্য (Our Mission)</label>
                    <textarea name="mission_text" class="form-control" rows="2"><?= h(setting('mission_text')) ?></textarea>
                </div>
                <div class="form-group">
                    <label>আমাদের ভিশন (Our Vision)</label>
                    <textarea name="vision_text" class="form-control" rows="2"><?= h(setting('vision_text')) ?></textarea>
                </div>
            </div>
            <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> সেটিংস আপডেট করুন</button>
        </form>
    </div>
</div>

<div class="panel-card">
    <div class="panel-header">
        <h3><i class="fa fa-lock"></i> এডমিন পাসওয়ার্ড পরিবর্তন করুন</h3>
    </div>
    <div class="panel-body">
        <form method="post" style="max-width:400px;">
            <input type="hidden" name="form_action" value="change_password">
            <div class="form-group">
                <label>নতুন পাসওয়ার্ড দিন *</label>
                <input type="password" name="new_password" class="form-control" required placeholder="নতুন পাসওয়ার্ড লিখুন">
            </div>
            <button type="submit" class="btn btn-accent"><i class="fa fa-key"></i> পাসওয়ার্ড পরিবর্তন করুন</button>
        </form>
    </div>
</div>
<?php require_once __DIR__ . '/footer.php'; ?>

<?php
require_once __DIR__ . '/config/db.php';
$pdo = get_db();
$msg_sent = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['sender_name'] ?? '');
    $email = trim($_POST['sender_email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $subject = trim($_POST['subject'] ?? 'Course Information');
    $message = trim($_POST['message'] ?? '');
    if ($name !== '' && $message !== '') {
        $stmt = $pdo->prepare("INSERT INTO messages (sender_name, sender_email, phone, subject, message, target) VALUES (?, ?, ?, ?, ?, 'Office')");
        $stmt->execute([$name, $email, $phone, $subject, $message]);
        $msg_sent = true;
    }
}

$page_title = 'যোগাযোগ (Contact Us)';
require_once __DIR__ . '/includes/header.php';
?>
<div class="page-banner">
    <div class="container">
        <h1>যোগাযোগ করুন (Contact Us)</h1>
        <p><?= h(setting('address_bn')) ?></p>
    </div>
</div>

<section class="section">
    <div class="container">
        <?php if ($msg_sent): ?>
            <div class="alert alert-success">ধন্যবাদ! আপনার বার্তাটি সফলভাবে আমাদের অফিসে পৌঁছেছে। খুব শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।</div>
        <?php endif; ?>

        <div class="grid-2" style="margin-bottom:36px;">
            <div class="form-card">
                <h3 style="margin-bottom:16px; color:#0f766e;"><i class="fa fa-envelope-o"></i> আমাদের মেসেজ পাঠান</h3>
                <form method="post">
                    <div class="form-group">
                        <label>আপনার নাম (Your Name) *</label>
                        <input type="text" name="sender_name" class="form-control" required placeholder="আপনার নাম লিখুন">
                    </div>
                    <div class="form-group">
                        <label>ইমেইল (Your E-mail) *</label>
                        <input type="email" name="sender_email" class="form-control" required placeholder="example@gmail.com">
                    </div>
                    <div class="form-group">
                        <label>মোবাইল নম্বর (Phone) *</label>
                        <input type="tel" name="phone" class="form-control" required placeholder="017XXXXXXXX">
                    </div>
                    <div class="form-group">
                        <label>বিষয় (Subject)</label>
                        <select name="subject" class="form-control">
                            <?php foreach (['Admission', 'Re-Admission', 'Course Information', 'Class Information', 'Certificate Find', 'Official Information', 'Advice / Request', 'Other'] as $sub): ?>
                                <option value="<?= $sub ?>"><?= $sub ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>আপনার বার্তা (Your Message) *</label>
                        <textarea name="message" class="form-control" rows="4" required placeholder="আপনার প্রশ্ন বা মতামত লিখুন..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary"><i class="fa fa-telegram"></i> মেসেজ পাঠান (Send Message)</button>
                </form>
            </div>

            <div class="form-card">
                <h3 style="margin-bottom:14px; color:#0f766e;"><i class="fa fa-building"></i> আমাদের অফিস (Our Office)</h3>
                <p style="margin-bottom:18px; color:#475569;">We eagerly want to meet with you. You are most welcome to visit our office and training labs at Poduar Bazar, Cumilla.</p>

                <div style="margin-bottom:16px;">
                    <h4><i class="fa fa-map-marker" style="color:#ea580c;"></i> ঠিকানা (Address):</h4>
                    <p><?= h(setting('address_bn')) ?></p>
                    <p style="font-size:0.9rem; color:#64748b;"><?= h(setting('address_en')) ?></p>
                </div>

                <div style="margin-bottom:16px;">
                    <h4><i class="fa fa-phone" style="color:#0f766e;"></i> মোবাইল নম্বর (Phone):</h4>
                    <p><a href="tel:<?= h(setting('phone_1')) ?>"><?= h(setting('phone_1')) ?></a>, <a href="tel:<?= h(setting('phone_2')) ?>"><?= h(setting('phone_2')) ?></a></p>
                </div>

                <div style="margin-bottom:20px;">
                    <h4><i class="fa fa-envelope" style="color:#0f766e;"></i> ইমেইল (E-mail):</h4>
                    <p><?= h(setting('email_1')) ?><br><?= h(setting('email_2')) ?></p>
                </div>

                <iframe src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d98508.59426380768!2d91.16768542288791!3d23.42987405719204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1samader%20gram!5e0!3m2!1sen!2sbd!4v1592329322732!5m2!1sen!2sbd" width="100%" height="230" style="border:0; border-radius:10px;" allowfullscreen="" loading="lazy"></iframe>
            </div>
        </div>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>

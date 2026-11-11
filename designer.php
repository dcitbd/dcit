<?php
require_once __DIR__ . '/config/db.php';
$pdo = get_db();
$msg_sent = false;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['sender_name'] ?? '');
    $email = trim($_POST['sender_email'] ?? '');
    $subject = trim($_POST['subject'] ?? 'Web Design Inquiry');
    $message = trim($_POST['message'] ?? '');
    if ($name !== '' && $message !== '') {
        $stmt = $pdo->prepare("INSERT INTO messages (sender_name, sender_email, phone, subject, message, target) VALUES (?, ?, '', ?, ?, 'Designer')");
        $stmt->execute([$name, $email, $subject, $message]);
        $msg_sent = true;
    }
}
$page_title = 'ওয়েব ডিজাইনার ও ডেভেলপার (Designer Profile)';
require_once __DIR__ . '/includes/header.php';
?>
<div class="page-hero-strip">
    <div class="container">
        <h1>Web Designer & Developer Profile</h1>
        <p>Jainal Abedin (Sagor) — Professional Web Designer & Developer</p>
    </div>
</div>

<section class="section">
    <div class="container">
        <?php if ($msg_sent): ?>
            <div class="alert alert-success">আপনার মেসেজ সফলভাবে প্রেরণ করা হয়েছে!</div>
        <?php endif; ?>
        <div class="grid-2">
            <div class="form-card" style="text-align:center;">
                <img src="assets/img/teacher-sagor.jpg" alt="Jainal Abedin Sagor" style="width:180px; height:180px; border-radius:50%; object-fit:cover; margin:0 auto 16px; border:4px solid #0f766e;">
                <h2>Jainal Abedin (Sagor)</h2>
                <p style="color:#0f766e; font-weight:700; margin-bottom:12px;">Junior Teacher & Full-Stack Web Designer</p>
                <p style="text-align:justify; color:#334155; margin-bottom:16px;">
                    Hi, I'm a Professional Web Designer and WordPress Theme Developer. Experienced in HTML5, CSS3, JavaScript, jQuery, Bootstrap, PHP, and MySQL. I am always attentive to client satisfaction. Feel free to contact me for web design, development, or training inquiries.
                </p>
                <div style="text-align:left; background:#f8fafc; padding:16px; border-radius:10px; font-size:0.92rem;">
                    <p><strong>Phone:</strong> 01879653143, 01875122169</p>
                    <p><strong>E-mail:</strong> gsctcbmcmrjas@gmail.com</p>
                    <p><strong>Outlook:</strong> gsctcbmcmrjas@outlook.com</p>
                    <p><strong>Address:</strong> Boro Moheshkhali, Moheshkhali, Cox's Bazar</p>
                </div>
            </div>

            <div class="form-card">
                <h3 style="margin-bottom:14px; color:#0f766e;"><i class="fa fa-paper-plane"></i> Contact With Designer</h3>
                <form method="post">
                    <div class="form-group">
                        <label>Subject *</label>
                        <input type="text" name="subject" class="form-control" required placeholder="Project or Inquiry Subject">
                    </div>
                    <div class="form-group">
                        <label>Your Name *</label>
                        <input type="text" name="sender_name" class="form-control" required placeholder="Type your name">
                    </div>
                    <div class="form-group">
                        <label>Your Email Address *</label>
                        <input type="email" name="sender_email" class="form-control" required placeholder="Type your email">
                    </div>
                    <div class="form-group">
                        <label>Details *</label>
                        <textarea name="message" class="form-control" rows="4" required placeholder="Write your message or project details..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> Submit Message</button>
                </form>
            </div>
        </div>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>

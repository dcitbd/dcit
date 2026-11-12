<?php
require_once __DIR__ . '/config/db.php';
$pdo = get_db();

$submitted_app_no = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $full_name = trim($_POST['full_name'] ?? '');
    $father_name = trim($_POST['father_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $school_college = trim($_POST['school_college'] ?? '');
    $religion = trim($_POST['religion'] ?? 'Muslim');
    $education = trim($_POST['education'] ?? 'HSC');
    $course_name = trim($_POST['course_name'] ?? 'Advance Microsoft Office');
    $preferred_slot = trim($_POST['preferred_slot'] ?? '9:30 AM - 11:00 AM');
    $session_quarter = trim($_POST['session_quarter'] ?? 'January to March');
    $dob = trim($_POST['dob'] ?? '');
    $payment_method = trim($_POST['payment_method'] ?? 'bKash');
    $trx_id = trim($_POST['trx_id'] ?? '');
    $paid_amount = (float)($_POST['paid_amount'] ?? 0);
    $doc_path = handle_image_upload('document_file', '');

    if ($full_name !== '' && $phone !== '') {
        $app_no = 'REG-' . date('Y') . '-' . mt_rand(1000, 9999);
        $stmt = $pdo->prepare("INSERT INTO admissions (application_no, full_name, father_name, email, phone, address, school_college, religion, education, course_name, preferred_slot, session_quarter, batch_year, dob, document_path, payment_method, trx_id, paid_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')");
        $stmt->execute([$app_no, $full_name, $father_name, $email, $phone, $address, $school_college, $religion, $education, $course_name, $preferred_slot, $session_quarter, (int)date('Y'), $dob, $doc_path, $payment_method, $trx_id, $paid_amount]);
        $submitted_app_no = $app_no;
    }
}

$selected_course = trim($_GET['course'] ?? 'Advance Microsoft Office');
$courses_list = $pdo->query("SELECT title, fee FROM courses WHERE status='Active' ORDER BY sort_order ASC")->fetchAll();
$slots_list   = $pdo->query("SELECT time_label, batch_name FROM classes WHERE status='Active' ORDER BY sort_order ASC")->fetchAll();

$page_title = 'অনলাইন ভর্তি ফর্ম (Online Admission)';
require_once __DIR__ . '/includes/header.php';
?>
<div class="page-hero-strip">
    <div class="container">
        <h1>অনলাইন ভর্তি ফর্ম (Online Admission)</h1>
        <p>ঘরে বসেই আপনার পছন্দের কোর্সে ভর্তি আবেদন সম্পন্ন করুন</p>
    </div>
</div>

<section class="section">
    <div class="container" style="max-width:920px;">
        <?php if ($submitted_app_no): ?>
            <div class="alert alert-success" style="flex-direction:column; align-items:flex-start; gap:8px; padding:22px;">
                <h3 style="color:#166534;"><i class="fa fa-check-circle"></i> অভিনন্দন! আপনার অনলাইন ভর্তি আবেদন সফলভাবে জমা হয়েছে।</h3>
                <p>আপনার ট্র্যাকিং / আবেদন নম্বরঃ <strong style="font-size:1.2rem; background:#fff; padding:2px 10px; border-radius:6px;"><?= h($submitted_app_no) ?></strong></p>
                <p>আমাদের এডমিন প্যানেল থেকে আপনার আবেদনটি যাচাই করে দ্রুততম সময়ে রেজিস্ট্রেশন নম্বর ও রোল নম্বর প্রদান করা হবে। জরুরি যোগাযোগঃ <?= h(setting('phone_1')) ?>।</p>
            </div>
        <?php endif; ?>

        <div class="card" style="margin-bottom:24px; background:#fffbeb; border-color:#fde68a;">
            <div class="card-body">
                <h3 style="color:#92400e; margin-bottom:8px;"><i class="fa fa-file-text-o"></i> ভর্তির জন্য প্রয়োজনীয় কাগজপত্র (Necessary Documents):</h3>
                <ul style="padding-left:20px; color:#78350f; font-weight:600;">
                    <li>১. এনআইডি কার্ড অথবা জন্ম নিবন্ধন সনদের ফটোকপি ১ কপি (NID Card or Birth Registration Card 1 copy).</li>
                    <li>২. শিক্ষাগত যোগ্যতার সনদের ফটোকপি ১ কপি (Educational Certificate 1 copy).</li>
                    <li>৩. পাসপোর্ট সাইজের রঙিন ছবি ২ কপি (Passport Size Picture 2 copies).</li>
                </ul>
            </div>
        </div>

        <div class="form-card">
            <h2 style="margin-bottom:18px; color:#0f766e; border-bottom:2px solid #e2e8f0; padding-bottom:10px;">
                <i class="fa fa-graduation-cap"></i> শিক্ষার্থী ভর্তি আবেদন ফর্ম
            </h2>
            <form method="post" enctype="multipart/form-data">
                <div class="form-grid">
                    <div class="form-group">
                        <label><i class="fa fa-user"></i> শিক্ষার্থীর পূর্ণ নাম (Full Name) *</label>
                        <input type="text" name="full_name" class="form-control" required placeholder="আপনার পূর্ণ নাম লিখুন">
                    </div>
                    <div class="form-group">
                        <label><i class="fa fa-user-o"></i> পিতার নাম (Father's Name) *</label>
                        <input type="text" name="father_name" class="form-control" required placeholder="পিতার নাম লিখুন">
                    </div>
                    <div class="form-group">
                        <label><i class="fa fa-phone"></i> মোবাইল নম্বর (Phone) *</label>
                        <input type="tel" name="phone" class="form-control" required placeholder="017XXXXXXXX">
                    </div>
                    <div class="form-group">
                        <label><i class="fa fa-envelope"></i> ইমেইল (Gmail - ঐচ্ছিক)</label>
                        <input type="email" name="email" class="form-control" placeholder="example@gmail.com">
                    </div>
                    <div class="form-group">
                        <label><i class="fa fa-book"></i> পছন্দের কোর্স (Select Subject / Course) *</label>
                        <select name="course_name" class="form-control" required>
                            <?php foreach ($courses_list as $c): ?>
                                <option value="<?= h($c['title']) ?>" <?= $selected_course === $c['title'] ? 'selected' : '' ?>>
                                    <?= h($c['title']) ?> (ফিঃ ৳<?= number_format((float)$c['fee'], 0) ?>)
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><i class="fa fa-clock-o"></i> পছন্দের ক্লাস টাইম (Preferred Class Time) *</label>
                        <select name="preferred_slot" class="form-control" required>
                            <?php foreach ($slots_list as $sl): ?>
                                <option value="<?= h($sl['time_label']) ?>"><?= h($sl['time_label']) ?> (<?= h($sl['batch_name']) ?>)</option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><i class="fa fa-calendar"></i> সেশন (Session)</label>
                        <select name="session_quarter" class="form-control">
                            <option value="January to March">January to March</option>
                            <option value="April to June">April to June</option>
                            <option value="July to September">July to September</option>
                            <option value="October to December">October to December</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><i class="fa fa-calendar-o"></i> জন্ম তারিখ (Date of Birth) *</label>
                        <input type="date" name="dob" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fa fa-university"></i> স্কুল / কলেজ / প্রতিষ্ঠানের নাম *</label>
                        <input type="text" name="school_college" class="form-control" required placeholder="আপনার শিক্ষা প্রতিষ্ঠানের নাম">
                    </div>
                    <div class="form-group">
                        <label><i class="fa fa-graduation-cap"></i> সর্বশেষ শিক্ষাগত যোগ্যতা (Graduation)</label>
                        <select name="education" class="form-control">
                            <?php foreach (['HSC', 'SSC', 'BA / Honours', 'MA / Masters', 'JSC', 'PSC', 'Others'] as $ed): ?>
                                <option value="<?= $ed ?>"><?= $ed ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><i class="fa fa-registered"></i> ধর্ম (Religion)</label>
                        <select name="religion" class="form-control">
                            <option value="Muslim">Muslim (ইসলাম)</option>
                            <option value="Hindu">Hindu (হিন্দু)</option>
                            <option value="Buddhist">Buddhist (বৌদ্ধ)</option>
                            <option value="Christian">Christian (খ্রিস্টান)</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><i class="fa fa-file"></i> ছবি বা ডকুমেন্ট আপলোড (ঐচ্ছিক)</label>
                        <input type="file" name="document_file" class="form-control">
                    </div>
                    <div class="form-group" style="grid-column: 1 / -1;">
                        <label><i class="fa fa-map-marker"></i> বর্তমান ঠিকানা (Present Address) *</label>
                        <input type="text" name="address" class="form-control" required placeholder="গ্রাম/মহল্লা, ডাকঘর, উপজেলা, জেলা">
                    </div>
                    <div class="form-group">
                        <label><i class="fa fa-money"></i> পেমেন্ট মাধ্যম (ভর্তি ফি প্রদানের মাধ্যম)</label>
                        <select name="payment_method" class="form-control">
                            <option value="Cash at Office">অফিসে সরাসরি নগদ (Cash at Office)</option>
                            <option value="bKash">বিকাশ (bKash - <?= h(setting('phone_1')) ?>)</option>
                            <option value="Nagad">নগদ (Nagad - <?= h(setting('phone_1')) ?>)</option>
                            <option value="Rocket">রকেট (Rocket)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>প্রদত্ত ভর্তি ফি (টাকা - ঐচ্ছিক)</label>
                        <input type="number" name="paid_amount" class="form-control" value="500" placeholder="টাকার পরিমাণ লিখুন">
                    </div>
                    <div class="form-group">
                        <label>বিকাশ/নগদ TrxID (যদি অনলাইনে পাঠিয়ে থাকেন)</label>
                        <input type="text" name="trx_id" class="form-control" placeholder="TrxID বা রেফারেন্স">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" style="padding:13px 28px; font-size:1rem;">
                    <i class="fa fa-paper-plane"></i> ভর্তি আবেদন জমা দিন (Submit Application)
                </button>
            </form>
        </div>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>

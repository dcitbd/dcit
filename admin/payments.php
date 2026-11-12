<?php
require_once __DIR__ . '/../config/db.php';
require_admin();
$pdo = get_db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $act = $_POST['form_action'] ?? '';
    if ($act === 'save') {
        $id = (int)($_POST['id'] ?? 0);
        $receipt_no = trim($_POST['receipt_no'] ?? '');
        $reg_no = trim($_POST['reg_no'] ?? '');
        $student_name = trim($_POST['student_name'] ?? '');
        $course_name = trim($_POST['course_name'] ?? '');
        $total_fee = (float)($_POST['total_fee'] ?? 0);
        $paid_amount = (float)($_POST['paid_amount'] ?? 0);
        $due_amount = max(0, $total_fee - $paid_amount);
        $payment_type = trim($_POST['payment_type'] ?? 'Course Fee');
        $payment_method = trim($_POST['payment_method'] ?? 'Cash');
        $trx_id = trim($_POST['trx_id'] ?? '');
        $payment_date = trim($_POST['payment_date'] ?? date('Y-m-d'));
        $remarks = trim($_POST['remarks'] ?? '');
        $collected_by = $_SESSION['admin_name'] ?? 'Admin';
        $status = $due_amount <= 0 ? 'Paid' : ($paid_amount > 0 ? 'Partial' : 'Due');

        if ($id > 0) {
            $stmt = $pdo->prepare("UPDATE payments SET receipt_no=?, reg_no=?, student_name=?, course_name=?, total_fee=?, paid_amount=?, due_amount=?, payment_type=?, payment_method=?, trx_id=?, payment_date=?, remarks=?, status=? WHERE id=?");
            $stmt->execute([$receipt_no, $reg_no, $student_name, $course_name, $total_fee, $paid_amount, $due_amount, $payment_type, $payment_method, $trx_id, $payment_date, $remarks, $status, $id]);
            set_flash('success', 'পেমেন্ট রেকর্ড সফলভাবে আপডেট করা হয়েছে!');
        } else {
            $stmt = $pdo->prepare("INSERT INTO payments (receipt_no, reg_no, student_name, course_name, total_fee, paid_amount, due_amount, payment_type, payment_method, trx_id, payment_date, remarks, collected_by, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$receipt_no, $reg_no, $student_name, $course_name, $total_fee, $paid_amount, $due_amount, $payment_type, $payment_method, $trx_id, $payment_date, $remarks, $collected_by, $status]);
            set_flash('success', 'নতুন পেমেন্ট ও মানি রিসিপ্ট সফলভাবে তৈরি হয়েছে!');
        }
        header("Location: payments.php");
        exit;
    } elseif ($act === 'delete') {
        $id = (int)($_POST['id'] ?? 0);
        $pdo->prepare("DELETE FROM payments WHERE id=?")->execute([$id]);
        set_flash('success', 'পেমেন্ট রেকর্ড মুছে ফেলা হয়েছে।');
        header("Location: payments.php");
        exit;
    }
}

$edit_pay = null;
if (isset($_GET['edit'])) {
    $stmt = $pdo->prepare("SELECT * FROM payments WHERE id=?");
    $stmt->execute([(int)$_GET['edit']]);
    $edit_pay = $stmt->fetch();
}

$students_list = $pdo->query("SELECT s.*, COALESCE(c.fee, 1500) as c_fee FROM students s LEFT JOIN courses c ON s.course_name = c.title ORDER BY s.id DESC")->fetchAll();
$courses_list  = $pdo->query("SELECT title, fee FROM courses ORDER BY sort_order ASC")->fetchAll();
$payments      = $pdo->query("SELECT * FROM payments ORDER BY id DESC")->fetchAll();
$next_inv      = 'INV-' . date('Y') . '-' . str_pad((string)(count($payments) + 1), 3, '0', STR_PAD_LEFT);

$sum_total = 0; $sum_paid = 0; $sum_due = 0;
foreach ($payments as $p) {
    $sum_total += (float)$p['total_fee'];
    $sum_paid  += (float)$p['paid_amount'];
    $sum_due   += (float)$p['due_amount'];
}

$page_title = 'পেমেন্ট, ফি ও ক্যাশ মেমো ম্যানেজমেন্ট';
require_once __DIR__ . '/header.php';
?>
<div class="kpi-grid" style="margin-bottom:20px;">
    <div class="kpi-card">
        <div class="kpi-info"><h4>মোট কোর্স ফি (Receivable)</h4><h2>৳ <?= number_format($sum_total, 0) ?></h2></div>
        <div class="kpi-icon" style="background:#e0f2fe; color:#0369a1;"><i class="fa fa-calculator"></i></div>
    </div>
    <div class="kpi-card">
        <div class="kpi-info"><h4>মোট আদায়কৃত পেমেন্ট (Collected)</h4><h2 style="color:#15803d;">৳ <?= number_format($sum_paid, 0) ?></h2></div>
        <div class="kpi-icon" style="background:#dcfce7; color:#15803d;"><i class="fa fa-check-circle"></i></div>
    </div>
    <div class="kpi-card">
        <div class="kpi-info"><h4>মোট বকেয়া ফি (Total Due)</h4><h2 style="color:#dc2626;">৳ <?= number_format($sum_due, 0) ?></h2></div>
        <div class="kpi-icon" style="background:#fee2e2; color:#dc2626;"><i class="fa fa-clock-o"></i></div>
    </div>
</div>

<div class="panel-card">
    <div class="panel-header">
        <h3><i class="fa fa-money"></i> <?= $edit_pay ? 'পেমেন্ট তথ্য ও কিস্তি আপডেট করুন' : 'নতুন পেমেন্ট গ্রহণ / ক্যাশ মেমো তৈরি করুন' ?></h3>
        <?php if ($edit_pay): ?>
            <a href="payments.php" class="btn btn-outline btn-xs">নতুন পেমেন্ট</a>
        <?php endif; ?>
    </div>
    <div class="panel-body">
        <form method="post">
            <input type="hidden" name="form_action" value="save">
            <input type="hidden" name="id" value="<?= (int)($edit_pay['id'] ?? 0) ?>">

            <?php if (!$edit_pay): ?>
            <div class="form-group" style="background:#eff6ff; padding:12px; border-radius:8px; border:1px dashed #3b82f6;">
                <label><i class="fa fa-user"></i> স্টুডেন্ট তালিকা থেকে সিলেক্ট করুন (অটো-ফিল):</label>
                <select id="student_preset" class="form-control">
                    <option value="">-- স্টুডেন্ট সিলেক্ট করুন --</option>
                    <?php foreach ($students_list as $st): ?>
                        <option value="<?= (int)$st['id'] ?>"
                                data-reg="<?= h($st['reg_no']) ?>"
                                data-name="<?= h($st['name']) ?>"
                                data-course="<?= h($st['course_name']) ?>"
                                data-fee="<?= (float)$st['c_fee'] ?>">
                            <?= h($st['reg_no']) ?> - <?= h($st['name']) ?> (<?= h($st['course_name']) ?> - ৳<?= (float)$st['c_fee'] ?>)
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
            <?php endif; ?>

            <div class="form-grid">
                <div class="form-group">
                    <label>রিসিপ্ট / ইনভয়েস নং *</label>
                    <input type="text" name="receipt_no" class="form-control" required value="<?= h($edit_pay['receipt_no'] ?? $next_inv) ?>">
                </div>
                <div class="form-group">
                    <label>স্টুডেন্ট রেজিঃ নং *</label>
                    <input type="text" id="reg_no" name="reg_no" class="form-control" required value="<?= h($edit_pay['reg_no'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>শিক্ষার্থীর নাম *</label>
                    <input type="text" id="student_name" name="student_name" class="form-control" required value="<?= h($edit_pay['student_name'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>কোর্সের নাম *</label>
                    <input type="text" id="course_name" name="course_name" class="form-control" required value="<?= h($edit_pay['course_name'] ?? 'Advance Microsoft Office') ?>">
                </div>
                <div class="form-group">
                    <label>মোট নির্ধারিত ফি (Total Fee ৳) *</label>
                    <input type="number" step="0.01" id="total_fee" name="total_fee" class="form-control" required value="<?= (float)($edit_pay['total_fee'] ?? 1500) ?>">
                </div>
                <div class="form-group">
                    <label>জমা / পরিশোধিত টাকা (Paid ৳) *</label>
                    <input type="number" step="0.01" id="paid_amount" name="paid_amount" class="form-control" required value="<?= (float)($edit_pay['paid_amount'] ?? 1500) ?>">
                </div>
                <div class="form-group">
                    <label>বকেয়া টাকা (Due ৳ - অটো হিসাব)</label>
                    <input type="number" step="0.01" id="due_amount" name="due_amount" class="form-control" readonly value="<?= (float)($edit_pay['due_amount'] ?? 0) ?>" style="background:#f1f5f9; font-weight:700;">
                </div>
                <div class="form-group">
                    <label>পেমেন্টের ধরন</label>
                    <select name="payment_type" class="form-control">
                        <?php foreach (['Full Course Fee', 'Installment', 'Admission Fee', 'Exam / Certificate Fee'] as $pt): ?>
                            <option value="<?= $pt ?>" <?= ($edit_pay['payment_type'] ?? '') === $pt ? 'selected' : '' ?>><?= $pt ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label>পেমেন্ট মাধ্যম (Method)</label>
                    <select name="payment_method" class="form-control">
                        <?php foreach (['Cash', 'bKash', 'Nagad', 'Rocket', 'Bank Transfer'] as $pm): ?>
                            <option value="<?= $pm ?>" <?= ($edit_pay['payment_method'] ?? '') === $pm ? 'selected' : '' ?>><?= $pm ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label>ট্রানজেকশন আইডি (TrxID / রেফারেন্স)</label>
                    <input type="text" name="trx_id" class="form-control" value="<?= h($edit_pay['trx_id'] ?? 'CASH') ?>">
                </div>
                <div class="form-group">
                    <label>পেমেন্ট তারিখ *</label>
                    <input type="date" name="payment_date" class="form-control" required value="<?= h($edit_pay['payment_date'] ?? date('Y-m-d')) ?>">
                </div>
                <div class="form-group">
                    <label>মন্তব্য (Remarks)</label>
                    <input type="text" name="remarks" class="form-control" value="<?= h($edit_pay['remarks'] ?? '') ?>" placeholder="মন্তব্য লিখুন">
                </div>
            </div>
            <button type="submit" class="btn btn-success"><i class="fa fa-check-circle"></i> <?= $edit_pay ? 'পেমেন্ট আপডেট করুন' : 'পেমেন্ট সেভ ও মেমো তৈরি করুন' ?></button>
        </form>
    </div>
</div>

<div class="panel-card">
    <div class="panel-header">
        <h3><i class="fa fa-list-alt"></i> সকল পেমেন্ট ও মানি রিসিপ্ট তালিকা (<?= count($payments) ?> টি)</h3>
    </div>
    <div class="dcp-table-wrap">
        <table class="dcp-table">
            <thead>
                <tr>
                    <th>রিসিপ্ট নং</th>
                    <th>তারিখ</th>
                    <th>শিক্ষার্থী ও রেজিঃ নং</th>
                    <th>কোর্স</th>
                    <th>মোট ফি</th>
                    <th>পরিশোধিত</th>
                    <th>বকেয়া</th>
                    <th>মাধ্যম (TrxID)</th>
                    <th>স্ট্যাটাস</th>
                    <th>অ্যাকশন</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($payments as $p): ?>
                <tr>
                    <td><strong><?= h($p['receipt_no']) ?></strong></td>
                    <td><?= h($p['payment_date']) ?></td>
                    <td><strong><?= h($p['student_name']) ?></strong><br><small>Reg: <?= h($p['reg_no']) ?></small></td>
                    <td><?= h($p['course_name']) ?><br><small><?= h($p['payment_type']) ?></small></td>
                    <td>৳ <?= number_format((float)$p['total_fee'], 0) ?></td>
                    <td style="color:#15803d; font-weight:700;">৳ <?= number_format((float)$p['paid_amount'], 0) ?></td>
                    <td style="color:<?= $p['due_amount'] > 0 ? '#dc2626' : '#64748b' ?>; font-weight:700;">৳ <?= number_format((float)$p['due_amount'], 0) ?></td>
                    <td><?= h($p['payment_method']) ?><br><small><?= h($p['trx_id']) ?></small></td>
                    <td>
                        <span class="badge <?= $p['status'] === 'Paid' ? 'badge-success' : ($p['status'] === 'Partial' ? 'badge-warning' : 'badge-danger') ?>">
                            <?= h($p['status']) ?>
                        </span>
                    </td>
                    <td style="white-space:nowrap;">
                        <a href="invoice.php?id=<?= (int)$p['id'] ?>" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-xs"><i class="fa fa-print"></i> মেমো প্রিন্ট</a>
                        <button type="button" class="btn btn-success btn-xs print-receipt-btn" 
                                data-receipt="<?= h($p['receipt_no']) ?>"
                                data-student="<?= h($p['student_name']) ?>"
                                data-reg="<?= h($p['reg_no']) ?>"
                                data-course="<?= h($p['course_name']) ?>"
                                data-total="<?= $p['total_fee'] ?>"
                                data-paid="<?= $p['paid_amount'] ?>"
                                data-due="<?= $p['due_amount'] ?>"
                                data-date="<?= h($p['payment_date']) ?>"
                                data-method="<?= h($p['payment_method']) ?>">
                            <i class="fa fa-file-text-o"></i> ভাউচার
                        </button>
                        <a href="payments.php?edit=<?= (int)$p['id'] ?>" class="btn btn-outline btn-xs"><i class="fa fa-edit"></i></a>
                        <form method="post" style="display:inline;" onsubmit="return confirm('এই পেমেন্ট রেকর্ড মুছে ফেলতে চান?');">
                            <input type="hidden" name="form_action" value="delete">
                            <input type="hidden" name="id" value="<?= (int)$p['id'] ?>">
                            <button type="submit" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- Hidden Printable Voucher Template -->
<div id="printableVoucher" style="display: none;">
    <div style="width: 100%; max-width: 750px; margin: 0 auto; padding: 30px; border: 2px solid #1e293b; font-family: 'Times New Roman', Times, serif; background: #fff; color: #000;">
        <div style="text-align: center; border-bottom: 2px solid #1e293b; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 26px; text-transform: uppercase; color: #0f172a;">Dream Career IT, Cumilla</h2>
            <p style="margin: 5px 0 0; font-size: 14px; color: #334155;">Chaudhari Plaza, Paduar Bazar, Bishwo Road, Comilla</p>
            <h4 style="margin: 10px 0 0; background: #0f172a; color: #fff; display: inline-block; padding: 4px 18px; font-size: 15px; border-radius: 4px;">মানি রিসিপ্ট / পেমেন্ট ভাউচার</h4>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 15px;">
            <div><strong>রিসিপ্ট নং:</strong> <span id="v_receipt"></span></div>
            <div><strong>তারিখ:</strong> <span id="v_date"></span></div>
        </div>
        <div style="margin-bottom: 20px; font-size: 15px; line-height: 1.8; background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <div><strong>শিক্ষার্থীর নাম:</strong> <span id="v_student" style="font-weight: 700; color: #0f172a;"></span></div>
            <div><strong>রেজিস্ট্রেশন নং:</strong> <span id="v_reg"></span></div>
            <div><strong>কোর্সের নাম:</strong> <span id="v_course"></span></div>
            <div><strong>পেমেন্ট মাধ্যম:</strong> <span id="v_method"></span></div>
        </div>
        <div style="margin-bottom: 30px;">
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                    <tr style="background: #0f172a; color: #fff;">
                        <th style="border: 1px solid #333; padding: 10px; text-align: left;">বিবরণ (Description)</th>
                        <th style="border: 1px solid #333; padding: 10px; text-align: right;">টাকা (Amount)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 1px solid #333; padding: 10px;">কোর্স ফি / অন্যান্য সার্ভিস ফি জমা</td>
                        <td style="border: 1px solid #333; padding: 10px; text-align: right; font-weight: 700;">৳<span id="v_paid"></span></td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #333; padding: 10px; text-align: right; font-weight: 700;">মোট নির্ধারিত ফি:</td>
                        <td style="border: 1px solid #333; padding: 10px; text-align: right;">৳<span id="v_total"></span></td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #333; padding: 10px; text-align: right; font-weight: 700; color: #dc2626;">বকেয়া পরিমাণ:</td>
                        <td style="border: 1px solid #333; padding: 10px; text-align: right; color: #dc2626; font-weight: 700;">৳<span id="v_due"></span></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 60px; font-size: 14px;">
            <div style="text-align: center; border-top: 1px solid #333; width: 220px; padding-top: 5px;">শিক্ষার্থীর স্বাক্ষর</div>
            <div style="text-align: center; border-top: 1px solid #333; width: 220px; padding-top: 5px;">হিসাবরক্ষক / ক্যাশিয়ার</div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function () {
    // Student Auto-fill logic
    const preset = document.getElementById('student_preset');
    if (preset) {
        preset.addEventListener('change', function () {
            const opt = this.options[this.selectedIndex];
            if (opt.value) {
                document.getElementById('reg_no').value = opt.getAttribute('data-reg');
                document.getElementById('student_name').value = opt.getAttribute('data-name');
                document.getElementById('course_name').value = opt.getAttribute('data-course');
                const fee = parseFloat(opt.getAttribute('data-fee')) || 0;
                document.getElementById('total_fee').value = fee;
                document.getElementById('paid_amount').value = fee;
                document.getElementById('due_amount').value = 0;
            }
        });
    }

    // Due amount auto calculation
    const totalInput = document.getElementById('total_fee');
    const paidInput = document.getElementById('paid_amount');
    const dueInput = document.getElementById('due_amount');

    function calcDue() {
        const tot = parseFloat(totalInput.value) || 0;
        const paid = parseFloat(paidInput.value) || 0;
        let due = tot - paid;
        if (due < 0) due = 0;
        dueInput.value = due.toFixed(2);
    }

    if (totalInput && paidInput) {
        totalInput.addEventListener('input', calcDue);
        paidInput.addEventListener('input', calcDue);
    }

    // Voucher Print Handler
    const voucherBtns = document.querySelectorAll('.print-receipt-btn');
    voucherBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            document.getElementById('v_receipt').innerText = this.getAttribute('data-receipt');
            document.getElementById('v_date').innerText = this.getAttribute('data-date');
            document.getElementById('v_student').innerText = this.getAttribute('data-student');
            document.getElementById('v_reg').innerText = this.getAttribute('data-reg');
            document.getElementById('v_course').innerText = this.getAttribute('data-course');
            document.getElementById('v_method').innerText = this.getAttribute('data-method');
            document.getElementById('v_paid').innerText = parseFloat(this.getAttribute('data-paid')).toFixed(2);
            document.getElementById('v_total').innerText = parseFloat(this.getAttribute('data-total')).toFixed(2);
            document.getElementById('v_due').innerText = parseFloat(this.getAttribute('data-due')).toFixed(2);

            let printHTML = document.getElementById('printableVoucher').innerHTML;
            let originalHTML = document.body.innerHTML;

            document.body.innerHTML = printHTML;
            window.print();
            document.body.innerHTML = originalHTML;
            location.reload();
        });
    });
});
</script>

<?php require_once __DIR__ . '/footer.php'; ?>

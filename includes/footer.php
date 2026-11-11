<!-- Main Site Footer -->
<footer class="site-footer">
    <div class="container">
        <div class="footer-grid">
            <div class="footer-col">
                <h3><?= h(setting('site_name', 'AMADER GRAM')) ?></h3>
                <p style="margin-bottom:12px; font-size:0.92rem;">
                    <?= h(setting('address_bn')) ?><br>
                    <strong>ফোনঃ</strong> <?= h(setting('phone_1')) ?>, <?= h(setting('phone_2')) ?><br>
                    <strong>ইমেইলঃ</strong> <?= h(setting('email_1')) ?>
                </p>
                <a href="<?= h(setting('facebook_url')) ?>" target="_blank">
                    <img src="assets/img/fb-page.jpg" alt="Facebook Page" style="border-radius:8px; max-width:220px; border:2px solid rgba(255,255,255,0.2);">
                </a>
            </div>

            <div class="footer-col">
                <h3>আমাদের কোর্সসমূহ</h3>
                <ul class="footer-links">
                    <?php foreach ($nav_courses as $fc): ?>
                        <li><a href="course.php?slug=<?= urlencode($fc['slug']) ?>"><i class="fa fa-angle-right"></i> <?= h($fc['title']) ?> (৳<?= (float)$fc['fee'] ?>)</a></li>
                    <?php endforeach; ?>
                </ul>
            </div>

            <div class="footer-col">
                <h3>গুরুত্বপূর্ণ লিংক</h3>
                <ul class="footer-links">
                    <li><a href="admission.php"><i class="fa fa-angle-right"></i> অনলাইন ভর্তি ফর্ম</a></li>
                    <li><a href="result.php"><i class="fa fa-angle-right"></i> অনলাইন রেজাল্ট চেক</a></li>
                    <li><a href="certificates.php"><i class="fa fa-angle-right"></i> সার্টিফিকেট যাচাই ও প্রিন্ট</a></li>
                    <li><a href="biodata.php"><i class="fa fa-angle-right"></i> সকল স্টুডেন্ট বায়োডাটা</a></li>
                    <li><a href="batches.php"><i class="fa fa-angle-right"></i> ক্লাস রুটিন ও ব্যাচ তালিকা</a></li>
                    <li><a href="teachers.php"><i class="fa fa-angle-right"></i> শিক্ষক ও প্রশাসন (Administration)</a></li>
                    <li><a href="designer.php"><i class="fa fa-angle-right"></i> ওয়েব ডিজাইনার ও ডেভেলপার</a></li>
                    <li><a href="admin/index.php"><i class="fa fa-lock"></i> এডমিন কন্ট্রোল প্যানেল</a></li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <p>© Copyright <?= date('Y') ?> <strong><?= h(setting('site_name')) ?></strong>, All Rights Reserved. | Powered by AMADER GRAM | Designed by <a href="designer.php" style="color:#5eead4; font-weight:700;"><?= h(setting('designer_name', 'Jainal Abedin (Sagor)')) ?></a>.</p>
            <div class="footer-socials">
                <a href="<?= h(setting('designer_fb')) ?>" target="_blank" title="Facebook"><i class="fa fa-facebook"></i></a>
                <a href="<?= h(setting('designer_yt')) ?>" target="_blank" title="YouTube"><i class="fa fa-youtube"></i></a>
                <a href="<?= h(setting('designer_gh')) ?>" target="_blank" title="GitHub"><i class="fa fa-github"></i></a>
                <a href="<?= h(setting('designer_tw')) ?>" target="_blank" title="Twitter"><i class="fa fa-twitter"></i></a>
                <a href="<?= h(setting('designer_ig')) ?>" target="_blank" title="Instagram"><i class="fa fa-instagram"></i></a>
                <a href="<?= h(setting('designer_li')) ?>" target="_blank" title="LinkedIn"><i class="fa fa-linkedin"></i></a>
            </div>
        </div>
    </div>
</footer>
<script src="assets/js/main.js"></script>
</body>
</html>

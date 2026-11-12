/**
 * DREAM CAREER IT - Enterprise Viewer Security Shield & Preloader
 * Blocks F12, DevTools Console, Right-Click, Copy/Paste, Save (Ctrl+S),
 * Unauthorized Print (Ctrl+P), Image Drag/Save, and Screenshot keys on all Viewer pages.
 */
(function () {
    function showSecurityAlert(msg) {
        let toast = document.getElementById('dcitSecurityToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'dcitSecurityToast';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<i class="fa fa-shield"></i> <span>${msg}</span>`;
        toast.style.display = 'flex';
        clearTimeout(window._secToastTimer);
        window._secToastTimer = setTimeout(() => { toast.style.display = 'none'; }, 2800);
    }

    // 1. Block Right-Click (contextmenu)
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        showSecurityAlert('সিকিউরিটি লকঃ রাইট-ক্লিক এবং ইন্সপেক্ট সম্পূর্ণ নিষিদ্ধ!');
        return false;
    });

    // 2. Block Image Dragging & Text Selection outside inputs
    document.addEventListener('dragstart', function (e) {
        e.preventDefault();
        return false;
    });

    document.addEventListener('selectstart', function (e) {
        const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
        if (tag !== 'input' && tag !== 'textarea' && tag !== 'select') {
            e.preventDefault();
            return false;
        }
    });

    // 3. Block Copy, Cut, Paste on page content
    ['copy', 'cut', 'paste'].forEach(function (evName) {
        document.addEventListener(evName, function (e) {
            const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
            if (tag !== 'input' && tag !== 'textarea') {
                e.preventDefault();
                showSecurityAlert('সিকিউরিটি লকঃ ওয়েবসাইটের লেখা বা কোড কপি/পেস্ট করা নিষিদ্ধ!');
                return false;
            }
        });
    });

    // 4. Block F12, Ctrl+Shift+I/J/C/K, Ctrl+U (View Source), Ctrl+S (Save HTML), Ctrl+P (Print), PrintScreen
    document.addEventListener('keydown', function (e) {
        const key = (e.key || '').toLowerCase();
        const code = e.keyCode || e.which;

        // F12 (123)
        if (code === 123 || key === 'f12') {
            e.preventDefault();
            e.stopPropagation();
            showSecurityAlert('সিকিউরিটি লকঃ F12 ও ডেভেলপার কনসোল সম্পূর্ণ লক করা আছে!');
            return false;
        }

        // Ctrl+Shift+I / J / C / K (DevTools)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c', 'k', 's'].includes(key)) {
            e.preventDefault();
            e.stopPropagation();
            showSecurityAlert('সিকিউরিটি লকঃ ডেভেলপার কনসোল ও স্ক্রিনশট শর্টকাট নিষিদ্ধ!');
            return false;
        }

        // Ctrl+U (View Source), Ctrl+S (Save Page), Ctrl+P (Print Page)
        if ((e.ctrlKey || e.metaKey) && ['u', 's', 'p'].includes(key)) {
            e.preventDefault();
            e.stopPropagation();
            if (key === 'p') {
                showSecurityAlert('সরাসরি প্রিন্ট নিষিদ্ধ! শুধুমাত্র উত্তীর্ণ শিক্ষার্থীরা গোপন কোড দিয়ে সার্টিফিকেট প্রিন্ট করতে পারবেন।');
            } else {
                showSecurityAlert('সিকিউরিটি লকঃ সোর্স কোড দেখা বা ফাইল সেভ করা নিষিদ্ধ!');
            }
            return false;
        }

        // Ctrl+C / Ctrl+X / Ctrl+A outside inputs
        if ((e.ctrlKey || e.metaKey) && ['c', 'x', 'a'].includes(key)) {
            const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
            if (tag !== 'input' && tag !== 'textarea') {
                e.preventDefault();
                showSecurityAlert('সিকিউরিটি লকঃ শর্টকাট কপি বা সিলেক্ট করা নিষিদ্ধ!');
                return false;
            }
        }

        // PrintScreen key detection
        if (code === 44 || key === 'printscreen') {
            e.preventDefault();
            document.body.classList.add('privacy-shield');
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText('Protected by Dream Career IT Security').catch(() => {});
            }
            showSecurityAlert('স্ক্রিনশট নেওয়া সম্পূর্ণ নিষিদ্ধ!');
            setTimeout(() => document.body.classList.remove('privacy-shield'), 2000);
            return false;
        }
    }, true);

    document.addEventListener('keyup', function (e) {
        if ((e.keyCode || e.which) === 44 || (e.key || '').toLowerCase() === 'printscreen') {
            document.body.classList.add('privacy-shield');
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText('').catch(() => {});
            }
            showSecurityAlert('স্ক্রিনশট নেওয়া সম্পূর্ণ নিষিদ্ধ!');
            setTimeout(() => document.body.classList.remove('privacy-shield'), 2000);
        }
    });

    // 5. Authorized Landscape Letter Certificate Print Function (Only for Course-Completed & Passed Students)
    window.printAuthorizedCertificate = function (certObj) {
        if (!certObj) return;
        const g = String(certObj.grade || '').trim().toLowerCase();
        if (['f', 'fail', 'failed', 'ফেইল', 'pending', 'running', ''].includes(g)) {
            showSecurityAlert('শুধুমাত্র কোর্স সম্পন্নকারী ও উত্তীর্ণ শিক্ষার্থীদের সার্টিফিকেট প্রিন্ট করা যাবে!');
            return;
        }
        let sheet = document.getElementById('authorizedCertPrintSheet');
        if (!sheet) {
            sheet = document.createElement('div');
            sheet.id = 'authorizedCertPrintSheet';
            document.body.appendChild(sheet);
        }
        const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
        sheet.innerHTML = `
        <div style="width:10.3in; height:7.8in; border:10px solid #151442; padding:14px; background:#fff; box-sizing:border-box; margin:0 auto;">
            <div style="width:100%; height:100%; border:3px double #d97706; padding:28px 38px; box-sizing:border-box; font-family:Georgia, serif; display:flex; flex-direction:column; justify-content:space-between; background:radial-gradient(circle at center, #ffffff 70%, #f0fdfa 100%);">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #151442; padding-bottom:14px;">
                    <img src="assets/img/logo.jpg" style="width:86px; height:86px; border-radius:50%; border:3px solid #151442;">
                    <div style="text-align:center; flex:1;">
                        <h1 style="margin:0; color:#151442; font-size:2.25rem; letter-spacing:1.5px; text-transform:uppercase;">DREAM CAREER IT</h1>
                        <p style="margin:4px 0 0; font-family:sans-serif; font-size:0.92rem; color:#334155; font-weight:700;">ভাই ভাই সুপার মার্কেট, পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা - ৩৫০০ | ফোনঃ 01771770044</p>
                        <p style="margin:2px 0 0; font-family:sans-serif; font-size:0.84rem; color:#0f766e; font-weight:700;">Official Online Verified Training Certificate</p>
                    </div>
                    <div style="font-family:sans-serif; font-size:0.84rem; text-align:right; line-height:1.6; color:#151442;">
                        <strong>Cert No:</strong> ${esc(certObj.cert_no)}<br>
                        <strong>Reg No:</strong> ${esc(certObj.reg_no)}<br>
                        <strong>Roll No:</strong> ${esc(certObj.roll_no || '01')}<br>
                        <strong>Date:</strong> ${esc(certObj.issue_date)}
                    </div>
                </div>

                <div style="text-align:center; margin:8px 0;">
                    <span style="background:#151442; color:#fde68a; padding:8px 34px; border-radius:30px; font-size:1.35rem; font-weight:bold; letter-spacing:2px; text-transform:uppercase;">Certificate of Completion</span>
                </div>

                <div style="font-size:1.18rem; line-height:1.95; color:#0f172a; text-align:justify;">
                    This is to certify that <strong style="color:#0f766e; font-size:1.35rem; border-bottom:1px dashed #0f766e; padding:0 6px;">${esc(certObj.student_name)}</strong>,
                    son/daughter of <strong>${esc(certObj.father_name || 'N/A')}</strong> and <strong>${esc(certObj.mother_name || 'N/A')}</strong>,
                    bearing Registration No. <strong style="color:#151442;">${esc(certObj.reg_no)}</strong>, has successfully completed the
                    <strong>${esc(certObj.duration || '3 Months')}</strong> professional training course on
                    <strong style="color:#0f766e; font-size:1.25rem;">${esc(certObj.course_name)}</strong> held during the session
                    <strong>${esc(certObj.session_quarter)}, ${esc(certObj.batch_year)}</strong> at <strong>Dream Career IT</strong> and secured Grade
                    <strong style="color:#15803d; font-size:1.25rem;">${esc(certObj.grade)} (GPA: ${esc(certObj.cgpa || '5.00')})</strong>.
                </div>

                <div style="display:flex; justify-content:space-between; align-items:flex-end; font-family:sans-serif; font-size:0.88rem; margin-top:18px;">
                    <div style="border-top:2px solid #151442; width:210px; text-align:center; padding-top:6px;">
                        <strong>Jainal Abedin (Sagor)</strong><br><span>Course Instructor & Trainer</span>
                    </div>
                    <div style="border:1px solid #cbd5e1; padding:8px 16px; border-radius:8px; text-align:center; background:#fff;">
                        <div style="background:repeating-linear-gradient(90deg,#000,#000 2px,#fff 2px,#fff 5px); height:28px; width:165px; margin:0 auto 4px;"></div>
                        <small style="font-weight:800; color:#0f766e;">VERIFIED: ${esc(certObj.verification_code)}</small>
                    </div>
                    <div style="border-top:2px solid #151442; width:210px; text-align:center; padding-top:6px;">
                        <strong>DR. A.K.M Lokman</strong><br><span>Founder & Chief Administrator</span>
                    </div>
                </div>
            </div>
        </div>`;

        document.body.classList.add('allow-cert-print');
        setTimeout(function () {
            window.print();
            setTimeout(function () {
                document.body.classList.remove('allow-cert-print');
            }, 600);
        }, 150);
    };

    window.addEventListener('afterprint', function () {
        document.body.classList.remove('allow-cert-print');
    });

    // 6. Animated Preloader & Mobile Menu Init
    document.addEventListener('DOMContentLoaded', function () {
        const preloader = document.getElementById('dcitPreloader');
        if (preloader) {
            setTimeout(() => preloader.classList.add('loaded'), 650);
        }

        const menuBtn = document.getElementById('menuToggle');
        const mainNav = document.getElementById('mainNav');
        if (menuBtn && mainNav) {
            menuBtn.addEventListener('click', function () {
                mainNav.classList.toggle('open');
            });
        }
    });
})();

/**
 * DREAM CAREER IT - Enterprise Viewer Security Shield, Preloader & Board-Style Certificate Engine
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
                showSecurityAlert('সিকিউরিটি লকঃ ওয়েবসাইটের লেখা বা কোড কপি/পেস্ট করা নিষিদ্ধ!');
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
                showSecurityAlert('সরাসরি প্রিন্ট নিষিদ্ধ! শুধুমাত্র উত্তীর্ণ শিক্ষার্থীরা গোপন কোড দিয়ে সার্টিফিকেট প্রিন্ট করতে পারবেন।');
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
            showSecurityAlert('স্ক্রিনশট নেওয়া সম্পূর্ণ নিষিদ্ধ!');
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
            showSecurityAlert('স্ক্রিনশট নেওয়া সম্পূর্ণ নিষিদ্ধ!');
            setTimeout(() => document.body.classList.remove('privacy-shield'), 2000);
        }
    });

    // Inject Board-Style Certificate CSS, EB Garamond Typography, Signature Handwriting Font & Responsive Scaler
    function ensureBoardCertificateStyles() {
        if (document.getElementById('dcitBoardCertStyles')) return;
        const st = document.createElement('style');
        st.id = 'dcitBoardCertStyles';
        st.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Dancing+Script:wght@700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');

            /* Responsive Landscape Stage Wrapper */
            .dcit-cert-responsive-stage {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                overflow: hidden;
                margin: 0 auto;
                box-sizing: border-box;
                padding: 4px 0;
            }
            .dcit-cert-scale-holder {
                width: 998.4px; /* 10.4in at 96dpi */
                height: 753.6px; /* 7.85in at 96dpi */
                transform-origin: top center;
                flex-shrink: 0;
                transition: transform 0.15s ease-out;
            }

            /* Fixed Landscape Certificate Canvas */
            .dcit-board-cert-outer {
                position: relative;
                width: 10.4in;
                height: 7.85in;
                min-width: 10.4in;
                min-height: 7.85in;
                margin: 0 auto;
                background: #fbfaf5;
                padding: 18px;
                box-sizing: border-box;
                color: #111827;
                font-family: 'EB Garamond', 'Times New Roman', Georgia, serif;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                overflow: hidden;
                box-shadow: 0 14px 40px rgba(0,0,0,0.18);
            }

            /* Ornate Guilloche / Lattice Outer Border */
            .dcit-guilloche-frame {
                position: relative;
                width: 100%;
                height: 100%;
                border: 14px solid transparent;
                border-image: repeating-linear-gradient(
                    45deg,
                    #1e293b 0px,
                    #1e293b 2px,
                    transparent 2px,
                    transparent 5px,
                    #334155 5px,
                    #334155 7px
                ) 14;
                outline: 2px solid #1e293b;
                outline-offset: -14px;
                box-sizing: border-box;
                padding: 4px;
                background: #fcfbf7;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .dcit-lattice-border-wrap {
                position: relative;
                width: 100%;
                height: 100%;
                border: 3px double #1e293b;
                box-sizing: border-box;
                padding: 12px 24px 10px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                overflow: hidden;
                background: radial-gradient(circle at center, #fffef9 0%, #f7f5eb 100%);
            }

            /* Perimeter Micro-Text Security Border */
            .dcit-micro-perimeter-top,
            .dcit-micro-perimeter-bottom {
                font-family: 'Arial Narrow', Arial, sans-serif;
                font-size: 5.5px;
                font-weight: 700;
                letter-spacing: 0.7px;
                color: #334155;
                white-space: nowrap;
                overflow: hidden;
                text-transform: uppercase;
                line-height: 1;
                opacity: 0.75;
                user-select: none;
                z-index: 3;
            }

            /* Countless Small Watermarks (15% Opacity) */
            .dcit-watermark-text-layer {
                position: absolute;
                inset: -40px;
                z-index: 1;
                pointer-events: none;
                user-select: none;
                overflow: hidden;
                opacity: 0.15;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                transform: rotate(-14deg);
            }
            .dcit-watermark-text-row {
                font-family: 'EB Garamond', 'Georgia', serif;
                font-size: 10.5px;
                font-weight: 700;
                color: #475569;
                white-space: nowrap;
                letter-spacing: 1.5px;
                line-height: 1.65;
            }

            /* Center Background Logo Watermark (15% Opacity) */
            .dcit-watermark-logo-layer {
                position: absolute;
                inset: 0;
                z-index: 2;
                pointer-events: none;
                user-select: none;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .dcit-watermark-logo-layer img {
                width: 270px;
                height: 270px;
                object-fit: contain;
                border-radius: 50%;
                opacity: 0.15;
                filter: contrast(1.05);
            }

            /* Foreground Content Layer */
            .dcit-cert-foreground {
                position: relative;
                z-index: 5;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex: 1;
                padding: 2px 6px;
            }

            /* Top Board Header */
            .dcit-board-header-title {
                text-align: center;
                margin-bottom: 2px;
            }
            .dcit-board-header-title h1 {
                margin: 0;
                font-family: 'Arial Black', 'Helvetica Neue', Arial, sans-serif;
                font-size: 1.6rem;
                font-weight: 900;
                letter-spacing: 1.2px;
                color: #0f172a;
                text-transform: uppercase;
                line-height: 1.12;
            }
            .dcit-board-header-title h2 {
                margin: 2px 0 0;
                font-family: 'Arial Black', Arial, sans-serif;
                font-size: 1.18rem;
                font-weight: 900;
                letter-spacing: 2px;
                color: #0f172a;
                text-transform: uppercase;
            }

            /* Serial, Crest Logo & Registration Row */
            .dcit-board-meta-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 3px 0 5px;
                padding: 0 8px;
            }
            .dcit-meta-left,
            .dcit-meta-right {
                font-family: 'EB Garamond', 'Times New Roman', Georgia, serif;
                font-size: 1.04rem;
                font-weight: 600;
                color: #0f172a;
                line-height: 1.5;
                min-width: 270px;
            }
            .dcit-meta-right {
                text-align: right;
            }
            /* Serial & Reg numbers rendered in Signature / Handwriting font style */
            .dcit-serial-num {
                font-family: 'Dancing Script', 'Alex Brush', cursive;
                font-weight: 700;
                font-size: 1.32rem;
                letter-spacing: 0.5px;
                color: #0f172a;
                margin-left: 5px;
            }
            .dcit-crest-center {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .dcit-crest-emblem {
                width: 74px;
                height: 74px;
                border-radius: 50%;
                border: 3px double #b45309;
                padding: 3px;
                background: #fff;
                box-shadow: 0 2px 8px rgba(0,0,0,0.12);
                object-fit: cover;
            }
            .dcit-exam-banner-title {
                text-align: center;
                font-family: 'EB Garamond', 'Times New Roman', Georgia, serif;
                font-size: 1.22rem;
                font-weight: 800;
                letter-spacing: 1.1px;
                color: #0f172a;
                text-transform: uppercase;
                margin: 2px 0 6px;
            }

            /* Inner Bordered Statement Box */
            .dcit-board-inner-box {
                border: 1.8px solid #1e293b;
                padding: 14px 22px 12px;
                position: relative;
                background: rgba(255, 255, 255, 0.12);
            }
            .dcit-cert-line {
                display: flex;
                align-items: baseline;
                flex-wrap: nowrap;
                margin-bottom: 8px;
                font-family: 'EB Garamond', Georgia, serif;
                font-size: 1.18rem;
                color: #111827;
                line-height: 1.32;
            }
            .dcit-cert-line:last-child {
                margin-bottom: 2px;
            }
            /* Static Labels in EB Garamond Italic */
            .dcit-cert-label {
                white-space: nowrap;
                margin-right: 10px;
                font-family: 'EB Garamond', Georgia, serif;
                font-style: italic;
                font-weight: 500;
                color: #1e293b;
            }
            /* ALL Student / Certificate Person Data Rendered in Signature Handwriting Font ('Dancing Script') */
            .dcit-cert-blank {
                flex: 1;
                border-bottom: 1.4px solid #1e293b;
                padding: 0 12px 1px;
                font-family: 'Dancing Script', 'Alex Brush', cursive;
                font-style: normal;
                font-weight: 700;
                font-size: 1.55rem;
                color: #090d16;
                letter-spacing: 0.6px;
                text-align: left;
                min-width: 80px;
                line-height: 1.1;
            }
            .dcit-cert-blank.center-val {
                text-align: center;
            }
            .dcit-cert-blank.mono-val {
                font-family: 'Dancing Script', 'Alex Brush', cursive;
                font-style: normal;
                font-weight: 700;
                font-size: 1.48rem;
                letter-spacing: 0.8px;
                text-align: center;
                color: #090d16;
            }

            /* Bottom Footer */
            .dcit-board-footer {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                padding: 8px 6px 2px;
                margin-top: 2px;
            }
            .dcit-footer-left-wrap {
                display: flex;
                align-items: center;
                gap: 14px;
            }
            .dcit-qr-box {
                display: flex;
                flex-direction: column;
                align-items: center;
                background: #ffffff;
                border: 1.5px solid #1e293b;
                padding: 3px;
                border-radius: 4px;
                box-shadow: 0 1px 4px rgba(0,0,0,0.08);
            }
            .dcit-qr-box img {
                width: 64px;
                height: 64px;
                display: block;
                object-fit: contain;
            }
            .dcit-qr-caption {
                font-family: 'EB Garamond', Arial, sans-serif;
                font-size: 0.62rem;
                font-weight: 800;
                letter-spacing: 0.5px;
                color: #0f172a;
                text-transform: uppercase;
                margin-top: 1px;
                line-height: 1;
            }
            .dcit-footer-left {
                font-family: 'EB Garamond', 'Times New Roman', Georgia, serif;
                color: #0f172a;
                line-height: 1.45;
            }
            .dcit-footer-left .loc-title {
                font-size: 0.96rem;
                font-weight: 800;
                letter-spacing: 1px;
                text-transform: uppercase;
            }
            .dcit-footer-left .pub-date {
                font-size: 1.02rem;
                font-weight: 600;
            }
            .dcit-footer-left .pub-date span {
                font-family: 'Dancing Script', 'Alex Brush', cursive;
                font-style: normal;
                font-weight: 700;
                font-size: 1.25rem;
            }
            .dcit-footer-sign-group {
                display: flex;
                gap: 38px;
                align-items: flex-end;
            }
            .dcit-sign-col {
                text-align: center;
                min-width: 190px;
            }
            .dcit-sign-script {
                font-family: 'Alex Brush', 'Dancing Script', cursive;
                font-size: 1.42rem;
                font-weight: 700;
                color: #1e293b;
                line-height: 1;
                margin-bottom: 2px;
            }
            .dcit-sign-title {
                border-top: 1.5px solid #1e293b;
                padding-top: 3px;
                font-family: 'EB Garamond', Georgia, serif;
                font-size: 0.94rem;
                font-weight: 800;
                color: #0f172a;
            }
            .dcit-sign-sub {
                font-family: 'EB Garamond', Georgia, serif;
                font-style: italic;
                font-size: 0.84rem;
                font-weight: 600;
                color: #334155;
            }
            .dcit-bottom-note {
                text-align: center;
                font-family: 'EB Garamond', Georgia, serif;
                font-size: 0.88rem;
                font-weight: 700;
                color: #2e7d32;
                margin-top: 3px;
                letter-spacing: 0.3px;
            }

            /* Hidden Print Sheet on Screen */
            #authorizedCertPrintSheet {
                display: none;
            }

            /* Public QR Scan Verification Modal Styles */
            #dcitPublicVerifyModal {
                position: fixed;
                inset: 0;
                background: rgba(15, 23, 42, 0.78);
                z-index: 9999999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 16px;
                box-sizing: border-box;
                backdrop-filter: blur(4px);
            }
            .dcit-verify-modal-card {
                background: #fffef9;
                border: 2px solid #1e293b;
                border-radius: 10px;
                width: 100%;
                max-width: 1060px;
                max-height: 95vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                overflow: hidden;
                animation: dcitModalPopup 0.25s ease-out;
            }
            @keyframes dcitModalPopup {
                from { transform: scale(0.94); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .dcit-verify-modal-header {
                background: #0f172a;
                color: #f8fafc;
                padding: 14px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-family: 'EB Garamond', Arial, sans-serif;
            }
            .dcit-verify-modal-header h3 {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 700;
                letter-spacing: 0.5px;
            }
            .dcit-verify-close-btn {
                background: transparent;
                border: none;
                color: #cbd5e1;
                font-size: 1.4rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            .dcit-verify-close-btn:hover {
                color: #ffffff;
            }
            .dcit-verify-modal-body {
                padding: 16px;
                overflow-y: auto;
                flex: 1;
                text-align: center;
            }
            .dcit-verify-modal-footer {
                padding: 12px 20px;
                background: #f1f5f9;
                border-top: 1px solid #cbd5e1;
                display: flex;
                justify-content: center;
                gap: 12px;
                flex-wrap: wrap;
            }

            /* Exact Landscape Page Sizing & Zero-Margin Print Rules */
            @media print {
                @page {
                    size: landscape;
                    margin: 0mm;
                }
                html, body {
                    width: 100% !important;
                    height: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: #ffffff !important;
                    overflow: hidden !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                body:not(.allow-cert-print) * {
                    display: none !important;
                }
                body.allow-cert-print > *:not(#authorizedCertPrintSheet):not(#dcitPublicVerifyModal) {
                    display: none !important;
                }
                body.allow-cert-print #authorizedCertPrintSheet,
                body.allow-cert-print #dcitPublicVerifyModal {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    position: fixed !important;
                    inset: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: #ffffff !important;
                    z-index: 999999 !important;
                }
                body.allow-cert-print .dcit-verify-modal-card {
                    border: none !important;
                    box-shadow: none !important;
                    max-height: 100vh !important;
                    max-width: 100vw !important;
                    width: 100vw !important;
                    height: 100vh !important;
                }
                body.allow-cert-print .dcit-verify-modal-header,
                body.allow-cert-print .dcit-verify-modal-footer {
                    display: none !important;
                }
                body.allow-cert-print .dcit-cert-responsive-stage,
                body.allow-cert-print .dcit-cert-scale-holder {
                    width: 10.4in !important;
                    height: 7.85in !important;
                    transform: none !important;
                    padding: 0 !important;
                    margin: 0 auto !important;
                }
                body.allow-cert-print .dcit-board-cert-outer {
                    width: 10.4in !important;
                    height: 7.85in !important;
                    margin: 0 auto !important;
                    box-shadow: none !important;
                    page-break-after: avoid !important;
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                }
            }
        `;
        document.head.appendChild(st);
    }

    function formatFriendlyDate(dateStr) {
        if (!dateStr) return 'April 10, 2026';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return String(dateStr);
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;
    }

    // Generate Verification URL & QR Code
    function buildVerificationQrData(regNo, verCode, certNo) {
        let baseUrl = 'https://dreamcareerit.com/';
        try {
            if (window.location && window.location.origin && window.location.origin !== 'null') {
                baseUrl = window.location.origin + window.location.pathname;
            }
        } catch (e) {}
        const verifyUrl = `${baseUrl}?verify_reg=${encodeURIComponent(regNo)}&code=${encodeURIComponent(verCode)}&cert=${encodeURIComponent(certNo)}`;
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=0&ecc=M&data=${encodeURIComponent(verifyUrl)}`;
        return { verifyUrl, qrApiUrl };
    }

    // Responsive Landscape Scaler
    window.fitDcitLandscapeCertificates = function () {
        const stages = document.querySelectorAll('.dcit-cert-responsive-stage');
        const baseWidth = 998.4;
        const baseHeight = 753.6;

        stages.forEach(stage => {
            const holder = stage.querySelector('.dcit-cert-scale-holder');
            if (!holder) return;
            const availWidth = stage.clientWidth || window.innerWidth - 32;
            const scale = Math.min(1, Math.max(0.24, (availWidth - 8) / baseWidth));
            holder.style.transform = `scale(${scale})`;
            stage.style.height = `${Math.ceil(baseHeight * scale) + 8}px`;
        });
    };

    window.addEventListener('resize', window.fitDcitLandscapeCertificates);
    window.addEventListener('orientationchange', function () {
        setTimeout(window.fitDcitLandscapeCertificates, 150);
    });

    // Build SSC-Board-Style Certificate HTML with Signature Handwriting Font for All Person Data
    window.buildDcitBoardCertificateHTML = function (certObj, isModalPreview) {
        ensureBoardCertificateStyles();
        const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

        let st = null;
        if (typeof DCITStore !== 'undefined' && DCITStore.getDB) {
            const db = DCITStore.getDB();
            st = (db.students || []).find(s => String(s.reg_no) === String(certObj.reg_no));
        }

        const certNo    = certObj.cert_no || ('DCIT-' + (certObj.batch_year || '2026') + '-' + (certObj.reg_no || '000001'));
        const regNo     = certObj.reg_no || '000001';
        const rollNo    = certObj.roll_no || (st && st.roll_no) || '01';
        const batchYr   = certObj.batch_year || (st && st.batch_year) || '2026';
        const sessionQ  = certObj.session_quarter || (st && st.session_quarter) || 'January to March';
        const name      = certObj.student_name || (st && st.name) || '';
        const father    = certObj.father_name || (st && st.father_name) || 'N/A';
        const mother    = certObj.mother_name || (st && st.mother_name) || 'N/A';
        const course    = certObj.course_name || (st && st.course_name) || 'Advance Microsoft Office';
        const duration  = certObj.duration || (st && st.course_duration) || '3 Months';
        const grade     = certObj.grade || (st && st.result_grade) || 'A+';
        const cgpa      = certObj.cgpa || (st && st.cgpa) || '5.00';
        const dob       = (st && st.dob) ? st.dob : '';
        const issueDt   = formatFriendlyDate(certObj.issue_date || '2026-04-10');
        const verCode   = certObj.verification_code || ('VER-DCIT-' + regNo);
        const serialNum = String(regNo).replace(/\D/g, '').padStart(7, '1430');

        const { qrApiUrl } = buildVerificationQrData(regNo, verCode, certNo);

        const wmPhrase = Array.from({ length: 18 }, () => 'Dream Career IT').join('   •   ');
        const wmRowsHTML = Array.from({ length: 34 }, (_, idx) =>
            `<div class="dcit-watermark-text-row" style="margin-left:${(idx % 2) * -45}px;">${wmPhrase}</div>`
        ).join('');

        const microPerimeter = Array.from({ length: 16 }, () => 'DREAMCAREERIT•CUMILLA•BANGLADESH•').join('');

        const coreCertHTML = `
        <div class="dcit-board-cert-outer ${isModalPreview ? 'is-modal-preview' : ''}">
            <div class="dcit-guilloche-frame">
                <div class="dcit-lattice-border-wrap">
                    <div class="dcit-micro-perimeter-top">${microPerimeter}</div>

                    <div class="dcit-watermark-text-layer" aria-hidden="true">
                        ${wmRowsHTML}
                    </div>

                    <div class="dcit-watermark-logo-layer" aria-hidden="true">
                        <img src="assets/img/logo.jpg" alt="">
                    </div>

                    <div class="dcit-cert-foreground">
                        <div>
                            <div class="dcit-board-header-title">
                                <h1>DREAM CAREER IT, CUMILLA</h1>
                                <h2>BANGLADESH</h2>
                            </div>

                            <div class="dcit-board-meta-row">
                                <div class="dcit-meta-left">
                                    <div>Certificate Sl. No. : <span class="dcit-serial-num">${esc(certNo)}</span></div>
                                    <div>Serial No. DCIT <span class="dcit-serial-num">${esc(serialNum)}</span></div>
                                </div>
                                <div class="dcit-crest-center">
                                    <img src="assets/img/logo.jpg" alt="Dream Career IT Emblem" class="dcit-crest-emblem">
                                </div>
                                <div class="dcit-meta-right">
                                    <div>Registration No. : <span class="dcit-serial-num">${esc(regNo)}/${esc(batchYr)}</span></div>
                                    <div>Verification ID : <span class="dcit-serial-num">${esc(verCode)}</span></div>
                                </div>
                            </div>

                            <div class="dcit-exam-banner-title">
                                PROFESSIONAL COMPUTER &amp; IT CERTIFICATION EXAMINATION - ${esc(batchYr)}
                            </div>
                        </div>

                        <!-- Inner Statement Box with Signature Font for All Data Fields -->
                        <div class="dcit-board-inner-box">
                            <div class="dcit-cert-line">
                                <span class="dcit-cert-label">This is to certify that</span>
                                <span class="dcit-cert-blank">${esc(name)}</span>
                            </div>

                            <div class="dcit-cert-line">
                                <span class="dcit-cert-label">son / daughter of</span>
                                <span class="dcit-cert-blank">${esc(father)}</span>
                            </div>

                            <div class="dcit-cert-line">
                                <span class="dcit-cert-label">and</span>
                                <span class="dcit-cert-blank">${esc(mother)}</span>
                            </div>

                            <div class="dcit-cert-line">
                                <span class="dcit-cert-label">of</span>
                                <span class="dcit-cert-blank">Dream Career IT, Poduar Bazar, Bishwo Road, Cumilla</span>
                            </div>

                            <div class="dcit-cert-line">
                                <span class="dcit-cert-label">bearing Roll</span>
                                <span class="dcit-cert-blank center-val" style="flex:1.1;">Cumilla-DCIT (${esc(rollNo)})</span>
                                <span class="dcit-cert-label" style="margin-left:12px;">Reg. No.</span>
                                <span class="dcit-cert-blank mono-val" style="flex:0.7;">${esc(regNo)}</span>
                                <span class="dcit-cert-label" style="margin-left:12px; margin-right:0;">duly passed the</span>
                            </div>

                            <div class="dcit-cert-line">
                                <span class="dcit-cert-label">Certification Examination of</span>
                                <span class="dcit-cert-blank mono-val" style="flex:0.45;">${esc(batchYr)}</span>
                                <span class="dcit-cert-label" style="margin-left:10px;">in</span>
                                <span class="dcit-cert-blank center-val" style="flex:1.6;">${esc(course)}</span>
                            </div>

                            <div class="dcit-cert-line">
                                <span class="dcit-cert-label">Session</span>
                                <span class="dcit-cert-blank center-val" style="flex:1.1;">${esc(sessionQ)} (${esc(duration)})</span>
                                <span class="dcit-cert-label" style="margin-left:10px;">and secured Grade</span>
                                <span class="dcit-cert-blank mono-val" style="flex:0.45;">${esc(grade)}</span>
                                <span class="dcit-cert-label" style="margin-left:10px;">with G.P.A.</span>
                                <span class="dcit-cert-blank mono-val" style="flex:0.45;">${esc(cgpa)}</span>
                            </div>

                            <div class="dcit-cert-line">
                                <span class="dcit-cert-label">in the scale of 5.00.</span>
                                <span class="dcit-cert-label" style="margin-left:18px;">${dob ? 'His / Her date of birth is' : 'Authorized Secret Verification Status :'}</span>
                                <span class="dcit-cert-blank">${esc(dob ? `${dob} (Verified Record)` : `Officially Verified (${verCode})`)}</span>
                            </div>
                        </div>

                        <div class="dcit-board-footer">
                            <div class="dcit-footer-left-wrap">
                                <div class="dcit-qr-box" title="Scan to Verify Certificate: ${esc(verCode)}">
                                    <img src="${qrApiUrl}" alt="Verify QR" crossorigin="anonymous" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22><rect width=%2264%22 height=%2264%22 fill=%22%23fff%22/><rect x=%224%22 y=%224%22 width=%2218%22 height=%2218%22 fill=%22none%22 stroke=%22%230f172a%22 stroke-width=%224%22/><rect x=%229%22 y=%229%22 width=%228%22 height=%228%22 fill=%22%230f172a%22/><rect x=%2242%22 y=%224%22 width=%2218%22 height=%2218%22 fill=%22none%22 stroke=%22%230f172a%22 stroke-width=%224%22/><rect x=%2247%22 y=%229%22 width=%228%22 height=%228%22 fill=%22%230f172a%22/><rect x=%224%22 y=%2242%22 width=%2218%22 height=%2218%22 fill=%22none%22 stroke=%22%230f172a%22 stroke-width=%224%22/><rect x=%229%22 y=%2247%22 width=%228%22 height=%228%22 fill=%22%230f172a%22/><rect x=%2228%22 y=%2228%22 width=%2210%22 height=%2210%22 fill=%22%230f172a%22/><rect x=%2242%22 y=%2242%22 width=%228%22 height=%228%22 fill=%22%230f172a%22/><rect x=%2252%22 y=%2252%22 width=%228%22 height=%228%22 fill=%22%230f172a%22/></svg>';">
                                    <span class="dcit-qr-caption">Scan to Verify</span>
                                </div>
                                <div class="dcit-footer-left">
                                    <div class="loc-title">CUMILLA, BANGLADESH</div>
                                    <div class="pub-date">Date of Publication of Result : <span>${esc(issueDt)}.</span></div>
                                </div>
                            </div>

                            <div class="dcit-footer-sign-group">
                                <div class="dcit-sign-col">
                                    <div class="dcit-sign-script">Jainal Abedin</div>
                                    <div class="dcit-sign-title">Course Instructor &amp; Examiner</div>
                                    <div class="dcit-sign-sub">Jainal Abedin (Sagor)</div>
                                </div>
                                <div class="dcit-sign-col">
                                    <div class="dcit-sign-script">Dr. A.K.M Lokman</div>
                                    <div class="dcit-sign-title">Controller of Examinations</div>
                                    <div class="dcit-sign-sub">DR. A.K.M Lokman (Founder &amp; Director)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="dcit-micro-perimeter-bottom">${microPerimeter}</div>
                </div>
            </div>
            <div class="dcit-bottom-note">Note: This Certificate is issued without any alteration or erasure.</div>
        </div>`;

        setTimeout(window.fitDcitLandscapeCertificates, 30);
        return `
        <div class="dcit-cert-responsive-stage">
            <div class="dcit-cert-scale-holder">
                ${coreCertHTML}
            </div>
        </div>`;
    };

    // 5. Authorized Landscape Certificate Print & High-Res PDF Download Functions
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
        sheet.innerHTML = window.buildDcitBoardCertificateHTML(certObj, false);

        document.body.classList.add('allow-cert-print');
        setTimeout(function () {
            window.print();
            setTimeout(function () {
                document.body.classList.remove('allow-cert-print');
            }, 600);
        }, 250);
    };

    window.downloadAuthorizedCertificatePDF = function (certObj) {
        if (!certObj) return;
        showSecurityAlert('হাই-রেজোলিউশন পিডিএফ ফাইল তৈরি হচ্ছে...');
        window.printAuthorizedCertificate(certObj);
    };

    // Public QR Scan Verification Landing Modal Handler
    window.showPublicVerificationModal = function (cert) {
        let modal = document.getElementById('dcitPublicVerifyModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'dcitPublicVerifyModal';
            document.body.appendChild(modal);
        }
        modal.innerHTML = `
            <div class="dcit-verify-modal-card">
                <div class="dcit-verify-modal-header">
                    <h3>🛡️ অফিশিয়াল ভেরিফাইড সার্টিফিকেট (Dream Career IT)</h3>
                    <button class="dcit-verify-close-btn" onclick="document.getElementById('dcitPublicVerifyModal').remove()">&times;</button>
                </div>
                <div class="dcit-verify-modal-body">
                    <div style="width:100%; overflow:hidden; margin-bottom:12px;">
                        ${window.buildDcitBoardCertificateHTML(cert, true)}
                    </div>
                    <div style="font-family:'EB Garamond',sans-serif; font-size:0.95rem; font-weight:700; color:#1e293b; margin-top:8px;">
                        শিক্ষার্থীর নাম: <strong>${cert.student_name}</strong> | কোর্স: <strong>${cert.course_name}</strong> | গ্রেড: <strong>${cert.grade}</strong> (GPA ${cert.cgpa})
                    </div>
                </div>
                <div class="dcit-verify-modal-footer">
                    <button onclick="window.printAuthorizedCertificate(window._publicVerifiedCert)" class="btn btn-primary" style="padding:8px 18px; font-weight:700; cursor:pointer;">
                        <i class="fa fa-print"></i> সার্টিফিকেট প্রিন্ট করুন
                    </button>
                    <button onclick="window.downloadAuthorizedCertificatePDF(window._publicVerifiedCert)" class="btn btn-accent" style="padding:8px 18px; font-weight:700; cursor:pointer; background:#b45309; color:#fff; border:none; border-radius:4px;">
                        <i class="fa fa-file-pdf-o"></i> ডাউনলোড পিডিএফ (PDF)
                    </button>
                    <button onclick="document.getElementById('dcitPublicVerifyModal').remove()" class="btn btn-secondary" style="padding:8px 18px; font-weight:700; cursor:pointer; background:#64748b; color:#fff; border:none; border-radius:4px;">
                        বন্ধ করুন
                    </button>
                </div>
            </div>
        `;
        window._publicVerifiedCert = cert;
        setTimeout(window.fitDcitLandscapeCertificates, 80);
    };

    // Override Frontend Certificate Verification Popup Preview
    window.verifyCertInPopup = function () {
        const regInput = document.getElementById('verifyRegInput');
        const secInput = document.getElementById('verifySecretInput');
        if (!regInput || !secInput || typeof DCITStore === 'undefined') return;

        const regOrRoll = regInput.value.trim();
        const secCode = secInput.value.trim().toUpperCase();
        const db = DCITStore.getDB();

        const st = (db.students || []).find(s => s.reg_no === regOrRoll || s.roll_no === regOrRoll);
        const certObj = (db.certificates || []).find(c => (c.reg_no === regOrRoll || c.roll_no === regOrRoll || c.cert_no === regOrRoll) && c.status !== 'Revoked');
        const targetStudent = st || (certObj ? (db.students || []).find(s => s.reg_no === certObj.reg_no) : null);

        if (!targetStudent && !certObj) {
            if (typeof showAwesomeToast === 'function') showAwesomeToast('error', 'তথ্য পাওয়া যায়নি!', 'প্রদত্ত রোল বা রেজিস্ট্রেশন নাম্বারের সাথে কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি।');
            return;
        }

        if (targetStudent && !DCITStore.isCourseCompleted(targetStudent)) {
            if (typeof showAwesomeToast === 'function') showAwesomeToast('error', 'কোর্স সম্পন্ন হয়নি!', 'এই শিক্ষার্থীর কোর্স এখনো সম্পন্ন হয়নি। শুধুমাত্র কোর্স সম্পন্নকারী ও উত্তীর্ণ শিক্ষার্থীরাই সার্টিফিকেট প্রিন্ট করতে পারবেন।');
            return;
        }

        if ((targetStudent && DCITStore.isStudentFailed(targetStudent)) || (certObj && ['f', 'fail', 'failed', 'ফেইল'].includes(String(certObj.grade || '').toLowerCase()))) {
            if (typeof showAwesomeToast === 'function') showAwesomeToast('error', 'সার্টিফিকেট প্রযোজ্য নয়!', 'পরীক্ষায় অকৃতকার্য (ফেইল) হওয়ায় সার্টিফিকেট প্রিন্ট প্রযোজ্য নয়।');
            return;
        }

        const cert = certObj || (targetStudent ? {
            cert_no: 'DCIT-' + targetStudent.batch_year + '-' + targetStudent.reg_no,
            reg_no: targetStudent.reg_no,
            roll_no: targetStudent.roll_no,
            secret_code: targetStudent.secret_code,
            student_name: targetStudent.name,
            father_name: targetStudent.father_name,
            mother_name: targetStudent.mother_name,
            course_name: targetStudent.course_name,
            batch_year: targetStudent.batch_year,
            session_quarter: targetStudent.session_quarter,
            duration: targetStudent.course_duration || '3 Months',
            grade: targetStudent.result_grade,
            cgpa: targetStudent.cgpa,
            issue_date: '2026-04-10',
            verification_code: 'VER-DCIT-' + targetStudent.reg_no
        } : null);

        const validSecret = (targetStudent && targetStudent.secret_code ? targetStudent.secret_code : (cert ? cert.secret_code : '')).toUpperCase();
        const validVerId = (cert && cert.verification_code ? cert.verification_code : ('VER-DCIT-' + (targetStudent ? targetStudent.reg_no : ''))).toUpperCase();

        if (!cert || (!validSecret && !validVerId) || (secCode !== validSecret && secCode !== validVerId)) {
            if (typeof showAwesomeToast === 'function') showAwesomeToast('error', 'ভেরিফিকেশন ব্যর্থ!', 'রেজিস্ট্রেশন নাম্বার অথবা গোপন কোড সঠিক নয়।');
            return;
        }

        window._lastVerifiedCert = cert;
        if (typeof openDcitPopup === 'function') {
            openDcitPopup(`✅ ভেরিফাইড সার্টিফিকেট — ${cert.student_name}`, `
                <div>
                    <div style="width:100%; overflow:hidden; margin-bottom:14px;">
                        ${window.buildDcitBoardCertificateHTML(cert, true)}
                    </div>
                    <div style="text-align:center; display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
                        <button onclick="window.printAuthorizedCertificate(window._lastVerifiedCert)" class="btn btn-accent" style="cursor:pointer;">
                            <i class="fa fa-print"></i> সার্টিফিকেট প্রিন্ট করুন
                        </button>
                        <button onclick="window.downloadAuthorizedCertificatePDF(window._lastVerifiedCert)" class="btn" style="background:#b45309; color:#fff; border:none; padding:8px 16px; border-radius:4px; font-weight:700; cursor:pointer;">
                            <i class="fa fa-file-pdf-o"></i> ডাউনলোড পিডিএফ (PDF)
                        </button>
                    </div>
                </div>
            `);
            setTimeout(window.fitDcitLandscapeCertificates, 60);
        }
    };

    window.addEventListener('afterprint', function () {
        document.body.classList.remove('allow-cert-print');
        setTimeout(window.fitDcitLandscapeCertificates, 100);
    });

    // 6. Animated Preloader, Mobile Menu & Public QR Scan URL Verification Init
    document.addEventListener('DOMContentLoaded', function () {
        ensureBoardCertificateStyles();
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

        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(() => window.fitDcitLandscapeCertificates());
            ro.observe(document.body);
        }

        // Auto-handle QR Code Scan Landing URL (?verify_reg=...&code=...)
        try {
            const params = new URLSearchParams(window.location.search);
            const qrReg = params.get('verify_reg');
            const qrCode = params.get('code');
            if (qrReg) {
                setTimeout(() => {
                    if (typeof DCITStore !== 'undefined' && DCITStore.getDB) {
                        const db = DCITStore.getDB();
                        const st = (db.students || []).find(s => String(s.reg_no) === String(qrReg) || String(s.roll_no) === String(qrReg));
                        const certObj = (db.certificates || []).find(c => String(c.reg_no) === String(qrReg) || String(c.cert_no) === String(qrReg));
                        const targetStudent = st || (certObj ? (db.students || []).find(s => s.reg_no === certObj.reg_no) : null);

                        if (targetStudent || certObj) {
                            const cert = certObj || {
                                cert_no: 'DCIT-' + targetStudent.batch_year + '-' + targetStudent.reg_no,
                                reg_no: targetStudent.reg_no,
                                roll_no: targetStudent.roll_no,
                                secret_code: targetStudent.secret_code,
                                student_name: targetStudent.name,
                                father_name: targetStudent.father_name,
                                mother_name: targetStudent.mother_name,
                                course_name: targetStudent.course_name,
                                batch_year: targetStudent.batch_year,
                                session_quarter: targetStudent.session_quarter,
                                duration: targetStudent.course_duration || '3 Months',
                                grade: targetStudent.result_grade,
                                cgpa: targetStudent.cgpa,
                                issue_date: '2026-04-10',
                                verification_code: 'VER-DCIT-' + targetStudent.reg_no
                            };
                            window.showPublicVerificationModal(cert);
                        }
                    }
                }, 700);
            }
        } catch (e) {}
    });
})();

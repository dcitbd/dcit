/**
 * AMADER GRAM IT CENTER - Admin Panel Interactive Helpers
 */
document.addEventListener('DOMContentLoaded', function () {
    // Instant table filtering in Admin Panel
    const filterBox = document.getElementById('adminSearchBox');
    if (filterBox) {
        filterBox.addEventListener('input', function () {
            const val = this.value.toLowerCase();
            document.querySelectorAll('.adm-table tbody tr').forEach(function (tr) {
                tr.style.display = tr.innerText.toLowerCase().includes(val) ? '' : 'none';
            });
        });
    }

    // Auto-calculate Due Amount in Payment Form
    const totalInput = document.getElementById('total_fee');
    const paidInput = document.getElementById('paid_amount');
    const dueInput = document.getElementById('due_amount');
    if (totalInput && paidInput && dueInput) {
        const calcDue = () => {
            const total = parseFloat(totalInput.value) || 0;
            const paid = parseFloat(paidInput.value) || 0;
            dueInput.value = Math.max(0, total - paid).toFixed(2);
        };
        totalInput.addEventListener('input', calcDue);
        paidInput.addEventListener('input', calcDue);
    }

    // Student selector auto-fill for Certificates & Payments
    const studentSelect = document.getElementById('student_preset');
    if (studentSelect) {
        studentSelect.addEventListener('change', function () {
            const opt = this.options[this.selectedIndex];
            if (!opt || !opt.value) return;
            const map = {
                'reg_no': opt.getAttribute('data-reg'),
                'student_name': opt.getAttribute('data-name'),
                'father_name': opt.getAttribute('data-father'),
                'mother_name': opt.getAttribute('data-mother'),
                'course_name': opt.getAttribute('data-course'),
                'batch_year': opt.getAttribute('data-year'),
                'session_quarter': opt.getAttribute('data-session'),
                'grade': opt.getAttribute('data-grade'),
                'total_fee': opt.getAttribute('data-fee')
            };
            Object.keys(map).forEach(function (id) {
                const el = document.getElementById(id);
                if (el && map[id] !== null && map[id] !== '') {
                    el.value = map[id];
                    el.dispatchEvent(new Event('input'));
                }
            });
        });
    }
});

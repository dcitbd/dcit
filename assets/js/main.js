/**
 * DREAM CAREER IT - Clean Interactive Navigation & Search
 */
document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', function () {
            mainNav.classList.toggle('open');
        });
    }

    const searchInput = document.getElementById('tableFilterInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const q = this.value.toLowerCase();
            document.querySelectorAll('.filterable-table tbody tr').forEach(function (row) {
                row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
            });
        });
    }
});

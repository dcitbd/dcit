/**
 * Dream Career IT - Fast Interactive Frontend JS
 */
document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', function () {
            mainNav.classList.toggle('open');
        });
    }

    // Hero Slider Auto-Play
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 1) {
        let idx = 0;
        setInterval(function () {
            slides[idx].classList.remove('active');
            idx = (idx + 1) % slides.length;
            slides[idx].classList.add('active');
        }, 4000);
    }

    // Instant Table Search Filter
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

document.addEventListener('DOMContentLoaded', function () {
    const particleToggle = document.getElementById('particles-js');
    const sw = document.getElementById('particle-checkbox');
    const STORAGE_KEY = 'particleSetting';

    // If required elements are missing, do nothing
    if (!particleToggle || !sw) return;

    // Load saved setting ('true' = enabled, 'false' = disabled)
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'false') {
        particleToggle.classList.add('dnone');
        sw.checked = false;
    } else {
        // Default: enabled
        particleToggle.classList.remove('dnone');
        sw.checked = saved === 'true' || saved === null;
    }

    sw.addEventListener('change', function () {
        if (sw.checked) {
            particleToggle.classList.remove('dnone');
            localStorage.setItem(STORAGE_KEY, 'true');
        } else {
            particleToggle.classList.add('dnone');
            localStorage.setItem(STORAGE_KEY, 'false');
        }
    });
});


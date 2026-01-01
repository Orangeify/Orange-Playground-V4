document.addEventListener('DOMContentLoaded', function () {
    const proxySelect = document.getElementById('proxySelect');
    const STORAGE_KEY = 'useScramjet';

    // If proxy select element is missing, do nothing
    if (!proxySelect) return;

    // Load saved proxy setting (default: uv for Ultraviolet)
    const savedProxy = localStorage.getItem(STORAGE_KEY);
    if (savedProxy === 'true') {
        proxySelect.value = 'scramjet';
    } else {
        proxySelect.value = 'uv';
    }

    // Listen for proxy selection changes
    proxySelect.addEventListener('change', function () {
        const selectedProxy = proxySelect.value;
        
        if (selectedProxy === 'scramjet') {
            localStorage.setItem(STORAGE_KEY, 'true');
        } else {
            localStorage.setItem(STORAGE_KEY, 'false');
        }
        
        // Optional: Show feedback that setting was saved
        const originalText = proxySelect.textContent;
        proxySelect.style.borderColor = '#4CAF50';
        setTimeout(() => {
            proxySelect.style.borderColor = '';
        }, 1500);
    });
});

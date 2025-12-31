function initThemeSelector() {
    const themeSelect = document.getElementById('themeSelect');
    const themeStylesheetLink = document.getElementById('themeStylesheetLink');
    const savedTheme = localStorage.getItem('theme') || 'original-orange';

    function applyTheme(themeName) {
        themeStylesheetLink.setAttribute('href', `/assets/css/themes/${themeName}.css`);
    }

    themeSelect.addEventListener('change', function() {
        applyTheme(themeSelect.value);
        localStorage.setItem('theme', themeSelect.value);
    });

    themeSelect.value = savedTheme;
    applyTheme(savedTheme);
}

initThemeSelector();
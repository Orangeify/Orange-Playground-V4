function initCloakSelector() {
    const cloakSelect = document.getElementById('cloakSelect');
    const cloakLink = document.getElementById('cloakLink');
    const savedCloak = localStorage.getItem('cloak') || 'playground-logo.png';

    function applyCloak(cloakName) {
        themeStylesheetLink.setAttribute('href', `/assets/imgs/favicons/${cloakName}`);
    }

    cloakSelect.addEventListener('change', function() {
        applyCloak(cloakSelect.value);
        localStorage.setItem('cloak', cloakSelect.value);
    });

    cloakSelect.value = savedCloak;
    applyCloak(savedCloak);
}

initCloakSelector();
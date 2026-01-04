function initCloakSelector() {
    const cloakSelect = document.getElementById('cloakSelect');

    // Ensure there's a link element for the favicon; create if missing
    let cloakLink = document.getElementById('cloakLink');
    if (!cloakLink) {
        cloakLink = document.querySelector('link[rel="icon"]');
        if (!cloakLink) {
            cloakLink = document.createElement('link');
            cloakLink.id = 'cloakLink';
            cloakLink.rel = 'icon';
            document.head.appendChild(cloakLink);
        } else {
            cloakLink.id = 'cloakLink';
        }
    }

    const CLOAKS = {
        'playground-logo': { file: 'playground-logo.png', title: 'Orange Playground' },
        'classlink': { file: 'better-classlink.png', title: 'My Apps' },
        'google': { file: 'google.png', title: 'Google' },
    };

    const DEFAULT_KEY = 'playground-logo';
    const savedKey = localStorage.getItem('cloak') || DEFAULT_KEY;

    function applyCloak(key) {
        const entry = CLOAKS[key] || CLOAKS[DEFAULT_KEY];
        cloakLink.setAttribute('href', `/assets/imgs/favicons/${entry.file}`);
        // Only change the document title for cloaked entries.
        // The default/uncloaked option should preserve the current title.
        if (key !== DEFAULT_KEY) {
            document.title = entry.title;
        }
    }

    if (cloakSelect) {
        cloakSelect.addEventListener('change', function() {
            const key = cloakSelect.value;
            applyCloak(key);
            localStorage.setItem('cloak', key);
        });

        // Set select to saved value (if option exists)
        if ([...cloakSelect.options].some(o => o.value === savedKey)) {
            cloakSelect.value = savedKey;
        }
    }

    // Apply saved cloak on load
    applyCloak(savedKey);
}

initCloakSelector();
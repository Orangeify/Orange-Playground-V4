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
        'blooket': { file: 'blooket.png', title: 'Dashboard | Blooket' },
        'canvas': { file: 'canvas.png', title: 'Dashboard' },
        'classlink': { file: 'better-classlink.png', title: 'My Apps' },
        'cnn-10': { file: 'cnn10.ico', title: 'CNN 10 | CNN' },
        'delta-math': { file: 'deltamath.png', title: 'DeltaMath' },
        'goguardian': { file: 'goguardian-lock.png', title: 'Restricted' },
        'google': { file: 'google.png', title: 'Google' },
        'google-docs': { file: 'google-docs.ico', title: 'Google Docs' },
        'google-drive': { file: 'drive.png', title: 'My Drive - Google Drive' },
        'google-slides': { file: 'google-slides.ico', title: 'Google Slides' },
        'google-classroom': { file: 'classroom.png', title: 'Home' },
        'google-forms': { file: 'googleforms.png', title: 'Start your quiz' },
        'ixl': { file: 'ixl.png', title: 'IXL | Dashboard' },
        'khan-academy': { file: 'khan.png', title: 'Dashboard | Khan Academy' },
        'quizlet': { file: 'quizlet.webp', title: 'Flashcards, learning tools and textbook solutions | Quizlet' },
        'savvas': { file: 'savvas-realize.png', title: 'Savvas Realize' },
        'wikipedia': { file: 'wikipedia.png', title: 'Wikipedia, the free encyclopedia' },
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
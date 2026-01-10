function searchSelector() {
    const searchSelect = document.getElementById('searchSelect') || document.getElementById('search-select');
    const searchEnginelinkEl = document.getElementById('search-engine') || document.getElementById('searchEnginelink');
    let searchEnginelink = searchEnginelinkEl ? searchEnginelinkEl.value : '';

    const ENGINES = {
        'google': 'https://www.google.com/search?q=%s',
        'bing': 'https://www.bing.com/search?q=%s',
        'duckduckgo': 'https://duckduckgo.com/?q=%s',
        'yahoo': 'https://search.yahoo.com/search?p=%s',
        'brave': 'https://search.brave.com/search?q=%s',
        'startpage': 'https://www.startpage.com/sp/search?query=%s'
    };

    if (searchSelect) {
        // Load previously saved engine, default to Google if none found
        const initialSaved = localStorage.getItem('searchEngine');
        let savedEngine = initialSaved;
        if (!savedEngine || !ENGINES[savedEngine]) {
            savedEngine = 'google';
            if (!initialSaved) {
                try { localStorage.setItem('searchEngine', savedEngine); } catch (e) {}
            }
        }
        if (savedEngine && ENGINES[savedEngine]) {
            searchSelect.value = savedEngine;
            searchEnginelink = ENGINES[savedEngine];
            if (searchEnginelinkEl) searchEnginelinkEl.value = searchEnginelink;
        }

        searchSelect.addEventListener('change', function() {
            const selectedEngine = searchSelect.value;
            if (ENGINES[selectedEngine]) {
                const url = ENGINES[selectedEngine];
                // Update hidden input directly
                document.getElementById('search-engine').value = url;
                // Save to localStorage
                try { localStorage.setItem('searchEngine', selectedEngine); } catch (e) {}
            }
        });
    }
}

searchSelector();
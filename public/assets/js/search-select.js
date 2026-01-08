function searchSelector() {
    const searchSelect = document.getElementById('searchSelect');
    const searchEnginelinkEl = document.getElementById('searchEnginelink');
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
        // Load previously saved engine
        const savedEngine = localStorage.getItem('searchEngine');
        if (savedEngine && ENGINES[savedEngine]) {
            searchSelect.value = savedEngine;
            searchEnginelink = ENGINES[savedEngine];
            if (searchEnginelinkEl) searchEnginelinkEl.value = searchEnginelink;
        }

        searchSelect.addEventListener('change', function() {
            const selectedEngine = searchSelect.value;
            if (ENGINES[selectedEngine]) {
                searchEnginelink = ENGINES[selectedEngine];
                if (searchEnginelinkEl) searchEnginelinkEl.value = searchEnginelink;
                try { localStorage.setItem('searchEngine', selectedEngine); } catch (e) {}
            }
        });
    }
}

searchSelector();
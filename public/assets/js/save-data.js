document.addEventListener('DOMContentLoaded', function () {
    const exportBtn = document.getElementById('export-save');
    const importBtn = document.getElementById('import-save');
    const importInput = document.getElementById('import-data-input');

    // Define all settings to save/load
    const SETTINGS_KEYS = {
        abLauncherEnabled: 'abLauncherEnabled',
        cloak: 'cloak',
        panicKey: 'panicKey',
        panicUrl: 'panicUrl',
        panicCtrl: 'panicCtrl',
        particleSetting: 'particleSetting',
        useScramjet: 'useScramjet',
        searchEngine: 'searchEngine',
        theme: 'theme'
    };

    // Export settings to JSON file
    if (exportBtn) {
        exportBtn.addEventListener('click', function () {
            const data = {};

            // Collect all settings from localStorage
            Object.values(SETTINGS_KEYS).forEach(key => {
                const value = localStorage.getItem(key);
                if (value !== null) {
                    data[key] = value;
                }
            });

            // Create and download JSON file
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'math_homework.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }

    // Import settings from JSON file
    if (importBtn) {
        importBtn.addEventListener('click', function () {
            importInput.click();
        });
    }

    if (importInput) {
        importInput.addEventListener('change', function (event) {
            const file = event.target.files[0];

            // Validate file type
            if (!file || file.type !== 'application/json') {
                alert('Please select a valid JSON file.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const data = JSON.parse(e.target.result);

                    // Load settings from JSON into localStorage
                    Object.entries(data).forEach(([key, value]) => {
                        if (Object.values(SETTINGS_KEYS).includes(key)) {
                            localStorage.setItem(key, value);
                        }
                    });

                    // Refresh page to apply settings
                    alert('Settings imported successfully! Reloading...');
                    location.reload();
                } catch (error) {
                    alert('Error reading JSON file: ' + error.message);
                }
            };
            reader.readAsText(file);
        });
    }
});
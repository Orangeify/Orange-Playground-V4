document.addEventListener("DOMContentLoaded", function () {
    const PanicKey = document.getElementById("panic-key");
    const PanicLink = document.getElementById("panic-link");
    const CtrlCheckbox = document.getElementById("ctrl-checkbox");
    const PanicSave = document.getElementById("panic-save");

    // Defaults
    const DEFAULT_PANIC_KEY = "`";
    const DEFAULT_PANIC_URL = "https://www.google.com";

    // Load settings from localStorage
    function loadSettings() {
        const savedKey = localStorage.getItem("panicKey") || DEFAULT_PANIC_KEY;
        const savedUrl = localStorage.getItem("panicUrl") || DEFAULT_PANIC_URL;
        const savedCtrl = localStorage.getItem("panicCtrl") === "true";

        if (PanicKey) PanicKey.value = savedKey;
        if (PanicLink) PanicLink.value = savedUrl;
        if (CtrlCheckbox) CtrlCheckbox.checked = savedCtrl;
    }

    // Save settings to localStorage
    function saveSettings() {
        const key = (PanicKey && PanicKey.value) || DEFAULT_PANIC_KEY;
        const url = (PanicLink && PanicLink.value) || DEFAULT_PANIC_URL;
        const ctrlRequired = CtrlCheckbox && CtrlCheckbox.checked;

        localStorage.setItem("panicKey", key);
        localStorage.setItem("panicUrl", url);
        localStorage.setItem("panicCtrl", ctrlRequired);
    }

    // Handle save button click
    if (PanicSave) {
        PanicSave.addEventListener("click", function () {
            saveSettings();
            // Optional: Show confirmation feedback
            PanicSave.textContent = "Saved!";
            setTimeout(() => {
                PanicSave.textContent = "Save";
            }, 2000);
        });
    }

    // Listen for panic key press
    document.addEventListener("keydown", function (event) {
        const panicKey = localStorage.getItem("panicKey") || DEFAULT_PANIC_KEY;
        const panicUrl = localStorage.getItem("panicUrl") || DEFAULT_PANIC_URL;
        const ctrlRequired = localStorage.getItem("panicCtrl") === "true";

        // Check if the pressed key matches the panic key
        if (event.key === panicKey) {
            // If Ctrl is required, check if it's pressed
            if (ctrlRequired && !event.ctrlKey) {
                return;
            }
            // If Ctrl is not required, but is being held, don't trigger
            if (!ctrlRequired && event.ctrlKey) {
                return;
            }

            // Redirect to the panic URL
            window.location.href = panicUrl;
        }
    });

    // Load settings when page loads
    loadSettings();
});
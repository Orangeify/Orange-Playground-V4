document.addEventListener("DOMContentLoaded", function () {
    const PanicKey = document.getElementById("panic-key");
    const PanicLink = document.getElementById("panic-link");
    const CtrlCheckbox = document.getElementById("ctrl-checkbox");
    const PanicSave = document.getElementById("panic-save");

    // Defaults
    const DEFAULT_PANIC_KEY = "`";
    const DEFAULT_PANIC_URL = "https://www.google.com";
        let panicNavigation = false;

    window.addEventListener("beforeunload", function (event) {
        if (panicNavigation) {
            panicNavigation = false;
            return;
        }

        event.preventDefault();
        event.returnValue = "";
    });

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
            if (event.ctrlKey && event.shiftKey && !event.altKey && !event.metaKey && event.key.toLowerCase() === "f") {
            const iframe = Array.from(document.querySelectorAll("iframe")).find((frame) => {
                if (frame.classList.contains("dnone") || frame.style.display === "none" || frame.style.visibility === "hidden") {
                    return false;
                }

                const rect = frame.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0;
            });

            if (iframe) {
                event.preventDefault();
                if (typeof iframe.requestFullscreen === "function") {
                    iframe.requestFullscreen().catch((error) => {
                        console.error("Unable to enter iframe fullscreen:", error);
                    });
                } else {
                    console.error("Fullscreen is not supported by this browser.");
                }
                return;
            }
        }

        if (event.key === "Escape" && document.fullscreenElement?.tagName === "IFRAME") {
            event.preventDefault();
            document.exitFullscreen().catch((error) => {
                console.error("Unable to exit iframe fullscreen:", error);
            });
            return;
        }

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
            panicNavigation = true;
            window.location.href = panicUrl;
        }
    });

    // Load settings when page loads
    loadSettings();
});
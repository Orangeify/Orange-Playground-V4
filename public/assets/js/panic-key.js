document.addEventListener("DOMContentLoaded", function () {
    // Listen for any key press
    document.addEventListener("keydown", function (event) {
        // Example: Redirect when the Enter key is pressed
        if (event.key === "Enter") {
            window.location.href = "https://example.com"; // Target URL
        }

        // Example: Redirect when the "R" key is pressed (case-insensitive)
        if (event.key.toLowerCase() === "r") {
            window.location.href = "https://google.com";
        }
    });
});
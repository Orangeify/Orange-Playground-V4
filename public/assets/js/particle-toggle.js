const particleToggle = document.getElementById('particles-js');
const sw = document.getElementById('particle-checkbox');

sw.addEventListener('change', function() {
    if (sw.checked) {
        particleToggle.classList.add("dnone")
    } else {
        particleToggle.classList.remove("dnone")
    }
});


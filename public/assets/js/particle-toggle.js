const particleToggle = document.getElementsById('particles-js');
const sw = document.getElementById('particle-checkbox');

sw.addEventListener('change', function() {
    if (sw.checked) {
        particleToggle.classList.add("dnone")
    } else {
        particleToggle.classList.remove("dnone")
    }
});


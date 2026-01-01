const particleToggle = document.getElementById('particles-js');
const sw = document.getElementById('particle-checkbox');

const saved = localStorage.getItem('particleSetting') || enabled;
    const disabled = sw.checked === false;
    const enabled = sw.checked === true;
// If switch is ON, run launcher immediately on page load
    if(saved === disabled){
      particleToggle.classList.add("dnone");
    }

sw.addEventListener('change', function() {
    if (sw.checked === false) {
        particleToggle.classList.add("dnone")
        localStorage.setItem('particleSetting', disabled);
    } else {
        particleToggle.classList.remove("dnone")
        localStorage.setItem('particleSetting', enabled)
    }
});


const particleToggle = document.getElementById('particles-js');
const sw = document.getElementById('particle-checkbox');

const saved = localStorage.getItem('particleSetting') || enabled;
    // If switch is ON, run launcher immediately on page load
    if(saved === disabled){
      particleToggle.classList.add("dnone");
    }

sw.addEventListener('change', function() {
    if (sw.checked === false) {
        particleToggle.classList.add("dnone")
        const disabled = 'disabled';
        localStorage.setItem('particleSetting', disabled);
    } else {
        particleToggle.classList.remove("dnone")
        const enabled = 'enabled';
        localStorage.setItem('particleSetting', enabled)
    }
});


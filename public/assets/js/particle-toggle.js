const particleToggle = document.getElementById('particles-js');
const sw = document.getElementById('particle-checkbox');

const saved = localStorage.getItem('particleSetting') === 'true';
sw.checked = saved;

    // If switch is ON, run launcher immediately on page load
    if(saved){
      particleToggle.classList.add("dnone");
    }

sw.addEventListener('change', function() {
    if (sw.checked === false) {
        particleToggle.classList.add("dnone")
        const disabled = sw.checked === false;
        localStorage.setItem('particleSetting', disabled);
    } else {
        particleToggle.classList.remove("dnone")
    }
});


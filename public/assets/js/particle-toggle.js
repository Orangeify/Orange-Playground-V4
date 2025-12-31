const particleToggle = document.getElementsById('particles-js');
const sw = document.getElementById('particle-checkbox');

    // Restore saved state
    const saved = localStorage.getItem('particleSetting') === 'false';
    sw.checked = saved;

    // If switch is OFF, run launcher immediately on page load
    if(saved){
      openAboutBlankSelf();
    }

    // When switch changes, save state + run launcher if turned ON
    sw.addEventListener('change', function(){
      const disabled = sw.checked === false;
      localStorage.setItem('particleSetting', disabled);

      if(disabled){
        particleToggle.classList.add("dnone");
      }
    });
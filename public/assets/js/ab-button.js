(function(){
  const educationalLinks = [
    'https://www.khanacademy.org',
    'https://www.study.com',
    'https://www.kahoot.it',
    'https://www.blooket.com',
    'https://www.gimkit.com/me',
    'https://canvas.instructure.com',
    'https://www.ck12.org/student/',
    'https://www.ixl.com',
    'https://www.edpuzzle.com',
    'https://www.dictionary.com',
    'https://www.brainpop.com',
    'https://www.nationalgeographic.org/education',
    'https://www.nasa.gov'
  ];

  function openAboutBlankSelf(){
    const newWin = window.open('about:blank', '_blank');
    if(!newWin){
      alert('Popup blocked — allow popups for this site to use the launcher.');
      return;
    }
    const src = location.href;
    const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My Drive - Google Drive</title><style>html,body,iframe{height:100%;margin:0}iframe{border:0;width:100%;height:99%;}</style></head><body><iframe src="${src}" sandbox="allow-same-origin allow-scripts allow-forms allow-popups"></iframe></body></html>`;
    newWin.document.open();
    newWin.document.write(html);
    newWin.document.close();

    // Redirect the original tab to a random educational link
    const rnd = educationalLinks[Math.floor(Math.random() * educationalLinks.length)];
    location.href = rnd;
  }

  document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('about-blank-launcher-btn');
    if(btn) btn.addEventListener('click', openAboutBlankSelf);
    
        const sw = document.getElementById('checkbox');

    // Restore saved state
    const saved = localStorage.getItem('abLauncherEnabled') === 'true';
    sw.checked = saved;

    // If switch is ON, run launcher immediately on page load
    if(saved){
      openAboutBlankSelf();
    }

    // When switch changes, save state + run launcher if turned ON
    sw.addEventListener('change', function(){
      const enabled = sw.checked;
      localStorage.setItem('abLauncherEnabled', enabled);

      if(enabled){
        openAboutBlankSelf();
      }
    });
  });
})();

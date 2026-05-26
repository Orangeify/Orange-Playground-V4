(function(){
  const iframe = document.getElementById('frame') || document.getElementById('sj-frame');
  function updateInputs(url){
    try{ window.currentSearchUrl = url || ''; }catch(e){}
    const main=document.getElementById('address');
    const nav=document.getElementById('nav-address');
    if(main) main.value = url || '';
    if(nav) nav.value = url || '';
  }
  if(iframe){
    iframe.addEventListener('load', function(){
      try{
        const src = iframe.getAttribute('src') || iframe.src || '';
        let target = '';
        if(iframe.dataset && (iframe.dataset.originalUrl || iframe.dataset.targetUrl)){
          target = iframe.dataset.originalUrl || iframe.dataset.targetUrl;
        } else if (typeof __uv$config !== 'undefined' && __uv$config?.prefix && src.indexOf(__uv$config.prefix) === 0 && typeof __uv$config.decodeUrl === 'function'){
          const enc = src.slice(__uv$config.prefix.length);
          try{ target = __uv$config.decodeUrl(enc); }catch(e){ target = src; }
        } else if(iframe.id === 'sj-frame' && src && /^https?:\/\//.test(src)){
          target = src;
        } else if(src && /^https?:\/\//.test(src)){
          target = src;
        } else {
          try{ target = iframe.contentWindow.location.href; }catch(e){}
        }
        updateInputs(target);
      }catch(e){}
    });
  }
})();

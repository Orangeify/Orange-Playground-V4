(function(){
  function getIframe() {
    return document.getElementById('frame') || document.getElementById('sj-frame');
  }

  function updateInputs(url){
    const value = url || '';
    try { window.currentSearchUrl = value; } catch (e) {}
    const main = document.getElementById('address');
    const nav = document.getElementById('nav-address');
    if (main) main.value = value;
    if (nav) nav.value = value;
  }

  function decodeProxyUrl(src, iframe) {
    if (!src) return '';
    if (iframe?.dataset && (iframe.dataset.originalUrl || iframe.dataset.targetUrl)) {
      return iframe.dataset.originalUrl || iframe.dataset.targetUrl;
    }

    if (typeof __uv$config !== 'undefined' && __uv$config?.prefix && typeof __uv$config.decodeUrl === 'function') {
      if (src.indexOf(__uv$config.prefix) === 0) {
        const enc = src.slice(__uv$config.prefix.length);
        try { return __uv$config.decodeUrl(enc); } catch (e) { return src; }
      }
    }

    if (src && /^https?:\/\//.test(src)) {
      return src;
    }

    try {
      return iframe.contentWindow.location.href || src;
    } catch (e) {
      return src;
    }
  }

  function syncIframe() {
    const iframe = getIframe();
    if (!iframe) return;
    const src = iframe.getAttribute('src') || iframe.src || '';
    const target = decodeProxyUrl(src, iframe);
    updateInputs(target);
  }

  function observeIframe(iframe) {
    if (!iframe || iframe.__iframeSyncObserved) return;
    iframe.__iframeSyncObserved = true;

    iframe.addEventListener('load', syncIframe);

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === 'attributes' && record.attributeName === 'src') {
          syncIframe();
        }
      }
    });

    observer.observe(iframe, { attributes: true, attributeFilter: ['src'] });
  }

  function watchIframeChanges() {
    const iframe = getIframe();
    if (iframe) {
      observeIframe(iframe);
      syncIframe();
    }

    const documentObserver = new MutationObserver(() => {
      const iframe = getIframe();
      if (iframe) {
        observeIframe(iframe);
        syncIframe();
      }
    });

    documentObserver.observe(document.body || document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchIframeChanges);
  } else {
    watchIframeChanges();
  }
})();

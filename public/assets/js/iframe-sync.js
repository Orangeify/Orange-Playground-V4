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

  function isIframeVisible(iframe) {
    if (!iframe) return false;
    if (iframe.classList.contains('dnone')) return false;
    if (iframe.style && (iframe.style.display === 'none' || iframe.style.visibility === 'hidden')) return false;
    const rect = iframe.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  let lastTargetUrl = '';

  function syncIframe() {
    const iframe = getIframe();
    if (!iframe || !isIframeVisible(iframe)) return;
    const src = iframe.getAttribute('src') || iframe.src || '';
    const target = decodeProxyUrl(src, iframe);
    if (!target || target === lastTargetUrl) return;
    lastTargetUrl = target;
    updateInputs(target);
  }

  function observeIframe(iframe) {
    if (!iframe || iframe.__iframeSyncObserved) return;
    iframe.__iframeSyncObserved = true;

    iframe.addEventListener('load', syncIframe);

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === 'attributes' && ['src', 'class', 'style'].includes(record.attributeName)) {
          syncIframe();
        }
      }
    });

    observer.observe(iframe, { attributes: true, attributeFilter: ['src', 'class', 'style'] });
  }

  function containsIframe(node) {
    if (!node) return false;
    if (node.id === 'frame' || node.id === 'sj-frame') return true;
    if (node.querySelector) {
      return !!node.querySelector('#frame, #sj-frame');
    }
    return false;
  }

  function watchIframeChanges() {
    const iframe = getIframe();
    if (iframe) {
      observeIframe(iframe);
      syncIframe();
    }

    const documentObserver = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of [...record.addedNodes, ...record.removedNodes]) {
          if (containsIframe(node)) {
            const iframe = getIframe();
            observeIframe(iframe);
            syncIframe();
            return;
          }
        }
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

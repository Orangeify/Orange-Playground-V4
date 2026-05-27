(function(){
  function isFrameVisible(frame) {
    if (!frame) return false;
    if (frame.classList.contains('dnone')) return false;
    if (frame.style && (frame.style.display === 'none' || frame.style.visibility === 'hidden')) return false;
    const rect = frame.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function getIframe() {
    const frame = document.getElementById('frame');
    const sjFrame = document.getElementById('sj-frame');
    if (sjFrame && isFrameVisible(sjFrame)) return sjFrame;
    if (frame && isFrameVisible(frame)) return frame;
    return sjFrame || frame;
  }

  function updateInputs(url){
    const value = url || '';
    try {
      if (typeof window.setCurrentSearchUrl === 'function') {
        window.setCurrentSearchUrl(value);
      } else {
        window.currentSearchUrl = value;
      }
    } catch (e) {}
    const main = document.getElementById('address');
    const nav = document.getElementById('nav-address');
    if (main) main.value = value;
    if (nav) nav.value = value;
    if (typeof window.updateSearchPlaceholders === 'function') {
      window.updateSearchPlaceholders();
    }
  }

  function decodeProxyUrl(src, iframe) {
    if (!src) return '';
    if (iframe?.dataset && (iframe.dataset.originalUrl || iframe.dataset.targetUrl)) {
      return iframe.dataset.originalUrl || iframe.dataset.targetUrl;
    }
    // Try multiple ways of extracting the encoded payload from common UV URL shapes
    let normalized = src;
    let encodedPath = src;
    try {
      const parsed = new URL(src, window.location.href);
      normalized = parsed.pathname;
      encodedPath = parsed.pathname + parsed.search + parsed.hash;
    } catch (e) {
      normalized = src;
      encodedPath = src;
    }

    if (typeof __uv$config !== 'undefined' && __uv$config?.prefix && typeof __uv$config.decodeUrl === 'function') {
      const prefix = __uv$config.prefix;
      const candidates = [];

      // Collect possible encoded substrings from several sources
      [src, normalized, encodedPath].forEach((s) => {
        const pos = s.indexOf(prefix);
        if (pos !== -1) {
          const encFull = s.slice(pos + prefix.length);
          if (encFull) candidates.push(encFull);
          const encNoSlash = encFull.replace(/^\/+/,'');
          if (encNoSlash) candidates.push(encNoSlash);
          const firstSeg = encNoSlash.split('/')[0];
          if (firstSeg) candidates.push(firstSeg);
        }
      });

      // Try decode attempts in order, prefer results that look like HTTP(s)
      const tried = new Set();
      for (const enc of candidates) {
        if (!enc || tried.has(enc)) continue;
        tried.add(enc);
        try {
          const decoded = __uv$config.decodeUrl(enc);
          if (decoded && (/^https?:\/\//.test(decoded) || decoded.startsWith('about:'))) return decoded;
          if (decoded) return decoded;
        } catch (e) {
          try {
            const dec = decodeURIComponent(enc);
            try {
              const decoded2 = __uv$config.decodeUrl(dec);
              if (decoded2 && (/^https?:\/\//.test(decoded2) || decoded2.startsWith('about:'))) return decoded2;
              if (decoded2) return decoded2;
            } catch (err) {
              if (/^https?:\/\//.test(dec)) return dec;
            }
          } catch (err2) {
            // ignore
          }
        }
      }
      // If none of the candidates decoded, fallthrough to other strategies
    }

    const scramPrefix = '/scramjet/';
    const scramPos = src.indexOf(scramPrefix);
    if (scramPos !== -1) {
      const enc = src.slice(scramPos + scramPrefix.length);
      try {
        return decodeURIComponent(enc);
      } catch (e) {
        return src;
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

  function patchScramjetNavigation() {
    try {
      const loader = typeof window.$scramjetLoadController === 'function' ? window.$scramjetLoadController() : null;
      const Controller = loader?.ScramjetController || window.ScramjetController;
      if (!Controller || Controller.__iframeSyncPatched) return false;
      const originalCreateFrame = Controller.prototype.createFrame;
      if (typeof originalCreateFrame !== 'function') return false;
      Controller.prototype.createFrame = function (...args) {
        const frameObj = originalCreateFrame.apply(this, args);
        if (frameObj && typeof frameObj.go === 'function') {
          const originalGo = frameObj.go.bind(frameObj);
          frameObj.go = function (url, ...rest) {
            if (typeof url === 'string' && url) {
              try { window.setCurrentSearchUrl?.(url); } catch (e) {}
            }
            return originalGo(url, ...rest);
          };
        }
        return frameObj;
      };
      Controller.__iframeSyncPatched = true;
      return true;
    } catch (e) {
      return false;
    }
  }

  let lastTargetUrl = '';
  let lastConfigState = typeof __uv$config !== 'undefined';

  function isValidDecodedUrl(url) {
    if (!url) return false;
    if (/^https?:\/\//.test(url)) return true;
    if (url.startsWith('about:')) return true;
    return false;
  }

  function getIframeUrl(iframe) {
    if (!iframe) return '';
    const src = iframe.src || iframe.getAttribute('src') || '';
    let href = '';
    try {
      href = iframe.contentWindow?.location?.href || '';
    } catch (e) {
      href = '';
    }
    if (href && href !== 'about:blank') {
      const decoded = decodeProxyUrl(href, iframe);
      return decoded || href;
    }
    return decodeProxyUrl(src, iframe);
  }

  function syncIframe() {
    const iframe = getIframe();
    if (!iframe || !isIframeVisible(iframe)) return;
    
    const currentConfigState = typeof __uv$config !== 'undefined';
    if (currentConfigState && !lastConfigState) {
      lastConfigState = true;
      lastTargetUrl = '';
    }

    const target = getIframeUrl(iframe);
    if (!target) return;
    
    if (!isValidDecodedUrl(target)) {
      return;
    }
    
    if (target === lastTargetUrl) return;
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

    setInterval(() => {
      const iframe = getIframe();
      if (iframe && isIframeVisible(iframe)) {
        syncIframe();
      }
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      watchIframeChanges();
      const patchInterval = setInterval(() => {
        if (patchScramjetNavigation()) clearInterval(patchInterval);
      }, 500);
    });
  } else {
    watchIframeChanges();
    const patchInterval = setInterval(() => {
      if (patchScramjetNavigation()) clearInterval(patchInterval);
    }, 500);
  }
})();

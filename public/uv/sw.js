//The UV bundle. It contains most of the code for ultraviolet to function properly.
importScripts('/uv/uv.bundle.js');
//our uv.config.js that we just made a few steps ago
importScripts('/uv/uv.config.js');
//the actual Ultraviolet service worker. Needed for UV to function properly.
importScripts(__uv$config.sw || '/uv/uv.sw.js');

//create the uv service worker
const uv = new UVServiceWorker();

//listen for when things are requested.
self.addEventListener('fetch', function (event) {
    //If the request starts with the websites origin (eg. https://localhost:8080) and the uv prefix (/uv/service), then proxy the request.
    if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
        //respond (proxy) the request. Validate and log the proxied URL
        //before calling uv.fetch so we can avoid URL constructor errors
        //and provide clearer diagnostics.
        event.respondWith(
            (async function () {
                const prefix = location.origin + (__uv$config && __uv$config.prefix ? __uv$config.prefix : '/uv/service/');
                const fullUrl = event.request.url;
                const proxiedPart = fullUrl.slice(prefix.length);

                // Attempt to decode the proxied part (config may provide decodeUrl)
                let decodedTarget = proxiedPart;
                try {
                    if (__uv$config && typeof __uv$config.decodeUrl === 'function') {
                        decodedTarget = __uv$config.decodeUrl(proxiedPart);
                    }
                } catch (e) {
                    console.warn('uv.sw: decodeUrl threw an error for', proxiedPart, e);
                }

                // Normalize and validate decodedTarget so it's an absolute URL.
                // If the decoded target lacks a scheme, try prefixing with https://
                let normalizedTarget = decodedTarget;
                try {
                    // Quick check for scheme
                    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(normalizedTarget)) {
                        // No scheme found — assume https and try to normalize
                        const tried = 'https://' + normalizedTarget;
                        try {
                            new URL(tried);
                            normalizedTarget = tried;
                            console.info('uv.sw: normalized proxied target by adding https://', normalizedTarget);
                        } catch (inner) {
                            // Still invalid; leave as-is and let the outer check handle it
                            console.warn('uv.sw: attempted normalization failed for', tried, inner);
                        }
                    }

                    // Final validation — will throw if not absolute URL
                    new URL(normalizedTarget);
                } catch (e) {
                    // Not a valid absolute URL. Log and fallback to a normal fetch
                    console.error('uv.sw: Proxied target is not a valid URL after normalization:', normalizedTarget, 'original:', proxiedPart, e);
                    try {
                        return await fetch(event.request);
                    } catch (fetchErr) {
                        console.error('uv.sw: fallback fetch failed:', fetchErr);
                        return new Response('Bad proxied URL and fallback failed', { status: 502, statusText: 'Bad Gateway' });
                    }
                }

                // If validation passed, call uv.fetch and catch any runtime errors.
                try {
                    return await uv.fetch(event);
                } catch (err) {
                    console.error('Ultraviolet fetch failed, falling back:', err);
                    try {
                        return await fetch(event.request);
                    } catch (fetchErr) {
                        console.error('Fallback fetch also failed:', fetchErr);
                        return new Response('Ultraviolet and fallback fetch failed', { status: 502, statusText: 'Bad Gateway' });
                    }
                }
            })()
        );
    }
    //if it doesn't start with the origin and prefix, just get the stuff normally.
    else {
        event.respondWith(
            (async function() {
                return await fetch(event.request);
            })()
        );
    }
});
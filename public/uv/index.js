async function regSW() {
                //if the service worker doesn't exist throw an error
                    if (!navigator.serviceWorker) {
                    throw new Error("Your browser doesn't support service workers.");
                }
                //register the service worker. (We just made that file!)
                await navigator.serviceWorker.register("/uv/sw.js");
            }
            regSW();
            //function for ease of use
            async function setTransport() {
                //create a new bare mux connection
                const conn = new BareMux.BareMuxConnection("/baremux/worker.js");
                //If you are using http:// change it to ws:// or if using https:// change it to wss://, get the domain name and add "/wisp/" to the end of it
                const wispUrl = (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/wisp/";
                //actually set the transport!!
                await conn.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl /* We just set this url! */ }]);
            }
            //new function, pass in the url so we can actually proxy it!
            async function proxy(url) {
                //get the iframe!
                const iframe = document.getElementById("frame");
                //create the initial url with ultraviolet
                const uvUrl = __uv$config.prefix /* The prefix set in the config */ + __uv$config.encodeUrl(/* Our search function! */ search(url, "https://www.google.com/search?q=%s" /* the search engine template. Feel free to change it to whatever search engine you want (just make sure to add %s add the end!) */)) /* Encode the url with XOR */
                //call our setTransport function
                await setTransport();
                //remove the "dnone" class so the iframe is visible.
                iframe.classList.remove("dnone");
                //set the iframe's source to the initial url
                iframe.src = uvUrl;
            }
            //listen for keypresses in the address bar
            document.getElementById("address").addEventListener("keypress", function (event) {
                //if it's the enter key, proxy the url!
                if (event.key === "Enter") {
                    //call our proxy function with the url they entered
                    proxy(document.getElementById("address").value /* The value the user has entered */)
                }
            });
            //new function to allow a user to be able to search intead of having to type in a full url
            function search(key /* the user's value */, template /* the search engine template to use */) {
                try {
                    //if the entered a full url! Continue on
                    return new URL(key).toString();
                } catch (error) { /* ignore errors */ }
                try {
                    //if the entered value is a full URL when adding http:// or https:// in front of it, add http:// and the continue.
                    const url = new URL(`http://${key}`);
                    //we also have to make sure it is an actual domain!
                    if (url.hostname.includes('.')) return url.toString();
                } catch (error) { /* Ignore the errors */ }
                //if the above doesn't pass, add the entered value to a search template and the continue.
                return template.replace("%s", encodeURIComponent(key));
            }
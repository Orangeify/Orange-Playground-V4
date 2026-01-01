const { ScramjetController } = $scramjetLoadController();

const scramjet = new ScramjetController({
  files: {
	  wasm: "/scram/scramjet.wasm.wasm",
	  all: "/scram/scramjet.all.js",
	  sync: "/scram/scramjet.sync.js",
  }
});

scramjet.init();

navigator.serviceWorker.register("sw.js");

// Init BareMux
const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
// Set the transport yourself
connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl /* We just set this url! */ }]);
//Import Scramjet and BareMux
//Scramjet provides the encodeUrl function for proxying
//BareMux provides transport connections with Epoxy and Wisp

//function to proxy a URL using Scramjet encoding
async function proxy(url) {
    //get the iframe!
    const iframe = document.getElementById("frame");
    //create the initial url with Scramjet encoding
    const sjUrl = scramjet.encodeUrl(search(url, "https://www.google.com/search?q=%s" /* the search engine template. Feel free to change it to whatever search engine you want (just make sure to add %s at the end!) */));
    //remove the "dnone" class so the iframe is visible.
    iframe.classList.remove("dnone");
    //set the iframe's source to the encoded url
    iframe.src = sjUrl;
}

//listen for keypresses in the address bar
document.getElementById("address").addEventListener("keypress", function (event) {
    //if it's the enter key, proxy the url!
    if (event.key === "Enter") {
        //call our proxy function with the url they entered
        proxy(document.getElementById("address").value /* The value the user has entered */)
    }
});

//new function to allow a user to be able to search instead of having to type in a full url
function search(input /* the user's value */, template /* the search engine template to use */) {
    try {
        //if they entered a full url! Continue on
        return new URL(input).toString();
    } catch (error) { /* ignore errors */ }
    try {
        //if the entered value is a full URL when adding http:// or https:// in front of it, add http:// and then continue.
        const url = new URL(`http://${input}`);
        //we also have to make sure it is an actual domain!
        if (url.hostname.includes('.')) return url.toString();
    } catch (error) { /* Ignore the errors */ }
    //if the above doesn't pass, add the entered value to a search template and then continue.
    return template.replace("%s", encodeURIComponent(input));
}
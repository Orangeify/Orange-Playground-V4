async function registerSW() {
	if (!navigator.serviceWorker) {
		if (
			location.protocol !== "https:" &&
			!swAllowedHostnames.includes(location.hostname)
		)
			throw new Error("Service workers cannot be registered without https.");

		throw new Error("Your browser doesn't support service workers.");
	}

	await navigator.serviceWorker.register("/scram/sw.js");
}

const address = document.getElementById("address");

const { ScramjetController } = $scramjetLoadController();

const scramjet = new ScramjetController({
  files: {
	  wasm: "/scram/scramjet.wasm.wasm",
	  all: "/scram/scramjet.all.js",
	  sync: "/scram/scramjet.sync.js",
  }
});

scramjet.init();

navigator.serviceWorker.register("/scram/sw.js");

// Init BareMux
const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	try {
		await registerSW();
	} catch (err) {
		error.textContent = "Failed to register service worker.";
		errorCode.textContent = err.toString();
		throw err;
	}

	const url = search(address.value, searchEngine.value);

	let wispUrl =
		(location.protocol === "https:" ? "wss" : "ws") +
		"://" +
		location.host +
		"/wisp/";
	if ((await connection.getTransport()) !== "/epoxy/index.mjs") {
		await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
	}

	function search(input, template) {
	try {
		// input is a valid URL:
		// eg: https://example.com, https://example.com/test?q=param
		return new URL(input).toString();
	} catch (err) {
		// input was not a valid URL
	}

	try {
		// input is a valid URL when http:// is added to the start:
		// eg: example.com, https://example.com/test?q=param
		const url = new URL(`http://${input}`);
		// only if the hostname has a TLD/subdomain
		if (url.hostname.includes(".")) return url.toString();
	} catch (err) {
		// input was not valid URL
	}

	// input may have been a valid URL, however the hostname was invalid

	// Attempts to convert the input to a fully qualified URL have failed
	// Treat the input as a search query
	return template.replace("%s", encodeURIComponent(input));
  const frame = scramjet.createFrame();
  frame.frame.id = "frame";
	document.body.appendChild(frame.frame);	
	frame.go(url);
}});
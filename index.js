//Import express, http and wisp
import http from 'node:http';
import express from 'express';
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";
import path from 'node:path';
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node"; //Note how we are using /node at the end of this import. This provides the correct types when using TypeScript.
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";

//create the express "app"
const app = express();
//define the port to listen on
//change this to your liking!
const port = 8080;

const server = http.createServer(app);

app.use(express.static(path.join(path.dirname(new URL(import.meta.url).pathname), "public" /* This is the folder you created with the index.html file in it */)));

// "/uv/" is where the uv files will be available from. uvPath is just where those files are located
app.use("/uv/", express.static(uvPath));
// "/scram/" is where the uv files will be available from. scramjetPath is just where those files are located
app.use("/scram/", express.static(scramjetPath));
// "/baremux/" is where the bare-mux files will be available from. baremuxPath is just where those files are located
app.use("/baremux/", express.static(baremuxPath));
// "/epoxy/" is where the epoxy files will be served from. epoxyPath is just the location to those files.
app.use("/epoxy/", express.static(epoxyPath));

// Set wisp logging to none. Available log levels: logging.NONE, logging.INFO, logging.DEBUG.
// Change to logging.INFO or logging.DEBUG for more verbose logging.
logging.set_level(logging.NONE);

//listen for requests on the http server.
// No need to manually handle requests here, as http.createServer(app) already does this.

//listen for websocket upgrades on the http server
server.on("upgrade", (req, socket, head) => {
  wisp.routeRequest(req, socket, head);
});

server.on("listening", () => {
  console.log("listening on port " + port);
});

// Start server (single listen call)
server.listen(port);
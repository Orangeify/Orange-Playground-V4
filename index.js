//Import express, http and wisp
import http from 'node:http';
import express from 'express';
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";
import path from 'node:path';
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node"; //Note how we are using /node at the end of this import. This provides the correct types when using TypeScript.
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";

//create the express "app"
const app = express();
//create an http server
const server = http.createServer();
//define the port to listen on
//change this to your liking!
const port = 8080;

app.use(express.static(path.join(import.meta.dirname, "public" /* This is the folder you created with the index.html file in it */)));

// "/uv/" is where the uv files will be available from. uvPath is just where those files are located
app.use("/uv/", express.static(uvPath));
// "/baremux/" is where the bare-mux files will be available from. baremuxPath is just where those files are located
app.use("/baremux/", express.static(baremuxPath));
// "/epoxy/" is where the epoxy files will be served from. epoxyPath is just the location to those files.
app.use("/epoxy/", express.static(epoxyPath));

logging.set_level(logging.NONE); //set wisp logging to none. Change to logging.INFO or logging.DEBUG for more verbose logging.

//listen for requests on the http server.
server.on('request', (req, res) => {
    //make express handle all of the requests
    app(req, res)
});

//listen for websocket upgrades on the http server
server.on('upgrade', (req, socket, head) => {
    if (req.url.endsWith('/wisp/')) {
        //route the request to the wisp server if the url ends in /wisp/
        wisp.routeRequest(req, socket, head);
    }
    else {
        socket.end();
    }
});

//when the server is ready, console.log that it is ready
server.on('listening', () => {
    console.log(`Server listening on http://localhost:${port}`);
});

//start the http server
server.listen({
    port: port 
});


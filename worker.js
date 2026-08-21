import { worker as wisp, logging } from "@mercuryworkshop/wisp-js/worker";

// Set logging level (NONE, INFO, DEBUG)
logging.set_level(logging.NONE);

export default {
  async fetch(request, env, ctx) {
    // Handle WebSocket upgrades for Wisp
    if (request.headers.get("Upgrade") === "websocket") {
      return wisp.routeRequest(request);
    }

    // Everything else is static and served by Cloudflare Pages
    return new Response("Not found", { status: 404 });
  }
};

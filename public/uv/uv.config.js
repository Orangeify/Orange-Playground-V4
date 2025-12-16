// Configure Ultraviolet. Use wrapper functions for encode/decode so this
// config file doesn't throw if the Ultraviolet global isn't available yet.
self.__uv$config = {
  // The prefix is where we "intercept" the request.
  prefix: "/uv/service/",
  // where Ultraviolet encodes & decodes the urls. Use runtime wrappers
  // that attempt to call the codec when available and fall back to
  // identity (no-op) otherwise.
  encodeUrl: function (url) {
    try {
      if (typeof Ultraviolet !== "undefined" && Ultraviolet.codec && Ultraviolet.codec.xor && typeof Ultraviolet.codec.xor.encode === "function") {
        return Ultraviolet.codec.xor.encode(url);
      }
    } catch (e) {
      /* ignore and fall through */
    }
    return url;
  },
  decodeUrl: function (s) {
    try {
      if (typeof Ultraviolet !== "undefined" && Ultraviolet.codec && Ultraviolet.codec.xor && typeof Ultraviolet.codec.xor.decode === "function") {
        return Ultraviolet.codec.xor.decode(s);
      }
    } catch (e) {
      /* ignore and fall through */
    }
    return s;
  },
  // extra UV stuff
  handler: "/uv/uv.handler.js",
  client: "/uv/uv.client.js",
  bundle: "/uv/uv.bundle.js",
  config: "/uv/uv.config.js",
  sw: "/uv/uv.sw.js",
};



// games.js
const LIB_BASE = "https://cdn.jsdelivr.net/gh/tharun9772/game-assets@main/libraries/";
const FALLBACK_IMG = "/playground-logo.png";

function safeArray(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === "object") {
    if (Array.isArray(v.games)) return v.games;
    if (Array.isArray(v.data)) return v.data;
    if (Array.isArray(v.list)) return v.list;
    if (Array.isArray(v.items)) return v.items;
    if (Array.isArray(v.cards)) return v.cards;
    if (Array.isArray(v.assets)) return v.assets;
    const vals = Object.values(v);
    for (const item of vals) {
      if (Array.isArray(item)) return item;
    }
  }
  return [];
}

function normalize(g) {
  if (!g || !g.name || !g.url) return null;
  return {
    name: g.name,
    img: g.img || g.IMG || g.image || FALLBACK_IMG,
    url: g.url || g.URL,
    altImg: g.altImg || null,
    engine: g.engine || null
  };
}

function dedupeGames(list) {
  const seen = new Set();
  const out = [];
  for (const item of list || []) {
    const g = normalize(item);
    if (!g) continue;
    const key = (g.name || "").trim().toLowerCase() + "||" + (g.url || "").trim();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(g);
  }
  return out;
}

function extractCards(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.cards)) return data.cards;
  if (Array.isArray(data.games)) return data.games;
  if (Array.isArray(data.list)) return data.list;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.items)) return data.items;
  return [];
}

function createCardElement(card) {
  const cardDiv = document.createElement("div");
  cardDiv.className = "square-card";

  const img = document.createElement("img");
  img.className = "square-image";
  img.alt = card.title || card.name || "Game";
  img.src = card.image || card.img || card.thumbnail || FALLBACK_IMG;
  img.onerror = () => { img.onerror = null; img.src = FALLBACK_IMG; };

  const title = document.createElement("h3");
  title.textContent = card.title || card.name || card.label || "Untitled";

  const embedUrl = card.url || card.embedUrl || card.src || card.link || card.href;
  let href = card.link || card.href || card.page;

  if (CURRENT_LIBRARY && BLOOKET_REDIRECT_LIBS.has(CURRENT_LIBRARY)) {
    if (embedUrl) {
      href = `/assessments/blooket-sg.html?title=${encodeURIComponent(title.textContent)}&url=${encodeURIComponent(embedUrl)}`;
    }
  } else if (card.hasOwnProperty("proxy") && embedUrl) {
    const page = card.proxy ? "/assessments/blooket-sg.html" : "/worksheets/quizlet-hw.html";
    href = `${page}?title=${encodeURIComponent(title.textContent)}&url=${encodeURIComponent(embedUrl)}`;
  }

  if (href) {
    cardDiv.addEventListener("click", () => { window.location.href = href; });
    cardDiv.style.cursor = "pointer";
  }

  cardDiv.appendChild(img);
  cardDiv.appendChild(title);
  return cardDiv;
}

// map select values to library folder names on the CDN
const LIB_MAP = {
  "3kh0": "3kh0",
  "gn-math": "gn",
  "ugs": "ugs",
  "ckv": "ckv",
  "shuttle-math": "shuttleproxy",
  "truffled": "truffled",
  "hydra": "hydra",
  "yt-play": "youtube",
  "selenite": "selenite",
  "seraph": "seraph",
  "velera": "velera",
  "now-gg": "nowgg"
};

const BLOOKET_REDIRECT_LIBS = new Set([
  "3kh0",
  "gn",
  "ugs",
  "ckv",
  "shuttleproxy",
  "truffled",
  "hydra",
  "youtube",
  "selenite",
  "seraph",
  "velera",
  "nowgg"
]);

let CURRENT_LIBRARY = null;

async function loadGN() {
  try {
    const r = await fetch("https://cdn.jsdelivr.net/gh/freebuisness/assets/zones.json");
    if (!r.ok) return [];
    const d = await r.json();
    return dedupeGames(safeArray(d)
      .filter(g => g.id !== -1 && g.name && !g.name.startsWith("[!]"))
      .map(g => {
        let gameUrl = g.url || "";
        if (gameUrl) {
          gameUrl = gameUrl.replace("{HTML_URL}", "https://cdn.jsdelivr.net/gh/freebuisness/html@master");
          gameUrl = gameUrl + "?gn-id=" + encodeURIComponent(g.id);
        }
        return {
          name: g.name,
          img: "https://cdn.jsdelivr.net/gh/freebuisness/covers@main/" + (g.cover || "").replace("{COVER_URL}", ""),
          url: gameUrl
        };
      }));
  } catch (e) {
    return [];
  }
}

async function loadUGS() {
  try {
    const r = await fetch("https://raw.githack.com/bubbls/ugs-singlefile/main/games.js");
    if (!r.ok) return [];
    const text = await r.text();
    const arrayMatch = text.match(/let\s+files\s*=\s*\[([\s\S]*?)\];/);
    if (!arrayMatch) return [];
    const arrayContent = arrayMatch[1];
    const stringRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'/g;
    let match;
    const extractedFiles = [];

    while ((match = stringRegex.exec(arrayContent)) !== null) {
      extractedFiles.push(match[1] || match[2]);
    }

    return dedupeGames(extractedFiles
      .filter(f => f && f.toLowerCase().startsWith("cl"))
      .map(f => {
        const normalizedName = f.includes(".") && f.lastIndexOf(".") > 0 ? f : f + ".html";
        const displayName = f.replace(/^cl/i, "").replace(/\.html$/i, "");
        return {
          name: displayName || f,
          img: "https://cdn.jsdelivr.net/gh/tharun9772/game-assets@main/5968517.png",
          url: "/app-viewer/ugs-files?view=" + encodeURIComponent(normalizedName)
        };
      }));
  } catch (e) {
    console.error("Error parsing UGS library:", e);
    return [];
  }
}

async function loadSeraph() {
  try {
    const r = await fetch("https://cdn.jsdelivr.net/gh/DominumNetwork/dominum@main/src/assets/libraries/seraph/games.json");
    if (!r.ok) return [];
    const d = await r.json();
    const BASE = "https://cdn.jsdelivr.net/gh/a456pur/seraph@main/games/";
    return dedupeGames(safeArray(d).map(g => ({
      name: g.name || "Unknown",
      img: g.img || FALLBACK_IMG,
      url: "/app-viewer/seraph/?view=" + (g.url ? g.url.replace(BASE, "") : "")
    })));
  } catch (e) {
    return [];
  }
}

async function loadCKV() {
  try {
    const r = await fetch("https://cdn.jsdelivr.net/gh/carbonicality/ChickenKingsVault@main/games.json");
    if (!r.ok) return [];
    const d = await r.json();
    return dedupeGames(safeArray(d).map(g => {
      const gameUrl = g?.html || g?.url;
      if (!gameUrl) return null;
      let img = g?.img || g?.image || g?.thumb || g?.thumbnail || FALLBACK_IMG;
      if (g?.base) img = g.base + "/thumb.jpg";
      return {
        name: g.name || g.title || "Unknown",
        img: img,
        url: "/app-viewer/chicken-kings-vault/?view=" + encodeURIComponent(gameUrl)
      };
    }).filter(Boolean));
  } catch (e) {
    return [];
  }
}

async function loadHydra() {
  try {
    const r = await fetch("https://cdn.jsdelivr.net/gh/1234chromebook1234-creator/hh@main/gmes.json");
    if (!r.ok) return [];
    const d = await r.json();
    const rawArray = Array.isArray(d) ? d : safeArray(d);
    return dedupeGames(rawArray.map(g => {
      if (!g || typeof g !== "object") return null;
      const file = g.file_name || g.link || g.url;
      if (!file) return null;
      let thumb = g.thumb || g.image || g.img || FALLBACK_IMG;
      if (thumb !== FALLBACK_IMG && !thumb.startsWith("http")) {
        thumb = "https://cdn.jsdelivr.net/gh/tharuniscool/hydra-assets@main/" + thumb.replace(/^\/+/, "");
      }
      return {
        name: g.title || g.name || "Unknown",
        img: thumb,
        url: "https://cdn.jsdelivr.net/gh/1234chromebook1234-creator/hh@main/gmes/" + encodeURIComponent(file)
      };
    }).filter(Boolean));
  } catch (e) {
    return [];
  }
}

async function loadTruffled() {
  try {
    const r = await fetch("https://cdn.jsdelivr.net/gh/aukak/truffled@main/public/js/json/g.json");
    if (!r.ok) return [];
    const d = await r.json();
    return dedupeGames(safeArray(d).map(g => {
      if (!g || !g.url) return null;
      const thumb = (g.thumbnail || "").replace(/^\/+/, "").replace(/^png\/games\//, "");
      return {
        name: g.name || "Unknown",
        img: thumb ? "https://cdn.jsdelivr.net/gh/aukak/truffled@main/public/png/games/" + thumb : FALLBACK_IMG,
        url: "https://truffled.lol/" + g.url.replace(/^\/+/, "")
      };
    }).filter(Boolean));
  } catch (e) {
    return [];
  }
}

async function loadNowGG() {
  try {
    const r = await fetch("https://cdn.jsdelivr.net/gh/tharun9772/game-assets@main/nowgg.fun/games.json");
    if (!r.ok) return [];
    const d = await r.json();
    return dedupeGames(safeArray(d).map(g => {
      if (!g.name || !g.url) return null;
      let cleanUrl = g.url.trim();
      if (!cleanUrl.startsWith("http")) cleanUrl = "https://" + cleanUrl;
      return {
        name: g.name,
        img: g.img || FALLBACK_IMG,
        url: cleanUrl
      };
    }).filter(Boolean));
  } catch (e) {
    return [];
  }
}

async function loadSelenite() {
  try {
    const r = await fetch("https://math-quests-cc.dk-ubg.workers.dev/resources/games.json");
    if (!r.ok) return [];
    const d = await r.json();
    return dedupeGames(safeArray(d).map(g => {
      if (!g?.name || !g?.image || !g?.directory) return null;
      const dir = String(g.directory).replace(/^\/+/, "").replace(/\/+$/, "");
      return {
        name: g.name,
        img: "https://math-quests-cc.dk-ubg.workers.dev/resources/semag/" + dir + "/" + g.image,
        url: "https://selenite.cc/resources/semag/" + dir + "/index.html"
      };
    }).filter(Boolean));
  } catch (e) {
    return [];
  }
}

async function loadVelera() {
  try {
    const r = await fetch("https://math-of-cc.dk-ubg.workers.dev/data/games.json");
    if (!r.ok) return [];
    const d = await r.json();
    return dedupeGames(safeArray(d).map(g => {
      if (!g?.title || !g?.location) return null;
      return {
        name: g.title,
        img: "https://math-of-cc.dk-ubg.workers.dev/" + String(g.image || "").replace(/^\/+/, ""),
        url: "https://velara.cc/" + String(g.location || "").replace(/^\/+/, "")
      };
    }).filter(Boolean));
  } catch (e) {
    return [];
  }
}

async function load3kh0() {
  try {
    const r = await fetch("https://cdn.jsdelivr.net/gh/tharun9772/game-assets@main/3kh0/3kh0-assets.json");
    if (!r.ok) return [];
    const d = await r.json();
    return dedupeGames(safeArray(d).map(name => ({
      name,
      img: "https://raw.githack.com/tharun9772/3kh0-assets/main/" + name + "/splash.png",
      url: "https://raw.githack.com/tharun9772/3kh0-assets/main/" + encodeURIComponent(name) + "/index.html"
    })));
  } catch (e) {
    return [];
  }
}

async function loadShuttleProxy() {
  try {
    const r = await fetch("https://bloxcraft.win/games/data/json/shuttleproxy.json");
    if (!r.ok) return [];
    const d = await r.json();
    return dedupeGames(safeArray(d).map(g => {
      if (!g || !g.name || !g.root) return null;
      const cleanRoot = g.root.endsWith('/') ? g.root : g.root + '/';
      const cleanImg = g.img ? (g.img.startsWith('/') ? g.img.slice(1) : g.img) : '';
      return {
        name: g.name,
        img: cleanImg ? "https://winf-dictionary.dk-ubg.workers.dev/cdn/proxy/image/https://assets.shuttlemath.com/" + cleanRoot + cleanImg : FALLBACK_IMG,
        url: "https://assets.shuttlemath.com/" + g.root
      };
    }).filter(Boolean));
  } catch (e) {
    return [];
  }
}

async function loadYoutube() {
  try {
    const r = await fetch("https://cdn.jsdelivr.net/gh/tharun9772/game-assets@main/libraries/youtube/gms.json");
    if (!r.ok) return [];
    const d = await r.json();
    return dedupeGames(safeArray(d).map(g => {
      if (!g || !g.name) return null;
      return {
        name: g.name,
        img: "/youtube.png",
        url: "/app-viewer/youtube-playables/?view=" + encodeURIComponent(g.name)
      };
    }).filter(Boolean));
  } catch (e) {
    return [];
  }
}

const LIB_LOADERS = {
  "3kh0": load3kh0,
  gn: loadGN,
  ugs: loadUGS,
  ckv: loadCKV,
  shuttleproxy: loadShuttleProxy,
  truffled: loadTruffled,
  hydra: loadHydra,
  youtube: loadYoutube,
  selenite: loadSelenite,
  seraph: loadSeraph,
  velera: loadVelera,
  nowgg: loadNowGG
};

async function loadCards(libKey = "orange-playground") {
  try {
    const container = document.querySelector(".square-grid");
    if (!container) return;
    container.innerHTML = "";
    let url;
    let data = null;
    const lib = LIB_MAP[libKey] || libKey;

    if (libKey === "orange-playground") {
      url = "./assets/json/games.json";
    } else {
      CURRENT_LIBRARY = lib;
      if (LIB_LOADERS[lib]) {
        data = await LIB_LOADERS[lib]();
      }
      if (!data || data.length === 0) {
        url = `${LIB_BASE}${lib}/games.json`;
      }
    }

    if (!data && url) {
      const response = await fetch(url).catch(() => null);
      if (response && response.ok) {
        try { data = await response.json(); } catch (e) { data = null; }
      }
    }

    if ((!data || data.length === 0) && libKey !== "orange-playground") {
      const altUrls = [
        `${LIB_BASE}${lib}/index.json`,
        `${LIB_BASE}${lib}/list.json`,
        `${LIB_BASE}${lib}/cards.json`
      ];
      for (const u of altUrls) {
        const r = await fetch(u).catch(() => null);
        if (r && r.ok) {
          try { data = await r.json(); break; } catch (e) { data = null; }
        }
      }
    }

    if ((!data || data.length === 0) && libKey !== "orange-playground") {
      const r = await fetch("./assets/json/games.json").catch(() => null);
      if (r && r.ok) data = await r.json().catch(() => null);
    }

    const cards = Array.isArray(data) ? data : extractCards(data);
    cards.forEach(card => container.appendChild(createCardElement(card)));
  } catch (error) {
    console.error("Error loading cards:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("game-library-select");
  if (select) {
    // load initial selection
    loadCards(select.value || "orange-playground");
    select.addEventListener("change", () => loadCards(select.value || "orange-playground"));
  } else {
    loadCards("orange-playground");
  }
});
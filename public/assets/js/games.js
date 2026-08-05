// games.js
const LIB_BASE = "https://cdn.jsdelivr.net/gh/tharun9772/game-assets@main/libraries/";
const FALLBACK_IMG = "/playground-logo.png";

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

  if (card.hasOwnProperty("proxy") && embedUrl) {
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

async function loadCards(libKey = "orange-playground") {
  try {
    const container = document.querySelector(".square-grid");
    if (!container) return;
    container.innerHTML = "";
    let url;
    let data = null;
    if (libKey === "orange-playground") {
      url = "./assets/json/games.json";
    } else {
      // try to fetch data via gms.js loaders first (if present on the page)
      const lib = LIB_MAP[libKey] || libKey;

      async function tryGmsLoad(libName) {
        try {
          if (window && window.LOADER_MAP && typeof window.LOADER_MAP[libName] === 'function') {
            await Promise.race([window.LOADER_MAP[libName](), new Promise(res => setTimeout(res, 4000))]);
            if (window.DATA && window.DATA[libName]) return window.DATA[libName];
          }

          const candidates = [
            `load${libName}`,
            `load${libName.toUpperCase()}`,
            `load${libName[0].toUpperCase()}${libName.slice(1)}`
          ];
          for (const name of candidates) {
            if (window && typeof window[name] === 'function') {
              await Promise.race([window[name](), new Promise(res => setTimeout(res, 4000))]);
              if (window.DATA && window.DATA[libName]) return window.DATA[libName];
            }
          }
        } catch (e) {}
        return null;
      }

      data = await tryGmsLoad(lib);
      if (!data) {
        // fallback to CDN JSON
        url = `${LIB_BASE}${lib}/games.json`;
      }
    }

    if (!data && url) {
      const response = await fetch(url).catch(() => null);
      if (response && response.ok) {
        try { data = await response.json(); } catch (e) { data = null; }
      }
    }

    // If remote fetch failed or returned nothing, try a few fallbacks for common names
    if (!data && libKey !== "orange-playground") {
      const altUrls = [
        `${LIB_BASE}${libKey}/index.json`,
        `${LIB_BASE}${libKey}/list.json`,
        `${LIB_BASE}${libKey}/cards.json`
      ];
      for (const u of altUrls) {
        const r = await fetch(u).catch(() => null);
        if (r && r.ok) {
          try { data = await r.json(); break; } catch (e) { data = null; }
        }
      }
    }

    // if still no data and default, try local file as last resort
    if (!data && libKey !== "orange-playground") {
      const r = await fetch("./assets/json/games.json").catch(() => null);
      if (r && r.ok) data = await r.json().catch(() => null);
    }

    const cards = extractCards(data) || [];

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
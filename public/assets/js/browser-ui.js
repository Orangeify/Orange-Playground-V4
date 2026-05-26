"use strict";

const searchForm = document.getElementById("search-address");

function getActiveFrame() {
  return document.getElementById("frame") || document.getElementById("sj-frame");
}

function reloadFrame() {
  const iframe = getActiveFrame();
  if (!iframe) {
    return;
  }

  const currentSrc = iframe.getAttribute("src") || iframe.src;
  if (!currentSrc) {
    return;
  }

  // Use getAttribute and setAttribute to refresh the iframe source.
  iframe.setAttribute("src", currentSrc);
}

function goBack() {
  const iframe = getActiveFrame();
  if (iframe) {
    iframe.contentWindow.history.back();
  }
}

function goForward() {
  const iframe = getActiveFrame();
  if (iframe) {
    iframe.contentWindow.history.forward();
  }
}

function initializeNavGroups() {
  // Nav groups are already defined in HTML with appropriate classes
}

function setNavigationState(showArrows) {
  const mainGroup = document.querySelector(".nav-group-main");
  const arrowGroup = document.querySelector(".nav-group-arrows");

  if (!mainGroup || !arrowGroup) {
    return;
  }

  if (showArrows) {
    mainGroup.classList.add("hidden");
    mainGroup.classList.remove("active");
    arrowGroup.classList.add("active");
    arrowGroup.classList.remove("hidden");
  } else {
    mainGroup.classList.add("active");
    mainGroup.classList.remove("hidden");
    arrowGroup.classList.add("hidden");
    arrowGroup.classList.remove("active");
  }
}

function getCurrentPageUrl() {
  const iframe = document.getElementById("frame") || document.getElementById("sj-frame");
  return iframe ? iframe.getAttribute("src") || iframe.src : "";
}

function updateSearchPlaceholders() {
  const currentUrl = getCurrentPageUrl();
  const mainInput = document.getElementById("address");
  const navInput = document.getElementById("nav-address");

  if (mainInput) {
    if (currentUrl) {
      mainInput.value = currentUrl;
      mainInput.placeholder = "Search...";
    } else {
      mainInput.value = "";
      mainInput.placeholder = "Search...";
    }
  }
  if (navInput) {
    if (currentUrl) {
      navInput.value = currentUrl;
      navInput.placeholder = "Search...";
    } else {
      navInput.value = "";
      navInput.placeholder = "Search...";
    }
  }
}

function searchFallback(input, template) {
  try {
    return new URL(input).toString();
  } catch (err) {
    // ignore
  }

  try {
    const url = new URL(`http://${input}`);
    if (url.hostname.includes(".")) return url.toString();
  } catch (err) {
    // ignore
  }

  return template.replace("%s", encodeURIComponent(input));
}

function resolveSearchUrl(input, form) {
  const formTemplate = form?.querySelector('#search-engine, #nav-search-engine')?.value;
  const template = formTemplate || document.querySelector('#search-engine, #nav-search-engine')?.value || "https://www.google.com/search?q=%s";
  if (typeof window.search === "function") {
    try {
      return search(input, template);
    } catch (err) {
      return searchFallback(input, template);
    }
  }
  return searchFallback(input, template);
}

function animateSearch(target) {
  if (!target) return;
  target.classList.remove("search-fade-in");
  void target.offsetWidth;
  target.classList.add("search-fade-in");
}

function getProxyUrl(url) {
  if (typeof __uv$config !== "undefined" && __uv$config?.prefix && typeof __uv$config.encodeUrl === "function") {
    return __uv$config.prefix + __uv$config.encodeUrl(url);
  }
  return url;
}

function showFrame(iframe) {
  if (!iframe) return;
  iframe.style.display = "block";
  iframe.classList.remove("dnone");
}

function handleSearchSubmit(event) {
  const form = event.target;
  const input = form.querySelector('.input');
  if (!input) {
    return;
  }

  const query = input.value.trim();
  if (!query) {
    return;
  }

  // Only handle nav search form here; delegate to top form for proxy to handle
  if (form.id === 'nav-search-address') {
    event.preventDefault();
    const topForm = document.getElementById('search-address');
    if (topForm) {
      const topInput = topForm.querySelector('.input');
      if (topInput) {
        topInput.value = query;
        animateSearch(topInput);
        setNavigationState(true);
        // Let the proxy handler on the top form process the submission
        topForm.requestSubmit();
      }
    }
  } else {
    // For top search form, show navigation state and animation
    animateSearch(input);
    setNavigationState(true);
  }
}

initializeNavGroups();

updateSearchPlaceholders();

const navSearchForm = document.getElementById("nav-search-address");

// Only attach handler to nav form; let proxy handlers run on the top form natively
if (navSearchForm) {
  navSearchForm.addEventListener("submit", handleSearchSubmit);
}

const iframe = document.getElementById("frame") || document.getElementById("sj-frame");
if (iframe) {
  iframe.addEventListener("load", updateSearchPlaceholders);
}
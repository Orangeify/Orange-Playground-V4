"use strict";

const searchForm = document.getElementById("search-address");

function reloadFrame() {
  const iframe = document.getElementById("frame") || document.getElementById("sj-frame");
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
  const iframe = document.getElementById("frame");
  if (iframe) {
    iframe.contentWindow.history.back();
  }
}

function goForward() {
  const iframe = document.getElementById("frame");
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
  const placeholder = currentUrl || "Search...";
  const mainInput = document.getElementById("address");
  const navInput = document.getElementById("nav-address");

  if (mainInput) {
    mainInput.placeholder = placeholder;
  }
  if (navInput) {
    navInput.placeholder = placeholder;
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
  const formTemplate = form?.querySelector('#search-engine')?.value;
  const template = formTemplate || document.querySelector('#search-engine')?.value || "https://www.google.com/search?q=%s";
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

function handleSearchSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const input = form.querySelector('.input');
  if (!input) {
    return;
  }

  const query = input.value.trim();
  if (!query) {
    return;
  }

  animateSearch(input);
  setNavigationState(true);
  const url = resolveSearchUrl(query, form);
  const iframe = document.getElementById("frame") || document.getElementById("sj-frame");
  if (iframe) {
    iframe.setAttribute("src", url);
    updateSearchPlaceholders();
  } else {
    window.location.href = url;
  }
}

initializeNavGroups();

updateSearchPlaceholders();

const navSearchForm = document.getElementById("nav-search-address");
const navSearchInput = document.getElementById("nav-address");

if (searchForm) {
  searchForm.addEventListener("submit", handleSearchSubmit);
}
if (navSearchForm) {
  navSearchForm.addEventListener("submit", handleSearchSubmit);
}

const iframe = document.getElementById("frame") || document.getElementById("sj-frame");
if (iframe) {
  iframe.addEventListener("load", updateSearchPlaceholders);
}
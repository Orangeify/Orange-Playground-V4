"use strict";

const searchForm = document.getElementById("search-address");

function reloadFrame() {
  const iframe = document.getElementById("frame");
  if (iframe) {
    if (iframe.contentWindow && typeof iframe.contentWindow.location.reload === "function") {
      iframe.contentWindow.location.reload();
    } else {
      iframe.src = iframe.src;
    }
  }
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

initializeNavGroups();

if (searchForm) {
  searchForm.addEventListener("submit", () => {
    setNavigationState(true);
  });
}
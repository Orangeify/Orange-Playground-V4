"use strict";

const searchForm = document.getElementById("search-address");

function reloadFrame() {
  const iframe = document.getElementById("frame");
  if (iframe) {
    iframe.src = iframe.src;
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
    mainGroup.classList.remove("nav-group-visible");
    mainGroup.classList.add("nav-group-hidden");
    arrowGroup.classList.remove("nav-group-hidden");
    arrowGroup.classList.add("nav-group-visible");
  } else {
    mainGroup.classList.remove("nav-group-hidden");
    mainGroup.classList.add("nav-group-visible");
    arrowGroup.classList.remove("nav-group-visible");
    arrowGroup.classList.add("nav-group-hidden");
  }
}

initializeNavGroups();

if (searchForm) {
  searchForm.addEventListener("submit", () => {
    setNavigationState(true);
  });
}
"use strict";

const searchForm = document.getElementById("search-address");
const gamesLink = document.querySelector('a[href="worksheets.html"]');
const appsLink = document.querySelector('a[href="assessments.html"]');
const settingsLink = document.querySelector('a[href="study-guides.html"]');
const backButton = document.querySelector('button[onclick="goBack()"]');
const forwardButton = document.querySelector('button[onclick="goForward()"]');
const reloadButton = document.querySelector('button[onclick="reloadFrame()"]');
const navRight = document.querySelector(".nav-right");

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

function createNavGroups() {
  if (!navRight) {
    return;
  }

  let mainGroup = document.querySelector(".nav-group-main");
  let arrowGroup = document.querySelector(".nav-group-arrows");

  if (!mainGroup) {
    mainGroup = document.createElement("div");
    mainGroup.className = "nav-group nav-group-main nav-group-visible";
  }

  if (!arrowGroup) {
    arrowGroup = document.createElement("div");
    arrowGroup.className = "nav-group nav-group-arrows nav-group-hidden";
  }

  if (gamesLink && !mainGroup.contains(gamesLink)) {
    mainGroup.appendChild(gamesLink);
  }

  if (appsLink && !mainGroup.contains(appsLink)) {
    mainGroup.appendChild(appsLink);
  }

  if (settingsLink && !mainGroup.contains(settingsLink)) {
    mainGroup.appendChild(settingsLink);
  }

  if (backButton && !arrowGroup.contains(backButton)) {
    arrowGroup.appendChild(backButton);
  }

  if (forwardButton && !arrowGroup.contains(forwardButton)) {
    arrowGroup.appendChild(forwardButton);
  }

  if (reloadButton && !arrowGroup.contains(reloadButton)) {
    arrowGroup.appendChild(reloadButton);
  }

  if (!mainGroup.parentElement) {
    navRight.appendChild(mainGroup);
  }

  if (!arrowGroup.parentElement) {
    navRight.appendChild(arrowGroup);
  }
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

createNavGroups();

if (searchForm) {
  searchForm.addEventListener("submit", () => {
    setNavigationState(true);
  });
}
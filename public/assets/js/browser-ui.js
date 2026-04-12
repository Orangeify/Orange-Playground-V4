"use strict";

const form = document.getElementById("search-address");
const gamesLink = document.querySelector('a[href="worksheets.html"]');
const appsLink = document.querySelector('a[href="assessments.html"]');
const settingsLink = document.querySelector('a[href="study-guides.html"]');
const backButton = document.querySelector('button[onclick="goBack()"]');
const forwardButton = document.querySelector('button[onclick="goForward()"]');
const reloadButton = document.querySelector('button[onclick="reloadFrame()"]');

let isFrameActive = false;

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

function showNavigationArrows() {
  isFrameActive = true;
  gamesLink.classList.add("nav-hidden");
  appsLink.classList.add("nav-hidden");
  settingsLink.classList.add("nav-hidden");
  backButton.classList.add("nav-visible");
  forwardButton.classList.add("nav-visible");
  reloadButton.classList.add("nav-visible");
}

function hideNavigationArrows() {
  isFrameActive = false;
  gamesLink.classList.remove("nav-hidden");
  appsLink.classList.remove("nav-hidden");
  settingsLink.classList.remove("nav-hidden");
  backButton.classList.remove("nav-visible");
  forwardButton.classList.remove("nav-visible");
  reloadButton.classList.remove("nav-visible");
}

if (form) {
  form.addEventListener("submit", () => {
    setTimeout(showNavigationArrows, 300);
  });
}
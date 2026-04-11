function reloadFrame() {
  iframe.src = iframe.src;
}

function goBack() {
    iframe.contentWindow.history.back();
}

function goForward() {
    iframe.contentWindow.history.forward();
}
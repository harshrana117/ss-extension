console.log("Loaded");

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("captureBtn")
    .addEventListener("click", captureFullPage);
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    files: ["contentScript.js"],
  });
});

function captureFullPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "captureFullPage" },
      function (response) {
        console.log(response);
      }
    );
  });
}

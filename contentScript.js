chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "captureFullPage") {
    captureFullPage();
  }
});

function captureFullPage() {
  chrome.tabs.captureVisibleTab(null, { format: "png" }, function (dataUrl) {
    console.log("dataUrl", dataUrl);
    sendResponse(dataUrl);
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "captureFullPage") {
    captureFullPage();
  }
});

function captureFullPage() {
  console.log("Hello");
}

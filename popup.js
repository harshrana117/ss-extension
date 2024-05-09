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

let captureInProgress = false;

async function captureScreenshot() {
  if (captureInProgress) return;

  captureInProgress = true;

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0]?.id, { action: "start-capture" });

    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        files: ["./get-info-and-scroll-top.js"],
      },
      function (results) {
        console.log("results", results);
      }
    );
  });
}

let counter = 0;

function log() {
  counter++;
  if (counter == 10) {
    clearInterval(intervalId);
    console.log("Function stopped after 10 iterations");
  }
  console.log("Harsh Rana");
}

function captureFullPage() {
  // counter++;
  // if (counter == 10) {
  //   clearInterval(intervalId);
  //   console.log("Function stopped after 10 iterations");
  // }
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    // chrome.scripting.executeScript(
    //   {
    //     target: { tabId: tabs[0].id },
    //     function: () => {
    //       chrome.tabs.captureVisibleTab(
    //         null,
    //         { format: "png" },
    //         function (dataUrl) {
    //           console.log("dataUrl", dataUrl);
    //           return dataUrl;
    //         }
    //       );
    //     },
    //   },
    //   function (dataUrl) {
    //     console.log("finished");
    //     console.log(dataUrl);
    //   }
    // );/
    chrome.tabs.captureVisibleTab(
      tab.windowId,
      { format: "png" },
      function (dataUrl) {
        console.log(dataUrl);
        if (chrome.runtime.lastError) {
          console.error(
            "Error capturing tab",
            chrome.runtime.lastError.message
          );
        } else {
          saveScreenshot(dataUrl);
          // console.log("Success");
          // var hiddenElement = document.createElement("a");
          // hiddenElement.target = "_blank";
          // hiddenElement.download = "screenshot.png";
          // hiddenElement.style.display = "none";
          // document.body.appendChild(hiddenElement);
          // hiddenElement.click();
          // document.body.removeChild(hiddenElement);/

          // chrome.tabs.create({ url: "blank.html" }, function (newTab) {
          //   chrome.tabs.executeScript(newTab.id, {
          //     code: `
          //     document.createElement('html')
          //     document.createElement('body')

          //       var imageData = ${JSON.stringify(screenshots)};
          //       var img = document.createElement('img');
          //       img.src = imageData;
          //       document.body.appendChild(img);
          //     `,
          //   });
          // });
        }
      }
    );
  });
}

async function msaveScreenshot(dataUrl) {
  try {
    const handle = await window.showSaveFilePicker();
    const writableStream = await handle.createWritable();
    const response = await fetch(dataUrl);
    await response.body.pipeTo(writableStream);
    await writableStream.close();
    console.log("Screenshot saved successfully!");
  } catch (error) {
    console.error("Error saving screenshot:", error);
  }
}

// const intervalId = setInterval(captureFullPage, 520);

// chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
//   if (message.action === "download" && message.url) {
//     chrome.downloads.download({
//       filename: "screenshot.png",
//       url: message.url,
//       saveAs: true
//     }, (downloadId) => {
//       console.log("Screenshot download initiated. Download ID:", downloadId);
//       senderResponse({ success: true });
//     });
//     return true;
//   }
// });
// }

// function screenCapture(message) {
//   let track, canvas
//   navigator.mediaDevices.getUserMedia({
//       video: {
//           mandatory: {
//               chromeMediaSource: 'desktop',
//               chromeMediaSourceId: message.streamId
//           },
//       }
//   }).then((stream) => {
//       track = stream.getVideoTracks()[0]
//       const imageCapture = new ImageCapture(track)
//       return imageCapture.grabFrame()
//   }).then((bitmap) => {
//       track.stop()
//       canvas = document.createElement('canvas');
//       canvas.width = bitmap.width;
//       canvas.height = bitmap.height;
//       let context = canvas.getContext('2d');
//       context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height)
//       return canvas.toDataURL();
//   }).then((url) => {
//       chrome.runtime.sendMessage({action: 'download', url}, (response) => {
//           if (response.success) {
//               alert("Screenshot saved");
//           } else {
//               alert("Could not save screenshot")
//           }
//           canvas.remove()
//           senderResponse({success: true})
//       })
//   }).catch((err) => {
//       alert("Could not take screenshot")
//       senderResponse({success: false, message: err})
//   })
//   return true;
// }

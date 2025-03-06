function bypass() {
  let chuoi = document.querySelectorAll('.mt-radio');
  for (let i = 0; i < chuoi.length; i++) {
    if (chuoi[i].innerText.includes('C.')) {
      chuoi[i].click();
    }
  }
  document.querySelector('.input-ykien').value = 'Không';
  document.querySelector('.btn_submit_boxes').click();
}

// function getLinks() {
//   let surveyLinks = [];
//   let length = document.evaluate('//div[@id="tab_daks"]/div[1]/div/div', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
//   for (let i = 0; i < length; i++) {
//     let survey = document.evaluate('//*[@id="tab_daks"]/div[1]/div/div[1]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//     if (survey) {
//       surveyLinks.push(survey.href);
//     }
//   }
//   return surveyLinks;
// }

// function openSurveyTabs() {
//   surveyLinks.forEach(url => {
//     // Mở tab mới dưới nền (active: false)
//     chrome.tabs.create({ url: surveyLinks[0], active: true }, (tab) => {
//       // Lắng nghe sự kiện onUpdated để biết khi nào tab tải xong
//       chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
//         if (tabId === tab.id && changeInfo.status === 'complete') {
//           // Khi tab tải xong, chèn và thực thi hàm bypass
//           chrome.scripting.executeScript({
//             target: { tabId: tab.id },
//             function: function() {
//               bypass();
//             }
//           }, () => {
//             // Sau khi chạy bypass, đợi một khoảng (1 giây) rồi đóng tab
//             setTimeout(() => {
//               chrome.tabs.remove(tab.id);
//             }, 1000);
//           });
//           // Xóa listener để không bị gọi lại nhiều lần
//           chrome.tabs.onUpdated.removeListener(listener);
//         }
//       });
//     });
//   });
// }

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btnSurvey').addEventListener('click', function() {
    // Lấy tab đang hoạt động và gửi message đến content script của tab đó
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "bypass" });
    });
  });
  // document.getElementById('btnSurveyAuto').addEventListener('click', function() {
  //   // Lấy tab đang hoạt động và gửi message đến content script của tab đó
  //   chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  //     chrome.tabs.sendMessage(tabs[0].id, { action: "bypassAuto" });
  //   });
  //   openSurveyTabs();
  // });
});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "bypass") {
    bypass();
  }
  // if (request.action === "bypassAuto") {
  //   getLinks();
  // }
});

// document.addEventListener('DOMContentLoaded', function() {
//   document.getElementById('btnSurveyAuto').addEventListener('click', function() {
//   // Lấy tab hiện tại
//   chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//     let activeTab = tabs[0];
//     // Thực thi hàm getLinks trong ngữ cảnh của tab hiện tại
//     chrome.scripting.executeScript({
//       target: { tabId: activeTab.id },
//       func: getLinks  // đảm bảo hàm getLinks được định nghĩa ở content script hoặc được inject cùng với mã này
//     }, (links) => {
//       if (links && links.length > 0) {
//           console.log(links);
//       } else {
//         console.log("Không tìm thấy link khảo sát.");
//       }
//       // if (surveyLinks && surveyLinks.length > 0) {
//       //   // Với các link thu được, mở tab mới và thực thi bypass
//       //   surveyLinks.forEach(url => {
//       //     chrome.tabs.create({ url: url, active: false }, (tab) => {
//       //       // Lắng nghe khi tab tải xong
//       //       chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
//       //         if (tabId === tab.id && changeInfo.status === 'complete') {
//       //           // Chạy hàm bypass trong tab đó
//       //           chrome.scripting.executeScript({
//       //             target: { tabId: tab.id },
//       //             func: bypass  // đảm bảo hàm bypass được định nghĩa và có thể gọi được
//       //           }, () => {
//       //             // Sau khi chạy bypass, đợi 1 giây rồi đóng tab
//       //             setTimeout(() => {
//       //               chrome.tabs.remove(tab.id);
//       //             }, 1000);
//       //           });
//       //           // Gỡ bỏ listener để không bị gọi lại nhiều lần
//       //           chrome.tabs.onUpdated.removeListener(listener);
//       //         }
//       //       });
//       //     });
//       //   });
//       // } else {
//       //   console.log("Không tìm thấy link khảo sát.");
//       // }
//     });
//   });
// });
// });
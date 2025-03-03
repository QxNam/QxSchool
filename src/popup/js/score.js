// checkbox
document.addEventListener("DOMContentLoaded", function() {
  const toggleCheckbox = document.getElementById("toggle-checkbox");
  if (!toggleCheckbox) return; // Nếu không tìm thấy checkbox thì dừng lại

  // Đọc trạng thái đã lưu từ chrome.storage.sync (mặc định là false)
  chrome.storage.sync.get(["extensionEnabled"], function(result) {
    const enabled = result.extensionEnabled || false;
    toggleCheckbox.checked = enabled;
    toggleCheckbox.setAttribute("data-state", enabled ? "on" : "off");
  });

  // Lắng nghe sự kiện thay đổi của checkbox
  toggleCheckbox.addEventListener("change", function() {
    const enabled = toggleCheckbox.checked;
    toggleCheckbox.setAttribute("data-state", enabled ? "on" : "off");

    // Gửi message đến content script (score.js) đang chạy trên tab hiện hành
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs && tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggle", enabled: enabled });
      }
    });

    // Lưu trạng thái vào chrome.storage.sync để khi đóng mở popup vẫn giữ nguyên
    chrome.storage.sync.set({ extensionEnabled: enabled });
  });
});


// Hàm trợ giúp lấy phần tử theo XPath
function getElementByXPath(xpath) {
  return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

// Global variable để lưu thông tin của phần tử bị xóa nhằm khôi phục sau này
var removedElementData = null;

// Hàm áp dụng các thay đổi CSS và xóa phần tử
function applyModifications() {
  // 1. //*[@id="xemDiem_aaa_wrapper"]/div/div[2]/div[2] - Bỏ attribute max-height
  const el1 = getElementByXPath('//*[@id="xemDiem_aaa_wrapper"]/div/div[2]/div[2]');
  if (el1) {
    if (!el1.dataset.originalMaxHeight) {
      el1.dataset.originalMaxHeight = el1.style.maxHeight;
    }
    el1.style.maxHeight = '';
  }

  // 2. //*[@id="xemDiem_aaa_wrapper"]/div - Bỏ attribute height
  const el2 = getElementByXPath('//*[@id="xemDiem_aaa_wrapper"]/div');
  if (el2) {
    if (!el2.dataset.originalHeight) {
      el2.dataset.originalHeight = el2.style.height;
    }
    el2.style.height = '';
  }

  // 3. //*[@id="xemDiem_aaa_wrapper"]/div/div[3]/div[2] - Bỏ attribute height nếu bằng 400px
  const el3 = getElementByXPath('//*[@id="xemDiem_aaa_wrapper"]/div/div[3]/div[2]');
  if (el3) {
    if (!el3.dataset.originalHeight) {
      el3.dataset.originalHeight = el3.style.height;
    }
    el3.style.height = '';
  }

  // 4. //*[@id="xemDiem_aaa_wrapper"]/div/div[3]/div[2]/div - Bỏ attribute height nếu bằng 400px
  const el4 = getElementByXPath('//*[@id="xemDiem_aaa_wrapper"]/div/div[3]/div[2]/div');
  if (el4) {
    if (!el4.dataset.originalHeight) {
      el4.dataset.originalHeight = el4.style.height;
    }
    el4.style.height = '';
  }

  // 5. //*[@id="xemDiem_aaa_wrapper"]/div/div[3] - Thay đổi position từ absolute thành relative
  const el5 = getElementByXPath('//*[@id="xemDiem_aaa_wrapper"]/div/div[3]');
  if (el5) {
    if (!el5.dataset.originalPosition) {
      el5.dataset.originalPosition = el5.style.position;
    }
    if (el5.style.position === 'absolute') {
      el5.style.position = 'relative';
    }
  }

  // // 6 //*[@id="xemDiem_aaa_wrapper"]/div/div[2]/div[1] - Thay đổi width: 100% thành width: 120%
  // const el6 = getElementByXPath('//*[@id="xemDiem_aaa_wrapper"]/div/div[2]/div[1]');
  // if (el6) {
  //   if (!el6.dataset.originalWidth) {
  //     el6.dataset.originalWidth = el6.style.width;
  //   }
  //   el6.style.width = '120%';
  // }

  // 7. Xóa thẻ theo XPath: //*[@id="xemDiem_aaa_wrapper"]/div/div[3]
  // Nếu phần tử tồn tại và chưa được xóa, lưu lại thông tin để khôi phục sau này
  const elToRemove = getElementByXPath('//*[@id="xemDiem_aaa_wrapper"]/div/div[3]');
  if (elToRemove && !removedElementData) {
    removedElementData = {
      element: elToRemove,
      parent: elToRemove.parentNode,
      nextSibling: elToRemove.nextSibling
    };
    elToRemove.remove();
  }
}

// Hàm hoàn tác các thay đổi CSS và khôi phục phần tử đã xóa
function revertModifications() {
  // 1. Khôi phục thuộc tính max-height cho el1
  const el1 = getElementByXPath('//*[@id="xemDiem_aaa_wrapper"]/div/div[2]/div[2]');
  if (el1 && typeof el1.dataset.originalMaxHeight !== 'undefined') {
    el1.style.maxHeight = el1.dataset.originalMaxHeight;
    delete el1.dataset.originalMaxHeight;
  }

  // 2. Khôi phục thuộc tính height cho el2
  const el2 = getElementByXPath('//*[@id="xemDiem_aaa_wrapper"]/div');
  if (el2 && typeof el2.dataset.originalHeight !== 'undefined') {
    el2.style.height = el2.dataset.originalHeight;
    delete el2.dataset.originalHeight;
  }

  // 3. Khôi phục thuộc tính height cho el3
  const el3 = getElementByXPath('//*[@id="xemDiem_aaa_wrapper"]/div/div[3]/div[2]');
  if (el3 && typeof el3.dataset.originalHeight !== 'undefined') {
    el3.style.height = el3.dataset.originalHeight;
    delete el3.dataset.originalHeight;
  }

  // 4. Khôi phục thuộc tính height cho el4
  const el4 = getElementByXPath('//*[@id="xemDiem_aaa_wrapper"]/div/div[3]/div[2]/div');
  if (el4 && typeof el4.dataset.originalHeight !== 'undefined') {
    el4.style.height = el4.dataset.originalHeight;
    delete el4.dataset.originalHeight;
  }

  // 5. Khôi phục thuộc tính position cho el5
  const el5 = getElementByXPath('//*[@id="xemDiem_aaa_wrapper"]/div/div[3]');
  if (el5 && typeof el5.dataset.originalPosition !== 'undefined') {
    el5.style.position = el5.dataset.originalPosition;
    delete el5.dataset.originalPosition;
  }

  // 7. Khôi phục phần tử đã xóa (nếu có)
  // if (removedElementData && removedElementData.parent) {
  //   if (removedElementData.nextSibling) {
  //     removedElementData.parent.insertBefore(removedElementData.element, removedElementData.nextSibling);
  //   } else {
  //     removedElementData.parent.appendChild(removedElementData.element);
  //   }
  //   removedElementData = null;
  // }
}


// Kiểm tra trạng thái khi trang tải
chrome.storage.sync.get(['extensionEnabled'], function(result) {
  if (result.extensionEnabled) {
    applyModifications();
  }
});

// Lắng nghe message từ popup để bật/tắt thay đổi
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'toggle') {
    if (request.enabled) {
      applyModifications();
    } else {
      revertModifications();
    }
  }
});

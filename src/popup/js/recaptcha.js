function copyTextToClipboard(text) {
    // Nếu trình duyệt hỗ trợ Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => {
          console.log("Copy thành công: " + text);
        })
        .catch(err => {
          console.error("Lỗi khi copy: ", err);
        });
    } else {
      // Fallback: sử dụng phương thức execCommand (có thể không hoạt động trên tất cả trình duyệt)
      const textArea = document.createElement("textarea");
      textArea.value = text;
      
      // Ẩn textarea khỏi giao diện người dùng
      textArea.style.position = "fixed";
      textArea.style.top = "-9999px";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      
      textArea.focus();
      textArea.select();
  
      try {
        const successful = document.execCommand("copy");
        console.log(successful ? "Copy thành công (fallback): " + text : "Không copy được (fallback)");
      } catch (err) {
        console.error("Lỗi khi sử dụng fallback copy: ", err);
      }
      
      document.body.removeChild(textArea);
    }
}
  

// ------------------ process
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
    // applyModifications();
    copyTextToClipboard("123");
    } else {
    revertModifications();
    
    }
}
});
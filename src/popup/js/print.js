document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('printBtn').addEventListener('click', function() {
    // Lấy tab đang hoạt động và gửi message đến content script của tab đó
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "printPage" });
    });
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "printPage") {
    // 1. Lưu trữ thông tin ban đầu của header và thêm style "position:sticky"
    var header = document.evaluate('/html/body/div[2]/header', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var originalHeaderStyle = "";
    if (header) {
      originalHeaderStyle = header.getAttribute("style") || "";
      header.style.position = "sticky";
    }

    // 2. Lưu trữ giá trị của thuộc tính href và xóa thuộc tính href theo xpath cho phần tử <a>
    var linkElem = document.evaluate('/html/body/div[2]/header/div/div/div[1]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var originalHref = "";
    if (linkElem) {
      originalHref = linkElem.getAttribute("href");
      linkElem.removeAttribute("href");
    }

    // 3. Xóa các thẻ theo các xpath được chỉ định và lưu trữ để phục hồi sau in
    var xpaths = [
      '/html/body/div[2]/header/div/div/div[2]',
    ];
    var removedElements = [];
    xpaths.forEach(function(xpath) {
      var elem = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (elem && elem.parentNode) {
        // Lưu trữ thông tin của phần tử bị xóa để phục hồi sau này
        removedElements.push({
          element: elem,
          parent: elem.parentNode,
          nextSibling: elem.nextSibling
        });
        elem.parentNode.removeChild(elem);
      }
    });

    // Sau khi in xong, phục hồi lại các thay đổi ban đầu
    window.onafterprint = function() {
      // Phục hồi lại style của header
      if (header) {
        header.setAttribute("style", originalHeaderStyle);
      }
      // Phục hồi lại thuộc tính href cho phần tử <a>
      if (linkElem && originalHref !== null) {
        linkElem.setAttribute("href", originalHref);
      }
      // Phục hồi các thẻ đã xóa
      removedElements.forEach(function(item) {
        if (item.nextSibling) {
          item.parent.insertBefore(item.element, item.nextSibling);
        } else {
          item.parent.appendChild(item.element);
        }
      });
      // Xóa bỏ handler onafterprint sau khi phục hồi xong
      window.onafterprint = null;
    };

    // Sau khi áp dụng các thay đổi, gọi hàm in
    window.print();
  }
});


document.addEventListener("DOMContentLoaded", function() {
  const tabs = document.querySelectorAll(".tab");
  const iframe = document.getElementById("contentFrame");

  // Hàm kích hoạt tab: xóa active, set active, cập nhật iframe và lưu vào localStorage
  function activateTab(tab) {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    const file = tab.getAttribute("data-tab");
    iframe.src = "tabs/" + file;
    // Lưu tên file của tab vào localStorage để ghi nhớ tab đã chọn
    localStorage.setItem("activeTab", file);
  }

  // Kiểm tra xem có tab nào được lưu lại không
  const storedTab = localStorage.getItem("activeTab");
  let tabFound = false;
  if (storedTab) {
    tabs.forEach(tab => {
      if (tab.getAttribute("data-tab") === storedTab) {
        activateTab(tab);
        tabFound = true;
      }
    });
  }

  // Nếu không có tab nào được lưu hoặc không tìm thấy, mặc định chọn tab đầu tiên
  if (!tabFound && tabs.length > 0) {
    activateTab(tabs[0]);
  }

  // Gán sự kiện click cho các tab
  tabs.forEach(tab => {
    tab.addEventListener("click", function() {
      activateTab(tab);
    });
  });
});

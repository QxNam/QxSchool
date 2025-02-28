document.addEventListener("DOMContentLoaded", function() {
  // Lấy danh sách các tab và iframe hiển thị nội dung
  const tabs = document.querySelectorAll(".tab");
  const iframe = document.getElementById("contentFrame");

  // Lặp qua từng tab để gán sự kiện click
  tabs.forEach(tab => {
    tab.addEventListener("click", function() {
      // Xóa class active khỏi tất cả các tab
      tabs.forEach(t => t.classList.remove("active"));

      // Thêm class active cho tab được click
      tab.classList.add("active");

      // Lấy tên file từ thuộc tính data-tab (ví dụ: "score.html", "survey.html", "other.html")
      const file = tab.getAttribute("data-tab");

      // Cập nhật đường dẫn cho iframe, giả sử các file HTML nằm trong thư mục "tabs"
      iframe.src = "tabs/" + file;
    });
  });
});
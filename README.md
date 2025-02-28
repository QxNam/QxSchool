# QxSchool - IUH Extension
---
QxSchool là một extension dành cho sinh viên Trường Đại học Công nghiệp TP.HCM (IUH), giúp quản lý và truy xuất thông tin bảng điểm trực tuyến. Extension này hỗ trợ sinh viên theo dõi điểm số, tính toán điểm trung bình học kỳ và tích lũy, cùng với các tính năng như chỉnh sửa trực tiếp thông tin bảng điểm và xuất kết quả ra file PDF.

## Các tính năng chính
1. Cho phép sinh viên xem bảng điểm rộng hết màn hình.
2. Hỗ trợ kiểm tra điểm ngay trên trang trường để có kế hoạch học tập phù hợp.
3. Cung cấp tính năng in bảng điểm đầy đủ khi bật tính năng hiển thị đầy đủ.
4. Hỗ trợ làm khảo sát nhanh.
5. Hỗ trợ điền captcha khi đăng nhập. [đang phát triển]

## Cài đặt
Cài đặt Extension vào Chrome
- Tải mã nguồn extension về máy.
- Mở Chrome và nhập `chrome://extensions/` vào thanh địa chỉ.
- Bật "Developer mode" (Chế độ nhà phát triển) ở góc trên bên phải.
- Chọn "Load unpacked" và chọn thư mục chứa mã nguồn của extension.

## Các quyền cần thiết
- tabs: Để mở tab mới và điều khiển thông tin trên các tab của trình duyệt.
- storage: Để lưu trạng thái và dữ liệu chỉnh sửa của người dùng.

## Các tệp trong dự án
- index.html: Giao diện chính của extension, bao gồm các tab để chọn bảng điểm, khảo sát và các tính năng khác.
- score.html: Giao diện chi tiết cho bảng điểm, nơi sinh viên có thể xem và chỉnh sửa thông tin điểm.
- mod.js: JavaScript xử lý việc cho phép hoặc không cho phép chỉnh sửa bảng điểm.
- menu.js: Xử lý trạng thái của checkbox "Enable Editing" và gửi message tới các tab khi bật/tắt chế độ chỉnh sửa.
- print.js: Xử lý chức năng in bảng điểm dưới dạng PDF.
- score.js: Các hàm và logic tính toán điểm cho bảng điểm và xếp loại học lực.
- manifest.json: Cấu hình cho extension (quyền, scripts, và các thông tin khác).

## Ví dụ sử dụng:
1. Sửa điểm
- Mở bảng điểm trong extension.
- Chọn ô điểm bạn muốn sửa, nhập giá trị mới và nhấn Enter hoặc bỏ focus khỏi ô. 
- Điểm sẽ được tự động cập nhật vào bảng và các tính toán liên quan sẽ được thực hiện ngay lập tức.

2. In bảng điểm
- Sau khi chỉnh sửa điểm xong, bạn có thể nhấn nút "Print" để in bảng điểm. 
- Header chỉ hiển thị ở trang đầu khi in. 
- Khi in nên co về cỡ 38-40. More settings > Scale > Custom [40].

3. Làm khảo sát nhanh
- Vào trong khảo sát.
- Mở popup lên và ấn nút.
[Mình sẽ cập nhật tính năng tự động làm các khảo sát mà không cần vào trang khảo sát sau.]

## Cảm ơn
Cảm ơn bạn đã sử dụng QxSchool! Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với đội ngũ phát triển hoặc gửi phản hồi qua các kênh hỗ trợ.

[mail] quachnam311@gmail.com
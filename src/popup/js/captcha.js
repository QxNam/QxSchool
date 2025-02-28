async function saveImageToMemory(imageUrl) {
    try {
        // Tải hình ảnh dưới dạng Blob
        const response = await fetch(imageUrl);
        const imageBlob = await response.blob();

        // Tạo URL tạm thời từ Blob
        const imageObjectURL = URL.createObjectURL(imageBlob);

        // Lưu URL vào biến tạm
        let temporaryImage = imageObjectURL;

        console.log('Image saved in temporary memory:', temporaryImage);

        // Xử lý ảnh (ví dụ: hiển thị nó trong thẻ <img>)
        let img = document.createElement('img');
        img.src = temporaryImage;
        document.body.appendChild(img);

        // Sau khi xử lý, giải phóng bộ nhớ (free)
        freeImageMemory(temporaryImage);

    } catch (error) {
        console.error('Error loading image:', error);
    }
}

// Hàm để giải phóng bộ nhớ
function freeImageMemory(imageURL) {
    // Giải phóng URL tạm thời
    URL.revokeObjectURL(imageURL);
    console.log('Image memory freed');
}


function saveImage() {
    // Lấy phần tử hình ảnh theo XPath
    let imageElement = document.evaluate('//*[@id="newcaptcha"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    // Kiểm tra xem hình ảnh có tồn tại hay không
    if (imageElement) {
        // Lấy URL hình ảnh từ thuộc tính src
        let imageUrl = imageElement.src;

        // Tạo một liên kết tải xuống tệp
        let link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'captcha-image.png';  // Tên tệp khi tải xuống
        link.click();  // Kích hoạt tải xuống
    } else {
        console.log('Không tìm thấy hình ảnh.');
    }
}
//*[@id="xemDiem_aaa"]/tbody/tr[5]/td[15]
//*[@id="xemDiem_aaa_wrapper"]/div/div[2]/div[1]/div/table/thead/tr[3]/th[9]

// Lặp từ cột 19 xuống cột 7 để tránh thay đổi chỉ số khi xóa phần tử
for (var i = 15; i >= 7; i--) {
    var xpathTr = '//*[@id="xemDiem_aaa"]/tbody/tr';
    var rows = document.evaluate(xpathTr, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var total = 0;
    
    // Duyệt qua từng hàng để tính tổng giá trị của ô td thứ i
    for (var j = 0; j < rows.snapshotLength; j++) {
        var row = rows.snapshotItem(j);
        var xpathTd = './td[' + i + ']';
        var cell = document.evaluate(xpathTd, row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (cell) {
            // Chuyển đổi nội dung (loại bỏ khoảng trắng, thay dấu phẩy thành dấu chấm)
            var value = parseFloat(cell.textContent.trim().replace(",", "."));
            if (!isNaN(value)) {
                total += value;
            }
        }
    }
    
    // Nếu tổng bằng 0, xóa cột đó trong tbody và header tương ứng
    if (total === 0) {
        var headerXpath = '//*[@id="xemDiem_aaa_wrapper"]/div/div[2]/div[1]/div/table/thead/tr[3]/th[' + (i - 6) + ']';
        var headerCell = document.evaluate(headerXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (headerCell) {
            headerCell.parentNode.removeChild(headerCell);
        }

        // // Xóa ô td thứ i ở mỗi hàng
        // for (var j = 0; j < rows.snapshotLength; j++) {
        //     var row = rows.snapshotItem(j);
        //     var xpathTd = './td[' + i + ']';
        //     var cell = document.evaluate(xpathTd, row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        //     if (cell) {
        //         cell.parentNode.removeChild(cell);
        //     }
        // }
        
    }
    else {
        break;
    }
}


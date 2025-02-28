// Biến toàn cục kiểm soát việc cho phép chỉnh sửa
let editingEnabled = false;
const color = {
  "B": "lightblue",
  "R": "Salmon",
  "Y": "Gold",
  "G": "lightgreen",
  "W": "white",
  "AB": "AliceBlue"
}
const charScore = {
  "A+": 4,
  "A": 3.8,
  "B+": 3.5,
  "B": 3,
  "C+": 2.5,
  "C": 2,
  "D+": 1.5,
  "D": 1,
  "F": 0
}
const rank = {
  "A+": "Xuất sắc 🥳",
  "A": "Giỏi 🫡",
  "B+": "Khá 😏",
  "B": "Khá 🤣",
  "C+": "Trung bình 😚",
  "C": "Trung bình 🤫",
  "D+": "Trung bình yếu 🥲",
  "D": "Trung bình kém 😰",
  "F": "Kém 😱"
}

let lastScore = {
  "tbtl_4": 0,
  "tbtl_10": 0,
  "ttc": 0,
  "ttctl": 0
}

document.addEventListener("DOMContentLoaded", function() {
  const modCheckbox = document.getElementById("mod-checkbox");
  if (!modCheckbox) return;

  // Đọc trạng thái đã lưu (mặc định false)
  chrome.storage.sync.get(["modifyEnabled"], function(result) {
    const enabled = result.modifyEnabled || false;
    modCheckbox.checked = enabled;
  });

  // Khi checkbox thay đổi, gửi message tới content script (mod.js) trong tab hiện hành
  modCheckbox.addEventListener("change", function() {
    const enabled = modCheckbox.checked;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs && tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggleModify", enabled: enabled });
      }
    });
    // Lưu trạng thái mới vào chrome.storage.sync
    chrome.storage.sync.set({ modifyEnabled: enabled });
  });
});

function checkXPath(xpath) {
  const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  const node = result.singleNodeValue;
  return node !== null;
}

function getXPath(element) {
  if (element.id) {
    return `id("${element.id}")`;
  }
  
  // Xử lý phần tử gốc
  if (element === document.documentElement) {
    return "/html";
  }

  let path = [];
  while (element && element.nodeType === Node.ELEMENT_NODE) {
    let index = Array.from(element.parentNode.children).indexOf(element) + 1;
    // let tagName = element.tagName.toLowerCase();
    // // Tạo phần tử XPath cho mỗi cấp (thêm số chỉ mục nếu cần)
    // path.unshift(`${tagName}[${index}]`);
    // path.unshift(`${index}`);
    path.unshift(index);
    element = element.parentNode;
  }

  return path.slice(-2);
}

function getScore(row, col) {
  // Sử dụng document.evaluate để lấy phần tử từ XPath
  const result = document.evaluate(`//*[@id="xemDiem_aaa"]/tbody/tr[${row}]/td[${col}]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  const node = result.singleNodeValue;

  // Kiểm tra xem phần tử có tồn tại hay không
  if (node && node.innerText.trim() !== "") {
    // Chuyển giá trị của innerText thành số thực
    const value = parseFloat(node.innerText);

    // Kiểm tra nếu giá trị có thể chuyển thành số thực hợp lệ
    if (!isNaN(value)) {
      return value;
    } else {
      return null;  // Trả về null nếu giá trị không hợp lệ
    }
  } else {
    return null;  // Trả về null nếu không tìm thấy phần tử hoặc giá trị rỗng
  }
}

function getValue(xpath) {
  const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  const node = result.singleNodeValue;

  // Kiểm tra xem phần tử có tồn tại hay không
  if (node && node.innerText.trim() !== "") {
    // Chuyển giá trị của innerText thành số thực
    const value = parseFloat(node.innerText.replace(',', '.'));

    // Kiểm tra nếu giá trị có thể chuyển thành số thực hợp lệ
    if (!isNaN(value)) {
      return value;
    } else {
      return null;  // Trả về null nếu giá trị không hợp lệ
    }
  } else {
    return null;  // Trả về null nếu không tìm thấy phần tử hoặc giá trị rỗng
  }
}

function getStr(xpath) {
  const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  const node = result.singleNodeValue;

  // Kiểm tra xem phần tử có tồn tại hay không
  if (node && node.innerText.trim()!== "") {
    return node.innerText.trim();
  } else {
    return null;  // Trả về null nếu không tìm thấy phần tử hoặc giá trị r��ng
  }
}

function avg_score(row, start=7, end=15) {
  let sum = 0;
  let count = 0;

  for (let i = start; i <= end; i++) {
    score = getScore(row, i);
    if (score !== null) {
      sum += score;
      count++;
    }
  }

  return [count > 0, count > 0 ? sum / count : 0];
}

function cvt_10_char(s){
  if (s < 4) return ["F", "R"];
  else if (s < 5) return ["D", "Y"];
  else if (s < 5.5) return ["D+", "Y"];
  else if (s < 6) return ["C", "Y"];
  else if (s < 7) return ["C+", "Y"];
  else if (s < 8) return ["B", "G"];
  else if (s < 8.5) return ["B+", "G"];
  else if (s < 9) return ["A", "G"];
  else return ["A+", "G"];
}

function cvt_10_tl(s) {
  if (s < 4) return "Kém 😱";
  else if (s < 5) return "Trung bình yếu 😰";
  else if (s < 6.5) return "Trung bình 😚";
  else if (s < 7.5) return `Khá 😏
  Bạn đã rất cố gắng rồi 🚩`;
  else if (s < 9) return `Giỏi 🫡
  May mà có 💰💰`;
  else return `Xuất sắc 🥳
  XIN NHẸ CÁI HỌC BỔNG 💰💰`;
}

function caculateScore(row) {
  // Tính điểm trung bình cộng
  const avg_tk = avg_score(row, 7, 15);
  const avg_th = avg_score(row, 16, 20);

  // điểm giữa kỳ
  let temp = getScore(row, 5)
  const gk = temp !== null ? temp : 0;
  // điểm cuối kỳ
  temp = getScore(row, 21)
  const ck = temp !== null ? temp : 0;
  // tín chỉ
  const tc = getValue(`//*[@id="xemDiem_aaa"]/tbody/tr[${row}]/td[4]/div`);
  const tclt = avg_th[0]==true ? Math.ceil(tc/2) : tc;
  // tổng kết học phần lý thuyết
  let tkhp_lt = avg_tk[1] * 0.2 + gk * 0.3 + ck * 0.5;
  if (avg_th[0]==false && avg_tk[0]==false) {
    tkhp_lt = ck
  }
  // tổng kết học phần tích hợp
  const tkhp = (tkhp_lt * tclt + avg_th[1] * (tc - tclt)) / tc;
  return tkhp;
}

function getCK() {
  let res = [];
  let rows = document.evaluate('//*[@id="xemDiem_aaa"]/tbody/tr', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (let i = 0; i < rows.snapshotLength; i++) {
    if (getScore(i, 21) === null) {
      res.push((i+1));
    }
  }
  return res;
}

function getScoreCurrent(init=true) {
  // xpath = `//*[@id="xemDiem_aaa"]/tbody/tr[${row}]/td[1]/span[1]`
  // Lấy tất cả các thẻ tr trong tbody của bảng
  const rows = document.evaluate('//*[@id="xemDiem_aaa"]/tbody/tr', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  let n = rows.snapshotLength - 1;
  check = false;
  if (!init) {
    n -= 4; // bỏ 4 hàng cuối
  }

  for (let i=n; i >= 0; i--) {
    if (checkXPath(`//*[@id="xemDiem_aaa"]/tbody/tr[${i}]/td[1]/span[1]`)) {
      check = true;
      let term = getStr(`//*[@id="xemDiem_aaa"]/tbody/tr[${i}]/td[1]/span[1]`);
      if (term === "Điểm trung bình tích lũy:") {
        // tbtl_10 = getValue(`//*[@id="xemDiem_aaa"]/tbody/tr[${i}]/td[1]/span[2]`)
        // tbtl_4 = getValue(`//*[@id="xemDiem_aaa"]/tbody/tr[${i}]/td[2]/span[2]`)
        lastScore['tbtl_10'] = getValue(`//*[@id="xemDiem_aaa"]/tbody/tr[${i}]/td[1]/span[2]`);
        lastScore['tbtl_4'] = getValue(`//*[@id="xemDiem_aaa"]/tbody/tr[${i}]/td[2]/span[2]`);
      }
      else if (term === "Tổng số tín chỉ đã đăng ký:") {
        // ttc = getValue(`//*[@id="xemDiem_aaa"]/tbody/tr[${i}]/td[1]/span[2]`)
        lastScore['ttc'] = getValue(`//*[@id="xemDiem_aaa"]/tbody/tr[${i}]/td[1]/span[2]`);
        lastScore['ttctl'] = getValue(`//*[@id="xemDiem_aaa"]/tbody/tr[${i}]/td[2]/span[2]`);
      }
    }
    else {
      if (check === true) {
        return i+1;
      }
    }
  }
}

function updateNewScore() {
  const rows = document.evaluate('//*[@id="xemDiem_aaa"]/tbody/tr', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  startIndex = getScoreCurrent(init=false)+6;
  endIndex = rows.snapshotLength - 4;
  // tinh diem
  let tbhk_10 = 0;
  let tbhk_4 = 0;
  let tbtl_10 = lastScore['tbtl_10'];
  let tbtl_4 = lastScore['tbtl_4'];
  let ttc = 0;
  let ttc_cur = 0;
  let total_score = 0.0;
  for (let i = startIndex; i <= endIndex; i++) {
    const tc = getValue(`//*[@id="xemDiem_aaa"]/tbody/tr[${i}]/td[4]/div`);
    const score = getScore(i, 22);
    if (score !== null) {
      total_score += score*tc;
      ttc_cur += tc;
    }
    ttc += tc;
  }
  if (ttc_cur > 0){
    tbhk_10 = total_score / ttc_cur;
    tbtl_10 = (tbhk_10 * ttc_cur + lastScore['tbtl_10'] * lastScore['ttctl']) / (ttc_cur + lastScore['ttc']);
    
    tbhk_4 = tbhk_10*0.4;
    tbtl_4 = (tbhk_4 * ttc_cur + lastScore['tbtl_4'] * lastScore['ttctl']) / (ttc_cur + lastScore['ttc']);
  }
  // cập nhật
  let n = rows.snapshotLength;
  // Cập nhật điểm 10, điểm 4, điểm chữ, xếp loại và ghi chú trong bảng
  let target = getElementByXPath(`//*[@id="xemDiem_aaa"]/tbody/tr[${n-3}]/td[1]/span[2]`);
  if (target) {
    target.innerText = " " + tbhk_10.toFixed(2);
  }
  target = getElementByXPath(`//*[@id="xemDiem_aaa"]/tbody/tr[${n-3}]/td[2]/span[2]`);
  if (target) {
    target.innerText = " " + tbhk_4.toFixed(2);
  }
  target = getElementByXPath(`//*[@id="xemDiem_aaa"]/tbody/tr[${n-2}]/td[1]/span[2]`);
  if (target) {
    target.innerText = " " + tbtl_10.toFixed(2);
  }
  target = getElementByXPath(`//*[@id="xemDiem_aaa"]/tbody/tr[${n-2}]/td[2]/span[2]`);
  if (target) {
    target.innerText = " " + tbtl_4.toFixed(2);
  }
  target = getElementByXPath(`//*[@id="xemDiem_aaa"]/tbody/tr[${n-1}]/td[1]/span[2]`);
  if (target) {
    target.innerText = " " + (ttc + lastScore['ttc']).toFixed(0);
  }
  target = getElementByXPath(`//*[@id="xemDiem_aaa"]/tbody/tr[${n-1}]/td[2]/span[2]`);
  if (target) {
    target.innerText = " " + (ttc_cur + lastScore['ttc']).toFixed(0);
  }
  target = getElementByXPath(`//*[@id="xemDiem_aaa"]/tbody/tr[${n}]/td[1]/span[2]`);
  if (target) {
    target.innerText = " " + cvt_10_tl(tbtl_10);
  }
  target = getElementByXPath(`//*[@id="xemDiem_aaa"]/tbody/tr[${n}]/td[2]/span[2]`);
  if (target) {
    target.innerText = " " + cvt_10_tl(tbhk_10);
  }
  // console.log(tbhk_10, tbtl_10, tbhk_4, tbtl_4);
}

function init_score() {
  rowIndex = getScoreCurrent(init=true);
  // Lấy tất cả các thẻ tr trong tbody của bảng
  const rows = document.evaluate('//*[@id="xemDiem_aaa"]/tbody/tr', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  
  // Kiểm tra xem có kết quả nào không
  if (rows.snapshotLength === 0) {
    console.log("Không tìm thấy thẻ tr trong tbody của bảng.");
    return;
  }
  
  const newRowsHTML = `
    <tr role="row" class="even" style="height: 51px; background-color: ${color["AB"]};">
      <td colspan="2" class="" style="vertical-align:top !important; text-align:left !important; font-weight: ">
          <span class="" lang="kqht-tkhk-diemtbhocluc">Điểm trung bình học kỳ hệ 10:</span><span style=""> </span>
      </td>
      <td colspan="2" class="" style="vertical-align:top !important; text-align:left !important; font-weight: ">
          <span class="" lang="kqht-tkhk-diemtbtinchi">Điểm trung bình học kỳ hệ 4:</span><span style=""> </span>
      </td>
    </tr>

    <tr role="row" class="odd" style="height: 51px; background-color: ${color["AB"]};">
      <td colspan="2" class="" style="vertical-align:top !important; text-align:left !important; font-weight: ">
          <span class="" lang="kqht-tkhk-diemtbhocluctichluy">Điểm trung bình tích lũy:</span><span style=""> ${lastScore['tbtl_10'].toFixed(2)}</span>
      </td>
      <td colspan="2" class="" style="vertical-align:top !important; text-align:left !important; font-weight: ">
          <span class="" lang="kqht-tkhk-diemtbtinchitichluy">Điểm trung bình tích lũy (hệ 4):</span><span style=""> ${lastScore['tbtl_4'].toFixed(2)}</span>
      </td>
    </tr>

    <tr role="row" class="even" style="height: 51px; background-color: ${color["AB"]};">
      <td colspan="2" class="" style="vertical-align:top !important; text-align:left !important; font-weight: ">
          <span class="" lang="kqht-tkhk-diemtbhocluc">Tổng số tín chỉ đã đăng ký:</span><span style=""> ${lastScore['ttc'].toFixed(0)}</span>
      </td>
      <td colspan="2" class="" style="vertical-align:top !important; text-align:left !important; font-weight: ">
          <span class="" lang="kqht-tkhk-diemtbtinchi">Tổng số tín chỉ tích lũy:</span><span style=""> ${lastScore['ttctl'].toFixed(0)}</span>
      </td>
    </tr>

    <tr role="row" class="even" style="height: 51px; background-color: ${color["AB"]};">
      <td colspan="2" class="" style="vertical-align:top !important; text-align:left !important; font-weight: ">
          <span class="" lang="kqht-tkhk-diemtbhocluc">Xếp loại học lực tích lũy:</span><span style=""> ${cvt_10_tl(lastScore['tbtl_10'])}</span>
      </td>
      <td colspan="2" class="" style="vertical-align:top !important; text-align:left !important; font-weight: ">
          <span class="" lang="kqht-tkhk-diemtbtinchi">Xếp loại học lực học kỳ:</span><span style=""> ${cvt_10_tl(lastScore['tbhk_10'])}</span>
      </td>
    </tr>
  `;

  // Tìm hàng cuối cùng trong tbody
  const lastRow = rows.snapshotItem(rows.snapshotLength - 1);

  // Kiểm tra nếu không tìm thấy lastRow
  if (!lastRow) {
    console.log("Không tìm thấy hàng cuối cùng trong tbody.");
    return;
  }

  // Tạo phần tử tbody mới và thêm các thẻ tr vào đó
  const tbody = lastRow.parentNode;

  // Chèn các thẻ tr mới vào cuối tbody
  tbody.insertAdjacentHTML('beforeend', newRowsHTML);
}

function removeInit() {
  const tbody = document.querySelector("#xemDiem_aaa tbody");
  const rows = tbody.querySelectorAll("tr");
  
  // Kiểm tra nếu có đủ 4 thẻ tr để xóa
  if (rows.length >= 4) {
    // Xóa 4 thẻ tr cuối cùng
    for (let i = 0; i < 4; i++) {
      tbody.removeChild(rows[rows.length - 1 - i]);
    }
  }
}
// -------------------------------------------------------------------

// Hàm xử lý khi người dùng click vào ô (td)
function cellClickHandler(event) {
  // Nếu chỉnh sửa không được phép thì không làm gì
  if (!editingEnabled) return;
  const cell = event.currentTarget;
  // Nếu ô đã chứa input thì không tạo thêm
  if (!cell.querySelector("input")) {
    const input = document.createElement("input");
    input.type = "text";      // chỉ cho phép nhập số
    input.min = "0";            // giá trị nhỏ nhất là 0
    input.max = "10";           // giá trị lớn nhất là 10
    input.step = "any";         // cho phép nhập số thực
    input.style.width = "100%";
    input.style.height = "90%";

    // Khi mất focus, kiểm tra giá trị nhập vào
    input.addEventListener("blur", function() {
      const value = parseFloat(this.value);
      // const value = getScoreCurrent(init=false)+6;
      if (!isNaN(value) && value >= 0 && value <= 10) {
        cell.innerText = this.value;
        cell.style.background = "lightblue";
      } else {
        cell.innerText = "";
        cell.style.background = "white";
      }

      // Lấy XPath của ô vừa nhập
      const xpath = getXPath(cell);
      const ck_score = getScore(xpath[0], 21);
      // const allowedRow = getCK();
      const startIndex = getScoreCurrent(init=false)+6;
      if (ck_score !== null && startIndex <= xpath[0]) {
        let sc = caculateScore(xpath[0]);
        let chr = cvt_10_char(parseFloat(sc.toFixed(1)));
        // diem 10
        let temp = getElementByXPath(`//*[@id="xemDiem_aaa"]/tbody/tr[${xpath[0]}]/td[22]`);
        if (temp) {
          temp.innerText = sc.toFixed(1) + "0";  // Chèn kết quả vào ô
          temp.style.background = color[chr[1]];
        }
        // diem 4
        temp = getElementByXPath(`//*[@id="xemDiem_aaa"]/tbody/tr[${xpath[0]}]/td[23]`);
        if (temp) {
          temp.innerText = charScore[chr[0]];  // Chèn kết quả vào ô
          temp.style.background = color[chr[1]];
        }
        // diem chu
        temp = getElementByXPath(`//*[@id="xemDiem_aaa"]/tbody/tr[${xpath[0]}]/td[24]`);
        if (temp) {
          temp.innerText = chr[0];  // Chèn kết quả vào ô
          temp.style.background = color[chr[1]];
        }
        // rank
        temp = getElementByXPath(`//*[@id="xemDiem_aaa"]/tbody/tr[${xpath[0]}]/td[25]`);
        if (temp) {
          temp.innerText = rank[chr[0]];  // Chèn kết quả vào ô
          temp.style.background = color[chr[1]];
        }
        // note
        temp = getElementByXPath(`//*[@id="xemDiem_aaa"]/tbody/tr[${xpath[0]}]/td[26]`);
        if (temp) {
          temp.innerText = chr[0] == "F" ? "Học Lại 🧧" : "🚀";  // Chèn kết quả vào ô
          temp.style.background = color[chr[1]];
        }
        // tin chi
        // temp = getValue(`//*[@id="xemDiem_aaa"]/tbody/tr[${xpath[0]}]/td[4]/div`);
        // if (temp) {
        //   ttc += temp;
        // }
      }
      if (ck_score === null) {
        // diem 10
        let temp = getElementByXPath(`//*[@id="xemDiem_aaa"]/tbody/tr[${xpath[0]}]/td[22]`);
        if (temp) {
          temp.innerText = "";
          temp.style.background = color['W'];
        }
        // diem 4
        temp = getElementByXPath(`//*[@id="xemDiem_aaa"]/tbody/tr[${xpath[0]}]/td[23]`);
        if (temp) {
          temp.innerText = ""; 
          temp.style.background = color['W'];
        }
        // diem chu
        temp = getElementByXPath(`//*[@id="xemDiem_aaa"]/tbody/tr[${xpath[0]}]/td[24]`);
        if (temp) {
          temp.innerText = ""; 
          temp.style.background = color['W'];
        }
        // rank
        temp = getElementByXPath(`//*[@id="xemDiem_aaa"]/tbody/tr[${xpath[0]}]/td[25]`);
        if (temp) {
          temp.innerText = ""; 
          temp.style.background = color['W'];
        }
        // note
        temp = getElementByXPath(`//*[@id="xemDiem_aaa"]/tbody/tr[${xpath[0]}]/td[26]`);
        if (temp) {
          temp.innerText = ""; 
          temp.style.background = color['W'];
        }
      }
      updateNewScore();
    });
    // Xóa nội dung hiện tại và thêm input vào ô
    cell.innerText = "";
    cell.appendChild(input);
    input.focus();
  }
}

function attachCellListeners() {
  const cells = document.querySelectorAll("td");
  cells.forEach(function(cell) {
    if (cell.innerText.trim() === "") {
        cell.addEventListener("click", cellClickHandler);
    }
  });
}

// Hàm gỡ bỏ event listener cho các ô <td>
function detachCellListeners() {
  const cells = document.querySelectorAll("td");
  cells.forEach(function(cell) {
    cell.removeEventListener("click", cellClickHandler);
  });
}
// Kiểm tra trạng thái khi trang tải
chrome.storage.sync.get(["modifyEnabled"], function(result) {
  if (result.modifyEnabled) {
    editingEnabled = true;
    attachCellListeners();
    init_score();
    updateNewScore();
  }
});

// Lắng nghe message từ popup để bật/tắt chức năng chỉnh sửa
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "toggleModify") {
    editingEnabled = request.enabled;
    if (editingEnabled) {
      attachCellListeners();
      init_score();
      updateNewScore();
    } else {
      detachCellListeners();
      removeInit();
    }
    // Có thể gửi phản hồi nếu cần
    sendResponse({ status: "Mod toggle updated", enabled: editingEnabled });
  }
});

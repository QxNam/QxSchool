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

function list_survey() {
  // *[@id="tab_daks"]/div[1]/div
  // get length of survey with xpath
  let length = document.evaluate('//div[@id="tab_daks"]/div[1]/div/div', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
  let links = [];
  for (let i = 0; i < length; i++) {
    let survey = document.evaluate('//*[@id="tab_daks"]/div[1]/div/div[1]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (survey) {
      links.push(survey.href);
    }
  }
  // https://sv.iuh.edu.vn/sinh-vien/chi-tiet-phieu-khao-sat.html?pKey=Zgf-ZLjmdwGaFXZsm2krwrMvveap9MGhMSqY_zKONQ5VYYPTbTf310cdtJ3jPFMoE3YgWthH9t6x-uXrll_42-xIWHT6PZb24MKNg6LmZGQ
  // bypass iter through links
  for (let i = 0; i < links.length; i++) {
    window.open(links[i]);
    bypass();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btnSurvey').addEventListener('click', function() {
    // Lấy tab đang hoạt động và gửi message đến content script của tab đó
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "bypass" });
    });
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "bypass") {
    bypass();
  }
});
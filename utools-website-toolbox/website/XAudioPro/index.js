/**
 * 自动切换为中文
 */

let languageButton = document.querySelector(
  "#__next > div > section > section > main > div:nth-child(1) > div:nth-child(5) > div > a"
);
let eventObj = new MouseEvent("mouseover", {
  view: window,
  bubbles: true,
  cancelable: true,
});
languageButton.dispatchEvent(eventObj);

let timer = setInterval(() => {
  let chineseButton = document.querySelector(
    "body > div:nth-child(11) > div > div > ul > li:nth-child(1)"
  );
  if (chineseButton) {
    chineseButton.click();
    clearInterval(timer);
  }
}, 100);

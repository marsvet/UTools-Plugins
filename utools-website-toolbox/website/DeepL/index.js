let main = document.getElementById("dl_translator");
let scripts = [];
for (let script of document.getElementsByTagName("script"))
  scripts.push(script);

document.body.innerHTML = "";
document.body.appendChild(main);
for (let script of scripts) document.body.appendChild(script);

let buttonObj = document.querySelector("#glossaryButton");
buttonObj.parentNode.removeChild(buttonObj);

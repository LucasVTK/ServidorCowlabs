import head from "./src/components/head.js"
import imgIndex from "./src/img/imgIndex.js"
import footer from "./src/components/footer.js"

head()
footer()


document.querySelector("#sadCow").innerHTML = `<img src="${imgIndex.dacingCow}" alt="sadCow" id="sadCow">`

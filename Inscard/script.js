const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 960;
const BLUR_LEVEL = 5;
const CARD_WIDTH = 470;
const CARD_HEIGHT = 760;

var fileSelect = document.getElementById("fileSelect");
fileSelect.addEventListener("change", () => {
  if (!fileSelect.files){
    return;
  } 

  let insCard = new inscard();
});

class inscard {
  constructor(){
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    document.body.appendChild(this.canvas);

    this.image = null;
    this.backImage = null;
    this.cardImage = null;

    this.start();
  }

  start(){
    this.loadImage("fileSelect", (image) => {
      this.image = image;
      this.cropBackImage();
      this.cropCardImage();
      this.drawBlurBackImage();
      this.drawMask();
      this.drawCardImage();
    });
  }
  // Hàm đọc file ảnh upload qua input html
  loadImage(inputId, callback){
    let input = document.getElementById(inputId);
    let reader = new FileReader(); // Tạo object FileReader đọc file đc upload
    reader.onload = (event) => {
      let image = new Image();
      image.onload = () => {
        callback(image);
      };
      image.src = event.target.result; // Gán link src ảnh đc upload vào prop image
    };
    reader.readAsDataURL(input.files[0]); // Read file upload thành URL để gán src image
  }

  cropBackImage(){
    let newBgSize = Math.min(this.image.width, this.image.height);
    let cutPosX = (this.image.width / 2) - (newBgSize / 2);
    let cutPosY = (this.image.height / 2) - (newBgSize / 2);

    this.backImage = document.createElement("canvas");
    this.backImage.width = CANVAS_WIDTH;
    this.backImage.height = CANVAS_HEIGHT;

    this.backImage.getContext("2d").drawImage(this.image, - cutPosX, - cutPosY);
  }

  cropCardImage(){
    let imageRatio = this.image.width / this.image.height;
    let cardRatio = CARD_WIDTH / CARD_HEIGHT;
    let cutPosX = 0;
    let cutPosY = 0;
    let newWidth = 0;
    let newHeight = 0;

    if (imageRatio == cardRatio){
      this.cardImage = this.image;
    }
    else if (imageRatio > cardRatio){
      newHeight = this.image.height;
      newWidth = newHeight * cardRatio;
      cutPosX = (this.image.width / 2) - (newWidth / 2);
    }
    else {
      newWidth = this.image.width;
      newHeight = newWidth / cardRatio;
      cutPosY = (this.image.height / 2) - (newHeight / 2);
    }
    this.cardImage = document.createElement("canvas");
    this.cardImage.width = newWidth;
    this.cardImage.height = newHeight;

    this.cardImage.getContext("2d").drawImage(this.image, - cutPosX, - cutPosY);
  }

  drawBlurBackImage(){
    this.context.globalAlpha = 1 / BLUR_LEVEL;
    for (let y = -BLUR_LEVEL; y <= BLUR_LEVEL; y++){
      for (let x = -BLUR_LEVEL; x <= BLUR_LEVEL; x++){
        this.context.drawImage(this.backImage, x, y, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
    }
    this.context.globalAlpha = 1;
  }

  drawMask(){
    this.context.globalAlpha = 0.4;
    this.context.fillStyle = "#000000";
    this.context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.context.globalAlpha = 1;
  }

  drawCardImage(){
    let radius = 10;
    let x = 245;
    let y = 100;
    this.context.beginPath();
    this.context.moveTo(x + radius, y);
    this.context.lineTo(x + CARD_WIDTH - radius, y);
    this.context.quadraticCurveTo(x + CARD_WIDTH, y, x + CARD_WIDTH, y + radius);
    this.context.lineTo(x + CARD_WIDTH, y + CARD_HEIGHT - radius);
    this.context.quadraticCurveTo(x + CARD_WIDTH, y + CARD_HEIGHT, x + CARD_WIDTH - radius, y + CARD_HEIGHT);
    this.context.lineTo(x + radius, y + CARD_HEIGHT);
    this.context.quadraticCurveTo(x, y + CARD_HEIGHT, x, y + CARD_HEIGHT - radius);
    this.context.lineTo(x, y + radius);
    this.context.quadraticCurveTo(x, y, x + radius, y);
    this.context.closePath();
    this.context.clip();
    this.context.drawImage(this.cardImage, 245, 100, CARD_WIDTH, CARD_HEIGHT);
  }
}
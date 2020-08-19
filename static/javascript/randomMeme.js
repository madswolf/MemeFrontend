var fontBase = 1000,                   // selected default width for canvas
    fontSize = 100;                     // default size for font

function getFont(width) {
    var ratio = fontSize / fontBase;   // calc ratio
    var size = width * ratio;   // get font size based on current width
    return (size|0) + 'px Impact'; // set font
}

async function assignRandomMeme() {
    let response = await fetch("/requestMeme");
    let newMeme = await response.text();
    let parts = newMeme.split("___");
    
    if (parts.length > 3){
        let soundExtension = parts[2];
        let soundData = parts[3];
        //TODO: add sound support
    }
    
    //todo support .gif and .mp4(video in general)
    let visualExtension = parts[0];
    let visualData = parts[1];
    let imageElement = new Image();    
    imageElement.src = "data:image/" + visualExtension + ";base64," + visualData;

    imageElement.addEventListener('load', () => {
        let memeCanvas = document.querySelector("#meme_image");
        let ctx = memeCanvas.getContext("2d");
        memeCanvas.height = imageElement.height;
        memeCanvas.width = imageElement.width;
        
        ctx.drawImage(imageElement,0,0);
        let font = getFont(memeCanvas.width);
        console.log(font);
        ctx.font = font;
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        
        ctx.fillText("Hello World!",memeCanvas.width/2, memeCanvas.height/5);
    });
    
}
document.querySelector(".requestMeme").addEventListener("click",assignRandomMeme);;


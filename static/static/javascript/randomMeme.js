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

    let memeCanvas = document.querySelector("#meme_image")
    let ctx = memeCanvas.getContext("2d")
    memeCanvas.height = imageElement.height
    memeCanvas.width = imageElement.width
    ctx.drawImage(imageElement,0,0)
}
document.querySelector(".requestMeme").addEventListener("click",assignRandomMeme);;


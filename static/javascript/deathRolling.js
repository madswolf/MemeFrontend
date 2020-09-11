var intensity = 1

var inputField = document.querySelector('#number')
var text = document.querySelector('#result');
var html = document.querySelector("body");
var sound = document.querySelector("#bass");

function changeToResult(element, roll){
    element.innerHTML = roll;
    element.style.fontSize = (20 * intensity) + 'px';
}

function roll() {
    let number = parseInt(inputField.value);
    let roll = Math.ceil(Math.random() * number);

    if (number === 1) {
        intensity = 1;
    }else {    
        intensity++;
    }
    
    if (roll === 1 ){
        sound.play();
        text.classList.add('one');
        html.classList.add('background')
        setTimeout(() => {
            text.classList.remove('one');
            html.classList.remove('background')  
        },1000);        
    }

    changeToResult(text,roll);
    inputField.value = roll;
}

document.querySelector(".flexbox").addEventListener("click",roll);
document.querySelector("#number").addEventListener("keydown", function (e) {
    if (e.key === 'Enter') {
        roll(); 
    }else{
        intensity = 1
    }
});



var intensity = 1

function changeToResult(element, roll){
    element.innerHTML = roll;
    element.style.fontSize = (20 * intensity) + 'px';
    console.log(element.style.fontSize)
}

const colorpairs = [
        ["green","red"],
        ["yellow","purple"],
        ["orange","dodgerblue"],
    ];

function changeColors(text,background){
    let originalTextColor = text.style.color
    let originalBackgroundColor = background.style.color
    let timeout = 250

    colorpairs.forEach((colorPair,index) => {
        setTimeout( () => {
            console.log(colorpair);
            text.style.color = colorPair[0];
            background.style.color = colorPair[1];
        }, timeout * (index + 1));
    });

    setTimeout( () =>{
        text.style.color = originalTextColor
        background.style.color = originalBackgroundColor
    },timeout * colorpairs.length);
}


function roll() {
    let number = parseInt(document.querySelector('#number').value);
    let roll = Math.ceil(Math.random() * number);
    if (number === 1) {
        intensity = 1;
        let text = document.querySelector('#result');
        let html = document.querySelector("body");
        document.querySelector("#bass").play();
        text.classList.add('one');
        html.classList.add('background')

    }else {    
        intensity++;
        let text = document.querySelector('#result');
        let html = document.querySelector("body");
        text.classList.remove('one');
        html.classList.remove('background')  
    }
    
    console.log(intensity);

    if (roll === 1 ){
        let text = document.querySelector('#result');
        let html = document.querySelector("body");
        document.querySelector("#bass").play();
        text.classList.add('one');
        html.classList.add('background')
    }
    changeToResult(document.querySelector("#result"),roll);
    document.querySelector("#number").value = roll;
}

document.querySelector(".flexbox").addEventListener("click",roll);
document.querySelector("#number").addEventListener("keydown", function (e) {
    if (e.key === 'Enter') {
        roll(); 
    }else{
        intensity = 1
    }
});



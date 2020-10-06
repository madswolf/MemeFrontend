import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'rsuite';
import { useMemeState } from './State';

var fontBase = 1000,                   // selected default width for canvas
    fontSize = 100;                     // default size for font

function getFont(width:number) {
    var ratio = fontSize / fontBase;   // calc ratio
    var size = width * ratio;   // get font size based on current width
    return (size|0) + 'px Impact'; // set font
}

function drawText(ctx:CanvasRenderingContext2D,text:string,centerX:number,centerY:number,font:string){
    ctx.save();
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText(text,centerX,centerY);
    ctx.restore();
}

const MemePage :React.FC = (props) =>{
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    
    const CHANCE_OF_TOPTEXT = 25;
    const CHANCE_OF_SOUND = 50;
    const chance_OF_BOTTOMTEXT = 25;
    
    const [memeState,setMemeState] = useState({toptext:"",bottomtext:"",visualFileURL:"",soundFileURL:""})

    useEffect(() => {
        var imageElement = new Image();
        imageElement.src = memeState.visualFileURL
        imageElement.addEventListener('load', () => {
            var memeCanvas = canvasRef.current;
            console.log("hello")
            console.log(memeState.visualFileURL)
            if(memeCanvas){
                const ctx = memeCanvas.getContext('2d') 
                if (ctx){
                    //Our first draw
                    memeCanvas.width = imageElement.width;
                    memeCanvas.height = imageElement.height;
                    ctx.drawImage(imageElement,0,0);
                    let font = getFont(memeCanvas.width);

                    ctx.font = font;
                    ctx.textAlign = "center";
                    ctx.fillStyle = "black";

                    drawText(ctx,memeState.toptext,memeCanvas.width/2, - memeCanvas.height/5,font);
                    drawText(ctx,memeState.bottomtext,memeCanvas.width/2, memeCanvas.height - memeCanvas.height/5,font);                   
                }
            }
        })
      });

    async function getResourceOnChance(fetchURL:string,chance:number):Promise<string>{
        if( Math.floor(Math.random() * 100) < chance){
            return fetch(fetchURL,{method:'GET'})
            .then(response => response.json())
            .then(data => data.data);
        }else {
            return "";
        }
    }

    async function getRandom(){
        const visualResource = await getResourceOnChance('http://localhost:2000/random/visual',100);
        const soundResource = await getResourceOnChance('http://localhost:2000/random/sound',CHANCE_OF_SOUND);
        const toptextResource = await getResourceOnChance('http://localhost:2000/random/toptext',CHANCE_OF_TOPTEXT);
        const bottomtextResource = await getResourceOnChance('http://localhost:2000/random/bottomtext',chance_OF_BOTTOMTEXT);
        setMemeState({toptext:toptextResource,bottomtext:bottomtextResource,visualFileURL:visualResource,soundFileURL:soundResource})
    }
    return (
        <div>
            <canvas ref={canvasRef}>

            </canvas>
            <Button onClick={getRandom}>
                click
            </Button>
            <Link to="/Upload/Meme" className="Signup-link">
                <Button appearance="ghost">Upload memes</Button>
            </Link>
        </div>
    );
}

export default MemePage;
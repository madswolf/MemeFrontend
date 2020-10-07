import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'rsuite';
import { threadId } from 'worker_threads';
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
    ctx.font = font;
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillStyle = "white";
    ctx.strokeStyle='black';
    ctx.fillText(text,centerX,centerY);
    ctx.strokeText(text,centerX,centerY)
    ctx.restore();
}

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }
  
export function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  
    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return windowDimensions;
}

const MemePage :React.FC = (props) =>{
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    
    const CHANCE_OF_TOPTEXT = 50;
    const CHANCE_OF_SOUND = 25;
    const chance_OF_BOTTOMTEXT = 50;
    
    const [memeState,setMemeState] = useState({toptext:"",bottomtext:"",visualFileURL:"",soundFileURL:""})
    const windowDimensions = useWindowDimensions();
    useEffect(() => {
        var imageElement = new Image();
        imageElement.src = memeState.visualFileURL
        imageElement.addEventListener('load', () => {
            var memeCanvas = canvasRef.current;
            if(memeCanvas){
                const ctx = memeCanvas.getContext('2d') 
                if (ctx){
                    

                    let maxDimension = windowDimensions.width < 400 ? windowDimensions.width - 50 : 400;
                    
                    if (imageElement.width > maxDimension && imageElement.width >= imageElement.height){
                        memeCanvas.width = maxDimension;
                        memeCanvas.height = maxDimension * (imageElement.height/imageElement.width);
                    }else if (imageElement.height > maxDimension && imageElement.height > imageElement.width){
                        memeCanvas.height = maxDimension;
                        memeCanvas.width = maxDimension * (imageElement.width/imageElement.height);
                    }else {
                        memeCanvas.width = imageElement.width;
                        memeCanvas.height = imageElement.height;
                    }
                   
                    var scale = Math.min(memeCanvas.width / imageElement.width, memeCanvas.height / imageElement.height);
                    // get the top left position of the image
                    var x = (memeCanvas.width / 2) - (imageElement.width / 2) * scale;
                    var y = (memeCanvas.height / 2) - (imageElement.height / 2) * scale;
                    ctx.drawImage(imageElement, x, y, imageElement.width * scale, imageElement.height * scale);
                    let font = getFont(memeCanvas.width);

                    drawText(ctx,memeState.toptext,memeCanvas.width/2, memeCanvas.height/8,font);
                    drawText(ctx,memeState.bottomtext,memeCanvas.width/2, memeCanvas.height - memeCanvas.height/8,font);                   
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
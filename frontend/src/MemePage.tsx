import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'rsuite';
import { MemeCanvas } from './MemeCanvas';
import { useMemeCanvasState } from './State';


const MemePage :React.FC = (props) =>{
    
    const CHANCE_OF_TOPTEXT = 75;
    const CHANCE_OF_SOUND = 25;
    const chance_OF_BOTTOMTEXT = 75;
    const {memeState,setMemeState} = useMemeCanvasState();

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
        console.log(window.location.href)
        
        const visualResource = await getResourceOnChance(`${window.location.href}/random/visual`,100);
        const soundResource = await getResourceOnChance(`${window.location.href}/random/sound`,CHANCE_OF_SOUND);
        const toptextResource = await getResourceOnChance(`${window.location.href}/random/toptext`,CHANCE_OF_TOPTEXT);
        const bottomtextResource = await getResourceOnChance(`${window.location.href}/random/bottomtext`,chance_OF_BOTTOMTEXT);
        setMemeState({toptext:toptextResource,bottomtext:bottomtextResource,visualFileURL:visualResource,soundFileURL:soundResource})
    }
    return (
        <div>
            <div className="Meme-upload-bar"> 
                <h3>
                    Think these memes are stinky? 
                    <Link to="/Upload/Meme" className="Signup-link">
                        upload your own
                    </Link>
                </h3>
            </div>
                <MemeCanvas className="Meme-container" memeState={memeState} >
                    <Button appearance="primary" onClick={getRandom}>
                        New meme
                    </Button>
                </MemeCanvas>
        </div>
    );
}

export default MemePage;
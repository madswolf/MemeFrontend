import React, { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, IconButton, IconButtonProps } from 'rsuite';
import { JsxElement } from 'typescript';
import { MemeCanvas } from './MemeCanvas';
import { useMemeCanvasState, useMemeStackState } from './State';

const MemeControleButton : React.FC<{isAllowed:boolean,className:string,isRight:boolean,onClick():void}> = (props) => {
    const iconToUse = <Icon icon={props.isRight ? "arrow-right" : "arrow-left"} />; 
    
    var button;
    if(props.isAllowed){
        button =  
        <IconButton className={props.className} icon ={iconToUse} appearance="primary" onClick={props.onClick} >
            {props.isRight ? "forward" : "back"}
        </IconButton>
    } else {
        button =  
        <IconButton className={props.className} disabled icon ={iconToUse} appearance="primary" onClick={props.onClick} placement={props.isRight ? "right" : "left"}>
             {props.isRight ? "forward" : "back"}
        </IconButton>
    }
    return button;
}

const MemePage :React.FC = (props) =>{
    
    const CHANCE_OF_TOPTEXT = 75;
    const CHANCE_OF_SOUND = 25;
    const chance_OF_BOTTOMTEXT = 75;
    //const {memeState,setMemeState} = useMemeCanvasState();
    const {memeState,memeStackPointer,canGoBack,canGoForward,append,goBack,goForward} = useMemeStackState();

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
        const visualResource = await getResourceOnChance(`${window.location.href}/random/visual`,100);
        const soundResource = await getResourceOnChance(`${window.location.href}/random/sound`,CHANCE_OF_SOUND);
        const toptextResource = await getResourceOnChance(`${window.location.href}/random/toptext`,CHANCE_OF_TOPTEXT);
        const bottomtextResource = await getResourceOnChance(`${window.location.href}/random/bottomtext`,chance_OF_BOTTOMTEXT);
        append({toptext:toptextResource,bottomtext:bottomtextResource,visualFileURL:visualResource,soundFileURL:soundResource})
    
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
                    <div className="Meme-button-container">
                        <MemeControleButton className="Meme-button" isAllowed={canGoBack} isRight={false} onClick={goBack} />
                        <Button className="Meme-button" appearance="primary" onClick={getRandom}>
                            New meme
                        </Button>    
                        <MemeControleButton className="Meme-button" isAllowed={canGoForward} isRight={true} onClick={goForward} />
                    </div>
                    <h1>{memeStackPointer}</h1>
                </MemeCanvas>
        </div>
    );
}

export default MemePage;
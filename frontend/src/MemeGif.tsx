import React from "react";
import { MemeCanvasState } from "./State";

export const MemeGif :React.FC<{memeState:MemeCanvasState,className:string}> = (props) =>{


    return(
        <div className={props.className}>
            <div className="Meme-canvas-container">
                <div className="Meme-gif-container">
                    <h1 className="Meme-gif-toptext">{props.memeState.toptext}</h1>
                    <img className="Meme-gif" src={props.memeState.visualFileURL} alt="Gif-displaying-current-visual-meme" />
                    <h1 className="Meme-gif-bottomtext">{props.memeState.bottomtext}</h1>
                </div>
            </div>
            {props.children}
        </div>
    );
}
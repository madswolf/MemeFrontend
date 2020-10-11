import React from "react";
import { MemeCanvas } from "./MemeCanvas";
import { MemeGif } from "./MemeGif";
import { MemeCanvasState } from "./State";

export const MemeDisplayer :React.FC<{memeState:MemeCanvasState,className:string}> = (props) =>{

    return(
        <div>
            {!props.memeState.isGif ? <MemeCanvas className={props.className} memeState={props.memeState}>
                {props.children}
            </MemeCanvas> : null}
            {props.memeState.isGif ? <MemeGif className={props.className} memeState={props.memeState}>
                {props.children}
            </MemeGif> : null}
        </div>
    );
}
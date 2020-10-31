import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, IconButton, List } from 'rsuite';
import axios from 'axios';
import { MemeDisplayer } from './MemeDisplayer';
import {  settings, useMemeStackState } from './State';
import { Votebuttons } from './VoteButtons';

const MemeControleButton : React.FC<{isAllowed:boolean,className:string,isRight:boolean,onClick():void}> = (props) => {
    const iconToUse = <Icon icon={props.isRight ? "arrow-right" : "arrow-left"} />; 
    
    var button;
    if(props.isAllowed){
        button =  
        <IconButton className={props.className} icon ={iconToUse} appearance="primary" onClick={props.onClick} placement={props.isRight ? "right" : "left"}>
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

const MemePage :React.FC<settings & {isLoggedIn:boolean}> = (props) =>{
    
    const CHANCE_OF_TOPTEXT = 75;
    const CHANCE_OF_SOUND = 25;
    const chance_OF_BOTTOMTEXT = 75;
    
    const {memeState,memeStackPointer,canGoBack,canGoForward,append,goBack,goForward} = useMemeStackState();
    async function getResourceOnChance(fetchURL:string,chance:number):Promise<{id:number,data:string}>{
        if( Math.floor(Math.random() * 100) < chance){
            return fetch(fetchURL,{method:'GET'})
            .then(response => response.json())
        }else {
            return {id:0,data:""};
        }
    }

    function handleVote(type:string,ids:number[]){
        return function(upvote:boolean){
            let formdata = new FormData();
            formdata.append("type",type);
            formdata.append("upvote",JSON.stringify(upvote));
            
            for(var i = 0 ; i < ids.length; i++){
                formdata.append("ids",ids[i].toString());
            }

            axios.post(window.location.href +'s',formdata, {
                headers: {
                  'Content-Type' : 'multipart/form-data'
                } 
            })
            .then(response => console.log(response));
        }
    }

    async function getRandom(){
        const visualResource = await getResourceOnChance(`${window.location.href}/random/visual`,100);
        const soundResource = await getResourceOnChance(`${window.location.href}/random/sound`,CHANCE_OF_SOUND);
        const toptextResource = await getResourceOnChance(`${window.location.href}/random/toptext`,CHANCE_OF_TOPTEXT);
        const bottomtextResource = await getResourceOnChance(`${window.location.href}/random/bottomtext`,chance_OF_BOTTOMTEXT);
        append({
            toptext:toptextResource.data,
            toptextID:toptextResource.id,
            bottomtext:bottomtextResource.data,
            bottomtextID:bottomtextResource.id,
            visualFileURL:visualResource.data,
            visualFileID:visualResource.id,
            soundFileURL:soundResource.data,
            soundFileID:soundResource.id,
            isGif:visualResource.data.endsWith('.gif')
        });
    }

    var handleMemeVote = handleVote("meme", 
        [
            memeState.visualFileID,
            memeState.toptextID,
            memeState.bottomtextID,
            memeState.soundFileID
        ]);

    var voteList = (
        <div className="vote-component-container">
            <li key={0} className="vote-component">
                <Votebuttons voteCount={0} isLoggedIn={props.isLoggedIn} size="small-vote" vote={() => handleVote("toptext",[memeState.toptextID])}/>
                <h3>toptext</h3>
            </li>
            <li key={1} className="vote-component" >
                <Votebuttons voteCount={0} isLoggedIn={props.isLoggedIn} size="small-vote" vote={() => handleVote("bottomtext",[memeState.bottomtextID])}/>
                <h3>bottomtext</h3>
            </li>
            <li key={2} className="vote-component">
                <Votebuttons voteCount={0} isLoggedIn={props.isLoggedIn} size="small-vote" vote={() => handleVote("visual",[memeState.visualFileID])}/>
                <h3>visual</h3>
            </li>
            <li key={2} className="vote-component">
                <Votebuttons voteCount={0} isLoggedIn={props.isLoggedIn} size="small-vote" vote={() => handleVote("sound",[memeState.soundFileID])}/>
                <h3>sound</h3>
            </li>
        </div>     
    );

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
            {props.advancedMode ? voteList : null}
            <div className="random-container">
                <Votebuttons voteCount={0} isLoggedIn={props.isLoggedIn} size="normal-vote" vote={handleMemeVote}/>       
                <MemeDisplayer className="Meme-container" memeState={memeState}>
                    <div className="Meme-button-container">
                        <MemeControleButton className="Meme-button" isAllowed={canGoBack} isRight={false} onClick={goBack} />
                        <Button className="Meme-button" appearance="primary" onClick={getRandom}>
                            New meme
                        </Button>    
                        <MemeControleButton className="Meme-button" isAllowed={canGoForward} isRight={true} onClick={goForward} />
                    </div>
                    <h1>{memeStackPointer}</h1>
                </MemeDisplayer>
            </div>
        </div>
    );
}

export default MemePage;
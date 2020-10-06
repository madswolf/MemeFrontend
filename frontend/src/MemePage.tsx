import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'rsuite';
import { useMemeState } from './State';

const MemePage :React.FC = (props) =>{
    const canvasRef = React.useRef(null);
    const CHANCE_OF_TOPTEXT = 25;
    const CHANCE_OF_SOUND = 50;
    const chance_OF_BOTTOMTEXT = 25;
    const {
        toptext,setTopText,
        bottomtext,setBottomText,
        visualFileURL,setVisualFileURL,
        soundFileURL,setSoundFileURL
    } = useMemeState();
    async function getRandom(){
        fetch('http://localhost:2000/random/visual',{method:'GET'})
        .then(response => response.json())
        .then(data => setVisualFileURL(data.url));
        //[Math.floor(Math.random() * table.length
        if( Math.floor(Math.random() * 100) > CHANCE_OF_SOUND){
            fetch('http://localhost:2000/random/sound',{method:'GET'})
            .then(response => response.json())
            .then(data => setSoundFileURL(data.url));
        }else {
            setSoundFileURL("");
        }
        
        fetch('http://localhost:2000/random/toptext',{method:'GET'})
        .then(response => response.json())
        .then(data => setTopText(data.text));
        fetch('http://localhost:2000/random/bottomtext',{method:'GET'})
        .then(response => response.json())
        .then(data => setBottomText(data.text));
    }
    return (
        <div>
            <div>
    <           h1>{toptext}</h1>
                <img src={visualFileURL}></img>
    <           h1>{bottomtext}</h1>
            </div>
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
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'rsuite';
import { useMemeState } from './State';

const MemePage :React.FC = (props) =>{
    const canvasRef = React.useRef(null);
    const {toptext,setTopText,bottomtext,setBottomText,visualFile,setVisualFile,soundFile,setSoundFile} = useMemeState();
    async function test(){
        const fileReader = new FileReader();
        fetch('http://localhost:2000/randommeme',{method:'GET'})
        .then(response => response.json())
        .then(data => console.log(data));
    }
    return (
        <div>
            <canvas ref={canvasRef}>

            </canvas>
            <Button onClick={test}>
                click
            </Button>
            <Link to="/Upload/Meme" className="Signup-link">
                <Button appearance="ghost">Upload memes</Button>
            </Link>
        </div>
    );
}

export default MemePage;
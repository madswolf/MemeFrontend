import React, { useEffect, useState } from 'react';
import { Button, ButtonToolbar, ControlLabel, Form, FormControl, FormGroup, HelpBlock, Input, Schema } from 'rsuite';
import { useMemeState } from './State';
import {request} from 'http';
import axios from 'axios';

const UploadPage :React.FC = (props) =>{
  const {toptext,setTopText,bottomtext,setBottomText,visualFile,setVisualFile,soundFile,setSoundFile} = useMemeState();
  
  //hacky way to force rerender without using document to reset the form manually
  var [reset,setReset] = useState("reset");

  useEffect(() => {
    const thing = document.getElementById('submit') as HTMLButtonElement;
    if (!visualFile) {
      thing.disabled = true;
    }else {
      thing.disabled = false;
    }
  })

  function handleUpload(){
    if (visualFile){
      let formdata = new FormData();
      formdata.append("toptext",toptext);
      formdata.append("bottomtext",bottomtext);
      formdata.append("visualFile",visualFile);
      if(soundFile){
        formdata.append("soundFile",soundFile);
      }
      console.log(formdata);
      axios.get('http://localhost:2000/memes').then((response) => console.log(response))
      axios.post('http://localhost:2000/memes',formdata, {
        headers: {
          'Content-Type' : 'multipart/form-data'
        }
      }).then(response => {
        setTopText("");
        setBottomText("");
        setVisualFile(undefined);
        setSoundFile(undefined);
        setReset("");
        
      }).then(() => setReset("reset"));
      console.log(reset);
    } 
  }

  type fileInputProps ={
    reset:boolean,
    name:string, 
    accept:string, 
    onChange(v:string, event:React.SyntheticEvent<HTMLElement>):void
  }

  function fileChangeHandler(v:string,event:React.SyntheticEvent<HTMLElement>){
    const target = ((event.currentTarget as HTMLInputElement))
    if (target.files){
      if(target.name === 'visualFile')
      {
        setVisualFile(target.files[0])
      } 
      else if (target.name === 'soundFile') {
        setSoundFile(target.files[0])
      }
    }
  }



  return (
    <Form key={reset} className="Login-form">
        <FormGroup >
          <ControlLabel>Toptext</ControlLabel>
          <FormControl name="toptext" onChange={(v,e) => setTopText(v)}/>
          <HelpBlock tooltip>The toptext of your dank meme</HelpBlock>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Bottomtext</ControlLabel>
          <FormControl name="bottomtext"  onChange={(v,e) => setBottomText(v)}/>
          <HelpBlock tooltip>Pretty self explanatory tbh</HelpBlock>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Meme</ControlLabel>
          <Input type="file" name = "visualFile" accept=".png,.jpg,.jpeg,.mp4,.gif" onChange={fileChangeHandler}/>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Optional soundfile</ControlLabel>
          <Input type="file" name = "soundFile" accept=".mp3,.wav" onChange={fileChangeHandler}/>
        </FormGroup>
        <FormGroup>
          <ButtonToolbar>
            <Button block id="submit" appearance="primary" onClick={handleUpload}>Upload</Button>  
          </ButtonToolbar>
        </FormGroup>
    </Form>
    );
}


export default UploadPage;
import React, { useEffect, useState } from 'react';
import { Button, ButtonToolbar, ControlLabel, Form, FormControl, FormGroup, HelpBlock, Input, Loader, Schema, Tooltip, Whisper } from 'rsuite';
import { useMemeState } from './State';
import axios from 'axios';
import { MemeCanvas } from './MemeCanvas';
import ReactTooltip from 'react-tooltip';

const UploadPage :React.FC = (props) =>{
  const {toptext,setTopText,bottomtext,setBottomText,visualFile,setVisualFile,soundFile,setSoundFile} = useMemeState();
  const [isLoading,setIsLoading] = useState(false);
  const [visualFileURL,setVisualFileURL] = useState("");
  const [soundFIleURL,setSoundFileURL] = useState("");
  const [readyToUpload, setReadyToUpload] = useState(false);
  const [toolTipString,setToolTipString] = useState("");

  //hacky way to force rerender since form.reset does not work
  const [reset,setReset] = useState("reset");

  useEffect(() => {
    if (!visualFile) {
      setReadyToUpload(false);
      setToolTipString("");
    }else {
      if(visualFile.size > 10000000){
        setReadyToUpload(false);
        setToolTipString("File is too large");
      } else {
        setReadyToUpload(true);
        setToolTipString("");
      }
    }
    ReactTooltip.rebuild();
  });

  function handleUpload(){
    if (visualFile){
      let formdata = new FormData();
      formdata.append("toptext",toptext);
      formdata.append("bottomtext",bottomtext);
      formdata.append("visualFile",visualFile);
      if(soundFile){
        formdata.append("soundFile",soundFile);
      }
      setIsLoading(true);
      axios.post(window.location.href +'s',formdata, {
        headers: {
          'Content-Type' : 'multipart/form-data'
        }
      }).then(response => {
        setTopText("");
        setBottomText("");
        setVisualFile(undefined);
        setSoundFile(undefined);
        setVisualFileURL("");
        setSoundFileURL("");
        setReset("");
        setIsLoading(false);
      }).then(() => {
        setReset("reset");
      });
    } 
  }

  function fileChangeHandler(v:string,event:React.SyntheticEvent<HTMLElement>){
    const target = ((event.currentTarget as HTMLInputElement))
    if (target.files){
      var fr = new FileReader();
      if(target.name === 'visualFile')
      {
        fr.onload = () => setVisualFileURL(fr.result as string);
        setVisualFile(target.files[0])

      } 
      else if (target.name === 'soundFile') {
        fr.onload = () => setSoundFileURL(fr.result as string);
        setSoundFile(target.files[0])
      }

      fr.readAsDataURL(target.files[0]);
    }
  }

  const UpLoadButton:React.FC<{toolTopString:string,readyForUpload:boolean}> =(props) => {
    var upLoadButton;
    if (toolTipString){
      upLoadButton = (<Button disabled data-tip data-for="submit" block appearance="primary" onClick={handleUpload}>Upload</Button>  );
    }else {
      if(!readyToUpload){
        upLoadButton = (<Button disabled  block appearance="primary" onClick={handleUpload}>Upload</Button>);
      } else {
        upLoadButton = (<Button block appearance="primary" onClick={handleUpload}>Upload</Button>);
      } 
    }
    return (upLoadButton);
  }

  const MemeLoader:React.FC<{isloading:boolean}> = (props) => {
    const loader = props.isloading ? (<Loader backdrop content="sending..." vertical/>) : <div></div>
    return (loader);
  }
  ReactTooltip.hide();
  return (
    <div key={reset} className="Upload-page">
      <Form className="Login-form">
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
              <UpLoadButton toolTopString={toolTipString} readyForUpload={readyToUpload}/>
            </ButtonToolbar>
          </FormGroup>
          <MemeLoader isloading={isLoading}/>
      </Form>
      <MemeCanvas className="Meme-preview-container" memeState={{toptext:toptext,bottomtext:bottomtext,visualFileURL:visualFileURL,soundFileURL:soundFIleURL}}/>
      <ReactTooltip id="submit" place="top" effect="solid">
        {toolTipString}
      </ReactTooltip>
    </div>
    );
}


export default UploadPage;
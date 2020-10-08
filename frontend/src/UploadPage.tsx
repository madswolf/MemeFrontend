import React, { useEffect, useState } from 'react';
import { Button, ButtonToolbar, ControlLabel, Form, FormControl, FormGroup, HelpBlock, Input, Loader} from 'rsuite';
import { useMemeCanvasState } from './State';
import axios from 'axios';
import { MemeCanvas } from './MemeCanvas';
import ReactTooltip from 'react-tooltip';

const UploadPage :React.FC = (props) =>{
  //hooks for state of the form
  const{memeState,setMemeState} = useMemeCanvasState();
  const [visualFile,setVisualFile] = useState<File>();
  const [soundFile,setSoundFile] = useState<File>();

  //utillity hooks
  const [isLoading,setIsLoading] = useState(false);
  const [readyToUpload, setReadyToUpload] = useState(false);
  const [toolTipString,setToolTipString] = useState("");

  //hacky way to force rerender since form.reset does not work
  const [reset,setReset] = useState("reset");

  useEffect(() => {
    if (!visualFile) {
      setReadyToUpload(false);
      setToolTipString("Must have a file");
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
      formdata.append("toptext",memeState.toptext);
      formdata.append("bottomtext",memeState.bottomtext);
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
        setMemeState({toptext:"",bottomtext:"",visualFileURL:"",soundFileURL:""})
        setVisualFile(undefined);
        setSoundFile(undefined);
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
        fr.onload = () => setMemeState({...memeState,visualFileURL:(fr.result as string)});
        setVisualFile(target.files[0])

      } 
      else if (target.name === 'soundFile') {
        fr.onload = () => setMemeState({...memeState,soundFileURL:(fr.result as string)});
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

  return (
    <div key={reset} className="Upload-page">
      <Form className="Login-form">
          <FormGroup >
            <ControlLabel>Toptext</ControlLabel>
            <FormControl name="toptext" onChange={(v,e) => setMemeState({...memeState,toptext:v})}/>
            <HelpBlock tooltip>The toptext of your dank meme</HelpBlock>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Bottomtext</ControlLabel>
            <FormControl name="bottomtext"  onChange={(v,e) => setMemeState({...memeState,bottomtext:v})}/>
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
      <MemeCanvas className="Meme-preview-container" memeState={memeState}/>
      <ReactTooltip id="submit" place="top" effect="solid">
        {toolTipString}
      </ReactTooltip>
    </div>
    );
}


export default UploadPage;
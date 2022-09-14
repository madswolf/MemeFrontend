import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  HelpBlock,
  Input,
  Loader,
} from 'rsuite';
import { useMemeCanvasState } from './State';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import { MemeDisplayer } from './MemeDisplayer';
import { apiHost, protocol } from './App';

export const MemeLoader: React.FC<{ isloading: boolean }> = (props) => {
  const loader = props.isloading ? (
    <Loader backdrop={true} content="sending..." vertical={true} />
  ) : (
    <div />
  );
  return loader;
};

export const UpLoadButton: React.FC<{
  toolTipString: string;
  readyForUpload: boolean;
  handleUpload(): void;
}> = (props) => {
  let upLoadButton;
  if (props.toolTipString) {
    upLoadButton = (
      <Button
        disabled={true}
        data-tip={true}
        data-for="submit"
        block={true}
        appearance="primary"
        onClick={props.handleUpload}
      >
        Upload
      </Button>
    );
  } else {
    if (!props.readyForUpload) {
      upLoadButton = (
        <Button disabled={true} block={true} appearance="primary" onClick={props.handleUpload}>
          Upload
        </Button>
      );
    } else {
      upLoadButton = (
        <Button block={true} appearance="primary" onClick={props.handleUpload}>
          Upload
        </Button>
      );
    }
  }
  return upLoadButton;
};

const UploadPage: React.FC = (props) => {
  // hooks for state of the form/preview
  const { memeCanvasState, setMemeCanvasState } = useMemeCanvasState();
  const [visualFile, setVisualFile] = useState<File>();
  const [soundFile, setSoundFile] = useState<File>();

  // utillity hooks
  const [isLoading, setIsLoading] = useState(false);
  const [readyToUpload, setReadyToUpload] = useState(false);
  const [toolTipString, setToolTipString] = useState('');

  // hacky way to force rerender since form.reset does not work
  const [reset, setReset] = useState('reset');

  useEffect(() => {
    if (!visualFile) {
      setReadyToUpload(false);
      setToolTipString('Must have a file');
    } else {
      if (visualFile.size > 10000000) {
        setReadyToUpload(false);
        setToolTipString('File is too large');
      } else {
        setReadyToUpload(true);
        setToolTipString('');
      }
    }
    ReactTooltip.rebuild();
  }, [visualFile]);

  function handleUpload() {
    if (visualFile) {
      const formdata = new FormData();

      formdata.append('Toptext', memeCanvasState.toptext);
      formdata.append('Bottomtext', memeCanvasState.bottomtext);
      formdata.append('VisualFile', visualFile);

      if (soundFile) {
        formdata.append('SoundFile', soundFile);
      }

      setIsLoading(true);

      axios
        .post(`${protocol}://${apiHost}/Memes`, formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          setMemeCanvasState({
            toptext: '',
            toptextID: 0,
            toptextVotes: 0,
            bottomtext: '',
            bottomtextID: 0,
            bottomtextVotes: 0,
            visualFileURL: '',
            visualFileID: 0,
            visualVotes: 0,
            soundFileURL: '',
            soundFileID: 0,
            soundVotes: 0,
            isGif: false,
          });

          setVisualFile(undefined);
          setSoundFile(undefined);

          setReset('');
          setIsLoading(false);
        })
        .then(() => {
          setReset('reset');
        });
    }
  }

  function fileChangeHandler(v: string, event: React.SyntheticEvent<HTMLElement>) {
    const target = event.currentTarget as HTMLInputElement;
    if (target.files) {
      const fr = new FileReader();

      if (target.name === 'visualFile') {
        fr.onload = () => {
          setMemeCanvasState({
            ...memeCanvasState,
            visualFileURL: fr.result as string,
            isGif: (fr.result as string).startsWith('data:image/gif;'),
          });
        };
        setVisualFile(target.files[0]);
      } else if (target.name === 'soundFile') {
        fr.onload = () =>
          setMemeCanvasState({ ...memeCanvasState, soundFileURL: fr.result as string });
        setSoundFile(target.files[0]);
      }

      fr.readAsDataURL(target.files[0]);
    }
  }

  return (
    <div key={reset} className="Upload-page">
      <Form className="Login-form">
        <FormGroup>
          <ControlLabel>Toptext</ControlLabel>
          <FormControl
            name="toptext"
            onChange={(v, e) => setMemeCanvasState({ ...memeCanvasState, toptext: v })}
          />
          <HelpBlock tooltip={true}>The toptext of your dank meme</HelpBlock>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Bottomtext</ControlLabel>
          <FormControl
            name="bottomtext"
            onChange={(v, e) => setMemeCanvasState({ ...memeCanvasState, bottomtext: v })}
          />
          <HelpBlock tooltip={true}>Pretty self explanatory tbh</HelpBlock>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Meme</ControlLabel>
          <Input
            type="file"
            name="visualFile"
            accept=".png,.jpg,.jpeg,.mp4,.gif"
            onChange={fileChangeHandler}
          />
        </FormGroup>
        {/* disabled because of lack of interest in sound memes
        {<FormGroup>
          <ControlLabel>Optional soundfile</ControlLabel>
          <Input type="file" name="soundFile" accept=".mp3,.wav" onChange={fileChangeHandler} />
        </FormGroup>} 
        */}
        <FormGroup>
          <ButtonToolbar>
            <UpLoadButton
              toolTipString={toolTipString}
              readyForUpload={readyToUpload}
              handleUpload={handleUpload}
            />
          </ButtonToolbar>
        </FormGroup>
        <MemeLoader isloading={isLoading} />
      </Form>
      <MemeDisplayer className="Meme-preview-container" memeState={memeCanvasState} />
      <ReactTooltip id="submit" place="top" effect="solid">
        {toolTipString}
      </ReactTooltip>
    </div>
  );
};

export default UploadPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Icon, IconButton, InputNumber, Row, SelectPicker, Slider } from 'rsuite';
import axios from 'axios';
import { MemeDisplayer } from './MemeDisplayer';
import {
  login,
  MemeCanvasState,
  MemeVoteState,
  useMemeStackState,
  useMountEffect,
  useConfig,
  userstate,
  Upvote
} from './State';
import { Votebuttons } from './VoteButtons';
import { apiHost, mediaHost, protocol } from './App';

function handleVote(userstate:userstate, login:login,type: string, ids: number[]) {
  return function (upvote: Upvote) {
    
    const formdata = new FormData();
    formdata.append('type', type);
    
    for (let i = 0; i < ids.length; i++) {
      formdata.append('ElementIDs', ids[i].toString());
    }
    const headers =  {
      'Content-Type': 'multipart/form-data',
      auth: userstate.token
    }

    var token = "";

    formdata.append('UpVote', JSON.stringify(upvote));
    axios
    .post(`${protocol}://${apiHost}/Votes/`, formdata, {
      headers
    })
    .then((response) => {
      token = response.data.token;
    });
   
    login(
      {
        isLoggedIn: userstate.isLoggedIn,
        token: userstate.token,
        Username: userstate.Username,
        Email: '',
        profilePicURL: 'default.jpg',
      }
    );
  }
}

const MemeVoteList : React.FC<{
  voteState:MemeVoteState;
  memeCanvasState:MemeCanvasState;
  userstate: userstate;
  login:login
  vote: (type: string) => (isUpvote: Upvote) => void;
}> = (props) => {

  const handleToptextVote = handleVote(props.userstate,props.login,'toptext', [props.memeCanvasState.toptextID]);
  const handleBottomtextVote = handleVote(props.userstate,props.login,'bottomtext', [props.memeCanvasState.bottomtextID]);
  const handleVisualVote = handleVote(props.userstate,props.login,'visual', [props.memeCanvasState.visualFileID]);
  const handlesoundVote = handleVote(props.userstate,props.login,'sound', [props.memeCanvasState.soundFileID]);

  return (
    <div className="vote-component-container">
      <li key={0} className="vote-component">
        <Votebuttons
          state={props.voteState.visual}
          voteCount={props.memeCanvasState.visualVotes}
          setVote={props.vote('visual')}
          isLoggedIn={props.userstate.isLoggedIn}
          size="small-vote"
          vote={handleVisualVote}
        />
        <h3>Visual</h3>
      </li>
      {props.memeCanvasState.toptext ? (
        <li key={1} className="vote-component">
          <Votebuttons
            state={props.voteState.toptext}
            voteCount={props.memeCanvasState.toptextVotes}
            setVote={props.vote('toptext')}
            isLoggedIn={props.userstate.isLoggedIn}
            size="small-vote"
            vote={handleToptextVote}
          />
          <h3>Toptext</h3>
        </li>
      ) : null}
      {props.memeCanvasState.bottomtext ? (
        <li key={2} className="vote-component">
          <Votebuttons
            state={props.voteState.bottomtext}
            voteCount={props.memeCanvasState.bottomtextVotes}
            setVote={props.vote('bottomtext')}
            isLoggedIn={props.userstate.isLoggedIn}
            size="small-vote"
            vote={handleBottomtextVote}
          />
          <h3>Bottomtext</h3>
        </li>
      ) : null}
      {props.memeCanvasState.soundFileURL ? (
        <li key={3} className="vote-component">
          <Votebuttons
            state={props.voteState.sound}
            voteCount={props.memeCanvasState.soundVotes}
            setVote={props.vote('sound')}
            isLoggedIn={props.userstate.isLoggedIn}
            size="small-vote"
            vote={handlesoundVote}
          />
          <h3>Sound</h3>
        </li>
      ) : null}
    </div>
  );
} 

const MemeControleButton: React.FC<{
  isAllowed: boolean;
  className: string;
  isRight: boolean;
  onClick(): void;
}> = (props) => {
  const iconToUse = <Icon icon={props.isRight ? 'arrow-right' : 'arrow-left'} />;

  let button;
  if (props.isAllowed) {
    button = (
      <IconButton
        className={props.className}
        icon={iconToUse}
        appearance="primary"
        onClick={props.onClick}
        placement={props.isRight ? 'right' : 'left'}
      >
        {props.isRight ? 'forward' : 'back'}
      </IconButton>
    );
  } else {
    button = (
      <IconButton
        className={props.className}
        disabled={true}
        icon={iconToUse}
        appearance="primary"
        onClick={props.onClick}
        placement={props.isRight ? 'right' : 'left'}
      >
        {props.isRight ? 'forward' : 'back'}
      </IconButton>
    );
  }
  return button;
};

const MemeComponentSelector : React.FC<{
  type:string;
  value:string;
  onChange(value:string,id:number,votes:number): void
}> = (props) => {
  
  var elements : {value:{data:string,id:number},label:string}[] = []

  axios.get(`${protocol}://${apiHost}/${props.type.toLowerCase()}s/`)
  .then((response) => {elements = response.data.forEach((element: {id:number, filename: string; memetext:string }) => {
    const data = element.filename ? element.filename : element.memetext
    elements.push({
      value: {data:data,id:element.id},
      label: data
    })
  });});

  function handleChange(element:{id:number,data:string} | null,onChange:(value:string,id:number,votes:number) => void){
    if (element){
    axios.get(`${protocol}://${apiHost}/${props.type.toLowerCase()}s/${element.id}`)
    .then((v) => {
      onChange(v.data.data,element.id,v.data.votes)
    })}else{
      onChange("",0,0)
    }
  }

  function valueToLabel(type:string,v:string){
    if (props.type === "Sound" || props.type === "Visual"){
      const arr = v.split('/')
      return arr[arr.length -1]
    } else {
      return v
    }
  }

  console.log("draw")

  return (
    <SelectPicker 
    size="lg"
    placeholder={props.value ? valueToLabel(props.type,props.value) : `Select ${props.type}`}
    data={elements}
    onChange={(v:{data:string,id:number},e) => handleChange(v, props.onChange)}
    />
  );
}

const MemeConfigGroup : React.FC<{
  name:String;
  numValue:number;
  setNumValue(num:number): void;
}> = (props) => {
  return (
    <div>
      <h2>{props.name}</h2>
      <Row>
      <Col md={20}>
        <Slider
          progress
          tooltip={true}
          style={{ marginTop: 16 }}
          value={props.numValue}
          onChange={value => {
            props.setNumValue(value);
          }}
        />
      </Col>
      <Col md={4}>
        <InputNumber
          min={0}
          max={100}
          value={props.numValue}
          onChange={value => {
            props.setNumValue(props.numValue);
          }}
        />
      </Col>
    </Row>
    </div>
  );
}

const MemeConfigurator :React.FC<{
  soundChance:number;
  toptextChance:number;
  bottomtextChance:number;
  memeCanvasState:MemeCanvasState;
  settoptextChance(val:number): void;  
  setbottomtextChance(val:number): void;  
  setsoundChance(val:number): void;
  setMemeCanvasState(state:MemeCanvasState) :void;
  flipVisualConfigured():void;
  flipToptextConfigured():void;
  flipBottomtextConfigured():void;
  flipSoundConfigured():void;
}> = (props) => {
  return (
    <div className="config-component-container">
      <h2>Visual</h2>
      <MemeComponentSelector type="Visual" 
        onChange={
          (v,id,votes) => {
            props.setMemeCanvasState(
              {...props.memeCanvasState,
                visualFileURL:v,
                visualFileID:id,
                visualVotes:votes
              });
            props.flipVisualConfigured();
            }
          } 
        value={props.memeCanvasState.visualFileURL}
      />
      <MemeConfigGroup name="Toptext" numValue={props.toptextChance} setNumValue={props.settoptextChance}></MemeConfigGroup>
      <MemeComponentSelector type="Toptext" 
        onChange={
          (v,id,votes) => {
            props.setMemeCanvasState(
              {...props.memeCanvasState,
                toptext:v,
                toptextID:id,
                toptextVotes:votes
              });
            props.flipToptextConfigured();
          } 
        }
        value={props.memeCanvasState.toptext}
      />
      <MemeConfigGroup name="Bottomtext" numValue={props.bottomtextChance} setNumValue={props.setbottomtextChance}></MemeConfigGroup>
      <MemeComponentSelector type="Bottomtext" 
        onChange={
          (v,id,votes) =>{ 
            props.setMemeCanvasState(
              {...props.memeCanvasState,
                bottomtext:v,
                bottomtextID:id,
                bottomtextVotes:votes
              });
            props.flipBottomtextConfigured();
          }
        } 
        value={props.memeCanvasState.bottomtext}
      />
      <MemeConfigGroup name="Sound" numValue={props.soundChance} setNumValue={props.setsoundChance}></MemeConfigGroup>
      <MemeComponentSelector type="Sound" 
        onChange={
          (v,id,votes) => { 
            props.setMemeCanvasState(
              {...props.memeCanvasState,
                soundFileURL:v,
                soundFileID:id,
                soundVotes:votes
              });
            props.flipSoundConfigured();
          } 
        }
        value={props.memeCanvasState.soundFileURL}
      />
  </div>
  );
}


  

export async function getResourceOnChance(
  fetchURL: string,
  chance: number
): Promise<{ id: number; votes: number; data: string }> {
  if (Math.floor(Math.random() * 100) < chance) {
    return axios.get(fetchURL).then((response) => response.data);
  } else {
    return { id: 0, votes: 0, data: '' };
  }
}

export async function getRandom(
  memeCanvasState:MemeCanvasState,
  append: (memeState: MemeCanvasState, voteState: MemeVoteState) => void,
  config: {
    soundChance:number,
    toptextChance:number,
    bottomtextChance:number,
    visualConfigured:boolean,
    toptextConfigured:boolean,
    bottomtextConfigured:boolean,
    soundConfigured:boolean,
  }
) {
  let visualResource = await getResourceOnChance(`${protocol}://${apiHost}/Visuals/random`, 100);
  
  //todo disabled because lack of interest in sound memes
  //let soundResource = await getResourceOnChance(
  //  `${protocol}://${apiHost}/Sounds/random`,
  //  config.soundChance
  //);
  let soundResource = {
    id:0,
    votes:0,
    data:""
  };
  let toptextResource = await getResourceOnChance(
    `${protocol}://${apiHost}/Texts/random/Toptext`,
    config.toptextChance
  );
  let bottomtextResource = await getResourceOnChance(
    `${protocol}://${apiHost}/Texts/random/Bottomtext`,
    config.bottomtextChance
  );


  if(config.visualConfigured){
    visualResource = {id:memeCanvasState.visualFileID,data:memeCanvasState.visualFileURL,votes:memeCanvasState.visualVotes}
  }
  if(config.toptextConfigured){
    toptextResource = {id:memeCanvasState.bottomtextID,data:memeCanvasState.bottomtext,votes:memeCanvasState.bottomtextVotes}
  }
  if(config.bottomtextConfigured){
    bottomtextResource = {id:memeCanvasState.toptextID,data:memeCanvasState.toptext,votes:memeCanvasState.toptextVotes}
  }
  if(config.soundConfigured){
    soundResource = {id:memeCanvasState.soundFileID,data:memeCanvasState.soundFileURL,votes:memeCanvasState.soundVotes}
  }
  
  append(
    {
      toptext: toptextResource.data,
      toptextID: toptextResource.id,
      toptextVotes: visualResource.votes,
      bottomtext: bottomtextResource.data,
      bottomtextID: bottomtextResource.id,
      bottomtextVotes: bottomtextResource.votes,
      visualFileURL: visualResource.data,
      visualFileID: visualResource.id,
      visualVotes: visualResource.votes,
      soundFileURL: soundResource.data,
      soundFileID: soundResource.id,
      soundVotes: soundResource.votes,
      isGif: visualResource.data.endsWith('.gif'),
    },
    {
      meme: Upvote.Unvote,
      visual: Upvote.Unvote,
      toptext: Upvote.Unvote,
      bottomtext: Upvote.Unvote,
      sound: Upvote.Unvote,
    }
  );
}



const MemePage: React.FC<{
  advancedMode:boolean ;
  userstate: userstate;
  login:login
}> = (props) => {
  const {
    memeCanvasState,
    memeCanvasStackState,
    memeStackPointer,
    canGoBack,
    canGoForward,
    voteState,
    setMemeCanvasState,
    vote,
    append,
    goBack,
    goForward,
  } = useMemeStackState();
  const {
    soundChance,
    bottomtextChance,
    toptextChance,
    setsoundChance,
    setbottomtextChance,
    settoptextChance
  } = useConfig();

  const [visualConfigured, setVisualConfigured] = useState(false);
  const [toptextConfigured, setToptextConfigured] = useState(false);
  const [bottomtextConfigured, setBottomtextConfigured] = useState(false);
  const [soundConfigured, setSoundConfigured] = useState(false);

  const config = {
    soundChance:soundChance,
    toptextChance:toptextChance,
    bottomtextChance:bottomtextChance,
    visualConfigured:visualConfigured,
    toptextConfigured:toptextConfigured,
    bottomtextConfigured:bottomtextConfigured,
    soundConfigured:soundConfigured,
  }
  

  // on mount do this once
  useMountEffect(function AppendInitialMeme() {
    getRandom(memeCanvasState,append,config);
  });

  
  const memeIds = [memeCanvasState.visualFileID];
  if (memeCanvasState.toptext) memeIds.push(memeCanvasState.toptextID);
  if (memeCanvasState.bottomtext) memeIds.push(memeCanvasState.bottomtextID);
  if (memeCanvasState.soundFileURL) memeIds.push(memeCanvasState.soundFileID);
  const handleMemeVote = handleVote(props.userstate,props.login,'meme', memeIds);

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
      {props.advancedMode ? 
      <MemeVoteList voteState={voteState} memeCanvasState={memeCanvasState} userstate={props.userstate} login={props.login} vote={vote}/> 
      : null}
      <div className="random-container">
        <Votebuttons
          state={voteState.meme}
          voteCount={0}
          setVote={vote('meme')}
          isLoggedIn={props.userstate.isLoggedIn}
          size="normal-vote"
          vote={handleMemeVote}
        />
        <MemeDisplayer className="Meme-container" memeState={memeCanvasState}>
          <div className="Meme-button-container">
            <MemeControleButton
              className="Meme-button"
              isAllowed={canGoBack}
              isRight={false}
              onClick={goBack}
            />
            <Button
              className="Meme-button"
              appearance="primary"
              onClick={function GetRandomAppend() {
                getRandom(memeCanvasState,append,config);
              }}
            >
              New meme
            </Button>
            <MemeControleButton
              className="Meme-button"
              isAllowed={canGoForward}
              isRight={true}
              onClick={goForward}
            />
          </div>
          <h1>{memeStackPointer}</h1>
        </MemeDisplayer>
      </div>
      {props.advancedMode ? 
        <MemeConfigurator 
          soundChance={soundChance} 
          toptextChance={toptextChance} 
          bottomtextChance={bottomtextChance} 
          setsoundChance={setsoundChance}
          settoptextChance={settoptextChance}
          setbottomtextChance={setbottomtextChance}
          memeCanvasState={memeCanvasState}
          setMemeCanvasState={setMemeCanvasState}
          flipVisualConfigured={() => setVisualConfigured(!visualConfigured)}
          flipToptextConfigured={() => setToptextConfigured(!toptextConfigured)}
          flipBottomtextConfigured={() => setBottomtextConfigured(!bottomtextConfigured)}
          flipSoundConfigured={() => setSoundConfigured(!soundConfigured)}
        /> 
        : null}
    </div>
  );
};

export default MemePage;

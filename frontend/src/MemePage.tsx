import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, IconButton, Input } from 'rsuite';
import axios from 'axios';
import { MemeDisplayer } from './MemeDisplayer';
import {
  email,
  isLoggedIn,
  login,
  MemeCanvasState,
  MemeVoteState,
  profilePic,
  settings,
  useMemeStackState,
  useMountEffect,
  userName,
  useConfig
} from './State';
import { Votebuttons } from './VoteButtons';
import { apiHost } from './App';

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
  append: (memeState: MemeCanvasState, voteState: MemeVoteState) => void,
  config: {soundChance:number, toptextChance:number,bottomtextChance:number}
) {
  const visualResource = await getResourceOnChance(`https://${apiHost}/meme/random/visual`, 100);
  const soundResource = await getResourceOnChance(
    `https://${apiHost}/meme/random/sound`,
    config.soundChance
  );
  const toptextResource = await getResourceOnChance(
    `https://${apiHost}/meme/random/toptext`,
    config.toptextChance
  );
  const bottomtextResource = await getResourceOnChance(
    `https://${apiHost}/meme/random/bottomtext`,
    config.bottomtextChance
  );
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
      meme: undefined,
      visual: undefined,
      toptext: undefined,
      bottomtext: undefined,
      sound: undefined,
    }
  );
}

const MemePage: React.FC<
  settings & { userstate: isLoggedIn & userName & profilePic & email } & login
> = (props) => {
  const {
    memeCanvasState,
    memeStackPointer,
    canGoBack,
    canGoForward,
    voteState,
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

  function handleVote(type: string, ids: number[]) {
    return function (upvote: boolean | undefined) {
      
      const formdata = new FormData();
      formdata.append('type', type);
      
      for (let i = 0; i < ids.length; i++) {
        formdata.append('ids', ids[i].toString());
      }
      const headers =  {
        'Content-Type': 'multipart/form-data',
        auth: props.userstate.token,
      }

      var token = "";

      if (upvote !== undefined){
        formdata.append('upvote', JSON.stringify(upvote));
        axios
        .post(`https://${apiHost}/vote/`, formdata, {
          headers
        })
        .then((response) => {
          token = response.data.token;
        });
      } else {
        axios
        .delete(`https://${apiHost}/vote/`, {
            headers
        })
        .then((response) => {
          token = response.data.token;
        });
      } 
      props.login({ ...props.userstate, token: token });
    }
  }

  const memeIds = [memeCanvasState.visualFileID];
  if (memeCanvasState.toptext) memeIds.push(memeCanvasState.toptextID);
  if (memeCanvasState.bottomtext) memeIds.push(memeCanvasState.bottomtextID);
  if (memeCanvasState.soundFileURL) memeIds.push(memeCanvasState.soundFileID);

  const handleMemeVote = handleVote('meme', memeIds);
  const handleToptextVote = handleVote('toptext', [memeCanvasState.toptextID]);
  const handleBottomtextVote = handleVote('bottomtext', [memeCanvasState.bottomtextID]);
  const handleVisualVote = handleVote('visual', [memeCanvasState.visualFileID]);
  const handlesoundVote = handleVote('sound', [memeCanvasState.soundFileID]);

  const voteList = (
    <div className="vote-component-container">
      <li key={0} className="vote-component">
        <Votebuttons
          state={voteState.visual}
          voteCount={memeCanvasState.visualVotes}
          setVote={vote('visual')}
          isLoggedIn={props.userstate.isLoggedIn}
          size="small-vote"
          vote={handleVisualVote}
        />
        <h3>Visual</h3>
      </li>
      {memeCanvasState.toptext ? (
        <li key={1} className="vote-component">
          <Votebuttons
            state={voteState.toptext}
            voteCount={memeCanvasState.toptextVotes}
            setVote={vote('toptext')}
            isLoggedIn={props.userstate.isLoggedIn}
            size="small-vote"
            vote={handleToptextVote}
          />
          <h3>Toptext</h3>
        </li>
      ) : null}
      {memeCanvasState.bottomtext ? (
        <li key={2} className="vote-component">
          <Votebuttons
            state={voteState.bottomtext}
            voteCount={memeCanvasState.bottomtextVotes}
            setVote={vote('bottomtext')}
            isLoggedIn={props.userstate.isLoggedIn}
            size="small-vote"
            vote={handleBottomtextVote}
          />
          <h3>Bottomtext</h3>
        </li>
      ) : null}
      {memeCanvasState.soundFileURL ? (
        <li key={3} className="vote-component">
          <Votebuttons
            state={voteState.sound}
            voteCount={memeCanvasState.soundVotes}
            setVote={vote('sound')}
            isLoggedIn={props.userstate.isLoggedIn}
            size="small-vote"
            vote={handlesoundVote}
          />
          <h3>Sound</h3>
        </li>
      ) : null}
    </div>
  );

  const configList = (
    <div className="config-component-container">
      <h1>Chance of sound</h1>
      <Input placeholder="75" onChange={function onChange(v,e) {setsoundChance(parseInt(v));console.log(v)}}>
      </Input>
      <h1>Chance of toptext</h1>
      <Input placeholder="75" onChange={function onChange(v,e) {settoptextChance(parseInt(v));console.log(v)}}>
      </Input>
      <h1>Chance of bottomtext</h1>
      <Input placeholder="75" onChange={function onChange(v,e) {setbottomtextChance(parseInt(v));console.log(v)}}>
      </Input>
    </div>
  );

  const config = {
    soundChance:soundChance,
    toptextChance:toptextChance,
    bottomtextChance:bottomtextChance,
  }

  // on mount do this once
  useMountEffect(function AppendInitialMeme() {
    getRandom(append,config);
  });

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
                getRandom(append,config);
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
      {props.advancedMode ? configList : null}
    </div>
  );
};

export default MemePage;

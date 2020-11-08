import { EffectCallback, useEffect, useState } from 'react';

export type isLoggedIn = {
  isLoggedIn: boolean;
  token: string;
};

export type userName = {
  username: string;
};

export type profilePic = {
  profilePicURL: string;
};

export type email = {
  email: string;
};

export type login = {
  login(userState: isLoggedIn & userName & profilePic & email): void;
};

export type signout = {
  signout(): void;
};

export const useUserState = () => {
  const [userState, setUserState] = useState({
    isLoggedIn: false,
    token: '',
    username: 'LonelyCrab',
    email: '',
    profilePicURL: 'default.jpg',
  });

  function login(userState: isLoggedIn & userName & profilePic & email) {
    setUserState(userState);
  }

  function signout() {
    setUserState({
      isLoggedIn: false,
      token: '',
      username: 'LoneliestCrab',
      email: '',
      profilePicURL: 'default.jpg',
    });
  }
  return { userState, login, signout };
};

export type MemeCanvasState = {
  toptext: string;
  toptextID: number;
  toptextVotes: number;
  bottomtext: string;
  bottomtextID: number;
  bottomtextVotes: number;
  visualFileURL: string;
  visualFileID: number;
  visualVotes: number;
  soundFileURL: string;
  soundFileID: number;
  soundVotes: number;
  isGif: boolean;
};

export const useMemeCanvasState = () => {
  const [memeCanvasState, setMemeCanvasState] = useState<MemeCanvasState>({
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
  return { memeCanvasState, setMemeCanvasState };
};

export type VoteState = {
  upvoted: boolean;
  downvoted: boolean;
  voteCount: number;
};

export type MemeVoteState = {
  [index: string]: boolean | undefined;
  meme: boolean | undefined;
  visual: boolean | undefined;
  toptext: boolean | undefined;
  bottomtext: boolean | undefined;
  sound: boolean | undefined;
};

export const useMemeStackState = () => {
  const { memeCanvasState, setMemeCanvasState } = useMemeCanvasState();
  const [voteState, setVoteState] = useState<MemeVoteState>({
    meme: undefined,
    visual: undefined,
    toptext: undefined,
    bottomtext: undefined,
    sound: undefined,
  });

  const [memeCanvasStackState, setMemCanvaseStackState] = useState([memeCanvasState]);
  const [memeVoteStackState, setMemeVoteStackState] = useState([voteState]);

  const [memeStackPointer, setMemeStackPointer] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setcanGoForward] = useState(false);

  useEffect(() => {
    setMemeCanvasState(memeCanvasStackState[memeStackPointer]);
    const copy = { ...memeVoteStackState[memeStackPointer] };
    setVoteState(copy);
  }, [memeStackPointer, memeCanvasStackState, memeVoteStackState, setMemeCanvasState]);

  useEffect(() => {
    setCanGoBack(memeStackPointer !== 0);
  }, [memeStackPointer]);

  useEffect(() => {
    setcanGoForward(memeStackPointer !== memeCanvasStackState.length - 1);
  }, [memeStackPointer, memeCanvasStackState.length]);

  function append(newMemeCanvasState: MemeCanvasState, newMemeVoteState: MemeVoteState) {
    if (memeCanvasStackState[0].visualFileURL === '') {
      setMemCanvaseStackState([newMemeCanvasState]);
      setMemeVoteStackState([newMemeVoteState]);
    } else {
      const copy = [...memeCanvasStackState, newMemeCanvasState];
      setMemCanvaseStackState(copy);

      const copy2 = [...memeVoteStackState, newMemeVoteState];
      copy2[memeStackPointer] = voteState;
      setMemeVoteStackState(copy2);

      setMemeStackPointer(copy.length - 1);
    }
  }

  function vote(type: string) {
    return function (isUpvote: boolean) {
      const copy = { ...voteState };
      copy[type] = isUpvote;
      setVoteState(copy);
    };
  }

  function goBack() {
    const copy2 = [...memeVoteStackState];
    copy2[memeStackPointer] = voteState;
    setMemeVoteStackState(copy2);
    setMemeStackPointer(memeStackPointer - 1);
  }

  function goForward() {
    const copy2 = [...memeVoteStackState];
    copy2[memeStackPointer] = voteState;
    setMemeVoteStackState(copy2);
    setMemeStackPointer(memeStackPointer + 1);
  }

  return {
    memeCanvasState,
    memeStackPointer,
    canGoBack,
    canGoForward,
    voteState,
    vote,
    append,
    goBack,
    goForward,
  };
};

export type settings = {
  advancedMode: boolean;
};

export const useSettings = () => {
  const [advancedMode, setAdvancedMode] = useState(false);
  return { advancedMode, setAdvancedMode };
};

export const useMountEffect = (fun: EffectCallback) => useEffect(fun, []);

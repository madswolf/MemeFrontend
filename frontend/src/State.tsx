import {useEffect, useState} from 'react';

export type isLoggedIn = {
    isLoggedIn:boolean,
    setIsLoggedIn?(x:boolean) : void
}

export type userName = {
    username:string
}

export type profilePic = {
    profilePicURL:string
}

export type email = {
    email:string,
}

export type login = {
    login({username,email,profilePicURL}:userName & email & profilePic) :void
}

export type signout = {
    signout():void
}


export const useUserState = () : isLoggedIn & userName & profilePic & email & login & signout => {
    const [isLoggedIn,setIsLoggedIn] = useState(true);
    const [username,setUsername] = useState('LoneliestCrab');
    const [email,setEmail] = useState('theLoneliestCrab@crabmail.com');
    const [profilePicURL,setProfilePicURL] = useState('https://pbs.twimg.com/profile_images/1132302593521311744/pT5xEDTL_400x400.jpg');
    
    function login ({username,email,profilePicURL}:userName & email & profilePic) {
        setIsLoggedIn(true);
        setUsername(username);
        setEmail(email);
        setProfilePicURL(profilePicURL);
    }

    function signout() {
        setIsLoggedIn(false);
        setUsername('LoneliestCrab');
        setEmail('theLoneliestCrab@crabmail.com');
        setProfilePicURL('https://pbs.twimg.com/profile_images/1132302593521311744/pT5xEDTL_400x400.jpg');
    }
    return {isLoggedIn,username,email,profilePicURL,login,signout}
}

export type MemeCanvasState = {
    toptext: string;
    bottomtext: string;
    visualFileURL: string;
    soundFileURL: string;
    isGif:boolean;
}

export const useMemeCanvasState = () => {
    const [memeState,setMemeState] = useState({toptext:"",bottomtext:"",visualFileURL:"",soundFileURL:"",isGif:false});
    return {memeState,setMemeState};
}

export const useMemeStackState = () => {


    const {memeState, setMemeState} = useMemeCanvasState();
    const [memeStackState,setMemeStackState] = useState<MemeCanvasState[]>([memeState]);

    const [memeStackPointer,setMemeStackPointer] = useState(0);
    const [canGoBack,setCanGoBack] = useState(false);
    const [canGoForward,setcanGoForward] = useState(false);

    useEffect(() => {
        setMemeState(memeStackState[memeStackPointer])
    });
    
    useEffect(() =>{
        setCanGoBack(memeStackPointer !== 0);
    })

    useEffect(() =>{
        setcanGoForward(memeStackPointer !== (memeStackState.length - 1));
    })


    function append(memeState:MemeCanvasState){
        if(memeStackState[0].visualFileURL === ""){
            setMemeStackState([memeState]);
        }  else {
            var copy = [...memeStackState,memeState];
            setMemeStackState(copy);
            setMemeStackPointer(copy.length - 1);
        }
    }

    function goBack(){
        setMemeStackPointer(memeStackPointer - 1);
    }

    function goForward(){
        setMemeStackPointer(memeStackPointer + 1); 
    }

    return {memeState,memeStackPointer,canGoBack,canGoForward,append,goBack,goForward};
}

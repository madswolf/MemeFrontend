import {useEffect, useState} from 'react';

export type isLoggedIn = {
    isLoggedIn:boolean,
    token:string
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
    login(userState:(isLoggedIn & userName & profilePic & email)):void
}

export type signout = {
    signout():void
}


export const useUserState = () => {
    const [userState,setUserState] = useState({isLoggedIn:false,token:"",username:"LonelyCrab",email:"",profilePicURL:"default.png"});
    
    function login (userState:(isLoggedIn & userName & profilePic & email)) {
       setUserState(userState)
    }

    function signout() {
        setUserState({isLoggedIn:false,token:"",username:"LoneliestCrab",email:"",profilePicURL:"default.png"})
    }
    return {userState,login,signout}
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

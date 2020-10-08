import {useState} from 'react';

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


export const useMemeCanvasState = () => {
    const [memeState,setMemeState] = useState({toptext:"",bottomtext:"",visualFileURL:"",soundFileURL:""});
    return {memeState,setMemeState};
}

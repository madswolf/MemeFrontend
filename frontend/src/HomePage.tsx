import React from 'react';
import {Button} from 'rsuite';
import 'rsuite/dist/styles/rsuite-dark.css';

function UserGreeting(username:string){
    return (
      <div className='Greeting'>
        <h1>Welcome back {username}!</h1>
      </div>
    );
}

function GuestGreeting(){
  return (
    <div className='Greeting'>
      <h1>Hello you lonely crab</h1>
      <h1>Log in or sign up and maybe you won't be so lonely anymore</h1>
      <Button>Login</Button>
    </div>
  );    
}

function Greeting({isLoggedIn,username}:HomePageProps){
  if (isLoggedIn) {
    return UserGreeting(username);
  } else {
    return GuestGreeting();
    }
}

interface HomePageProps {
  isLoggedIn:boolean,
  username: string
}

function HomePage (props:HomePageProps){
    return(
      <div className="Home-page">
        {Greeting(props)}
      </div>
    );
  }

export default HomePage;
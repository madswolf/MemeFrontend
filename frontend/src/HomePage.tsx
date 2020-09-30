import React from 'react';
import {Button} from 'rsuite';
import 'rsuite/dist/styles/rsuite-dark.css';
import { isLoggedIn, userName } from './State';

const UserGreeting:React.FC<userName> =  (props) =>{
    return (
      <div className='Greeting'>
        <h1>Welcome back {props.username}!</h1>
      </div>
    );
}

const GuestGreeting:React.FC =  (props) =>{
  return (
    <div className='Greeting'>
      <h1>Hello you lonely crab</h1>
      <h1>Log in or sign up and maybe you won't be so lonely anymore</h1>
      <Button>Login</Button>
    </div>
  );    
}

const Greeting:React.FC<(isLoggedIn & userName)> =  (props) =>{
  if (props.isLoggedIn) {
    return <UserGreeting username={props.username} />
  } else {
    return <GuestGreeting />;
    }
}

const HomePage:React.FC<(isLoggedIn & userName)> =  (props) =>{
    return(
      <div className="Home-page">
        {Greeting(props)}
      </div>
    );
  }

export default HomePage;
import React from 'react';
import IState from './State';
import Link from './Link';
import logo from './lonelyCrab.jpg';

function UserGreeting(username:string){
    return <h1>Welcome back {username}!</h1>
}

function GuestGreeting(){
  return <h1>Hello you lonely crab</h1>
}

function Greeting({isLoggedIn,username}:IState){
  if (isLoggedIn) {
    return UserGreeting(username);
  } else {
    return GuestGreeting();
  } 
}
function userPage(props:IState){
    return(
      <div>  
          <Greeting isLoggedIn={props.isLoggedIn} username={props.username}/>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            <Link text={'hello'} onClick={test}/> 
            {/*add login button that shows a textbox for username and password*/}
            <Link text={'hello'} onClick={test}/>
            <Link text={'hello'} onClick={test}/>
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
      </div>
    )
}
export default userPage;
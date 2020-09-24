import React from 'react';
import logo from './LonelyCrab.jpg';
import IState from './State';

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

class UserPage extends React.Component<IState>{
    render(){
        return(
          <div>  
              <Greeting isLoggedIn={this.props.isLoggedIn} username={this.props.username}/>
              <img src={logo} className="App-logo" alt="logo" />
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
          </div>
        );
    }
}

export default UserPage;
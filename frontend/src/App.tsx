import React from 'react';
import logo from './lonelyCrab.jpg';
import './App.css';
import Link from './Link'

type greetingProp = {
  isLoggedIn: boolean,
  username: string,
}

function test() {
  console.log('hello');
}

function UserGreeting(username:string){
return <h1>Welcome back {username}!</h1>
}

function GuestGreeting(){
  return <h1>Hello you lonely crab</h1>
}

function Greeting({isLoggedIn,username}:greetingProp){
  if (isLoggedIn) {
    return UserGreeting(username);
  } else {
    return GuestGreeting();
  } 
}
interface IProps {
}
interface IState {
  isLoggedIn : boolean,
  username : string,
}

class App extends React.Component<IProps,IState> {
  constructor(props:IState){
    super(props);
    this.state = {
      isLoggedIn: false,
      username: '',
    }
  }
  
  render(){
    return (
      <div className="App">
        <header className="App-header">
          <Greeting isLoggedIn={this.state.isLoggedIn} username={this.state.username}/>
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
        </header>
      </div>
    );
  }
}


export default App;

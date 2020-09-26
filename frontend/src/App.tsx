import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import './App.css';
import {UserPage,UserPicture} from './UserPage';
import {LoginPage} from './LoginPage';
import MemePage from './MemePage';
import IState from './State';

interface IProps {
}

function NavBar(props:IState){
  let userLink;
  if (props.isLoggedIn){
    userLink = (<li><Link to={'/User'}>UserPage</Link></li>);
  } else {
    userLink = (<li><Link to={'/Login'}>Login</Link> </li>)
  }
  return (
    <div>
      <nav>
        <ul>
          <li><Link to={'/Memes'}>MemePage</Link> </li>
          {userLink}
        </ul>
      </nav>
    </div>
  );
}

class App extends React.Component<IProps,IState> {
  constructor(props:IState){
    super(props);
    this.state = {
      isLoggedIn: true,
      username: 'LoneliestCrab',
      email: "theLoneliestCrab@crabmail.com",
      profilePicURL: "https://pbs.twimg.com/profile_images/1132302593521311744/pT5xEDTL_400x400.jpg"
    }
  }
  
  render(){
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            {NavBar(this.state)}
            {/*add navigation and utility*/}
          </header>
          <body className="App-body">
            <Route path='/User' render={() => (this.state.isLoggedIn ? UserPage(this.state) : <Redirect to="/Login"/>)}/>
            <Route path='/Login' render={() => (LoginPage(this.state))}/>
            <Route path='/Memes' render={() => (MemePage(this.state))}/>
          </body>
        </div>
      </Router>
    );
  }
}


export default App;

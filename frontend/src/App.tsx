import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import './App.css';
import {UserPage,UserPicture} from './UserPage';
import {LoginPage} from './LoginPage';
import MemePage from './MemePage';
import IState from './State';
import { Dropdown, Nav, Navbar, } from 'rsuite';
import 'rsuite/dist/styles/rsuite-dark.css';
import logo from './mads_monster_logo.png'; 
import HomePage from './HomePage';

interface IProps {
}

function navBar(props:IState){
  let userLink;
  if (props.isLoggedIn){
    userLink = (
    <Dropdown title={UserPicture(props.profilePicURL,"navbar")}>
      <Dropdown.Item componentClass={Link} to={'/User'}>UserPage</Dropdown.Item>
      <Dropdown.Item>Settings</Dropdown.Item> 
    </Dropdown>
    );
  } else {
    userLink = (<Nav.Item componentClass={Link} to='/Login'>Login</Nav.Item>);
  }

  return (
    <Navbar appearance='default' className='App-header'>
    <Navbar.Header>
      <Nav.Item componentClass={Link} to={'/'}>
        <img src={logo} alt='Mads.monster logo' className='App-logo'/>
      </Nav.Item>
    </Navbar.Header>
    <Navbar.Body>
      <Nav>
        <Nav.Item componentClass={Link} to={'/Memes'}>Memes</Nav.Item>
      </Nav>
      <Nav pullRight>
        {userLink}
      </Nav>
    </Navbar.Body>
  </Navbar>
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
          {navBar(this.state)}
          <body className="App-body">
            <Route exact path ='/' render={() => (HomePage(this.state))}/>
            <Route path='/Home' render={() => (HomePage(this.state))}/>
            <Route path='/User' render={() => (this.state.isLoggedIn ? UserPage(this.state) : <Redirect to="/Login"/>)}/>
            <Route path='/Login' render={() => (!this.state.isLoggedIn ? LoginPage(this.state) : <Redirect to="/User"/>)}/>
            <Route path='/Memes' render={() => (MemePage(this.state))}/>
          </body>
        </div>
      </Router>
    );
  }
}


export default App;

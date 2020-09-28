import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import './App.css';
import {UserPage,UserPicture} from './UserPage';
import {LoginPage} from './LoginPage';
import MemePage from './MemePage';
import { Dropdown, Nav, Navbar, } from 'rsuite';
import 'rsuite/dist/styles/rsuite-dark.css';
import logo from './mads_monster_logo.png'; 
import HomePage from './HomePage';

interface HeaderProps {
  isLoggedIn: boolean,
  profilePicURL: string,
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

function Header(props:HeaderProps){
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
      <Link to='/' className='Navbar-logo'>
        <img src={logo} alt='Mads.monster logo' className='App-logo'/>
      </Link>
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

function App (){
  const [isLoggedIn,setIsLoggedIn] = useState(true);
  const [username,setUserName] = useState('LoneliestCrab');
  const [email,setEmail] = useState('theLoneliestCrab@crabmail.com');
  const [profilePicURL,setProfilePicURL] = useState('https://pbs.twimg.com/profile_images/1132302593521311744/pT5xEDTL_400x400.jpg');
  
  return (
    <Router>
        <div className="App">
          <Header isLoggedIn={isLoggedIn} profilePicURL={profilePicURL} setIsLoggedIn={setIsLoggedIn} />
          <body className="App-body">
            <Route exact path ='/' render={() => <HomePage isLoggedIn={isLoggedIn} username={username} />}/>
            <Route path='/User' render={() => (isLoggedIn ? (<UserPage username={username} profilePicURL={profilePicURL} email={email}/>) : <Redirect to="/Login"/>)}/>
            <Route path='/Login' render={() => (!isLoggedIn ? (<LoginPage />) : <Redirect to="/User"/>)}/>
            <Route path='/Memes' render={() => (<MemePage />)}/>
          </body>
        </div>
      </Router>
  );
}


export default App;

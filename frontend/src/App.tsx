import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import './App.css';
import {UserPage,UserPicture} from './UserPage';
import {LoginPage} from './LoginPage';
import MemePage from './MemePage';
import { Dropdown, Nav, Navbar, } from 'rsuite';
import 'rsuite/dist/styles/rsuite-dark.css';
import logo from './mads_monster_logo.png'; 
import HomePage from './HomePage';
import {isLoggedIn,profilePic,signout,useUserState} from './State'
import { SignupPage } from './SignupPage';
import UploadPage from './UploadPage';
import { RecoveryPage } from './RecoveryPage';


const Header:React.FC<(isLoggedIn & profilePic & signout)> = (props) => {
  let userLink;
  if (props.isLoggedIn){
    userLink = (
    <Dropdown title={UserPicture(props.profilePicURL,"navbar")}>
      <Dropdown.Item componentClass={Link} to={'/User'}>UserPage</Dropdown.Item>
      <Dropdown.Item>Settings</Dropdown.Item> 
      <Dropdown.Item onSelect={props.signout}>Sign out</Dropdown.Item>
    </Dropdown>
    );
  } else {
    userLink = (<Nav.Item componentClass={Link} to='/user/Login'>Login</Nav.Item>);
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

const App:React.FC = () => {
  const {userState,login,signout} = useUserState();
 
  return (
    <Router>
        <div className="App">
          <Header isLoggedIn={userState.isLoggedIn} token={userState.token} profilePicURL={userState.profilePicURL} signout={signout}/>
          <body className="App-body">
            <Route exact path ='/' render={() => <HomePage isLoggedIn={userState.isLoggedIn} token={userState.token} username={userState.username} />}/>
            <Route exact path='/User' render={() => (userState.isLoggedIn ? (<UserPage isLoggedIn={userState.isLoggedIn} token={userState.token} username={userState.username} profilePicURL={userState.profilePicURL} email={userState.email} login={login}/>) : <Redirect to="/Login"/>)}/>
            <Route path='/user/Login' render={() => (!userState.isLoggedIn ? (<LoginPage login={login} />) : <Redirect to="/User"/>)}/>
            <Route path='/user/forgot-password' render={() => (!userState.isLoggedIn ? (<RecoveryPage />) : <Redirect to="/User"/>)} />
            <Route path='/Memes' render={() => (<MemePage />)}/>
            <Route exact path='/user/Signup' render={() => (!userState.isLoggedIn ? (<SignupPage login={login} />) : <Redirect to="/User"/>)}/>
            <Route exact path ="/Upload/Meme" render={() => <UploadPage />}/>
          </body>
        </div>
      </Router>
  );
}


export default App;

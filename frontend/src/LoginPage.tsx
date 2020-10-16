import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {Button, ButtonToolbar, ControlLabel, Form, FormControl, FormGroup, HelpBlock} from 'rsuite';
import 'rsuite/dist/styles/rsuite-dark.css';
import axios from 'axios';
import { login } from './State';

const LoginPage:React.FC<login> = (props) =>  {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  function handleLogin(){
    let formdata = new FormData();
    formdata.append('username',username);
    formdata.append('password',password);
    axios.post(window.location.href, formdata, {
      headers: {
        'Content-Type' : 'application/json'
      }
    }).then(response => {
      if(response.status === 200){
        props.login({...response.data,isLoggedIn:true})
      }else{
        console.log("wrong username or password");
      }
    });
  }
  
  return (
    <div className="Login-page">
      <Form className="Login-form">
          <FormGroup>
            <ControlLabel>Username</ControlLabel>
            <FormControl name="name" onChange={(v,e) => setUsername(v)}/>
            <HelpBlock tooltip>Either username or email</HelpBlock>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Password</ControlLabel>
            <FormControl name="password" type="password" onChange={(v,e) => setPassword(v)}/>
            <HelpBlock><Link to={'/'}>forgot password?</Link></HelpBlock>
          </FormGroup>
          <FormGroup>
            <ButtonToolbar>
              <Button block appearance="primary" onClick={handleLogin}>Login</Button>
              <Link to="/user/Signup" className="Signup-link">
                  <Button block appearance="ghost">Sign up</Button>
              </Link>
            </ButtonToolbar>
          </FormGroup>
      </Form>
    </div>
    );
    
}

export {LoginPage};
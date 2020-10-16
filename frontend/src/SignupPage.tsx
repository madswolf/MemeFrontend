import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {Button, ButtonToolbar, ControlLabel, Form, FormControl, FormGroup, HelpBlock} from 'rsuite';
import 'rsuite/dist/styles/rsuite-dark.css';
import axios from 'axios';
import { login } from './State';

const SignupPage:React.FC<login> = (props) => {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [email,setEmail] = useState('');
  const [password2,setPassword2] = useState('');

  function handleSignup(){
    if(password === password2){
      let formdata = new FormData();
      formdata.append('username',username);
      formdata.append('email',email);
      formdata.append('password',password);
      axios.post(window.location.href, formdata, {
        headers: {
          'Content-Type' : 'application/json'
        }
      }).then(response => {
        if(response.status === 201){
          props.login({...response.data,isLoggedIn:true,profilePicURL:`/public/${response.data.profilePic}`})
        }else{
          console.log("wrong username or password");
        }
      });
    }else{
      console.log('passwords don\'t match')
    }
  }
  
    return (
      <Form className="Login-form">
      <FormGroup>
        <ControlLabel>Username</ControlLabel>
        <FormControl name="name" onChange={(v,e) => setUsername(v)}/>
        <HelpBlock tooltip>Either username or email</HelpBlock>
      </FormGroup>
      <FormGroup>
        <ControlLabel>Email</ControlLabel>
        <FormControl name="email" type="email" onChange={(v,e) => setEmail(v)}/>
      </FormGroup>
      <FormGroup>
        <ControlLabel>Password</ControlLabel>
        <FormControl name="password" type="password" onChange={(v,e) => setPassword(v)}/>
      </FormGroup>
      <FormGroup>
        <ControlLabel>re-enter password</ControlLabel>
        <FormControl name="password2" type="password" onChange={(v,e) => setPassword2(v)}/>
      </FormGroup>
      <FormGroup>
        <ButtonToolbar>
          <Button block appearance="primary" onClick={handleSignup}>Sign up</Button>
          <Link to="/Signup" className="Signup-link">
              <Button block appearance="ghost">Login</Button>
          </Link>
        </ButtonToolbar>
      </FormGroup>
  </Form>
    );
    
}

export {SignupPage};
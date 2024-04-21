import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Button,
  ButtonToolbar,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-dark.css';
import axios from 'axios';
import { login } from './State';
import { apiHost, protocol } from './App';

const SignupPage: React.FC<{login:login}> = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [password2, setPassword2] = useState('');

  function handleSignup() {
    if (password === password2) {
      const formdata = new FormData();
      formdata.append('Username', username);
      formdata.append('Email', email);
      formdata.append('Password', password);

      axios
        .post(`${protocol}://${apiHost}/Users/register`, formdata, {
          headers: {
            'Content-Type': 'application/json',
          },
          validateStatus: status => status < 401
        })
        .then((response) => {
          if (response.status === 201) {
            props.login({
              ...response.data,
              isLoggedIn: true,
              profilePicURL: response.data.profilePicURl,
            });
          } else {
            Alert.error("Username or email already in use");
          }
        });
    } else {
      Alert.error("passwords don't match");
    }
  }

  return (
    <div className="Login-page">
      <Form className="Login-form">
        <FormGroup>
          <ControlLabel>Username</ControlLabel>
          <FormControl name="name" onChange={(v, e) => setUsername(v)} />
          <HelpBlock tooltip={true}>Either username or email</HelpBlock>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Email</ControlLabel>
          <FormControl
            name="email"
            type="email"
            onChange={function OnChangedEmail(v, e) {
              setEmail(v);
            }}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Password</ControlLabel>
          <FormControl
            name="password"
            type="password"
            onChange={function OnChangedPassword(v, e) {
              setPassword(v);
            }}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>re-enter password</ControlLabel>
          <FormControl
            name="password2"
            type="password"
            onChange={function OnChangedRePassword(v, e) {
              setPassword2(v);
            }}
          />
        </FormGroup>
        <FormGroup>
          <ButtonToolbar>
            <Button block={true} appearance="primary" onClick={handleSignup}>
              Sign up
            </Button>
            <Link to="/Signup" className="Signup-link">
              <Button block={true} appearance="ghost">
                Login
              </Button>
            </Link>
          </ButtonToolbar>
        </FormGroup>
      </Form>
    </div>
  );
};

export { SignupPage };

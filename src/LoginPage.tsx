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

const LoginPage: React.FC<{login:login}> = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  function handleLogin() {
    const formdata = new FormData();
    formdata.append('Username', username);
    formdata.append('Password', password);
    axios
      .post(`${protocol}://${apiHost}/Users/login`, formdata, {
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: (status) => status < 500
      })
      .then((response) => {
        if (response.status === 200) {
          props.login({
            ...response.data,
            isLoggedIn: true,
            profilePicURL: response.data.profilePicURl,
            token: response.data.token, // TODO: SESSIONS INSTEAD
          });
        } else if (response.status == 401){
          Alert.error("The entered information is not correct");
        }
      });
      
  }

  return (
    <div className="Login-page">
      <Form className="Login-form">
        <FormGroup>
          <ControlLabel>Username</ControlLabel>
          <FormControl
            name="name"
            onChange={function OnChangedUsername(v, e) {
              setUsername(v);
            }}
          />
          <HelpBlock tooltip={true}>Either username or email</HelpBlock>
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
          <HelpBlock>
            <Link to={'/user/forgot-password'}>forgot password?</Link>
          </HelpBlock>
        </FormGroup>
        <FormGroup>
          <ButtonToolbar>
            <Button block={true} appearance="primary" onClick={handleLogin}>
              Login
            </Button>
            <Link to="/user/Signup" className="Signup-link">
              <Button block={true} appearance="ghost">
                Sign up
              </Button>
            </Link>
          </ButtonToolbar>
        </FormGroup>
      </Form>
    </div>
  );
};

export { LoginPage };

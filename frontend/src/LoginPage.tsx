import React from 'react';
import { Link } from 'react-router-dom';
import {Button, ButtonToolbar, ControlLabel, Form, FormControl, FormGroup, HelpBlock} from 'rsuite';
import 'rsuite/dist/styles/rsuite-dark.css';

const LoginPage:React.FC = () =>  {
    return (
    <div className="Login-page">
      <Form className="Login-form">
          <FormGroup>
            <ControlLabel>Username</ControlLabel>
            <FormControl name="name" />
            <HelpBlock tooltip>Either username or email</HelpBlock>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Password</ControlLabel>
            <FormControl name="password" type="password" />
            <HelpBlock><Link to={'/'}>forgot password?</Link></HelpBlock>
          </FormGroup>
          <FormGroup>
            <ButtonToolbar>
              <Button block appearance="primary">Login</Button>
              <Link to="/Signup" className="Signup-link">
                  <Button block appearance="ghost">Sign up</Button>
              </Link>
            </ButtonToolbar>
          </FormGroup>
      </Form>
    </div>
    );
    
}

export {LoginPage};
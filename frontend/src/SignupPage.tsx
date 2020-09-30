import React from 'react';
import { Link } from 'react-router-dom';
import {Button, ButtonToolbar, ControlLabel, Form, FormControl, FormGroup, HelpBlock} from 'rsuite';
import 'rsuite/dist/styles/rsuite-dark.css';

const SignupPage:React.FC = () => {
    return (
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
            <Button block appearance="primary">Sign up</Button>
            <Link to="/Login" className="Signup-link">
                <Button block appearance="ghost">Login</Button>
            </Link>
          </ButtonToolbar>
        </FormGroup>
    </Form>
    );
    
}

export {SignupPage};
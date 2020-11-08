import React, { useState } from 'react';
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
import { apiHost } from './App';

const RecoveryPage: React.FC = (props) => {
  const [email, setEmail] = useState('');
  function handleRecovery() {
    const formdata = new FormData();
    formdata.append('email', email);

    axios
      .post(`https://${apiHost}/user/forgot-password`, formdata, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(function HandleResponse(response) {
        if (response.status === 200) {
          setEmail('');
          Alert.success(`Temporary password sent to ${response.data.email}`, 3000);
        } else {
          Alert.error(`Error: ${response.data.error}`, 3000);
        }
      })
      .catch(function HandleError(error) {
        if (error.response) {
          Alert.error(`Error: ${error.response.data.error}`, 3000);
        }
      });
  }

  return (
    <div className="Login-page">
      <Form className="Login-form">
        <FormGroup>
          <ControlLabel>Username</ControlLabel>
          <FormControl value={email} name="name" onChange={(v, e) => setEmail(v)} />
          <HelpBlock tooltip={true}>Either username or email</HelpBlock>
        </FormGroup>
        <FormGroup>
          <ButtonToolbar>
            <Button appearance="primary" block={true} onClick={handleRecovery}>
              Recover password
            </Button>
          </ButtonToolbar>
        </FormGroup>
      </Form>
    </div>
  );
};

export { RecoveryPage };

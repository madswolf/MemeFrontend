import React from 'react';
import {Route, NavLink, HashRouter} from 'react-router-dom';
import './App.css';
import UserPage from './UserPage';
import IState from './State';

interface IProps {
}

class App extends React.Component<IProps,IState> {
  constructor(props:IState){
    super(props);
    this.state = {
      isLoggedIn: false,
      username: '',
    }
  }
  
  render(){
    return (
      <div className="App">
        <header className="App-header">
          <UserPage isLoggedIn={this.state.isLoggedIn} username={this.state.username} />
        </header>
      </div>
    );
  }
}


export default App;

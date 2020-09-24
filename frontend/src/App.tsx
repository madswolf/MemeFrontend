import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import UserPage from './UserPage';
import MemePage from './MemePage';
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
      <Router>
        <div className="App">
          <header className="App-header">
              <nav>
                <ul>
                  <li><Link to={'/Login'}>Login </Link></li>
                  <li><Link to={'/Memes'}>MemePage</Link> </li>
                </ul>
              </nav>
              <Route path='/Login' component={UserPage}/>
              <Route path='/Memes' component={MemePage}/>
          </header>
        </div>
      </Router>
    );
  }
}


export default App;

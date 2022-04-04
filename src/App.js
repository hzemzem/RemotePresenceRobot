import React, { Component } from 'react';
import Video from './components/video';
import RobotVideo from './components/robotVideo';
import './App.css';
import './styles/video.css';
import { BrowserRouter, Route } from 'react-router-dom';
import { goToRoomInput } from './components/goToRoomInput';
class App extends Component {
  render() {
    return (
      <BrowserRouter>
       <React.Fragment>
          <Route path="/" exact component={goToRoomInput}/>
          <Route path="/:roomId" exact component={Video}/>
          <Route path="/robot/rpr9cs" exact component={RobotVideo}/>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default App;

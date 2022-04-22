<<<<<<< HEAD
import React, { Component } from 'react';
import Video from './components/video'
import './App.css';
import './styles/video.css'
import { BrowserRouter, Route } from 'react-router-dom';
import { goToRoomInput } from './components/goToRoomInput';
class App extends Component {
  render() {
    return (
      <BrowserRouter>
       <React.Fragment>
          <Route path="/" exact component={goToRoomInput}/>
          <Route path="/:roomId" exact component={Video}/>
        </React.Fragment>
      </BrowserRouter>
    )
  }
=======
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './layouts/Login';
import VideoChatPage from './layouts/VideoChatPage';
import React, { useState } from 'react';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/video-chat-page" element={<VideoChatPage/>} />
            </Routes>
        </BrowserRouter>
    );
>>>>>>> dev
}

export default App;

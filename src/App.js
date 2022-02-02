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
}

export default App;

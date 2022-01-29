import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoChatPage from './layouts/videoChatPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/video-chat-page" element={<VideoChatPage/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

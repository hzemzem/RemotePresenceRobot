import React, { useState } from 'react';
import placeholder from '../assets/images/placeholder.jpeg';
import previous_icon from '../assets/images/previous.svg';
import neutral_face from '../assets/images/neutral-face.svg';
import smiley_face from '../assets/images/smiley-face.svg';
import frowning_face from '../assets/images/frowning-face.svg';
import switch_off from '../assets/images/switch-off.svg';
import switch_on from '../assets/images/switch-on.svg';

function VideoChatPage() {
    const [isActive, setActive] = useState("false");

    const ToggleClass = () => {
        setActive(!isActive); 
    };

    return (
        <div className="video-chat-page container">
            <header className="video-chat-page-header">
                <nav className="navbar">
                    <a href="/"><img className="previous_icon" src={previous_icon} alt="previous icon"/></a>
                    <div className="switch-section">
                        <img className={isActive ? "switch_off display" : "switch_off hide"}  onClick={ToggleClass} src={switch_off} alt="Button to switch off facial recognition"/>
                        <img className={isActive ? "switch_on hide" : "switch_on display"} onClick={ToggleClass} src={switch_on} alt="Button to switch on facial recognition"/>
                    </div>
                </nav>
            </header>
            
            <div className="video-chat-page-body">
                <div className="video-chat-window">
                    <img className="placeholder-img" src={placeholder} alt="placeholder"/>
                </div>
                <div className="sidebar">
                    <div className="sidebar-container">
                        <details className="dropdown-item">
                            <summary className="list-title">Voice Effects</summary>
                            <ul>
                                <li className="list-item">
                                    Test Item
                                </li>
                                <li className="list-item">
                                    Test Item
                                </li>
                            </ul>
                        </details>
                        <details className="dropdown-item list-closed">
                            <summary className="list-title">Filters</summary>
                            <ul>
                                <li className="list-item">
                                    Test Item
                                </li>
                                <li className="list-item">
                                    Test Item
                                </li>
                            </ul>
                        </details>
                        <details className="dropdown-item list-closed">
                            <summary className="list-title">Backgrounds</summary>
                            <ul>
                                <li className="list-item">
                                    Test Item
                                </li>
                                <li className="list-item">
                                    Test Item
                                </li>
                            </ul>
                        </details>
                    </div>
                    <div className="emotion-section">
                        <img className="smiley_face" src={smiley_face} alt="Smiley Face"/>
                        <img className="neutral_face" src={neutral_face} alt="Neutral Face"/>
                        <img className="frowning_face" src={frowning_face} alt="Frowning Face"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoChatPage;

'use strict';
import React, { useState, useEffect } from 'react';
import previous_icon from '../assets/images/previous.svg';
import neutral_face from '../assets/images/neutral-face.svg';
import smiley_face from '../assets/images/smiley-face.svg';
import frowning_face from '../assets/images/frowning-face.svg';
import switch_off from '../assets/images/switch-off.svg';
import switch_on from '../assets/images/switch-on.svg';
import adapter from 'webrtc-adapter';
import { io } from 'socket.io-client';

function VideoChatPage() {
    const [isActive, setActive] = useState("false");

    const ToggleClass = () => {
        setActive(!isActive);
    };

    useEffect(() => {
        const localVideo = document.getElementById('local-video');

        let VideoChat = {
            socket: io(),

            handleLocalMediaStreamError: function (error) {
                console.log('navigator.getUserMedia error: ', error);
            },

            requestMediaStream: function (event) {
                navigator.mediaDevices
                    .getUserMedia({ video: true })
                    .then(stream => {
                        VideoChat.onMediaStream(stream);
                    })
                    .catch(VideoChat.handleLocalMediaStreamError);
            },

            readyToCall: function (event) {
                VideoChat.callButton.removeAttribute('disabled');
            },

            onMediaStream: function (mediaStream) {
                console.log(mediaStream);
                let localStream = mediaStream;
                localVideo.srcObject = localStream;
                localVideo.onloadedmetadata = function (e) {
                    localVideo.play();
                };
                VideoChat.socket.emit('join', 'test');
                VideoChat.socket.on('ready', VideoChat.readyToCall);
            },

            onOffer: function (offer) {
                VideoChat.socket.on('token', VideoChat.onToken(VideoChat.createAnswer(offer)));
                VideoChat.socket.emit('token');
            },

            startCall: function (event) {
                VideoChat.socket.on('token', VideoChat.onToken(VideoChat.createOffer));
                VideoChat.socket.emit('token');
            },

            createAnswer: function (offer) {
                return function () {
                    let rtcOffer = new RTCSessionDescription(JSON.parse(offer));
                    VideoChat.peerConnection.setRemoteDescription(rtcOffer);
                    VideoChat.peerConnection.createAnswer(
                        function (answer) {
                            VideoChat.peerConnection.setLocalDescription(answer);
                            VideoChat.socket.emit('answer', JSON.stringify(answer));
                        },
                        function (err) {
                            console.log(err);
                        }
                    );
                }
            },

            onToken: function (callback) {
                return function (token) {
                    VideoChat.peerConnection = new RTCPeerConnection({
                        iceServers: token.iceServers
                    });
                    VideoChat.peerConnection.addStream(VideoChat.localStream);
                    VideoChat.peerConnection.onicecandidate = VideoChat.onIceCandidate;
                    VideoChat.peerConnection.onaddstream = VideoChat.onAddStream;
                    VideoChat.socket.on('candidate', VideoChat.onCandidate);
                    VideoChat.socket.on('answer', VideoChat.onAnswer);
                    callback();
                }
            },

            onAddStream: function (event) {
                VideoChat.remoteVideo = document.getElementById('remote-video');
                VideoChat.remoteVideo.srcObject = event.stream;
                VideoChat.remoteVideo.onloadedmetadata = function (e) {
                    VideoChat.remoteVideo.play();
                };
            },

            onAnswer: function (answer) {
                var rtcAnswer = new RTCSessionDescription(JSON.parse(answer));
                VideoChat.peerConnection.setRemoteDescription(rtcAnswer);
            },

            createOffer: function () {
                VideoChat.peerConnection.createOffer(
                    function (offer) {
                        VideoChat.peerConnection.setLocalDescription(offer);
                        VideoChat.socket.emit('offer', JSON.stringify(offer));
                    },
                    function (err) {
                        console.log(err);
                    }
                );
            },

            onIceCandidate: function (event) {
                if (event.candidate) {
                    console.log('Generated candidate!');
                    VideoChat.socket.emit('candidate', JSON.stringify(event.candidate));
                }
            },

            onCandidate: function (candidate) {
                let rtcCandidate = new RTCIceCandidate(JSON.parse(candidate));
                VideoChat.peerConnection.addIceCandidate(rtcCandidate);
            }
        };

        VideoChat.requestMediaStream();

        VideoChat.callButton = document.getElementById('call');

        VideoChat.callButton.addEventListener(
            'click',
            VideoChat.startCall,
            false
        );

    });

    return (
        <div className="video-chat-page container">
            <header className="video-chat-page-header">
                <nav className="navbar">
                    <a href="/"><img className="previous_icon" src={previous_icon} alt="previous icon" /></a>
                    <div className="switch-section">
                        <img className={isActive ? "switch_off display" : "switch_off hide"} onClick={ToggleClass} src={switch_off} alt="Button to switch off facial recognition" />
                        <img className={isActive ? "switch_on hide" : "switch_on display"} onClick={ToggleClass} src={switch_on} alt="Button to switch on facial recognition" />
                    </div>
                </nav>
            </header>

            <div className="video-chat-page-body">
                <div className="video-chat-window">
                    <video id="local-video" autoplay></video>
                    <video id="remote-video" autoplay></video>

                    <div>
                        <button id="call">Call</button>
                    </div>
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
                        <img className="smiley_face" src={smiley_face} alt="Smiley Face" />
                        <img className="neutral_face" src={neutral_face} alt="Neutral Face" />
                        <img className="frowning_face" src={frowning_face} alt="Frowning Face" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoChatPage;
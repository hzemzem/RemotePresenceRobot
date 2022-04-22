import React, { useState } from 'react';
import VideoCall from '../helpers/simple-peer';
import '../styles/video.css';
import io from 'socket.io-client';
import { getDisplayStream } from '../helpers/media-access';
import { ShareScreenIcon, MicOnIcon, MicOffIcon, CamOnIcon, CamOffIcon } from './Icons';
import previous_icon from '../assets/images/previous.svg';
import neutral_face from '../assets/images/neutral-face.svg';
import smiley_face from '../assets/images/smiley-face.svg';
import frowning_face from '../assets/images/frowning-face.svg';
import switch_off from '../assets/images/switch-off.svg';
import switch_on from '../assets/images/switch-on.svg';

class Video extends React.Component {
  constructor() {

    super();
    this.state = {
      localStream: {},
      remoteStreamUrl: '',
      streamUrl: '',
      initiator: false,
      peer: {},
      full: false,
      connecting: false,
      waiting: true,
      micState: true,
      camState: true,
    };
  }
  videoCall = new VideoCall();

  componentDidMount() {
    const socket = io(process.env.REACT_APP_SIGNALING_SERVER);
    const component = this;
    this.setState({ socket });
    const { roomId } = this.props.match.params;
    this.getUserMedia().then(() => {
      socket.emit('join', { roomId: roomId });
    });

    socket.on('init', () => {
      component.setState({ initiator: true });
    });
    socket.on('ready', () => {
      component.enter(roomId);
    });
    socket.on('desc', data => {
      if (data.type === 'offer' && component.state.initiator) return;
      if (data.type === 'answer' && !component.state.initiator) return;
      component.call(data);
    });
    socket.on('disconnected', () => {
      component.setState({ initiator: true });
    });
    socket.on('full', () => {
      component.setState({ full: true });
    });
  }


  getUserMedia(cb) {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia = navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
      const op = {
        video: {
          width: { min: 160, ideal: 640, max: 1280 },
          height: { min: 120, ideal: 360, max: 720 }
        },
        audio: true
      };
      navigator.getUserMedia(
        op,
        stream => {
          this.setState({ streamUrl: stream, localStream: stream });
          this.localVideo.srcObject = stream;
          resolve();
        },
        () => { }
      );
    });
  }

  setAudioLocal() {
    if (this.state.localStream.getAudioTracks().length > 0) {
      this.state.localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    this.setState({
      micState: !this.state.micState
    })
  }

  setVideoLocal() {
    if (this.state.localStream.getVideoTracks().length > 0) {
      this.state.localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    this.setState({
      camState: !this.state.camState
    })
  }

  getDisplay() {
    getDisplayStream().then(stream => {
      stream.oninactive = () => {
        this.state.peer.removeStream(this.state.localStream);
        this.getUserMedia().then(() => {
          this.state.peer.addStream(this.state.localStream);
        });
      };
      this.setState({ streamUrl: stream, localStream: stream });
      this.localVideo.srcObject = stream;
      this.state.peer.addStream(stream);
    });
  }

  enter = roomId => {
    this.setState({ connecting: true });
    const peer = this.videoCall.init(
      this.state.localStream,
      this.state.initiator
    );
    this.setState({ peer });

    peer.on('signal', data => {
      const signal = {
        room: roomId,
        desc: data
      };
      this.state.socket.emit('signal', signal);
    });
    peer.on('stream', stream => {
      this.remoteVideo.srcObject = stream;
      this.setState({ connecting: false, waiting: false });
    });
    peer.on('error', function (err) {
      console.log(err);
    });
  };

  call = otherId => {
    this.videoCall.connect(otherId);
  };

  renderFull = () => {
    if (this.state.full) {
      return 'The room is full';
    }
  };

  render() {
    return (

      <div className="video-chat-page container">
        <header className="video-chat-page-header">
          <nav className="navbar">
            <a href="/"><img className="previous_icon" src={previous_icon} alt="previous icon" /></a>
            <div className="switch-section">
              {/* <img className={isActive ? "switch_off display" : "switch_off hide"} onClick={ToggleClass} src={switch_off} alt="Button to switch off facial recognition" />
              <img className={isActive ? "switch_on hide" : "switch_on display"} onClick={ToggleClass} src={switch_on} alt="Button to switch on facial recognition" /> */}
            </div>
          </nav>
        </header>

        <div className="video-chat-page-body">
          <div className="video-chat-window">
            <div className='video-wrapper'>
              <div className='local-video-wrapper'>
                <video
                  autoPlay
                  id='localVideo'
                  muted
                  ref={video => (this.localVideo = video)}
                />
              </div>
              <video
                autoPlay
                className={`${this.state.connecting || this.state.waiting ? 'hide' : ''
                  }`}
                id='remoteVideo'
                ref={video => (this.remoteVideo = video)}
              />

              <div className='controls'>
                <button
                  className='control-btn'
                  onClick={() => {
                    this.getDisplay();
                  }}
                >
                  <ShareScreenIcon />
                </button>


                <button
                  className='control-btn'
                  onClick={() => {
                    this.setAudioLocal();
                  }}
                >
                  {
                    this.state.micState ? (
                      <MicOnIcon />
                    ) : (
                      <MicOffIcon />
                    )
                  }
                </button>

                <button
                  className='control-btn'
                  onClick={() => {
                    this.setVideoLocal();
                  }}
                >
                  {
                    this.state.camState ? (
                      <CamOnIcon />
                    ) : (
                      <CamOffIcon />
                    )
                  }
                </button>
              </div>



              {this.state.connecting && (
                <div className='status'>
                  <p>Establishing connection...</p>
                </div>
              )}
              {this.state.waiting && (
                <div className='status'>
                  <p>Waiting for someone to join...</p>
                </div>
              )}
            </div>
          </div>
          <div className="sidebar">
            <div className="sidebar-container">
              {/* <details className="dropdown-item">
                <summary className="list-title">Voice Effects</summary>
                <ul>
                  <li className="list-item">
                    Test Item
                  </li>
                  <li className="list-item">
                    Test Item
                  </li>
                </ul>
              </details> */}
              <details className="dropdown-item list-closed">
                <summary className="list-title">Filters</summary>
                <ul>
                  <li className="list-item" onClick={() => {
                    document.getElementById("localVideo").style.filter = "brightness(1.10) hue-rotate(135deg)";
                  }}>Color Change</li>
                  <li className="list-item" onClick={() => {
                    document.getElementById("localVideo").style.filter = "invert(1)";
                  }}>Inversion</li>
                  <li className="list-item" onClick={() => {
                    document.getElementById("localVideo").style.filter = "opacity(0.55) sepia(0.89)";
                  }}>B&W</li>
                  <li className="list-item" onClick={() => {
                    document.getElementById("localVideo").style.filter = "brightness(1.50) saturate(4.00)";
                  }}>Neon Figure</li>
                  <li className="list-item" onClick={() => {
                    document.getElementById("localVideo").style.filter = "brightness(0.75) contrast(3.00)";
                  }}>Darkness</li>
                  <li className="list-item" onClick={() => {
                    document.getElementById("localVideo").style.filter = "none";
                  }}>Clear</li>
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
            {/* <div className="emotion-section">
              <img className="smiley_face" src={smiley_face} alt="Smiley Face" />
              <img className="neutral_face" src={neutral_face} alt="Neutral Face" />
              <img className="frowning_face" src={frowning_face} alt="Frowning Face" />
            </div> */}
          </div>
        </div>
        {this.renderFull()}
      </div>
    );
  }
}

export default Video;

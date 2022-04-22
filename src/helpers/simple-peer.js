import Peer from 'simple-peer'

export default class VideoCall {
    peer = null
    init = (stream, initiator) => {
        this.peer = new Peer({
            initiator: initiator,
            stream: stream,
            trickle: false,
            reconnectTimer: 1000,
            iceTransportPolicy: 'relay',
            config: {
                iceServers: [
                    { urls: 'stun:stun4.l.google.com:19302' },
                    {
                        urls: 'turn:numb.viagenie.ca?transport=udp',
                        username: 'hajar.zemzem@gmail.com',
                        credential: 'Zemzem.25'
                    },
                ]
            }
        })
        return this.peer
    }
    connect = (otherId) => {
        this.peer.signal(otherId)
    }
}
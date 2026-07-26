const configuration: RTCConfiguration = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
      ],
    },
  ],

  bundlePolicy: "balanced",
  rtcpMuxPolicy: "require",
  iceCandidatePoolSize: 10,
};

export const createPeerConnection = (): RTCPeerConnection | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const peer = new RTCPeerConnection(configuration);

  peer.oniceconnectionstatechange = () => {
    console.log(
      "ICE Connection State:",
      peer.iceConnectionState
    );
  };

  peer.onconnectionstatechange = () => {
    console.log(
      "Peer Connection State:",
      peer.connectionState
    );
  };

  peer.onsignalingstatechange = () => {
    console.log(
      "Signaling State:",
      peer.signalingState
    );
  };

  peer.onicegatheringstatechange = () => {
    console.log(
      "ICE Gathering:",
      peer.iceGatheringState
    );
  };

  return peer;
};
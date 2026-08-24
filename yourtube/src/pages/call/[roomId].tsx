import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { socket } from "@/lib/socket";
import { createPeerConnection } from "@/lib/webrtc";
import { useCall } from "@/lib/CallContext";
import { ScreenShare, Mic, MicOff, Video, VideoOff, PhoneOff, Circle, } from "lucide-react";
const CallPage = () => {
  const router = useRouter();
  const { roomId } = router.query;
  const {
  localStreamRef: globalLocalStreamRef,
  remoteStreamRef: globalRemoteStreamRef,
  peerConnectionRef: globalPeerConnectionRef,
  setIsCallActive,
  setRoomId,
} = useCall();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
const startScreenShare = async () => {
  if (!peerConnectionRef.current) return;

  if (
    !navigator.mediaDevices ||
    typeof navigator.mediaDevices.getDisplayMedia !== "function"
  ) {
    alert("Screen sharing is not supported on this mobile browser. Please use a desktop browser.");
    return;
  }

  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    const screenTrack = screenStream.getVideoTracks()[0];
    const sender = peerConnectionRef.current
      .getSenders()
      .find((s) => s.track?.kind === "video");
    if (sender) {
      await sender.replaceTrack(screenTrack);
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = screenStream;
    }
    screenTrack.onended = async () => {
      if (!localStreamRef.current) return;
      const cameraTrack = localStreamRef.current.getVideoTracks()[0];
      if (sender) {
        await sender.replaceTrack(cameraTrack);
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
    };
  } catch (err: any) {
    console.error("Screen Share Error:", err);
    alert(`Screen Share failed: ${err?.name || "Unknown error"}`);
  }
};
const startRecording = () => {
  if (!localVideoRef.current?.srcObject) return;
  recordedChunksRef.current = [];
  const stream = localVideoRef.current.srcObject as MediaStream;
  const recorder = new MediaRecorder(stream, {
    mimeType: "video/webm",
  });
  mediaRecorderRef.current = recorder;
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunksRef.current.push(event.data);
    }
  };
  recorder.onstop = () => {
    const blob = new Blob(recordedChunksRef.current, {
      type: "video/webm",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recording-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };
  recorder.start();
setIsRecording(true);
setRecordingTime(0);
  console.log("Recording Started");
};
const stopRecording = ()=> {
  mediaRecorderRef.current?.stop();
  setIsRecording(false);
  console.log("Recording Stopped");
};
const toggleMic = ()=> {
  if (!localStreamRef.current)
    return;
  const audioTrack = localStreamRef.current.getAudioTracks()[0];
  if (!audioTrack)
    return;
  audioTrack.enabled = !audioTrack.enabled;
  setIsMicMuted(!audioTrack.enabled);
};
const toggleCamera = () => {
  if (!localStreamRef.current) return;
  const videoTrack = localStreamRef.current.getVideoTracks()[0];
  if (!videoTrack)
    return;
  videoTrack.enabled = !videoTrack.enabled;
  setIsCameraOff(!videoTrack.enabled);
};
const endCall = () => {
  socket.emit("end-call", { roomId });
  mediaRecorderRef.current?.stop();
  localStreamRef.current?.getTracks().forEach((track) => track.stop());
  peerConnectionRef.current?.close();
  router.back();
};
useEffect(() => {
  if (!isRecording) return;
  const interval = setInterval(() => {
    setRecordingTime((prev) => prev + 1);
  }, 1000);
  return () => clearInterval(interval);
}, [isRecording]);
  useEffect(() => {
    if (!roomId || typeof roomId !== "string") return;
    const peer = createPeerConnection();
    if (!peer) return;
    peerConnectionRef.current = peer;
    peer.ontrack = (event) => {
  console.log("Remote Track Received");

  const [remoteStream] = event.streams;

  if (!remoteStream) {
    console.log("No remote stream received");
    return;
  }

  globalRemoteStreamRef.current = remoteStream;

  const remoteVideo = remoteVideoRef.current;

  if (!remoteVideo) return;

  const remoteTrack = event.track;

  remoteTrack.onunmute = () => {
    console.log("Remote Track Unmuted");

    if (remoteVideo.srcObject !== remoteStream) {
      remoteVideo.srcObject = remoteStream;
    }

    remoteVideo.play().catch((err) => {
      console.error("Remote Video Play Error:", err);
    });
  };

  if (remoteVideo.srcObject !== remoteStream) {
    remoteVideo.srcObject = remoteStream;
  }
};
    peer.onicecandidate = (event) => {
      if (!event.candidate) return;
      socket.emit("ice-candidate", {
        roomId,
        candidate: event.candidate,
      });
    };
    const startCamera = async () => {
      try {
        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
        localStreamRef.current = stream;
        globalLocalStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach((track) => {
          peer.addTrack(track, stream);
        });
        console.log(
          "Tracks Added:",
          peer.getSenders().length
        );
      } catch (err) {
        console.error(err);
      }
    };
    startCamera();
    socket.emit("join-room", { roomId });
    socket.on("user-joined", async () => {
      console.log("User Joined");
      if (!peerConnectionRef.current) return;
      const peer = peerConnectionRef.current;
      if (peer.signalingState !== "stable") return;
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit("offer", {
        roomId,
        offer,
      });
    });
    socket.on("offer", async (offer) => {
      console.log("Offer Received");
      if (!peerConnectionRef.current) return;
      const peer = peerConnectionRef.current;
      if (peer.signalingState !== "stable") {
        console.log("Ignoring Offer:", peer.signalingState);
        return;
      }
      await peer.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit("answer", {
        roomId,
        answer,
      });
    });
    socket.on("answer", async (answer) => {
      console.log("Answer Received");
      if (!peerConnectionRef.current) return;
      const peer = peerConnectionRef.current;
      if (peer.signalingState !== "have-local-offer") return;
      await peer.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });
    socket.on("ice-candidate", async (candidate) => {
      console.log("ICE Candidate");
      if (!peerConnectionRef.current) return;
      try {
        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (err) {
        console.error("ICE Error:", err);
      }
    });
    socket.on("end-call", () => {
  alert("Call Ended");
  localStreamRef.current?.getTracks().forEach((track) => track.stop());
  peerConnectionRef.current?.close();
  router.back();
});
    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("end-call");
      socket.off("ice-candidate");
      localStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
      peerConnectionRef.current?.close();
    };
  }, [roomId]);
const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  }
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
    2,
    "0"
  )}`;
};
const controlButton =
  "w-[60px] h-[60px] sm:w-24 sm:h-20 rounded-xl sm:rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all duration-200 flex flex-col items-center justify-center gap-1 sm:gap-2 text-white shrink-0";
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 p-6">
      <div className="relative w-full max-w-7xl h-[75vh] sm:h-[75vh] rounded-2xl overflow-hidden bg-zinc-900">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute top-4 right-3 sm:top-8 sm:right-8 w-28 h-40 sm:w-72 sm:h-auto rounded-xl sm:rounded-2xl border-2 border-zinc-700 shadow-2xl bg-black object-cover z-20"/>
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-contain sm:object-cover bg-black z-0"/>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-nowrap justify-center items-center gap-1 sm:gap-4">
        <button
  onClick={startScreenShare}
  className={controlButton}>
  <ScreenShare size={20} />
  <span className="text-[8px] sm:text-sm font-medium">
    Share Screen
  </span>
</button>
        <button
  onClick={isRecording ? stopRecording : startRecording}
  className={`${controlButton} ${
    isRecording
      ? "border-red-500 bg-red-950/30 animate-pulse"
      : ""
  }`}>
  <Circle
    size={20}
    className={isRecording ? "fill-red-500 text-red-500" : ""}/>
  <span className="text-[8px] sm:text-sm font-medium">
  {isRecording ? "Recording" : "Record"}
</span>
{isRecording && (
  <span className="text-xs text-red-400 font-semibold">
    {formatTime(recordingTime)}
  </span>
)}
</button>
<button
  onClick={toggleMic}
  className={`${controlButton} ${
    isMicMuted
      ? "border-yellow-500 bg-yellow-950/30"
      : ""
  }`}>
  {isMicMuted ? (
    <MicOff size={20} className="text-yellow-400" />
  ) : (
    <Mic size={20} />
  )}
  <span className="text-[8px] sm:text-sm font-medium">
    {isMicMuted ? "Mic Off" : "Mic On"}
  </span>
</button>
<button
  onClick={toggleCamera}
  className={`${controlButton} ${
    isCameraOff ? "border-yellow-500 bg-yellow-950/30" : ""
  }`}>
  {isCameraOff ? (
    <VideoOff size={20} className="text-yellow-400" />
  ) : (
    <Video size={20} />
  )}
  <span className="text-[8px] sm:text-sm font-medium">
    {isCameraOff ? "Camera Off" : "Camera On"}
  </span>
</button>
<button
  onClick={endCall}
  className="w-[60px] h-[60px] sm:w-24 sm:h-20 rounded-xl sm:rounded-2xl bg-red-600 hover:bg-red-700 transition-all duration-200 flex flex-col items-center justify-center gap-1 sm:gap-2 text-white shrink-0">
  <PhoneOff size={20} />
  <span className="text-[8px] sm:text-sm font-medium">
    End Call
  </span>
</button>
       </div>
      </div>
    </div>
  );
};
export default CallPage;
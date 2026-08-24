import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useCall } from "@/lib/CallContext";

const FloatingCall = () => {
  const router = useRouter();

  const {
    isCallActive,
    roomId,
    remoteStreamRef,
  } = useCall();

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isCallActive) return;

    const video = videoRef.current;
    const stream = remoteStreamRef.current;

    if (video && stream) {
      video.srcObject = stream;
      video.play().catch(() => {});
    }
  }, [isCallActive, remoteStreamRef]);

  if (!isCallActive || !roomId || !remoteStreamRef.current) {
    return null;
  }

  const openCall = () => {
    router.push(`/call/${roomId}`);
  };

  return (
    <div
      onClick={openCall}
      className="
        fixed
        bottom-5
        right-5
        z-[9999]
        w-64
        h-40
        sm:w-72
        sm:h-44
        rounded-2xl
        overflow-hidden
        bg-black
        border-2
        border-zinc-700
        shadow-2xl
        cursor-pointer
      "
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      <div className="
        absolute
        bottom-2
        left-2
        bg-black/70
        text-white
        text-xs
        px-2
        py-1
        rounded-md
      ">
        Tap to return to call
      </div>
    </div>
  );
};

export default FloatingCall;
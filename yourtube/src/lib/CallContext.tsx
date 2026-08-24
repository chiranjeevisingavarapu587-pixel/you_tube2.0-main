import {
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

type CallContextType = {
  isCallActive: boolean;
  roomId: string | null;

  setIsCallActive: (value: boolean) => void;
  setRoomId: (value: string | null) => void;

  localStreamRef: React.MutableRefObject<MediaStream | null>;
  remoteStreamRef: React.MutableRefObject<MediaStream | null>;
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>;
};

const CallContext = createContext<CallContextType | undefined>(
  undefined
);

export const CallProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef =
    useRef<RTCPeerConnection | null>(null);

  return (
    <CallContext.Provider
      value={{
        isCallActive,
        roomId,
        setIsCallActive,
        setRoomId,
        localStreamRef,
        remoteStreamRef,
        peerConnectionRef,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);

  if (!context) {
    throw new Error(
      "useCall must be used inside CallProvider"
    );
  }

  return context;
};
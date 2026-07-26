import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/lib/AuthContext";
interface Props {
  open: boolean;
  onClose: () => void;
  email?: string;
  otp: string;
  setOtp: (value: string)=> void;
  error: string;
  isPhone: boolean;
}
export default function OtpDialog({ open, onClose, email, otp, setOtp, error, isPhone, }: Props) {
    const { verifyOtp, verifyPhoneOtp, resendOtp, timer, canResend, } = useUser();
    const handleVerifyOtp= async()=> {
      if(isPhone){
        await verifyPhoneOtp();
      } else {
        await verifyOtp();
      }
    };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify OTP</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-500 text-center">
            OTP has been sent to
            <br />
            <span className="font-semibold">{email}</span>
          </p>
          <input
          value={otp}
          onChange={(e)=>
            setOtp(e.target.value)}
            maxLength={6}
            className="w-full border rounded-md p-3 text-center text-xl tracking-[10px]"
            placeholder="------"
          />
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <button 
          onClick={handleVerifyOtp}
          className="w-full bg-red-600 text-white rounded-md py-2">
            Verify OTP
          </button>
          <div className="text-center mt-3">
  {canResend ? (
    <button
      onClick={resendOtp}
      className="text-blue-500 hover:underline"
    >
      Resend OTP
    </button>
  ) : (
    <p className="text-gray-500 text-sm">
      Resend OTP in {timer}s
    </p>
  )}
</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
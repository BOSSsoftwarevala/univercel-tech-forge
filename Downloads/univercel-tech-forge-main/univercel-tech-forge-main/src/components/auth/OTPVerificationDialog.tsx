import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, Lock, Mail, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";

interface OTPVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (verificationId: string) => void;
  actionType: string;
  actionDescription: string;
  actionData?: any;
}

export function OTPVerificationDialog({
  isOpen,
  onClose,
  onVerified,
  actionType,
  actionDescription,
  actionData
}: OTPVerificationDialogProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendOTP = async () => {
    setIsSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Call edge function to send OTP via email
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: {
          userId: user.id,
          email: user.email,
          otpType: actionType,
          actionDescription,
          actionData
        }
      });

      if (error) throw error;

      setOtpSent(true);
      setCountdown(60); // 60 second cooldown
      toast.success('OTP sent to your email');
    } catch (error: any) {
      toast.error(`Failed to send OTP: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Verify OTP using database function
      const { data, error } = await supabase.rpc('verify_otp', {
        p_user_id: user.id,
        p_otp_code: otp,
        p_otp_type: actionType
      });

      if (error) throw error;

      const result = data as any;
      if (result.success) {
        toast.success('OTP verified successfully');
        onVerified(result.verification_id);
        onClose();
      } else {
        toast.error(result.error || 'Invalid OTP');
      }
    } catch (error: any) {
      toast.error(`Verification failed: ${error.message}`);
    } finally {
      setIsLoading(false);
      setOtp("");
    }
  };

  const getActionIcon = () => {
    switch (actionType) {
      case 'delete': return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'financial': return <Lock className="h-5 w-5 text-yellow-500" />;
      case 'server': return <Shield className="h-5 w-5 text-blue-500" />;
      default: return <Shield className="h-5 w-5 text-primary" />;
    }
  };

  const getActionColor = () => {
    switch (actionType) {
      case 'delete': return 'destructive';
      case 'financial': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getActionIcon()}
            OTP Verification Required
          </DialogTitle>
          <DialogDescription>
            This action requires 2-factor verification for security
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={getActionColor() as any}>{actionType}</Badge>
            </div>
            <p className="text-sm">{actionDescription}</p>
          </div>

          {!otpSent ? (
            <div className="text-center space-y-4">
              <div className="p-4 rounded-lg border border-dashed">
                <Mail className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click below to receive a verification code at your registered email
                </p>
              </div>
              <Button 
                onClick={sendOTP} 
                disabled={isSending}
                className="w-full"
              >
                {isSending ? 'Sending...' : 'Send OTP to Email'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <InputOTP 
                  maxLength={6} 
                  value={otp} 
                  onChange={setOtp}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4" />
                    Resend in {countdown}s
                  </p>
                ) : (
                  <Button 
                    variant="link" 
                    size="sm"
                    onClick={sendOTP}
                    disabled={isSending}
                  >
                    Resend OTP
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>OTP expires in 5 minutes</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {otpSent && (
            <Button 
              onClick={verifyOTP}
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

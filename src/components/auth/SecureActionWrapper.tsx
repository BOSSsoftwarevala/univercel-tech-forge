import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { OTPVerificationDialog } from "./OTPVerificationDialog";
import { PasswordVerificationDialog } from "./PasswordVerificationDialog";
import { SuperAdminApprovalPending } from "./SuperAdminApprovalPending";

interface SecureActionConfig {
  actionType: string;
  actionDescription: string;
  actionData?: any;
  requireOTP?: boolean;
  requirePassword?: boolean;
  requireSuperAdminApproval?: boolean;
  requireEmailVerification?: boolean;
  onApproved: (verificationData: VerificationResult) => void;
  onRejected?: (reason: string) => void;
}

interface VerificationResult {
  otpVerified: boolean;
  otpVerificationId?: string;
  passwordVerified: boolean;
  superAdminApproved: boolean;
  approvalId?: string;
  emailVerified: boolean;
  deviceTrusted: boolean;
}

interface SecureActionWrapperProps {
  children: (triggerAction: () => void, isProcessing: boolean) => React.ReactNode;
  config: SecureActionConfig;
}

export function SecureActionWrapper({ children, config }: SecureActionWrapperProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showApprovalPending, setShowApprovalPending] = useState(false);
  const [approvalQueueId, setApprovalQueueId] = useState<string | null>(null);
  
  const [verificationState, setVerificationState] = useState<VerificationResult>({
    otpVerified: !config.requireOTP,
    passwordVerified: !config.requirePassword,
    superAdminApproved: !config.requireSuperAdminApproval,
    emailVerified: !config.requireEmailVerification,
    deviceTrusted: false
  });

  const checkDeviceTrust = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const fingerprint = await generateDeviceFingerprint();
      const { data } = await supabase.rpc('is_device_trusted', {
        p_user_id: user.id,
        p_fingerprint: fingerprint
      });
      return data || false;
    } catch {
      return false;
    }
  }, []);

  const triggerAction = useCallback(async () => {
    setIsProcessing(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to perform this action');
        return;
      }

      // Check device trust
      const deviceTrusted = await checkDeviceTrust();
      setVerificationState(prev => ({ ...prev, deviceTrusted }));

      // If password verification is required
      if (config.requirePassword && !verificationState.passwordVerified) {
        setShowPasswordDialog(true);
        return;
      }

      // If OTP verification is required
      if (config.requireOTP && !verificationState.otpVerified) {
        setShowOTPDialog(true);
        return;
      }

      // If super admin approval is required
      if (config.requireSuperAdminApproval && !verificationState.superAdminApproved) {
        await submitForApproval(user.id);
        return;
      }

      // All verifications passed
      config.onApproved(verificationState);
    } catch (error: any) {
      toast.error(`Action failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [config, verificationState, checkDeviceTrust]);

  const submitForApproval = async (userId: string) => {
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    const fingerprint = await generateDeviceFingerprint();
    
    const { data, error } = await supabase
      .from('action_approval_queue')
      .insert({
        user_id: userId,
        user_role: userRole?.role || 'user',
        action_type: config.actionType,
        action_target: config.actionDescription,
        action_data: config.actionData || {},
        otp_verified: verificationState.otpVerified,
        password_verified: verificationState.passwordVerified,
        device_fingerprint: fingerprint,
        approval_status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    setApprovalQueueId(data.id);
    setShowApprovalPending(true);
    toast.info('Action submitted for Super Admin approval');
  };

  const handleOTPVerified = (verificationId: string) => {
    setVerificationState(prev => ({
      ...prev,
      otpVerified: true,
      otpVerificationId: verificationId
    }));
    setShowOTPDialog(false);
    
    // Continue to next step
    if (config.requireSuperAdminApproval) {
      triggerAction();
    } else {
      config.onApproved({
        ...verificationState,
        otpVerified: true,
        otpVerificationId: verificationId
      });
    }
  };

  const handlePasswordVerified = () => {
    setVerificationState(prev => ({
      ...prev,
      passwordVerified: true
    }));
    setShowPasswordDialog(false);
    
    // Continue to next step
    triggerAction();
  };

  const handleApprovalComplete = (approved: boolean, approvalId?: string) => {
    setShowApprovalPending(false);
    
    if (approved) {
      config.onApproved({
        ...verificationState,
        superAdminApproved: true,
        approvalId
      });
    } else {
      config.onRejected?.('Super Admin rejected the action');
      toast.error('Action was rejected by Super Admin');
    }
  };

  return (
    <>
      {children(triggerAction, isProcessing)}
      
      <OTPVerificationDialog
        isOpen={showOTPDialog}
        onClose={() => {
          setShowOTPDialog(false);
          setIsProcessing(false);
        }}
        onVerified={handleOTPVerified}
        actionType={config.actionType}
        actionDescription={config.actionDescription}
        actionData={config.actionData}
      />

      <PasswordVerificationDialog
        isOpen={showPasswordDialog}
        onClose={() => {
          setShowPasswordDialog(false);
          setIsProcessing(false);
        }}
        onVerified={handlePasswordVerified}
        actionType={config.actionType}
        actionDescription={config.actionDescription}
      />

      <SuperAdminApprovalPending
        isOpen={showApprovalPending}
        onClose={() => {
          setShowApprovalPending(false);
          setIsProcessing(false);
        }}
        approvalQueueId={approvalQueueId}
        onApprovalComplete={handleApprovalComplete}
      />
    </>
  );
}

// Helper function to generate device fingerprint
async function generateDeviceFingerprint(): Promise<string> {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    navigator.platform
  ];
  
  const fingerprint = components.join('|');
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprint);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
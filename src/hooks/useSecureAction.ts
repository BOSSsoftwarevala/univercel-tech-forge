import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SecurityRequirements {
  requireOTP: boolean;
  requirePassword: boolean;
  requireSuperAdminApproval: boolean;
  requireEmailVerification: boolean;
}

interface UseSecureActionOptions {
  actionType: string;
  actionDescription: string;
  actionData?: any;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

export function useSecureAction() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<UseSecureActionOptions | null>(null);

  const checkSecurityRequirements = useCallback(async (actionType: string): Promise<SecurityRequirements> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user's 2FA settings - use maybeSingle to handle missing records
      const { data: settings } = await supabase
        .from('user_2fa_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Get user's session security settings - use maybeSingle to handle missing records
      const { data: sessionSettings } = await supabase
        .from('session_security')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Determine requirements based on action type and settings
      const isDeleteAction = actionType.includes('delete') || actionType.includes('remove');
      const isFinancialAction = actionType.includes('financial') || actionType.includes('payment') || actionType.includes('wallet');
      const isCriticalAction = actionType.includes('server') || actionType.includes('bulk') || actionType.includes('role');

      return {
        requireOTP: settings?.is_2fa_enabled && settings?.require_otp_for_actions,
        requirePassword: (isDeleteAction && sessionSettings?.require_password_for_delete) ||
                        (isFinancialAction && sessionSettings?.require_password_for_financial),
        requireSuperAdminApproval: isCriticalAction || isDeleteAction,
        requireEmailVerification: sessionSettings?.require_email_verify_for_critical && isCriticalAction
      };
    } catch {
      // Default to requiring everything for safety
      return {
        requireOTP: true,
        requirePassword: true,
        requireSuperAdminApproval: true,
        requireEmailVerification: false
      };
    }
  }, []);

  const executeSecureAction = useCallback(async (
    action: () => Promise<any>,
    options: UseSecureActionOptions
  ) => {
    setIsProcessing(true);
    setPendingAction(options);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to perform this action');
        return;
      }

      const requirements = await checkSecurityRequirements(options.actionType);

      // Check if password verification is needed
      if (requirements.requirePassword) {
        // Check if password was recently verified
        const { data: recentVerification } = await supabase.rpc('is_password_recently_verified', {
          p_user_id: user.id,
          p_action_type: options.actionType
        });

        if (!recentVerification) {
          setShowPasswordDialog(true);
          return; // Will continue after password verification
        }
      }

      // Check if OTP verification is needed
      if (requirements.requireOTP) {
        setShowOTPDialog(true);
        return; // Will continue after OTP verification
      }

      // Check if Super Admin approval is needed
      if (requirements.requireSuperAdminApproval) {
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        // Super admins don't need approval from themselves for most actions
        if (userRole?.role !== 'super_admin' && userRole?.role !== 'master') {
          await submitForApproval(user.id, userRole?.role || 'user', options);
          return;
        }
      }

      // All checks passed, execute the action
      const result = await action();
      
      // Log the successful action
      await supabase.from('verified_action_logs').insert({
        user_id: user.id,
        action_type: options.actionType,
        action_target: options.actionDescription,
        success: true,
        verification_method: 'direct'
      });

      options.onSuccess?.(result);
      toast.success('Action completed successfully');
    } catch (error: any) {
      options.onError?.(error);
      toast.error(`Action failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [checkSecurityRequirements]);

  const submitForApproval = async (userId: string, userRole: string, options: UseSecureActionOptions) => {
    const fingerprint = await generateDeviceFingerprint();

    const { error } = await supabase
      .from('action_approval_queue')
      .insert({
        user_id: userId,
        user_role: userRole,
        action_type: options.actionType,
        action_target: options.actionDescription,
        action_data: options.actionData || {},
        device_fingerprint: fingerprint,
        approval_status: 'pending',
        priority: 'normal'
      });

    if (error) throw error;

    toast.info('Action submitted for Super Admin approval. You will be notified once reviewed.');
  };

  const handlePasswordVerified = useCallback(async () => {
    setShowPasswordDialog(false);
    
    if (pendingAction) {
      // Continue with the action after password verification
      // Re-run the security check without password requirement
      setShowOTPDialog(true); // Move to OTP if needed
    }
  }, [pendingAction]);

  const handleOTPVerified = useCallback(async (verificationId: string) => {
    setShowOTPDialog(false);
    
    if (pendingAction) {
      // Log the verified action
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('verified_action_logs').insert({
          user_id: user.id,
          action_type: pendingAction.actionType,
          action_target: pendingAction.actionDescription,
          otp_verification_id: verificationId,
          success: true,
          verification_method: 'otp'
        });
      }
      
      pendingAction.onSuccess?.({ verified: true, verificationId });
    }
    
    setPendingAction(null);
  }, [pendingAction]);

  return {
    executeSecureAction,
    isProcessing,
    showOTPDialog,
    setShowOTPDialog,
    showPasswordDialog,
    setShowPasswordDialog,
    handlePasswordVerified,
    handleOTPVerified,
    pendingAction
  };
}

// Helper function
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
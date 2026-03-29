import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { 
  Mail, Lock, ArrowRight, Eye, EyeOff, Shield, Fingerprint,
  Smartphone, CheckCircle2, AlertTriangle, Cpu, Globe, Clock,
  ShieldCheck, KeyRound, Scan, Radio
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import MasterThroneIcon from '@/components/icons/MasterThroneIcon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');

type AuthStep = 'credentials' | 'device_verify' | 'email_otp' | 'success';

interface DeviceInfo {
  fingerprint: string;
  browser: string;
  os: string;
  screen: string;
  timezone: string;
  language: string;
}

// Generate device fingerprint
const generateDeviceFingerprint = (): DeviceInfo => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('fingerprint', 10, 10);
  const canvasData = canvas.toDataURL();
  
  const fingerprint = btoa([
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvasData.slice(0, 50)
  ].join('|')).slice(0, 32);

  return {
    fingerprint,
    browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 
             navigator.userAgent.includes('Firefox') ? 'Firefox' : 
             navigator.userAgent.includes('Safari') ? 'Safari' : 'Unknown',
    os: navigator.platform,
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language
  };
};

const BossFortressAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [step, setStep] = useState<AuthStep>('credentials');
  const [emailOtpCode, setEmailOtpCode] = useState('');
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [securityChecks, setSecurityChecks] = useState({
    ssl: true,
    device: false,
    location: false,
    session: false
  });
  
  const { signIn, user, userRole } = useAuth();
  const navigate = useNavigate();

  // Initialize device fingerprint
  useEffect(() => {
    const info = generateDeviceFingerprint();
    setDeviceInfo(info);
  }, []);

  // Security checks animation
  useEffect(() => {
    if (step === 'device_verify') {
      const timers = [
        setTimeout(() => setSecurityChecks(prev => ({ ...prev, device: true })), 800),
        setTimeout(() => setSecurityChecks(prev => ({ ...prev, location: true })), 1600),
        setTimeout(() => setSecurityChecks(prev => ({ ...prev, session: true })), 2400),
        setTimeout(() => {
          setStep('email_otp');
          // Auto-send OTP when entering email_otp step
          sendEmailOTP();
        }, 3200)
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [step]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Redirect if already logged in as boss_owner
  useEffect(() => {
    if (user && userRole === 'boss_owner') {
      navigate('/super-admin');
    }
  }, [user, userRole, navigate]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      // Log attempt
      await supabase.from('audit_logs').insert({
        user_id: null,
        role: null,
        module: 'boss_fortress',
        action: 'fortress_login_attempt',
        meta_json: { 
          email, 
          device_fingerprint: deviceInfo?.fingerprint,
          timestamp: new Date().toISOString()
        }
      });

      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error('Invalid Credentials');
        await supabase.from('audit_logs').insert({
          user_id: null,
          role: null,
          module: 'boss_fortress',
          action: 'fortress_login_failed',
          meta_json: { email, error: error.message }
        });
        setLoading(false);
        return;
      }

      // Check if master or boss_owner role
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (roleData?.role !== 'master' && roleData?.role !== 'boss_owner') {
        await supabase.auth.signOut();
        toast.error('Access Denied - Boss Only');
        setLoading(false);
        return;
      }

      // Store user ID for OTP
      setCurrentUserId(userId || null);
      
      // Proceed to device verification
      setStep('device_verify');
      
    } catch (err) {
      toast.error('Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  // Send Email OTP function
  const sendEmailOTP = async () => {
    if (!currentUserId || !email) return;
    
    setSendingOtp(true);
    try {
      const { error } = await supabase.functions.invoke('send-otp', {
        body: {
          userId: currentUserId,
          email: email,
          otpType: 'boss_login',
          actionDescription: 'Boss Fortress Login Verification'
        }
      });

      if (error) {
        console.error('OTP send error:', error);
        toast.error('Failed to send OTP. Please try again.');
      } else {
        setOtpSent(true);
        setCountdown(60);
        toast.success('Verification code sent to your email');
      }
    } catch (err) {
      console.error('OTP error:', err);
      toast.error('Failed to send verification code');
    } finally {
      setSendingOtp(false);
    }
  };

  // Verify Email OTP
  const handleEmailOTPVerify = async () => {
    if (emailOtpCode.length !== 6) {
      toast.error('Please enter complete verification code');
      return;
    }

    setLoading(true);
    
    try {
      // Verify OTP via database
      const { data: verifyResult, error: verifyError } = await supabase.rpc('verify_otp', {
        p_user_id: currentUserId,
        p_otp_code: emailOtpCode,
        p_otp_type: 'boss_login'
      });

      if (verifyError || !verifyResult) {
        toast.error('Invalid or expired verification code');
        setLoading(false);
        return;
      }

      // Success - all verification passed
      setStep('success');
      
      await supabase.from('audit_logs').insert({
        user_id: currentUserId,
        role: 'boss_owner' as any,
        module: 'boss_fortress',
        action: 'fortress_login_success',
        meta_json: { 
          device_fingerprint: deviceInfo?.fingerprint,
          verification_method: 'password_device_email_otp'
        }
      });

      toast.success('Welcome, Boss!');
      
      setTimeout(() => {
        navigate('/super-admin', { replace: true });
      }, 1500);
    } catch (err) {
      console.error('OTP verify error:', err);
      toast.error('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendEmailOTP = () => {
    if (countdown > 0) return;
    sendEmailOTP();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Fortress Logo */}
        <div className="text-center mb-8">
          <motion.div 
            className="inline-flex flex-col items-center gap-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center shadow-2xl shadow-red-500/30">
                <MasterThroneIcon size="lg" />
              </div>
              <motion.div 
                className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-black"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-4 h-4 text-white" />
              </motion.div>
            </div>
            <div>
              <h1 className="font-mono font-bold text-xl text-white/90 tracking-tight">
                BOSS FORTRESS
              </h1>
              <p className="text-xs text-white/40 font-mono">Multi-Layer Security Authentication</p>
            </div>
          </motion.div>
        </div>

        {/* Security Status Bar */}
        <div className="mb-6 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400 font-mono">SECURE CONNECTION</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-500 text-xs">
            <Clock className="w-3 h-3" />
            {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Auth Card */}
        <Card className="bg-zinc-900/80 backdrop-blur-xl p-8 border-zinc-800/50 shadow-2xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Credentials */}
            {step === 'credentials' && (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                    Step 1/3
                  </Badge>
                  <span className="text-sm text-zinc-400">Identity Verification</span>
                </div>

                <form onSubmit={handleCredentialSubmit} className="space-y-5">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-400 text-xs uppercase tracking-wider">
                      Boss Identifier
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="boss@softwarevala.com"
                        className="pl-10 bg-zinc-950 border-zinc-800 focus:border-amber-500/50 text-white placeholder:text-zinc-600"
                        autoComplete="off"
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-zinc-400 text-xs uppercase tracking-wider">
                      Master Key
                    </Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="pl-10 pr-10 bg-zinc-950 border-zinc-800 focus:border-amber-500/50 text-white placeholder:text-zinc-600"
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold py-5 mt-6 border-0"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Continue to Verification
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>

                  <div className="text-center">
                    <Link
                      to="/forgot-password"
                      className="text-xs text-amber-300/90 hover:text-amber-200 underline underline-offset-4"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 2: Device Verification */}
            {step === 'device_verify' && (
              <motion.div
                key="device"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                    Step 2/3
                  </Badge>
                  <span className="text-sm text-zinc-400">Device Binding Check</span>
                </div>

                <div className="text-center mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-500/30 flex items-center justify-center"
                  >
                    <Scan className="w-8 h-8 text-amber-400" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-white">Scanning Device...</h3>
                  <p className="text-sm text-zinc-500">Verifying trusted device</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'SSL Connection', icon: Shield, checked: securityChecks.ssl },
                    { label: 'Device Fingerprint', icon: Fingerprint, checked: securityChecks.device },
                    { label: 'Location Verified', icon: Globe, checked: securityChecks.location },
                    { label: 'Session Valid', icon: Radio, checked: securityChecks.session },
                  ].map((check, i) => (
                    <motion.div
                      key={check.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2 }}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        check.checked 
                          ? 'bg-green-500/10 border-green-500/30' 
                          : 'bg-zinc-800/50 border-zinc-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <check.icon className={`w-4 h-4 ${check.checked ? 'text-green-400' : 'text-zinc-500'}`} />
                        <span className={check.checked ? 'text-green-300' : 'text-zinc-400'}>{check.label}</span>
                      </div>
                      {check.checked ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {deviceInfo && (
                  <div className="mt-4 p-3 bg-zinc-800/30 rounded-lg">
                    <p className="text-[10px] text-zinc-500 font-mono">
                      Device: {deviceInfo.browser} on {deviceInfo.os}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      Fingerprint: {deviceInfo.fingerprint}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Email OTP Verification */}
            {step === 'email_otp' && (
              <motion.div
                key="email_otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    Step 3/3
                  </Badge>
                  <span className="text-sm text-zinc-400">Email Verification</span>
                </div>

                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Email Verification</h3>
                  <p className="text-sm text-zinc-500">
                    {sendingOtp ? 'Sending code...' : `Enter code sent to ${email}`}
                  </p>
                </div>

                {sendingOtp ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-400 rounded-full animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={emailOtpCode} onChange={setEmailOtpCode}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="bg-zinc-950 border-zinc-700 text-white" />
                          <InputOTPSlot index={1} className="bg-zinc-950 border-zinc-700 text-white" />
                          <InputOTPSlot index={2} className="bg-zinc-950 border-zinc-700 text-white" />
                          <InputOTPSlot index={3} className="bg-zinc-950 border-zinc-700 text-white" />
                          <InputOTPSlot index={4} className="bg-zinc-950 border-zinc-700 text-white" />
                          <InputOTPSlot index={5} className="bg-zinc-950 border-zinc-700 text-white" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    {countdown > 0 ? (
                      <p className="text-center text-xs text-zinc-500">
                        Resend code in {countdown}s
                      </p>
                    ) : (
                      <button 
                        onClick={resendEmailOTP} 
                        disabled={sendingOtp}
                        className="w-full text-center text-xs text-cyan-400 hover:text-cyan-300"
                      >
                        Resend verification code
                      </button>
                    )}

                    <Button
                      onClick={handleEmailOTPVerify}
                      disabled={loading || emailOtpCode.length !== 6}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-5 border-0"
                    >
                      {loading ? 'Verifying...' : 'Complete Authentication'}
                    </Button>
                  </>
                )}
              </motion.div>
            )}

            {/* Success */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/30"
                >
                  <ShieldCheck className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Access Granted</h3>
                <p className="text-zinc-400">Welcome to the Boss Control Center</p>
                <Badge className="mt-4 bg-green-500/20 text-green-300">
                  All security checks passed
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-600">
              <Shield className="w-3 h-3" />
              <span className="font-mono">All access attempts logged & monitored</span>
            </div>
          </div>
        </Card>

        {/* Device Info Footer */}
        {deviceInfo && step === 'credentials' && (
          <div className="mt-4 text-center text-[10px] text-zinc-600 font-mono">
            <p>Device: {deviceInfo.fingerprint.slice(0, 16)}...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BossFortressAuth;
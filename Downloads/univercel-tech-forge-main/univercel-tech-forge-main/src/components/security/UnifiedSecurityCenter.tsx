import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Key, Smartphone, Globe, Check, X, AlertTriangle, 
  Bell, Lock, Unlock, Eye, EyeOff, Upload, Scan, MapPin,
  RefreshCw, Ban, UserCheck, Fingerprint, Server, Wifi,
  Building2, Users, Crown, CheckCircle, Clock, AlertCircle,
  Volume2, ShieldCheck, Zap, Phone, Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CleanSweepUsers from '@/components/admin/CleanSweepUsers';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type UserRole = 'franchise' | 'reseller' | 'prime';
type AccountStatus = 'active' | 'restricted' | 'suspended';

const UnifiedSecurityCenter = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('franchise');
  const [accountStatus, setAccountStatus] = useState<AccountStatus>('active');
  const [oneDeviceLogin, setOneDeviceLogin] = useState(true);
  const [oneIPAllowed, setOneIPAllowed] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [phoneMasking, setPhoneMasking] = useState(true);
  const [emailMasking, setEmailMasking] = useState(true);
  const [isVerified, setIsVerified] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [buzzerEnabled, setBuzzerEnabled] = useState(true);

  const suspensionTriggers = [
    { trigger: 'Multi-device Login Attempt', threshold: 'Instant block', severity: 'critical', active: true },
    { trigger: 'Illegal IP / VPN Attempt', threshold: '2 attempts', severity: 'critical', active: true },
    { trigger: 'Country Mismatch', threshold: 'Instant', severity: 'warning', active: true },
    { trigger: 'Unauthorized Module Access', threshold: 'Instant', severity: 'critical', active: true },
    { trigger: 'Suspicious Activity Pattern', threshold: 'AI Detection', severity: 'info', active: true },
  ];

  const recentAlerts = [
    { type: 'breach', message: 'Security breach attempt blocked', time: '2 min ago', role: 'franchise' },
    { type: 'ip-request', message: 'IP change request from Reseller #R-204', time: '8 min ago', role: 'reseller' },
    { type: 'pending', message: 'Prime user verification pending', time: '15 min ago', role: 'prime' },
    { type: 'approved', message: 'Login approved - Delhi, India', time: '1 hour ago', role: 'franchise' },
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'breach': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'ip-request': return 'bg-amber-500/20 border-amber-500/50 text-amber-400';
      case 'pending': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'approved': return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
      default: return 'bg-slate-500/20 border-slate-500/50 text-slate-400';
    }
  };

  const getStatusColor = (status: AccountStatus) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'restricted': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'suspended': return 'bg-red-500/10 border-red-500/30 text-red-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'info': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'franchise': return Building2;
      case 'reseller': return Users;
      case 'prime': return Crown;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'franchise': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
      case 'reseller': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'prime': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#0a0a0f] text-foreground p-6">
        {/* Background Pattern */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--accent)/0.05),transparent_50%)]" />
        </div>

        <div className="relative max-w-[1600px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">Unified Access Security Center</h1>
                  <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                    <span className="text-indigo-400">Franchise</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-cyan-400">Reseller</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-amber-400">Prime</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Icons */}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <Tooltip>
                  <TooltipTrigger><Shield className="w-4 h-4 text-indigo-400" /></TooltipTrigger>
                  <TooltipContent>Security Shield Active</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger><Key className="w-4 h-4 text-amber-400" /></TooltipTrigger>
                  <TooltipContent>Master Key Protection</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger><Smartphone className="w-4 h-4 text-emerald-400" /></TooltipTrigger>
                  <TooltipContent>Device Verified</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger><Wifi className="w-4 h-4 text-cyan-400" /></TooltipTrigger>
                  <TooltipContent>IP Verified</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger><MapPin className="w-4 h-4 text-purple-400" /></TooltipTrigger>
                  <TooltipContent>Location Verified</TooltipContent>
                </Tooltip>
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <Button variant="outline" size="icon" className="border-slate-700 bg-slate-800/50">
                  <Bell className="w-5 h-5 text-slate-400" />
                </Button>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">3</span>
                </div>
              </div>

              {/* Status Badge */}
              <motion.div
                animate={accountStatus === 'active' ? { scale: [1, 1.02, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${getStatusColor(accountStatus)}`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  accountStatus === 'active' ? 'bg-emerald-400 animate-pulse' : 
                  accountStatus === 'restricted' ? 'bg-amber-400' : 'bg-red-400'
                }`} />
                <span className="text-sm font-medium capitalize">{accountStatus}</span>
              </motion.div>
            </div>
          </div>

          {/* Suspended Banner */}
          <AnimatePresence>
            {accountStatus === 'suspended' && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-4"
              >
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-400">Account Suspended — Request Admin Review</h3>
                  <p className="text-red-400/80 text-sm">Security protocols have suspended this account. Contact administrator for review.</p>
                </div>
                <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                  Request Review
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Role Tabs */}
          <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)} className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-slate-800/50 border border-slate-700/50 p-1 rounded-xl h-auto">
              {(['franchise', 'reseller', 'prime'] as UserRole[]).map((role) => {
                const Icon = getRoleIcon(role);
                return (
                  <TabsTrigger 
                    key={role}
                    value={role}
                    className={`py-3 rounded-lg transition-all data-[state=active]:bg-slate-700 ${
                      selectedRole === role ? getRoleColor(role).split(' ')[0] : 'text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="capitalize">{role}</span>
                    {role === 'prime' && <Crown className="w-3 h-3 ml-1 text-amber-400" />}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Login Protection Zone */}
              <Card className="bg-[#1a1a2e] border-gray-800/50 backdrop-blur-xl">
                <CardHeader className="border-b border-gray-800/50 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <Lock className="w-5 h-5 text-primary" />
                    Login Protection Zone
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="w-4 h-4 text-gray-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        Industry standard — prevents account misuse and unauthorized access
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* One Device Login - Using consistent dark theme */}
                    <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-primary" />
                        </div>
                        <Switch 
                          checked={oneDeviceLogin} 
                          onCheckedChange={setOneDeviceLogin}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                      <h4 className="font-semibold text-white mb-1">One Device Login</h4>
                      <p className="text-xs text-gray-400">Single device access only</p>
                      <div className={`mt-3 text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${
                        oneDeviceLogin ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {oneDeviceLogin ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {oneDeviceLogin ? 'Enforced' : 'Disabled'}
                      </div>
                    </div>

                    {/* One IP Allowed */}
                    <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                          <Wifi className="w-5 h-5 text-cyan-400" />
                        </div>
                        <Switch 
                          checked={oneIPAllowed} 
                          onCheckedChange={setOneIPAllowed}
                          className="data-[state=checked]:bg-cyan-500"
                        />
                      </div>
                      <h4 className="font-semibold text-white mb-1">One IP Allowed</h4>
                      <p className="text-xs text-gray-400">IP: 103.xx.xx.45</p>
                      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-3 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-xs"
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Request IP Change
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#1a1a2e] border-gray-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">IP Change Verification</DialogTitle>
                            <DialogDescription className="text-gray-400">
                              Enter OTP sent to your registered number
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <Input 
                              placeholder="Enter 6-digit OTP" 
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              className="bg-gray-800 border-gray-700 text-center text-lg tracking-widest"
                              maxLength={6}
                            />
                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Verify & Change IP</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* MFA */}
                    <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Fingerprint className="w-5 h-5 text-purple-400" />
                        </div>
                        <Switch 
                          checked={mfaEnabled} 
                          onCheckedChange={setMfaEnabled}
                          className="data-[state=checked]:bg-purple-500"
                        />
                      </div>
                      <h4 className="font-semibold text-white mb-1">Multi-Factor Auth</h4>
                      <p className="text-xs text-gray-400">OTP + ID Verification</p>
                      <div className={`mt-3 text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${
                        mfaEnabled ? 'bg-purple-500/10 text-purple-400' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {mfaEnabled ? <ShieldCheck className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {mfaEnabled ? '2FA Active' : 'Disabled'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Identity Verification */}
              <Card className="bg-[#1a1a2e] border-gray-800/50 backdrop-blur-xl">
                <CardHeader className="border-b border-gray-800/50 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                    Identity Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    {/* ID Upload */}
                    <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 border-dashed text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-3">
                        <Upload className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-medium text-white text-sm mb-1">ID Card</h4>
                      <p className="text-xs text-gray-500 mb-3">Aadhaar/PAN/Passport</p>
                      {isVerified ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          <Check className="w-3 h-3 mr-1" />Verified
                        </Badge>
                      ) : (
                        <Button size="sm" variant="outline" className="text-xs border-primary/30 text-primary">Upload</Button>
                      )}
                    </div>

                    {/* Face Scan */}
                    <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 text-center">
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 mx-auto flex items-center justify-center mb-3">
                        <Scan className="w-5 h-5 text-purple-400" />
                      </div>
                      <h4 className="font-medium text-white text-sm mb-1">Face Scan</h4>
                      <p className="text-xs text-gray-500 mb-3">Live match</p>
                      {isVerified ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          <Check className="w-3 h-3 mr-1" />Matched
                        </Badge>
                      ) : (
                        <Button size="sm" variant="outline" className="text-xs border-purple-500/30 text-purple-400">
                          <Fingerprint className="w-3 h-3 mr-1" />Scan
                        </Button>
                      )}
                    </div>

                    {/* AI Result */}
                    <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 text-center">
                      <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3 ${
                        isVerified ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                      }`}>
                        {isVerified ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-400" />
                        )}
                      </div>
                      <h4 className="font-medium text-white text-sm mb-1">AI Verification</h4>
                      <p className="text-xs text-gray-500 mb-3">Auto check</p>
                      <Badge className={isVerified ? 
                        'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                        'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }>
                        {isVerified ? 'Verified ✓' : 'Review ⚠'}
                      </Badge>
                    </div>

                    {/* Master Key */}
                    <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 text-center">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 mx-auto flex items-center justify-center mb-3">
                        <Key className="w-5 h-5 text-amber-400" />
                      </div>
                      <h4 className="font-medium text-white text-sm mb-1">Master Key</h4>
                      <p className="text-xs text-gray-500 mb-3">First login only</p>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        <Lock className="w-3 h-3 mr-1" />Converted
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Masking Layer */}
              <Card className="bg-[#1a1a2e] border-gray-800/50 backdrop-blur-xl">
                <CardHeader className="border-b border-gray-800/50 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <EyeOff className="w-5 h-5 text-purple-400" />
                    Masking Layer
                    <Badge variant="outline" className="ml-2 text-xs border-purple-500/30 text-purple-400">All Roles</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">Phone Masking</h4>
                            <p className="text-xs text-gray-400">{phoneMasking ? '+91 XXXXX XX890' : '+91 98765 43890'}</p>
                          </div>
                        </div>
                        <Switch checked={phoneMasking} onCheckedChange={setPhoneMasking} className="data-[state=checked]:bg-purple-500" />
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">Email Masking</h4>
                            <p className="text-xs text-gray-400">{emailMasking ? 'j***@email.com' : 'john@email.com'}</p>
                          </div>
                        </div>
                        <Switch checked={emailMasking} onCheckedChange={setEmailMasking} className="data-[state=checked]:bg-cyan-500" />
                      </div>
                    </div>
                  </div>
                  <Tooltip>
                    <TooltipTrigger className="w-full">
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-xs text-gray-400 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-primary" />
                          Avoid direct private sharing to protect business. Secure relay for all communications.
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>All contact goes through secure masking layer</TooltipContent>
                  </Tooltip>
                </CardContent>
              </Card>

              {/* Geo-Restriction Map */}
              <Card className="bg-[#1a1a2e] border-gray-800/50 backdrop-blur-xl">
                <CardHeader className="border-b border-gray-800/50 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    Geo-Restriction Map Panel
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-300">Allowed Territories</h4>
                      <div className="space-y-2">
                        <div className={`p-3 rounded-lg border flex items-center gap-3 ${getRoleColor('franchise')}`}>
                          <Building2 className="w-4 h-4" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Franchise Zone</p>
                            <p className="text-xs opacity-70">Maharashtra, Gujarat, Rajasthan</p>
                          </div>
                          <Check className="w-4 h-4" />
                        </div>
                        <div className={`p-3 rounded-lg border flex items-center gap-3 ${getRoleColor('reseller')}`}>
                          <Users className="w-4 h-4" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Reseller Zone</p>
                            <p className="text-xs opacity-70">Delhi NCR, Punjab, Haryana</p>
                          </div>
                          <Check className="w-4 h-4" />
                        </div>
                        <div className={`p-3 rounded-lg border flex items-center gap-3 ${getRoleColor('prime')}`}>
                          <Crown className="w-4 h-4" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Prime Access</p>
                            <p className="text-xs opacity-70">Unrestricted (Based on plan)</p>
                          </div>
                          <Zap className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                    <div className="relative h-64 rounded-xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
                      {/* World Map Visualization */}
                      <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full opacity-40">
                        <ellipse cx="100" cy="50" rx="95" ry="45" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.3" />
                        <ellipse cx="100" cy="50" rx="70" ry="33" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.2" />
                        <ellipse cx="100" cy="50" rx="45" ry="21" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.2" />
                      </svg>
                      {/* Active Regions */}
                      <div className="absolute top-1/4 left-[60%] w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-500/50" />
                      <div className="absolute top-1/3 left-[58%] w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                      <div className="absolute top-[45%] left-[62%] w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      {/* Blocked Regions */}
                      <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-red-400/50" />
                      <div className="absolute top-1/2 left-[15%] w-2 h-2 rounded-full bg-red-400/50" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-slate-400">Active</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                          <span className="text-slate-400">Blocked</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Auto Suspension Engine */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
                <CardHeader className="border-b border-slate-700/50 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Ban className="w-5 h-5 text-red-400" />
                    Auto Suspension Engine
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700/50">
                          <th className="text-left py-3 px-4 text-xs text-slate-400 font-medium">Trigger</th>
                          <th className="text-left py-3 px-4 text-xs text-slate-400 font-medium">Threshold</th>
                          <th className="text-center py-3 px-4 text-xs text-slate-400 font-medium">Severity</th>
                          <th className="text-center py-3 px-4 text-xs text-slate-400 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suspensionTriggers.map((item, idx) => (
                          <motion.tr 
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="border-b border-slate-700/30 hover:bg-slate-800/30"
                          >
                            <td className="py-3 px-4 text-sm text-white">{item.trigger}</td>
                            <td className="py-3 px-4 text-sm text-slate-400">{item.threshold}</td>
                            <td className="py-3 px-4 text-center">
                              <Badge variant="outline" className={getSeverityColor(item.severity)}>{item.severity}</Badge>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                item.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
                              }`}>
                                {item.active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                {item.active ? 'Active' : 'Off'}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Role-Based Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Franchise Card */}
                <Card className={`bg-slate-900/50 backdrop-blur-xl transition-all ${
                  selectedRole === 'franchise' ? 'border-indigo-500/50 ring-1 ring-indigo-500/30' : 'border-slate-700/50'
                }`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Building2 className="w-5 h-5 text-indigo-400" />
                      Franchise
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Territory Lock</span>
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Device Lock</span>
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">High Value Access</span>
                      <Badge className="bg-indigo-500/20 text-indigo-400 text-xs">Active</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Reseller Card */}
                <Card className={`bg-slate-900/50 backdrop-blur-xl transition-all ${
                  selectedRole === 'reseller' ? 'border-cyan-500/50 ring-1 ring-cyan-500/30' : 'border-slate-700/50'
                }`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Users className="w-5 h-5 text-cyan-400" />
                      Reseller
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Lead Link Protection</span>
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Commission Lock</span>
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Data Masking</span>
                      <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">Enforced</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Prime Card */}
                <Card className={`bg-slate-900/50 backdrop-blur-xl transition-all ${
                  selectedRole === 'prime' ? 'border-amber-500/50 ring-1 ring-amber-500/30' : 'border-slate-700/50'
                }`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Crown className="w-5 h-5 text-amber-400" />
                      Prime User
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Priority Login</span>
                      <Zap className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Multi-device Upgrade</span>
                      <Badge className="bg-amber-500/20 text-amber-400 text-xs">Paid Option</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Geo Unrestricted</span>
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Side Panel */}
            <div className="space-y-6">
              {/* Real-time Alerts */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
                <CardHeader className="border-b border-slate-700/50 pb-4">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-amber-400" />
                      Real-time Alerts
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`h-8 w-8 ${buzzerEnabled ? 'text-red-400' : 'text-slate-500'}`}
                            onClick={() => setBuzzerEnabled(!buzzerEnabled)}
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Critical alert buzzer {buzzerEnabled ? 'ON' : 'OFF'}</TooltipContent>
                      </Tooltip>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {recentAlerts.map((alert, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={`text-[10px] ${getRoleColor(alert.role as UserRole)}`}>
                            {alert.role}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs opacity-70 mt-1">{alert.time}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Super Admin Control Panel */}
              <Card className="bg-slate-900/50 border-indigo-500/30 backdrop-blur-xl">
                <CardHeader className="border-b border-slate-700/50 pb-4 bg-indigo-500/5">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Server className="w-5 h-5 text-indigo-400" />
                    Super Admin Controls
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="w-4 h-4 text-slate-500" />
                      </TooltipTrigger>
                      <TooltipContent>Super Admin full override only</TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-sm h-10">
                      <Check className="w-4 h-4 mr-1" />Approve
                    </Button>
                    <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm h-10" onClick={() => setAccountStatus('suspended')}>
                      <Ban className="w-4 h-4 mr-1" />Block
                    </Button>
                    <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-sm h-10" onClick={() => setAccountStatus('restricted')}>
                      <Lock className="w-4 h-4 mr-1" />Suspend
                    </Button>
                    <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-sm h-10" onClick={() => setAccountStatus('active')}>
                      <Unlock className="w-4 h-4 mr-1" />Unblock
                    </Button>
                    <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 text-sm h-10">
                      <RefreshCw className="w-4 h-4 mr-1" />Reset Device
                    </Button>
                    <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-sm h-10">
                      <Globe className="w-4 h-4 mr-1" />Reset IP
                    </Button>
                    <Button variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 text-sm h-10 col-span-2">
                      <UserCheck className="w-4 h-4 mr-1" />Verify ID Manually
                    </Button>
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-black text-sm h-10 col-span-2">
                      <Crown className="w-4 h-4 mr-1" />Grant Prime Override
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Badges */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
                <CardHeader className="border-b border-slate-700/50 pb-4">
                  <CardTitle className="text-lg">International Compliance</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
                      <Shield className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                      <p className="text-xs text-emerald-400 font-medium">GDPR</p>
                    </div>
                    <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-center">
                      <Lock className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
                      <p className="text-xs text-indigo-400 font-medium">ISO 27001</p>
                    </div>
                    <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-center">
                      <Server className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                      <p className="text-xs text-cyan-400 font-medium">SOC 2</p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-center">
                      <EyeOff className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                      <p className="text-xs text-purple-400 font-medium">Data Masking</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Clean Sweep Users - Master Only */}
              <CleanSweepUsers />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default UnifiedSecurityCenter;

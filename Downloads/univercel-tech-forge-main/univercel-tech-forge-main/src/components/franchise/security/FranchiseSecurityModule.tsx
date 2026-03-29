import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Key, Smartphone, Globe, Check, X, AlertTriangle, 
  Bell, Lock, Unlock, Eye, EyeOff, Upload, Scan, MapPin,
  RefreshCw, Ban, UserCheck, Fingerprint, Server, Wifi
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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

const FranchiseSecurityModule = () => {
  const [accountStatus, setAccountStatus] = useState<'active' | 'suspended'>('active');
  const [oneDeviceLogin, setOneDeviceLogin] = useState(true);
  const [oneIPAllowed, setOneIPAllowed] = useState(true);
  const [phoneMasking, setPhoneMasking] = useState(true);
  const [emailMasking, setEmailMasking] = useState(true);
  const [masterKeyEntered, setMasterKeyEntered] = useState(false);
  const [masterKey, setMasterKey] = useState('');
  const [isVerified, setIsVerified] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('india');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');

  const suspensionTriggers = [
    { trigger: 'Multiple Failed Login Attempts', threshold: '5 attempts', severity: 'critical', active: true },
    { trigger: 'Unauthorized Country Login', threshold: 'Instant', severity: 'critical', active: true },
    { trigger: 'Hidden Module Access Attempt', threshold: 'Instant', severity: 'warning', active: true },
    { trigger: 'VPN/Proxy Detected', threshold: '3 occurrences', severity: 'warning', active: false },
    { trigger: 'Unusual Activity Pattern', threshold: 'AI Detection', severity: 'info', active: true },
  ];

  const recentAlerts = [
    { type: 'blocked', message: 'Login blocked from unauthorized IP', time: '2 min ago' },
    { type: 'request', message: 'IP change request pending', time: '15 min ago' },
    { type: 'success', message: 'Verified login from Delhi, India', time: '1 hour ago' },
    { type: 'success', message: 'Face verification completed', time: '2 hours ago' },
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'blocked': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'request': return 'bg-amber-500/20 border-amber-500/50 text-amber-400';
      case 'success': return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
      default: return 'bg-slate-500/20 border-slate-500/50 text-slate-400';
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

  return (
    <TooltipProvider>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Franchise Security Control</h1>
                <p className="text-slate-400 text-sm">International Secure Standard Compliance</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Icons */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <Tooltip>
                <TooltipTrigger>
                  <Shield className="w-4 h-4 text-indigo-400" />
                </TooltipTrigger>
                <TooltipContent>Security Shield Active</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Key className="w-4 h-4 text-amber-400" />
                </TooltipTrigger>
                <TooltipContent>Master Key Protection</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                </TooltipTrigger>
                <TooltipContent>Device Verified</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Globe className="w-4 h-4 text-cyan-400" />
                </TooltipTrigger>
                <TooltipContent>Geo-Restricted</TooltipContent>
              </Tooltip>
            </div>

            {/* International Badge */}
            <Badge variant="outline" className="px-3 py-1.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/30 text-indigo-300">
              <Shield className="w-3 h-3 mr-1.5" />
              International Secure Standard
            </Badge>

            {/* Status Badge */}
            <motion.div
              animate={{ scale: accountStatus === 'active' ? [1, 1.02, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                accountStatus === 'active' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                accountStatus === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
              }`} />
              <span className="text-sm font-medium">
                {accountStatus === 'active' ? 'Active' : 'Suspended'}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Suspended Alert Banner */}
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
                <h3 className="font-semibold text-red-400">Account Locked — Request Review</h3>
                <p className="text-red-400/80 text-sm">Your account has been suspended. Please contact support for review.</p>
              </div>
              <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                Request Review
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Left 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Login Protection Section */}
            <Card className="glass-panel border-border/30">
              <CardHeader className="border-b border-border/30 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lock className="w-5 h-5 text-indigo-400" />
                  Login Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* One Device Login */}
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">One Device Login</h4>
                          <Tooltip>
                            <TooltipTrigger>
                              <p className="text-xs text-slate-400 cursor-help underline decoration-dashed">
                                View details
                              </p>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              Only one device allowed at a time. Logging in from a new device will automatically log out from the previous one.
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                      <Switch 
                        checked={oneDeviceLogin} 
                        onCheckedChange={setOneDeviceLogin}
                        className="data-[state=checked]:bg-indigo-500"
                      />
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${
                      oneDeviceLogin ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
                    }`}>
                      {oneDeviceLogin ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {oneDeviceLogin ? 'Enforced' : 'Disabled'}
                    </div>
                  </div>

                  {/* One IP Allowed */}
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                          <Wifi className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">One IP Allowed</h4>
                          <p className="text-xs text-slate-400">Current: 103.xx.xx.45</p>
                        </div>
                      </div>
                      <Switch 
                        checked={oneIPAllowed} 
                        onCheckedChange={setOneIPAllowed}
                        className="data-[state=checked]:bg-cyan-500"
                      />
                    </div>
                    <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                        >
                          <RefreshCw className="w-3 h-3 mr-2" />
                          Request IP Change
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">IP Change Verification</DialogTitle>
                          <DialogDescription className="text-slate-400">
                            Enter the OTP sent to your registered mobile number to approve IP change.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <Input 
                            placeholder="Enter 6-digit OTP" 
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="bg-slate-800 border-slate-700 text-center text-lg tracking-widest"
                            maxLength={6}
                          />
                          <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                            Verify & Change IP
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Identity Verification Section */}
            <Card className="glass-panel border-border/30">
              <CardHeader className="border-b border-border/30 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  Identity Verification (One-Time)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {/* ID Proof Upload */}
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 border-dashed">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/10 mx-auto flex items-center justify-center mb-3">
                        <Upload className="w-6 h-6 text-indigo-400" />
                      </div>
                      <h4 className="font-semibold text-white mb-1">ID Proof</h4>
                      <p className="text-xs text-slate-400 mb-3">Aadhaar / PAN / Passport</p>
                      {isVerified ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          <Check className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Button size="sm" variant="outline" className="border-indigo-500/30 text-indigo-400">
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Face Scan */}
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 mx-auto flex items-center justify-center mb-3">
                        <Scan className="w-6 h-6 text-purple-400" />
                      </div>
                      <h4 className="font-semibold text-white mb-1">Face Scan</h4>
                      <p className="text-xs text-slate-400 mb-3">AI-powered verification</p>
                      {isVerified ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          <Check className="w-3 h-3 mr-1" />
                          Matched
                        </Badge>
                      ) : (
                        <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-400">
                          <Fingerprint className="w-3 h-3 mr-2" />
                          Start Scan
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* AI Match Result */}
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <div className="text-center">
                      <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3 ${
                        isVerified ? 'bg-emerald-500/10' : 'bg-red-500/10'
                      }`}>
                        {isVerified ? (
                          <Check className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <X className="w-6 h-6 text-red-400" />
                        )}
                      </div>
                      <h4 className="font-semibold text-white mb-1">AI Match Result</h4>
                      <p className="text-xs text-slate-400 mb-3">Identity confidence score</p>
                      <div className={`text-2xl font-bold ${isVerified ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isVerified ? '98%' : '0%'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {isVerified && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-2"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-emerald-400 font-semibold">Identity Verified ✓</span>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Master Access Key Section */}
            <Card className="glass-panel border-border/30">
              <CardHeader className="border-b border-border/30 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Key className="w-5 h-5 text-amber-400" />
                  Master Access Key
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!masterKeyEntered ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-amber-400 text-sm font-medium">First Login Required</p>
                        <Tooltip>
                          <TooltipTrigger>
                            <p className="text-amber-400/70 text-xs underline decoration-dashed cursor-help">
                              Key valid for first login only
                            </p>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            The master key is a one-time access code provided during onboarding. After first use, you'll set up your permanent credentials.
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Input 
                        type="password"
                        placeholder="Enter master access key" 
                        value={masterKey}
                        onChange={(e) => setMasterKey(e.target.value)}
                        className="bg-slate-800 border-slate-700 flex-1"
                      />
                      <Button 
                        className="bg-amber-500 hover:bg-amber-600 text-black"
                        onClick={() => setMasterKeyEntered(true)}
                      >
                        Verify Key
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <Check className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-400 text-sm">Master key verified. Set your permanent credentials.</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-400 block mb-2">Username</label>
                        <Input placeholder="Choose username" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 block mb-2">Password</label>
                        <Input type="password" placeholder="Create password" className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                    <Button className="bg-indigo-500 hover:bg-indigo-600">
                      Save Credentials
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Masking System Section */}
            <Card className="glass-panel border-border/30">
              <CardHeader className="border-b border-border/30 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <EyeOff className="w-5 h-5 text-purple-400" />
                  Masking System
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* Phone Masking */}
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">Phone Masking</h4>
                          <p className="text-xs text-slate-400">
                            {phoneMasking ? '+91 XXXXX XX890' : '+91 98765 43890'}
                          </p>
                        </div>
                      </div>
                      <Switch 
                        checked={phoneMasking} 
                        onCheckedChange={setPhoneMasking}
                        className="data-[state=checked]:bg-purple-500"
                      />
                    </div>
                  </div>

                  {/* Email Masking */}
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                          {emailMasking ? <EyeOff className="w-5 h-5 text-cyan-400" /> : <Eye className="w-5 h-5 text-cyan-400" />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">Email Masking</h4>
                          <p className="text-xs text-slate-400">
                            {emailMasking ? 'j***@email.com' : 'john@email.com'}
                          </p>
                        </div>
                      </div>
                      <Switch 
                        checked={emailMasking} 
                        onCheckedChange={setEmailMasking}
                        className="data-[state=checked]:bg-cyan-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-400" />
                    Franchise can communicate but cannot reveal identity. All contact goes through secure relay.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Auto Suspension Section */}
            <Card className="glass-panel border-border/30">
              <CardHeader className="border-b border-border/30 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Ban className="w-5 h-5 text-red-400" />
                  Auto Suspension Triggers
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
                            <Badge variant="outline" className={getSeverityColor(item.severity)}>
                              {item.severity}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                              item.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
                            }`}>
                              {item.active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                              {item.active ? 'Active' : 'Disabled'}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Geo Access Section */}
            <Card className="glass-panel border-border/30">
              <CardHeader className="border-b border-border/30 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  Geo Access Control
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-400 block mb-2">Region Allowed</label>
                      <Tooltip>
                        <TooltipTrigger className="w-full">
                          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                            <SelectTrigger className="bg-slate-800 border-slate-700">
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              <SelectItem value="india">India</SelectItem>
                              <SelectItem value="middle-east">Middle East</SelectItem>
                              <SelectItem value="africa">Africa</SelectItem>
                              <SelectItem value="south-asia">South Asia</SelectItem>
                              <SelectItem value="southeast-asia">Southeast Asia</SelectItem>
                            </SelectContent>
                          </Select>
                        </TooltipTrigger>
                        <TooltipContent>
                          Login allowed only within approved zones
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-slate-300">Delhi, Mumbai, Bangalore</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-slate-300">Chennai, Hyderabad, Pune</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <X className="w-4 h-4 text-red-400" />
                        <span className="text-slate-500">International locations blocked</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative h-48 rounded-xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
                    {/* Map Preview */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
                        <path
                          d="M30 10 L45 8 L55 12 L65 15 L75 20 L80 30 L78 40 L82 50 L75 60 L70 70 L60 80 L50 90 L40 88 L30 82 L22 75 L18 65 L15 55 L12 45 L15 35 L20 25 L25 15 Z"
                          fill="hsl(var(--primary) / 0.1)"
                          stroke="hsl(var(--primary))"
                          strokeWidth="0.5"
                        />
                      </svg>
                      {/* Location Markers */}
                      <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <div className="absolute top-2/3 left-1/2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="absolute bottom-2 left-2 text-xs text-slate-500">
                      {selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1).replace('-', ' ')} Region
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side Panel */}
          <div className="space-y-6">
            {/* Real-time Alerts */}
            <Card className="glass-panel border-border/30">
              <CardHeader className="border-b border-border/30 pb-4">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-400" />
                    Real-time Alerts
                  </div>
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-amber-400 absolute -top-1 -right-1 animate-ping" />
                    <Bell className="w-5 h-5 text-slate-400" />
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
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs opacity-70 mt-1">{alert.time}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Super Admin Override */}
            <Card className="glass-panel border-border/30 border-indigo-500/30">
              <CardHeader className="border-b border-border/30 pb-4 bg-indigo-500/5">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Server className="w-5 h-5 text-indigo-400" />
                  Admin Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-red-500/30 text-red-400 hover:bg-red-500/10"
                    onClick={() => setAccountStatus('suspended')}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Block Account
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                    onClick={() => setAccountStatus('active')}
                  >
                    <Unlock className="w-4 h-4 mr-2" />
                    Unblock Account
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Device
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Approve IP Change
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Force Suspend
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Badges */}
            <Card className="glass-panel border-border/30">
              <CardHeader className="border-b border-border/30 pb-4">
                <CardTitle className="text-lg">Compliance Badges</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
                    <Shield className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                    <p className="text-xs text-emerald-400 font-medium">ISO 27001</p>
                  </div>
                  <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-center">
                    <Lock className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
                    <p className="text-xs text-indigo-400 font-medium">GDPR</p>
                  </div>
                  <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-center">
                    <Server className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                    <p className="text-xs text-cyan-400 font-medium">SOC 2</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-center">
                    <Fingerprint className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                    <p className="text-xs text-purple-400 font-medium">PCI DSS</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default FranchiseSecurityModule;

/**
 * RESELLER PROFILE & SECURITY
 * Profile View, Password Change, 2FA Enable, Logout
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Shield,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export function RSProfileScreen() {
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const profileData = {
    name: 'Rajesh Kumar',
    email: 'r***@gmail.com',
    phone: '98***45',
    location: 'Mumbai, India',
    resellerCode: 'RS-MUM-2024',
    joinDate: 'January 2024',
    status: 'Active',
    totalSales: 15,
    totalCommission: '₹84,000',
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    toast.success('Password changed successfully!');
    setPasswordDialogOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handle2FAToggle = (enabled: boolean) => {
    setIs2FAEnabled(enabled);
    if (enabled) {
      toast.success('Two-Factor Authentication enabled');
    } else {
      toast.info('Two-Factor Authentication disabled');
    }
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    // In real app, would redirect to login
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Profile & Security</h1>
        <p className="text-sm text-slate-400">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-400" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
                  {profileData.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{profileData.name}</h3>
                  <p className="text-sm text-slate-400">Reseller Code: {profileData.resellerCode}</p>
                  <Badge className="bg-emerald-500/20 text-emerald-400 mt-1">{profileData.status}</Badge>
                </div>
              </div>

              <Separator className="bg-slate-800" />

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="text-white">{profileData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                  <Phone className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="text-white">{profileData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400">Location</p>
                    <p className="text-white">{profileData.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                  <User className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400">Member Since</p>
                    <p className="text-white">{profileData.joinDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-400" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Password */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-white font-medium">Password</p>
                    <p className="text-xs text-slate-400">Last changed 30 days ago</p>
                  </div>
                </div>
                <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
                      Change
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800">
                    <DialogHeader>
                      <DialogTitle className="text-white">Change Password</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="relative">
                        <Input
                          type={showPasswords ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Current Password"
                          className="bg-slate-800 border-slate-700 text-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <Input
                        type={showPasswords ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                      <Input
                        type={showPasswords ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <DialogFooter>
                      <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handlePasswordChange}>
                        Update Password
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* 2FA */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-white font-medium">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-400">Add an extra layer of security</p>
                  </div>
                </div>
                <Switch
                  checked={is2FAEnabled}
                  onCheckedChange={handle2FAToggle}
                  className="data-[state=checked]:bg-emerald-600"
                />
              </div>

              {/* 2FA Status */}
              <div className={`flex items-center gap-2 p-3 rounded-lg ${is2FAEnabled ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-amber-500/10 border border-amber-500/30'}`}>
                {is2FAEnabled ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400">Your account is protected with 2FA</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                    <span className="text-sm text-amber-400">Enable 2FA for better security</span>
                  </>
                )}
              </div>

              {/* Logout */}
              <Separator className="bg-slate-800" />
              <Button
                variant="outline"
                className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-slate-400">Total Sales</p>
              <p className="text-3xl font-bold text-emerald-400">{profileData.totalSales}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-slate-400">Total Commission</p>
              <p className="text-2xl font-bold text-white">{profileData.totalCommission}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-slate-700 text-slate-300 justify-start"
              >
                <Mail className="h-4 w-4 mr-2" />
                Update Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-slate-700 text-slate-300 justify-start"
              >
                <Phone className="h-4 w-4 mr-2" />
                Update Phone
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-slate-700 text-slate-300 justify-start"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Update Address
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

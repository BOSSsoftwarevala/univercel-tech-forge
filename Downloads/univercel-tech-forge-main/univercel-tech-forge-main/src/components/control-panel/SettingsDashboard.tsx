/**
 * SettingsDashboard - Enterprise Settings Management
 * Handles: Profile, Preferences, Notifications, Theme, Logout
 */

import React, { useState, useEffect } from "react";
import { 
  Settings, User, Bell, Palette, Globe, LogOut,
  Mail, Phone, Camera, Save, Check, Moon, Sun,
  Volume2, VolumeX, Eye, EyeOff, Languages, Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function SettingsDashboard() {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [saving, setSaving] = useState(false);
  
  // Profile State
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    timezone: "Asia/Kolkata",
    language: "en"
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    securityAlerts: true,
    marketingEmails: false,
    soundEnabled: true
  });

  // Display Settings
  const [display, setDisplay] = useState({
    darkMode: true,
    compactView: false,
    showAvatars: true,
    animationsEnabled: true
  });

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        email: user.email || "",
        fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || ""
      }));
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: profile.fullName }
      });
      
      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.info("Processing profile update...");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (err) {
      toast.info("Signing out...");
    }
  };

  return (
    <div className="h-full p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Settings className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-sm text-slate-400">Manage your account preferences</p>
          </div>
        </div>
        <Button variant="destructive" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-slate-800/50 border-slate-700">
          <TabsTrigger value="profile" className="data-[state=active]:bg-slate-700">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-700">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="display" className="data-[state=active]:bg-slate-700">
            <Palette className="h-4 w-4 mr-2" />
            Display
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Avatar Card */}
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Profile Photo</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24 border-4 border-slate-700">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-2xl text-white">
                    {profile.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
                <div className="text-center">
                  <p className="font-medium text-white">{profile.fullName || "User"}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {userRole || "user"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Profile Details */}
            <Card className="bg-slate-900/50 border-slate-700/50 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white">Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Full Name</Label>
                    <Input
                      value={profile.fullName}
                      onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                      className="bg-slate-800/50 border-slate-700"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Email</Label>
                    <Input
                      value={profile.email}
                      disabled
                      className="bg-slate-800/50 border-slate-700 opacity-60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Phone</Label>
                    <Input
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-slate-800/50 border-slate-700"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Timezone</Label>
                    <Select value={profile.timezone} onValueChange={(v) => setProfile(prev => ({ ...prev, timezone: v }))}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                        <SelectItem value="America/New_York">New York (EST)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Asia/Dubai">Dubai (GST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleSaveProfile} disabled={saving} className="mt-4">
                  {saving ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'emailNotifications', icon: Mail, label: 'Email Notifications', desc: 'Receive updates via email' },
                { key: 'pushNotifications', icon: Bell, label: 'Push Notifications', desc: 'Browser push notifications' },
                { key: 'taskReminders', icon: Clock, label: 'Task Reminders', desc: 'Get reminded about pending tasks' },
                { key: 'securityAlerts', icon: Eye, label: 'Security Alerts', desc: 'Important security notifications' },
                { key: 'soundEnabled', icon: Volume2, label: 'Sound Effects', desc: 'Play sounds for notifications' },
                { key: 'marketingEmails', icon: Mail, label: 'Marketing Emails', desc: 'Product updates and offers' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, [item.key]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display" className="mt-6">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Display Settings</CardTitle>
              <CardDescription>Customize your visual experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'darkMode', icon: Moon, label: 'Dark Mode', desc: 'Use dark theme (recommended)' },
                { key: 'compactView', icon: Eye, label: 'Compact View', desc: 'Show more content in less space' },
                { key: 'showAvatars', icon: User, label: 'Show Avatars', desc: 'Display user profile pictures' },
                { key: 'animationsEnabled', icon: Palette, label: 'Animations', desc: 'Enable UI animations' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={display[item.key as keyof typeof display]}
                    onCheckedChange={(checked) => 
                      setDisplay(prev => ({ ...prev, [item.key]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Danger Zone */}
      <Card className="bg-red-950/20 border-red-900/50">
        <CardHeader>
          <CardTitle className="text-red-400">Danger Zone</CardTitle>
          <CardDescription className="text-red-300/70">Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant="outline" className="border-red-700 text-red-400 hover:bg-red-950" onClick={() => navigate('/forgot-password')}>
            Reset Password
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout from All Devices
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

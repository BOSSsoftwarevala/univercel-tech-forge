import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Bell, 
  ShieldAlert, 
  LogOut, 
  User,
  Radio,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface BossPanelHeaderProps {
  streamingOn: boolean;
  onStreamingToggle: () => void;
}

export function BossPanelHeader({ streamingOn, onStreamingToggle }: BossPanelHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0d0d18]/95 backdrop-blur-xl border-b border-amber-500/20 z-50 flex items-center justify-between px-6">
      {/* Left - Logo & System Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
            <Crown className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-amber-400">BOSS PANEL</h1>
            <p className="text-[10px] text-amber-500/60 uppercase tracking-widest">Command Center</p>
          </div>
        </div>
      </div>

      {/* Center - Live Status */}
      <div className="flex items-center gap-4">
        <motion.button
          onClick={onStreamingToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
            streamingOn 
              ? 'bg-green-500/20 border-green-500/50 text-green-400' 
              : 'bg-red-500/20 border-red-500/50 text-red-400'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Radio className={`w-4 h-4 ${streamingOn ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-medium">
            {streamingOn ? 'LIVE STREAMING' : 'STREAM PAUSED'}
          </span>
        </motion.button>
      </div>

      {/* Right - Search, Notifications, Emergency, Profile */}
      <div className="flex items-center gap-4">
        {/* Global Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads, tasks, users..."
            className="w-64 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-white/70 hover:text-white hover:bg-white/10">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center">
            3
          </span>
        </Button>

        {/* Emergency Lock Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
            >
              <ShieldAlert className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#1a1a2e] border-red-500/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-400">⚠️ Emergency System Lock</AlertDialogTitle>
              <AlertDialogDescription className="text-white/70">
                This will immediately lock down all system operations. Only you can unlock it.
                All active sessions will be terminated and pending transactions frozen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white">
                Confirm Emergency Lock
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                <User className="w-4 h-4 text-black" />
              </div>
              <span className="text-sm font-medium">Boss</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#1a1a2e] border-white/10" align="end">
            <DropdownMenuItem className="text-white/70 hover:text-white focus:text-white focus:bg-white/10">
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

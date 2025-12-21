import React from 'react';
import { 
  Bell, 
  Search, 
  Wallet, 
  Moon, 
  Sun, 
  MessageSquare,
  AlertTriangle,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface WireframeHeaderProps {
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
  onChatToggle: () => void;
}

export function WireframeHeader({ theme, onThemeToggle, onChatToggle }: WireframeHeaderProps) {
  const isDark = theme === 'dark';

  return (
    <header className={`fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-4 border-b ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
    }`}>
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className={`text-2xl font-bold bg-gradient-to-r ${
          isDark ? 'from-cyan-400 to-purple-500' : 'from-cyan-600 to-purple-700'
        } bg-clip-text text-transparent`}>
          SOFTWARE VALA
        </div>
        <Badge variant="outline" className="text-xs bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/50">
          2035 EDITION
        </Badge>
      </div>

      {/* Center - Global Search */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search modules, leads, tasks, demos..." 
            className={`pl-10 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Live Alerts Counter */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold animate-pulse">
            12
          </span>
        </Button>

        {/* Buzzer Icon */}
        <Button variant="ghost" size="icon" className="relative">
          <AlertTriangle className="h-5 w-5 text-amber-500 animate-pulse" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-amber-500 rounded-full text-[10px] flex items-center justify-center text-black font-bold">
            3
          </span>
        </Button>

        {/* Wallet Balance */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
          isDark ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-emerald-100 border border-emerald-300'
        }`}>
          <Wallet className="h-4 w-4 text-emerald-500" />
          <span className="text-sm font-semibold text-emerald-500">₹12,450</span>
        </div>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={onThemeToggle}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Chat Toggle */}
        <Button variant="ghost" size="icon" onClick={onChatToggle}>
          <MessageSquare className="h-5 w-5" />
        </Button>

        {/* Profile Avatar */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer ${
          isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200'
        }`}>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium">Super Admin</p>
            <p className="text-[10px] text-muted-foreground">ID: SA***001</p>
          </div>
        </div>
      </div>
    </header>
  );
}

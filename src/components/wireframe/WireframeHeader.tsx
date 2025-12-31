import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Wallet, 
  Moon, 
  Sun, 
  MessageSquare,
  AlertTriangle,
  User,
  Check,
  X,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface WireframeHeaderProps {
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
  onChatToggle: () => void;
}

const mockNotifications = [
  { id: 1, type: 'lead', title: 'New Lead Assigned', desc: 'Lead #L-2847 from Mumbai', time: '2 min ago', read: false },
  { id: 2, type: 'task', title: 'Task Deadline', desc: 'Task #T-1234 due in 1 hour', time: '15 min ago', read: false },
  { id: 3, type: 'system', title: 'System Update', desc: 'New features deployed', time: '1 hour ago', read: true },
];

const mockBuzzerAlerts = [
  { id: 1, priority: 'high', title: 'Hot Lead Waiting', desc: 'Needs immediate attention', time: '30s' },
  { id: 2, priority: 'medium', title: 'Demo Request', desc: 'Client waiting for callback', time: '2 min' },
  { id: 3, priority: 'high', title: 'Escalation', desc: 'SLA breach imminent', time: '5 min' },
];

export function WireframeHeader({ theme, onThemeToggle, onChatToggle }: WireframeHeaderProps) {
  const isDark = theme === 'dark';
  const [notifications, setNotifications] = useState(mockNotifications);
  const [buzzerAlerts, setBuzzerAlerts] = useState(mockBuzzerAlerts);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    toast.success('Notification marked as read');
  };

  const handleAcceptBuzzer = (id: number) => {
    setBuzzerAlerts(prev => prev.filter(a => a.id !== id));
    toast.success('Alert accepted', { description: 'Task has been assigned to you.' });
  };

  const handleDismissBuzzer = (id: number) => {
    setBuzzerAlerts(prev => prev.filter(a => a.id !== id));
    toast.info('Alert dismissed', { description: 'Alert will be escalated.' });
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      toast.info(`Searching for: "${searchQuery}"`, { description: 'Feature coming soon' });
    }
  };

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Live Alerts Counter - Notifications Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className={`w-80 p-0 ${isDark ? 'bg-slate-900 border-slate-800' : ''}`} align="end">
            <div className={`p-3 border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
              <h4 className="font-semibold">Notifications</h4>
              <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
            </div>
            <ScrollArea className="h-64">
              <div className="p-2 space-y-2">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      notif.read 
                        ? isDark ? 'bg-slate-800/50' : 'bg-gray-50'
                        : isDark ? 'bg-slate-800 border border-cyan-500/30' : 'bg-blue-50 border border-blue-200'
                    }`}
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">{notif.title}</p>
                        <p className="text-xs text-muted-foreground">{notif.desc}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className={`p-2 border-t ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => toast.info('View all notifications')}>
                View All Notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Buzzer Icon - Alerts Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <AlertTriangle className="h-5 w-5 text-amber-500 animate-pulse" />
              {buzzerAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-amber-500 rounded-full text-[10px] flex items-center justify-center text-black font-bold">
                  {buzzerAlerts.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className={`w-80 p-0 ${isDark ? 'bg-slate-900 border-slate-800' : ''}`} align="end">
            <div className={`p-3 border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
              <h4 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Buzzer Alerts
              </h4>
              <p className="text-xs text-muted-foreground">{buzzerAlerts.length} pending actions</p>
            </div>
            <ScrollArea className="max-h-64">
              <div className="p-2 space-y-2">
                {buzzerAlerts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No pending alerts</p>
                ) : (
                  buzzerAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg ${
                        alert.priority === 'high'
                          ? 'bg-red-500/10 border border-red-500/30'
                          : 'bg-amber-500/10 border border-amber-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium">{alert.title}</p>
                          <p className="text-xs text-muted-foreground">{alert.desc}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          {alert.time}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 h-7 bg-emerald-500 hover:bg-emerald-600"
                          onClick={() => handleAcceptBuzzer(alert.id)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-7"
                          onClick={() => handleDismissBuzzer(alert.id)}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Wallet Balance */}
        <Popover>
          <PopoverTrigger asChild>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
              isDark ? 'bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30' : 'bg-emerald-100 border border-emerald-300 hover:bg-emerald-200'
            }`}>
              <Wallet className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-semibold text-emerald-500">₹12,450</span>
            </div>
          </PopoverTrigger>
          <PopoverContent className={`w-64 ${isDark ? 'bg-slate-900 border-slate-800' : ''}`} align="end">
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold text-emerald-500">₹12,450</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-sm font-semibold">₹3,200</p>
                </div>
                <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                  <p className="text-xs text-muted-foreground">This Month</p>
                  <p className="text-sm font-semibold">₹28,500</p>
                </div>
              </div>
              <Button className="w-full" size="sm" onClick={() => toast.info('Opening wallet...')}>
                View Wallet Details
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={onThemeToggle}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Chat Toggle */}
        <Button variant="ghost" size="icon" onClick={onChatToggle}>
          <MessageSquare className="h-5 w-5" />
        </Button>

        {/* Profile Avatar */}
        <Popover>
          <PopoverTrigger asChild>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
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
          </PopoverTrigger>
          <PopoverContent className={`w-48 ${isDark ? 'bg-slate-900 border-slate-800' : ''}`} align="end">
            <div className="space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => toast.info('Opening profile...')}>
                My Profile
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => toast.info('Opening settings...')}>
                Settings
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-red-500 hover:text-red-500" onClick={() => toast.info('Logging out...')}>
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}

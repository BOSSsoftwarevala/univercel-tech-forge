import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, Smartphone, Tablet, Globe, Clock, 
  MapPin, Shield, LogOut, AlertTriangle, 
  Check, X, RefreshCw, Search, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface Session {
  id: string;
  userId: string;
  userName: string;
  maskedId: string;
  role: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  ip: string;
  location: string;
  startedAt: Date;
  lastActivity: Date;
  status: 'active' | 'idle' | 'suspicious';
  isCurrent: boolean;
}

const mockSessions: Session[] = [
  {
    id: '1',
    userId: 'usr_001',
    userName: 'Vikram Singh',
    maskedId: 'USR-****-VS01',
    role: 'super_admin',
    device: 'desktop',
    browser: 'Chrome 120',
    os: 'Windows 11',
    ip: '192.168.1.45',
    location: 'Mumbai, India',
    startedAt: new Date(Date.now() - 3600000),
    lastActivity: new Date(Date.now() - 120000),
    status: 'active',
    isCurrent: true,
  },
  {
    id: '2',
    userId: 'usr_002',
    userName: 'Priya Sharma',
    maskedId: 'USR-****-PS02',
    role: 'developer',
    device: 'desktop',
    browser: 'Firefox 121',
    os: 'macOS Sonoma',
    ip: '10.0.0.156',
    location: 'Bangalore, India',
    startedAt: new Date(Date.now() - 7200000),
    lastActivity: new Date(Date.now() - 300000),
    status: 'active',
    isCurrent: false,
  },
  {
    id: '3',
    userId: 'usr_003',
    userName: 'Rahul Patel',
    maskedId: 'USR-****-RP03',
    role: 'franchise',
    device: 'mobile',
    browser: 'Safari Mobile',
    os: 'iOS 17',
    ip: '203.45.67.89',
    location: 'Delhi, India',
    startedAt: new Date(Date.now() - 14400000),
    lastActivity: new Date(Date.now() - 1800000),
    status: 'idle',
    isCurrent: false,
  },
  {
    id: '4',
    userId: 'usr_004',
    userName: 'Unknown User',
    maskedId: 'USR-****-XX04',
    role: 'client',
    device: 'desktop',
    browser: 'Chrome 119',
    os: 'Linux',
    ip: '178.32.45.67',
    location: 'Unknown Location',
    startedAt: new Date(Date.now() - 900000),
    lastActivity: new Date(Date.now() - 60000),
    status: 'suspicious',
    isCurrent: false,
  },
  {
    id: '5',
    userId: 'usr_005',
    userName: 'Anita Desai',
    maskedId: 'USR-****-AD05',
    role: 'support',
    device: 'tablet',
    browser: 'Chrome Mobile',
    os: 'Android 14',
    ip: '192.168.2.78',
    location: 'Pune, India',
    startedAt: new Date(Date.now() - 5400000),
    lastActivity: new Date(Date.now() - 600000),
    status: 'active',
    isCurrent: false,
  },
];

export function DeviceSessionTracker() {
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'idle' | 'suspicious'>('all');
  const [filterDevice, setFilterDevice] = useState<'all' | 'desktop' | 'mobile' | 'tablet'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredSessions = sessions.filter(session => {
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    const matchesDevice = filterDevice === 'all' || session.device === filterDevice;
    const matchesSearch = 
      session.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.maskedId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesDevice && matchesSearch;
  });

  const activeSessions = sessions.filter(s => s.status === 'active').length;
  const suspiciousSessions = sessions.filter(s => s.status === 'suspicious').length;

  const refreshSessions = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Sessions Refreshed",
        description: `Found ${sessions.length} active sessions.`,
      });
    }, 1000);
  };

  const terminateSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
    toast({
      title: "Session Terminated",
      description: "The session has been forcefully terminated.",
    });
  };

  const terminateAllOther = () => {
    setSessions(sessions.filter(s => s.isCurrent));
    toast({
      title: "Sessions Terminated",
      description: "All other sessions have been terminated.",
    });
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop': return Monitor;
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'idle': return 'bg-orange-500/20 text-orange-500 border-orange-500/50';
      case 'suspicious': return 'bg-red-500/20 text-red-500 border-red-500/50';
      default: return '';
    }
  };

  const formatDuration = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-mono font-bold text-foreground flex items-center gap-2">
            <Monitor className="w-5 h-5 text-primary" />
            Device & Session Tracker
          </h2>
          <p className="text-sm text-muted-foreground">Monitor active sessions across all devices</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-mono text-green-500">{activeSessions} Active</span>
          </div>
          {suspiciousSessions > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-mono text-red-500">{suspiciousSessions} Suspicious</span>
            </div>
          )}
          <Button variant="outline" onClick={refreshSessions} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing && 'animate-spin'}`} />
            Refresh
          </Button>
          <Button variant="destructive" onClick={terminateAllOther}>
            <LogOut className="w-4 h-4 mr-2" />
            End All Other
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search user, ID, or location..."
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="idle">Idle</SelectItem>
              <SelectItem value="suspicious">Suspicious</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterDevice} onValueChange={(v: any) => setFilterDevice(v)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Device" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Devices</SelectItem>
              <SelectItem value="desktop">Desktop</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
              <SelectItem value="tablet">Tablet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid gap-3">
        {filteredSessions.map((session, index) => {
          const DeviceIcon = getDeviceIcon(session.device);
          
          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`glass-panel p-4 ${session.status === 'suspicious' && 'border-red-500/30'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Device Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    session.status === 'suspicious' 
                      ? 'bg-red-500/20 text-red-500' 
                      : 'bg-primary/20 text-primary'
                  }`}>
                    <DeviceIcon className="w-6 h-6" />
                  </div>

                  {/* Session Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{session.userName}</span>
                      <code className="text-xs text-muted-foreground font-mono">{session.maskedId}</code>
                      {session.isCurrent && (
                        <Badge className="bg-primary/20 text-primary border-primary/50">
                          Current
                        </Badge>
                      )}
                      <Badge variant="outline" className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {session.role}
                      </span>
                      <span>{session.browser} • {session.os}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {session.ip}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {session.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Active {formatDuration(session.lastActivity)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {!session.isCurrent && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => terminateSession(session.id)}
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Terminate
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default DeviceSessionTracker;

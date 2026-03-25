import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, AlertTriangle, CheckCircle, Clock, X, Volume2, VolumeX,
  Filter, Search, RefreshCw, ChevronRight, User, MapPin, Zap,
  Target, MessageSquare, Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface BuzzerItem {
  id: string;
  type: 'lead' | 'task' | 'escalation' | 'system' | 'demo';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  title: string;
  description: string;
  roleTarget: string;
  region?: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'dismissed' | 'escalated';
  escalationLevel: number;
}

const mockBuzzers: BuzzerItem[] = [
  { id: '1', type: 'lead', priority: 'urgent', title: 'New Prime Lead Waiting', description: 'Lead from Mumbai requires immediate attention', roleTarget: 'franchise', region: 'West India', timestamp: '2 mins ago', status: 'pending', escalationLevel: 1 },
  { id: '2', type: 'task', priority: 'high', title: 'Developer Task Breach Warning', description: 'Task #1234 approaching deadline', roleTarget: 'developer', timestamp: '5 mins ago', status: 'pending', escalationLevel: 2 },
  { id: '3', type: 'escalation', priority: 'urgent', title: 'Customer Escalation', description: 'Prime user requesting urgent support', roleTarget: 'support', timestamp: '10 mins ago', status: 'pending', escalationLevel: 3 },
  { id: '4', type: 'demo', priority: 'high', title: 'Demo Health Alert', description: 'CRM Demo experiencing downtime', roleTarget: 'demo_manager', timestamp: '15 mins ago', status: 'pending', escalationLevel: 1 },
  { id: '5', type: 'system', priority: 'normal', title: 'System Update Available', description: 'New security patch ready for deployment', roleTarget: 'admin', timestamp: '30 mins ago', status: 'accepted', escalationLevel: 0 },
];

const priorityConfig = {
  low: { color: 'text-slate-400', bg: 'bg-slate-500/20', border: 'border-slate-500/30', ring: 'ring-slate-500/30' },
  normal: { color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30', ring: 'ring-cyan-500/30' },
  high: { color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30', ring: 'ring-amber-500/30' },
  urgent: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', ring: 'ring-red-500/30' },
};

const typeConfig = {
  lead: { icon: Target, color: 'text-emerald-400' },
  task: { icon: Clock, color: 'text-violet-400' },
  escalation: { icon: AlertTriangle, color: 'text-red-400' },
  system: { icon: Shield, color: 'text-blue-400' },
  demo: { icon: Zap, color: 'text-amber-400' },
};

const NotificationBuzzerConsole = () => {
  const [buzzers, setBuzzers] = useState<BuzzerItem[]>(mockBuzzers);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingCount = buzzers.filter(b => b.status === 'pending').length;
  const urgentCount = buzzers.filter(b => b.priority === 'urgent' && b.status === 'pending').length;

  const handleAccept = (id: string) => {
    setBuzzers(prev => prev.map(b => b.id === id ? { ...b, status: 'accepted' as const } : b));
    toast.success('Buzzer accepted');
  };

  const handleDismiss = (id: string) => {
    setBuzzers(prev => prev.map(b => b.id === id ? { ...b, status: 'dismissed' as const } : b));
    toast.info('Buzzer dismissed');
  };

  const filteredBuzzers = buzzers.filter(b => {
    if (filter === 'pending' && b.status !== 'pending') return false;
    if (filter === 'accepted' && b.status !== 'accepted') return false;
    if (searchQuery && !b.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/10 to-slate-950 text-white p-6">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.1),transparent_50%)]" />
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <defs>
            <pattern id="buzzer-grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="1" fill="currentColor" className="text-red-500" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#buzzer-grid)" />
        </svg>
        
        {/* Animated pulse for urgent alerts */}
        {urgentCount > 0 && (
          <motion.div
            className="absolute inset-0 bg-red-500/5"
            animate={{ opacity: [0.02, 0.08, 0.02] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <motion.div
                animate={urgentCount > 0 ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5, repeat: urgentCount > 0 ? Infinity : 0 }}
              >
                <Bell className={`w-8 h-8 ${urgentCount > 0 ? 'text-red-400' : 'text-amber-400'}`} />
              </motion.div>
              Notification & Buzzer Console
            </h1>
            <p className="text-slate-400 mt-1">Monitor and manage all system alerts</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`${pendingCount > 0 ? 'border-red-500/30 text-red-400' : 'border-slate-500/30 text-slate-400'}`}>
              {pendingCount} Pending
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`border-slate-700 ${soundEnabled ? 'text-emerald-400' : 'text-slate-400'}`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-400">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Alerts', value: buzzers.length, color: 'slate' },
            { label: 'Pending', value: pendingCount, color: 'amber' },
            { label: 'Urgent', value: urgentCount, color: 'red' },
            { label: 'Resolved Today', value: 47, color: 'emerald' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-slate-900/50 border-${stat.color}-500/30`}>
                <CardContent className="p-4">
                  <div className={`text-3xl font-bold text-${stat.color}-400`}>{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList className="bg-slate-800/50 border border-slate-700">
              <TabsTrigger value="all" className="data-[state=active]:bg-slate-700">All</TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">Pending</TabsTrigger>
              <TabsTrigger value="accepted" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">Accepted</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Buzzer List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredBuzzers.map((buzzer, index) => {
              const TypeIcon = typeConfig[buzzer.type].icon;
              const config = priorityConfig[buzzer.priority];
              
              return (
                <motion.div
                  key={buzzer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`bg-slate-900/50 ${config.border} ${
                    buzzer.priority === 'urgent' && buzzer.status === 'pending' ? 'ring-1 ' + config.ring : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Type Icon */}
                        <div className={`p-3 rounded-xl ${config.bg}`}>
                          <TypeIcon className={`w-6 h-6 ${typeConfig[buzzer.type].color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`${config.bg} ${config.color} border-0`}>
                              {buzzer.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="border-slate-600 text-slate-400">
                              {buzzer.type}
                            </Badge>
                            {buzzer.escalationLevel > 1 && (
                              <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                                Level {buzzer.escalationLevel}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-white">{buzzer.title}</h3>
                          <p className="text-sm text-slate-400 mt-1">{buzzer.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {buzzer.roleTarget}
                            </span>
                            {buzzer.region && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {buzzer.region}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {buzzer.timestamp}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {buzzer.status === 'pending' ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleAccept(buzzer.id)}
                                className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDismiss(buzzer.id)}
                                className="text-slate-400 hover:text-red-400"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <Badge className="bg-emerald-500/20 text-emerald-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {buzzer.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredBuzzers.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400">No alerts found</h3>
            <p className="text-slate-500">All clear! No matching notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationBuzzerConsole;

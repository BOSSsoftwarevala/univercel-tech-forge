import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Bell, Headphones, ListChecks, MessageSquare, Globe, Banknote,
  CheckCircle2, Clock, AlertTriangle, Users, Send, Search,
  FileText, Shield, Lock, Scale
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Modal Base Component
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Modal = ({ open, onClose, title, icon, children }: ModalProps) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
                     md:w-[600px] md:max-h-[80vh] bg-slate-900 border border-slate-700 rounded-xl z-50 overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center gap-3">
              {icon}
              <h2 className="text-lg font-semibold text-white">{title}</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <ScrollArea className="max-h-[60vh]">
            <div className="p-4">{children}</div>
          </ScrollArea>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// Notifications Modal
interface NotificationsModalProps {
  open: boolean;
  onClose: () => void;
  userId?: string;
  onUnreadCountChange?: (count: number) => void;
}

interface UserNotification {
  id: string;
  title: string | null;
  message: string;
  type: string;
  is_read: boolean | null;
  created_at: string;
  action_id: string | null;
}

export const NotificationsModal = ({ open, onClose, userId, onUnreadCountChange }: NotificationsModalProps) => {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const updateUnreadCount = (count: number) => {
    setUnreadCount(count);
    onUnreadCountChange?.(count);
  };

  useEffect(() => {
    if (!open || !userId) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        const normalizedNotifications = (data as any[]).map((item) => ({
          ...item,
          title: item.title ?? item.event_type ?? item.type ?? "Notification",
          action_id: item.action_id ?? null,
        }));
        setNotifications(normalizedNotifications as UserNotification[]);
        updateUnreadCount(data.filter((n) => !n.is_read).length);
      }
    };

    fetchNotifications();

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as UserNotification, ...prev]);
          setUnreadCount((prev) => {
            const next = prev + 1;
            onUnreadCountChange?.(next);
            return next;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [open, userId]);

  const handleMarkAllRead = async () => {
    if (userId) {
      await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      updateUnreadCount(0);
    }
    await supabase.from('audit_logs').insert({
      action: 'mark_all_notifications_read',
      module: 'boss-panel',
      meta_json: { count: unreadCount }
    });
    toast.success('All notifications marked as read');
  };

  const getNotifType = (notificationType: string | null) => {
    if (notificationType === 'order_created') return 'info';
    if (notificationType === 'critical') return 'critical';
    if (notificationType === 'warning') return 'warning';
    return 'info';
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      title="Notifications" 
      icon={<Bell className="w-5 h-5 text-blue-400" />}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className="bg-red-500/20 text-red-400">
            {unreadCount} unread
          </Badge>
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            Mark all read
          </Button>
        </div>
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No notifications</p>
          ) : notifications.map((notif) => (
            <div 
              key={notif.id}
              className={cn(
                "p-3 rounded-lg border transition-all cursor-pointer hover:border-blue-500/50",
                notif.is_read 
                  ? "bg-slate-800/50 border-slate-700" 
                  : "bg-slate-800 border-slate-600"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                  getNotifType(notif.type) === 'critical' ? "bg-red-500" :
                  getNotifType(notif.type) === 'warning' ? "bg-amber-500" : "bg-blue-500"
                )} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "text-sm font-medium",
                      notif.is_read ? "text-slate-300" : "text-white"
                    )}>
                      {notif.title || notif.type}
                    </p>
                    <span className="text-xs text-slate-500">{new Date(notif.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{notif.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

// Assist Modal
export const AssistModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [assistMode, setAssistMode] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [sessionCode, setSessionCode] = useState('');

  const handleConnect = async () => {
    setAssistMode('connecting');
    await new Promise(r => setTimeout(r, 2000));
    setAssistMode('connected');
    setSessionCode('SVL-' + Math.random().toString(36).substring(2, 8).toUpperCase());
    await supabase.from('audit_logs').insert({
      action: 'assist_session_started',
      module: 'boss-panel',
      meta_json: { mode: 'ultraviewer' }
    });
    toast.success('Assist session connected');
  };

  const handleDisconnect = async () => {
    await supabase.from('audit_logs').insert({
      action: 'assist_session_ended',
      module: 'boss-panel',
      meta_json: { session_code: sessionCode }
    });
    setAssistMode('idle');
    setSessionCode('');
    toast.info('Assist session ended');
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      title="Remote Assist" 
      icon={<Headphones className="w-5 h-5 text-purple-400" />}
    >
      <div className="space-y-6">
        {assistMode === 'idle' && (
          <div className="text-center py-8">
            <Headphones className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Start Assist Session</h3>
            <p className="text-slate-400 mb-6">Connect to provide remote assistance to staff</p>
            <Button onClick={handleConnect} className="bg-purple-600 hover:bg-purple-700">
              Start Session
            </Button>
          </div>
        )}
        {assistMode === 'connecting' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white">Connecting...</p>
          </div>
        )}
        {assistMode === 'connected' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <p className="text-sm text-purple-400 mb-1">Session Code</p>
              <p className="text-2xl font-mono font-bold text-white">{sessionCode}</p>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400 text-sm">Connected and ready</span>
            </div>
            <Button onClick={handleDisconnect} variant="destructive" className="w-full">
              End Session
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

// Promise Tracker Modal
export const PromiseTrackerModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const promises = [
    { id: 1, title: 'Deploy new auth system', assignee: 'Dev Team', due: '2024-01-20', status: 'in_progress', progress: 75 },
    { id: 2, title: 'Complete security audit', assignee: 'Security Lead', due: '2024-01-18', status: 'in_progress', progress: 40 },
    { id: 3, title: 'Fix payment gateway issues', assignee: 'Finance Dev', due: '2024-01-15', status: 'overdue', progress: 90 },
    { id: 4, title: 'Update legal documents', assignee: 'Legal Manager', due: '2024-01-25', status: 'pending', progress: 0 },
  ];

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      title="Promise Tracker" 
      icon={<ListChecks className="w-5 h-5 text-amber-400" />}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          {['all', 'in_progress', 'overdue', 'pending'].map((filter) => (
            <Badge 
              key={filter} 
              className={cn(
                "cursor-pointer capitalize",
                filter === 'all' ? "bg-blue-500/20 text-blue-400" : "bg-slate-700 text-slate-300"
              )}
            >
              {filter.replace('_', ' ')}
            </Badge>
          ))}
        </div>
        <div className="space-y-3">
          {promises.map((promise) => (
            <div key={promise.id} className="p-4 rounded-lg bg-slate-800 border border-slate-700">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-white">{promise.title}</h4>
                <Badge className={cn(
                  promise.status === 'in_progress' ? "bg-blue-500/20 text-blue-400" :
                  promise.status === 'overdue' ? "bg-red-500/20 text-red-400" :
                  "bg-slate-600 text-slate-300"
                )}>
                  {promise.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                <span>{promise.assignee}</span>
                <span>Due: {promise.due}</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all",
                    promise.status === 'overdue' ? "bg-red-500" : "bg-blue-500"
                  )} 
                  style={{ width: `${promise.progress}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

// Internal Chat Modal
export const InternalChatModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you today?' },
  ]);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const userMsg = { id: messages.length + 1, role: 'user', content: message };
    setMessages([...messages, userMsg]);
    setMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        role: 'assistant',
        content: 'I understand your request. Let me help you with that. Based on the current system status, I can provide guidance on any module operations, security protocols, or administrative tasks.'
      }]);
    }, 1000);
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      title="AI Assistant" 
      icon={<MessageSquare className="w-5 h-5 text-green-400" />}
    >
      <div className="space-y-4">
        <div className="h-[300px] overflow-y-auto space-y-3">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "p-3 rounded-lg max-w-[80%]",
                msg.role === 'user' 
                  ? "bg-blue-600 ml-auto" 
                  : "bg-slate-700"
              )}
            >
              <p className="text-sm text-white">{msg.content}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Language Modal
export const LanguageModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const languages = [
    { code: 'en', name: 'English (US)', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  ];
  const [selected, setSelected] = useState('en');

  const handleSelect = async (code: string) => {
    setSelected(code);
    await supabase.from('audit_logs').insert({
      action: 'language_changed',
      module: 'boss-panel',
      meta_json: { language: code }
    });
    toast.success(`Language changed to ${languages.find(l => l.code === code)?.name}`);
    onClose();
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      title="Language" 
      icon={<Globe className="w-5 h-5 text-cyan-400" />}
    >
      <div className="grid grid-cols-2 gap-2">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant="ghost"
            onClick={() => handleSelect(lang.code)}
            className={cn(
              "justify-start gap-3 h-12",
              selected === lang.code && "bg-blue-500/20 border border-blue-500/50"
            )}
          >
            <span className="text-xl">{lang.flag}</span>
            <span className="text-white">{lang.name}</span>
          </Button>
        ))}
      </div>
    </Modal>
  );
};

// Currency Modal
export const CurrencyModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  ];
  const [selected, setSelected] = useState('USD');

  const handleSelect = async (code: string) => {
    setSelected(code);
    await supabase.from('audit_logs').insert({
      action: 'currency_changed',
      module: 'boss-panel',
      meta_json: { currency: code }
    });
    toast.success(`Currency changed to ${code}`);
    onClose();
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      title="Currency" 
      icon={<Banknote className="w-5 h-5 text-green-400" />}
    >
      <div className="grid grid-cols-2 gap-2">
        {currencies.map((curr) => (
          <Button
            key={curr.code}
            variant="ghost"
            onClick={() => handleSelect(curr.code)}
            className={cn(
              "justify-start gap-3 h-12",
              selected === curr.code && "bg-green-500/20 border border-green-500/50"
            )}
          >
            <span className="text-xl font-bold text-green-400">{curr.symbol}</span>
            <div className="text-left">
              <p className="text-white text-sm">{curr.code}</p>
              <p className="text-slate-400 text-xs">{curr.name}</p>
            </div>
          </Button>
        ))}
      </div>
    </Modal>
  );
};

// Permission Matrix Modal
export const PermissionMatrixModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const permissions = [
    { role: 'Super Admin', modules: ['users', 'finance', 'reports', 'settings'], locked: ['finance'] },
    { role: 'Country Head', modules: ['users', 'reports', 'settings'], locked: [] },
    { role: 'Area Manager', modules: ['users', 'reports'], locked: [] },
    { role: 'Finance Manager', modules: ['finance', 'reports'], locked: ['finance'] },
  ];

  const allModules = ['users', 'finance', 'reports', 'settings', 'legal', 'marketing'];

  const handleToggleLock = async (role: string, module: string) => {
    await supabase.from('audit_logs').insert({
      action: 'permission_lock_toggled',
      module: 'boss-panel',
      meta_json: { role, module }
    });
    toast.success(`Permission lock toggled for ${role} - ${module}`);
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      title="Permission Matrix" 
      icon={<Lock className="w-5 h-5 text-blue-400" />}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left p-2 text-slate-400 text-sm">Role</th>
              {allModules.map((m) => (
                <th key={m} className="text-center p-2 text-slate-400 text-sm capitalize">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm) => (
              <tr key={perm.role} className="border-b border-slate-700/50">
                <td className="p-2 text-white text-sm">{perm.role}</td>
                {allModules.map((m) => {
                  const hasAccess = perm.modules.includes(m);
                  const isLocked = perm.locked.includes(m);
                  return (
                    <td key={m} className="text-center p-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleLock(perm.role, m)}
                        className={cn(
                          "w-8 h-8",
                          hasAccess 
                            ? isLocked 
                              ? "text-amber-400 bg-amber-500/20" 
                              : "text-green-400 bg-green-500/20"
                            : "text-slate-500 bg-slate-700/50"
                        )}
                      >
                        {isLocked ? <Lock className="w-3 h-3" /> : 
                         hasAccess ? <CheckCircle2 className="w-3 h-3" /> : 
                         <X className="w-3 h-3" />}
                      </Button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

// Super Admin Creation Modal
export const CreateSuperAdminModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    continents: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const continents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || formData.continents.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await supabase.from('audit_logs').insert({
        action: 'create_super_admin',
        module: 'boss-panel',
        meta_json: { 
          name: formData.name, 
          email: formData.email,
          continents: formData.continents 
        }
      });
      toast.success(`Super Admin ${formData.name} created successfully`);
      onClose();
    } catch (error) {
      toast.error('Failed to create Super Admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      title="Create Super Admin" 
      icon={<Users className="w-5 h-5 text-blue-400" />}
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-400 block mb-1">Full Name *</label>
          <Input 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter full name"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400 block mb-1">Email *</label>
          <Input 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter email address"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400 block mb-2">Assigned Continents *</label>
          <div className="grid grid-cols-2 gap-2">
            {continents.map((c) => (
              <Button
                key={c}
                type="button"
                variant="ghost"
                onClick={() => {
                  setFormData({
                    ...formData,
                    continents: formData.continents.includes(c)
                      ? formData.continents.filter(x => x !== c)
                      : [...formData.continents, c]
                  });
                }}
                className={cn(
                  "justify-start h-10",
                  formData.continents.includes(c) && "bg-blue-500/20 border border-blue-500/50"
                )}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-4">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Creating...' : 'Create Super Admin'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Legal Control Modal
export const LegalControlModal = ({ 
  open, 
  onClose, 
  type 
}: { 
  open: boolean; 
  onClose: () => void; 
  type: 'tos' | 'privacy' | 'compliance' | 'gdpr';
}) => {
  const titles = {
    tos: 'Terms of Service',
    privacy: 'Privacy Policy',
    compliance: 'Compliance Documents',
    gdpr: 'GDPR Data Requests',
  };

  const gdprRequests = [
    { id: 1, type: 'Data Export', user: 'user@example.com', status: 'pending', date: '2024-01-15' },
    { id: 2, type: 'Account Deletion', user: 'test@test.com', status: 'processing', date: '2024-01-14' },
    { id: 3, type: 'Data Rectification', user: 'john@doe.com', status: 'completed', date: '2024-01-10' },
  ];

  const handleAction = async (action: string, target?: string) => {
    await supabase.from('audit_logs').insert({
      action: `legal_${action}`,
      module: 'boss-panel',
      meta_json: { type, target }
    });
    toast.success(`Action ${action} completed`);
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      title={titles[type]} 
      icon={<Scale className="w-5 h-5 text-rose-400" />}
    >
      {type === 'gdpr' ? (
        <div className="space-y-3">
          {gdprRequests.map((req) => (
            <div key={req.id} className="p-4 rounded-lg bg-slate-800 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{req.type}</span>
                <Badge className={cn(
                  req.status === 'pending' ? "bg-amber-500/20 text-amber-400" :
                  req.status === 'processing' ? "bg-blue-500/20 text-blue-400" :
                  "bg-green-500/20 text-green-400"
                )}>
                  {req.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-400">{req.user}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-slate-500">{req.date}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleAction('approve_gdpr', req.user)}>
                    Approve
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400" onClick={() => handleAction('reject_gdpr', req.user)}>
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
            <p className="text-sm text-slate-400 mb-2">Last Updated</p>
            <p className="text-white">January 10, 2024</p>
          </div>
          <Textarea 
            placeholder={`Edit ${titles[type]} content...`}
            className="min-h-[200px]"
          />
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={() => handleAction('update', type)} 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

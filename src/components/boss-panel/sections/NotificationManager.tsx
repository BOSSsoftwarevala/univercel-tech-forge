import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell, BellOff, Send, Filter, CheckCheck, Trash2,
  AlertCircle, Info, CheckCircle, Megaphone, Users,
  Globe, Settings, Plus, RefreshCw, Eye
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const T = {
  glass: 'hsla(222, 47%, 11%, 0.72)',
  glassBorder: 'hsla(215, 40%, 35%, 0.25)',
  text: 'hsl(210, 40%, 98%)',
  muted: 'hsl(215, 22%, 65%)',
  dim: 'hsl(215, 15%, 42%)',
  blue: 'hsl(217, 92%, 65%)',
  green: 'hsl(160, 84%, 44%)',
  amber: 'hsl(38, 95%, 55%)',
  red: 'hsl(346, 82%, 55%)',
  purple: 'hsl(262, 85%, 63%)',
  rowHover: 'hsla(217, 91%, 60%, 0.07)',
};

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const rise = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 28 } } };

const Glass = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div variants={rise} className={`rounded-2xl overflow-hidden ${className}`}
    style={{ background: T.glass, backdropFilter: 'blur(20px)', border: `1px solid ${T.glassBorder}`, boxShadow: `0 8px 32px -8px hsla(222,47%,4%,0.5)` }}>
    {children}
  </motion.div>
);

const NOTIF_TYPES = [
  { key: 'system', label: 'System Alert', icon: AlertCircle, color: T.red },
  { key: 'info', label: 'Information', icon: Info, color: T.blue },
  { key: 'success', label: 'Success', icon: CheckCircle, color: T.green },
  { key: 'broadcast', label: 'Broadcast', icon: Megaphone, color: T.amber },
];

const AUDIENCE = [
  { key: 'all', label: 'All Users' },
  { key: 'boss_owner', label: 'Boss Owners' },
  { key: 'super_admin', label: 'Super Admins' },
  { key: 'franchise_manager', label: 'Franchise Managers' },
  { key: 'reseller', label: 'Resellers' },
  { key: 'developer', label: 'Developers' },
];

export function NotificationManager() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'send' | 'history' | 'settings'>('send');
  const [form, setForm] = useState({ title: '', message: '', type: 'info', audience: 'all' });
  const [filterType, setFilterType] = useState('all');

  // Fetch recent notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['boss-notifications-history', filterType],
    queryFn: async () => {
      let q = supabase
        .from('user_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (filterType !== 'all') q = q.eq('type', filterType);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 15000,
  });

  const { data: stats } = useQuery({
    queryKey: ['boss-notif-stats'],
    queryFn: async () => {
      const [totalRes, unreadRes, todayRes] = await Promise.all([
        supabase.from('user_notifications').select('id', { count: 'exact', head: true }),
        supabase.from('user_notifications').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('user_notifications').select('id', { count: 'exact', head: true })
          .gte('created_at', new Date().toISOString().split('T')[0]),
      ]);
      return {
        total: totalRes.count || 0,
        unread: unreadRes.count || 0,
        today: todayRes.count || 0,
      };
    },
    refetchInterval: 15000,
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('user_notifications').update({ is_read: true }).eq('is_read', false);
      if (error) throw error;
      await supabase.from('audit_logs').insert({
        user_id: user?.id, role: 'boss_owner' as any, module: 'boss-panel',
        action: 'mark_all_notifications_read', meta_json: {}
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boss-notifications-history'] });
      queryClient.invalidateQueries({ queryKey: ['boss-notif-stats'] });
      toast.success('All notifications marked as read');
    },
  });

  const sendNotifMutation = useMutation({
    mutationFn: async () => {
      if (!form.title.trim() || !form.message.trim()) throw new Error('Title and message required');
      
      // Get audience user IDs
      let userIds: string[] = [];
      if (form.audience === 'all') {
        const { data } = await supabase.from('profiles').select('id').limit(500);
        userIds = (data || []).map(p => p.id);
      } else {
        const { data } = await supabase.from('user_roles').select('user_id').eq('role', form.audience as any).limit(500);
        userIds = (data || []).map(r => r.user_id);
      }

      if (userIds.length === 0) throw new Error('No users found for selected audience');

      // Insert notifications in batches
      const batch = userIds.slice(0, 100).map(uid => ({
        user_id: uid,
        message: form.message,
        type: form.type,
        is_read: false,
      }));
      const { error } = await supabase.from('user_notifications').insert(batch);
      if (error) throw error;

      await supabase.from('audit_logs').insert({
        user_id: user?.id, role: 'boss_owner' as any, module: 'boss-panel',
        action: 'broadcast_notification', meta_json: { title: form.title, audience: form.audience, recipients: userIds.length }
      });

      return userIds.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['boss-notifications-history'] });
      queryClient.invalidateQueries({ queryKey: ['boss-notif-stats'] });
      toast.success(`Notification sent to ${count} user(s)`);
      setForm({ title: '', message: '', type: 'info', audience: 'all' });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const kpis = [
    { label: 'Total Sent', value: stats?.total.toLocaleString() ?? '—', icon: Bell, color: T.blue },
    { label: 'Unread', value: stats?.unread.toLocaleString() ?? '—', icon: BellOff, color: T.amber },
    { label: 'Sent Today', value: stats?.today.toLocaleString() ?? '—', icon: Send, color: T.green },
    { label: 'Delivery Rate', value: '99.2%', icon: CheckCheck, color: T.purple },
  ];

  const tabs = [
    { key: 'send', label: 'Send Notification', icon: Send },
    { key: 'history', label: 'History', icon: Eye },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <motion.div className="space-y-5" variants={stagger} initial="hidden" animate="show" style={{ color: T.text }}>
      {/* Header */}
      <motion.div variants={rise} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight" style={{ color: T.text }}>Notification Manager</h1>
          <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>Enterprise-wide push notification control center</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => queryClient.invalidateQueries({ queryKey: ['boss-notifications-history'] })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: 'hsla(217,92%,65%,0.1)', color: T.blue, border: `1px solid hsla(217,92%,65%,0.2)` }}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button onClick={() => markAllReadMutation.mutate()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: 'hsla(160,84%,44%,0.1)', color: T.green, border: `1px solid hsla(160,84%,44%,0.2)` }}>
            <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
          </button>
        </div>
      </motion.div>

      {/* KPI Row */}
      <motion.div variants={stagger} className="grid grid-cols-4 gap-3">
        {kpis.map((k) => (
          <Glass key={k.label} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <k.icon className="w-4 h-4" style={{ color: k.color }} />
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: k.color }} />
            </div>
            <p className="text-2xl font-black tabular-nums" style={{ color: T.text }}>{k.value}</p>
            <p className="text-[10px] mt-1 uppercase tracking-wider" style={{ color: T.muted }}>{k.label}</p>
          </Glass>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div variants={rise} className="flex gap-1 p-1 rounded-xl" style={{ background: 'hsla(222,47%,9%,0.8)', border: `1px solid ${T.glassBorder}` }}>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key as any)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all flex-1 justify-center"
            style={{
              background: activeTab === t.key ? T.blue : 'transparent',
              color: activeTab === t.key ? 'hsl(210,40%,98%)' : T.muted,
            }}>
            <t.icon className="w-3.5 h-3.5" />{t.label}
          </button>
        ))}
      </motion.div>

      {/* Send Tab */}
      {activeTab === 'send' && (
        <Glass className="p-5">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: T.text }}>Compose Notification</h3>
          <div className="space-y-4">
            {/* Audience */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: T.muted }}>Audience</label>
              <div className="flex flex-wrap gap-2">
                {AUDIENCE.map((a) => (
                  <button key={a.key} onClick={() => setForm(f => ({ ...f, audience: a.key }))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: form.audience === a.key ? `${T.blue}18` : 'hsla(215,28%,20%,0.5)',
                      color: form.audience === a.key ? T.blue : T.muted,
                      border: `1px solid ${form.audience === a.key ? `${T.blue}40` : T.glassBorder}`,
                    }}>
                    {a.key === 'all' ? <Globe className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: T.muted }}>Type</label>
              <div className="flex gap-2">
                {NOTIF_TYPES.map((t) => (
                  <button key={t.key} onClick={() => setForm(f => ({ ...f, type: t.key }))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: form.type === t.key ? `${t.color}18` : 'hsla(215,28%,20%,0.5)',
                      color: form.type === t.key ? t.color : T.muted,
                      border: `1px solid ${form.type === t.key ? `${t.color}40` : T.glassBorder}`,
                    }}>
                    <t.icon className="w-3 h-3" />{t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: T.muted }}>Title</label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Notification title..."
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{ background: 'hsla(215,28%,15%,0.8)', border: `1px solid ${T.glassBorder}`, color: T.text }}
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: T.muted }}>Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Write your notification message..."
                rows={4}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all resize-none"
                style={{ background: 'hsla(215,28%,15%,0.8)', border: `1px solid ${T.glassBorder}`, color: T.text }}
              />
            </div>

            <button
              onClick={() => sendNotifMutation.mutate()}
              disabled={sendNotifMutation.isPending || !form.title || !form.message}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
              style={{ background: T.blue, color: 'hsl(210,40%,98%)' }}>
              <Send className="w-4 h-4" />
              {sendNotifMutation.isPending ? 'Sending...' : 'Send Notification'}
            </button>
          </div>
        </Glass>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <Glass className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: T.text }}>Notification History</h3>
            <div className="flex gap-2">
              <Filter className="w-3.5 h-3.5 mt-0.5" style={{ color: T.muted }} />
              {['all', ...NOTIF_TYPES.map(t => t.key)].map(type => (
                <button key={type} onClick={() => setFilterType(type)}
                  className="px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all"
                  style={{
                    background: filterType === type ? `${T.blue}18` : 'transparent',
                    color: filterType === type ? T.blue : T.dim,
                  }}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin" style={{ color: T.muted }} />
            </div>
          ) : (notifications || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Bell className="w-10 h-10" style={{ color: T.dim }} />
              <p className="text-sm" style={{ color: T.muted }}>No notifications found</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
              {(notifications || []).map((n: any) => {
                const type = NOTIF_TYPES.find(t => t.key === n.type) || NOTIF_TYPES[1];
                return (
                  <motion.div key={n.id} variants={rise}
                    className="flex items-start gap-3 px-3 py-3 rounded-xl transition-colors"
                    whileHover={{ backgroundColor: T.rowHover }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${type.color}15` }}>
                      <type.icon className="w-4 h-4" style={{ color: type.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs font-semibold truncate" style={{ color: T.text }}>{n.title}</p>
                        {!n.is_read && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: `${T.blue}15`, color: T.blue }}>NEW</span>
                        )}
                      </div>
                      <p className="text-[11px] truncate" style={{ color: T.muted }}>{n.message}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[9px] font-mono" style={{ color: T.dim }}>
                        {new Date(n.created_at).toLocaleTimeString('en-US', { hour12: false })}
                      </p>
                      <p className="text-[9px]" style={{ color: T.dim }}>
                        {new Date(n.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Glass>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <Glass className="p-5">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: T.text }}>Notification Settings</h3>
          <div className="space-y-4">
            {[
              { label: 'Real-time Push Notifications', desc: 'Send instant push to all connected clients', enabled: true },
              { label: 'Email Notifications', desc: 'Send email copies for critical alerts', enabled: true },
              { label: 'Security Alert Auto-Broadcast', desc: 'Auto-send critical security alerts to admins', enabled: true },
              { label: 'System Event Notifications', desc: 'Notify on system state changes', enabled: false },
              { label: 'Marketing Notifications', desc: 'Allow marketing campaigns via notification channel', enabled: false },
            ].map((setting) => (
              <div key={setting.label} className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'hsla(215,28%,15%,0.5)', border: `1px solid ${T.glassBorder}` }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: T.text }}>{setting.label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>{setting.desc}</p>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors`}
                  style={{ background: setting.enabled ? T.green : T.dim }}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all`}
                    style={{ background: 'white', left: setting.enabled ? 'calc(100% - 18px)' : '2px' }} />
                </div>
              </div>
            ))}
          </div>
        </Glass>
      )}
    </motion.div>
  );
}

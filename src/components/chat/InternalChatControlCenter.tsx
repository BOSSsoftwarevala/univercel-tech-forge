import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bot,
  Lock,
  MessageSquare,
  Mic,
  PauseCircle,
  RefreshCcw,
  Send,
  Shield,
  UserX,
  Volume2,
  Waves,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  internalChatApi,
  type ChatEscalation,
  type ChatViolation,
  type InternalChatChannel,
  type InternalChatChannelDetail,
  type InternalChatOverview,
} from '@/lib/api/internal-chat';

function formatRelative(value: string | null) {
  if (!value) return 'No activity';
  const date = new Date(value).getTime();
  const diffMinutes = Math.max(0, Math.round((Date.now() - date) / 60000));
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.round(diffHours / 24)}d ago`;
}

function messageBubbleClass(status: string, isOwn: boolean) {
  if (status === 'blocked') return 'bg-red-500/10 border border-red-500/30 text-red-100';
  if (status === 'flagged') return 'bg-amber-500/10 border border-amber-500/30 text-amber-100';
  if (isOwn) return 'bg-cyan-500 text-slate-950';
  return 'bg-slate-800 text-slate-100';
}

export default function InternalChatControlCenter() {
  const { user } = useAuth();
  const browserLanguage = useMemo(() => navigator.language.split('-')[0].toLowerCase(), []);
  const [overview, setOverview] = useState<InternalChatOverview | null>(null);
  const [channels, setChannels] = useState<InternalChatChannel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [channelDetail, setChannelDetail] = useState<InternalChatChannelDetail | null>(null);
  const [violations, setViolations] = useState<ChatViolation[]>([]);
  const [escalations, setEscalations] = useState<ChatEscalation[]>([]);
  const [messageDraft, setMessageDraft] = useState('');
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);

  const canManage = overview?.currentUser.canManage ?? false;

  const activeChannel = useMemo(
    () => channels.find((channel) => channel.id === activeChannelId) || null,
    [activeChannelId, channels],
  );

  const loadOverview = async () => {
    const [nextOverview, nextChannels] = await Promise.all([
      internalChatApi.getOverview(),
      internalChatApi.getChannels(),
    ]);
    setOverview(nextOverview);
    setChannels(nextChannels.channels);
    if (!activeChannelId && nextChannels.channels.length > 0) {
      setActiveChannelId(nextChannels.channels[0].id);
    }
  };

  const loadChannel = async (channelId: string) => {
    const detail = await internalChatApi.getChannel(channelId);
    setChannelDetail(detail);
  };

  const loadManagerFeeds = async () => {
    if (!canManage) return;
    const [nextViolations, nextEscalations] = await Promise.all([
      internalChatApi.getViolations(),
      internalChatApi.getEscalations(),
    ]);
    setViolations(nextViolations.violations);
    setEscalations(nextEscalations.escalations);
  };

  const hydrate = async (options?: { soft?: boolean }) => {
    if (options?.soft) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      await loadOverview();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load internal chat overview');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void hydrate();
  }, []);

  useEffect(() => {
    if (!activeChannelId) return;
    void loadChannel(activeChannelId).catch((error) => {
      toast.error(error instanceof Error ? error.message : 'Unable to load channel');
    });
  }, [activeChannelId]);

  useEffect(() => {
    if (!canManage) return;
    void loadManagerFeeds().catch((error) => {
      toast.error(error instanceof Error ? error.message : 'Unable to load moderation feed');
    });
  }, [canManage]);

  useEffect(() => {
    if (!activeChannelId) return;

    const messageChannel = supabase
      .channel(`internal-chat-${activeChannelId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'internal_chat_messages', filter: `channel_id=eq.${activeChannelId}` },
        () => {
          void loadChannel(activeChannelId);
          void hydrate({ soft: true });
          if (canManage) {
            void loadManagerFeeds();
          }
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'internal_chat_escalations' },
        () => {
          if (canManage) {
            void loadManagerFeeds();
          }
        },
      )
      .subscribe();

    const heartbeat = window.setInterval(() => {
      void internalChatApi.updatePresence(activeChannelId, true);
    }, 30000);

    void internalChatApi.updatePresence(activeChannelId, true);

    return () => {
      window.clearInterval(heartbeat);
      void internalChatApi.updatePresence(activeChannelId, false);
      void supabase.removeChannel(messageChannel);
    };
  }, [activeChannelId, canManage]);

  const handleRefresh = async () => {
    await hydrate({ soft: true });
    if (activeChannelId) {
      await loadChannel(activeChannelId);
    }
    if (canManage) {
      await loadManagerFeeds();
    }
  };

  const handleSend = async () => {
    if (!activeChannelId || !messageDraft.trim()) return;
    setSending(true);

    try {
      const response = await internalChatApi.sendMessage({
        channelId: activeChannelId,
        content: messageDraft,
        messageType: isVoiceMode ? 'voice_note' : 'text',
        voiceTranscript: isVoiceMode ? messageDraft : null,
        targetLanguage: autoTranslate ? browserLanguage : null,
      });

      if (response.blocked) {
        toast.error(response.reason || 'Message blocked by secure chat policy');
      } else {
        setMessageDraft('');
        setIsVoiceMode(false);
        await loadChannel(activeChannelId);
        await hydrate({ soft: true });
        if (canManage) {
          await loadManagerFeeds();
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to send secure message');
    } finally {
      setSending(false);
    }
  };

  const handleFreezeToggle = async () => {
    if (!activeChannel || !canManage) return;
    try {
      await internalChatApi.freezeChannel(activeChannel.id, !activeChannel.isFrozen);
      await handleRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update channel state');
    }
  };

  const handleMuteUser = async (userId: string) => {
    try {
      await internalChatApi.muteUser(userId, 30);
      await handleRefresh();
      toast.success('User muted for 30 minutes');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to mute user');
    }
  };

  const handleResolveEscalation = async (escalationId: string) => {
    try {
      await internalChatApi.resolveEscalation(escalationId);
      await loadManagerFeeds();
      toast.success('Escalation resolved');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to resolve escalation');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 p-6">Loading secure internal chat...</div>;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.18),_transparent_35%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] text-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <Card className="border-slate-800 bg-slate-900/80 p-4 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-300">
                <Lock className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.25em]">Internal Chat God Mode</span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold">Masked, moderated, realtime internal communication</h1>
              <p className="mt-1 text-sm text-slate-400">
                Identity masking, AI-first routing, leak prevention, voice transcripts, and boss monitoring on one secure channel grid.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-cyan-500/30 bg-cyan-500/10 text-cyan-200">
                {overview?.currentUser.maskedIdentity || user?.id?.slice(0, 6) || 'masked'}
              </Badge>
              <Badge className="border-slate-700 bg-slate-800 text-slate-200">
                {overview?.currentUser.role || 'authenticated'}
              </Badge>
              <Button variant="outline" className="border-slate-700 bg-slate-950 text-slate-100" onClick={() => void handleRefresh()}>
                <RefreshCcw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {[
              { label: 'Channels', value: overview?.stats.channels ?? 0, icon: MessageSquare },
              { label: 'Active Users', value: overview?.stats.activeUsers ?? 0, icon: Waves },
              { label: 'Muted Users', value: overview?.stats.mutedUsers ?? 0, icon: UserX },
              { label: 'Open Escalations', value: overview?.stats.openEscalations ?? 0, icon: AlertTriangle },
              { label: 'Flagged Messages', value: overview?.stats.flaggedMessages ?? 0, icon: Shield },
              { label: 'AI Replies', value: overview?.stats.aiReplies ?? 0, icon: Bot },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs uppercase tracking-wide">{item.label}</span>
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="mt-2 text-2xl font-semibold text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 xl:grid-cols-[280px,minmax(0,1fr),320px]">
          <Card className="border-slate-800 bg-slate-900/80 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Channels</h2>
                <p className="text-xs text-slate-500">Role-scoped secure rooms</p>
              </div>
            </div>
            <div className="space-y-2">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => setActiveChannelId(channel.id)}
                  className={`w-full rounded-2xl border p-3 text-left transition ${
                    channel.id === activeChannelId
                      ? 'border-cyan-500/40 bg-cyan-500/10'
                      : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-100">{channel.name}</span>
                    <div className="flex items-center gap-1">
                      {channel.isFrozen && <PauseCircle className="h-4 w-4 text-amber-300" />}
                      {channel.unreadCount > 0 && (
                        <Badge className="border-cyan-500/30 bg-cyan-500/15 text-cyan-200">{channel.unreadCount}</Badge>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-400">{channel.description}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{channel.riskLevel.toUpperCase()}</span>
                    <span>{formatRelative(channel.lastMessageAt)}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="border-slate-800 bg-slate-900/80 p-0">
            <div className="border-b border-slate-800 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{activeChannel?.name || 'Select a channel'}</h2>
                    {activeChannel?.isFrozen && <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-200">Frozen</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{activeChannel?.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                    <span>Auto translate</span>
                    <Switch checked={autoTranslate} onCheckedChange={setAutoTranslate} />
                  </div>
                  {canManage && activeChannel && (
                    <Button variant="outline" className="border-slate-700 bg-slate-950" onClick={() => void handleFreezeToggle()}>
                      {activeChannel.isFrozen ? 'Unfreeze' : 'Freeze'} channel
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <ScrollArea className="h-[540px] px-4 py-3">
              <div className="space-y-3">
                {channelDetail?.messages.map((message) => {
                  const isOwn = message.senderId === user?.id;
                  return (
                    <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${messageBubbleClass(message.moderationStatus, isOwn)}`}>
                        <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide">
                          <span>{message.senderMaskedName}</span>
                          <span className="text-slate-400">{message.senderRole}</span>
                          <span className="text-slate-500">{formatRelative(message.createdAt)}</span>
                          {message.messageType === 'voice_note' && (
                            <Badge className="border-purple-500/30 bg-purple-500/10 text-purple-200">
                              <Volume2 className="mr-1 h-3 w-3" />
                              Voice
                            </Badge>
                          )}
                          {message.messageType === 'ai_auto_reply' && (
                            <Badge className="border-cyan-500/30 bg-cyan-500/10 text-cyan-200">
                              <Bot className="mr-1 h-3 w-3" />
                              AI
                            </Badge>
                          )}
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                        {autoTranslate && message.translatedContent && message.translatedContent !== message.content && (
                          <div className="mt-2 border-t border-white/10 pt-2 text-xs text-slate-300">
                            {message.translatedContent}
                          </div>
                        )}
                        {message.flagReason && (
                          <div className="mt-2 text-xs text-amber-200">Flag: {message.flagReason}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="border-t border-slate-800 p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <span>Screenshots discouraged • Outside contacts blocked • All actions logged</span>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1 ${isVoiceMode ? 'text-purple-300' : 'text-slate-400'}`}
                  onClick={() => setIsVoiceMode((value) => !value)}
                >
                  <Mic className="h-3.5 w-3.5" />
                  {isVoiceMode ? 'Voice transcript mode' : 'Text mode'}
                </button>
              </div>
              <div className="flex gap-2">
                <Input
                  value={messageDraft}
                  onChange={(event) => setMessageDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      void handleSend();
                    }
                  }}
                  placeholder={isVoiceMode ? 'Type voice note transcript to send securely...' : 'Type a masked secure message...'}
                  className="border-slate-700 bg-slate-950 text-slate-100"
                  disabled={!activeChannelId || activeChannel?.isFrozen || sending}
                />
                <Button onClick={() => void handleSend()} disabled={!messageDraft.trim() || !activeChannelId || sending || activeChannel?.isFrozen}>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          </Card>

          <Card className="border-slate-800 bg-slate-900/80 p-3">
            <div className="mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Monitor</h2>
              <p className="text-xs text-slate-500">Participants, policy events, and boss controls</p>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
                  <MessageSquare className="h-4 w-4 text-cyan-300" />
                  Live participants
                </div>
                <div className="space-y-2">
                  {channelDetail?.participants.slice(0, 6).map((participant) => (
                    <div key={participant.userId} className="rounded-xl border border-slate-800 bg-slate-950/60 p-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="font-medium text-slate-100">{participant.maskedIdentity}</div>
                          <div className="text-slate-500">{participant.role}</div>
                        </div>
                        <div className="text-right">
                          <Badge className={participant.isOnline ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-slate-700 bg-slate-800 text-slate-300'}>
                            {participant.isOnline ? 'Online' : 'Offline'}
                          </Badge>
                          {participant.isMuted && <div className="mt-1 text-amber-200">Muted</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {canManage && (
                <>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
                      <AlertTriangle className="h-4 w-4 text-amber-300" />
                      Open escalations
                    </div>
                    <div className="space-y-2">
                      {escalations.slice(0, 4).map((escalation) => (
                        <div key={escalation.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-2 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-slate-100">{escalation.escalationType}</span>
                            <Badge className="border-red-500/30 bg-red-500/10 text-red-200">{escalation.severity}</Badge>
                          </div>
                          <p className="mt-1 text-slate-400">{escalation.reason || escalation.aiSummary || 'Escalated for review'}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-slate-500">{formatRelative(escalation.createdAt)}</span>
                            <Button size="sm" variant="outline" className="h-7 border-slate-700 bg-slate-950 text-xs" onClick={() => void handleResolveEscalation(escalation.id)}>
                              Resolve
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
                      <Shield className="h-4 w-4 text-cyan-300" />
                      Recent violations
                    </div>
                    <div className="space-y-2">
                      {violations.slice(0, 4).map((violation) => (
                        <div key={violation.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-2 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-slate-100">{violation.violationType}</span>
                            <span className="text-slate-500">L{violation.violationLevel}</span>
                          </div>
                          <p className="mt-1 text-slate-400">{violation.description || violation.actionTaken || 'Policy enforcement event'}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-slate-500">{formatRelative(violation.createdAt)}</span>
                            {violation.userId && (
                              <Button size="sm" variant="outline" className="h-7 border-slate-700 bg-slate-950 text-xs" onClick={() => void handleMuteUser(violation.userId as string)}>
                                <UserX className="mr-1 h-3.5 w-3.5" />
                                Mute 30m
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Monitor, 
  Shield, 
  Clock, 
  Send,
  Eye,
  X,
  MousePointer,
  Circle,
  ArrowRight,
  MessageSquare,
  Users,
  History
} from 'lucide-react';
import { useRemoteAssist } from '@/hooks/useRemoteAssist';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const RemoteAssistAgent: React.FC = () => {
  const {
    session,
    isConnected,
    isPeerConnected,
    chatMessages,
    timeRemaining,
    joinSession,
    sendCursorHighlight,
    sendChatMessage,
    endSession
  } = useRemoteAssist('agent');

  const [sessionCode, setSessionCode] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [highlightTool, setHighlightTool] = useState<'click' | 'circle' | 'arrow'>('click');
  const viewerRef = useRef<HTMLDivElement>(null);

  // Fetch recent sessions
  const { data: recentSessions } = useQuery({
    queryKey: ['remote-assist-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('remote_assist_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch alerts
  const { data: alerts } = useQuery({
    queryKey: ['remote-assist-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('remote_assist_alerts')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  const handleJoinSession = async () => {
    if (sessionCode.length >= 8) {
      await joinSession(sessionCode);
      setSessionCode('');
    }
  };

  const handleSendChat = () => {
    if (chatInput.trim()) {
      sendChatMessage(chatInput.trim());
      setChatInput('');
    }
  };

  const handleViewerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!viewerRef.current) return;
    
    const rect = viewerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Scale to actual screen coordinates (assuming 1920x1080 view)
    const scaleX = 1920 / rect.width;
    const scaleY = 1080 / rect.height;
    
    sendCursorHighlight(x * scaleX, y * scaleY, highlightTool);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="session" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="session">
            <Monitor className="h-4 w-4 mr-2" />
            Active Session
          </TabsTrigger>
          <TabsTrigger value="queue">
            <Users className="h-4 w-4 mr-2" />
            Queue
            {alerts && alerts.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                {alerts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="session" className="space-y-4">
          {!session ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Join Support Session
                </CardTitle>
                <CardDescription>
                  Enter the session code provided by the user
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={sessionCode}
                    onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                    placeholder="Enter 8-character code"
                    maxLength={8}
                    className="font-mono text-lg tracking-widest"
                  />
                  <Button 
                    onClick={handleJoinSession}
                    disabled={sessionCode.length < 8}
                  >
                    Join
                  </Button>
                </div>

                <div className="p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium mb-1">Guidelines:</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• View only - you cannot control user's screen</li>
                    <li>• Use guided cursor to highlight areas</li>
                    <li>• Sessions are recorded for security</li>
                    <li>• Max duration: 30 minutes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : !session.user_consent_given ? (
            <Card className="border-yellow-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    Waiting for User Consent
                  </CardTitle>
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                    Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  User needs to approve screen sharing before you can view their screen.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => endSession('Agent cancelled')}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Session Info Bar */}
              <Card className="border-green-500/30">
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isPeerConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                        <span className="font-medium">
                          {isPeerConnected ? 'Connected' : 'Connecting...'}
                        </span>
                      </div>
                      <Badge variant="outline">
                        User Role: {session.user_role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-500 border-green-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(timeRemaining)}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => endSession('Agent ended session')}
                      >
                        <X className="h-3 w-3 mr-1" /> End
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-3 gap-4">
                {/* Screen Viewer */}
                <div className="col-span-2 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">Highlight Tool:</span>
                    <Button
                      size="sm"
                      variant={highlightTool === 'click' ? 'default' : 'outline'}
                      onClick={() => setHighlightTool('click')}
                    >
                      <MousePointer className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={highlightTool === 'circle' ? 'default' : 'outline'}
                      onClick={() => setHighlightTool('circle')}
                    >
                      <Circle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={highlightTool === 'arrow' ? 'default' : 'outline'}
                      onClick={() => setHighlightTool('arrow')}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div
                    ref={viewerRef}
                    onClick={handleViewerClick}
                    className="bg-muted rounded-lg aspect-video flex items-center justify-center cursor-crosshair border-2 border-dashed border-muted-foreground/30"
                  >
                    {isPeerConnected ? (
                      <div className="text-center">
                        <Eye className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground">
                          Screen view placeholder
                        </p>
                        <p className="text-sm text-muted-foreground/70">
                          Click anywhere to send highlight to user
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Monitor className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2 animate-pulse" />
                        <p className="text-muted-foreground">
                          Waiting for screen data...
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat Panel */}
                <Card className="h-fit">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-64 px-4">
                      {chatMessages.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No messages yet
                        </p>
                      ) : (
                        chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`mb-2 p-2 rounded-lg text-sm ${
                              msg.sender === 'agent'
                                ? 'bg-primary text-primary-foreground ml-4'
                                : msg.sender === 'user'
                                ? 'bg-muted mr-4'
                                : 'bg-yellow-500/20 text-center text-xs'
                            }`}
                          >
                            {msg.content}
                          </div>
                        ))
                      )}
                    </ScrollArea>
                    <div className="flex gap-2 p-3 border-t">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                      />
                      <Button size="icon" onClick={handleSendChat}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="queue">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {alerts && alerts.length > 0 ? (
                <div className="space-y-2">
                  {alerts.map((alert: any) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant={alert.alert_type === 'session_started' ? 'default' : 'secondary'}>
                          {alert.alert_type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(alert.created_at)}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{alert.message}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No active alerts
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {recentSessions && recentSessions.length > 0 ? (
                <div className="space-y-2">
                  {recentSessions.map((sess: any) => (
                    <div key={sess.id} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={sess.status === 'ended' ? 'secondary' : 'default'}>
                            {sess.status}
                          </Badge>
                          <span className="font-mono text-sm">{sess.session_code}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(sess.created_at)}
                        </span>
                      </div>
                      {sess.end_reason && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {sess.end_reason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No session history
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RemoteAssistAgent;

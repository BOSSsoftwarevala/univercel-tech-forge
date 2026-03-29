/**
 * CHAT & VOICE - All buttons functional
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { MessageSquare, Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Languages, Send, User, Bot } from 'lucide-react';

interface ChatMsg {
  id: number;
  sender: 'agent' | 'user' | 'ai';
  text: string;
  time: string;
}

export function AMChatVoice() {
  const [message, setMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [voiceTimer, setVoiceTimer] = useState(0);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 1, sender: 'agent', text: 'Hello! I am here to assist you.', time: '10:23 AM' },
    { id: 2, sender: 'user', text: 'Thanks. I need help with the configuration.', time: '10:24 AM' },
    { id: 3, sender: 'agent', text: 'Of course! Can you share your screen?', time: '10:24 AM' },
    { id: 4, sender: 'user', text: 'Yes, sharing now.', time: '10:25 AM' },
    { id: 5, sender: 'ai', text: '[AI Translation] User confirmed screen sharing', time: '10:25 AM' },
  ]);

  // Voice timer
  React.useEffect(() => {
    if (!isVoiceActive) return;
    const interval = setInterval(() => setVoiceTimer(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isVoiceActive]);

  const formatVoiceTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `00:${m}:${sec}`;
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMsg = { id: messages.length + 1, sender: 'agent', text: message, time };
    setMessages(prev => [...prev, newMsg]);
    setMessage('');
    
    // Auto AI translation if enabled
    if (autoTranslate) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: prev.length + 1, sender: 'ai', 
          text: `[AI Translation] Agent message delivered and translated`, 
          time 
        }]);
      }, 1000);
    }

    // Simulate user reply
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: prev.length + 1, sender: 'user', 
        text: 'Got it, thanks for the help!', 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 3000);
  };

  const handleVoiceToggle = () => {
    if (isVoiceActive) {
      setIsVoiceActive(false);
      toast.info('Voice call ended', { description: `Call duration: ${formatVoiceTime(voiceTimer)}` });
      setVoiceTimer(0);
    } else {
      setIsVoiceActive(true);
      toast.success('Voice call started', { description: 'Connected to USR-****42' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Chat & Voice</h1>
          <p className="text-muted-foreground">Communicate with session participants</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Text Chat</CardTitle>
                <Badge variant="default"><div className="w-2 h-2 rounded-full bg-green-500 mr-2" /> Connected</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 overflow-y-auto space-y-3 p-3 bg-muted/30 rounded-lg mb-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-2 ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender !== 'agent' && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'ai' ? 'bg-purple-500/20' : 'bg-muted'}`}>
                        {msg.sender === 'ai' ? <Bot className="h-4 w-4 text-purple-500" /> : <User className="h-4 w-4" />}
                      </div>
                    )}
                    <div className={`max-w-[70%] ${
                      msg.sender === 'agent' ? 'bg-primary text-primary-foreground' : 
                      msg.sender === 'ai' ? 'bg-purple-500/20 text-purple-300 italic' : 'bg-muted'
                    } rounded-lg p-3`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                    </div>
                    {msg.sender === 'agent' && (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown} className="flex-1" />
                <Button onClick={handleSendMessage} disabled={!message.trim()}><Send className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><Phone className="h-4 w-4" /> Voice Call</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-4 rounded-lg text-center ${isVoiceActive ? 'bg-green-500/10' : 'bg-muted/50'}`}>
                  {isVoiceActive ? (
                    <>
                      <Phone className="h-8 w-8 mx-auto text-green-500 mb-2 animate-pulse" />
                      <p className="text-sm font-medium">Call Active</p>
                      <p className="text-xs text-muted-foreground">{formatVoiceTime(voiceTimer)}</p>
                    </>
                  ) : (
                    <><PhoneOff className="h-8 w-8 mx-auto text-muted-foreground mb-2" /><p className="text-sm text-muted-foreground">Not in call</p></>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant={isVoiceActive ? 'destructive' : 'default'} className="flex-1" onClick={handleVoiceToggle}>
                    {isVoiceActive ? <><PhoneOff className="h-4 w-4 mr-1" /> End</> : <><Phone className="h-4 w-4 mr-1" /> Start</>}
                  </Button>
                  <Button variant="outline" onClick={() => { setIsMuted(!isMuted); toast(isMuted ? 'Unmuted' : 'Muted'); }}>
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Audio Controls</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Mic className="h-4 w-4" /><span className="text-sm">Microphone</span></div>
                  <Switch checked={!isMuted} onCheckedChange={(v) => { setIsMuted(!v); toast(v ? 'Mic on' : 'Mic off'); }} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">{isSpeakerOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}<span className="text-sm">Speaker</span></div>
                  <Switch checked={isSpeakerOn} onCheckedChange={(v) => { setIsSpeakerOn(v); toast(v ? 'Speaker on' : 'Speaker off'); }} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-500/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><Languages className="h-4 w-4 text-purple-500" /> AI Translation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto Translate</span>
                  <Switch checked={autoTranslate} onCheckedChange={(v) => { setAutoTranslate(v); toast(v ? 'Auto-translate enabled' : 'Auto-translate disabled'); }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">AI will automatically translate messages between languages</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export default AMChatVoice;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  Monitor, 
  Shield, 
  Copy, 
  Check, 
  UserCheck, 
  Clock, 
  Send,
  Eye,
  X,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { useRemoteAssist } from '@/hooks/useRemoteAssist';

const RemoteAssistUser: React.FC = () => {
  const {
    session,
    isConnected,
    isPeerConnected,
    cursorHighlight,
    chatMessages,
    timeRemaining,
    createSession,
    giveConsent,
    sendChatMessage,
    endSession
  } = useRemoteAssist('user');

  const [copied, setCopied] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const handleCopy = () => {
    if (session?.session_code) {
      navigator.clipboard.writeText(session.session_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGiveConsent = async () => {
    const success = await giveConsent();
    if (success) {
      setShowConsentDialog(false);
    }
  };

  const handleSendChat = () => {
    if (chatInput.trim()) {
      sendChatMessage(chatInput.trim());
      setChatInput('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Cursor Highlight Overlay */}
      <AnimatePresence>
        {cursorHighlight && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed pointer-events-none z-[9999]"
            style={{
              left: cursorHighlight.x - 30,
              top: cursorHighlight.y - 30,
            }}
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-16 h-16 rounded-full border-4 border-yellow-400 bg-yellow-400/30"
              />
              {cursorHighlight.message && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap">
                  {cursorHighlight.message}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Session Watermark */}
      {isConnected && session?.agent_watermark_text && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500/90 text-black text-center py-2 z-[9998] font-medium flex items-center justify-center gap-2">
          <Eye className="h-4 w-4" />
          <span>Screen is being shared with: {session.agent_watermark_text}</span>
          <Button 
            size="sm" 
            variant="destructive" 
            className="ml-4"
            onClick={() => setShowEndConfirm(true)}
          >
            <X className="h-3 w-3 mr-1" /> End Session
          </Button>
        </div>
      )}

      {!session ? (
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Monitor className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Request Remote Support</CardTitle>
            <CardDescription>
              Get help from our support team by sharing your screen securely
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <Shield className="h-5 w-5 text-green-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-700 dark:text-green-300">Your Privacy is Protected</p>
                <ul className="text-muted-foreground mt-1 space-y-1">
                  <li>• Support can only <strong>view</strong> your screen (no control)</li>
                  <li>• Password fields are automatically hidden</li>
                  <li>• You can end the session anytime</li>
                  <li>• All sessions are recorded for security</li>
                </ul>
              </div>
            </div>

            <Button onClick={createSession} className="w-full" size="lg">
              <Monitor className="h-4 w-4 mr-2" />
              Request Support Session
            </Button>
          </CardContent>
        </Card>
      ) : !session.support_agent_id ? (
        <Card className="border-yellow-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                Waiting for Support Agent
              </CardTitle>
              <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Share this code with support:</p>
              <div className="flex items-center justify-center gap-2">
                <div className="text-4xl font-mono font-bold tracking-[0.5em] bg-muted px-6 py-3 rounded-lg">
                  {session.session_code}
                </div>
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              Code expires in 5 minutes
            </div>

            <Button variant="outline" onClick={() => endSession('Cancelled by user')} className="w-full">
              Cancel Request
            </Button>
          </CardContent>
        </Card>
      ) : !session.user_consent_given ? (
        <Card className="border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Support Agent Ready
              </CardTitle>
              <Badge className="bg-primary">Agent Joined</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="font-medium">Agent ID: {session.agent_masked_id}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Ready to help you. Click below to start screen sharing.
              </p>
            </div>

            <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-700 dark:text-yellow-300">Before You Start</p>
                <p className="text-muted-foreground mt-1">
                  The agent will see your screen. A visible watermark will show who is viewing.
                  You can end the session at any time.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => endSession('Declined by user')} className="flex-1">
                Decline
              </Button>
              <Button onClick={() => setShowConsentDialog(true)} className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                Start Sharing
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 mt-16">
          {/* Session Info */}
          <Card className="border-green-500/30">
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-medium">Screen Sharing Active</span>
                </div>
                <Badge variant="outline" className="text-green-500 border-green-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(timeRemaining)}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Chat */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat with Support
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-48 px-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-2 p-2 rounded-lg text-sm ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground ml-8'
                        : msg.sender === 'agent'
                        ? 'bg-muted mr-8'
                        : 'bg-yellow-500/20 text-center text-xs'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
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
      )}

      {/* Consent Dialog */}
      <AlertDialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Consent to Screen Sharing
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>By clicking "I Agree", you consent to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Sharing your screen with the support agent</li>
                <li>Recording of this session for quality and security</li>
                <li>Agent can highlight areas on your screen (no control)</li>
              </ul>
              <p className="font-medium">
                Session will last up to 30 minutes. You can end it anytime.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleGiveConsent}>
              I Agree - Start Sharing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* End Session Confirm */}
      <AlertDialog open={showEndConfirm} onOpenChange={setShowEndConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Support Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately stop screen sharing and disconnect from the support agent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Session</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => endSession('User ended session')}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              End Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RemoteAssistUser;

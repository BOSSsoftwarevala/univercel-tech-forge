/**
 * STEP 05: VALA AI SUPPORT BOT
 * Lovable-style chat experience for Prime members
 * Post-deploy updates & issue resolution
 * AI-ONLY - ZERO HUMAN
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Image, 
  Video, 
  FileText,
  Bot,
  User,
  CheckCircle,
  Loader2,
  AlertCircle,
  Bug,
  Sparkles,
  Settings,
  Shield,
  Zap,
  Crown,
  Upload,
  X,
  Clock,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Message types
interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  status?: 'sending' | 'analyzing' | 'fixing' | 'testing' | 'deployed' | 'complete';
  issueType?: 'bug' | 'feature' | 'config' | 'performance' | 'security';
  confidence?: number;
}

interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'video' | 'file';
  url: string;
  size: string;
}

// Mock client context (auto-attached)
const clientContext = {
  userId: 'USR-A7X9K2',
  productId: 'PRD-007',
  productName: 'School Management System',
  deploymentId: 'DEP-2024-0847',
  serverId: 'SRV-AWS-IN-01',
  version: 'v2.4.1',
  isPrime: true,
  license: 'ENTERPRISE'
};

// AI response templates
const aiResponses = {
  greeting: `Hello! I'm VALA AI Support Bot. I can see you're using **${clientContext.productName}** (${clientContext.version}) deployed on server ${clientContext.serverId}.

How can I help you today? You can:
• Report a bug or issue
• Request a feature update
• Fix configuration problems
• Optimize performance

Just describe your issue or upload a screenshot/video.`,
  
  analyzing: "I'm analyzing your issue with the system logs and deployment data...",
  
  identified: (type: string) => `I've identified this as a **${type}** issue. Let me prepare the fix...`,
  
  fixing: "Applying the fix to your live system...",
  
  testing: "Running automated tests on affected workflows...",
  
  deployed: "Update deployed successfully! Your system is now running the latest fix.",
  
  complete: (version: string) => `✅ Issue resolved! Your system has been updated to **${version}**.

The fix has been applied without any downtime. You can continue using your system normally.

Is there anything else you need help with?`
};

export const AIClientSupportBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      type: 'ai',
      content: aiResponses.greeting,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate AI processing
  const processUserMessage = async (userMessage: string, userAttachments: Attachment[]) => {
    setIsProcessing(true);

    // Step 1: Analyzing
    setCurrentStatus('analyzing');
    await simulateDelay(2000);
    
    addAIMessage(aiResponses.analyzing, 'analyzing');
    await simulateDelay(2500);

    // Step 2: Identify issue type
    const issueType = detectIssueType(userMessage);
    addAIMessage(aiResponses.identified(issueType), 'fixing', issueType as any);
    await simulateDelay(2000);

    // Step 3: Fixing
    setCurrentStatus('fixing');
    addAIMessage(aiResponses.fixing, 'fixing');
    await simulateDelay(3000);

    // Step 4: Testing
    setCurrentStatus('testing');
    addAIMessage(aiResponses.testing, 'testing');
    await simulateDelay(2500);

    // Step 5: Deployed
    setCurrentStatus('deployed');
    addAIMessage(aiResponses.deployed, 'deployed');
    await simulateDelay(1500);

    // Step 6: Complete
    const newVersion = incrementVersion(clientContext.version);
    setCurrentStatus('complete');
    addAIMessage(aiResponses.complete(newVersion), 'complete');
    
    setIsProcessing(false);
    setCurrentStatus(null);
    
    toast.success('Issue resolved successfully!', {
      description: `System updated to ${newVersion}`
    });
  };

  const detectIssueType = (message: string): string => {
    const lower = message.toLowerCase();
    if (lower.includes('bug') || lower.includes('error') || lower.includes('crash') || lower.includes('not working')) {
      return 'Bug Fix';
    }
    if (lower.includes('feature') || lower.includes('add') || lower.includes('new')) {
      return 'Feature Update';
    }
    if (lower.includes('slow') || lower.includes('performance') || lower.includes('speed')) {
      return 'Performance Optimization';
    }
    if (lower.includes('config') || lower.includes('setting') || lower.includes('setup')) {
      return 'Configuration Issue';
    }
    if (lower.includes('security') || lower.includes('access') || lower.includes('permission')) {
      return 'Security Patch';
    }
    return 'Bug Fix';
  };

  const incrementVersion = (version: string): string => {
    const parts = version.replace('v', '').split('.');
    const patch = parseInt(parts[2]) + 1;
    return `v${parts[0]}.${parts[1]}.${patch}`;
  };

  const addAIMessage = (content: string, status?: string, issueType?: ChatMessage['issueType']) => {
    const newMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      type: 'ai',
      content,
      timestamp: new Date(),
      status: status as any,
      issueType
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSend = async () => {
    if (!inputMessage.trim() && attachments.length === 0) return;
    if (isProcessing) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = inputMessage;
    const messageAttachments = [...attachments];
    setInputMessage('');
    setAttachments([]);

    await processUserMessage(messageContent, messageAttachments);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const type: Attachment['type'] = file.type.startsWith('image/') 
        ? 'image' 
        : file.type.startsWith('video/') 
          ? 'video' 
          : 'file';

      const newAttachment: Attachment = {
        id: `att-${Date.now()}-${Math.random()}`,
        name: file.name,
        type,
        url: URL.createObjectURL(file),
        size: formatFileSize(file.size)
      };
      setAttachments(prev => [...prev, newAttachment]);
    });

    e.target.value = '';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'analyzing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-400" />;
      case 'fixing':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'testing':
        return <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />;
      case 'deployed':
        return <ArrowRight className="w-4 h-4 text-green-400" />;
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getIssueTypeBadge = (type?: string) => {
    if (!type) return null;
    
    const colors: Record<string, string> = {
      'Bug Fix': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Feature Update': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Performance Optimization': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Configuration Issue': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Security Patch': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };

    return (
      <Badge className={cn("text-xs border", colors[type] || '')}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            VALA AI Support Bot
          </h2>
          <p className="text-sm text-muted-foreground">
            AI-powered issue resolution • Prime Members Only
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
          <Crown className="w-3 h-3 mr-1" />
          PRIME ACTIVE
        </Badge>
      </div>

      {/* Client Context Card */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-foreground">Auto-Attached Context</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Product', value: clientContext.productName },
              { label: 'Version', value: clientContext.version },
              { label: 'Deployment', value: clientContext.deploymentId },
              { label: 'Server', value: clientContext.serverId },
              { label: 'User ID', value: clientContext.userId },
              { label: 'License', value: clientContext.license }
            ].map((item, i) => (
              <div key={i} className="bg-background/50 rounded-lg p-2 border border-border/30">
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="text-xs font-medium text-foreground truncate">{item.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Container */}
      <Card className="bg-card/50 border-border/50 h-[500px] flex flex-col">
        {/* Status Bar */}
        {currentStatus && (
          <div className="px-4 py-2 bg-primary/10 border-b border-border/50 flex items-center gap-2">
            {getStatusIcon(currentStatus)}
            <span className="text-sm text-foreground capitalize">
              {currentStatus === 'analyzing' && 'Analyzing issue with system logs...'}
              {currentStatus === 'fixing' && 'Applying fix to live system...'}
              {currentStatus === 'testing' && 'Running automated tests...'}
              {currentStatus === 'deployed' && 'Deploying update...'}
              {currentStatus === 'complete' && 'Issue resolved!'}
            </span>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "flex gap-3",
                    message.type === 'user' && "flex-row-reverse"
                  )}
                >
                  {/* Avatar */}
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.type === 'ai' 
                      ? "bg-primary/20 border border-primary/30" 
                      : "bg-blue-500/20 border border-blue-500/30"
                  )}>
                    {message.type === 'ai' 
                      ? <Bot className="w-4 h-4 text-primary" />
                      : <User className="w-4 h-4 text-blue-400" />
                    }
                  </div>

                  {/* Message Content */}
                  <div className={cn(
                    "max-w-[70%] space-y-2",
                    message.type === 'user' && "text-right"
                  )}>
                    <div className={cn(
                      "rounded-xl p-3",
                      message.type === 'ai' 
                        ? "bg-card border border-border/50" 
                        : "bg-primary/20 border border-primary/30"
                    )}>
                      {/* Issue Type Badge */}
                      {message.issueType && (
                        <div className="mb-2">
                          {getIssueTypeBadge(message.issueType as any)}
                        </div>
                      )}

                      {/* Message Text */}
                      <div className="text-sm text-foreground whitespace-pre-line">
                        {message.content.split('**').map((part, i) => 
                          i % 2 === 1 
                            ? <strong key={i} className="font-semibold">{part}</strong>
                            : part
                        )}
                      </div>

                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.attachments.map((att) => (
                            <div 
                              key={att.id}
                              className="bg-background/50 rounded-lg p-2 border border-border/30 flex items-center gap-2"
                            >
                              {att.type === 'image' && <Image className="w-4 h-4 text-green-400" />}
                              {att.type === 'video' && <Video className="w-4 h-4 text-purple-400" />}
                              {att.type === 'file' && <FileText className="w-4 h-4 text-blue-400" />}
                              <span className="text-xs text-muted-foreground">{att.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timestamp & Status */}
                    <div className={cn(
                      "flex items-center gap-2 text-xs text-muted-foreground",
                      message.type === 'user' && "justify-end"
                    )}>
                      <Clock className="w-3 h-3" />
                      {message.timestamp.toLocaleTimeString()}
                      {message.status && (
                        <>
                          <span className="text-border">•</span>
                          {getStatusIcon(message.status)}
                          <span className="capitalize">{message.status}</span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Attachment Preview */}
        {attachments.length > 0 && (
          <div className="px-4 py-2 border-t border-border/50 flex flex-wrap gap-2">
            {attachments.map((att) => (
              <div 
                key={att.id}
                className="bg-background/50 rounded-lg p-2 border border-border/30 flex items-center gap-2"
              >
                {att.type === 'image' && <Image className="w-4 h-4 text-green-400" />}
                {att.type === 'video' && <Video className="w-4 h-4 text-purple-400" />}
                {att.type === 'file' && <FileText className="w-4 h-4 text-blue-400" />}
                <span className="text-xs text-muted-foreground">{att.name}</span>
                <span className="text-xs text-muted-foreground">({att.size})</span>
                <button 
                  onClick={() => removeAttachment(att.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="text-muted-foreground hover:text-foreground"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Describe your issue or request an update..."
              disabled={isProcessing}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-background/50 border-border/50"
            />
            <Button
              onClick={handleSend}
              disabled={isProcessing || (!inputMessage.trim() && attachments.length === 0)}
              className="bg-primary hover:bg-primary/90"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            VALA AI will automatically analyze, fix, and deploy updates to your live system
          </p>
        </div>
      </Card>

      {/* What AI Can Do */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { icon: Bug, label: 'Fix Bugs', color: 'text-red-400' },
          { icon: Sparkles, label: 'Update Features', color: 'text-blue-400' },
          { icon: Zap, label: 'Optimize Performance', color: 'text-yellow-400' },
          { icon: Settings, label: 'Fix Configuration', color: 'text-purple-400' },
          { icon: Shield, label: 'Security Patches', color: 'text-green-400' }
        ].map((item, i) => (
          <Card key={i} className="bg-card/30 border-border/30">
            <CardContent className="p-3 flex items-center gap-2">
              <item.icon className={cn("w-4 h-4", item.color)} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIClientSupportBot;
